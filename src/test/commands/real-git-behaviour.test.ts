import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { CommandProcessor } from "~/models/CommandProcessor";
import { ProgressManager } from "~/models/ProgressManager";
import { LevelManager } from "~/models/LevelManager";
import { didCommandFail } from "~/models/commandOutcome";

/**
 * The commands behave like real Git, end to end: every scenario here is typed the way a player
 * types it and checked against what real Git prints and does.
 */
describe("real Git behaviour", () => {
    let fs: FileSystem;
    let git: GitRepository;
    let cp: CommandProcessor;

    const run = (command: string): string[] => cp.processCommand(command);
    const text = (command: string): string => run(command).join("\n");
    const write = (path: string, content: string) => fs.writeFile(path, content);
    const commitFile = (path: string, content: string, message: string) => {
        write(path, content);
        run(`git add ${path.replace(/^\//, "")}`);
        return run(`git commit -m "${message}"`);
    };

    beforeEach(() => {
        fs = new FileSystem();
        git = new GitRepository(fs);
        cp = new CommandProcessor(fs, git, new ProgressManager());
        run("git init");
    });

    describe("reflog references (issue #109)", () => {
        beforeEach(() => {
            commitFile("/a.txt", "a", "First");
            commitFile("/b.txt", "b", "Second");
            commitFile("/c.txt", "c", "Third");
        });

        it("numbers the reflog newest-first, so HEAD@{0} is where HEAD is now", () => {
            const reflog = run("git reflog");
            expect(reflog[0]).toMatch(/^[0-9a-f]{7} \(HEAD -> main\) HEAD@\{0\}: commit: Third$/);
            expect(reflog[2]).toMatch(/HEAD@\{2\}: commit \(initial\): First$/);
        });

        it("recovers commits lost by `git reset --hard` with `git reset --hard HEAD@{1}`", () => {
            run("git reset --hard HEAD~2");
            expect(git.getCommitHistory()).toHaveLength(1);
            expect(fs.getFileContents("/c.txt")).toBeNull();

            const output = run("git reset --hard HEAD@{1}");

            expect(output).toEqual([expect.stringMatching(/^HEAD is now at [0-9a-f]{7} Third$/)]);
            expect(git.getCommitHistory()).toHaveLength(3);
            expect(fs.getFileContents("/c.txt")).toBe("c");
        });

        it("points a new branch at a reflog entry", () => {
            run("git reset --hard HEAD~2");
            expect(run("git branch recovery HEAD@{1}")).toEqual([]);
            expect(git.getCommit(git.getBranchTip("recovery")!)!.message).toBe("Third");
        });

        it("reports a reflog entry that does not exist the way Git does", () => {
            expect(run("git reset --hard HEAD@{9}")).toEqual(["fatal: log for 'HEAD' only has 3 entries"]);
        });

        it("resolves the other revision forms", () => {
            const third = git.getHeadCommitId()!;
            const second = git.getCommit(third)!.parents[0]!;
            expect(git.resolveCommit("HEAD^")).toBe(second);
            expect(git.resolveCommit("@~1")).toBe(second);
            expect(git.resolveCommit("main@{1}")).toBe(second);
            expect(git.resolveCommit(third.substring(0, 7))).toBe(third);
            run("git reset --hard HEAD~1");
            expect(git.resolveCommit("ORIG_HEAD")).toBe(third);
        });

        it("rejects an unknown revision with Git's ambiguous-argument error", () => {
            expect(run("git reset --hard nope")).toEqual([
                "fatal: ambiguous argument 'nope': unknown revision or path not in the working tree.",
                "Use '--' to separate paths from revisions, like this:",
                "'git <command> [<revision>...] -- [<file>...]'",
            ]);
        });
    });

    describe("status, add and commit", () => {
        it("prints real status sections and collapses untracked directories", () => {
            commitFile("/README.md", "# hi", "Initial");
            write("/README.md", "# changed");
            write("/src/a.js", "a");
            write("/new.txt", "new");
            run("git add new.txt");

            expect(run("git status")).toEqual([
                "On branch main",
                "Changes to be committed:",
                '  (use "git restore --staged <file>..." to unstage)',
                "\tnew file:   new.txt",
                "",
                "Changes not staged for commit:",
                '  (use "git add <file>..." to update what will be committed)',
                '  (use "git restore <file>..." to discard changes in working directory)',
                "\tmodified:   README.md",
                "",
                "Untracked files:",
                '  (use "git add <file>..." to include in what will be committed)',
                "\tsrc/",
                // With something staged there is no summary line; Git ends on the block's blank line.
                "",
            ]);
            expect(run("git status -s")).toEqual([" M README.md", "A  new.txt", "?? src/"]);
        });

        it("stages a modification and the staged + unstaged state of the same file", () => {
            commitFile("/f.txt", "1", "Initial");
            write("/f.txt", "2");
            run("git add f.txt");
            write("/f.txt", "3");
            expect(run("git status -s")).toEqual(["MM f.txt"]);
            expect(text("git diff --staged")).toContain("-1\n\\ No newline at end of file\n+2");
            expect(text("git diff")).toContain("-2\n\\ No newline at end of file\n+3");
        });

        it("prints Git's commit summary, root commit included", () => {
            write("/a.txt", "one\ntwo\n");
            run("git add .");
            const output = run('git commit -m "Add a"');
            expect(output[0]).toMatch(/^\[main \(root-commit\) [0-9a-f]{7}\] Add a$/);
            expect(output.slice(1)).toEqual([" 1 file changed, 2 insertions(+)", " create mode 100644 a.txt"]);
        });

        it("refuses to commit with unresolved conflicts", () => {
            commitFile("/f.txt", "base", "Base");
            run("git switch -c other");
            commitFile("/f.txt", "theirs", "Theirs");
            run("git switch main");
            commitFile("/f.txt", "ours", "Ours");
            run("git merge other");
            expect(run('git commit -m "x"')[0]).toBe(
                "error: Committing is not possible because you have unmerged files.",
            );
        });

        it("ignores files listed in .gitignore", () => {
            commitFile("/.gitignore", "*.log\nbuild/\n", "Ignore logs");
            write("/debug.log", "x");
            write("/build/out.js", "x");
            write("/app.js", "x");
            expect(run("git status -s")).toEqual(["?? app.js"]);
            expect(run("git add debug.log")[0]).toBe(
                "The following paths are ignored by one of your .gitignore files:",
            );
        });
    });

    describe("branches, switching and detached HEAD", () => {
        beforeEach(() => {
            commitFile("/a.txt", "a", "First");
            commitFile("/b.txt", "b", "Second");
        });

        it("carries uncommitted changes to the new branch", () => {
            write("/a.txt", "changed");
            expect(run("git switch -c feature")).toEqual(["M\ta.txt", "Switched to a new branch 'feature'"]);
            expect(fs.getFileContents("/a.txt")).toBe("changed");
        });

        it("refuses a switch that would overwrite local changes", () => {
            run("git switch -c feature");
            commitFile("/a.txt", "feature", "Feature change");
            run("git switch main");
            write("/a.txt", "local");
            expect(run("git switch feature")).toEqual([
                "error: Your local changes to the following files would be overwritten by checkout:",
                "\ta.txt",
                "Please commit your changes or stash them before you switch branches.",
                "Aborting",
            ]);
        });

        it("detaches HEAD on checkout of a commit and warns about orphaned commits when leaving", () => {
            const detached = run("git checkout HEAD~1");
            expect(detached[0]).toBe("Note: switching to 'HEAD~1'.");
            expect(detached[detached.length - 1]).toMatch(/^HEAD is now at [0-9a-f]{7} First$/);
            expect(run("git status")[0]).toMatch(/^HEAD detached at [0-9a-f]{7}$/);

            commitFile("/x.txt", "x", "Experiment");
            const back = run("git switch main");
            expect(back[0]).toBe("Warning: you are leaving 1 commit behind, not connected to");
            expect(back[back.length - 1]).toBe("Switched to branch 'main'");
        });

        it("switches back with `git switch -`", () => {
            run("git switch -c feature");
            expect(run("git switch -")).toEqual(["Switched to branch 'main'"]);
            expect(git.getCurrentBranch()).toBe("main");
        });

        it("creates a branch at a start point and lists branches verbosely", () => {
            run("git branch old HEAD~1");
            const listing = run("git branch -v");
            expect(listing[0]).toMatch(/^\* main [0-9a-f]{7} Second$/);
            expect(listing[1]).toMatch(/^ {2}old {2}[0-9a-f]{7} First$/);
        });

        it("restores a file from another commit with checkout", () => {
            write("/a.txt", "oops");
            // With "--" Git restores silently; without it, it reports the count.
            expect(run("git checkout -- a.txt")).toEqual([]);
            expect(fs.getFileContents("/a.txt")).toBe("a");
            write("/a.txt", "oops");
            expect(run("git checkout a.txt")).toEqual(["Updated 1 path from the index"]);
            expect(fs.getFileContents("/a.txt")).toBe("a");
        });
    });

    describe("merging", () => {
        beforeEach(() => {
            commitFile("/f.txt", "line1\nline2\nline3\n", "Base");
        });

        it("fast-forwards with Git's output", () => {
            run("git switch -c feature");
            commitFile("/f.txt", "line1\nline2 changed\nline3\n", "Change");
            run("git switch main");
            const output = run("git merge feature");
            expect(output[0]).toMatch(/^Updating [0-9a-f]{7}\.\.[0-9a-f]{7}$/);
            expect(output.slice(1)).toEqual([
                "Fast-forward",
                " f.txt | 2 +-",
                " 1 file changed, 1 insertion(+), 1 deletion(-)",
            ]);
        });

        it("merges non-overlapping changes cleanly and conflicts on overlapping ones", () => {
            run("git switch -c feature");
            commitFile("/f.txt", "line1 feature\nline2\nline3\n", "Feature");
            run("git switch main");
            commitFile("/f.txt", "line1\nline2\nline3 main\n", "Main");

            expect(run("git merge feature")).toEqual([
                "Auto-merging f.txt",
                "Merge made by the 'ort' strategy.",
                " f.txt | 2 +-",
                " 1 file changed, 1 insertion(+), 1 deletion(-)",
            ]);
            expect(fs.getFileContents("/f.txt")).toBe("line1 feature\nline2\nline3 main\n");

            run("git switch -c second HEAD~2");
            commitFile("/f.txt", "line1\nline2\nline3 second\n", "Second");
            const conflict = run("git merge main");
            expect(conflict).toContain("CONFLICT (content): Merge conflict in f.txt");
            expect(fs.getFileContents("/f.txt")).toContain(
                "<<<<<<< HEAD\nline3 second\n=======\nline3 main\n>>>>>>> main",
            );
            expect(text("git status")).toContain("both modified:   f.txt");

            expect(run("git merge --abort")).toEqual([]);
            expect(fs.getFileContents("/f.txt")).toBe("line1\nline2\nline3 second\n");
        });
    });

    describe("history rewriting", () => {
        beforeEach(() => {
            commitFile("/a.txt", "a", "A");
            run("git switch -c feature");
            commitFile("/b.txt", "b", "B");
            commitFile("/c.txt", "c", "C");
            run("git switch main");
            commitFile("/m.txt", "m", "M");
            run("git switch feature");
        });

        it("rebases onto the new base", () => {
            expect(run("git rebase main")).toEqual(["Successfully rebased and updated refs/heads/feature."]);
            expect(run("git log --format=%s")).toEqual(["C", "B", "M", "A"]);
        });

        it("squashes with an interactive rebase todo list", () => {
            run("git rebase -i main");
            const todoPath = "/.git/rebase-merge/git-rebase-todo";
            const todo = fs.getFileContents(todoPath)!;
            fs.writeFile(todoPath, todo.replace(/^pick ([0-9a-f]+) C$/m, "squash $1 C"));
            expect(git.takeEditorFollowUp(todoPath)).toBe("git rebase --continue");

            expect(run("git rebase --continue")).toEqual(["Successfully rebased and updated refs/heads/feature."]);
            expect(run("git log --format=%s")).toEqual(["B", "M", "A"]);
            expect(git.getLastCommit()!.message).toBe("B\n\nC");
        });

        it("cherry-picks a commit and reverts it", () => {
            run("git switch main");
            const pick = run("git cherry-pick feature~1");
            expect(pick[0]).toMatch(/^\[main [0-9a-f]{7}\] B$/);
            expect(fs.getFileContents("/b.txt")).toBe("b");

            const revert = run("git revert HEAD");
            expect(revert[0]).toMatch(/^\[main [0-9a-f]{7}\] Revert "B"$/);
            expect(fs.getFileContents("/b.txt")).toBeNull();
        });
    });

    describe("stash", () => {
        it("saves, lists and pops changes, also onto another branch", () => {
            commitFile("/f.txt", "1", "Initial");
            write("/f.txt", "2");
            expect(run("git stash")[0]).toMatch(
                /^Saved working directory and index state WIP on main: [0-9a-f]{7} Initial$/,
            );
            expect(fs.getFileContents("/f.txt")).toBe("1");
            expect(run("git stash list")[0]).toMatch(/^stash@\{0\}: WIP on main: /);

            run("git switch -c other");
            const pop = run("git stash pop");
            expect(pop).toContain("\tmodified:   f.txt");
            expect(pop[pop.length - 1]).toMatch(/^Dropped refs\/stash@\{0\} \([0-9a-f]{7}\)$/);
            expect(fs.getFileContents("/f.txt")).toBe("2");
        });
    });

    describe("remotes", () => {
        beforeEach(() => {
            commitFile("/f.txt", "1", "Initial");
            run("git remote add origin https://github.com/user/repo.git");
        });

        it("publishes a branch, tracks it and reports ahead/behind", () => {
            const push = text("git push -u origin main");
            expect(push).toContain(" * [new branch]      main -> main");
            expect(push).toContain("branch 'main' set up to track 'origin/main'.");

            commitFile("/f.txt", "2", "Second");
            expect(run("git status")[1]).toBe("Your branch is ahead of 'origin/main' by 1 commit.");
            expect(text("git push")).toMatch(/ {3}[0-9a-f]{7}\.\.[0-9a-f]{7} {2}main -> main/);
        });

        it("rejects a push the remote cannot fast-forward", () => {
            run("git push -u origin main");
            commitFile("/f.txt", "2", "Second");
            run("git push");
            run("git reset --hard HEAD~1");
            commitFile("/g.txt", "g", "Diverged");
            const output = run("git push");
            expect(output).toContain(" ! [rejected]        main -> main (non-fast-forward)");
            expect(didCommandFail(output, "git push")).toBe(true);
        });

        it("fetches and pulls teammates' work", () => {
            run("git push -u origin main");
            git.setRemoteCommits("main", [{ id: "x", message: "Teammate change", files: { "/f.txt": "remote" } }]);
            expect(text("git fetch")).toMatch(/[0-9a-f]{7}\.\.[0-9a-f]{7} {2}main {7}-> origin\/main/);
            expect(run("git status")[1]).toBe(
                "Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.",
            );
            expect(text("git pull")).toContain("Fast-forward");
            expect(fs.getFileContents("/f.txt")).toBe("remote");
        });
    });

    describe("inspecting history", () => {
        beforeEach(() => {
            commitFile("/f.txt", "one\n", "First");
            commitFile("/f.txt", "one\ntwo\n", "Second");
        });

        it("shows a commit with its real patch", () => {
            const output = run("git show");
            expect(output[0]).toMatch(/^commit [0-9a-f]{40} \(HEAD -> main\)$/);
            expect(output).toContain("    Second");
            expect(output.slice(-3)).toEqual(["@@ -1 +1,2 @@", " one", "+two"]);
        });

        it("shows a file as it was in an earlier commit", () => {
            expect(run("git show HEAD~1:f.txt")).toEqual(["one"]);
        });

        it("logs ranges and patches", () => {
            expect(run("git log --oneline HEAD~1..HEAD")).toEqual([
                expect.stringMatching(/^[0-9a-f]{7} \(HEAD -> main\) Second$/),
            ]);
            expect(run("git log -1 --format=%s")).toEqual(["Second"]);
        });

        it("blames each line on the commit that introduced it", () => {
            const blame = run("git blame f.txt");
            expect(blame[0]).toMatch(/^\^[0-9a-f]{7} \(You \d{4}-\d\d-\d\d \d\d:\d\d:\d\d [+-]\d{4} 1\) one$/);
            expect(blame[1]).toMatch(/^[0-9a-f]{8} \(You \d{4}-\d\d-\d\d \d\d:\d\d:\d\d [+-]\d{4} 2\) two$/);
        });

        it("finds the first bad commit with bisect", () => {
            commitFile("/f.txt", "one\ntwo\nthree\n", "Third");
            run("git bisect start");
            run("git bisect bad");
            expect(run("git bisect good HEAD~2")[0]).toMatch(/^Bisecting: 0 revisions left to test after this/);
            const found = run("git bisect bad");
            expect(found[0]).toMatch(/^[0-9a-f]{40} is the first bad commit$/);
            expect(found).toContain("    Second");
        });
    });

    describe("level setup", () => {
        it("starts Archaeology 3 right after the accident, with the lost work only in the reflog", () => {
            const levelFs = new FileSystem();
            const levelGit = new GitRepository(levelFs);
            const levelCp = new CommandProcessor(levelFs, levelGit, new ProgressManager());
            new LevelManager().setupLevel("archaeology", 3, levelFs, levelGit);

            expect(levelGit.getCommitHistory()).toHaveLength(1);
            const reflog = levelCp.processCommand("git reflog");
            expect(reflog[0]).toMatch(/HEAD@\{0\}: reset: moving to HEAD~3$/);
            expect(reflog[1]).toMatch(/HEAD@\{1\}: commit: Complete test suite \(LOST!\)$/);

            levelCp.processCommand("git reset --hard HEAD@{1}");
            expect(levelGit.getCommitHistory()).toHaveLength(4);
        });
    });
});
