import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class MergeCommand implements Command {
    name = "git merge";
    description = "Join two or more development histories together";
    usage = "git merge [<options>] <commit>...";
    examples = [
        "git merge feature",
        "git merge --abort",
        "git merge --no-ff feature",
        "git merge feature develop",
        "git merge -m 'Merge message' feature",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository } = context;

        if (!gitRepository.isInitialized()) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        const parseResult = this.parseMergeArgs(args);

        if (parseResult.error) {
            return [parseResult.error];
        }

        const { isAbort, branches, message } = parseResult;

        // Handle merge abort
        if (isAbort) {
            return ["Merge aborted. Working tree is clean."];
        }

        if (branches.length === 0) {
            return ["fatal: No commit specified and merge.defaultToUpstream not set."];
        }

        const currentBranch = gitRepository.getCurrentBranch();
        const allBranches = gitRepository.getBranches();

        // Validate all branch references
        for (const branch of branches) {
            if (!allBranches.includes(branch)) {
                return [`fatal: '${branch}' does not point to a commit`];
            }
        }

        // Check for self-merge
        if (branches.includes(currentBranch)) {
            return [`fatal: Cannot merge branch '${currentBranch}' into itself.`];
        }

        // Handle single branch merge (most common case)
        if (branches.length === 1) {
            const targetBranch = branches[0]!; // Safe due to length check above

            // Perform the merge
            const mergeResult = gitRepository.merge(targetBranch);

            if (!mergeResult.success) {
                return [
                    `Auto-merging failed. Fix conflicts and then commit the result.`,
                    `Automatic merge failed; fix conflicts and then commit the result.`,
                ];
            }

            // Check if already up to date
            if (mergeResult.filesChanged.length === 0 && !mergeResult.isFastForward) {
                return [`Already up to date.`];
            }

            // Handle fast-forward merge
            if (mergeResult.isFastForward) {
                const stats = this.generateFileStats(mergeResult.filesChanged);
                return [
                    `Updating ${this.getMockCommitHash()}..${this.getMockCommitHash()}`,
                    `Fast-forward`,
                    ...stats,
                ];
            }

            // Handle regular merge commit
            const mergeMessage = message ?? `Merge branch '${targetBranch}' into ${currentBranch}`;
            const commitId = mergeResult.mergeCommitId ?? this.getMockCommitHash();
            const stats = this.generateFileStats(mergeResult.filesChanged);

            return [
                `Merge made by the 'ort' strategy.`,
                ...stats,
                `[${currentBranch} ${commitId}] ${mergeMessage}`,
            ];
        }

        // Handle octopus merge (multiple branches)
        const branchList = branches.join(", ");
        return [
            `Trying simple merge with ${branchList}`,
            `Merge made by the 'octopus' strategy.`,
            ` ${branches.length} files changed, ${branches.length} insertions(+)`,
        ];
    }

    private parseMergeArgs(args: CommandArgs): {
        isAbort: boolean;
        isNoFF: boolean;
        branches: string[];
        message?: string;
        error?: string;
    } {
        const isAbort = args.flags.abort !== undefined;
        const isNoFF = args.flags["no-ff"] !== undefined;
        const message =
            typeof args.flags.m === "string"
                ? args.flags.m
                : typeof args.flags.message === "string"
                  ? args.flags.message
                  : undefined;

        // If abort flag is present, we don't need other arguments
        if (isAbort) {
            return { isAbort: true, isNoFF: false, branches: [] };
        }

        const branches = args.positionalArgs;

        return {
            isAbort: false,
            isNoFF,
            branches,
            message,
        };
    }

    private generateFileStats(files: string[]): string[] {
        if (files.length === 0) {
            return [];
        }

        const stats: string[] = [];

        // Generate file-by-file stats
        for (const file of files) {
            stats.push(` ${file} | 1 +`);
        }

        // Generate summary
        const pluralFiles = files.length === 1 ? "file" : "files";
        stats.push(` ${files.length} ${pluralFiles} changed, ${files.length} insertion${files.length === 1 ? "" : "s"}(+)`);

        return stats;
    }

    private getMockCommitHash(): string {
        return Math.random().toString(16).substring(2, 9);
    }
}
