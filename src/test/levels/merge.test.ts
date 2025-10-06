import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { LevelManager } from "~/models/LevelManager";
import { allStages } from "~/levels";

describe("Merge Stage Levels", () => {
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
            const stage = allStages.Merge;

            expect(stage.id).toBe("merge");
            expect(stage.name).toBe("merge.name");
            expect(stage.icon).toBe("🔀");
        });
    });

    describe("All Levels", () => {
        it("should load and setup each level without errors", () => {
            const stage = allStages.Merge;
            const levelIds = Object.keys(stage.levels).map(Number);

            expect(levelIds.length).toBeGreaterThan(0);

            levelIds.forEach(levelId => {
                fileSystem = new FileSystem();
                gitRepository = new GitRepository(fileSystem);

                const success = levelManager.setupLevel("merge", levelId, fileSystem, gitRepository);
                expect(success).toBe(true);
            });
        });

        it("should have merge-related commands", () => {
            const stage = allStages.Merge;
            const levelIds = Object.keys(stage.levels).map(Number);

            let hasMergeCommands = false;

            levelIds.forEach(levelId => {
                const level = stage.levels[levelId];
                if (!level) return;

                level.requirements.forEach(req => {
                    if (req.command.includes("merge")) {
                        hasMergeCommands = true;
                    }
                });
            });

            expect(hasMergeCommands).toBe(true);
        });
    });
});
