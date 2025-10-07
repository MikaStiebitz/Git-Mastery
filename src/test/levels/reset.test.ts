import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { LevelManager } from "~/models/LevelManager";
import { allStages } from "~/levels";

describe("Reset Stage Levels", () => {
    let fileSystem: FileSystem;
    let gitRepository: GitRepository;
    let levelManager: LevelManager;

    beforeEach(() => {
        fileSystem = new FileSystem();
        gitRepository = new GitRepository(fileSystem);
        levelManager = new LevelManager();
    });

    describe("Stage Metadata", () => {
        it("should have correct stage metadata", () => {
            const stage = allStages.Reset;

            expect(stage.id).toBe("reset");
            expect(stage.name).toBe("reset.name");
            expect(stage.icon).toBe("↩️");
        });
    });

    describe("All Levels", () => {
        it("should load and setup each level without errors", () => {
            const stage = allStages.Reset;
            const levelIds = Object.keys(stage.levels).map(Number);

            levelIds.forEach(levelId => {
                // Reset for each level
                fileSystem = new FileSystem();
                gitRepository = new GitRepository(fileSystem);

                const success = levelManager.setupLevel("reset", levelId, fileSystem, gitRepository);
                expect(success).toBe(true);

                // Verify level is properly set up
                const level = stage.levels[levelId];
                if (!level) return;

                // If level requires git initialized, check it
                if (level.initialState?.git?.initialized) {
                    expect(gitRepository.isInitialized()).toBe(true);
                }

                // Reset levels should have multiple commits
                if (level.initialState?.git?.commits) {
                    expect(level.initialState.git.commits.length).toBeGreaterThan(1);
                }
            });
        });

        it("should have valid reset-related requirements", () => {
            const stage = allStages.Reset;
            const levelIds = Object.keys(stage.levels).map(Number);

            let hasResetCommands = false;

            levelIds.forEach(levelId => {
                const level = stage.levels[levelId];
                if (!level) return;

                level.requirements.forEach(req => {
                    if (req.command === "git reset") {
                        hasResetCommands = true;
                    }
                });
            });

            expect(hasResetCommands).toBe(true);
        });
    });

    describe("Reset Level 1 - Soft Reset", () => {
        it("should setup level with multiple commits", () => {
            const success = levelManager.setupLevel("reset", 1, fileSystem, gitRepository);
            expect(success).toBe(true);

            expect(gitRepository.isInitialized()).toBe(true);
            expect(gitRepository.getCurrentBranch()).toBe("main");
        });

        it("should have files from commits", () => {
            levelManager.setupLevel("reset", 1, fileSystem, gitRepository);

            expect(fileSystem.getFileContents("/README.md")).toBeTruthy();
            expect(fileSystem.getFileContents("/src/app.js")).toBeTruthy();
        });
    });

    describe("Reset Level 2 - Hard Reset", () => {
        it("should setup level with buggy version", () => {
            const success = levelManager.setupLevel("reset", 2, fileSystem, gitRepository);
            expect(success).toBe(true);

            expect(gitRepository.isInitialized()).toBe(true);
        });
    });

    describe("Reset Level 3 - Reset to Specific Commit", () => {
        it("should setup level with multiple commits in history", () => {
            const success = levelManager.setupLevel("reset", 3, fileSystem, gitRepository);
            expect(success).toBe(true);

            expect(gitRepository.isInitialized()).toBe(true);
        });
    });

    describe("Level Translations", () => {
        it("should have all required translation keys for each level", () => {
            const stage = allStages.Reset;
            const levelIds = Object.keys(stage.levels).map(Number);

            levelIds.forEach(levelId => {
                const level = stage.levels[levelId];
                if (!level) return;

                // Check basic translations exist
                expect(level.name).toBeTruthy();
                expect(level.description).toBeTruthy();
                expect(level.objectives.length).toBeGreaterThan(0);
                expect(level.hints.length).toBeGreaterThan(0);

                // Check story exists
                if (level.story) {
                    expect(level.story.title).toBeTruthy();
                    expect(level.story.narrative).toBeTruthy();
                    expect(level.story.realWorldContext).toBeTruthy();
                    expect(level.story.taskIntroduction).toBeTruthy();
                }

                // Check requirements
                expect(level.requirements.length).toBeGreaterThan(0);
                level.requirements.forEach(req => {
                    expect(req.description).toBeTruthy();
                });
            });
        });
    });
});
