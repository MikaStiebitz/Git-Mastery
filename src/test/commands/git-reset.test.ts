import { describe, it, expect, beforeEach } from "vitest";
import { ResetCommand } from "~/commands/git/ResetCommand";
import { AddCommand } from "~/commands/git/AddCommand";
import { CommitCommand } from "~/commands/git/CommitCommand";
import { InitCommand } from "~/commands/git/InitCommand";
import { createTestContext } from "~/test/test-utils";
import type { CommandContext } from "~/commands/base/Command";

describe("Git Reset Commands", () => {
    let context: CommandContext;
    let resetCmd: ResetCommand;
    let addCmd: AddCommand;
    let commitCmd: CommitCommand;

    beforeEach(() => {
        context = createTestContext();
        resetCmd = new ResetCommand();
        addCmd = new AddCommand();
        commitCmd = new CommitCommand();

        // Initialize git repository
        const initCmd = new InitCommand();
        initCmd.execute({ args: [], flags: {}, positionalArgs: [] }, context);
    });

    describe("git reset --soft", () => {
        it("should remove last commit but keep changes staged", () => {
            // Setup: Create 3 commits
            context.fileSystem.writeFile("/file1.txt", "content1");
            addCmd.execute({ args: ["file1.txt"], flags: {}, positionalArgs: ["file1.txt"] }, context);
            commitCmd.execute({ args: ["-m", "First commit"], flags: { m: "First commit" }, positionalArgs: [] }, context);

            context.fileSystem.writeFile("/file2.txt", "content2");
            addCmd.execute({ args: ["file2.txt"], flags: {}, positionalArgs: ["file2.txt"] }, context);
            commitCmd.execute({ args: ["-m", "Second commit"], flags: { m: "Second commit" }, positionalArgs: [] }, context);

            context.fileSystem.writeFile("/file3.txt", "content3");
            addCmd.execute({ args: ["file3.txt"], flags: {}, positionalArgs: ["file3.txt"] }, context);
            commitCmd.execute({ args: ["-m", "Third commit"], flags: { m: "Third commit" }, positionalArgs: [] }, context);

            // Verify we have 3 commits
            const commitsBefore = context.gitRepository.getCommitHistory();
            console.log("Commits before reset:", commitsBefore);
            expect(commitsBefore.length).toBe(3);

            // Execute: git reset --soft HEAD~1 (undo last commit)
            const result = resetCmd.execute({ args: ["--soft", "HEAD~1"], flags: { soft: true }, positionalArgs: ["HEAD~1"] }, context);
            console.log("Reset result:", result);

            // Verify: Should have 2 commits now
            const commitsAfter = context.gitRepository.getCommitHistory();
            console.log("Commits after reset:", commitsAfter);
            expect(commitsAfter.length).toBe(2);

            // Verify: file3.txt should be staged
            const status = context.gitRepository.getStatus();
            console.log("Status after reset:", status);
            expect(status["file3.txt"]).toBe("staged");
        });

        it("should handle HEAD~2 to remove multiple commits", () => {
            // Setup: Create 5 commits
            for (let i = 1; i <= 5; i++) {
                context.fileSystem.writeFile(`/file${i}.txt`, `content${i}`);
                addCmd.execute({ args: [`file${i}.txt`], flags: {}, positionalArgs: [`file${i}.txt`] }, context);
                commitCmd.execute({ args: ["-m", `Commit ${i}`], flags: { m: `Commit ${i}` }, positionalArgs: [] }, context);
            }

            const commitsBefore = context.gitRepository.getCommitHistory();
            console.log("Commits before reset:", commitsBefore);
            expect(commitsBefore.length).toBe(5);

            // Execute: git reset --soft HEAD~2
            const result = resetCmd.execute({ args: ["--soft", "HEAD~2"], flags: { soft: true }, positionalArgs: ["HEAD~2"] }, context);
            console.log("Reset result:", result);

            // Verify: Should have 3 commits now
            const commitsAfter = context.gitRepository.getCommitHistory();
            console.log("Commits after reset:", commitsAfter);
            expect(commitsAfter.length).toBe(3);
        });

        it("should handle reset to HEAD (no change)", () => {
            // Setup
            context.fileSystem.writeFile("/file1.txt", "content1");
            addCmd.execute({ args: ["file1.txt"], flags: {}, positionalArgs: ["file1.txt"] }, context);
            commitCmd.execute({ args: ["-m", "First commit"], flags: { m: "First commit" }, positionalArgs: [] }, context);

            const commitsBefore = context.gitRepository.getCommitHistory();
            expect(commitsBefore.length).toBe(1);

            // Execute: git reset --soft HEAD
            resetCmd.execute({ args: ["--soft", "HEAD"], flags: { soft: true }, positionalArgs: ["HEAD"] }, context);

            // Verify: Still 1 commit
            const commitsAfter = context.gitRepository.getCommitHistory();
            expect(commitsAfter.length).toBe(1);
        });
    });

    describe("git reset --hard", () => {
        it("should remove last commit and discard all changes", () => {
            // Setup: Create 3 commits
            context.fileSystem.writeFile("/file1.txt", "content1");
            addCmd.execute({ args: ["file1.txt"], flags: {}, positionalArgs: ["file1.txt"] }, context);
            commitCmd.execute({ args: ["-m", "First commit"], flags: { m: "First commit" }, positionalArgs: [] }, context);

            context.fileSystem.writeFile("/file2.txt", "content2");
            addCmd.execute({ args: ["file2.txt"], flags: {}, positionalArgs: ["file2.txt"] }, context);
            commitCmd.execute({ args: ["-m", "Second commit"], flags: { m: "Second commit" }, positionalArgs: [] }, context);

            context.fileSystem.writeFile("/file3.txt", "content3");
            addCmd.execute({ args: ["file3.txt"], flags: {}, positionalArgs: ["file3.txt"] }, context);
            commitCmd.execute({ args: ["-m", "Third commit"], flags: { m: "Third commit" }, positionalArgs: [] }, context);

            const commitsBefore = context.gitRepository.getCommitHistory();
            console.log("Commits before reset:", commitsBefore);
            expect(commitsBefore.length).toBe(3);

            // Execute: git reset --hard HEAD~1
            const result = resetCmd.execute({ args: ["--hard", "HEAD~1"], flags: { hard: true }, positionalArgs: ["HEAD~1"] }, context);
            console.log("Reset result:", result);

            // Verify: Should have 2 commits now
            const commitsAfter = context.gitRepository.getCommitHistory();
            console.log("Commits after reset:", commitsAfter);
            expect(commitsAfter.length).toBe(2);

            // Verify: file3.txt should be gone (not in status)
            const status = context.gitRepository.getStatus();
            console.log("Status after reset:", status);
            expect(status["file3.txt"]).toBeUndefined();
        });

        it("should handle HEAD~2 to remove multiple commits", () => {
            // Setup: Create 6 commits
            for (let i = 1; i <= 6; i++) {
                context.fileSystem.writeFile(`/file${i}.txt`, `content${i}`);
                addCmd.execute({ args: [`file${i}.txt`], flags: {}, positionalArgs: [`file${i}.txt`] }, context);
                commitCmd.execute({ args: ["-m", `Commit ${i}`], flags: { m: `Commit ${i}` }, positionalArgs: [] }, context);
            }

            const commitsBefore = context.gitRepository.getCommitHistory();
            console.log("Commits before reset:", commitsBefore);
            expect(commitsBefore.length).toBe(6);

            // Execute: git reset --hard HEAD~2
            const result = resetCmd.execute({ args: ["--hard", "HEAD~2"], flags: { hard: true }, positionalArgs: ["HEAD~2"] }, context);
            console.log("Reset result:", result);

            // Verify: Should have 4 commits now
            const commitsAfter = context.gitRepository.getCommitHistory();
            console.log("Commits after reset:", commitsAfter);
            expect(commitsAfter.length).toBe(4);
        });

        it("should handle reset to HEAD (no change in commits)", () => {
            // Setup
            context.fileSystem.writeFile("/file1.txt", "content1");
            addCmd.execute({ args: ["file1.txt"], flags: {}, positionalArgs: ["file1.txt"] }, context);
            commitCmd.execute({ args: ["-m", "First commit"], flags: { m: "First commit" }, positionalArgs: [] }, context);

            const commitsBefore = context.gitRepository.getCommitHistory();
            expect(commitsBefore.length).toBe(1);

            // Execute: git reset --hard HEAD
            resetCmd.execute({ args: ["--hard", "HEAD"], flags: { hard: true }, positionalArgs: ["HEAD"] }, context);

            // Verify: Still 1 commit
            const commitsAfter = context.gitRepository.getCommitHistory();
            expect(commitsAfter.length).toBe(1);
        });
    });

    describe("git reset --mixed (default)", () => {
        it("should remove last commit and unstage changes", () => {
            // Setup
            context.fileSystem.writeFile("/file1.txt", "content1");
            addCmd.execute({ args: ["file1.txt"], flags: {}, positionalArgs: ["file1.txt"] }, context);
            commitCmd.execute({ args: ["-m", "First commit"], flags: { m: "First commit" }, positionalArgs: [] }, context);

            context.fileSystem.writeFile("/file2.txt", "content2");
            addCmd.execute({ args: ["file2.txt"], flags: {}, positionalArgs: ["file2.txt"] }, context);
            commitCmd.execute({ args: ["-m", "Second commit"], flags: { m: "Second commit" }, positionalArgs: [] }, context);

            const commitsBefore = context.gitRepository.getCommitHistory();
            expect(commitsBefore.length).toBe(2);

            // Execute: git reset HEAD~1 (mixed is default)
            resetCmd.execute({ args: ["HEAD~1"], flags: {}, positionalArgs: ["HEAD~1"] }, context);

            // Verify: Should have 1 commit now
            const commitsAfter = context.gitRepository.getCommitHistory();
            expect(commitsAfter.length).toBe(1);

            // Verify: file2.txt should be modified (unstaged)
            const status = context.gitRepository.getStatus();
            expect(status["file2.txt"]).toBe("modified");
        });
    });

    describe("git reset with commit hash", () => {
        it("should reset to specific commit by hash", () => {
            // Setup: Create 4 commits
            for (let i = 1; i <= 4; i++) {
                context.fileSystem.writeFile(`/file${i}.txt`, `content${i}`);
                addCmd.execute({ args: [`file${i}.txt`], flags: {}, positionalArgs: [`file${i}.txt`] }, context);
                commitCmd.execute({ args: ["-m", `Commit ${i}`], flags: { m: `Commit ${i}` }, positionalArgs: [] }, context);
            }

            const commitsBefore = context.gitRepository.getCommitHistory();
            expect(commitsBefore.length).toBe(4);

            // Get the second commit hash
            const secondCommitHash = commitsBefore[1];
            console.log("Resetting to commit:", secondCommitHash);

            // Execute: git reset --hard <commit-hash>
            resetCmd.execute({
                args: ["--hard", secondCommitHash?.substring(0, 7) ?? ""],
                flags: { hard: true },
                positionalArgs: [secondCommitHash?.substring(0, 7) ?? ""]
            }, context);

            // Verify: Should have 2 commits now
            const commitsAfter = context.gitRepository.getCommitHistory();
            console.log("Commits after reset:", commitsAfter);
            expect(commitsAfter.length).toBe(2);
        });
    });
});
