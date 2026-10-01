import { afterEach, describe, expect, it, vi } from "vitest";

import { loadCurrentAccounts, loadOwnStanding, loadSnapshot, setLeaderboardHidden } from "../src/db";
import {
    TOP_COUNT,
    applyCurrentState,
    buildSnapshot,
    getSnapshot,
    rankOf,
    resetLeaderboardCache,
    ttlSeconds,
    type Snapshot,
} from "../src/leaderboard";
import type { Env } from "../src/types";

/**
 * The leaderboard's promises: it shows only what the ledger already says, ranks ties fairly,
 * hides whoever opted out, and — above all — never writes and never scans more than it must.
 */

const env = (overrides: Partial<Env> = {}) => ({ ...overrides }) as Env;

describe("ranking", () => {
    const histogram = { "100": 2, "50": 3, "10": 1 };

    it("ranks a score one above everyone strictly ahead of it", () => {
        expect(rankOf(100, histogram)).toBe(1);
        expect(rankOf(50, histogram)).toBe(3);
        expect(rankOf(10, histogram)).toBe(6);
    });

    it("gives tied accounts the same rank, and skips the ranks they share", () => {
        const snapshot = buildSnapshot(
            [
                { score: 100, count: 2 },
                { score: 50, count: 1 },
            ],
            [
                { id: 1, username: "a", score: 100, levels: 10 },
                { id: 2, username: "b", score: 100, levels: 10 },
                { id: 3, username: "c", score: 50, levels: 5 },
            ],
            new Date(0),
            0,
        );
        expect(snapshot.top.map(entry => entry.rank)).toEqual([1, 1, 3]);
        expect(snapshot.total).toBe(3);
    });

    it("ranks a score nobody has yet at the position it would take", () => {
        expect(rankOf(75, histogram)).toBe(3);
        expect(rankOf(1000, histogram)).toBe(1);
        expect(rankOf(0, {})).toBe(1);
    });

    it("never lists more than the top count, even if handed more", () => {
        const rows = Array.from({ length: TOP_COUNT + 10 }, (_, i) => ({
            id: i + 1,
            username: `u${i}`,
            score: 1000 - i,
            levels: 1,
        }));
        const snapshot = buildSnapshot([], rows, new Date(0), 0);
        expect(snapshot.top).toHaveLength(TOP_COUNT);
    });

    it("keeps a hostile score key from reaching Object.prototype", () => {
        const snapshot = buildSnapshot([{ score: 5, count: 1 }], [], new Date(0), 0);
        expect(Object.getPrototypeOf(snapshot.histogram)).toBeNull();
    });
});

describe("the list is re-checked against who is on the board now", () => {
    const top = [
        { id: 1, rank: 1, username: "old-name", score: 90, levels: 9 },
        { id: 2, rank: 2, username: "hider", score: 80, levels: 8 },
        { id: 3, rank: 3, username: "gone", score: 70, levels: 7 },
        { id: 4, rank: 4, username: "stays", score: 60, levels: 6 },
    ];

    it("drops accounts that hid or were deleted since the snapshot, and shows current names", () => {
        const current = new Map([
            [1, { username: "new-name", hidden: false }],
            [2, { username: "hider", hidden: true }],
            [4, { username: "stays", hidden: false }],
        ]);
        expect(applyCurrentState(top, current).map(e => [e.rank, e.username])).toEqual([
            [1, "new-name"],
            [4, "stays"],
        ]);
    });

    it("never leaks the internal account id", () => {
        const current = new Map([[1, { username: "x", hidden: false }]]);
        expect(Object.keys(applyCurrentState(top, current)[0]!)).toEqual(["rank", "username", "score", "levels"]);
    });
});

describe("refresh interval", () => {
    it("defaults to an hour", () => {
        expect(ttlSeconds(env(), 0)).toBe(3600);
    });

    it("honours a longer configured interval and refuses a ridiculously short one", () => {
        expect(ttlSeconds(env({ LEADERBOARD_TTL_SECONDS: "7200" }), 0)).toBe(7200);
        expect(ttlSeconds(env({ LEADERBOARD_TTL_SECONDS: "1" }), 0)).toBe(3600);
        expect(ttlSeconds(env({ LEADERBOARD_TTL_SECONDS: "junk" }), 0)).toBe(3600);
    });

    it("stretches as the ledger grows, so the board gets staler instead of the site getting slower", () => {
        // 10M rows per refresh against a 1M/day budget is one refresh per 8.6 days' worth of budget:
        // 10 refreshes would burn the day, so the interval has to be 86400 * 10 seconds long.
        const huge = ttlSeconds(env(), 10_000_000);
        expect(huge).toBeGreaterThan(3600);
        expect(huge).toBe(864_000);
        expect(ttlSeconds(env(), 100)).toBe(3600);
    });
});

