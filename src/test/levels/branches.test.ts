import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { LevelManager } from "~/models/LevelManager";
import { allStages } from "~/levels";

describe("Branches Stage Levels", () => {
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
            const stage = allStages.Branches;

            expect(stage.id).toBe("branches");
            expect(stage.name).toBe("branches.name");
            expect(stage.icon).toBe("🌿");
        });
    });

    describe("All Levels", () => {
        it("should load and setup each level without errors", () => {
            const stage = allStages.Branches;
            const levelIds = Object.keys(stage.levels).map(Number);

            levelIds.forEach(levelId => {
                // Reset for each level
                fileSystem = new FileSystem();
                gitRepository = new GitRepository(fileSystem);

                const success = levelManager.setupLevel("branches", levelId, fileSystem, gitRepository);
                expect(success).toBe(true);

                // Verify level is properly set up
                const level = stage.levels[levelId];
                if (!level) return;

                // If level requires git initialized, check it
                if (level.initialState?.git?.initialized) {
                    expect(gitRepository.isInitialized()).toBe(true);
                }
            });
        });

        it("should have valid branch-related requirements", () => {
            const stage = allStages.Branches;
            const levelIds = Object.keys(stage.levels).map(Number);

            let hasBranchCommands = false;

            levelIds.forEach(levelId => {
                const level = stage.levels[levelId];
                if (!level) return;

                level.requirements.forEach(req => {
                    if (req.command.includes("branch") ||
                        req.command.includes("checkout") ||
                        req.command.includes("switch")) {
                        hasBranchCommands = true;
                    }
                });
            });

            expect(hasBranchCommands).toBe(true);
        });
    });
});
