import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { hint, notARepository, refSuggestionHints, unknownFlagError } from "../base/GitErrors";

export class PushCommand implements Command {
    name = "git push";
    description = "Update remote refs along with associated objects";
    usage = "git push [--tags] [<remote> [<branch>|<tag>]]";
    examples = [
        "git push",
        "git push origin main",
        "git push -u origin feature",
        "git push origin v1.0.0",
        "git push --tags",
        "git push origin --tags",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "u",
            "set-upstream",
            "f",
            "force",
            "force-with-lease",
            "all",
            "tags",
            "follow-tags",
            "delete",
            "d",
            "n",
            "dry-run",
            "q",
            "quiet",
            "v",
            "verbose",
            "atomic",
            "prune",
            "mirror",
        ],
        value: ["repo", "o", "push-option"],
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

        // Check for --tags flag (CommandParser strips -- prefix, so check only 'tags')
        const pushAllTags = args.flags.tags !== undefined;

        // Default values
        let remote = "origin";
        let branch = gitRepository.getCurrentBranch();
        const setUpstream = args.flags.u !== undefined || args.flags["set-upstream"] !== undefined;

        // Parse positional arguments
        if (args.positionalArgs.length > 0) {
            remote = args.positionalArgs[0] ?? "origin";
        }

        if (args.positionalArgs.length > 1) {
            branch = args.positionalArgs[1] ?? gitRepository.getCurrentBranch();
        }

        // Validate remote exists. Git treats an unknown remote name as a URL and fails to reach it,
        // so that is the error it prints; the hints explain what a remote is and how to add one.
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
                hint(`A remote is a saved nickname for a repository URL.`),
                hint(`Add one with: git remote add ${remote} https://github.com/user/repo.git`),
                ...(configured.length > 0 ? [hint(`Configured remotes: ${configured.join(", ")}`)] : []),
            ];
        }

        // Handle pushing tags
        if (pushAllTags) {
            const result = gitRepository.pushTags(remote);
            return result.messages;
        }

        // Check if the refspec is a tag instead of a branch
        if (gitRepository.hasTag(branch)) {
            const result = gitRepository.pushTags(remote, branch);
            return result.messages;
        }

        // Check if branch has upstream tracking
        const hasUpstream = gitRepository.hasUpstreamBranch(branch);

        // If no arguments provided and no upstream, show error
        if (args.positionalArgs.length === 0 && !hasUpstream && !setUpstream) {
            return [
                `fatal: The current branch ${branch} has no upstream branch.`,
                `To push the current branch and set the remote as upstream, use`,
                ``,
                `    git push --set-upstream origin ${branch}`,
                ``,
                hint(`An upstream is the remote branch this local branch is paired with.`),
                hint(`Without it, a bare 'git push' does not know where to send your commits.`),
                hint(`-u (short for --set-upstream) saves that pairing once, so every later`),
                hint(`'git push' and 'git pull' on this branch needs no arguments at all.`),
            ];
        }

        // Validate branch exists
        const branches = gitRepository.getBranches();
        if (!branches.includes(branch)) {
            return [
                `error: src refspec ${branch} does not match any`,
                `error: failed to push some refs to '${remotes[remote]}'`,
                ...refSuggestionHints(branch, branches),
            ];
        }

        // Check if there are unpushed commits before pushing
        const hasUnpushedCommits = gitRepository.hasUnpushedCommits();
        const unpushedCommitCount = gitRepository.getUnpushedCommitCount();

        // Perform push with upstream flag
        const success = gitRepository.push(remote, branch, setUpstream);

        if (success) {
            if (hasUnpushedCommits) {
                // Show a more realistic push output when commits are actually pushed
                if (setUpstream) {
                    return [
                        `Branch '${branch}' set up to track remote branch '${branch}' from '${remote}'.`,
                        `Enumerating objects: ${unpushedCommitCount * 2 + 1}, done.`,
                        `Counting objects: 100% (${unpushedCommitCount * 2 + 1}/${unpushedCommitCount * 2 + 1}), done.`,
                        `Writing objects: 100% (${unpushedCommitCount}/${unpushedCommitCount}), 256 bytes | 256.00 KiB/s, done.`,
                        `Total ${unpushedCommitCount} (delta 0), reused 0 (delta 0)`,
                        `To ${remotes[remote]}`,
                        `   a1b2c3d..e4f5g6h  ${branch} -> ${branch}`,
                    ];
                } else {
                    return [
                        `Enumerating objects: ${unpushedCommitCount * 2 + 1}, done.`,
                        `Counting objects: 100% (${unpushedCommitCount * 2 + 1}/${unpushedCommitCount * 2 + 1}), done.`,
                        `Writing objects: 100% (${unpushedCommitCount}/${unpushedCommitCount}), 256 bytes | 256.00 KiB/s, done.`,
                        `Total ${unpushedCommitCount} (delta 0), reused 0 (delta 0)`,
                        `To ${remotes[remote]}`,
                        `   a1b2c3d..e4f5g6h  ${branch} -> ${branch}`,
                    ];
                }
            } else {
                return ["Everything up-to-date"];
            }
        } else {
            return [`error: failed to push to '${remote}'`];
        }
    }
}
