import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";

export class RevertCommand implements Command {
    name = "git revert";
    description = "Revert some existing commits";
    usage = "git revert <commit>";
    examples = ["git revert HEAD", "git revert a1b2c3d"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["abort", "continue", "quit", "skip", "n", "no-commit", "e", "edit", "no-edit", "s", "signoff"],
        value: ["m", "mainline"],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository } = context;

        if (!gitRepository.isInitialized()) {
            return ["Not a git repository. Run 'git init' first."];
        }

        if (args.positionalArgs.length === 0) {
            return ["error: you must specify at least one commit to revert"];
        }

        const commitToRevert = args.positionalArgs[0];

        // For simplicity, we'll just handle HEAD to revert the last commit
        if (commitToRevert === "HEAD") {
            const commits = Object.keys(gitRepository.getCommits());

            if (commits.length === 0) {
                return [`fatal: bad revision 'HEAD'`];
            }

            // We don't actually modify history, just give appropriate message
            return [
                'Created revert commit: Revert "Last commit message"',
                "This reverts commit " + commits[commits.length - 1],
            ];
        }

        return ["Revert operation not fully implemented in this simulation. Supported: git revert HEAD"];
    }
}
