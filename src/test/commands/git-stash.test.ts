import { describe, it, expect, beforeEach } from "vitest";
import { StashCommand } from "~/commands/git/StashCommand";
import { AddCommand } from "~/commands/git/AddCommand";
import { CommitCommand } from "~/commands/git/CommitCommand";
import { InitCommand } from "~/commands/git/InitCommand";
import { createTestContext } from "~/test/test-utils";
import type { CommandContext } from "~/commands/base/Command";

describe("Git Stash", () => {
    let context: CommandContext;
    let stashCommand: StashCommand;
    let addCmd: AddCommand;
    let commitCmd: CommitCommand;

    beforeEach(() => {
        context = createTestContext();
        stashCommand = new StashCommand();
        addCmd = new AddCommand();
        commitCmd = new CommitCommand();

        // Initialize git repository
        const initCmd = new InitCommand();
        initCmd.execute({ args: [], flags: {}, positionalArgs: [] }, context);
    });

    it("should stash modified files", () => {
        // Create and commit a file
        context.fileSystem.writeFile("/file1.txt", "original content");
        addCmd.execute({ args: ["file1.txt"], flags: {}, positionalArgs: ["file1.txt"] }, context);
        commitCmd.execute({ args: ["-m", "Initial commit"], flags: { m: "Initial commit" }, positionalArgs: [] }, context);

        // Modify the file
        context.fileSystem.writeFile("/file1.txt", "modified content");
        // Update git status to mark file as modified
        context.gitRepository.updateFileStatus("file1.txt", "modified");

        // Verify file is modified
        const statusBefore = context.gitRepository.getStatus();
        expect(statusBefore["file1.txt"]).toBe("modified");

        // Stash changes
        const result = stashCommand.execute(
            { args: [], flags: {}, positionalArgs: [] },
            context
        );

        console.log("Stash result:", result);
        expect(result[0]).toContain("Saved working directory");

        // Verify file is back to original content
        const content = context.fileSystem.getFileContents("/file1.txt");
        console.log("File content after stash:", content);
        expect(content).toBe("original content");

        // Verify status is clean
        const statusAfter = context.gitRepository.getStatus();
        console.log("Status after stash:", statusAfter);
        expect(statusAfter["file1.txt"]).toBeUndefined();
    });

    it("should pop stashed changes and restore files", () => {
        // Create and commit a file
        context.fileSystem.writeFile("/file1.txt", "original content");
        addCmd.execute({ args: ["file1.txt"], flags: {}, positionalArgs: ["file1.txt"] }, context);
        commitCmd.execute({ args: ["-m", "Initial commit"], flags: { m: "Initial commit" }, positionalArgs: [] }, context);

        // Modify the file
        context.fileSystem.writeFile("/file1.txt", "modified content");
        context.gitRepository.updateFileStatus("file1.txt", "modified");
        context.gitRepository.stashSave();

        // Verify file is back to original
        expect(context.fileSystem.getFileContents("/file1.txt")).toBe("original content");

        // Pop stashed changes
        const result = stashCommand.execute(
            { args: ["pop"], flags: {}, positionalArgs: ["pop"] },
            context
        );

        console.log("Pop output:", result);

        // Verify the output shows the modified file
        const output = result.join("\n");
        expect(output).toContain("On branch main");
        expect(output).toContain("modified:   file1.txt");
        expect(output).toContain("Dropped refs/stash@{0}");

        // Verify file content is restored
        const content = context.fileSystem.getFileContents("/file1.txt");
        expect(content).toBe("modified content");

        // Verify status shows modified
        const status = context.gitRepository.getStatus();
        expect(status["file1.txt"]).toBe("modified");
    });

    it("should stash multiple files", () => {
        // Create and commit files
        context.fileSystem.writeFile("/file1.txt", "content 1");
        context.fileSystem.writeFile("/file2.txt", "content 2");
        addCmd.execute({ args: ["file1.txt"], flags: {}, positionalArgs: ["file1.txt"] }, context);
        addCmd.execute({ args: ["file2.txt"], flags: {}, positionalArgs: ["file2.txt"] }, context);
        commitCmd.execute({ args: ["-m", "Initial commit"], flags: { m: "Initial commit" }, positionalArgs: [] }, context);

        // Modify both files
        context.fileSystem.writeFile("/file1.txt", "modified 1");
        context.fileSystem.writeFile("/file2.txt", "modified 2");
        context.gitRepository.updateFileStatus("file1.txt", "modified");
        context.gitRepository.updateFileStatus("file2.txt", "modified");

        // Stash changes
        context.gitRepository.stashSave();

        // Verify both files are back to original
        expect(context.fileSystem.getFileContents("/file1.txt")).toBe("content 1");
        expect(context.fileSystem.getFileContents("/file2.txt")).toBe("content 2");

        // Pop changes
        const result = context.gitRepository.stashApply(true);
        expect(result.success).toBe(true);
        expect(result.files).toContain("file1.txt");
        expect(result.files).toContain("file2.txt");

        // Verify both files are restored
        expect(context.fileSystem.getFileContents("/file1.txt")).toBe("modified 1");
        expect(context.fileSystem.getFileContents("/file2.txt")).toBe("modified 2");
    });

    it("should return error when no changes to stash", () => {
        // Initialize repo but don't make any changes
        const result = stashCommand.execute(
            { args: [], flags: {}, positionalArgs: [] },
            context
        );

        expect(result[0]).toBe("No local changes to save");
    });

    it("should return error when popping empty stash", () => {
        const result = stashCommand.execute(
            { args: ["pop"], flags: {}, positionalArgs: ["pop"] },
            context
        );

        expect(result[0]).toBe("No stash entries found.");
    });

    it("should apply without removing from stash", () => {
        // Create and commit a file
        context.fileSystem.writeFile("/file1.txt", "original content");
        addCmd.execute({ args: ["file1.txt"], flags: {}, positionalArgs: ["file1.txt"] }, context);
        commitCmd.execute({ args: ["-m", "Initial commit"], flags: { m: "Initial commit" }, positionalArgs: [] }, context);

        // Modify and stash
        context.fileSystem.writeFile("/file1.txt", "modified content");
        context.gitRepository.updateFileStatus("file1.txt", "modified");
        context.gitRepository.stashSave();

        // Apply (not pop)
        const result = stashCommand.execute(
            { args: ["apply"], flags: {}, positionalArgs: ["apply"] },
            context
        );

        const output = result.join("\n");
        expect(output).toContain("modified:   file1.txt");
        expect(output).not.toContain("Dropped");

        // Verify file is restored
        expect(context.fileSystem.getFileContents("/file1.txt")).toBe("modified content");

        // Verify stash still has entry (not removed)
        const stashList = context.gitRepository.getStash();
        expect(stashList.length).toBe(1);
    });
});
