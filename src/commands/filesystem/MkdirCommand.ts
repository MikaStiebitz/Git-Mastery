import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { resolvePath } from "~/lib/utils";

export class MkdirCommand implements Command {
    name = "mkdir";
    description = "Create a new directory";
    usage = "mkdir <directory>";
    examples = ["mkdir new-dir"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["p", "parents", "v", "verbose"],
        value: ["m", "mode"],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { fileSystem } = context;

        if (args.positionalArgs.length === 0) {
            return ["Please specify a directory name."];
        }

        const dir = args.positionalArgs[0] ?? "";
        const dirPath = resolvePath(dir, context.currentDirectory);

        const success = fileSystem.mkdir(dirPath);

        if (success) {
            return [`Created directory: ${dir}`];
        } else {
            return [`Failed to create directory: ${dir}`];
        }
    }
}
