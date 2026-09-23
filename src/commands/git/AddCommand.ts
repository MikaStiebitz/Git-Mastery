import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { getAllFiles, resolvePath } from "~/lib/utils";
import { hint, notARepository, pathSuggestionHints, unknownFlagError } from "../base/GitErrors";

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

        if (!gitRepository.isInitialized()) {
            return notARepository();
        }
        if (!gitRepository.isInRepository(context.currentDirectory)) {
            return notARepository();
        }

        // A mistyped flag is an error, not something to ignore.
        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) {
            return unknownFlagError(unknownFlag, this.usage);
        }

        if (args.positionalArgs.length === 0) {
            // Real Git prints exactly this pair, hint included.
            return ["Nothing specified, nothing added.", hint("Maybe you wanted to say 'git add .'?")];
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
            // Handle specific files - use consistent path normalization.
            //
            // Real Git refuses the whole command when any pathspec is wrong and stages nothing, so
            // resolve every path first and only then stage. Staging the paths that happened to be
            // spelled correctly would leave the repository in a state the user did not ask for.
            const resolved: { argPath: string; normalizedPath: string }[] = [];

            for (const argPath of args.positionalArgs) {
                // Use resolvePath for consistent path resolution
                const filePath = resolvePath(argPath, context.currentDirectory);
                const isDirectory = fileSystem.getDirectoryContents(filePath) !== null;

                if (fileSystem.getFileContents(filePath) === null && !isDirectory) {
                    return [
                        `fatal: pathspec '${argPath}' did not match any files`,
                        ...pathSuggestionHints(argPath, getAllFiles(fileSystem, context.currentDirectory)),
                    ];
                }

                if (isDirectory) {
                    // A directory stages everything inside it, the way `git add src` does.
                    // getAllFiles returns paths relative to the directory it is given, so pass that
                    // directory as the prefix to get paths relative to the repository root instead.
                    const dirPrefix = filePath.replace(/^\//, "");
                    for (const file of getAllFiles(fileSystem, filePath, dirPrefix)) {
                        resolved.push({ argPath, normalizedPath: file });
                    }
                    continue;
                }

                // Normalize path consistently - same as git add .
                resolved.push({
                    argPath,
                    normalizedPath: filePath.startsWith("/") ? filePath.substring(1) : filePath,
                });
            }

            const staged = new Set<string>();
            for (const { normalizedPath } of resolved) {
                gitRepository.addFile(normalizedPath);
                staged.add(normalizedPath);
            }

            if (staged.size === 0) {
                return ["No changes to add."];
            }

            return args.positionalArgs.map(argPath => `Added ${argPath} to staging area.`);
        }
    }
}
