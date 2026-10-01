/**
 * The public leaderboard, built without writing a single row.
 *
 * Nothing is stored for it. The board is an aggregate over the ledger that already exists —
 * `SUM(score_delta)` per account — computed on read, held in memory for a while, and served from
 * there. So a level cleared costs exactly the writes it always cost, and an unwatched board costs
 * nothing at all.
 *
 * What it is NOT is refereed. The Worker cannot replay a level (it has no Git simulator), so a
 * level event is a claim. The ledger design caps what a forger can reach — one score per level, a
 * finite set of levels — which means cheating cannot push anyone past the ceiling of an honest
 * full clear, only up to it. Ties at the ceiling are ordered by who got there first. That is the
 * honest ceiling of this design, and the README says so rather than implying a guarantee.
 */

import type { Env } from "./types";

/** How many accounts the public list shows. */
export const TOP_COUNT = 50;

const DEFAULT_TTL_SECONDS = 3600;
const DEFAULT_DAILY_READ_BUDGET = 1_000_000;

export interface LeaderboardEntry {
    /** 1 + the number of visible accounts with a strictly higher score. Ties share a rank. */
    rank: number;
    username: string;
    score: number;
    /** Levels cleared. */
    levels: number;
}

/** One visible account, as the aggregate query returns it. */
export interface AggregateRow {
    /** Internal account id. Never leaves the Worker: it is only used to re-check the row on read. */
    id: number;
    username: string;
    score: number;
    levels: number;
}

export interface Snapshot {
    top: (LeaderboardEntry & { id: number })[];
    /** Visible accounts per score. A histogram, so the rank of any score is a sum, not a scan. */
    histogram: Record<string, number>;
    total: number;
    generatedAt: string;
    /** Rows D1 reported reading to build it. Drives the refresh interval. */
    rowsRead: number;
}

/** Rank of a score: one more than the number of visible accounts strictly ahead of it. */
export function rankOf(score: number, histogram: Readonly<Record<string, number>>): number {
    let ahead = 0;
    for (const [value, count] of Object.entries(histogram)) {
        if (Number(value) > score) ahead += count;
    }
    return ahead + 1;
}

/**
 * Assemble a snapshot from the two shapes the query returns: histogram buckets, and the top rows
 * already ordered. Pure, so the ranking rules are tested without a database.
 */
export function buildSnapshot(
    buckets: readonly { score: number; count: number }[],
    topRows: readonly AggregateRow[],
    generatedAt: Date,
    rowsRead: number,
): Snapshot {
    const histogram: Record<string, number> = Object.create(null) as Record<string, number>;
    let total = 0;
    for (const { score, count } of buckets) {
        histogram[String(score)] = (histogram[String(score)] ?? 0) + count;
        total += count;
    }

    const top = topRows.slice(0, TOP_COUNT).map(row => ({
        id: row.id,
        rank: rankOf(row.score, histogram),
        username: row.username,
        score: row.score,
        levels: row.levels,
    }));

    return { top, histogram, total, generatedAt: generatedAt.toISOString(), rowsRead };
}

/**
 * How long a snapshot may be reused.
 *
 * The aggregate reads every ledger row once, so its cost grows with the player base and D1's free
 * read quota is a hard stop that would take logins down with it. The interval therefore never
 * drops below what keeps one isolate under its share of the daily budget, whatever the configured
 * value says: as the table grows the board gets staler instead of the site getting slower.
 */
export function ttlSeconds(env: Env, rowsRead: number): number {
    const configured = Number.parseInt(env.LEADERBOARD_TTL_SECONDS ?? "", 10);
    const base = Number.isFinite(configured) && configured >= 60 ? configured : DEFAULT_TTL_SECONDS;

    const budget = Number.parseInt(env.LEADERBOARD_DAILY_READ_BUDGET ?? "", 10);
    const perDay = Number.isFinite(budget) && budget > 0 ? budget : DEFAULT_DAILY_READ_BUDGET;

    return Math.max(base, Math.ceil((Math.max(0, rowsRead) * 86_400) / perDay));
}

/**
 * The public list, re-checked against who is on the board right now.
 *
 * The snapshot can be an hour old, and an hour is far too long for "I hid myself" or "I renamed
 * myself" to take effect. So each response re-reads the (at most fifty) accounts it is about to
 * show by primary key and drops whoever has since hidden or deleted their account, and shows
 * names as they are now. Fifty keyed reads per request is nothing next to the scan the cache saves,
 * and it writes nothing.
 *
 * Ranks are left as the snapshot computed them, so a hidden account leaves a gap until the next
 * refresh rather than everyone below shifting up a place under a reader's feet.
 */
export function applyCurrentState(
    top: Snapshot["top"],
    current: ReadonlyMap<number, { username: string; hidden: boolean }>,
): LeaderboardEntry[] {
    const out: LeaderboardEntry[] = [];
    for (const entry of top) {
        const now = current.get(entry.id);
        if (!now || now.hidden) continue;
        out.push({ rank: entry.rank, username: now.username, score: entry.score, levels: entry.levels });
    }
    return out;
}

interface Cached {
    snapshot: Snapshot;
    expiresAt: number;
}

let cached: Cached | null = null;
let refreshing: Promise<Snapshot> | null = null;

/** Test hook: forget the in-memory snapshot. */
export function resetLeaderboardCache(): void {
    cached = null;
    refreshing = null;
}

/**
 * The current snapshot, refreshed at most once per interval per isolate.
 *
 * Concurrent callers during a refresh share one query. If a refresh fails — quota exhausted, say —
 * the previous snapshot is served instead of an error: a stale board is a fine answer and a failed
 * one would add a second query to a database that is already struggling.
 */
export async function getSnapshot(
    env: Env,
    now: number,
    load: () => Promise<Snapshot>,
): Promise<{ snapshot: Snapshot; maxAge: number }> {
    if (cached && now < cached.expiresAt) {
        return { snapshot: cached.snapshot, maxAge: Math.max(0, Math.floor((cached.expiresAt - now) / 1000)) };
    }

    refreshing ??= load().finally(() => {
        refreshing = null;
    });

    try {
        const snapshot = await refreshing;
        const expiresAt = now + ttlSeconds(env, snapshot.rowsRead) * 1000;
        cached = { snapshot, expiresAt };
        return { snapshot, maxAge: Math.floor((expiresAt - now) / 1000) };
    } catch (error) {
        if (cached) return { snapshot: cached.snapshot, maxAge: 60 };
        throw error;
    }
}
