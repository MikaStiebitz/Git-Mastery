/** Shared shapes for the account API. */

export interface Env {
    DB: D1Database;
    /** Comma-separated exact origins. No wildcards. */
    ALLOWED_ORIGINS: string;
    SESSION_TTL_DAYS: string;
    /**
     * HMAC key applied to passwords before stretching. Set with `wrangler secret put`, never in
     * config and never with a fallback default in code — a fallback would publish the production
     * key to a public repo the moment one deploy forgot the secret.
     */
    PASSWORD_PEPPER?: string;
    /**
     * Per-location rate limiters. Optional because plan availability is not documented; every
     * call site treats absence as "allow" and leans on the D1 lockout for the real guarantee.
     */
    RL_LOGIN_USER?: RateLimit;
    RL_LOGIN_IP?: RateLimit;
    RL_REGISTER_IP?: RateLimit;
    RL_SYNC_USER?: RateLimit;
}

/**
 * What a client is allowed to claim.
 *
 * Note what is absent: there is no `key`, no `coins`, no `score`, no `price` and no `multiplier`.
 * The server builds the ledger key itself from the identity fields below and prices it from its
 * own catalog. That absence is the anti-cheat design — a forged coin total has no field to
 * travel in, so it is unrepresentable rather than merely rejected.
 */
export type ClientEvent =
    | { kind: "level"; stage: string; level: number; at: string }
    | { kind: "minigame"; gameId: string; at: string }
    | { kind: "purchase"; itemId: string; at: string }
    | { kind: "egg"; at: string };

export type EventKind = ClientEvent["kind"];

/** Where the player currently is. A bookmark, not progress: unpriced, last-write-wins. */
export interface Cursor {
    stage: string;
    level: number;
    at: string;
}

export interface SyncRequest {
    events: ClientEvent[];
    cursor?: Cursor;
    /** Minigame high scores. Cosmetic, unpriced, clamped. */
    bests?: Record<string, number>;
    /**
     * Set when this batch is a one-time import of progress made before the player had an
     * account. Imported events are always priced at multiplier 1 and their timestamps are
     * floored at the account's creation, so the import path cannot mint a doubled economy.
     */
    imported?: boolean;
}

export type RejectionReason =
    | "already_applied"
    | "unaffordable"
    | "unknown_subject"
    | "malformed"
    | "egg_already_awarded";

export interface SyncResponse {
    state: ServerState;
    accepted: string[];
    rejected: { key: string; reason: RejectionReason }[];
}

/**
 * The authoritative progress the client adopts wholesale.
 *
 * Mirrors the game's `UserProgress` closely enough that the client can map it without
 * interpretation, but `score` and `coins` here are always `SUM(ledger)` — never anything a
 * client said.
 */
export interface ServerState {
    completedLevels: Record<string, number[]>;
    currentStage: string;
    currentLevel: number;
    score: number;
    coins: number;
    purchasedItems: string[];
    completedMinigames: string[];
    minigameScores: Record<string, number>;
    doubleXpUntil: string | null;
    gitGudActivated: boolean;
    /** Server clock, so the client can detect a badly skewed local clock. */
    serverTime: string;
}

/** One accepted, priced, immutable ledger row. */
export interface LedgerRow {
    key: string;
    kind: EventKind;
    subject: string;
    scoreDelta: number;
    coinsDelta: number;
    multiplier: 1 | 2;
    occurredAt: string;
    imported: boolean;
}

export interface PublicUser {
    id: string;
    username: string;
    createdAt: string;
}
