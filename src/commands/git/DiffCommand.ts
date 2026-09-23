import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { resolvePath } from "~/lib/utils";
import { hint, notARepository } from "../base/GitErrors";
import type { GitRepository } from "~/models/GitRepository";

export class DiffCommand implements Command {
    name = "git diff";
    description = "Show changes between commits, commit and working tree, etc";
    usage = "git diff [<options>] [<commit>] [--] [<path>...]";
    examples = ["git diff", "git diff HEAD~1 HEAD", "git diff file.txt"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "cached",
            "staged",
            "stat",
            "numstat",
            "shortstat",
            "name-only",
            "name-status",
            "color",
            "no-color",
            "w",
            "ignore-all-space",
            "b",
            "patch",
            "p",
            "no-patch",
        ],
        value: ["U", "unified", "M", "find-renames"],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, fileSystem } = context;

        if (!gitRepository.isInitialized()) {
            return notARepository();
        }

        const isStaged = args.flags.staged || args.flags.cached;
        const status = gitRepository.getStatus();
        const output: string[] = [];

        // Check if specific file was requested
        let specificFile = "";
        if (args.positionalArgs.length > 0) {
            specificFile = args.positionalArgs[0]!;
            const fullPath = resolvePath(specificFile, context.currentDirectory);

            if (fileSystem.getFileContents(fullPath) === null) {
                return [`diff: ${specificFile}: No such file or directory`];
            }
        }

        if (isStaged) {
            // Show staged changes
            const stagedFiles = Object.entries(status).filter(([_, s]) => s === "staged");

            if (specificFile) {
                const normalizedFile = specificFile.startsWith("/") ? specificFile.substring(1) : specificFile;
                if (status[normalizedFile] === "staged") {
                    output.push(`diff --git a/${specificFile} b/${specificFile}`);
                    output.push("index abcdef..012345 100644");
                    output.push(`--- a/${specificFile}`);
                    output.push(`+++ b/${specificFile}`);
                    output.push("@@ -1,3 +1,3 @@");
                    output.push(" Unchanged line");
                    output.push("-Removed line");
                    output.push("+Added line");
                }
            } else {
                for (const [file] of stagedFiles) {
                    output.push(`diff --git a/${file} b/${file}`);
                    output.push("index abcdef..012345 100644");
                    output.push(`--- a/${file}`);
                    output.push(`+++ b/${file}`);
                    output.push("@@ -1,3 +1,3 @@");
                    output.push(" Unchanged line");
                    output.push("-Removed line");
                    output.push("+Added line");
                    if (stagedFiles.length > 1) output.push(""); // Blank line between files
                }
            }
        } else {
            // Show working tree changes.
            //
            // Only tracked files that changed. Real `git diff` never shows an untracked file — it has
            // no committed version to compare against — and including them here meant a stray new file
            // could fill the output while the modified file the task was about went unmentioned.
            const modifiedFiles = Object.entries(status).filter(([_, s]) => s === "modified" || s === "deleted");

            if (specificFile) {
                const normalizedFile = specificFile.startsWith("/") ? specificFile.substring(1) : specificFile;
                const fileStatus = status[normalizedFile];

                if (fileStatus === "untracked") {
                    return [
                        hint(`'${specificFile}' is untracked, so there is nothing to compare it against.`),
                        hint(`Run 'git add ${specificFile}' first, then 'git diff --staged' to see it.`),
                    ];
                }

                if (fileStatus === "modified" || fileStatus === "deleted") {
                    output.push(`diff --git a/${specificFile} b/${specificFile}`);
                    output.push("index abcdef..012345 100644");
                    output.push(`--- a/${specificFile}`);
                    output.push(`+++ b/${specificFile}`);
                    output.push("@@ -1,3 +1,3 @@");
                    output.push(" Unchanged line");
                    output.push("-Removed line");
                    output.push("+Added line");
                }
            } else {
                for (const [file] of modifiedFiles) {
                    output.push(`diff --git a/${file} b/${file}`);
                    output.push("index abcdef..012345 100644");
                    output.push(`--- a/${file}`);
                    output.push(`+++ b/${file}`);
                    output.push("@@ -1,3 +1,3 @@");
                    output.push(" Unchanged line");
                    output.push("-Removed line");
                    output.push("+Added line");
                    if (modifiedFiles.length > 1) output.push(""); // Blank line between files
                }
            }
        }

        // Real Git prints nothing when there is nothing to compare, and that is kept — but silence
        // is indistinguishable from a broken command when you are learning, and this is the command
        // people run straight after `git status` shows them three untracked files. The diff itself
        // stays empty; a hint explains why it is.
        if (output.length === 0) {
            return this.explainEmptyDiff(gitRepository, !!isStaged);
        }

        return output;
    }

    /** Why `git diff` had nothing to say, in terms of what the player can see on screen. */
    private explainEmptyDiff(gitRepository: GitRepository, isStaged: boolean): string[] {
        const status = gitRepository.getWorkingTreeStatus();
        const counts = Object.values(status);
        const untracked = counts.filter(state => state === "untracked").length;
        const staged = counts.filter(state => state === "staged").length;

        if (isStaged) {
            return staged > 0
                ? [hint("Nothing staged differs from the last commit.")]
                : [
                      hint("Nothing is staged, so there is nothing to compare."),
                      hint("Stage something with 'git add <file>', then try again."),
                  ];
        }

        if (untracked > 0) {
            return [
                hint(`No tracked changes. Git can see ${untracked} untracked file${untracked === 1 ? "" : "s"},`),
                hint("but an untracked file has no committed version to compare against — that is why"),
                hint("it shows no diff. Run 'git add <file>' first, then 'git diff --staged'."),
            ];
        }

        return [hint("No changes. Your files match the last commit.")];
    }
}
