import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { runSequencerCommand } from "../helpers/sequencer";

export class RevertCommand implements Command {
    name = "git revert";
    description = "Revert some existing commits";
    usage = "git revert [--[no-]edit] [-n] [-m <parent-number>] <commit>...";
    examples = [
        "git revert HEAD",
        "git revert a1b2c3d",
        "git revert HEAD~2..HEAD",
        "git revert -n HEAD",
        "git revert --abort",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["abort", "continue", "quit", "skip", "n", "no-commit", "e", "edit", "no-edit", "s", "signoff"],
        value: ["m", "mainline", "strategy", "X", "strategy-option"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        return runSequencerCommand("revert", args, context, this.usage);
    }
}
