import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { resolvePath } from "~/lib/utils";
import { missingOperand, parentPath, pathKind } from "./shell";

export class MkdirCommand implements Command {
    name = "mkdir";
    description = "Create a new directory";
    usage = "mkdir [-p] <directory>...";
    examples = ["mkdir new-dir", "mkdir -p src/components"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["p", "parents", "v", "verbose"],
        value: ["m", "mode"],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { fileSystem } = context;
        if (args.positionalArgs.length === 0) return missingOperand("mkdir");
        const parents = args.flags.p !== undefined || args.flags.parents !== undefined;
        const verbose = args.flags.v !== undefined || args.flags.verbose !== undefined;

        const lines: string[] = [];
        for (const name of args.positionalArgs) {
            const path = resolvePath(name, context.currentDirectory);
            const kind = pathKind(fileSystem, path);
            if (kind !== null) {
                if (!(parents && kind === "directory")) {
                    lines.push(`mkdir: cannot create directory '${name}': File exists`);
                }
                continue;
            }
            if (!parents && pathKind(fileSystem, parentPath(path)) !== "directory") {
                const reason =
                    pathKind(fileSystem, parentPath(path)) === "file" ? "Not a directory" : "No such file or directory";
                lines.push(`mkdir: cannot create directory '${name}': ${reason}`);
                continue;
            }
            if (!fileSystem.mkdir(path)) {
                lines.push(`mkdir: cannot create directory '${name}': Not a directory`);
                continue;
            }
            if (verbose) lines.push(`mkdir: created directory '${name}'`);
        }
        return lines;
    }
}
