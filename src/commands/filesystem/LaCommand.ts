import type { Command, CommandArgs, CommandContext } from "../base/Command";
import { LsCommand } from "./LsCommand";

export class LaCommand implements Command {
    name = "la";
    description = "List all directory contents including hidden files";
    usage = "la";
    examples = ["la"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

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
