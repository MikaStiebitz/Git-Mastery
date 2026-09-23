/**
 * Every D1 access in one place.
 *
 * The functions here are the only code that knows SQL exists; the route handlers work in terms of
 * users, sessions and ledger rows. That boundary is what keeps `ledger.ts` a pure module that can
 * be unit-tested against forged batches with no database at all.
 */

import { nowSeconds } from "./http";
import type { Cursor, LedgerRow, ServerState } from "./types";
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
    // Cascades to sessions, events, cursor and minigame_best. Nothing of the account survives,
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

/** Read everything and fold it. One round of reads, ~4 rows read for a typical account. */
export async function loadState(db: D1Database, userId: number): Promise<ServerState> {
    const [ledger, cursor, bests] = await Promise.all([
        loadLedger(db, userId),
        loadCursor(db, userId),
        loadBests(db, userId),
    ]);
    return deriveState(ledger, cursor, bests, new Date());
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

export interface CommitInput {
    userId: number;
    rows: LedgerRow[];
    startSeq: number;
    cursor?: Cursor;
    bests?: Record<string, number>;
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
                    `INSERT INTO minigame_best (user_id, game_id, best) VALUES (?1, ?2, ?3)
                     ON CONFLICT(user_id, game_id) DO UPDATE SET best = MAX(best, excluded.best)`,
                )
                .bind(input.userId, gameId, best),
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
        db
            .prepare("UPDATE cursor SET stage = 'intro', level = 1, updated_at = unixepoch() WHERE user_id = ?1")
            .bind(userId),
        db.prepare("UPDATE users SET reset_count = reset_count + 1 WHERE id = ?1").bind(userId),
    ]);
}

export { nowSeconds };
