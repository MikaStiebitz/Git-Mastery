import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { CommandProcessor } from "~/models/CommandProcessor";
import { ProgressManager } from "~/models/ProgressManager";
import { didCommandFail } from "~/models/commandOutcome";

/**
 * Edge cases found by reviewing the commands and by playing random command sequences against the
 * real `git` binary (src/test/fuzz). Every expectation here is what Git 2.43 does.
 */
describe("real Git edge cases", () => {
    let fs: FileSystem;
    let git: GitRepository;
    let cp: CommandProcessor;

    const run = (command: string): string[] => cp.processCommand(command);
    const write = (path: string, content: string) => fs.writeFile(path, content);
    const read = (path: string) => fs.getFileContents(path);
    const commit = (path: string, content: string, message: string) => {
        write(path, content);
        run(`git add ${path.replace(/^\//, "")}`);
        return run(`git commit -m "${message}"`);
    };
    const short = () => run("git status -s");
    const subjects = () => run("git log --format=%s");

    /** main: a.txt "base"; feature changes a.txt to "feature" (and adds f.txt); main changes it to "main". */
    const divergeOnA = () => {
        commit("/a.txt", "base\n", "base");
        run("git switch -c feature");
        commit("/a.txt", "feature\n", "feature change");
        commit("/f.txt", "f\n", "add f");
        run("git switch main");
        commit("/a.txt", "main\n", "main change");
    };

    beforeEach(() => {
        fs = new FileSystem();
        git = new GitRepository(fs);
        cp = new CommandProcessor(fs, git, new ProgressManager());
        run("git init");
    });

    describe("cherry-pick and revert", () => {
        it("refuses to start with staged changes", () => {
            divergeOnA();
            write("/s.txt", "s");
            run("git add s.txt");
            expect(run("git cherry-pick feature")).toEqual([
                "error: your local changes would be overwritten by cherry-pick.",
                "hint: commit your changes or stash them to proceed.",
                "fatal: cherry-pick failed",
            ]);
        });

        it("never overwrites a local edit with conflict markers", () => {
            divergeOnA();
            write("/a.txt", "my edit\n");
            const output = run("git cherry-pick feature~1");
            expect(output[0]).toBe("error: Your local changes to the following files would be overwritten by merge:");
            expect(output.at(-1)).toBe("fatal: cherry-pick failed");
            expect(read("/a.txt")).toBe("my edit\n");
        });

        it("refuses to overwrite an untracked file the commit would create", () => {
            divergeOnA();
            write("/f.txt", "mine");
            const output = run("git cherry-pick feature");
            expect(output[0]).toBe("error: The following untracked working tree files would be overwritten by merge:");
            expect(read("/f.txt")).toBe("mine");
        });

        it("--abort keeps unrelated local changes", () => {
            divergeOnA();
            commit("/u.txt", "u\n", "add u");
            write("/u.txt", "local\n");
            run("git cherry-pick feature~1");
            expect(git.getSequencer()).not.toBeNull();
            expect(run("git cherry-pick --abort")).toEqual([]);
            expect(read("/u.txt")).toBe("local\n");
            expect(read("/a.txt")).toBe("main\n");
        });

        it("--abort of a run of several commits goes back to where the run started", () => {
            divergeOnA();
            const start = git.getHeadCommitId();
            run("git cherry-pick feature~1..feature main~0");
            run("git cherry-pick --abort");
            expect(git.getHeadCommitId()).toBe(start);
        });

        it("--continue after committing the resolution by hand goes on with the remaining picks", () => {
            divergeOnA();
            run("git cherry-pick feature~1 feature");
            write("/a.txt", "resolved\n");
            run("git add a.txt");
            run('git commit -m "resolved by hand"');
            expect(didCommandFail(run("git cherry-pick --continue"), "git cherry-pick --continue")).toBe(false);
            expect(subjects().slice(0, 2)).toEqual(["add f", "resolved by hand"]);
            expect(git.getSequencer()).toBeNull();
        });

        it("reverting a revert reapplies the original", () => {
            commit("/a.txt", "1\n", "c1");
            run("git revert --no-edit HEAD");
            run("git revert --no-edit HEAD");
            expect(subjects()[0]).toBe('Reapply "c1"');
        });

        it("an empty pick is a failure that leaves the pick in progress, with the real status", () => {
            commit("/a.txt", "1\n", "c1");
            run("git switch -c other");
            commit("/a.txt", "2\n", "c2");
            run("git switch main");
            commit("/a.txt", "2\n", "same change");
            write("/u.txt", "untracked");
            const output = run("git cherry-pick other");
            expect(didCommandFail(output, "git cherry-pick other")).toBe(true);
            expect(output).toContain("Untracked files:");
            expect(output).toContain("The previous cherry-pick is now empty, possibly due to conflict resolution.");
        });

        it("git switch refuses to leave a cherry-pick half done", () => {
            divergeOnA();
            run("git cherry-pick feature~1");
            expect(run("git switch -c elsewhere")).toEqual([
                "fatal: cannot switch branch while cherry-picking",
                'Consider "git cherry-pick --quit" or "git worktree add".',
            ]);
        });
    });

    describe("merge", () => {
        it("a real merge refuses to start with staged changes", () => {
            divergeOnA();
            write("/s.txt", "s");
            run("git add s.txt");
            expect(run("git merge feature")).toEqual([
                "error: Your local changes to the following files would be overwritten by merge:",
                "  s.txt",
                "Merge with strategy ort failed.",
            ]);
        });

        it("git diff during a conflict prints Git's combined diff", () => {
            divergeOnA();
            run("git merge feature");
            const diff = run("git diff");
            expect(diff[0]).toBe("diff --cc a.txt");
            expect(diff.slice(2)).toEqual([
                "--- a/a.txt",
                "+++ b/a.txt",
                "@@@ -1,1 -1,1 +1,5 @@@",
                "++<<<<<<< HEAD",
                " +main",
                "++=======",
                "+ feature",
                "++>>>>>>> feature",
            ]);
            expect(run("git diff --staged")).toContain("* Unmerged path a.txt");
        });

        it("an octopus merge only lets the last branch conflict", () => {
            commit("/a.txt", "base\n", "base");
            for (const [branch, content] of [
                ["one", null],
                ["two", "two\n"],
                ["three", "three\n"],
            ] as const) {
                run(`git switch -c ${branch} main`);
                commit(`/${branch}.txt`, branch, branch);
                if (content) commit("/a.txt", content, `${branch} a`);
                run("git switch main");
            }
            const before = git.getHeadCommitId();
            const failed = run("git merge two three one");
            expect(failed.slice(-3)).toEqual([
                "Automated merge did not work.",
                "Should not be doing an octopus.",
                "Merge with strategy octopus failed.",
            ]);
            expect(didCommandFail(failed, "git merge two three one")).toBe(true);
            expect(git.getHeadCommitId()).toBe(before);
            expect(short()).toEqual([]);

            const conflicted = run("git merge one two three");
            expect(conflicted).toContain("ERROR: content conflict in a.txt");
            expect(conflicted.at(-1)).toBe("Automatic merge failed; fix conflicts and then commit the result.");
            write("/a.txt", "both\n");
            run("git add a.txt");
            run('git commit -m "octopus"');
            expect(git.getCommit(git.getHeadCommitId()!)!.parents).toHaveLength(4);
        });

        it("reset --soft is refused in the middle of a merge", () => {
            divergeOnA();
            run("git merge feature");
            expect(run("git reset --soft HEAD~1")).toEqual(["fatal: Cannot do a soft reset in the middle of a merge."]);
        });
    });

    describe("rebase", () => {
        it("does not start (and changes nothing) when an untracked file is in the way", () => {
            commit("/a.txt", "a\n", "a");
            run("git switch -c feature");
            commit("/f.txt", "f\n", "f");
            run("git switch main");
            commit("/n.txt", "n\n", "n");
            run("git switch feature");
            write("/n.txt", "untracked");
            const tip = git.getHeadCommitId();
            const output = run("git rebase main");
            expect(output).toContain("error: could not detach HEAD");
            expect(git.getHeadCommitId()).toBe(tip);
            expect(git.getRebaseState()).toBeNull();
            expect(read("/n.txt")).toBe("untracked");
        });

        it("--continue refuses while there are unstaged changes", () => {
            divergeOnA();
            run("git switch feature");
            run("git rebase main");
            write("/a.txt", "resolved\n");
            run("git add a.txt");
            write("/a.txt", "changed again\n");
            expect(run("git rebase --continue")).toEqual([
                "You must edit all merge conflicts and then",
                "mark them as resolved using git add",
            ]);
        });

        it("skips commits whose change is already upstream", () => {
            commit("/a.txt", "a\n", "a");
            run("git switch -c feature");
            commit("/b.txt", "b\n", "add b");
            commit("/c.txt", "c\n", "add c");
            run("git switch main");
            run("git cherry-pick feature~1");
            run("git switch feature");
            const output = run("git rebase main");
            expect(output[0]).toMatch(/^warning: skipped previously applied commit [0-9a-f]{7}$/);
            expect(subjects()).toEqual(["add c", "add b", "a"]);
        });

        it("--autostash puts local changes back after resolving a conflict", () => {
            divergeOnA();
            run("git switch feature");
            write("/f.txt", "dirty\n");
            expect(run("git rebase --autostash main")[0]).toMatch(/^Created autostash: [0-9a-f]{7}$/);
            expect(git.getStashEntries()).toHaveLength(0); // kept by the rebase, not in the stash list
            write("/a.txt", "resolved\n");
            run("git add a.txt");
            const output = run("git rebase --continue");
            expect(output).toContain("Applied autostash.");
            expect(read("/f.txt")).toBe("dirty\n");
            expect(git.getStashEntries()).toHaveLength(0);
        });

        it("rebase -i --root opens the todo list instead of crashing", () => {
            commit("/a.txt", "a\n", "a");
            commit("/b.txt", "b\n", "b");
            const output = run("git rebase -i --root");
            expect(output.some(line => line.startsWith("__OPEN_EDITOR__:"))).toBe(true);
            expect(git.rebaseTodoText()).toMatch(/^pick [0-9a-f]{7} a\npick [0-9a-f]{7} b\n/);
            expect(run("git rebase --continue").at(-1)).toBe("Successfully rebased and updated refs/heads/main.");
            expect(subjects()).toEqual(["b", "a"]);
        });

        it("--quit leaves HEAD and the files where they are", () => {
            divergeOnA();
            run("git switch feature");
            run("git rebase main");
            const head = git.getHeadCommitId();
            expect(run("git rebase --quit")).toEqual([]);
            expect(git.getRebaseState()).toBeNull();
            expect(git.getHeadCommitId()).toBe(head);
        });
    });

    describe("reset", () => {
        it("--merge keeps unstaged changes the reset does not touch", () => {
            commit("/a.txt", "a\n", "a");
            commit("/b.txt", "b\n", "b");
            write("/a.txt", "local\n");
            run("git reset --merge HEAD~1");
            expect(read("/a.txt")).toBe("local\n");
            expect(read("/b.txt")).toBeNull();
        });

        it("--keep resets the index like --mixed", () => {
            commit("/a.txt", "a\n", "a");
            commit("/b.txt", "b\n", "b");
            write("/new.txt", "n");
            run("git add new.txt");
            run("git reset --keep HEAD~1");
            expect(short()).toEqual(["?? new.txt"]);
        });

        it("a path that is not in the working tree is not taken for a file", () => {
            commit("/a.txt", "a\n", "a");
            run("git rm -q a.txt");
            expect(run("git reset a.txt")[0]).toBe(
                "fatal: ambiguous argument 'a.txt': unknown revision or path not in the working tree.",
            );
            expect(run("git reset nope -- a.txt")).toEqual(["fatal: Failed to resolve 'nope' as a valid tree."]);
        });
    });

    describe("commit", () => {
        it("`git commit <path>` commits only that path and leaves the rest staged", () => {
            commit("/a.txt", "a\n", "a");
            commit("/b.txt", "b\n", "b");
            write("/a.txt", "a2\n");
            write("/b.txt", "b2\n");
            run("git add b.txt");
            run('git commit a.txt -m "only a"');
            expect(git.treeOf(git.getHeadCommitId()!)["b.txt"]).toBe("b\n");
            expect(short()).toEqual(["M  b.txt"]);
        });

        it('keeps an empty quoted message as an empty message: -m "" -a', () => {
            commit("/a.txt", "a\n", "a");
            write("/a.txt", "a2\n");
            expect(run('git commit -m "" -a')).toEqual(["Aborting commit due to empty commit message."]);
            expect(short()).toEqual([" M a.txt"]);
        });

        it("refuses an amend that would leave an empty commit", () => {
            commit("/a.txt", "a\n", "a");
            run("git commit --allow-empty -m empty");
            const output = run("git commit --amend -m again");
            expect(output).toContain("No changes");
            expect(subjects()[0]).toBe("empty");
        });
    });

    describe("stash", () => {
        it("refuses to pop over an untracked file the stash would create", () => {
            commit("/a.txt", "a\n", "a");
            write("/n.txt", "staged new file");
            run("git add n.txt");
            run("git stash");
            write("/n.txt", "untracked now");
            const output = run("git stash pop");
            expect(output[0]).toBe("error: The following untracked working tree files would be overwritten by merge:");
            expect(git.getStashEntries()).toHaveLength(1);
        });

        it("restores the other untracked files and reports the ones in the way", () => {
            commit("/a.txt", "a\n", "a");
            write("/u.txt", "u");
            write("/v.txt", "v");
            run("git stash -u");
            write("/u.txt", "back again");
            const output = run("git stash pop");
            expect(output).toContain("u.txt already exists, no checkout");
            expect(output).toContain("error: could not restore untracked files from stash");
            expect(read("/v.txt")).toBe("v");
            expect(git.getStashEntries()).toHaveLength(1);
        });
    });

    describe("paths and arguments", () => {
        it("git mv moves into an existing (even empty) directory", () => {
            commit("/a.txt", "a\n", "a");
            run("mkdir empty");
            expect(run("git mv a.txt empty")).toEqual([]);
            expect(short()).toEqual(["R  a.txt -> empty/a.txt"]);
        });

        it("git mv refuses to move a directory into itself and to a missing directory", () => {
            commit("/src/b.txt", "b\n", "b");
            expect(run("git mv src src")).toEqual([
                "fatal: can not move directory into itself, source=src, destination=src/src",
            ]);
            expect(run("git mv src/b.txt newdir/")).toEqual([
                "fatal: destination directory does not exist, source=src/b.txt, destination=newdir/",
            ]);
        });

        it("`..` in a path is a path, not a range", () => {
            commit("/a.txt", "a\n", "a");
            run("mkdir src");
            write("/a.txt", "b\n");
            cp.processCommand("cd src");
            expect(run("git diff ../a.txt")[0]).toBe("diff --git a/a.txt b/a.txt");
            expect(run("git log --format=%s ../a.txt")).toEqual(["a"]);
        });

        it("git status takes pathspecs and -u modes", () => {
            commit("/a.txt", "a\n", "a");
            write("/a.txt", "changed\n");
            write("/new/x.txt", "x");
            write("/new/y.txt", "y");
            expect(run("git status -s new")).toEqual(["?? new/"]);
            expect(run("git status -s -uall")).toEqual([" M a.txt", "?? new/x.txt", "?? new/y.txt"]);
            expect(run("git status -uno").at(-1)).toBe(
                'no changes added to commit (use "git add" and/or "git commit -a")',
            );
        });

        it("git branch -M cannot overwrite the checked-out branch", () => {
            commit("/a.txt", "a\n", "a");
            run("git branch other");
            expect(run("git branch -M other main")).toEqual([
                "fatal: cannot force update the branch 'main' used by worktree at '/'",
            ]);
        });

        it("a local branch can be the upstream", () => {
            commit("/a.txt", "a\n", "a");
            run("git branch feature");
            commit("/b.txt", "b\n", "b");
            expect(run("git branch -u main feature")).toEqual(["branch 'feature' set up to track 'main'."]);
            expect(run("git branch -vv")[0]).toMatch(/^ {2}feature [0-9a-f]{7} \[main: behind 1\] a$/);
        });

        it("git rm takes globs without -r and deletes files already gone", () => {
            commit("/src/a.js", "a", "a");
            commit("/b.js", "b", "b");
            expect(run("git rm '*.js'")).toEqual(["rm 'b.js'", "rm 'src/a.js'"]);
            expect(run("git rm")).toEqual(["fatal: No pathspec was given. Which files should I remove?"]);
        });

        it("nothing inside .git is ever staged", () => {
            commit("/a.txt", "a\n", "a");
            write("/.git/hooks/pre-commit", "#!/bin/sh");
            run("git add .git/hooks/pre-commit");
            run("git add -A");
            expect(short()).toEqual([]);
        });
    });
});
