import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { LsCommand } from "./LsCommand";

export class LaCommand implements Command {
    name = "la";
    description = "List all directory contents including hidden files";
    usage = "la";
    examples = ["la"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["a", "all", "l", "long", "h", "R", "recursive", "1"],
        value: [],
    };
    private lsCommand = new LsCommand();

    execute(args: CommandArgs, context: CommandContext): string[] {
        // Create modified args with the -a flag set
        const modifiedArgs: CommandArgs = {
            ...args,
            flags: { ...args.flags, a: true },
        };

        return this.lsCommand.execute(modifiedArgs, context);
    }
}
