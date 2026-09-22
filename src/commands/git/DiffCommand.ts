import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { resolvePath } from "~/lib/utils";
import { hint, notARepository } from "../base/GitErrors";

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

        return output;
    }
}
