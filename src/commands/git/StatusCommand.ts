import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { unknownFlagError } from "../base/GitErrors";
import { requireRepository } from "../helpers/gitFormat";
import { longStatus, shortStatus } from "../helpers/statusFormat";

export class StatusCommand implements Command {
    name = "git status";
    description = "Show the working tree status";
    usage = "git status [<options>] [--] [<pathspec>...]";
    examples = ["git status", "git status -s", "git status -sb"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["s", "short", "b", "branch", "porcelain", "long", "v", "verbose", "ignored", "no-renames", "z"],
        value: [],
        optional: ["u", "untracked-files"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const short = args.flags.s !== undefined || args.flags.short !== undefined;
        const porcelain = args.flags.porcelain !== undefined;
        const branch = args.flags.b !== undefined || args.flags.branch !== undefined;

        // -u alone means "all"; -uno / --untracked-files=no hide them; "normal" is the default.
        const rawUntracked = args.flags.u ?? args.flags["untracked-files"];
        const untracked =
            rawUntracked === undefined
                ? "normal"
                : rawUntracked === true || rawUntracked === "" || rawUntracked === "all"
                  ? "all"
                  : rawUntracked;
        if (untracked !== "no" && untracked !== "normal" && untracked !== "all") {
            return [`fatal: Invalid untracked files mode '${untracked}'`];
        }
        const options = { untracked, pathspecs: args.positionalArgs } as const;

        if (short || porcelain) {
            return shortStatus(context, { branch, porcelain, ...options });
        }

        return longStatus(context, options);
    }
}
