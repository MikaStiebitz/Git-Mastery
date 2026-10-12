import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { resolvePath } from "~/lib/utils";

export class NanoCommand implements Command {
    name = "nano";
    description = "Edit a file using a simple editor";
    usage = "nano <file>";
    examples = ["nano README.md"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["l", "linenumbers", "m", "mouse", "v", "view"],
        value: [],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { fileSystem } = context;

        if (args.positionalArgs.length === 0) {
            return ["Please specify a file."];
        }

        const file = args.positionalArgs[0] ?? "";
        const filePath = resolvePath(file, context.currentDirectory);

        // Check if the file exists, and if not, create it
        if (fileSystem.getFileContents(filePath) === null) {
            // Create an empty file if it doesn't exist (Git will list it as untracked)
            fileSystem.writeFile(filePath, "");
        }

        // Return a message indicating the file is being opened
        return [`Opening file ${file} in editor...`];
    }
}
