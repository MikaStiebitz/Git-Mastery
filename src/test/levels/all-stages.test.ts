import { describe, it, expect } from "vitest";
import { allStages } from "~/levels";

describe("All Stages Validation", () => {
    const stageKeys = Object.keys(allStages);

    describe("Stage Structure", () => {
        it("should have at least 10 stages", () => {
            expect(stageKeys.length).toBeGreaterThanOrEqual(10);
        });

        it("should have all expected stages", () => {
            const expectedStages = [
                "Intro",
                "Files",
                "Branches",
                "Merge",
                "Rebase",
                "Remote",
                "Workflow",
                "TeamWork",
                "Advanced",
                "Archaeology",
                "Mastery",
            ];

            expectedStages.forEach(stageName => {
                expect(stageKeys).toContain(stageName);
            });
        });
    });

    describe("Each Stage", () => {
        stageKeys.forEach(stageKey => {
            describe(`${stageKey} Stage`, () => {
                const stage = allStages[stageKey as keyof typeof allStages];

                it("should have valid metadata", () => {
                    expect(stage.id).toBeDefined();
                    expect(typeof stage.id).toBe("string");
                    expect(stage.name).toBeDefined();
                    expect(typeof stage.name).toBe("string");
                    expect(stage.description).toBeDefined();
                    expect(stage.icon).toBeDefined();
                });

                it("should have at least one level", () => {
                    const levelIds = Object.keys(stage.levels);
                    expect(levelIds.length).toBeGreaterThan(0);
                });

                it("should have sequential level IDs starting from 1", () => {
                    const levelIds = Object.keys(stage.levels).map(Number).sort((a, b) => a - b);

                    expect(levelIds[0]).toBe(1);

                    for (let i = 1; i < levelIds.length; i++) {
                        const currentId = levelIds[i];
                        const previousId = levelIds[i - 1];
                        if (currentId === undefined || previousId === undefined) continue;
                        expect(currentId).toBe(previousId + 1);
                    }
                });

                it("should have valid level structures", () => {
                    const levelIds = Object.keys(stage.levels).map(Number);

                    levelIds.forEach(levelId => {
                        const level = stage.levels[levelId];
                        if (!level) {
                            throw new Error(`Level ${levelId} is undefined in stage ${stageKey}`);
                        }

                        // Basic properties
                        expect(level.id).toBe(levelId);
                        expect(level.name).toBeDefined();
                        expect(typeof level.name).toBe("string");
                        expect(level.description).toBeDefined();
                        expect(typeof level.description).toBe("string");

                        // Objectives
                        expect(Array.isArray(level.objectives)).toBe(true);
                        expect(level.objectives.length).toBeGreaterThan(0);

                        // Requirements
                        expect(Array.isArray(level.requirements)).toBe(true);
                        expect(level.requirements.length).toBeGreaterThan(0);

                        // Initial state
                        expect(level.initialState).toBeDefined();
                        expect(typeof level.initialState).toBe("object");
                    });
                });

                it("should have valid requirements in each level", () => {
                    const levelIds = Object.keys(stage.levels).map(Number);

                    levelIds.forEach(levelId => {
                        const level = stage.levels[levelId];
                        if (!level) return;

                        level.requirements.forEach((req) => {
                            expect(req.command).toBeDefined();
                            expect(typeof req.command).toBe("string");
                            expect(req.description).toBeDefined();
                            expect(req.successMessage).toBeDefined();

                            // Command should not be empty, unless it's a state-based requirement
                            const isStateBased = req.checkFileChanged || req.checkFileExists || req.checkBranchExists;
                            if (!isStateBased) {
                                expect(req.command.trim().length).toBeGreaterThan(0);
                            }
                        });
                    });
                });

                it("should have valid hints in each level", () => {
                    const levelIds = Object.keys(stage.levels).map(Number);

                    levelIds.forEach(levelId => {
                        const level = stage.levels[levelId];
                        if (!level) return;

                        if (level.hints) {
                            expect(Array.isArray(level.hints)).toBe(true);
                            level.hints.forEach(hint => {
                                expect(typeof hint).toBe("string");
                                expect(hint.trim().length).toBeGreaterThan(0);
                            });
                        }
                    });
                });

                it("should have story in each level", () => {
                    const levelIds = Object.keys(stage.levels).map(Number);

                    levelIds.forEach(levelId => {
                        const level = stage.levels[levelId];
                        if (!level) return;

                        if (level.story) {
                            expect(level.story.title).toBeDefined();
                            expect(level.story.narrative).toBeDefined();
                        }
                    });
                });
            });
        });
    });

    describe("Level Count Summary", () => {
        it("should display total levels per stage", () => {
            const summary: Record<string, number> = {};

            stageKeys.forEach(stageKey => {
                const stage = allStages[stageKey as keyof typeof allStages];
                const levelCount = Object.keys(stage.levels).length;
                summary[stageKey] = levelCount;
            });

            console.log("\n📊 Level Count per Stage:");
            Object.entries(summary).forEach(([stage, count]) => {
                console.log(`  ${stage}: ${count} levels`);
            });

            const totalLevels = Object.values(summary).reduce((sum, count) => sum + count, 0);
            console.log(`\n  Total: ${totalLevels} levels across ${stageKeys.length} stages`);

            expect(totalLevels).toBeGreaterThan(0);
        });
    });
});
