/**
 * Every D1 access in one place.
 *
 * The functions here are the only code that knows SQL exists; the route handlers work in terms of
 * users, sessions and ledger rows. That boundary is what keeps `ledger.ts` a pure module that can
 * be unit-tested against forged batches with no database at all.
 */

import { nowSeconds } from "./http";
import type { Cursor, LedgerRow, ServerState } from "./types";
import { unlockedAchievements } from "./achievements";
import {
    ARCADE_TOP_COUNT,
    TOP_COUNT,
    buildSnapshot,
    emptyArcade,
    listedAccountIds,
    type AggregateRow,
    type ArcadeData,
    type ArcadeRow,
    type Profile,
    type Snapshot,
} from "./leaderboard";
import { deriveState } from "./ledger";

export interface UserRow {
    id: number;
    username: string;
    username_key: string;
    password_hash: string;
    created_at: number;
    username_changed_at: number;
    egg_awarded_at: number;
}

export interface SessionUser {
    userId: number;
    username: string;
    createdAt: number;
    eggAwardedAt: number;
}

interface EventRecord {
    key: string;
    kind: string;
    subject: string;
    score_delta: number;
    coins_delta: number;
    multiplier: number;
    imported: number;
    occurred_at: number;
}

function toLedgerRow(record: EventRecord): LedgerRow {
    return {
        key: record.key,
        kind: record.kind as LedgerRow["kind"],
        subject: record.subject,
        scoreDelta: record.score_delta,
        coinsDelta: record.coins_delta,
        multiplier: record.multiplier === 2 ? 2 : 1,
        occurredAt: new Date(record.occurred_at * 1000).toISOString(),
        imported: record.imported === 1,
    };
}

const USER_COLUMNS = `id, username, username_key, password_hash, created_at, username_changed_at, egg_awarded_at`;

export async function findUserByKey(db: D1Database, usernameKey: string): Promise<UserRow | null> {
    return db
        .prepare(`SELECT ${USER_COLUMNS} FROM users WHERE username_key = ?1 LIMIT 1`)
        .bind(usernameKey)
        .first<UserRow>();
}

