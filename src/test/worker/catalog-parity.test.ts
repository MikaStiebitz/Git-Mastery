import { describe, it, expect } from "vitest";

import { allStages } from "~/levels";
import { MINIGAMES } from "~/components/minigames/registry";
import {
    LEVEL_COINS,
    LEVEL_SCORE,
    MINIGAME_COINS,
    SHOP_PRICES,
    STAGE_LEVELS,
    maxEarnableCoins,
} from "../../../worker/src/catalog";

/**
 * The Worker's economy has to be the game's economy.
 *
 * The account server prices every reward from its own hardcoded table, because a client that could
 * state a price could state any price. The cost of that decision is that the table exists twice —
 * once in the game, once in `worker/src/catalog.ts` — and a copy that drifts is worse than no copy
 * at all: a level the server has not heard of records a real completion at no reward, and a shop
 * item it does not know is handed out free.
 *
 * So the duplication is checked rather than trusted. Add a level, a stage, a minigame or a shop
 * item without updating the Worker and this fails, in the same CI run that would otherwise have
 * shipped it.
 */

/** Shop prices, read from the component that renders them. */
function shopPricesFromSource(): Record<string, number> {
    // Read as text rather than imported: Shop.tsx builds its list inside a React component, with
    // JSX icons and `t()` calls that need a rendering context this test has no reason to create.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const source = require("node:fs").readFileSync(
        require("node:path").join(process.cwd(), "src/components/Shop.tsx"),
        "utf8",
    ) as string;

    const prices: Record<string, number> = {};
    const entry = /id:\s*"([a-z0-9-]+)"[\s\S]{0,400}?price:\s*(\d+)/g;
    let match: RegExpExecArray | null;
    while ((match = entry.exec(source)) !== null) {
        prices[match[1]!] = Number(match[2]);
    }
    return prices;
}

describe("the Worker's catalog matches the game", () => {
    it("knows every stage, with exactly the levels that stage defines", () => {
        const fromGame: Record<string, number[]> = {};
        for (const stage of Object.values(allStages)) {
            fromGame[stage.id] = Object.keys(stage.levels)
                .map(Number)
                .sort((a, b) => a - b);
        }

        const fromCatalog = Object.fromEntries(
            Object.entries(STAGE_LEVELS).map(([stage, levels]) => [stage, [...levels]]),
        );

        expect(fromCatalog).toEqual(fromGame);
    });

    it("knows every minigame, at the coins the arcade advertises", () => {
        const fromGame = Object.fromEntries(MINIGAMES.map(game => [game.id, game.coins]));
        expect({ ...MINIGAME_COINS }).toEqual(fromGame);
    });

    it("knows every shop item, at the price the shop charges", () => {
        const fromShop = shopPricesFromSource();

        // A sanity check on the regex itself: if Shop.tsx is ever restructured so that this stops
        // matching, the test must fail loudly rather than silently comparing two empty objects.
        expect(Object.keys(fromShop).length).toBeGreaterThan(5);
        expect({ ...SHOP_PRICES }).toEqual(fromShop);
    });

    it("pays a level what ProgressManager pays a level", () => {
        // `completeLevel(stage, level, score = 10)` is called without an explicit score everywhere
        // in the app, so the default is the real per-level award.
        expect(LEVEL_SCORE).toBe(10);
        expect(LEVEL_COINS).toBe(10);
    });
});

describe("the economy ceiling", () => {
    /**
     * The number that makes the whole design work: a finite key space means a finite maximum, so
     * the cap is arithmetic rather than something anyone has to enforce. Pinned here so a pricing
     * change that widens it has to be a deliberate edit to this line.
     */
    it("is 685 coins, below the 705 the whole shop costs", () => {
        const shopTotal = Object.values(SHOP_PRICES).reduce((sum, price) => sum + price, 0);

        expect(maxEarnableCoins()).toBe(685);
        expect(shopTotal).toBe(705);
        expect(maxEarnableCoins()).toBeLessThan(shopTotal);
    });

    it("counts 55 levels across 13 stages", () => {
        expect(Object.keys(STAGE_LEVELS)).toHaveLength(13);
        expect(Object.values(STAGE_LEVELS).flat()).toHaveLength(55);
    });
});
