import type { Command, CommandArgs, CommandContext } from "../base/Command";
import { resolvePath } from "~/lib/utils";

export class RestoreCommand implements Command {
    name = "git restore";
    description = "Restore working tree files";
    usage = "git restore <file> or git restore --staged <file>";
    examples = ["git restore file.txt", "git restore --staged file.txt"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, fileSystem } = context;

        if (!gitRepository.isInitialized()) {
            return ["Not a git repository. Run 'git init' first."];
        }

        if (args.positionalArgs.length === 0) {
            return ["nothing specified, nothing restored."];
        }

        // Check for --staged flag
        const isStaged = args.flags.staged !== undefined;

        // Get the file path (positional args don't include leading slash)
        const fileName = args.positionalArgs[0] ?? "";
        const filePath = resolvePath(fileName, context.currentDirectory);
        const normalizedPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;

        // Check if file exists
        if (fileSystem.getFileContents(filePath) === null) {
            return [`error: pathspec '${fileName}' did not match any file(s) known to git`];
        }

        // Update file status based on flag
        if (isStaged) {
            // Unstage the file (move from staged to modified or untracked)
            const currentStatus = gitRepository.getStatus()[normalizedPath];
            if (currentStatus === "staged") {
                gitRepository.updateFileStatus(normalizedPath, "modified");
                return [`Unstaged changes for '${fileName}'`];
            } else {
                return [`No staged changes for '${fileName}'`];
            }
        } else {
            // Discard working directory changes - restore to committed version
            const committedContent = gitRepository.getCommittedFileContent(normalizedPath);
            if (committedContent !== null) {
                // Restore file to committed version
                fileSystem.writeFile(filePath, committedContent);
                gitRepository.updateFileStatus(normalizedPath, "committed");
                return [`Restored '${fileName}'`];
            } else {
                return [`error: pathspec '${fileName}' did not match any file(s) known to git`];
            }
        }
    }
}
