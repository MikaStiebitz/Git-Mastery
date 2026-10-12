import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";

describe("GitRepository - Unmerged Commits Detection", () => {
    let fileSystem: FileSystem;
    let gitRepository: GitRepository;

    beforeEach(() => {
        fileSystem = new FileSystem();
        gitRepository = new GitRepository(fileSystem);
        gitRepository.init();
    });

    it("should detect unmerged commits in feature branch", () => {
        // Setup: Make initial commit on main
        fileSystem.writeFile("/README.md", "# Initial");
        gitRepository.addFile("README.md");
        gitRepository.commit("Initial commit");

        // Create feature branch and add commit
        gitRepository.createBranch("feature");
        gitRepository.checkout("feature");
        fileSystem.writeFile("/feature.txt", "Feature work");
        gitRepository.addFile("feature.txt");
        gitRepository.commit("Add feature");

        // Switch back to main
        gitRepository.checkout("main");

        // Feature branch should have unmerged commits
        expect(gitRepository.hasUnmergedCommits("feature")).toBe(true);
    });

    it("should not detect unmerged commits after merge", () => {
        // Setup
        fileSystem.writeFile("/README.md", "# Initial");
        gitRepository.addFile("README.md");
        gitRepository.commit("Initial commit");

        // Create feature with commit
        gitRepository.createBranch("feature");
        gitRepository.checkout("feature");
        fileSystem.writeFile("/feature.txt", "Feature");
        gitRepository.addFile("feature.txt");
        gitRepository.commit("Feature commit");

        // Merge into main
        gitRepository.checkout("main");
        gitRepository.merge("feature");

        // After merge, feature should not have unmerged commits
        expect(gitRepository.hasUnmergedCommits("feature")).toBe(false);
    });

    it("should not detect unmerged commits in empty branch", () => {
        // Make initial commit
        fileSystem.writeFile("/README.md", "# Initial");
        gitRepository.addFile("README.md");
        gitRepository.commit("Initial commit");

        // Create new branch without commits
        gitRepository.createBranch("empty-feature");

        // Empty branch should not have unmerged commits
        expect(gitRepository.hasUnmergedCommits("empty-feature")).toBe(false);
    });

    it("should detect unmerged commits in diverged branches", () => {
        // Initial commit
        fileSystem.writeFile("/README.md", "# Initial");
        gitRepository.addFile("README.md");
        gitRepository.commit("Initial commit");

        // Create feature branch with commit
        gitRepository.createBranch("feature");
        gitRepository.checkout("feature");
        fileSystem.writeFile("/feature.txt", "Feature");
        gitRepository.addFile("feature.txt");
        gitRepository.commit("Feature commit");

        // Go back to main and make different commit
        gitRepository.checkout("main");
        fileSystem.writeFile("/main.txt", "Main work");
        gitRepository.addFile("main.txt");
        gitRepository.commit("Main commit");

        // Feature should still have unmerged commits (its own commits)
        expect(gitRepository.hasUnmergedCommits("feature")).toBe(true);
    });
});
