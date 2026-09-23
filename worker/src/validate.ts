/**
 * Input validation. Everything that crosses the wire passes through here first.
 *
 * Written by hand rather than with a schema library because the shapes are small and the
 * failure mode matters more than the ergonomics: an event that does not validate must be
 * dropped, never coerced. `'3'`, `3.0` and `3` must not become three different ledger keys for
 * the same level, and `__proto__` must not become a stage.
 */

import type { ClientEvent, Cursor, SyncRequest } from "./types";

export const MAX_EVENTS_PER_SYNC = 64;
export const MAX_BODY_BYTES = 16 * 1024;
export const MAX_BESTS_KEYS = 32;
export const MAX_BEST_VALUE = 100_000;

/** Longest a stage id or item id may be. Guards the ledger key length. */
const MAX_ID_LENGTH = 64;
const MAX_LEVEL = 999;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
    // `Object.getPrototypeOf(...) === null` covers `JSON.parse('{"__proto__":{}}')`, whose result
    // has a null prototype rather than Object.prototype.
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    const proto = Object.getPrototypeOf(value) as unknown;
    return proto === Object.prototype || proto === null;
}

/**
 * Names that are valid-looking identifiers but reach `Object.prototype` when used as a key.
 *
 * Refused here as well as handled downstream. `ledger.ts` builds its state in a Map precisely so
 * that these cannot do damage, but a stage called `constructor` has no legitimate use and every
 * layer that has to remember to be careful is a layer that can forget.
 */
const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/** An id the ledger key can safely be built from: short, printable, no separators of its own. */
function isSafeId(value: unknown): value is string {
    return (
        typeof value === "string" &&
        value.length > 0 &&
        value.length <= MAX_ID_LENGTH &&
        !UNSAFE_KEYS.has(value) &&
        /^[a-z0-9][a-z0-9-]*$/.test(value)
    );
}

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
    return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

/**
 * An ISO timestamp the server is willing to reason about.
 *
 * Returns the parsed epoch milliseconds, or null. A string that parses to NaN is rejected here
 * rather than stored, because a stored `Invalid Date` becomes the watermark for every later
 * event and quietly corrupts the clamp.
 */
export function parseTimestamp(value: unknown): number | null {
    if (typeof value !== "string" || value.length === 0 || value.length > 40) return null;
    const ms = Date.parse(value);
    return Number.isFinite(ms) ? ms : null;
}

/**
 * Validate one event.
 *
 * Deliberately does NOT check whether the subject exists in the catalog — that is the caller's
 * job, because an unknown subject is handled differently from a malformed one: a level this
 * Worker has not heard of yet (the site deployed before the Worker did) is recorded at zero
 * reward rather than thrown away, so a release can never destroy a player's real progress.
 */
export function validateEvent(raw: unknown): ClientEvent | null {
    if (!isPlainRecord(raw)) return null;
    if (parseTimestamp(raw.at) === null) return null;
    const at = raw.at as string;

    switch (raw.kind) {
        case "level":
            if (!isSafeId(raw.stage)) return null;
            if (!isIntegerInRange(raw.level, 1, MAX_LEVEL)) return null;
            return { kind: "level", stage: raw.stage, level: raw.level, at };
        case "minigame":
            if (!isSafeId(raw.gameId)) return null;
            return { kind: "minigame", gameId: raw.gameId, at };
        case "purchase":
            if (!isSafeId(raw.itemId)) return null;
            return { kind: "purchase", itemId: raw.itemId, at };
        case "egg":
            return { kind: "egg", at };
        default:
            return null;
    }
}

export function validateCursor(raw: unknown): Cursor | null {
    if (!isPlainRecord(raw)) return null;
    if (!isSafeId(raw.stage)) return null;
    if (!isIntegerInRange(raw.level, 1, MAX_LEVEL)) return null;
    if (parseTimestamp(raw.at) === null) return null;
    return { stage: raw.stage, level: raw.level, at: raw.at as string };
}

/**
 * Validate a `bests` map: known-shaped ids, bounded count, bounded values.
 *
 * The count cap matters on its own — without it an account can create unbounded
 * `minigame_best` rows, which is a storage and write-quota attack rather than a cheat.
 */
export function validateBests(raw: unknown): Record<string, number> | null {
    if (!isPlainRecord(raw)) return null;
    const entries = Object.entries(raw);
    if (entries.length > MAX_BESTS_KEYS) return null;

    const out: Record<string, number> = Object.create(null) as Record<string, number>;
    for (const [gameId, value] of entries) {
        if (!isSafeId(gameId)) return null;
        if (!isIntegerInRange(value, 0, MAX_BEST_VALUE)) return null;
        out[gameId] = value;
    }
    return out;
}

export interface ParsedSync {
    request: SyncRequest;
    /** Events that failed validation outright, counted but not applied. */
    malformedCount: number;
}

/**
 * Parse and validate a whole sync body.
 *
 * Returns null when the envelope itself is wrong. Individual bad events are dropped and
 * counted rather than failing the batch, so one corrupt entry in a player's outbox cannot
 * permanently block the rest of their progress from saving.
 */
export function validateSyncRequest(raw: unknown): ParsedSync | null {
    if (!isPlainRecord(raw)) return null;
    if (!Array.isArray(raw.events)) return null;
    if (raw.events.length > MAX_EVENTS_PER_SYNC) return null;

    const events: ClientEvent[] = [];
    let malformedCount = 0;
    for (const candidate of raw.events) {
        const event = validateEvent(candidate);
        if (event) events.push(event);
        else malformedCount += 1;
    }

    const request: SyncRequest = { events };

    if (raw.cursor !== undefined) {
        const cursor = validateCursor(raw.cursor);
        if (cursor) request.cursor = cursor;
        else malformedCount += 1;
    }

    if (raw.bests !== undefined) {
        const bests = validateBests(raw.bests);
        if (bests) request.bests = bests;
        else malformedCount += 1;
    }

    if (raw.imported === true) request.imported = true;

    return { request, malformedCount };
}
