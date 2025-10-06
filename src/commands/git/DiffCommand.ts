import type { Command, CommandArgs, CommandContext } from "../base/Command";
import { resolvePath } from "~/lib/utils";

export class DiffCommand implements Command {
    name = "git diff";
    description = "Show changes between commits, commit and working tree, etc";
    usage = "git diff [<options>] [<commit>] [--] [<path>...]";
    examples = ["git diff", "git diff HEAD~1 HEAD", "git diff file.txt"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, fileSystem } = context;

        if (!gitRepository.isInitialized()) {
            return ["Not a git repository. Run 'git init' first."];
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
            // Show working tree changes (modified/untracked files)
            const modifiedFiles = Object.entries(status).filter(
                ([_, s]) => s === "modified" || s === "untracked"
            );

            if (specificFile) {
                const normalizedFile = specificFile.startsWith("/") ? specificFile.substring(1) : specificFile;
                const fileStatus = status[normalizedFile];
                if (fileStatus === "modified" || fileStatus === "untracked") {
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
