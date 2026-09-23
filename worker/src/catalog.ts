/**
 * The economy, as the server understands it.
 *
 * This is the only place rewards and prices exist on the server, and the client never sends a
 * number that any of these replace. A sync request says "I cleared intro/3" and this table
 * decides what that was worth, which is why editing a coin balance in localStorage has nowhere
 * to go — there is no field on the wire that carries one.
 *
 * It necessarily duplicates values that live in the game's own source. That duplication is
 * checked, not trusted: `src/test/worker/catalog-parity.test.ts` imports the real level
 * registry, minigame registry and shop, and fails CI if this file drifts from any of them. Add
 * a level or an item without updating this file and the test tells you, in the same run that
 * would otherwise have shipped silent `unknown` rejections.
 */

/** Score and coins awarded for clearing any level. `ProgressManager.completeLevel`'s default. */
export const LEVEL_SCORE = 10;
export const LEVEL_COINS = 10;

/**
 * Every level the game defines, keyed by lowercase stage id.
 *
 * Lowercase is load-bearing. The game's `allStages` keys are capitalised ("Intro", "TeamWork")
 * and are what reach `completedLevels`, while each stage's own `id` is lowercase. Ledger keys
 * use the lowercase form throughout so one level cannot be banked twice under two spellings.
 */
export const STAGE_LEVELS: Readonly<Record<string, readonly number[]>> = Object.freeze({
    intro: [1, 2, 3, 4],
    files: [1, 2, 3, 4],
    branches: [1, 2, 3, 4, 5, 6],
    merge: [1, 2, 3, 4],
    rebase: [1, 2, 3, 4, 5],
    remote: [1, 2, 3, 4],
    workflow: [1, 2, 3, 4],
    teamwork: [1, 2, 3, 4],
    reset: [1, 2, 3, 4],
    stash: [1, 2, 3, 4],
    advanced: [1, 2, 3, 4],
    archaeology: [1, 2, 3, 4],
    mastery: [1, 2, 3, 4],
});

/**
 * Coins a minigame pays, once.
 *
 * These are the numbers the arcade advertises. The client used to pass a gameplay score here
 * instead — a time-dependent figure far larger than the advertised reward — so these values are
 * also the fix for a pre-existing coin leak, not just a server-side mirror.
 */
export const MINIGAME_COINS: Readonly<Record<string, number>> = Object.freeze({
    "branch-master": 10,
    "graph-puzzle": 25,
    "commit-champion": 20,
    "merge-master": 30,
});

/** Shop prices. Spent as a negative `coins_delta`. */
export const SHOP_PRICES: Readonly<Record<string, number>> = Object.freeze({
    "dark-terminal": 25,
    "matrix-terminal": 50,
    "golden-terminal": 100,
    "git-mascot": 75,
    "victory-sound": 40,
    "double-xp": 120,
    "emoji-commits": 35,
    "pro-tips": 60,
    "git-legend": 200,
});

/** The `git gud` terminal easter egg. Awarded once ever, guarded across cloud resets. */
export const EGG_ID = "gitgud";
export const EGG_SCORE = 50;
export const EGG_COINS = 50;

/** Item whose purchase opens a double-reward window, and how long that window lasts. */
export const DOUBLE_XP_ITEM = "double-xp";
export const DOUBLE_XP_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Lookups built once per isolate. `Map.has` is used rather than indexing a plain object so a
 * key of `__proto__` or `constructor` cannot smuggle its way into a truthy hit.
 */
const stageLevelSets = new Map<string, ReadonlySet<number>>(
    Object.entries(STAGE_LEVELS).map(([stage, levels]) => [stage, new Set(levels)]),
);
const minigameIds = new Map(Object.entries(MINIGAME_COINS));
const shopIds = new Map(Object.entries(SHOP_PRICES));

export function isKnownLevel(stage: string, level: number): boolean {
    return stageLevelSets.get(stage)?.has(level) ?? false;
}

export function isKnownMinigame(gameId: string): boolean {
    return minigameIds.has(gameId);
}

export function minigameCoins(gameId: string): number | undefined {
    return minigameIds.get(gameId);
}

export function isKnownItem(itemId: string): boolean {
    return shopIds.has(itemId);
}

export function itemPrice(itemId: string): number | undefined {
    return shopIds.get(itemId);
}

export function totalLevelCount(): number {
    return Object.values(STAGE_LEVELS).reduce((sum, levels) => sum + levels.length, 0);
}

/**
 * The most coins an account can ever hold, ignoring purchases.
 *
 * Worth stating as code because it is the whole point of the ledger: the key space is finite, so
 * this is not a limit that has to be enforced anywhere — it is arithmetic. A property test pins
 * it, so a pricing change that widens the ceiling fails CI instead of shipping.
 */
export function maxEarnableCoins(): number {
    const levels = totalLevelCount() * LEVEL_COINS;
    const minigames = Object.values(MINIGAME_COINS).reduce((sum, coins) => sum + coins, 0);
    return levels + minigames + EGG_COINS;
}
