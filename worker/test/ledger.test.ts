import { describe, expect, it } from "vitest";

import { EGG_COINS, LEVEL_COINS, MINIGAME_COINS, SHOP_PRICES, STAGE_LEVELS, maxEarnableCoins } from "../src/catalog";
import { balanceOf, deriveState, foldEvents, ledgerKey } from "../src/ledger";
import type { ClientEvent, LedgerRow } from "../src/types";

/**
 * The anti-cheat, exercised the way an attacker would.
 *
 * These are the tests that matter most in the project. The claim the whole account system rests on
 * is that a client cannot mint coins, and a claim like that is worth nothing unless something
 * fails when it stops being true.
 */

const T0 = Date.parse("2026-01-01T00:00:00.000Z");
const DAY = 24 * 60 * 60 * 1000;

function fold(events: ClientEvent[], overrides: Partial<Parameters<typeof foldEvents>[0]> = {}) {
    return foldEvents({
        existing: [],
        events,
        now: T0 + 30 * DAY,
        accountCreatedAt: T0,
        eggAlreadyAwarded: false,
        imported: false,
        ...overrides,
    });
}

const at = (offsetMs = DAY) => new Date(T0 + offsetMs).toISOString();

const level = (stage: string, lvl: number, offset?: number): ClientEvent => ({
    kind: "level",
    stage,
    level: lvl,
    at: at(offset),
});
const purchase = (itemId: string, offset?: number): ClientEvent => ({ kind: "purchase", itemId, at: at(offset) });
const minigame = (gameId: string, offset?: number): ClientEvent => ({ kind: "minigame", gameId, at: at(offset) });
const egg = (offset?: number): ClientEvent => ({ kind: "egg", at: at(offset) });

/** Every level the game defines, as events. The most an honest player could ever submit. */
function everyLevel(): ClientEvent[] {
    return Object.entries(STAGE_LEVELS).flatMap(([stage, levels]) => levels.map(lvl => level(stage, lvl)));
}

describe("the client cannot mint coins", () => {
    it("caps an account at the catalog maximum even when it claims the entire game at once", () => {
        const { accepted } = fold([...everyLevel(), ...Object.keys(MINIGAME_COINS).map(id => minigame(id)), egg()]);

        expect(balanceOf(accepted)).toBe(maxEarnableCoins());
    });

    it("cannot exceed the ceiling by replaying the same facts many times over", () => {
        const spam = Array.from({ length: 40 }, () => level("intro", 1));
        const { accepted, rejected } = fold(spam);

        // One accepted, thirty-nine recognised as the same fact already banked.
        expect(accepted).toHaveLength(1);
        expect(rejected).toHaveLength(39);
        expect(rejected.every(r => r.reason === "already_applied")).toBe(true);
        expect(balanceOf(accepted)).toBe(LEVEL_COINS);
    });

    it("keeps the maximum earnable below the cost of the whole shop, so the ceiling is load-bearing", () => {
        const shopTotal = Object.values(SHOP_PRICES).reduce((sum, price) => sum + price, 0);
        expect(maxEarnableCoins()).toBeLessThan(shopTotal);
    });

    it("builds the ledger key itself, so two spellings of one fact cannot both pay", () => {
        expect(ledgerKey(level("intro", 3))).toBe("level:intro:3");
        expect(ledgerKey(purchase("golden-terminal"))).toBe("purchase:golden-terminal");
        expect(ledgerKey(egg())).toBe("egg:gitgud");
    });
});

describe("purchases are priced and paid for", () => {
    it("refuses a purchase the balance cannot cover", () => {
        const { accepted, rejected } = fold([level("intro", 1), purchase("git-legend")]);

        expect(accepted).toHaveLength(1);
        expect(rejected).toEqual([{ key: "purchase:git-legend", reason: "unaffordable" }]);
    });

    it("charges the catalog price, not anything the client says", () => {
        const events = [...everyLevel().slice(0, 12), purchase("golden-terminal")];
        const { accepted } = fold(events);

        const row = accepted.find(r => r.key === "purchase:golden-terminal");
        expect(row?.coinsDelta).toBe(-SHOP_PRICES["golden-terminal"]!);
        expect(balanceOf(accepted)).toBe(12 * LEVEL_COINS - 100);
    });

    it("never lets a balance go negative, however the batch is ordered", () => {
        const everything = [...everyLevel(), ...Object.keys(SHOP_PRICES).map(id => purchase(id))];
        const { accepted } = fold(everything);

        expect(balanceOf(accepted)).toBeGreaterThanOrEqual(0);
    });

    it("charges an item bought on two devices exactly once", () => {
        const first = fold([...everyLevel().slice(0, 12), purchase("golden-terminal")]);
        const second = foldEvents({
            existing: first.accepted,
            events: [purchase("golden-terminal")],
            now: T0 + 30 * DAY,
            accountCreatedAt: T0,
            eggAlreadyAwarded: false,
            imported: false,
        });

        expect(second.accepted).toHaveLength(0);
        expect(second.rejected).toEqual([{ key: "purchase:golden-terminal", reason: "already_applied" }]);
        expect(balanceOf(first.accepted)).toBe(20);
    });
});

