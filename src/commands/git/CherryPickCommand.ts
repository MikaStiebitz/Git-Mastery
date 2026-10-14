import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { runSequencerCommand } from "../helpers/sequencer";

export class CherryPickCommand implements Command {
    name = "git cherry-pick";
    description = "Apply the changes introduced by some existing commits";
    usage = "git cherry-pick [--edit] [-n] [-m <parent-number>] [-x] <commit>...";
    examples = [
        "git cherry-pick a1b2c3d",
        "git cherry-pick feature~2",
        "git cherry-pick main..feature",
        "git cherry-pick -n a1b2c3d",
        "git cherry-pick --continue",
        "git cherry-pick --abort",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "abort",
            "continue",
            "quit",
            "skip",
            "n",
            "no-commit",
            "e",
            "edit",
            "no-edit",
            "x",
            "ff",
            "s",
            "signoff",
            "allow-empty",
            "keep-redundant-commits",
        ],
        value: ["m", "mainline", "strategy", "X", "strategy-option"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        return runSequencerCommand("cherry-pick", args, context, this.usage);
    }
}
