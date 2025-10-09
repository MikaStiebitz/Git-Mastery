import { describe, it, expect, beforeEach } from "vitest";
import { LevelManager } from "../models/LevelManager";
import { FileSystem } from "../models/FileSystem";
import { GitRepository } from "../models/GitRepository";

describe("Debug git pull matching", () => {
    let levelManager: LevelManager;
    let fileSystem: FileSystem;
    let gitRepository: GitRepository;

    beforeEach(() => {
        levelManager = new LevelManager();
        fileSystem = new FileSystem();
        gitRepository = new GitRepository(fileSystem);

        // Setup teamwork level 2
        levelManager.setupLevel("teamwork", 2, fileSystem, gitRepository);
    });

    it("should match 'git pull' command", () => {
        // Simulate the command parsing that happens in GameContext
        const userInput = "git pull";
        const [cmd, ...args] = userInput.trim().split(/\s+/);

        console.log("User input:", userInput);
        console.log("Parsed cmd:", cmd);
        console.log("Parsed args:", args);

        // Check remotes
        console.log("Remotes:", gitRepository.getRemotes());

        // Complete first two requirements first
        gitRepository.addFile("/src/auth/login.js");
        levelManager.checkLevelCompletion("teamwork", 2, "git", ["add", "/src/auth/login.js"], gitRepository);

        gitRepository.commit("Test commit");
        levelManager.checkLevelCompletion("teamwork", 2, "git", ["commit", "-m", "Test commit"], gitRepository);

        // Now try git pull
        levelManager.checkLevelCompletion("teamwork", 2, cmd ?? "git", args, gitRepository);

        // Check the level state
        const level = levelManager.getLevel("teamwork", 2);
        console.log("Completed requirements:", level?.completedRequirements);
        console.log("All requirements:", level?.requirements.map(r => r.id));

        // The pull requirement should be completed
        expect(level?.completedRequirements).toContain("pull-remote-changes");
    });    it("should match 'git pull origin main' command", () => {
        // Simulate the command parsing that happens in GameContext
        const userInput = "git pull origin main";
        const [cmd, ...args] = userInput.trim().split(/\s+/);

        console.log("User input:", userInput);
        console.log("Parsed cmd:", cmd);
        console.log("Parsed args:", args);

        // Complete first two requirements first
        gitRepository.addFile("/src/auth/login.js");
        levelManager.checkLevelCompletion("teamwork", 2, "git", ["add", "/src/auth/login.js"], gitRepository);

        gitRepository.commit("Test commit");
        levelManager.checkLevelCompletion("teamwork", 2, "git", ["commit", "-m", "Test commit"], gitRepository);

        // Now try git pull origin main
        levelManager.checkLevelCompletion("teamwork", 2, cmd ?? "git", args, gitRepository);

        // Check the level state
        const level = levelManager.getLevel("teamwork", 2);
        console.log("Completed requirements:", level?.completedRequirements);
        console.log("All requirements:", level?.requirements.map(r => r.id));

        // The pull requirement should be completed
        expect(level?.completedRequirements).toContain("pull-remote-changes");
    });
});
