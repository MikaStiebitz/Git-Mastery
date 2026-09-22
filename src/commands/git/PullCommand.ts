import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { hint, notARepository, refSuggestionHints, unknownFlagError } from "../base/GitErrors";

export class PullCommand implements Command {
    name = "git pull";
    description = "Fetch from and integrate with another repository or a local branch";
    usage = "git pull [<remote> [<branch>]]";
    examples = ["git pull", "git pull origin main"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "rebase",
            "no-rebase",
            "ff",
            "no-ff",
            "ff-only",
            "f",
            "force",
            "all",
            "q",
            "quiet",
            "v",
            "verbose",
            "autostash",
            "no-autostash",
            "prune",
            "tags",
        ],
        value: ["s", "strategy", "X", "strategy-option", "depth"],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository } = context;

        if (!gitRepository.isInitialized()) {
            return notARepository();
        }

        // A mistyped flag is an error, not something to ignore.
        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) {
            return unknownFlagError(unknownFlag, this.usage);
        }

        // Default values
        let remote = "origin";
        let branch = gitRepository.getCurrentBranch();

        // Parse positional arguments
        if (args.positionalArgs.length > 0) {
            remote = args.positionalArgs[0] ?? "origin";
        }

        if (args.positionalArgs.length > 1) {
            branch = args.positionalArgs[1] ?? gitRepository.getCurrentBranch();
        }

        // Validate remote exists. Same wording as push: Git reads an unknown remote name as a URL.
        const remotes = gitRepository.getRemotes();
        if (!remotes[remote]) {
            const configured = Object.keys(remotes);
            return [
                `fatal: '${remote}' does not appear to be a git repository`,
                `fatal: Could not read from remote repository.`,
                ``,
                `Please make sure you have the correct access rights`,
                `and the repository exists.`,
                ...refSuggestionHints(remote, configured),
                ...(configured.length > 0 ? [hint(`Configured remotes: ${configured.join(", ")}`)] : []),
            ];
        }

        // Validate branch exists
        const branches = gitRepository.getBranches();
        if (!branches.includes(branch)) {
            return [`fatal: couldn't find remote ref ${branch}`, ...refSuggestionHints(branch, branches)];
        }

        // Try to pull remote commits
        const pullResult = gitRepository.pullRemoteCommits(remote, branch);
        return pullResult.output;
    }
}
