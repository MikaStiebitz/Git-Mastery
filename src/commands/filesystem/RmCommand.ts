import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { resolvePath } from "~/lib/utils";
import type { FileSystem } from "~/models/FileSystem";

export class RmCommand implements Command {
    name = "rm";
    description = "Remove files or directories";
    usage = "rm [-r] <file_or_directory>";
    examples = ["rm file.txt", "rm -r directory"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["r", "R", "recursive", "f", "force", "i", "interactive", "v", "verbose", "d", "dir"],
        value: [],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { fileSystem } = context;

        if (args.positionalArgs.length === 0) {
            return ["Please specify a file or directory to remove."];
        }

        // Check for recursive flag
        const isRecursive = args.flags.r !== undefined || args.flags.recursive !== undefined;

        const file = args.positionalArgs[0] ?? "";
        const filePath = resolvePath(file, context.currentDirectory);

        // Check if path is a directory
        const isDirectory = fileSystem.getDirectoryContents(filePath) !== null;

        if (isDirectory && !isRecursive) {
            return [`Cannot remove '${file}': Is a directory. Use 'rm -r' for directories.`];
        }

        // If it's a file or we're using -r flag
        const success = this.recursiveDelete(filePath, fileSystem, isRecursive);

        return success ? [`Removed '${file}'.`] : [`Failed to remove '${file}'.`];
    }

    // New method to handle recursive deletion
    private recursiveDelete(path: string, fileSystem: FileSystem, isRecursive: boolean): boolean {
        // If it's a file, simply delete it
        if (fileSystem.getFileContents(path) !== null) {
            // Git notices the deletion itself: a tracked file that is gone shows as "deleted".
            return fileSystem.delete(path);
        }

        // If it's a directory and recursive is enabled
        if (isRecursive) {
            const contents = fileSystem.getDirectoryContents(path);
            if (!contents) return false;

            // Delete all contents first
            for (const [name, item] of Object.entries(contents)) {
                const subPath = path === "/" ? `/${name}` : `${path}/${name}`;

                if (item.type === "file") {
                    fileSystem.delete(subPath);
                } else if (item.type === "directory") {
                    // Recursively delete subdirectory
                    this.recursiveDelete(subPath, fileSystem, true);
                }
            }

            // Finally delete the directory itself
            return fileSystem.delete(path);
        }

        return false;
    }
}
