import { describe, it, expect, beforeEach } from "vitest";
import { ProgressManager } from "~/models/ProgressManager";
import { foldCompletedLevels, toStageId, toStageKey } from "~/lib/stageIds";

/**
 * The client half of the account sync.
 *
 * The server can only be as trustworthy as the thing feeding it, so these tests pin the two
 * properties the anti-cheat depends on from this side: an outbox entry never carries a number the
 * server would believe, and a queued fact is not dropped until the server has confirmed it.
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

describe("the outbox", () => {
    beforeEach(() => {
        installLocalStorage();
    });

    const fresh = () => new ProgressManager();

    describe("carries facts, never amounts", () => {
        /**
         * The heart of it. Whatever a cheater does to their local coin total, the only thing that
         * leaves this device is "I finished intro/1" — there is no field on the wire that could
         * carry a balance, so a forged one is not rejected, it is unrepresentable.
         */
        it("has no coins, score or price field on any event", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            pm.completeMinigame("branch-master", 10, 250);
            pm.purchaseItem("dark-terminal");
            pm.activateGitGud();

            for (const event of pm.getOutbox()) {
                const keys = Object.keys(event);
                expect(keys).not.toContain("coins");
                expect(keys).not.toContain("score");
                expect(keys).not.toContain("price");
                expect(keys).not.toContain("amount");
                expect(keys).not.toContain("key");
            }
        });

        it("queues one event per thing the player actually did", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            pm.completeLevel("Intro", 2);
            pm.purchaseItem("dark-terminal");

            expect(pm.getOutbox()).toHaveLength(3);
        });

        it("does not queue anything for a level that was already finished", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            pm.completeLevel("Intro", 1);
            pm.completeLevel("Intro", 1);

            expect(pm.getOutbox()).toHaveLength(1);
        });

        it("lowercases the stage, so one level cannot be banked under two spellings", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);

            expect(pm.getOutbox()[0]).toMatchObject({ kind: "level", stage: "intro", level: 1 });
        });

        it("does not queue a purchase that did not happen", () => {
            const pm = fresh();
            pm.purchaseItem("dark-terminal");
            pm.purchaseItem("dark-terminal");

            expect(pm.getOutbox().filter(e => e.kind === "purchase")).toHaveLength(1);
        });
    });

    describe("keeps facts until the server confirms them", () => {
        it("drops only the keys it is told were settled", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            pm.completeLevel("Intro", 2);

            pm.pruneOutbox(["level:intro:1"]);

            expect(pm.getOutbox()).toHaveLength(1);
            expect(pm.getOutbox()[0]).toMatchObject({ level: 2 });
        });

        // A failed upload must not cost the player the level they just finished.
        it("keeps everything when nothing was settled", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);

            pm.pruneOutbox([]);

            expect(pm.getOutbox()).toHaveLength(1);
        });

        it("survives a reload, because the queue lives in localStorage", () => {
            const first = fresh();
            first.completeLevel("Intro", 1);

            expect(fresh().getOutbox()).toHaveLength(1);
        });
    });

    describe("a local reset clears the queue", () => {
        // Progress that no longer exists locally must not be uploaded afterwards, or a reset would
        // be quietly undone by the next sync.
        it("leaves nothing queued", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            pm.purchaseItem("dark-terminal");

            pm.resetProgress();

            expect(pm.getOutbox()).toEqual([]);
        });

        it("clears the easter egg flag, which it used to leave set", () => {
            const pm = fresh();
            pm.activateGitGud();
            expect(pm.hasActivatedGitGud()).toBe(true);

            pm.resetProgress();

            expect(pm.hasActivatedGitGud()).toBe(false);
        });
    });

    describe("the snapshot taken when an existing player first signs in", () => {
        it("describes every fact this device knows", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            pm.completeLevel("Files", 2);
            pm.completeMinigame("branch-master", 10, 250);
            pm.purchaseItem("dark-terminal");
            pm.activateGitGud();

            const snapshot = pm.snapshotForMerge();

            expect(snapshot.filter(e => e.kind === "level")).toHaveLength(2);
            expect(snapshot.filter(e => e.kind === "minigame")).toHaveLength(1);
            expect(snapshot.filter(e => e.kind === "purchase")).toHaveLength(1);
            expect(snapshot.filter(e => e.kind === "egg")).toHaveLength(1);
        });

        it("carries no numbers either", () => {
            const pm = fresh();
            pm.completeLevel("Intro", 1);
            pm.addCoins(99999);

            for (const event of pm.snapshotForMerge()) {
                expect(Object.keys(event)).not.toContain("coins");
            }
        });
    });

    describe("adopting the server's state", () => {
        it("replaces the local balance outright rather than merging it", () => {
            const pm = fresh();
            pm.addCoins(99999); // the cheat

            pm.applyServerState({
                completedLevels: { intro: [1] },
                currentStage: "intro",
                currentLevel: 2,
                score: 10,
                coins: 10,
                purchasedItems: [],
                completedMinigames: [],
                minigameScores: {},
                doubleXpUntil: null,
                gitGudActivated: false,
            });

            expect(pm.getCoins()).toBe(10);
            expect(pm.getProgress().score).toBe(10);
        });

        it("restores the capitalised stage key the rest of the game uses", () => {
            const pm = fresh();

            pm.applyServerState({
                completedLevels: { teamwork: [1, 2] },
                currentStage: "teamwork",
                currentLevel: 2,
                score: 20,
                coins: 20,
                purchasedItems: [],
                completedMinigames: [],
                minigameScores: {},
                doubleXpUntil: null,
                gitGudActivated: false,
            });

            expect(pm.isLevelCompleted("TeamWork", 1)).toBe(true);
            expect(pm.getProgress().currentStage).toBe("TeamWork");
        });
    });

    describe("minigames pay what the arcade advertises", () => {
        // They used to pay the gameplay score — `score * 2 + timeLeft` in Branch Master — so a
        // game the grid advertises as "+10" could pay a hundred, and a different number each run.
        it("credits the reward, not the score on the results screen", () => {
            const pm = fresh();
            pm.completeMinigame("branch-master", 10, 250);

            expect(pm.getCoins()).toBe(10);
        });

        it("still records the gameplay score as the high score", () => {
            const pm = fresh();
            pm.completeMinigame("branch-master", 10, 250);

            expect(pm.getMinigameScore("branch-master")).toBe(250);
        });

        it("pays once but keeps improving the high score", () => {
            const pm = fresh();
            pm.completeMinigame("branch-master", 10, 250);
            pm.completeMinigame("branch-master", 10, 400);

            expect(pm.getCoins()).toBe(10);
            expect(pm.getMinigameScore("branch-master")).toBe(400);
        });
    });
});

describe("stage ids", () => {
    it("converts the stored key to the id used on the wire", () => {
        expect(toStageId("Intro")).toBe("intro");
        expect(toStageId("TeamWork")).toBe("teamwork");
    });

    it("converts back to the key the game stores progress under", () => {
        expect(toStageKey("intro")).toBe("Intro");
        expect(toStageKey("teamwork")).toBe("TeamWork");
    });

    it("keeps an unknown stage rather than dropping it", () => {
        expect(toStageKey("timetravel")).toBe("timetravel");
    });

    // Saved progress in the wild can hold both spellings, because nothing ever forced one.
    it("folds entries that differ only by case into a single stage", () => {
        const folded = foldCompletedLevels({ Intro: [1, 2], intro: [2, 3] });

        expect(Object.keys(folded)).toEqual(["Intro"]);
        expect(folded.Intro).toEqual([1, 2, 3]);
    });
});