export async function findUserById(db: D1Database, userId: number): Promise<UserRow | null> {
    return db.prepare(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?1 LIMIT 1`).bind(userId).first<UserRow>();
}

/**
 * Create a user, a cursor row and a first session in one atomic batch.
 *
 * `batch()` is a genuine SQL transaction in D1 — a failure in any statement rolls the whole
 * sequence back — so a username collision cannot leave a user row without its cursor.
 */
export async function createUser(
    db: D1Database,
    username: string,
    usernameKey: string,
    passwordHash: string,
    tokenHash: string,
    expiresAt: number,
): Promise<number> {
    const inserted = await db
        .prepare(
            `INSERT INTO users (username, username_key, password_hash)
             VALUES (?1, ?2, ?3)
             ON CONFLICT(username_key) DO NOTHING
             RETURNING id`,
        )
        .bind(username, usernameKey, passwordHash)
        .first<{ id: number }>();

    // `ON CONFLICT DO NOTHING` plus a null result is a cleaner signal than catching an exception
    // and pattern-matching its message, and it cannot be confused with a different constraint.
    if (!inserted) return 0;

    await db.batch([
        db.prepare("INSERT INTO cursor (user_id) VALUES (?1)").bind(inserted.id),
        db
            .prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?1, ?2, ?3)")
            .bind(tokenHash, inserted.id, expiresAt),
    ]);

    return inserted.id;
}

export async function createSession(
    db: D1Database,
    userId: number,
    tokenHash: string,
    expiresAt: number,
): Promise<void> {
    await db
        .prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?1, ?2, ?3)")
        .bind(tokenHash, userId, expiresAt)
        .run();
}

/**
 * Resolve a bearer token to its owner.
 *
 * `expires_at > unixepoch()` lives in this one query and nowhere else, so there is no second code
 * path through which an expired token could be accepted.
 */
export async function findSessionUser(db: D1Database, tokenHash: string): Promise<SessionUser | null> {
    const row = await db
        .prepare(
            `SELECT u.id AS userId, u.username, u.created_at AS createdAt, u.egg_awarded_at AS eggAwardedAt
               FROM sessions s JOIN users u ON u.id = s.user_id
              WHERE s.token_hash = ?1 AND s.expires_at > unixepoch()
              LIMIT 1`,
        )
        .bind(tokenHash)
        .first<SessionUser>();
    return row;
}

export async function deleteSession(db: D1Database, tokenHash: string): Promise<void> {
    await db.prepare("DELETE FROM sessions WHERE token_hash = ?1").bind(tokenHash).run();
}

/** Used on a password change, so a device whose token leaked loses it. */
export async function deleteAllSessions(db: D1Database, userId: number): Promise<void> {
    await db.prepare("DELETE FROM sessions WHERE user_id = ?1").bind(userId).run();
}

/** Opportunistic sweep of dead session rows. Cheap, and keeps the index small. */
export async function pruneExpiredSessions(db: D1Database, userId: number): Promise<void> {
    await db.prepare("DELETE FROM sessions WHERE user_id = ?1 AND expires_at <= unixepoch()").bind(userId).run();
}

export async function updatePassword(db: D1Database, userId: number, passwordHash: string): Promise<void> {
    await db.prepare("UPDATE users SET password_hash = ?1 WHERE id = ?2").bind(passwordHash, userId).run();
}

export async function updateUsername(
    db: D1Database,
    userId: number,
    username: string,
    usernameKey: string,
): Promise<boolean> {
    const changed = await db
        .prepare(
            `UPDATE users SET username = ?1, username_key = ?2, username_changed_at = unixepoch()
              WHERE id = ?3
                AND NOT EXISTS (SELECT 1 FROM users WHERE username_key = ?2 AND id <> ?3)
             RETURNING id`,
        )
        .bind(username, usernameKey, userId)
        .first<{ id: number }>();
    return changed !== null;
}

export async function deleteUser(db: D1Database, userId: number): Promise<void> {
    // Cascades to sessions, events, cursor, minigame_best and level_stars. Nothing of the account survives,
    // which is also why there is no archive table: a reset simply deletes the ledger.
    await db.prepare("DELETE FROM users WHERE id = ?1").bind(userId).run();
}

export async function loadLedger(db: D1Database, userId: number): Promise<LedgerRow[]> {
    const result = await db
        .prepare(
            `SELECT key, kind, subject, score_delta, coins_delta, multiplier, imported, occurred_at
               FROM events WHERE user_id = ?1 ORDER BY seq`,
        )
        .bind(userId)
        .all<EventRecord>();
    return result.results.map(toLedgerRow);
}

export async function loadCursor(db: D1Database, userId: number): Promise<Cursor | null> {
    const row = await db
        .prepare("SELECT stage, level, updated_at FROM cursor WHERE user_id = ?1")
        .bind(userId)
        .first<{ stage: string; level: number; updated_at: number }>();
    if (!row) return null;
    return { stage: row.stage, level: row.level, at: new Date(row.updated_at * 1000).toISOString() };
}

export async function loadBests(db: D1Database, userId: number): Promise<Record<string, number>> {
    const result = await db
        .prepare("SELECT game_id, best FROM minigame_best WHERE user_id = ?1")
        .bind(userId)
        .all<{ game_id: string; best: number }>();
    const bests: Record<string, number> = {};
    for (const row of result.results) bests[row.game_id] = row.best;
    return bests;
}

export async function loadStars(db: D1Database, userId: number): Promise<Record<string, number>> {
    const result = await db
        .prepare("SELECT subject, stars FROM level_stars WHERE user_id = ?1")
        .bind(userId)
        .all<{ subject: string; stars: number }>();
    const stars: Record<string, number> = {};
    for (const row of result.results) stars[row.subject] = row.stars;
    return stars;
}

/** Read everything and fold it. One round of reads, ~4 rows read for a typical account. */
export async function loadState(db: D1Database, userId: number): Promise<ServerState> {
    const [ledger, cursor, bests, stars] = await Promise.all([
        loadLedger(db, userId),
        loadCursor(db, userId),
        loadBests(db, userId),
        loadStars(db, userId),
    ]);
    return deriveState(ledger, cursor, bests, new Date(), stars);
}

/**
 * The highest `seq` currently in use. New rows continue from here.
 *
 * `seq` exists only to preserve the order events were accepted in, for when someone asks why an
 * account has the balance it does. Uniqueness and the economy cap come from the primary key, so a
 * gap or a collision in `seq` costs nothing.
 */
export async function maxSeq(db: D1Database, userId: number): Promise<number> {
    const row = await db
        .prepare("SELECT COALESCE(MAX(seq), 0) AS maxSeq FROM events WHERE user_id = ?1")
        .bind(userId)
        .first<{ maxSeq: number }>();
    return row?.maxSeq ?? 0;
}

/** D1 allows 100 bound parameters per statement, so lists of ids go in chunks well under that. */
const ID_CHUNK = 80;

function chunks<T>(items: readonly T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
    return out;
}

const OVERALL_SQL = `WITH totals AS MATERIALIZED (
         SELECT user_id,
                SUM(score_delta)        AS score,
                SUM(kind = 'level')     AS levels,
                MAX(accepted_at)        AS last_at
           FROM events
          GROUP BY user_id
         HAVING SUM(score_delta) > 0
     ),
     visible AS (
         SELECT u.id, u.username, u.username_key, t.score, t.levels, t.last_at
           FROM totals t JOIN users u ON u.id = t.user_id
          WHERE u.leaderboard_hidden = 0
     )
     SELECT 'h' AS t, score, COUNT(*) AS n, NULL AS username, 0 AS levels, 0 AS id
       FROM visible GROUP BY score
     UNION ALL
     SELECT 't', score, 0, username, levels, id
       FROM (SELECT id, username, score, levels FROM visible
              ORDER BY score DESC, last_at ASC, username_key ASC
              LIMIT ?1)`;

/**
 * The arcade boards: the best scores per game, the all-games total, and the histograms that rank
 * any score without scanning. One statement over `minigame_best`, a table with at most one row per
 * account per game. A tie goes to whoever set the score first; results from before `achieved_at`
 * existed (0) sort after any dated one.
 */
const ARCADE_SQL = `WITH vis AS (
         SELECT b.game_id, b.user_id, b.best, b.achieved_at, u.username, u.username_key
           FROM minigame_best b JOIN users u ON u.id = b.user_id
          WHERE u.leaderboard_hidden = 0 AND b.best > 0
     ),
     ranked AS (
         SELECT *,
                RANK()       OVER (PARTITION BY game_id ORDER BY best DESC) AS rk,
                ROW_NUMBER() OVER (PARTITION BY game_id
                                   ORDER BY best DESC, achieved_at = 0, achieved_at, username_key) AS rn
           FROM vis
     ),
     sums AS (
         SELECT user_id, username, username_key, SUM(best) AS best, COUNT(*) AS games
           FROM vis GROUP BY user_id
     ),
     sums_ranked AS (
         SELECT *,
                RANK()       OVER (ORDER BY best DESC) AS rk,
                ROW_NUMBER() OVER (ORDER BY best DESC, games DESC, username_key) AS rn
           FROM sums
     )
     SELECT 'g' AS t, game_id AS k, rk, user_id, username, best, 0 AS games, rn
       FROM ranked WHERE rn <= ?1
     UNION ALL
     SELECT 's', '', rk, user_id, username, best, games, rn FROM sums_ranked WHERE rn <= ?1
     UNION ALL
     SELECT 'h', game_id, 0, 0, NULL, best, COUNT(*), 0 FROM vis GROUP BY game_id, best
     UNION ALL
     SELECT 'H', '', 0, 0, NULL, best, COUNT(*), 0 FROM sums GROUP BY best`;

interface ArcadeRecord {
    t: "g" | "s" | "h" | "H";
    k: string;
    rk: number;
    user_id: number;
    username: string | null;
    best: number;
    games: number;
    /** Position within its board, which settles ties. Not part of the public rank. */
    rn: number;
}

function toArcade(records: readonly ArcadeRecord[]): ArcadeData {
    const arcade = emptyArcade();
    const position = new Map<ArcadeRow, number>();
    for (const row of records) {
        if (row.t === "h") {
            (arcade.histograms[row.k] ??= {})[String(row.best)] = row.games;
        } else if (row.t === "H") {
            arcade.totalHistogram[String(row.best)] = row.games;
        } else if (row.username !== null) {
            const entry: ArcadeRow = { id: row.user_id, rank: row.rk, username: row.username, best: row.best };
            position.set(entry, row.rn);
            if (row.t === "s") arcade.total.push({ ...entry, games: row.games });
            else (arcade.games[row.k] ??= []).push(entry);
        }
    }
    // A UNION ALL promises no order, so each board is put back in the order the query ranked it.
    const byPosition = (a: ArcadeRow, b: ArcadeRow) => (position.get(a) ?? 0) - (position.get(b) ?? 0);
    arcade.total.sort(byPosition);
    for (const rows of Object.values(arcade.games)) rows.sort(byPosition);
    return arcade;
}

/**
 * Everything the board shows about the listed accounts, worked out from their own rows.
 *
 * Only the handful of accounts that appear on the board are read, a few thousand rows however many
 * accounts exist, which is why this can run on every refresh without touching the full-table cost.
 */
async function loadProfiles(
    db: D1Database,
    ids: readonly number[],
): Promise<{ profiles: Record<number, Profile>; rowsRead: number }> {
    const profiles: Record<number, Profile> = {};
    let rowsRead = 0;

    for (const chunk of chunks(ids, ID_CHUNK)) {
        const marks = chunk.map((_, i) => `?${i + 1}`).join(", ");
        const [users, events, stars, bests] = await db.batch<Record<string, unknown>>([
            db.prepare(`SELECT id, created_at FROM users WHERE id IN (${marks})`).bind(...chunk),
            db
                .prepare(`SELECT user_id, kind, subject, score_delta FROM events WHERE user_id IN (${marks})`)
                .bind(...chunk),
            db.prepare(`SELECT user_id, subject, stars FROM level_stars WHERE user_id IN (${marks})`).bind(...chunk),
            db.prepare(`SELECT user_id, game_id, best FROM minigame_best WHERE user_id IN (${marks})`).bind(...chunk),
        ]);
        for (const result of [users, events, stars, bests]) rowsRead += result?.meta?.rows_read ?? 0;

        const facts = new Map<
            number,
            {
                levels: Set<string>;
                purchases: Set<string>;
                minigames: number;
                egg: boolean;
                score: number;
                stars: Record<string, number>;
                bests: Record<string, number>;
            }
        >();
        for (const row of (users?.results ?? []) as { id: number; created_at: number }[]) {
            facts.set(row.id, {
                levels: new Set(),
                purchases: new Set(),
                minigames: 0,
                egg: false,
                score: 0,
                stars: {},
                bests: {},
            });
            profiles[row.id] = { since: row.created_at, score: 0, levels: 0, achievements: [], bests: {} };
        }
        for (const row of (events?.results ?? []) as {
            user_id: number;
            kind: string;
            subject: string;
            score_delta: number;
        }[]) {
            const f = facts.get(row.user_id);
            if (!f) continue;
            f.score += row.score_delta;
            if (row.kind === "level") f.levels.add(row.subject);
            else if (row.kind === "purchase") f.purchases.add(row.subject);
            else if (row.kind === "minigame") f.minigames += 1;
            else if (row.kind === "egg") f.egg = true;
        }
        for (const row of (stars?.results ?? []) as { user_id: number; subject: string; stars: number }[]) {
            const f = facts.get(row.user_id);
            if (f) f.stars[row.subject] = row.stars;
        }
        for (const row of (bests?.results ?? []) as { user_id: number; game_id: string; best: number }[]) {
            const f = facts.get(row.user_id);
            if (f) f.bests[row.game_id] = row.best;
        }

        for (const [id, f] of facts) {
            const profile = profiles[id]!;
            profile.score = f.score;
            profile.levels = f.levels.size;
            profile.bests = f.bests;
            profile.achievements = unlockedAchievements({
                levels: f.levels,
                stars: f.stars,
                minigamesCleared: f.minigames,
                purchases: f.purchases,
                eggFound: f.egg,
                score: f.score,
            });
        }
    }

    return { profiles, rowsRead };
}

/**
 * Build the leaderboard snapshot.
 *
 * The expensive part is one pass over the ledger for the overall board; the arcade boards read the
 * small `minigame_best` table; the profiles read only the accounts that made the lists. Read-only
 * throughout: the board adds no written rows to anything.
 *
 * Accounts with a score of zero are excluded, and so are accounts that opted out.
 */
export async function loadSnapshot(db: D1Database): Promise<Snapshot> {
    const [overall, arcade] = await db.batch<Record<string, unknown>>([
        db.prepare(OVERALL_SQL).bind(TOP_COUNT),
        db.prepare(ARCADE_SQL).bind(ARCADE_TOP_COUNT),
    ]);

    const buckets: { score: number; count: number }[] = [];
    const top: AggregateRow[] = [];
    for (const row of (overall?.results ?? []) as {
        t: "h" | "t";
        score: number;
        n: number;
        username: string | null;
        levels: number;
        id: number;
    }[]) {
        if (row.t === "h") buckets.push({ score: row.score, count: row.n });
        else if (row.username !== null) {
            top.push({ id: row.id, username: row.username, score: row.score, levels: row.levels });
        }
    }

    const arcadeData = toArcade((arcade?.results ?? []) as unknown as ArcadeRecord[]);
    const draft = buildSnapshot(buckets, top, new Date(), 0, { arcade: arcadeData });
    const { profiles, rowsRead } = await loadProfiles(db, listedAccountIds(draft));

    return {
        ...draft,
        profiles,
        rowsRead: (overall?.meta?.rows_read ?? 0) + (arcade?.meta?.rows_read ?? 0) + rowsRead,
    };
}

/**
 * Current name and visibility for a handful of accounts, by primary key.
 *
 * Accounts that no longer exist are simply absent from the result.
 */
export async function loadCurrentAccounts(
    db: D1Database,
    ids: readonly number[],
): Promise<Map<number, { username: string; hidden: boolean }>> {
    const out = new Map<number, { username: string; hidden: boolean }>();

    for (const chunk of chunks(ids, ID_CHUNK)) {
        const marks = chunk.map((_, i) => `?${i + 1}`).join(", ");
        const result = await db
            .prepare(`SELECT id, username, leaderboard_hidden AS hidden FROM users WHERE id IN (${marks})`)
            .bind(...chunk)
            .all<{ id: number; username: string; hidden: number }>();
        for (const row of result.results) out.set(row.id, { username: row.username, hidden: row.hidden === 1 });
    }
    return out;
}

/** One account's own total and whether it has hidden itself. Cheap: its rows only. */
export async function loadOwnStanding(
    db: D1Database,
    userId: number,
): Promise<{ score: number; levels: number; hidden: boolean }> {
    const row = await db
        .prepare(
            `SELECT COALESCE(SUM(e.score_delta), 0) AS score,
                    COALESCE(SUM(e.kind = 'level'), 0) AS levels,
                    (SELECT leaderboard_hidden FROM users WHERE id = ?1) AS hidden
               FROM events e WHERE e.user_id = ?1`,
        )
        .bind(userId)
        .first<{ score: number; levels: number; hidden: number }>();
    return { score: row?.score ?? 0, levels: row?.levels ?? 0, hidden: (row?.hidden ?? 0) === 1 };
}

/** The only write the leaderboard ever causes, and only when a player flips the switch. */
export async function setLeaderboardHidden(db: D1Database, userId: number, hidden: boolean): Promise<void> {
    await db
        .prepare("UPDATE users SET leaderboard_hidden = ?2 WHERE id = ?1 AND leaderboard_hidden <> ?2")
        .bind(userId, hidden ? 1 : 0)
        .run();
}

export interface CommitInput {
    userId: number;
    rows: LedgerRow[];
    startSeq: number;
    cursor?: Cursor;
    bests?: Record<string, number>;
    /** Already filtered to levels the catalog knows. */
    stars?: Record<string, number>;
    suspicion: number;
    markEggAwarded: boolean;
}

/**
 * Write an accepted batch atomically.
 *
 * Everything goes into one `batch()`, which D1 runs as a real transaction. That is what closes the
 * double-spend race: two devices flushing the same purchase concurrently cannot both observe an
 * affordable balance and both commit, because the second transaction's insert meets a primary-key
 * conflict and the `WHERE` guard on the balance is re-evaluated against committed state.
 *
 * The affordability guard is repeated here in SQL even though `foldEvents` already checked it in
 * JS. The JS check produces the good error message; this one is the guarantee. A purchase row is
 * inserted only if the balance *as committed* still covers it.
 */
export async function commitBatch(db: D1Database, input: CommitInput): Promise<void> {
    const statements: D1PreparedStatement[] = [];
    let seq = input.startSeq;

    for (const row of input.rows) {
        seq += 1;
        const occurredAt = Math.floor(Date.parse(row.occurredAt) / 1000);

        if (row.coinsDelta < 0) {
            statements.push(
                db
                    .prepare(
                        `INSERT INTO events (user_id, key, seq, kind, subject, score_delta, coins_delta,
                                             multiplier, imported, occurred_at)
                         SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10
                          WHERE (SELECT COALESCE(SUM(coins_delta), 0) FROM events WHERE user_id = ?1) + ?7 >= 0
                         ON CONFLICT(user_id, key) DO NOTHING`,
                    )
                    .bind(
                        input.userId,
                        row.key,
                        seq,
                        row.kind,
                        row.subject,
                        row.scoreDelta,
                        row.coinsDelta,
                        row.multiplier,
                        row.imported ? 1 : 0,
                        occurredAt,
                    ),
            );
        } else {
            statements.push(
                db
                    .prepare(
                        `INSERT INTO events (user_id, key, seq, kind, subject, score_delta, coins_delta,
                                             multiplier, imported, occurred_at)
                         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
                         ON CONFLICT(user_id, key) DO NOTHING`,
                    )
                    .bind(
                        input.userId,
                        row.key,
                        seq,
                        row.kind,
                        row.subject,
                        row.scoreDelta,
                        row.coinsDelta,
                        row.multiplier,
                        row.imported ? 1 : 0,
                        occurredAt,
                    ),
            );
        }
    }

    if (input.cursor) {
        statements.push(
            db
                .prepare(
                    `INSERT INTO cursor (user_id, stage, level, updated_at)
                     VALUES (?1, ?2, ?3, unixepoch())
                     ON CONFLICT(user_id) DO UPDATE SET stage = ?2, level = ?3, updated_at = unixepoch()`,
                )
                .bind(input.userId, input.cursor.stage, input.cursor.level),
        );
    }

    for (const [gameId, best] of Object.entries(input.bests ?? {})) {
        statements.push(
            db
                .prepare(
                    `INSERT INTO minigame_best (user_id, game_id, best, achieved_at) VALUES (?1, ?2, ?3, unixepoch())
                     ON CONFLICT(user_id, game_id) DO UPDATE
                        SET best = excluded.best, achieved_at = unixepoch()
                      WHERE excluded.best > minigame_best.best`,
                )
                .bind(input.userId, gameId, best),
        );
    }

    // The WHERE is what keeps this free when nothing improved: an upsert whose update is filtered
    // out writes no row, so a client that resends results it already has costs reads, not writes.
    for (const [subject, stars] of Object.entries(input.stars ?? {})) {
        statements.push(
            db
                .prepare(
                    `INSERT INTO level_stars (user_id, subject, stars) VALUES (?1, ?2, ?3)
                     ON CONFLICT(user_id, subject) DO UPDATE SET stars = excluded.stars
                      WHERE excluded.stars > level_stars.stars`,
                )
                .bind(input.userId, subject, stars),
        );
    }

    if (input.markEggAwarded) {
        statements.push(
            db
                .prepare("UPDATE users SET egg_awarded_at = unixepoch() WHERE id = ?1 AND egg_awarded_at = 0")
                .bind(input.userId),
        );
    }

    if (input.suspicion > 0) {
        statements.push(
            db.prepare("UPDATE users SET suspicion = suspicion + ?2 WHERE id = ?1").bind(input.userId, input.suspicion),
        );
    }

    if (statements.length > 0) await db.batch(statements);
}

/** Clear the cloud save so the game can be replayed. `egg_awarded_at` deliberately survives. */
export async function resetProgress(db: D1Database, userId: number): Promise<void> {
    await db.batch([
        db.prepare("DELETE FROM events WHERE user_id = ?1").bind(userId),
        db.prepare("DELETE FROM minigame_best WHERE user_id = ?1").bind(userId),
        db.prepare("DELETE FROM level_stars WHERE user_id = ?1").bind(userId),
        db
            .prepare("UPDATE cursor SET stage = 'intro', level = 1, updated_at = unixepoch() WHERE user_id = ?1")
            .bind(userId),
        db.prepare("UPDATE users SET reset_count = reset_count + 1 WHERE id = ?1").bind(userId),
    ]);
}

export { nowSeconds };
