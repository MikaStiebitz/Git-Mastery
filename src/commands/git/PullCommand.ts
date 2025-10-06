import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class PullCommand implements Command {
    name = "git pull";
    description = "Fetch from and integrate with another repository or a local branch";
    usage = "git pull [<remote> [<branch>]]";
    examples = ["git pull", "git pull origin main"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository } = context;

        if (!gitRepository.isInitialized()) {
            return ["Not a git repository. Run 'git init' first."];
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

        // Validate remote exists
        const remotes = gitRepository.getRemotes();
        if (!remotes[remote]) {
            return [`error: No such remote: '${remote}'`];
        }

        // Validate branch exists
        const branches = gitRepository.getBranches();
        if (!branches.includes(branch)) {
            return [`error: Couldn't find remote ref ${branch}`];
        }

        // Simulate pull response with proper git output
        return [
            `From ${remotes[remote]}`,
            ` * branch            ${branch} -> FETCH_HEAD`,
            "Already up to date.",
        ];
    }
}
