import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { resolvePath } from "~/lib/utils";
import { missingOperand, parentPath, pathKind } from "./shell";

export class TouchCommand implements Command {
    name = "touch";
    description = "Create a new empty file";
    usage = "touch <file>...";
    examples = ["touch newfile.txt", "touch README.md", "touch a.txt b.txt"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["a", "c", "no-create", "m"],
        value: ["d", "date", "r", "reference"],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { fileSystem } = context;
        if (args.positionalArgs.length === 0) return missingOperand("touch", "file operand");
        const noCreate = args.flags.c !== undefined || args.flags["no-create"] !== undefined;

        const errors: string[] = [];
        for (const name of args.positionalArgs) {
            const path = resolvePath(name, context.currentDirectory);
            const kind = pathKind(fileSystem, path);
            if (kind === "directory") continue; // only its timestamp changes
            if (kind === "file") {
                fileSystem.writeFile(path, fileSystem.getFileContents(path) ?? "");
                continue;
            }
            if (noCreate) continue;
            const parent = pathKind(fileSystem, parentPath(path));
            if (parent !== "directory") {
                const reason = parent === "file" ? "Not a directory" : "No such file or directory";
                errors.push(`touch: cannot touch '${name}': ${reason}`);
                continue;
            }
            // No Git bookkeeping needed: Git sees the new file as untracked by itself.
            fileSystem.writeFile(path, "");
        }
        return errors;
    }
}
