import { describe, it, expect, beforeEach } from "vitest";
import { RebaseCommand } from "~/commands/git/RebaseCommand";
import { parseCommand } from "~/commands/base/CommandParser";
import { createTestContext, setupInitializedRepo } from "../test-utils";
import type { CommandContext } from "~/commands/base/Command";

describe("RebaseCommand - upstream resolution (issue #69)", () => {
    let context: CommandContext;
    const command = new RebaseCommand();

    beforeEach(() => {
        context = createTestContext();
        setupInitializedRepo(context);

        // Create additional commits so HEAD~n and hash targets exist
        context.fileSystem.writeFile("/a.txt", "a");
        context.gitRepository.updateFileStatus("a.txt", "untracked");
        context.gitRepository.addFile("a.txt");
        context.gitRepository.commit("Second commit");

        context.fileSystem.writeFile("/b.txt", "b");
        context.gitRepository.updateFileStatus("b.txt", "untracked");
        context.gitRepository.addFile("b.txt");
        context.gitRepository.commit("Third commit");
    });

    const run = (input: string): string[] => {
        const { args } = parseCommand(input, command.flagSpec);
        return command.execute(args, context);
    };

    it("should accept a full commit hash as upstream", () => {
        const history = context.gitRepository.getCommitHistory();
        const target = history[0]!;
        const output = run(`git rebase -i ${target}`);

        // -i opens the todo list in the editor, as real Git does.
        expect(output[0]).toContain("Waiting for your editor");
        expect(output.join("\n")).not.toContain("fatal");
        expect(context.gitRepository.getRebaseState()?.awaitingTodo).toBe(true);
    });

    it("should accept a short commit hash as shown by git log --oneline", () => {
        const history = context.gitRepository.getCommitHistory();
        const shortHash = history[0]!.substring(0, 7);
        const output = run(`git rebase -i ${shortHash}`);

        // -i opens the todo list in the editor, as real Git does.
        expect(output[0]).toContain("Waiting for your editor");
        expect(output.join("\n")).not.toContain("fatal");
        expect(context.gitRepository.getRebaseState()?.awaitingTodo).toBe(true);
    });

    it("should accept HEAD~n as upstream", () => {
        const output = run("git rebase -i HEAD~2");

        // -i opens the todo list in the editor, as real Git does.
        expect(output[0]).toContain("Waiting for your editor");
        expect(output.join("\n")).not.toContain("fatal");
        expect(context.gitRepository.getRebaseState()?.awaitingTodo).toBe(true);
    });

    it("should still accept a branch name as upstream", () => {
        context.gitRepository.createBranch("feature");
        context.gitRepository.checkout("feature");
        const output = run("git rebase main");

        // feature already sits on main, so there is nothing to replay.
        expect(output).toEqual(["Current branch feature is up to date."]);
    });

    it("should reject an unknown hash", () => {
        const output = run("git rebase -i ffffffff");

        expect(output[0]).toBe("fatal: invalid upstream 'ffffffff'");
    });

    it("should reject HEAD~n beyond history length", () => {
        const output = run("git rebase -i HEAD~99");

        expect(output[0]).toBe("fatal: invalid upstream 'HEAD~99'");
    });

    it("reports a branch rebased onto itself as up to date, like real Git", () => {
        const output = run("git rebase main");

        expect(output).toEqual(["Current branch main is up to date."]);
    });
});
