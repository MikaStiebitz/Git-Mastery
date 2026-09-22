import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";

export class PwdCommand implements Command {
    name = "pwd";
    description = "Print working directory";
    usage = "pwd";
    examples = ["pwd"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["L", "P"],
        value: [],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        return [context.currentDirectory];
    }
}
