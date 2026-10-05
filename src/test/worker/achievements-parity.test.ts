import { describe, it, expect } from "vitest";

import { allStages } from "~/levels";
import { difficulties } from "~/config/difficulties";
import { MINIGAMES } from "~/components/minigames/registry";
import { RANKS } from "~/lib/ranks";
import { getAchievements } from "~/lib/achievements";
import type { UserProgress } from "~/types";
import { ACHIEVEMENT_IDS, unlockedAchievements } from "../../../worker/src/achievements";
import { DIFFICULTY_STAGES, MAINTAINER_MIN_SCORE, MINIGAME_SCORE_CEILING } from "../../../worker/src/catalog";

/**
 * A badge on your screen and the same badge on the leaderboard have to be the same fact.
 *
 * The achievement rules exist twice: in the game, computed from your own save, and in the Worker,
 * computed from the ledger so the board can show other people's. They are run here over the same
 * saves and must agree. The saves are generated from a seeded generator, so a failure reproduces.
 */

/** Small deterministic PRNG (mulberry32) so a failing seed can be replayed. */
function rng(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

interface Save {
    /** "stage/level", lowercase stage id. */
    levels: Set<string>;
    stars: Record<string, number>;
    minigamesCleared: number;
    purchases: Set<string>;
    eggFound: boolean;
    score: number;
}

const stageKeyById = Object.fromEntries(Object.entries(allStages).map(([key, stage]) => [stage.id, key]));

function toClient(save: Save): UserProgress {
    const completedLevels: Record<string, number[]> = {};
    for (const subject of save.levels) {
        const [stage, level] = subject.split("/") as [string, string];
        (completedLevels[stageKeyById[stage]!] ??= []).push(Number(level));
    }
    return {
        completedLevels,
        currentStage: "Intro",
        currentLevel: 1,
        score: save.score,
        coins: 0,
        lastSavedAt: "2026-01-01T00:00:00.000Z",
        purchasedItems: [...save.purchases],
        completedMinigames: MINIGAMES.slice(0, save.minigamesCleared).map(game => game.id),
        minigameScores: {},
        levelStars: save.stars,
        gitGudActivated: save.eggFound,
    };
}

function randomSave(random: () => number): Save {
    // Bias towards the interesting edges: nothing, everything, and whole stages.
    const mode = random();
    const levels = new Set<string>();
    for (const stage of Object.values(allStages)) {
        const ids = Object.keys(stage.levels).map(Number);
        const wholeStage = mode < 0.3 ? random() < 0.5 : mode < 0.45;
        for (const id of ids) {
            if (mode > 0.9 ? true : wholeStage || random() < 0.3) levels.add(`${stage.id}/${id}`);
        }
    }

    const stars: Record<string, number> = {};
    const threeProbability = random();
    for (const subject of levels) {
        const roll = random();
        if (roll < threeProbability) stars[subject] = 3;
        else if (roll < threeProbability + 0.2) stars[subject] = 2;
    }
    // A star claim for a level that is not cleared must count for nothing on both sides.
    if (random() < 0.3) stars["intro/1"] = 3;

    return {
        levels,
        stars,
        minigamesCleared: Math.floor(random() * (MINIGAMES.length + 1)),
        purchases: new Set(random() < 0.4 ? ["git-legend"] : []),
        eggFound: random() < 0.3,
        score: Math.floor(random() * 700),
    };
}

describe("the Worker's achievements are the game's achievements", () => {
    it("lists the same achievements in the same order", () => {
        const fromGame = getAchievements(toClient(randomSave(rng(1))), { minigameTotal: MINIGAMES.length }).map(
            a => a.id,
        );
        expect([...ACHIEVEMENT_IDS]).toEqual(fromGame);
    });

    it("agrees on 400 generated saves", () => {
        const random = rng(20261001);
        for (let i = 0; i < 400; i++) {
            const save = randomSave(random);
            const fromGame = getAchievements(toClient(save), { minigameTotal: MINIGAMES.length })
                .filter(a => a.unlocked)
                .map(a => a.id);
            const fromWorker = unlockedAchievements(save);
            expect(fromWorker, `save #${i}`).toEqual(fromGame);
        }
    });

    it("agrees on an empty save and a perfect one", () => {
        const empty: Save = {
            levels: new Set(),
            stars: {},
            minigamesCleared: 0,
            purchases: new Set(),
            eggFound: false,
            score: 0,
        };
        expect(unlockedAchievements(empty)).toEqual([]);

        const levels = new Set<string>();
        const stars: Record<string, number> = {};
        for (const stage of Object.values(allStages)) {
            for (const id of Object.keys(stage.levels)) {
                levels.add(`${stage.id}/${id}`);
                stars[`${stage.id}/${id}`] = 3;
            }
        }
        const perfect: Save = {
            levels,
            stars,
            minigamesCleared: MINIGAMES.length,
            purchases: new Set(["git-legend"]),
            eggFound: true,
            score: 600,
        };
        expect(unlockedAchievements(perfect)).toEqual([...ACHIEVEMENT_IDS]);
        expect(
            getAchievements(toClient(perfect), { minigameTotal: MINIGAMES.length })
                .filter(a => !a.unlocked)
                .map(a => a.id),
        ).toEqual([]);
    });
});

describe("the Worker's catalog of courses, ranks and arcade matches the game", () => {
    it("lists each course's stages", () => {
        const fromGame = Object.fromEntries(difficulties.map(d => [d.id, d.stages.map(stage => stage.toLowerCase())]));
        expect(Object.fromEntries(Object.entries(DIFFICULTY_STAGES).map(([id, stages]) => [id, [...stages]]))).toEqual(
            fromGame,
        );
    });

    it("uses the Maintainer threshold the game uses", () => {
        expect(MAINTAINER_MIN_SCORE).toBe(RANKS.find(rank => rank.id === "maintainer")!.minScore);
    });

    it("has a score ceiling for exactly the minigames the arcade has", () => {
        expect(Object.keys(MINIGAME_SCORE_CEILING).sort()).toEqual(MINIGAMES.map(game => game.id).sort());
    });
});
