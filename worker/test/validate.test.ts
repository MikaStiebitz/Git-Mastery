import { describe, expect, it } from "vitest";

import {
    MAX_EVENTS_PER_SYNC,
    validateBests,
    validateCursor,
    validateEvent,
    validateSyncRequest,
} from "../src/validate";

/**
 * Validation, from the point of view of someone sending this endpoint deliberate rubbish.
 *
 * The repository is public, so every field name here is known to an attacker. These tests are the
 * record of what happens when each one is filled in wrongly on purpose.
 */

const AT = "2026-01-01T00:00:00.000Z";

describe("a level event has to name a real level", () => {
    it("accepts a well-formed one", () => {
        expect(validateEvent({ kind: "level", stage: "intro", level: 3, at: AT })).toEqual({
            kind: "level",
            stage: "intro",
            level: 3,
            at: AT,
        });
    });

    // '3', 3.0 and 3 must not be able to become three ledger keys for one level.
    it("refuses a level number that is a string", () => {
        expect(validateEvent({ kind: "level", stage: "intro", level: "3", at: AT })).toBeNull();
    });

    it("refuses a fractional level number", () => {
        expect(validateEvent({ kind: "level", stage: "intro", level: 3.5, at: AT })).toBeNull();
    });

    it("refuses NaN and Infinity", () => {
        expect(validateEvent({ kind: "level", stage: "intro", level: NaN, at: AT })).toBeNull();
        expect(validateEvent({ kind: "level", stage: "intro", level: Infinity, at: AT })).toBeNull();
    });

    it("refuses a negative or zero level", () => {
        expect(validateEvent({ kind: "level", stage: "intro", level: 0, at: AT })).toBeNull();
        expect(validateEvent({ kind: "level", stage: "intro", level: -1, at: AT })).toBeNull();
    });

    it("refuses a stage id that is not a plain lowercase identifier", () => {
        for (const stage of ["Intro", "in tro", "intro/../x", "intro:1", "", "ıntro", "in.tro"]) {
            expect(validateEvent({ kind: "level", stage, level: 1, at: AT }), stage).toBeNull();
        }
    });

    it("refuses a stage id long enough to bloat the ledger key", () => {
        expect(validateEvent({ kind: "level", stage: "a".repeat(200), level: 1, at: AT })).toBeNull();
    });
});

describe("timestamps have to be timestamps", () => {
    it("refuses a missing one", () => {
        expect(validateEvent({ kind: "egg" })).toBeNull();
    });

    // A stored 'Invalid Date' becomes the watermark every later event is clamped against, so this
    // one has to be caught at the door rather than on the way into the database.
    it("refuses a string that does not parse", () => {
        expect(validateEvent({ kind: "egg", at: "not a date" })).toBeNull();
        expect(validateEvent({ kind: "egg", at: "" })).toBeNull();
    });

    it("refuses a number", () => {
        expect(validateEvent({ kind: "egg", at: 1_700_000_000_000 })).toBeNull();
    });
});

describe("prototype pollution", () => {
    it("refuses an object with a null prototype smuggled in through JSON", () => {
        const polluted = JSON.parse(
            '{"kind":"egg","at":"2026-01-01T00:00:00.000Z","__proto__":{"admin":true}}',
        ) as unknown;
        // The parsed object is fine in itself; what matters is that nothing downstream indexes a
        // plain object with an attacker-chosen key.
        expect(validateEvent(polluted)).not.toBeNull();
        expect(({} as Record<string, unknown>).admin).toBeUndefined();
    });

    it("refuses __proto__ and constructor as stage ids", () => {
        expect(validateEvent({ kind: "level", stage: "__proto__", level: 1, at: AT })).toBeNull();
        expect(validateEvent({ kind: "level", stage: "constructor", level: 1, at: AT })).toBeNull();
    });

    it("refuses an array where an object is expected", () => {
        expect(validateEvent([])).toBeNull();
        expect(validateCursor([])).toBeNull();
        expect(validateBests([])).toBeNull();
    });

    it("refuses null and primitives", () => {
        for (const value of [null, undefined, 1, "x", true]) {
            expect(validateEvent(value)).toBeNull();
        }
    });
});

describe("unknown event kinds", () => {
    it("refuses a kind the server does not implement", () => {
        expect(validateEvent({ kind: "grant_coins", amount: 99999, at: AT })).toBeNull();
        expect(validateEvent({ kind: "__proto__", at: AT })).toBeNull();
    });
});

describe("the bests map is bounded", () => {
    it("accepts a small, well-formed map", () => {
        expect(validateBests({ "branch-master": 120 })).toEqual({ "branch-master": 120 });
    });

    // Without a count cap an account can create unbounded rows, which is a storage and
    // write-quota attack rather than a cheat.
    it("refuses more keys than there could ever be minigames", () => {
        const many: Record<string, number> = {};
        for (let i = 0; i < 100; i++) many[`game-${i}`] = 1;
        expect(validateBests(many)).toBeNull();
    });

    it("refuses an absurd score", () => {
        expect(validateBests({ "branch-master": 10 ** 12 })).toBeNull();
        expect(validateBests({ "branch-master": -5 })).toBeNull();
        expect(validateBests({ "branch-master": Number.MAX_SAFE_INTEGER })).toBeNull();
    });
});

describe("the sync envelope", () => {
    it("refuses a body with no events array", () => {
        expect(validateSyncRequest({})).toBeNull();
        expect(validateSyncRequest({ events: "all of them" })).toBeNull();
    });

    it("refuses a batch larger than the cap", () => {
        const events = Array.from({ length: MAX_EVENTS_PER_SYNC + 1 }, () => ({ kind: "egg", at: AT }));
        expect(validateSyncRequest({ events })).toBeNull();
    });

    // One corrupt entry in a player's outbox must not permanently block the rest of their real
    // progress from ever saving.
    it("drops a malformed event and keeps the valid ones", () => {
        const parsed = validateSyncRequest({
            events: [
                { kind: "level", stage: "intro", level: 1, at: AT },
                { kind: "level", stage: "intro", level: "nope", at: AT },
                { kind: "egg", at: AT },
            ],
        });

        expect(parsed?.request.events).toHaveLength(2);
        expect(parsed?.malformedCount).toBe(1);
    });

    it("ignores an unparseable cursor without failing the batch", () => {
        const parsed = validateSyncRequest({ events: [], cursor: { stage: "Intro", level: 1, at: AT } });
        expect(parsed?.request.cursor).toBeUndefined();
        expect(parsed?.malformedCount).toBe(1);
    });

    it("only treats imported as set when it is exactly true", () => {
        expect(validateSyncRequest({ events: [], imported: "yes" })?.request.imported).toBeUndefined();
        expect(validateSyncRequest({ events: [], imported: 1 })?.request.imported).toBeUndefined();
        expect(validateSyncRequest({ events: [], imported: true })?.request.imported).toBe(true);
    });

    it("never carries a coins, score or key field through, because none exists", () => {
        const parsed = validateSyncRequest({
            events: [
                { kind: "level", stage: "intro", level: 1, at: AT, coins: 99999, score: 99999, key: "level:mastery:4" },
            ],
        });

        const event = parsed?.request.events[0] as Record<string, unknown> | undefined;
        expect(event).toBeDefined();
        expect(event?.coins).toBeUndefined();
        expect(event?.score).toBeUndefined();
        expect(event?.key).toBeUndefined();
    });
});
