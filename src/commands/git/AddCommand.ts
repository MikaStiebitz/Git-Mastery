import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { getAllFiles, resolvePath } from "~/lib/utils";

export class AddCommand implements Command {
    name = "git add";
    description = "Add file contents to the index";
    usage = "git add <file>... or git add .";
    examples = ["git add file.txt", "git add .", "git add src/"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "A",
            "all",
            "no-all",
            "p",
            "patch",
            "u",
            "update",
            "f",
            "force",
            "n",
            "dry-run",
            "i",
            "interactive",
            "v",
            "verbose",
            "ignore-errors",
            "intent-to-add",
            "N",
        ],
        value: [],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, fileSystem } = context;

        if (!gitRepository.isInitialized()) return ["Not a git repository. Run 'git init' first."];
        if (!gitRepository.isInRepository(context.currentDirectory)) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        if (args.positionalArgs.length === 0) {
            return ["Nothing specified, nothing added."];
        }

        // Handle 'git add .'
        if (args.positionalArgs[0] === ".") {
            // Get all files in the current directory recursively
            const allFiles = getAllFiles(fileSystem, context.currentDirectory);
            const stagedFiles = [];
            const gitStatus = gitRepository.getStatus();

            // Mark appropriate files as staged
            for (const file of allFiles) {
                // Skip .git directory
                if (file.startsWith("/.git") || file.includes("/.git/") || file.startsWith(".git")) {
                    continue;
                }

                // Normalize path consistently - remove leading slash
                const normalizedPath = file.startsWith("/") ? file.substring(1) : file;

                // Get file status - files without status are treated as untracked
                const fileStatus = gitStatus[normalizedPath];

                // Skip files that are already staged or committed (clean)
                if (fileStatus === "staged" || fileStatus === "committed") {
                    continue;
                }

                // Stage files that have changes or are new (untracked/no status)
                // modified, untracked, deleted, or undefined (new file not yet tracked)
                gitRepository.addFile(normalizedPath);
                stagedFiles.push(normalizedPath);
            }

            if (stagedFiles.length === 0) {
                return ["No changes to add."];
            }

            return [`Added ${stagedFiles.length} files to staging area.`];
        } else {
            // Handle specific files - use consistent path normalization
            const results: string[] = [];

            for (const argPath of args.positionalArgs) {
                // Use resolvePath for consistent path resolution
                const filePath = resolvePath(argPath, context.currentDirectory);

                if (fileSystem.getFileContents(filePath) === null) {
                    results.push(`pathspec '${argPath}' did not match any files`);
                    continue;
                }

                // Normalize path consistently - same as git add .
                const normalizedPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;

                // Stage the file (addFile normalizes the path internally)
                gitRepository.addFile(normalizedPath);

                results.push(`Added ${argPath} to staging area.`);
            }

            return results.length ? results : ["No changes to add."];
        }
    }
}