describe("snapshot cache", () => {
    afterEach(() => resetLeaderboardCache());

    const snapshot = (n: number): Snapshot => ({
        top: [],
        histogram: {},
        total: n,
        generatedAt: new Date(0).toISOString(),
        rowsRead: 10,
    });

    it("queries once and reuses the answer until it expires", async () => {
        const load = vi.fn(async () => snapshot(1));
        await getSnapshot(env(), 0, load);
        await getSnapshot(env(), 1_000, load);
        await getSnapshot(env(), 3_599_000, load);
        expect(load).toHaveBeenCalledTimes(1);

        await getSnapshot(env(), 3_601_000, load);
        expect(load).toHaveBeenCalledTimes(2);
    });

    it("shares one query between callers that arrive during a refresh", async () => {
        let release!: (value: Snapshot) => void;
        const load = vi.fn(() => new Promise<Snapshot>(resolve => (release = resolve)));

        const calls = Promise.all([
            getSnapshot(env(), 0, load),
            getSnapshot(env(), 0, load),
            getSnapshot(env(), 0, load),
        ]);
        release(snapshot(7));
        const results = await calls;

        expect(load).toHaveBeenCalledTimes(1);
        expect(results.every(r => r.snapshot.total === 7)).toBe(true);
    });

    it("serves the stale board when a refresh fails, rather than adding an error", async () => {
        await getSnapshot(env(), 0, async () => snapshot(3));
        const failing = vi.fn(async (): Promise<Snapshot> => {
            throw new Error("D1_ERROR: quota");
        });
        const result = await getSnapshot(env(), 4_000_000, failing);
        expect(result.snapshot.total).toBe(3);
    });

    it("fails when there is nothing stale to fall back on", async () => {
        await expect(
            getSnapshot(env(), 0, async () => {
                throw new Error("down");
            }),
        ).rejects.toThrow("down");
    });
});

// ---------------------------------------------------------------------------------------------
// The real SQL, against the real migrations.
//
// Runs on Node's built-in SQLite, which exists from Node 22. CI is on Node 20, where this block
// skips itself; it still runs for anyone developing locally on a current Node, which is where a
// broken query would be written. The pure tests above run everywhere.
// ---------------------------------------------------------------------------------------------

interface SqliteStatement {
    all(...params: unknown[]): unknown[];
    get(...params: unknown[]): unknown;
    run(...params: unknown[]): unknown;
}
interface SqliteDb {
    exec(sql: string): void;
    prepare(sql: string): SqliteStatement;
}

async function openDatabase(): Promise<SqliteDb | null> {
    try {
        const sqliteSpecifier = "node:sqlite";
        const fsSpecifier = "node:fs";
        const sqlite = (await import(/* @vite-ignore */ sqliteSpecifier)) as {
            DatabaseSync: new (path: string) => SqliteDb;
        };
        const fs = (await import(/* @vite-ignore */ fsSpecifier)) as {
            readFileSync: (url: URL, enc: string) => string;
        };

        const database = new sqlite.DatabaseSync(":memory:");
        database.exec("PRAGMA foreign_keys = ON");
        for (const file of ["0001_init.sql", "0002_stars_and_leaderboard.sql"]) {
            database.exec(
                fs.readFileSync(
                    new URL(`../migrations/${file}`, (import.meta as unknown as { url: string }).url),
                    "utf8",
                ),
            );
        }
        return database;
    } catch {
        return null;
    }
}

/** Just enough of D1's surface for the three queries under test. */
function asD1(database: SqliteDb): D1Database {
    const statement = (sql: string, params: unknown[] = []) => ({
        bind: (...next: unknown[]) => statement(sql, next),
        all: async () => ({ results: database.prepare(sql).all(...params), meta: { rows_read: 0 } }),
        first: async () => database.prepare(sql).get(...params) ?? null,
        run: async () => database.prepare(sql).run(...params),
    });
    return { prepare: (sql: string) => statement(sql) } as unknown as D1Database;
}

const sqlite = await openDatabase();