describe("the double-reward window is the server's to grant", () => {
    it("ignores what the client claims about its own window", () => {
        // No double-xp purchase in the ledger, so nothing may be doubled.
        const { accepted } = fold([level("intro", 1)]);
        expect(accepted[0]?.multiplier).toBe(1);
        expect(accepted[0]?.coinsDelta).toBe(LEVEL_COINS);
    });

    it("doubles only events inside the window the purchase opened", () => {
        const earned = everyLevel().slice(0, 13); // 130 coins, enough for the 120 item
        const { accepted } = fold([
            ...earned,
            purchase("double-xp", DAY),
            level("mastery", 1, DAY + 60_000), // inside the window
            level("mastery", 2, DAY + 8 * DAY), // eight days later, window closed
        ]);

        expect(accepted.find(r => r.key === "level:mastery:1")?.multiplier).toBe(2);
        expect(accepted.find(r => r.key === "level:mastery:2")?.multiplier).toBe(1);
    });

    it("prices an imported batch at 1x even inside a window, so an import cannot double the game", () => {
        const { accepted } = fold(
            [...everyLevel().slice(0, 13), purchase("double-xp", DAY), level("mastery", 1, DAY + 1)],
            {
                imported: true,
            },
        );

        expect(accepted.every(row => row.multiplier === 1)).toBe(true);
    });
});

describe("timestamps cannot be used to rewrite history", () => {
    it("floors a claim at the account's creation", () => {
        const { accepted } = fold([{ kind: "level", stage: "intro", level: 1, at: "2019-01-01T00:00:00.000Z" }]);

        expect(Date.parse(accepted[0]!.occurredAt)).toBeGreaterThanOrEqual(T0);
    });

    it("caps a claim at the server's own clock", () => {
        const now = T0 + 5 * DAY;
        const { accepted } = fold([{ kind: "level", stage: "intro", level: 1, at: "2099-01-01T00:00:00.000Z" }], {
            now,
        });

        expect(Date.parse(accepted[0]!.occurredAt)).toBeLessThanOrEqual(now);
    });

    it("moves time forward only, so a later event cannot be backdated before an earlier one", () => {
        const { accepted } = fold([level("intro", 1, 10 * DAY), level("intro", 2, DAY)]);

        const first = Date.parse(accepted[0]!.occurredAt);
        const second = Date.parse(accepted[1]!.occurredAt);
        expect(second).toBeGreaterThanOrEqual(first);
    });
});

describe("the easter egg pays once, ever", () => {
    it("pays the first time", () => {
        const { accepted } = fold([egg()]);
        expect(accepted[0]?.coinsDelta).toBe(EGG_COINS);
    });

    it("refuses a second claim in the same ledger", () => {
        const { accepted, rejected } = fold([egg(), egg()]);
        expect(accepted).toHaveLength(1);
        expect(rejected[0]?.reason).toBe("already_applied");
    });

    // A cloud reset clears the ledger so the game can be replayed and level coins re-earned.
    // The egg must not come with it, or resetting becomes a coin farm.
    it("refuses a claim after a reset wiped the ledger but the account was already credited", () => {
        const { accepted, rejected } = fold([egg()], { eggAlreadyAwarded: true });
        expect(accepted).toHaveLength(0);
        expect(rejected).toEqual([{ key: "egg:gitgud", reason: "egg_already_awarded" }]);
    });
});

describe("content this Worker has not heard of yet", () => {
    // The site and the Worker deploy separately. A rejected fact is one the client stops
    // retrying, so refusing an unknown level would silently delete real progress on every release.
    it("records an unknown level rather than refusing it, at no reward", () => {
        const { accepted, rejected } = fold([level("timetravel", 1)]);

        expect(rejected).toHaveLength(0);
        expect(accepted).toHaveLength(1);
        expect(accepted[0]?.coinsDelta).toBe(0);
        expect(accepted[0]?.scoreDelta).toBe(0);
    });

    it("records an unknown purchase rather than taking the item back off the player", () => {
        const { accepted } = fold([purchase("rainbow-terminal")]);

        expect(accepted).toHaveLength(1);
        expect(accepted[0]?.coinsDelta).toBe(0);
    });

    it("pays nothing for an unknown minigame", () => {
        const { accepted } = fold([minigame("speedrun-simulator")]);
        expect(accepted[0]?.coinsDelta).toBe(0);
    });
});

describe("a rejected event never poisons the rest of the batch", () => {
    it("still banks the level completions sent alongside an unaffordable purchase", () => {
        const { accepted, rejected } = fold([level("intro", 1), purchase("git-legend"), level("intro", 2)]);

        expect(accepted.map(r => r.key)).toEqual(["level:intro:1", "level:intro:2"]);
        expect(rejected).toHaveLength(1);
    });
});

describe("derived state", () => {
    const rows = (): LedgerRow[] =>
        fold([level("intro", 1), level("intro", 2), level("files", 1), minigame("branch-master"), egg()]).accepted;

    it("reports sums over the ledger, never a stored number", () => {
        const state = deriveState(rows(), null, {}, new Date(T0));

        expect(state.completedLevels).toEqual({ intro: [1, 2], files: [1] });
        expect(state.completedMinigames).toEqual(["branch-master"]);
        expect(state.gitGudActivated).toBe(true);
        expect(state.coins).toBe(3 * LEVEL_COINS + 10 + EGG_COINS);
        expect(state.score).toBe(3 * 10 + EGG_COINS);
    });

    it("defaults the cursor to the first level when the account has none", () => {
        const state = deriveState([], null, {}, new Date(T0));
        expect(state.currentStage).toBe("intro");
        expect(state.currentLevel).toBe(1);
    });

    it("derives the double-reward expiry from the purchase, not from the client", () => {
        const accepted = fold([...everyLevel().slice(0, 13), purchase("double-xp", DAY)]).accepted;
        const state = deriveState(accepted, null, {}, new Date(T0));

        expect(state.doubleXpUntil).toBe(new Date(T0 + DAY + 7 * DAY).toISOString());
    });
});
