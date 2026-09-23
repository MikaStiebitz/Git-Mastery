/**
 * The ledger: pricing events and deriving state from them.
 *
 * Both functions here are pure — no D1, no Worker globals, no clock of their own. That is
 * deliberate: the entire anti-cheat surface is therefore table-driven unit tests over forged
 * batches, with no Miniflare and no database.
 *
 * The rule the whole design rests on: a client states *what it did*, and this file decides *what
 * that was worth*. The ledger key is built here, never accepted from the wire. If a client could
 * choose its own key, the `PRIMARY KEY (user_id, key)` that caps the economy would be capping
 * nothing, because the same level could be banked under a thousand different keys.
 */

import {
    DOUBLE_XP_DURATION_MS,
    DOUBLE_XP_ITEM,
    EGG_COINS,
    EGG_ID,
    EGG_SCORE,
    LEVEL_COINS,
    LEVEL_SCORE,
    isKnownItem,
    isKnownLevel,
    isKnownMinigame,
    itemPrice,
    minigameCoins,
} from "./catalog";
import type { ClientEvent, Cursor, LedgerRow, RejectionReason, ServerState } from "./types";

/** Build the ledger key for an event. The server's job, never the client's. */
export function ledgerKey(event: ClientEvent): string {
    switch (event.kind) {
        case "level":
            return `level:${event.stage}:${event.level}`;
        case "minigame":
            return `minigame:${event.gameId}`;
        case "purchase":
            return `purchase:${event.itemId}`;
        case "egg":
            return `egg:${EGG_ID}`;
    }
}

function subjectOf(event: ClientEvent): string {
    switch (event.kind) {
        case "level":
            return `${event.stage}/${event.level}`;
        case "minigame":
            return event.gameId;
        case "purchase":
            return event.itemId;
        case "egg":
            return EGG_ID;
    }
}

export interface FoldInput {
    /** Rows already in the ledger, ascending by seq. */
    existing: readonly LedgerRow[];
    /** Validated new events, in the order the client sent them. */
    events: readonly ClientEvent[];
    /** Server clock, epoch ms. */
    now: number;
    /** Account creation, epoch ms. Floors every claimed timestamp. */
    accountCreatedAt: number;
    /**
     * Whether the egg has ever been awarded to this account, including before a cloud reset.
     * A reset clears the ledger so the game can be replayed, but the egg must not re-pay.
     */
    eggAlreadyAwarded: boolean;
    /**
     * True when this batch imports progress made before the account existed. Imported events
     * are priced at multiplier 1 no matter what window their timestamp falls in: the import path
     * is the one place a client asserts history against an account with nothing to clamp
     * against, so it does not get to assert a doubled history too.
     */
    imported: boolean;
}

export interface FoldResult {
    accepted: LedgerRow[];
    rejected: { key: string; reason: RejectionReason }[];
}

/** Coins currently held, from frozen per-row deltas. */
export function balanceOf(rows: readonly LedgerRow[]): number {
    return rows.reduce((sum, row) => sum + row.coinsDelta, 0);
}

function scoreOf(rows: readonly LedgerRow[]): number {
    return rows.reduce((sum, row) => sum + row.scoreDelta, 0);
}

/**
 * When the double-reward window opened, if it ever did.
 *
 * Derived from the accepted purchase row, never from the client's own `doubleXpUntil`, which is
 * display state and is overwritten on every sync.
 */
function doubleXpStart(rows: readonly LedgerRow[]): number | null {
    for (const row of rows) {
        if (row.kind === "purchase" && row.subject === DOUBLE_XP_ITEM) {
            const ms = Date.parse(row.occurredAt);
            if (Number.isFinite(ms)) return ms;
        }
    }
    return null;
}

function multiplierAt(effectiveAt: number, windowStart: number | null, imported: boolean): 1 | 2 {
    if (imported || windowStart === null) return 1;
    return effectiveAt >= windowStart && effectiveAt < windowStart + DOUBLE_XP_DURATION_MS ? 2 : 1;
}

/**
 * Apply a batch of events to a ledger.
 *
 * Events are independent, so a rejected one is skipped and the rest still apply — a purchase
 * that no longer fits the balance must not void the level completions sent alongside it.
 */