describe.skipIf(sqlite === null)("leaderboard SQL", () => {
    function seed() {
        const database = sqlite!;
        database.exec("DELETE FROM events; DELETE FROM users;");

        const addUser = (id: number, name: string, hidden = 0) =>
            database
                .prepare(
                    "INSERT INTO users (id, username, username_key, password_hash, leaderboard_hidden) VALUES (?, ?, ?, 'x', ?)",
                )
                .run(id, name, name.toLowerCase(), hidden);
        const addEvent = (user: number, key: string, kind: string, score: number, accepted: number) =>
            database
                .prepare(
                    "INSERT INTO events (user_id, key, seq, kind, subject, score_delta, coins_delta, occurred_at, accepted_at) VALUES (?, ?, 1, ?, ?, ?, 0, 1, ?)",
                )
                .run(user, key, kind, key, score, accepted);

        addUser(1, "Ada");
        addUser(2, "Linus");
        addUser(3, "Grace");
        addUser(4, "Ghost", 1); // opted out
        addUser(5, "Newbie"); // never scored

        // Ada and Linus tie at 30; Ada got there first.
        for (const [i, at] of [100, 110, 120].entries()) addEvent(1, `level:a:${i}`, "level", 10, at);
        for (const [i, at] of [200, 210, 220].entries()) addEvent(2, `level:b:${i}`, "level", 10, at);
        addEvent(3, "level:c:0", "level", 10, 50);
        addEvent(3, "egg:gitgud", "egg", 50, 60);
        // The hidden account has the highest score of all.
        for (const i of [0, 1, 2, 3, 4]) addEvent(4, `level:d:${i}`, "level", 10, 10 + i);
        // Purchases carry no score and must not count as levels.
        addEvent(2, "purchase:x", "purchase", 0, 230);
        // An account that only spent: total score zero, so excluded.
        addEvent(5, "purchase:y", "purchase", 0, 5);
    }

    it("lists visible accounts by score, earliest finisher first among ties", async () => {
        seed();
        const snapshot = await loadSnapshot(asD1(sqlite!));

        expect(snapshot.top.map(e => e.username)).toEqual(["Grace", "Ada", "Linus"]);
        expect(snapshot.top.map(e => e.rank)).toEqual([1, 2, 2]);
    });

    it("counts levels, not every kind of event", async () => {
        seed();
        const snapshot = await loadSnapshot(asD1(sqlite!));
        const grace = snapshot.top.find(e => e.username === "Grace");
        const linus = snapshot.top.find(e => e.username === "Linus");

        expect(grace).toMatchObject({ score: 60, levels: 1 });
        expect(linus).toMatchObject({ score: 30, levels: 3 });
    });

    it("leaves out accounts that opted out and accounts with no score", async () => {
        seed();
        const snapshot = await loadSnapshot(asD1(sqlite!));

        expect(snapshot.top.map(e => e.username)).not.toContain("Ghost");
        expect(snapshot.top.map(e => e.username)).not.toContain("Newbie");
        expect(snapshot.total).toBe(3);
        expect(snapshot.histogram).toEqual({ "60": 1, "30": 2 });
    });

    it("reports an account's own standing, hidden or not", async () => {
        seed();
        const db = asD1(sqlite!);

        expect(await loadOwnStanding(db, 1)).toEqual({ score: 30, levels: 3, hidden: false });
        expect(await loadOwnStanding(db, 4)).toEqual({ score: 50, levels: 5, hidden: true });
        expect(await loadOwnStanding(db, 5)).toEqual({ score: 0, levels: 0, hidden: false });
    });

    it("lets an account hide and reappear", async () => {
        seed();
        const db = asD1(sqlite!);

        await setLeaderboardHidden(db, 1, true);
        expect((await loadSnapshot(db)).top.map(e => e.username)).toEqual(["Grace", "Linus"]);

        await setLeaderboardHidden(db, 1, false);
        expect((await loadSnapshot(db)).top.map(e => e.username)).toContain("Ada");
    });

    it("reports current names and visibility by id, and omits accounts that are gone", async () => {
        seed();
        const db = asD1(sqlite!);
        sqlite!.prepare("UPDATE users SET username = 'Ada Lovelace' WHERE id = 1").run();

        const current = await loadCurrentAccounts(db, [1, 4, 999]);
        expect(current.get(1)).toEqual({ username: "Ada Lovelace", hidden: false });
        expect(current.get(4)).toEqual({ username: "Ghost", hidden: true });
        expect(current.has(999)).toBe(false);
        expect((await loadCurrentAccounts(db, [])).size).toBe(0);
    });

    it("writes nothing when asked to set a visibility it already has", async () => {
        seed();
        const db = asD1(sqlite!);
        const result = (await db
            .prepare("UPDATE users SET leaderboard_hidden = ?2 WHERE id = ?1 AND leaderboard_hidden <> ?2")
            .bind(1, 0)
            .run()) as unknown as { changes: number | bigint };
        expect(Number(result.changes)).toBe(0);
    });
});
