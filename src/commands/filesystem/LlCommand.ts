import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { LsCommand } from "./LsCommand";

export class LlCommand implements Command {
    name = "ll";
    description = "List directory contents in long format";
    usage = "ll";
    examples = ["ll"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["a", "all", "l", "long", "h", "R", "recursive", "1"],
        value: [],
    };
    private lsCommand = new LsCommand();

    execute(args: CommandArgs, context: CommandContext): string[] {
        // Create modified args with the -l flag set
        const modifiedArgs: CommandArgs = {
            ...args,
            flags: { ...args.flags, l: true },
        };

        return this.lsCommand.execute(modifiedArgs, context);
    }
}
