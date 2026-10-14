import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { resolvePath } from "~/lib/utils";
import type { FileSystem } from "~/models/FileSystem";
import { missingOperand, pathKind } from "./shell";

export class RmCommand implements Command {
    name = "rm";
    description = "Remove files or directories";
    usage = "rm [-r] [-f] <file_or_directory>...";
    examples = ["rm file.txt", "rm -r directory", "rm a.txt b.txt"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["r", "R", "recursive", "f", "force", "i", "interactive", "v", "verbose", "d", "dir"],
        value: [],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { fileSystem } = context;
        const flags = args.flags;
        const recursive = flags.r !== undefined || flags.R !== undefined || flags.recursive !== undefined;
        const force = flags.f !== undefined || flags.force !== undefined;
        const emptyDirs = flags.d !== undefined || flags.dir !== undefined;
        const verbose = flags.v !== undefined || flags.verbose !== undefined;

        if (args.positionalArgs.length === 0) return force ? [] : missingOperand("rm");

        const lines: string[] = [];
        for (const name of args.positionalArgs) {
            const base = name.replace(/\/+$/, "").split("/").pop();
            if (base === "." || base === "..") {
                lines.push(`rm: refusing to remove '.' or '..' directory: skipping '${name}'`);
                continue;
            }
            const path = resolvePath(name, context.currentDirectory);
            if (path === "/") {
                lines.push(
                    "rm: it is dangerous to operate recursively on '/'",
                    "rm: use --no-preserve-root to override this failsafe",
                );
                continue;
            }
            const kind = pathKind(fileSystem, path);
            if (kind === null) {
                if (!force) lines.push(`rm: cannot remove '${name}': No such file or directory`);
                continue;
            }
            if (kind === "directory" && !recursive) {
                const empty = Object.keys(fileSystem.getDirectoryContents(path) ?? {}).length === 0;
                if (!emptyDirs) {
                    lines.push(`rm: cannot remove '${name}': Is a directory`);
                    continue;
                }
                if (!empty) {
                    lines.push(`rm: cannot remove '${name}': Directory not empty`);
                    continue;
                }
            }
            // Git notices the deletion itself: a tracked file that is gone shows as "deleted".
            this.removeTree(path, fileSystem);
            if (verbose) lines.push(kind === "directory" ? `removed directory '${name}'` : `removed '${name}'`);
        }
        return lines;
    }

    private removeTree(path: string, fileSystem: FileSystem): void {
        const contents = fileSystem.getDirectoryContents(path);
        if (contents) {
            for (const name of Object.keys(contents)) {
                this.removeTree(path === "/" ? `/${name}` : `${path}/${name}`, fileSystem);
            }
        }
        fileSystem.delete(path);
    }
}
