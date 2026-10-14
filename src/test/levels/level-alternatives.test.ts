import { describe, it, expect } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { LevelManager } from "~/models/LevelManager";
import { CommandProcessor } from "~/models/CommandProcessor";
import { ProgressManager } from "~/models/ProgressManager";
import { splitCommandRespectingQuotes } from "~/commands/base/CommandParser";
import { didCommandFail } from "~/models/commandOutcome";

/**
 * Levels must accept the other ways real Git offers to do the same thing: the long spelling of a
 * flag, `git merge --continue` instead of `git commit`, `git checkout -- <file>` instead of
 * `git restore`. Commands run the way the game runs them: a failed command counts for nothing,
 * and after every command the level's state-based requirements are checked too.
 */
function play(stageId: string, levelId: number, steps: (string | ((fs: FileSystem) => void))[]) {
    const fileSystem = new FileSystem();
    const gitRepository = new GitRepository(fileSystem);
    const levelManager = new LevelManager();
    const processor = new CommandProcessor(fileSystem, gitRepository, new ProgressManager());
    expect(levelManager.setupLevel(stageId, levelId, fileSystem, gitRepository)).toBe(true);

    let completed = false;
    for (const step of steps) {
        if (typeof step === "function") {
            step(fileSystem);
        } else {
            const output = processor.processCommand(step);
            expect(didCommandFail(output, step), `${step}\n${output.join("\n")}`).toBe(false);
            const [cmd, ...args] = splitCommandRespectingQuotes(step);
            if (levelManager.checkLevelCompletion(stageId, levelId, cmd ?? "", args, gitRepository)) completed = true;
        }
        if (levelManager.checkStateBasedRequirements(stageId, levelId, gitRepository, fileSystem)) completed = true;
    }
    return completed;
}

describe("levels accept equivalent real-Git commands", () => {
    it("stash/3 starts with stashes, so its hints work as written", () => {
        expect(play("stash", 3, ["git stash list", "git stash pop"])).toBe(true);
    });

    it("archaeology/4 accepts git reset <file> and git checkout -- <file>", () => {
        expect(play("archaeology", 4, ["git reset config.js", "git checkout -- notes.md"])).toBe(true);
    });

    it("workflow/4 accepts a bare git push once the branch tracks origin", () => {
        expect(play("workflow", 4, ["git add .", "git commit --amend -m 'Fix login timeout'", "git push"])).toBe(true);
    });

    it("remote/4 accepts --set-upstream for -u", () => {
        expect(
            play("remote", 4, [
                "git push --set-upstream origin login-form",
                "git add .",
                "git commit -m 'Polish login error messages'",
                "git push",
            ]),
        ).toBe(true);
    });

    it("teamwork/4 accepts --cached for --staged", () => {
        expect(
            play("teamwork", 4, ["git diff", "git add .", "git diff --cached", "git commit -m 'Add email validation'"]),
        ).toBe(true);
    });

    it("rebase/3 accepts --interactive for -i", () => {
        expect(play("rebase", 3, ["git rebase --interactive HEAD~3"])).toBe(true);
    });

    it("teamwork/1 notices an edit made between commands, not only one saved in the editor", () => {
        expect(
            play("teamwork", 1, [
                "git pull origin main",
                fs => fs.writeFile("/team.md", (fs.getFileContents("/team.md") ?? "") + "\n- New member added!"),
                "git switch -c feature/my-profile",
                "git add .",
                "git commit -m 'Add myself to the team'",
                "git push -u origin feature/my-profile",
            ]),
        ).toBe(true);
    });

    it("teamwork/2 can be resolved by taking their side with git checkout --theirs", () => {
        expect(
            play("teamwork", 2, [
                "git add .",
                "git commit -m 'My local changes'",
                "git pull",
                "git checkout --theirs src/auth/login.js",
                "git add src/auth/login.js",
                "git commit -m 'Resolve conflict'",
            ]),
        ).toBe(true);
    });

    it("merge/4 accepts git merge --continue to conclude the merge", () => {
        expect(
            play("merge", 4, [
                "git status",
                fs =>
                    fs.writeFile(
                        "/src/api.js",
                        "// API request handler\nconst RATE_LIMIT = 100;\nconst TIMEOUT_MS = 8000;\n\nmodule.exports = {};",
                    ),
                "git add .",
                "git merge --continue",
            ]),
        ).toBe(true);
    });
});