export function foldEvents(input: FoldInput): FoldResult {
    const seen = new Set(input.existing.map(row => row.key));
    const rows: LedgerRow[] = [...input.existing];

    let balance = balanceOf(input.existing);
    let windowStart = doubleXpStart(input.existing);
    let eggAwarded = input.eggAlreadyAwarded || input.existing.some(row => row.kind === "egg");

    // Time only moves forward: each event is clamped to at least the last one's effective time,
    // at least the account's creation, and at most now.
    let watermark = input.existing.reduce((latest, row) => {
        const ms = Date.parse(row.occurredAt);
        return Number.isFinite(ms) && ms > latest ? ms : latest;
    }, input.accountCreatedAt);

    const accepted: LedgerRow[] = [];
    const rejected: { key: string; reason: RejectionReason }[] = [];

    for (const event of input.events) {
        const key = ledgerKey(event);

        if (seen.has(key)) {
            // A replay. The client treats this as success and drops it from its outbox: whichever
            // device got there first already banked it, and it was banked exactly once.
            rejected.push({ key, reason: "already_applied" });
            continue;
        }

        if (event.kind === "egg" && eggAwarded) {
            rejected.push({ key, reason: "egg_already_awarded" });
            continue;
        }

        const claimed = Date.parse(event.at);
        const effectiveAt = Math.min(Math.max(Number.isFinite(claimed) ? claimed : watermark, watermark), input.now);
        const multiplier = multiplierAt(effectiveAt, windowStart, input.imported);

        let scoreDelta = 0;
        let coinsDelta = 0;

        switch (event.kind) {
            case "level": {
                // An unrecognised level is recorded at zero reward rather than refused. The site
                // and the Worker deploy separately, so during that window a real completion would
                // otherwise be rejected — and a rejected fact is one the client stops retrying.
                // Costing a player ten coins for a day is recoverable; deleting a level they
                // actually finished is not.
                if (isKnownLevel(event.stage, event.level)) {
                    scoreDelta = LEVEL_SCORE * multiplier;
                    coinsDelta = LEVEL_COINS * multiplier;
                }
                break;
            }
            case "minigame": {
                if (isKnownMinigame(event.gameId)) {
                    coinsDelta = (minigameCoins(event.gameId) ?? 0) * multiplier;
                }
                break;
            }
            case "purchase": {
                // Same forward-compatibility rule, with the sign reversed: an item this Worker has
                // not heard of is granted at no cost rather than refused, so a newly shipped
                // cosmetic is not taken back off a player who bought it. The window is a deploy
                // apart and the leak is one cosmetic item.
                const price = isKnownItem(event.itemId) ? (itemPrice(event.itemId) ?? 0) : 0;
                if (balance - price < 0) {
                    rejected.push({ key, reason: "unaffordable" });
                    continue;
                }
                // Guarded rather than a bare `-price`, which yields -0 for a free item and would
                // put a negative zero in an INTEGER column.
                coinsDelta = price > 0 ? -price : 0;
                break;
            }
            case "egg": {
                scoreDelta = EGG_SCORE * multiplier;
                coinsDelta = EGG_COINS * multiplier;
                break;
            }
        }

        const row: LedgerRow = {
            key,
            kind: event.kind,
            subject: subjectOf(event),
            scoreDelta,
            coinsDelta,
            multiplier,
            occurredAt: new Date(effectiveAt).toISOString(),
            imported: input.imported,
        };

        accepted.push(row);
        rows.push(row);
        seen.add(key);
        balance += coinsDelta;
        watermark = effectiveAt;
        if (event.kind === "egg") eggAwarded = true;
        if (event.kind === "purchase" && event.itemId === DOUBLE_XP_ITEM && windowStart === null) {
            windowStart = effectiveAt;
        }
    }

    return { accepted, rejected };
}

/**
 * Fold the ledger into the shape the client adopts.
 *
 * `score` and `coins` are sums over frozen deltas, so there is no materialised balance to drift
 * from the rows and no cache to invalidate. That is affordable only because a ledger is bounded
 * at one row per level, minigame, shop item and egg — 69 rows at today's content. It would be
 * the wrong choice for an unbounded event stream.
 */
export function deriveState(
    rows: readonly LedgerRow[],
    cursor: Cursor | null,
    bests: Readonly<Record<string, number>>,
    now: Date,
): ServerState {
    // A Map, not an object literal, and this is not stylistic. A stage named `constructor` would
    // make `levels[stage] ??= []` read `Object.prototype.constructor` — truthy, so the assignment
    // is skipped — and then call `.push` on a function, throwing. An unrecognised stage has to be
    // inert data, and in a Map it is.
    const levelsByStage = new Map<string, number[]>();
    const purchasedItems: string[] = [];
    const completedMinigames: string[] = [];
    let gitGudActivated = false;

    for (const row of rows) {
        switch (row.kind) {
            case "level": {
                const [stage, level] = row.subject.split("/");
                const parsed = Number.parseInt(level ?? "", 10);
                if (stage && Number.isInteger(parsed)) {
                    const existing = levelsByStage.get(stage);
                    if (existing) existing.push(parsed);
                    else levelsByStage.set(stage, [parsed]);
                }
                break;
            }
            case "purchase":
                purchasedItems.push(row.subject);
                break;
            case "minigame":
                completedMinigames.push(row.subject);
                break;
            case "egg":
                gitGudActivated = true;
                break;
        }
    }

    // Back to a plain object only at the boundary, for JSON, with a null prototype so a hostile
    // stage name still cannot reach Object.prototype on the way out.
    const completedLevels = Object.create(null) as Record<string, number[]>;
    for (const [stage, levels] of levelsByStage) {
        completedLevels[stage] = levels.sort((a, b) => a - b);
    }

    const windowStart = doubleXpStart(rows);
    const doubleXpUntil = windowStart === null ? null : new Date(windowStart + DOUBLE_XP_DURATION_MS).toISOString();

    return {
        completedLevels,
        currentStage: cursor?.stage ?? "intro",
        currentLevel: cursor?.level ?? 1,
        score: scoreOf(rows),
        coins: balanceOf(rows),
        purchasedItems,
        completedMinigames,
        minigameScores: { ...bests },
        doubleXpUntil,
        gitGudActivated,
        serverTime: now.toISOString(),
    };
}
