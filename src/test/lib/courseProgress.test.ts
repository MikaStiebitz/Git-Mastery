import { describe, it, expect } from "vitest";
import { getStageLevelIds, getStageProgress, getDifficultyProgress, getDifficultyForStage } from "~/lib/courseProgress";
import { allStages } from "~/levels";
import { difficulties } from "~/config/difficulties";

describe("course progress", () => {
    describe("getStageLevelIds", () => {
        it("returns a stage's level ids in ascending order", () => {
            const ids = getStageLevelIds("Intro");

            expect(ids.length).toBeGreaterThan(0);
            expect([...ids].sort((a, b) => a - b)).toEqual(ids);
        });

        it("returns nothing for an unknown stage", () => {
            expect(getStageLevelIds("NotAStage")).toEqual([]);
        });
    });

    describe("getStageProgress", () => {
        it("counts nothing done on a fresh profile", () => {
            const progress = getStageProgress("Intro", {});

            expect(progress.done).toBe(0);
            expect(progress.total).toBe(getStageLevelIds("Intro").length);
            expect(progress.complete).toBe(false);
        });

        it("counts completed levels", () => {
            const progress = getStageProgress("Intro", { Intro: [1, 2] });

            expect(progress.done).toBe(2);
        });

        it("reports the position of the level currently open", () => {
            const progress = getStageProgress("Intro", {}, 3);

            expect(progress.position).toBe(3);
        });

        it("reports no position for a level outside the stage", () => {
            expect(getStageProgress("Intro", {}, 999).position).toBeNull();
        });

        it("is complete only when every level is done", () => {
            const ids = getStageLevelIds("Intro");

            expect(getStageProgress("Intro", { Intro: ids.slice(0, -1) }).complete).toBe(false);
            expect(getStageProgress("Intro", { Intro: ids }).complete).toBe(true);
        });

        // A level that was removed or renamed can leave a stale id behind in localStorage.
        it("ignores completed ids the stage does not define", () => {
            const ids = getStageLevelIds("Intro");
            const progress = getStageProgress("Intro", { Intro: [...ids, 9999] });

            expect(progress.done).toBe(ids.length);
            expect(progress.done).toBeLessThanOrEqual(progress.total);
        });

        it("handles an unknown stage without throwing", () => {
            const progress = getStageProgress("NotAStage", {});

            expect(progress).toMatchObject({ done: 0, total: 0, complete: false });
        });
    });

    describe("getDifficultyProgress", () => {
        it("sums every stage of the difficulty", () => {
            const beginner = difficulties.find(d => d.id === "beginner")!;
            const expectedLevels = beginner.stages.reduce((sum, s) => sum + getStageLevelIds(s).length, 0);

            const progress = getDifficultyProgress("beginner", {});

            expect(progress.levelsTotal).toBe(expectedLevels);
            expect(progress.stagesTotal).toBe(beginner.stages.length);
            expect(progress.levelsDone).toBe(0);
            expect(progress.stagesDone).toBe(0);
        });

        it("counts a stage as done only when all its levels are", () => {
            const introIds = getStageLevelIds("Intro");

            const partial = getDifficultyProgress("beginner", { Intro: introIds.slice(0, 1) });
            expect(partial.stagesDone).toBe(0);

            const full = getDifficultyProgress("beginner", { Intro: introIds });
            expect(full.stagesDone).toBe(1);
        });

        it("reports which stage of the difficulty is open", () => {
            const beginner = difficulties.find(d => d.id === "beginner")!;

            expect(getDifficultyProgress("beginner", {}, beginner.stages[0]).stagePosition).toBe(1);
            expect(getDifficultyProgress("beginner", {}, beginner.stages[2]).stagePosition).toBe(3);
        });

        // Opening an advanced stage while "beginner" is the stored preference must not report a
        // position inside beginner — the stage decides which course you are looking at.
        it("reports no position for a stage outside the difficulty", () => {
            expect(getDifficultyProgress("beginner", {}, "Rebase").stagePosition).toBeNull();
        });

        it("reaches completion when every level of the difficulty is done", () => {
            const beginner = difficulties.find(d => d.id === "beginner")!;
            const completed: Record<string, number[]> = {};
            for (const stage of beginner.stages) completed[stage] = getStageLevelIds(stage);

            const progress = getDifficultyProgress("beginner", completed);

            expect(progress.levelsDone).toBe(progress.levelsTotal);
            expect(progress.stagesDone).toBe(progress.stagesTotal);
        });
    });

    describe("getDifficultyForStage", () => {
        it("maps every stage of every difficulty back to its difficulty", () => {
            for (const difficulty of difficulties) {
                for (const stage of difficulty.stages) {
                    expect(getDifficultyForStage(stage)).toBe(difficulty.id);
                }
            }
        });

        it("returns null for a stage in no difficulty", () => {
            expect(getDifficultyForStage("NotAStage")).toBeNull();
        });
    });

    describe("every stage belongs to exactly one difficulty", () => {
        it("covers all stages without overlap", () => {
            const assigned = difficulties.flatMap(d => d.stages);

            expect(new Set(assigned).size).toBe(assigned.length);
            expect(new Set(assigned)).toEqual(new Set(Object.keys(allStages)));
        });
    });
});
