import { describe, it, expect } from "vitest";
import { allStages } from "~/levels";
import { getAchievements, maxStars, totalLevelCount, type AchievementId } from "~/lib/achievements";
import { getStageLevelIds } from "~/lib/courseProgress";
import { difficulties } from "~/config/difficulties";
import { starKey } from "~/lib/stars";
import commonEn from "~/translations/en/common";
import type { UserProgress } from "~/types";

const context = { minigameTotal: 4 };

function progress(overrides: Partial<UserProgress> = {}): UserProgress {
    return {
        completedLevels: {},
        currentStage: "Intro",
        currentLevel: 1,
        score: 0,
        coins: 0,
        lastSavedAt: "2026-01-01T00:00:00.000Z",
        purchasedItems: [],
        completedMinigames: [],
        minigameScores: {},
        levelStars: {},
        ...overrides,
    };
}

const byId = (list: ReturnType<typeof getAchievements>, id: AchievementId) => list.find(a => a.id === id)!;

/** Every level of the named stages, completed. */
function allDone(stageKeys: string[]): Record<string, number[]> {
    return Object.fromEntries(stageKeys.map(stage => [stage, getStageLevelIds(stage)]));
}

describe("achievements", () => {
    it("start fully locked for a new player", () => {
        const list = getAchievements(progress(), context);
        expect(list.every(a => !a.unlocked)).toBe(true);
        expect(list.every(a => a.current === 0)).toBe(true);
    });

    it("has a name and description for every achievement, in English", () => {
        const list = getAchievements(progress(), context);
        for (const a of list) {
            expect(commonEn, `${a.id} name`).toHaveProperty([`achievement.${a.id}.name`]);
            expect(commonEn, `${a.id} desc`).toHaveProperty([`achievement.${a.id}.desc`]);
        }
    });

    it("counts levels and unlocks the early milestones", () => {
        const levels = getStageLevelIds("Intro");
        const list = getAchievements(progress({ completedLevels: { Intro: levels } }), context);

        expect(byId(list, "first-step").unlocked).toBe(true);
        expect(byId(list, "stage-clear").unlocked).toBe(true);
        expect(byId(list, "getting-going").current).toBe(levels.length);
        expect(byId(list, "getting-going").unlocked).toBe(levels.length >= 10);
    });

    it("counts a stage spelled two ways once", () => {
        const [first] = getStageLevelIds("Intro");
        const list = getAchievements(progress({ completedLevels: { Intro: [first!], intro: [first!] } }), context);
        expect(byId(list, "getting-going").current).toBe(1);
    });

    it("ignores levels the game does not define", () => {
        const list = getAchievements(progress({ completedLevels: { Intro: [999], Nonsense: [1] } }), context);
        expect(byId(list, "first-step").unlocked).toBe(false);
    });

    it("unlocks a course only when every stage of it is finished", () => {
        const beginner = difficulties.find(d => d.id === "beginner")!;
        const [firstStage, ...rest] = beginner.stages;

        const partial = getAchievements(progress({ completedLevels: allDone([firstStage!]) }), context);
        expect(byId(partial, "beginner-course").unlocked).toBe(false);

        const full = getAchievements(progress({ completedLevels: allDone([firstStage!, ...rest]) }), context);
        expect(byId(full, "beginner-course").unlocked).toBe(true);
        expect(byId(full, "advanced-course").unlocked).toBe(false);
    });

    it("unlocks completionist only with every level", () => {
        const all = allDone(Object.keys(allStages));
        const list = getAchievements(progress({ completedLevels: all }), context);
        expect(byId(list, "completionist").unlocked).toBe(true);
        expect(byId(list, "completionist").target).toBe(totalLevelCount());
        expect(byId(list, "halfway").unlocked).toBe(true);
    });

    it("never reports progress above the target", () => {
        const list = getAchievements(progress({ completedLevels: allDone(Object.keys(allStages)) }), context);
        for (const a of list) expect(a.current).toBeLessThanOrEqual(a.target);
    });

    it("rewards three-star clears, not merely clears", () => {
        const [first, second] = getStageLevelIds("Intro");
        const plain = getAchievements(progress({ completedLevels: { Intro: [first!] } }), context);
        expect(byId(plain, "flawless").unlocked).toBe(false);

        const flawless = getAchievements(
            progress({ completedLevels: { Intro: [first!] }, levelStars: { [starKey("Intro", first!)]: 3 } }),
            context,
        );
        expect(byId(flawless, "flawless").unlocked).toBe(true);

        // A star stored for a level that is not completed counts for nothing.
        const orphan = getAchievements(progress({ levelStars: { [starKey("Intro", second!)]: 3 } }), context);
        expect(byId(orphan, "flawless").unlocked).toBe(false);
    });

    it("needs every level of a stage at three stars for a spotless stage", () => {
        const levels = getStageLevelIds("Intro");
        const stars = Object.fromEntries(levels.map(l => [starKey("Intro", l), 3]));

        const spotless = getAchievements(progress({ completedLevels: { Intro: levels }, levelStars: stars }), context);
        expect(byId(spotless, "flawless-stage").unlocked).toBe(true);

        const short = { ...stars, [starKey("Intro", levels[0]!)]: 2 };
        const notQuite = getAchievements(progress({ completedLevels: { Intro: levels }, levelStars: short }), context);
        expect(byId(notQuite, "flawless-stage").unlocked).toBe(false);
    });

    it("reports the maximum stars as three per level", () => {
        expect(maxStars()).toBe(totalLevelCount() * 3);
    });

    it("unlocks the arcade achievement against the arcade's own size", () => {
        const list = getAchievements(progress({ completedMinigames: ["a", "b", "c", "d"] }), context);
        expect(byId(list, "arcade-regular").unlocked).toBe(true);
        const some = getAchievements(progress({ completedMinigames: ["a"] }), context);
        expect(byId(some, "arcade-regular").unlocked).toBe(false);
    });

    it("unlocks the Maintainer achievement from the rank, not a separate score", () => {
        expect(byId(getAchievements(progress({ score: 419 }), context), "maintainer").unlocked).toBe(false);
        expect(byId(getAchievements(progress({ score: 420 }), context), "maintainer").unlocked).toBe(true);
    });

    it("marks only the easter egg as secret", () => {
        const list = getAchievements(progress(), context);
        expect(list.filter(a => a.secret).map(a => a.id)).toEqual(["git-gud"]);
        expect(byId(getAchievements(progress({ gitGudActivated: true }), context), "git-gud").unlocked).toBe(true);
    });

    it("unlocks Git Legend from the shop purchase", () => {
        const list = getAchievements(progress({ purchasedItems: ["git-legend"] }), context);
        expect(byId(list, "git-legend").unlocked).toBe(true);
    });
});
