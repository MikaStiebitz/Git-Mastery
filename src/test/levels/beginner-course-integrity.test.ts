import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { LevelManager } from "~/models/LevelManager";
import { CommandProcessor } from "~/models/CommandProcessor";
import { ProgressManager } from "~/models/ProgressManager";
import { splitCommandRespectingQuotes } from "~/commands/base/CommandParser";
import { didCommandFail } from "~/models/commandOutcome";
import { getAvailableStagesForDifficulty } from "~/config/difficulties";
import { allStages } from "~/levels";

/**
 * The beginner course, exercised the way a player moves through it.
 *
 * These guard the three failures that made the course unplayable rather than merely confusing:
 * a level that could not be solved by the command it asked for, objectives that completed for
 * commands that did nothing, and state from one level bleeding into the next.
 */
describe("beginner course integrity", () => {
    let fileSystem: FileSystem;
    let gitRepository: GitRepository;
    let levelManager: LevelManager;
    let commandProcessor: CommandProcessor;

    /**
     * Run a command and report completion the way the terminal does, including its rule that a
     * failed command can never complete a level.
     */
    const play = (stage: string, level: number, command: string): { output: string; completed: boolean } => {
        const lines = commandProcessor.processCommand(command);
        const [cmd, ...args] = splitCommandRespectingQuotes(command.trim());

        const completed =
            !didCommandFail(lines) &&
            cmd !== undefined &&
            levelManager.checkLevelCompletion(stage, level, cmd, args, gitRepository);

        return { output: lines.join("\n"), completed };
    };

    /** Which of a level's requirements are marked done — finer grained than whole-level completion. */
    const requirementsDone = (stage: string, level: number): string[] =>
        levelManager.getLevel(stage, level)?.completedRequirements ?? [];

    const enter = (stage: string, level: number) => {
        levelManager.setupLevel(stage, level, fileSystem, gitRepository);
        commandProcessor.setCurrentDirectory("/");
    };

    beforeEach(() => {
        fileSystem = new FileSystem();
        gitRepository = new GitRepository(fileSystem);
        levelManager = new LevelManager();
        commandProcessor = new CommandProcessor(fileSystem, gitRepository, new ProgressManager());
    });

    describe("Remote level 1 is solvable by the command it asks for", () => {
        it("starts with no remote configured", () => {
            enter("remote", 1);

            expect(Object.keys(gitRepository.getRemotes())).toEqual([]);
        });

        it("accepts 'git remote add origin <url>' without an already-exists error", () => {
            enter("remote", 1);

            const { output, completed } = play("remote", 1, "git remote add origin https://github.com/user/repo.git");

            expect(output).not.toContain("already exists");
            expect(gitRepository.getRemotes().origin).toBe("https://github.com/user/repo.git");
            expect(completed).toBe(true);
        });

        it("does not complete when the remote was never added", () => {
            enter("remote", 1);

            const { completed } = play("remote", 1, "git remote -v");

            expect(completed).toBe(false);
        });
    });

    describe("Levels about pushing still start with a remote", () => {
        it("gives remote level 2 an origin to push to", () => {
            enter("remote", 2);

            expect(Object.keys(gitRepository.getRemotes())).toContain("origin");
        });
    });

    describe("Branches level 5 requires actually switching", () => {
        it("completes for 'git switch -c <name>'", () => {
            enter("branches", 5);

            const { completed } = play("branches", 5, "git switch -c feature/new");

            expect(gitRepository.getCurrentBranch()).toBe("feature/new");
            expect(completed).toBe(true);
        });

        it("completes for 'git checkout -b <name>'", () => {
            enter("branches", 5);

            const { completed } = play("branches", 5, "git checkout -b feature/new");

            expect(gitRepository.getCurrentBranch()).toBe("feature/new");
            expect(completed).toBe(true);
        });

        // The regression that started this: `git branch -c x` completed the level while the player
        // stayed on main, so "create a branch and switch to it" was marked done with nothing switched.
        it("does not complete for 'git branch -c <name>', which never switches", () => {
            enter("branches", 5);

            const { completed } = play("branches", 5, "git branch -c feature/new");

            expect(gitRepository.getCurrentBranch()).toBe("main");
            expect(completed).toBe(false);
        });

        it("does not complete for a plain 'git branch <name>'", () => {
            enter("branches", 5);

            const { completed } = play("branches", 5, "git branch feature/new");

            expect(gitRepository.getBranches()).toContain("feature/new");
            expect(gitRepository.getCurrentBranch()).toBe("main");
            expect(completed).toBe(false);
        });
    });

    describe("the clone level rejects the placeholder from its own instructions", () => {
        it("fails on 'git clone <repository-url>' typed literally", () => {
            enter("intro", 3);

            const { output, completed } = play("intro", 3, "git clone <repository-url>");

            expect(output).toContain("fatal: repository '<repository-url>' does not exist");
            expect(output).toContain("placeholder");
            expect(completed).toBe(false);
            expect(fileSystem.getDirectoryContents("/repository")).toBeNull();
        });

        // This level asks for a clone and then a cd, so completing it needs both steps.
        it("succeeds on a real URL and completes once the player also navigates in", () => {
            enter("intro", 3);

            const clone = play("intro", 3, "git clone https://github.com/octocat/Hello-World.git");
            expect(clone.output).toContain("Cloning into 'Hello-World'...");
            expect(requirementsDone("intro", 3)).toContain("clone-repo");

            const cd = play("intro", 3, "cd Hello-World");
            expect(cd.completed).toBe(true);
        });

        it("rejects a bare word that is not an address", () => {
            enter("intro", 3);

            const { completed } = play("intro", 3, "git clone myrepo");

            expect(completed).toBe(false);
            expect(requirementsDone("intro", 3)).not.toContain("clone-repo");
        });
    });

    describe("a command that changed nothing completes nothing", () => {
        it("does not complete a commit objective when the change was never staged", () => {
            // Files level 2 starts with changes already staged, so clear them with a first commit;
            // what follows is the beginner case of editing a file and committing without adding.
            enter("files", 2);
            commandProcessor.processCommand('git commit -m "the staged work"');

            fileSystem.writeFile("/README.md", "# edited again, never staged");
            gitRepository.updateFileStatus("README.md", "modified");
            const commitsBefore = Object.keys(gitRepository.getAllCommits()).length;

            const { output, completed } = play("files", 2, 'git commit -m "forgot to add"');

            expect(output).toContain("no changes added to commit");
            expect(Object.keys(gitRepository.getAllCommits()).length).toBe(commitsBefore);
            expect(completed).toBe(false);
        });
    });

    describe("'add all files' means all files", () => {
        // Reported from a real run: `git add README.md` completed the objective while src/index.js
        // and src/app.js were still untracked — the very next `git status` listed them.
        it("does not complete after staging only one of several files", () => {
            enter("files", 1);

            const { completed } = play("files", 1, "git add README.md");

            expect(completed).toBe(false);
        });

        it("completes once every file is staged", () => {
            enter("files", 1);

            const { completed } = play("files", 1, "git add .");

            expect(completed).toBe(true);
        });

        // The old check read the status map, which only listed files some command had already
        // touched. Untracked files only appeared there after `git status` was run.
        it("sees untracked files without git status having been run first", () => {
            enter("files", 1);

            const tree = gitRepository.getWorkingTreeStatus();
            const untracked = Object.entries(tree).filter(([, state]) => state === "untracked");

            expect(untracked.length).toBeGreaterThan(0);
        });

        it("still does not complete when a later file is added but an earlier one is not", () => {
            enter("files", 1);

            play("files", 1, "git add src/index.js");
            const { completed } = play("files", 1, "git add src/app.js");

            expect(completed).toBe(false);
        });
    });

    describe("'inspect the diff' means a diff was actually shown", () => {
        // Reported: on a repository where every file had gone untracked, `git diff` printed nothing
        // (correctly — an untracked file has no committed version to compare) but the "inspect the
        // exact changes" objective still completed on the bare fact that the command was typed.
        it("does not complete when there is nothing to diff", () => {
            enter("intro", 4);
            play("intro", 4, "git status"); // clears the sequential first requirement
            // Force the leaked-looking state: everything untracked, nothing modified.
            gitRepository.updateFileStatus("README.md", "untracked");
            gitRepository.updateFileStatus("src/app.js", "untracked");
            gitRepository.updateFileStatus("src/config.js", "untracked");

            const { output, completed } = play("intro", 4, "git diff");

            expect(output).toContain("hint:");
            expect(completed).toBe(false);
        });

        it("completes on the level's real, intended diff", () => {
            enter("intro", 4);
            play("intro", 4, "git status");

            const { output, completed } = play("intro", 4, "git diff");

            expect(output).toContain("diff --git");
            expect(completed).toBe(true);
        });

        it("survives an unnecessary git init without losing the modification", () => {
            enter("intro", 4);
            play("intro", 4, "git status");

            play("intro", 4, "git init");
            const { completed } = play("intro", 4, "git diff");

            expect(completed).toBe(true);
        });
    });

    describe("no state leaks between levels", () => {
        it("drops files a previous level created dynamically", () => {
            enter("intro", 3);
            commandProcessor.processCommand("git clone https://github.com/example/demo.git");
            expect(fileSystem.getDirectoryContents("/demo")).not.toBeNull();

            enter("intro", 4);

            expect(fileSystem.getDirectoryContents("/demo")).toBeNull();
        });

        it("leaves no untracked leftovers in the next level's status", () => {
            enter("intro", 3);
            commandProcessor.processCommand("git clone https://github.com/example/demo.git");

            enter("files", 1);

            const leftovers = Object.keys(gitRepository.getStatus()).filter(file => file.includes("demo"));
            expect(leftovers).toEqual([]);
        });

        it("starts every beginner level with only the files that level declares", () => {
            const stages = getAvailableStagesForDifficulty("beginner");

            for (const stageName of stages) {
                const stage = (allStages as Record<string, (typeof allStages)["Intro"]>)[stageName];
                if (!stage) continue;

                for (const levelId of Object.keys(stage.levels).map(Number)) {
                    // Arrive from a level that created an extra directory, not from a clean slate.
                    enter("intro", 3);
                    commandProcessor.processCommand("git clone https://github.com/example/leak.git");

                    enter(stage.id, levelId);

                    expect(
                        fileSystem.getDirectoryContents("/leak"),
                        `${stage.id} level ${levelId} still shows the previous level's clone`,
                    ).toBeNull();
                }
            }
        });
    });
});
