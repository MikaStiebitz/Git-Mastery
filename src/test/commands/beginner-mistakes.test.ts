import { describe, it, expect, beforeEach } from "vitest";
import registry from "~/commands";
import { createTestContext, setupInitializedRepo } from "~/test/test-utils";
import type { CommandContext } from "~/commands/base/Command";

/**
 * The commands a beginner actually types.
 *
 * Every case here is a real mistake someone makes when they are not copying the level text
 * character by character: a typo, a flag in the wrong place, their own branch name, a message
 * without -m. Each one must produce the error real Git produces, and a hint that says what to do.
 */
describe("beginner mistakes", () => {
    let context: CommandContext;

    const run = (command: string) => registry.execute(command, context).join("\n");

    beforeEach(() => {
        context = createTestContext();
        setupInitializedRepo(context);
    });

    describe("mistyped commands", () => {
        it("suggests status for 'git stauts'", () => {
            const output = run("git stauts");

            expect(output).toContain("git: 'stauts' is not a git command. See 'git --help'.");
            expect(output).toContain("status");
        });

        it("suggests commit for 'git comit'", () => {
            const output = run("git comit -m 'x'");

            expect(output).toContain("is not a git command");
            expect(output).toContain("commit");
        });

        it("suggests switch for 'git swithc'", () => {
            const output = run("git swithc main");

            expect(output).toContain("is not a git command");
            expect(output).toContain("switch");
        });

        it("suggests branch for 'git brnach'", () => {
            const output = run("git brnach");

            expect(output).toContain("is not a git command");
            expect(output).toContain("branch");
        });

        it("points at help when nothing is close", () => {
            const output = run("git zzzzzzzz");

            expect(output).toContain("is not a git command");
            expect(output).toContain("hint:");
        });

        it("reports a non-git command the way a shell does", () => {
            const output = run("gti status");

            expect(output).toContain("gti: command not found");
        });
    });

    describe("mistyped flags", () => {
        it("rejects an unknown short flag instead of ignoring it", () => {
            const output = run("git branch -x feature");

            expect(output).toContain("error: unknown switch `x'");
            expect(output).toContain("usage: git branch");
            // The branch must NOT have been created as a side effect.
            expect(context.gitRepository.getBranches()).not.toContain("feature");
        });

        it("rejects an unknown long flag", () => {
            const output = run("git commit --mesage hello");

            expect(output).toContain("error: unknown option `mesage'");
        });
    });

    describe("flags in the order people type them", () => {
        it("deletes the branch for 'git branch Feature -D' when it exists", () => {
            context.gitRepository.createBranch("Feature");

            const output = run("git branch Feature -D");

            expect(output).toContain("Deleted branch Feature");
            expect(context.gitRepository.getBranches()).not.toContain("Feature");
        });

        it("explains case sensitivity for 'git branch Feature -D' when only 'feature' exists", () => {
            context.gitRepository.createBranch("feature");

            const output = run("git branch Feature -D");

            expect(output).toContain("error: branch 'Feature' not found.");
            expect(output).toContain("case-sensitive");
            expect(output).toContain("'feature'");
            // The lowercase branch must survive.
            expect(context.gitRepository.getBranches()).toContain("feature");
        });

        it("suggests a near miss for a misspelt branch name", () => {
            context.gitRepository.createBranch("feature-login");

            const output = run("git branch -d featrue-login");

            expect(output).toContain("not found");
            expect(output).toContain("feature-login");
        });
    });

    describe("git branch -c is a copy, not a create-and-switch", () => {
        it("copies the current branch and says so", () => {
            const output = run("git branch -c backup");

            expect(context.gitRepository.getBranches()).toContain("backup");
            // A copy does not move you onto the new branch.
            expect(context.gitRepository.getCurrentBranch()).toBe("main");
            expect(output).toContain("git switch -c backup");
        });

        it("no longer silently lists branches", () => {
            const output = run("git branch -c backup");

            expect(output).not.toMatch(/^\* main$/);
        });
    });

    describe("git commit without -m", () => {
        it("reports a pathspec error and teaches -m", () => {
            context.fileSystem.writeFile("/notes.txt", "hello");
            context.gitRepository.addFile("/notes.txt");

            const output = run('git commit "my first commit"');

            expect(output).toContain("fatal: pathspec 'my first commit' did not match any files");
            expect(output).toContain('git commit -m "my first commit"');
        });

        it("does not create a commit from the stray argument", () => {
            context.fileSystem.writeFile("/notes.txt", "hello");
            context.gitRepository.addFile("/notes.txt");
            const before = Object.keys(context.gitRepository.getAllCommits()).length;

            run('git commit "my first commit"');

            expect(Object.keys(context.gitRepository.getAllCommits()).length).toBe(before);
        });
    });

    describe("committing without staging", () => {
        it("explains the staging area rather than saying 'nothing to commit'", () => {
            context.fileSystem.writeFile("/README.md", "# changed");
            context.gitRepository.updateFileStatus("README.md", "modified");

            const output = run('git commit -m "my change"');

            expect(output).toContain("On branch main");
            expect(output).toContain("Changes not staged for commit:");
            expect(output).toContain("no changes added to commit");
            expect(output).toContain("staging area");
        });

        it("reports a clean tree when there is genuinely nothing to do", () => {
            const output = run('git commit -m "nothing"');

            expect(output).toContain("nothing to commit, working tree clean");
        });
    });

    describe("git add with a path that does not exist", () => {
        it("fails the way real Git fails and suggests the real file", () => {
            const output = run("git add REDME.md");

            expect(output).toContain("fatal: pathspec 'REDME.md' did not match any files");
            expect(output).toContain("README.md");
        });

        it("finds a file even when the folder was left out", () => {
            const output = run("git add index.js");

            expect(output).toContain("fatal: pathspec 'index.js' did not match any files");
            expect(output).toContain("src/index.js");
        });

        it("stages nothing at all when one of several paths is wrong", () => {
            context.fileSystem.writeFile("/real.txt", "hi");

            run("git add real.txt nope.txt");

            expect(context.gitRepository.getStatus()["real.txt"]).toBeUndefined();
        });

        it("suggests 'git add .' when given no path", () => {
            const output = run("git add");

            expect(output).toContain("Nothing specified, nothing added.");
            expect(output).toContain("git add .");
        });

        it("stages a whole directory", () => {
            context.fileSystem.writeFile("/src/extra.js", "x");

            run("git add src");

            expect(context.gitRepository.getStatus()["src/extra.js"]).toBe("staged");
        });
    });

    describe("push without an upstream", () => {
        it("explains what an upstream is", () => {
            context.gitRepository.addRemote("origin", "https://github.com/user/repo.git");
            context.gitRepository.createBranch("feature");
            context.gitRepository.checkout("feature");

            const output = run("git push");

            expect(output).toContain("fatal: The current branch feature has no upstream branch.");
            expect(output).toContain("git push --set-upstream origin feature");
            expect(output).toContain("upstream is the remote branch");
        });

        it("explains what a remote is when the name is unknown", () => {
            const output = run("git push upstram main");

            expect(output).toContain("does not appear to be a git repository");
            expect(output).toContain("A remote is a saved nickname");
        });
    });
});
