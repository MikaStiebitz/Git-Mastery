import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { LevelManager } from "~/models/LevelManager";
import { allStages } from "~/levels";
import { splitCommandRespectingQuotes } from "~/commands/base/CommandParser";

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

        it("should complete advanced level 2 with quoted --grep value", () => {
            const success = levelManager.setupLevel("advanced", 2, fileSystem, gitRepository);
            expect(success).toBe(true);

            const commands = [
                "git log --oneline",
                "git log --author=admin",
                "git log --grep='feature 2'",
            ];

            commands.forEach(command => {
                const parts = splitCommandRespectingQuotes(command);
                const cmd = parts[0] ?? "";
                const args = parts.slice(1);

                levelManager.checkLevelCompletion("advanced", 2, cmd, args, gitRepository);
            });

            const level = levelManager.getLevel("advanced", 2);
            expect(level?.completedRequirements).toContain("log-grep");
            expect(level?.completedRequirements).toContain("log-oneline");
            expect(level?.completedRequirements).toContain("log-author");
        });
    });
});
