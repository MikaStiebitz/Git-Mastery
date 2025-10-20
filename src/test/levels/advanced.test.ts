import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { LevelManager } from "~/models/LevelManager";
import { allStages } from "~/levels";

describe("Advanced Stage Levels", () => {
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
            const stage = allStages.Advanced;

            expect(stage.id).toBe("advanced");
            // Name can be either translation key or translated text
            expect(stage.name).toBeDefined();
            expect(typeof stage.name).toBe("string");
            expect(stage.icon).toBe("⚡");
        });
    });

    describe("All Levels", () => {
        it("should load and setup each level without errors", () => {
            const stage = allStages.Advanced;
            const levelIds = Object.keys(stage.levels).map(Number);

            expect(levelIds.length).toBeGreaterThan(0);

            levelIds.forEach(levelId => {
                fileSystem = new FileSystem();
                gitRepository = new GitRepository(fileSystem);

                const success = levelManager.setupLevel("advanced", levelId, fileSystem, gitRepository);
                expect(success).toBe(true);
            });
        });

        it("should have advanced git commands", () => {
            const stage = allStages.Advanced;
            const levelIds = Object.keys(stage.levels).map(Number);

            const advancedCommands = [
                "cherry-pick",
                "revert",
                "bisect",
                "reflog",
                "stash",
                "tag",
            ];

            let hasAdvancedCommands = false;

            levelIds.forEach(levelId => {
                const level = stage.levels[levelId];
                if (!level) return;

                level.requirements.forEach(req => {
                    advancedCommands.forEach(cmd => {
                        if (req.command.includes(cmd)) {
                            hasAdvancedCommands = true;
                        }
                    });
                });
            });

            expect(hasAdvancedCommands).toBe(true);
        });
    });
});
