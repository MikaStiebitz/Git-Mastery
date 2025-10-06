import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class BisectCommand implements Command {
    name = "git bisect";
    description = "Use binary search to find the commit that introduced a bug";
    usage = "git bisect <subcommand> [options]";
    examples = [
        "git bisect start",
        "git bisect bad",
        "git bisect good <commit>",
        "git bisect reset",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository } = context;

        if (!gitRepository.isInitialized()) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        const subcommand = args.positionalArgs[0];

        if (!subcommand) {
            return [
                "usage: git bisect [start|bad|good|reset]",
                "",
                "Git bisect helps you find the commit that introduced a bug using binary search.",
                "",
                "Common workflow:",
                "  git bisect start       # Start bisecting",
                "  git bisect bad         # Mark current commit as bad",
                "  git bisect good <sha>  # Mark a known good commit",
                "  git bisect reset       # Exit bisect mode",
            ];
        }

        switch (subcommand.toLowerCase()) {
            case "start":
                return this.handleStart(context);

            case "bad":
                return this.handleBad(context);

            case "good":
                return this.handleGood(args, context);

            case "reset":
                return this.handleReset(context);

            default:
                return [
                    `git: '${subcommand}' is not a git bisect command. See 'git bisect --help'.`,
                    "",
                    "Available subcommands:",
                    "  start - Start a bisect session",
                    "  bad   - Mark current commit as bad",
                    "  good  - Mark commit as good",
                    "  reset - Exit bisect mode",
                ];
        }
    }

    private handleStart(context: CommandContext): string[] {
        const { gitRepository } = context;
        const commits = Object.keys(gitRepository.getCommits());

        if (commits.length < 2) {
            return [
                "error: You need at least 2 commits to start bisecting.",
                "Create more commits first.",
            ];
        }

        return [
            "status: waiting for both good and bad commits",
            "status: bisecting",
            "",
            "Now mark the current state as good or bad:",
            "  git bisect good  - if the current version is working",
            "  git bisect bad   - if the current version is broken",
        ];
    }

    private handleBad(context: CommandContext): string[] {
        const { gitRepository } = context;
        const commits = gitRepository.getCommits();
        const commitIds = Object.keys(commits);
        const lastCommitId = commitIds[commitIds.length - 1];
        const currentCommit = lastCommitId ? commits[lastCommitId] : null;

        if (!currentCommit) {
            return ["error: No commits available."];
        }

        const currentHash = lastCommitId?.substring(0, 7) ?? "unknown";

        return [
            `Marked current commit as BAD: [${currentHash}] ${currentCommit.message}`,
            "",
            "Continue marking commits as good or bad:",
            "  git bisect good - if this version works",
            "  git bisect bad  - if this version is broken",
        ];
    }

    private handleGood(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository } = context;
        const commitHash = args.positionalArgs[1];

        if (commitHash) {
            // Validate commit exists
            const commits = gitRepository.getCommits();
            const commitIds = Object.keys(commits);
            const commit = commitIds.find(id => id.startsWith(commitHash));

            if (!commit) {
                return [`error: Could not find commit ${commitHash}`];
            }

            return [
                `Marked commit ${commitHash.substring(0, 7)} as GOOD`,
                "",
                "Bisecting: narrowing down the range...",
                "Continue testing and marking commits as good or bad.",
            ];
        }

        // No commit specified, mark current as good
        const commits = gitRepository.getCommits();
        const commitIds = Object.keys(commits);
        const lastCommitId = commitIds[commitIds.length - 1];
        const currentCommit = lastCommitId ? commits[lastCommitId] : null;

        if (!currentCommit) {
            return ["error: No commits available."];
        }

        const currentHash = lastCommitId?.substring(0, 7) ?? "unknown";

        return [
            `Marked current commit as good: ${currentHash}`,
            "",
            "Continue marking commits:",
            "  git bisect bad - if you find a broken version",
        ];
    }

    private handleReset(context: CommandContext): string[] {
        const { gitRepository } = context;
        const currentBranch = gitRepository.getCurrentBranch();
        const commits = gitRepository.getCommits();
        const commitIds = Object.keys(commits);
        const headHash = commitIds.length > 0 ? commitIds[commitIds.length - 1]?.substring(0, 7) : "unknown";

        return [
            "Bisect session ended.",
            `Previous HEAD position was ${headHash}`,
            `Switched to branch '${currentBranch}'`,
        ];
    }
}
