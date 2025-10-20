import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { CommandProcessor } from "~/models/CommandProcessor";
import { ProgressManager } from "~/models/ProgressManager";

describe("git add", () => {
    let fileSystem: FileSystem;
    let gitRepository: GitRepository;
    let commandProcessor: CommandProcessor;

    beforeEach(() => {
        fileSystem = new FileSystem();
        gitRepository = new GitRepository(fileSystem);
        const progressManager = new ProgressManager();
        commandProcessor = new CommandProcessor(fileSystem, gitRepository, progressManager, "/");

        // Initialize git repo
        commandProcessor.processCommand("git init");
    });

    it("should only stage modified files with 'git add .'", () => {
        // Create and commit initial files
        fileSystem.writeFile("/file1.txt", "content1");
        fileSystem.writeFile("/file2.txt", "content2");
        commandProcessor.processCommand("git add .");
        commandProcessor.processCommand("git commit -m 'Initial commit'");

        // Modify one file
        fileSystem.writeFile("/file1.txt", "modified content");
        gitRepository.updateFileStatus("file1.txt", "modified");

        // Try to stage all changes
        const result = commandProcessor.processCommand("git add .");

        // Should only stage the modified file
        const status = gitRepository.getStatus();
        expect(status["file1.txt"]).toBe("staged");
        expect(status["file2.txt"]).toBeUndefined(); // file2 should not be staged since it's not modified
        expect(result.join(" ")).toContain("Added 1 files to staging area");
    });

    it("should show 'No changes to add' when no files are modified", () => {
        // Create and commit files
        fileSystem.writeFile("/file1.txt", "content1");
        commandProcessor.processCommand("git add .");
        commandProcessor.processCommand("git commit -m 'Initial commit'");

        // Try to stage when nothing is modified
        const result = commandProcessor.processCommand("git add .");

        expect(result.join(" ")).toContain("No changes to add");
    });

    it("should stage untracked files with 'git add .'", () => {
        // Create an untracked file
        fileSystem.writeFile("/newfile.txt", "new content");
        gitRepository.updateFileStatus("newfile.txt", "untracked");

        // Stage all changes
        const result = commandProcessor.processCommand("git add .");

        // Should stage the untracked file
        const status = gitRepository.getStatus();
        expect(status["newfile.txt"]).toBe("staged");
        expect(result.join(" ")).toContain("Added 1 files to staging area");
    });

    it("should preserve modified files when creating a new branch with 'git switch -c'", () => {
        // Create and commit initial files
        fileSystem.writeFile("/file1.txt", "original content");
        commandProcessor.processCommand("git add .");
        commandProcessor.processCommand("git commit -m 'Initial commit'");

        // Modify a file
        fileSystem.writeFile("/file1.txt", "modified content");
        gitRepository.updateFileStatus("file1.txt", "modified");

        // Verify file is modified
        let status = gitRepository.getStatus();
        expect(status["file1.txt"]).toBe("modified");

        // Create a new branch (should preserve modified files)
        const switchResult = commandProcessor.processCommand("git switch -c feature-branch");
        expect(switchResult.join(" ")).toContain("Switched to a new branch 'feature-branch'");

        // Verify modified file is still present in new branch
        status = gitRepository.getStatus();
        expect(status["file1.txt"]).toBe("modified");

        // File content should be preserved
        const content = fileSystem.getFileContents("/file1.txt");
        expect(content).toBe("modified content");

        // Should be able to stage the modified file
        const addResult = commandProcessor.processCommand("git add .");
        expect(addResult.join(" ")).toContain("Added 1 files to staging area");

        // Verify file is now staged
        status = gitRepository.getStatus();
        expect(status["file1.txt"]).toBe("staged");
    });
});
