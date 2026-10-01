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

import { minigameScoreCeiling, isKnownMinigame } from "./catalog";
import type { Env } from "./types";

/** How many accounts the public overall list shows. */
export const TOP_COUNT = 50;

/** How many accounts each arcade board shows. */
export const ARCADE_TOP_COUNT = 10;

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

/** One row of an arcade board. `games` is only set on the all-games total. */
export interface ArcadeRow {
    id: number;
    rank: number;
    username: string;
    best: number;
    games?: number;
}

export interface ArcadeData {
    /** The best scores per game, best first. */
    games: Record<string, ArcadeRow[]>;
    /** Accounts ranked by the sum of their bests across every game. */
    total: ArcadeRow[];
    /** Visible accounts per best score, per game. Ranks any score without scanning. */
    histograms: Record<string, Record<string, number>>;
    totalHistogram: Record<string, number>;
}

/** What the board can say about one player. Internal until `presentSnapshot` strips the id. */
export interface Profile {
    /** Account creation, unix seconds. */
    since: number;
    score: number;
    levels: number;
    achievements: string[];
    bests: Record<string, number>;
}

export interface Snapshot {
    top: (LeaderboardEntry & { id: number })[];
    arcade: ArcadeData;
    /** Keyed by account id, for everyone who appears anywhere on the board. */
    profiles: Record<number, Profile>;
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
export function emptyArcade(): ArcadeData {
    return { games: {}, total: [], histograms: {}, totalHistogram: {} };
}

export function buildSnapshot(
    buckets: readonly { score: number; count: number }[],
    topRows: readonly AggregateRow[],
    generatedAt: Date,
    rowsRead: number,
    extras: { arcade?: ArcadeData; profiles?: Record<number, Profile> } = {},
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

    return {
        top,
        arcade: extras.arcade ?? emptyArcade(),
        profiles: extras.profiles ?? {},
        histogram,
        total,
        generatedAt: generatedAt.toISOString(),
        rowsRead,
    };
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

/** Every account id the snapshot is about to show, so its current state can be fetched together. */
export function listedAccountIds(snapshot: Snapshot): number[] {
    const ids = new Set<number>();
    for (const entry of snapshot.top) ids.add(entry.id);
    for (const rows of Object.values(snapshot.arcade.games)) for (const row of rows) ids.add(row.id);
    for (const row of snapshot.arcade.total) ids.add(row.id);
    return [...ids];
}

export interface PublicEntry extends LeaderboardEntry {
    /** Ids of unlocked achievements. */
    achievements: string[];
}

export interface PublicArcadeEntry {
    rank: number;
    username: string;
    best: number;
    games?: number;
}

export interface PublicProfile {
    since: string;
    score: number;
    levels: number;
    achievements: string[];
    bests: Record<string, number>;
}

export interface PublicBoard {
    top: PublicEntry[];
    arcade: { games: Record<string, PublicArcadeEntry[]>; total: PublicArcadeEntry[] };
    /** Keyed by username as it is now. */
    profiles: Record<string, PublicProfile>;
}

/**
 * The snapshot, re-checked against who is on the board right now.
 *
 * The snapshot can be an hour old, and an hour is far too long for "I hid myself" or "I renamed
 * myself" to take effect. So each response re-reads the (at most a hundred) accounts it is about
 * to show by primary key, drops whoever has since hidden or deleted their account, and shows names
 * as they are now. That is a few keyed reads per request against the scan the cache saves, and it
 * writes nothing.
 *
 * Ranks are left as the snapshot computed them, so a hidden account leaves a gap until the next
 * refresh rather than everyone below shifting up a place under a reader's feet. The internal
 * account id never leaves this function.
 */
export function presentSnapshot(
    snapshot: Snapshot,
    current: ReadonlyMap<number, { username: string; hidden: boolean }>,
): PublicBoard {
    const live = (id: number) => {
        const now = current.get(id);
        return now && !now.hidden ? now : null;
    };

    const profiles: Record<string, PublicProfile> = Object.create(null) as Record<string, PublicProfile>;
    const profileFor = (id: number, username: string) => {
        const profile = snapshot.profiles[id];
        if (!profile || username in profiles) return;
        profiles[username] = {
            since: new Date(profile.since * 1000).toISOString(),
            score: profile.score,
            levels: profile.levels,
            achievements: profile.achievements,
            bests: profile.bests,
        };
    };

    const top: PublicEntry[] = [];
    for (const entry of snapshot.top) {
        const now = live(entry.id);
        if (!now) continue;
        top.push({
            rank: entry.rank,
            username: now.username,
            score: entry.score,
            levels: entry.levels,
            achievements: snapshot.profiles[entry.id]?.achievements ?? [],
        });
        profileFor(entry.id, now.username);
    }

    const present = (rows: readonly ArcadeRow[]): PublicArcadeEntry[] => {
        const out: PublicArcadeEntry[] = [];
        for (const row of rows) {
            const now = live(row.id);
            if (!now) continue;
            out.push({
                rank: row.rank,
                username: now.username,
                best: row.best,
                ...(row.games === undefined ? {} : { games: row.games }),
            });
            profileFor(row.id, now.username);
        }
        return out;
    };

    const games: Record<string, PublicArcadeEntry[]> = Object.create(null) as Record<string, PublicArcadeEntry[]>;
    for (const [gameId, rows] of Object.entries(snapshot.arcade.games)) games[gameId] = present(rows);

    return { top, arcade: { games, total: present(snapshot.arcade.total) }, profiles };
}

/**
 * Make a `bests` map something the arcade boards can be built on.
 *
 * Unknown game ids are dropped, which also closes a quieter hole: the old validation accepted any
 * well-formed id, so an account could create rows under invented game names. Values are clamped to
 * the highest score the game can produce. A clamp rather than a refusal on purpose — a real run on
 * a game whose ceiling has not been updated yet should still save, at the ceiling.
 */
export function sanitizeBests(bests: Readonly<Record<string, number>> | undefined): Record<string, number> | undefined {
    if (!bests) return undefined;
    const out: Record<string, number> = {};
    for (const [gameId, value] of Object.entries(bests)) {
        if (!isKnownMinigame(gameId)) continue;
        const ceiling = minigameScoreCeiling(gameId) ?? 0;
        out[gameId] = Math.min(value, ceiling);
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
