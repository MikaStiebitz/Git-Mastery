import { describe, it, expect, beforeEach } from "vitest";
import { ProgressManager } from "~/models/ProgressManager";

/**
 * Characterisation tests for the progression economy.
 *
 * Two jobs. The first group pins the invariants that must survive any economy redesign — awards are
 * idempotent, you cannot spend what you do not have, and everything round-trips through
 * localStorage. The second group documents the current earn behaviour, including the defects, so the
 * redesign has to consciously change them rather than change them by accident.
 */
/**
 * A real in-memory localStorage, installed only for this file.
 *
 * ProgressManager wraps every storage access in try/catch and carries on in memory when it fails,
 * which is why the rest of the suite runs without one — but persistence is exactly what is under
 * test here, so it needs a store that actually stores. Installed locally rather than in the shared
 * setup so the other 700-odd tests keep the environment they were written against.
 */
function installLocalStorage(): Storage {
    const data = new Map<string, string>();
    const store: Storage = {
        get length() {
            return data.size;
        },
        clear: () => data.clear(),
        getItem: (key: string) => data.get(key) ?? null,
        key: (index: number) => [...data.keys()][index] ?? null,
        removeItem: (key: string) => void data.delete(key),
        setItem: (key: string, value: string) => void data.set(key, String(value)),
    };
    Object.defineProperty(globalThis, "localStorage", { value: store, configurable: true, writable: true });
    return store;
}

describe("ProgressManager", () => {
    const STORAGE_KEY = "git-game-progress";

    beforeEach(() => {
        installLocalStorage();
    });

    const fresh = () => new ProgressManager();

    describe("invariants that must survive any redesign", () => {
        it("starts a new player at zero", () => {
            const pm = fresh();

            expect(pm.getProgress().score).toBe(0);
            expect(pm.getCoins()).toBe(0);
            expect(pm.getProgress().completedLevels).toEqual({});
        });

        it("awards a level only once, however often it is completed", () => {
            const pm = fresh();

            pm.completeLevel("Intro", 1);
            const afterFirst = { score: pm.getProgress().score, coins: pm.getCoins() };
            pm.completeLevel("Intro", 1);
            pm.completeLevel("Intro", 1);

            expect(pm.getProgress().score).toBe(afterFirst.score);
            expect(pm.getCoins()).toBe(afterFirst.coins);
            expect(pm.getProgress().completedLevels.Intro).toEqual([1]);
        });

        it("records each completed level once per stage", () => {
            const pm = fresh();

            pm.completeLevel("Intro", 1);
            pm.completeLevel("Intro", 2);
            pm.completeLevel("Files", 1);

            expect(pm.getProgress().completedLevels).toEqual({ Intro: [1, 2], Files: [1] });
            expect(pm.isLevelCompleted("Intro", 2)).toBe(true);
            expect(pm.isLevelCompleted("Files", 2)).toBe(false);
        });

        it("refuses to spend more than the player has", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            const before = pm.getCoins();

            expect(pm.spendPoints(before + 1)).toBe(false);
            expect(pm.getCoins()).toBe(before);
        });

        it("spends exactly what was asked for when affordable", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            const before = pm.getCoins();

            expect(pm.spendPoints(before)).toBe(true);
            expect(pm.getCoins()).toBe(0);
        });

        // Spending is what separates coins from a lifetime score: buying must never cost progress.
        it("never reduces the lifetime score when coins are spent", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            const score = pm.getProgress().score;

            pm.spendPoints(pm.getCoins());

            expect(pm.getProgress().score).toBe(score);
        });

        it("owns a purchased item exactly once", () => {
            const pm = fresh();

            expect(pm.purchaseItem("dark-terminal")).toBe(true);
            expect(pm.purchaseItem("dark-terminal")).toBe(false);
            expect(pm.getPurchasedItems().filter(i => i === "dark-terminal")).toHaveLength(1);
            expect(pm.isPurchased("dark-terminal")).toBe(true);
        });

        it("awards a minigame only once", () => {
            const pm = fresh();

            pm.completeMinigame("branch-master", 20);
            const afterFirst = pm.getCoins();
            pm.completeMinigame("branch-master", 20);

            expect(pm.getCoins()).toBe(afterFirst);
            expect(pm.isMinigameCompleted("branch-master")).toBe(true);
        });

        it("round-trips every field through localStorage", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            pm.purchaseItem("dark-terminal");
            pm.setCurrentLevel("Files", 3);

            const reloaded = new ProgressManager();

            expect(reloaded.getProgress().score).toBe(pm.getProgress().score);
            expect(reloaded.getCoins()).toBe(pm.getCoins());
            expect(reloaded.getProgress().completedLevels).toEqual(pm.getProgress().completedLevels);
            expect(reloaded.getPurchasedItems()).toEqual(pm.getPurchasedItems());
            expect(reloaded.getProgress().currentStage).toBe("Files");
            expect(reloaded.getProgress().currentLevel).toBe(3);
        });

        it("resets everything back to a new player", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            pm.purchaseItem("dark-terminal");

            pm.resetProgress();

            expect(pm.getProgress().score).toBe(0);
            expect(pm.getCoins()).toBe(0);
            expect(pm.getProgress().completedLevels).toEqual({});
            expect(pm.getPurchasedItems()).toEqual([]);
        });

        it("survives a corrupted save without throwing", () => {
            localStorage.setItem(STORAGE_KEY, "{not json");

            expect(() => new ProgressManager()).not.toThrow();
        });
    });

    describe("current earn behaviour (documents what the economy rework must change)", () => {
        // XP and coins are the same number from the same trigger, so "XP" carries no information
        // that "every coin ever earned" does not already carry.
        it("awards an identical amount to score and coins", () => {
            const pm = fresh();

            pm.completeLevel("Intro", 1);

            expect(pm.getProgress().score).toBe(pm.getCoins());
        });

        it("awards 10 of each per level by default", () => {
            const pm = fresh();

            pm.completeLevel("Intro", 1);

            expect(pm.getProgress().score).toBe(10);
            expect(pm.getCoins()).toBe(10);
        });

        it("gives minigames coins but no score", () => {
            const pm = fresh();

            pm.completeMinigame("branch-master", 20);

            expect(pm.getCoins()).toBe(20);
            expect(pm.getProgress().score).toBe(0);
        });

        // The item is called "Double XP" but multiplies coin income too — including minigame coins,
        // which carry no XP at all. That makes it a coin multiplier bought with coins.
        it("doubles coins as well as score while the boost is active", () => {
            const pm = fresh();
            pm.activateDoubleXp();

            pm.completeLevel("Intro", 1);

            expect(pm.getProgress().score).toBe(20);
            expect(pm.getCoins()).toBe(20);
        });

        it("doubles minigame coins while the boost is active, despite awarding no XP", () => {
            const pm = fresh();
            pm.activateDoubleXp();

            pm.completeMinigame("branch-master", 20);

            expect(pm.getCoins()).toBe(40);
            expect(pm.getProgress().score).toBe(0);
        });
    });
});
