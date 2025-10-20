import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class TagCommand implements Command {
    name = "git tag";
    description = "Create, list, delete or verify tags";
    usage = "git tag [-l] [-d <tagname>] [<tagname>] [<commit>]";
    examples = [
        "git tag",
        "git tag v1.0.0",
        "git tag v1.0.0 abc123",
        "git tag -l",
        "git tag -d v1.0.0",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    private tags: Map<string, string> = new Map(); // tagName -> commitHash

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository } = context;

        if (!gitRepository.isInitialized()) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        // List tags
        if (args.positionalArgs.length === 0 || args.flags["-l"] || args.flags["--list"]) {
            return this.listTags();
        }

        // Delete tag
        if (args.flags.d || args.flags["-d"] || args.flags["--delete"]) {
            const tagName = args.positionalArgs[0];
            if (!tagName) {
                return ["error: tag name required for deletion"];
            }
            return this.deleteTag(tagName);
        }

        // Create tag
        const tagName = args.positionalArgs[0];
        if (!tagName) {
            return ["error: tag name required"];
        }

        const commitHash = args.positionalArgs[1];
        return this.createTag(tagName, commitHash, gitRepository, context);
    }

    private listTags(): string[] {
        if (this.tags.size === 0) {
            return [];
        }

        const sortedTags = Array.from(this.tags.keys()).sort();
        return sortedTags;
    }

    private deleteTag(tagName: string): string[] {
        if (!this.tags.has(tagName)) {
            return [`error: tag '${tagName}' not found`];
        }

        this.tags.delete(tagName);
        return [`Deleted tag '${tagName}'`];
    }

    private createTag(
        tagName: string,
        commitHash: string | undefined,
        gitRepository: GitRepository,
        _context: CommandContext,
    ): string[] {
        // Check if tag already exists
        if (this.tags.has(tagName)) {
            return [`fatal: tag '${tagName}' already exists`];
        }

        // Get the commit to tag
        const commits = gitRepository.getCommits();
        const commitIds = Object.keys(commits);

        let targetCommit: string;
        if (commitHash) {
            // Find the commit by hash
            const foundCommit = commitIds.find(id => id.startsWith(commitHash));
            if (!foundCommit) {
                return [`fatal: commit '${commitHash}' not found`];
            }
            targetCommit = foundCommit;
        } else {
            // Tag the latest commit
            if (commitIds.length === 0) {
                return ["fatal: No commits yet to tag"];
            }
            const lastCommitId = commitIds[commitIds.length - 1];
            if (!lastCommitId) {
                return ["fatal: No commits yet to tag"];
            }
            targetCommit = lastCommitId;
        }

        // Create the tag
        this.tags.set(tagName, targetCommit);

        const shortHash = targetCommit.substring(0, 7);
        const commitMessage = commits[targetCommit]?.message ?? "unknown";

        return [
            `Created tag '${tagName}' at ${shortHash} (${commitMessage})`,
            "",
            "Tags are useful for marking important points in history like releases:",
            "  git tag v1.0.0  - Mark current commit",
            "  git tag -l      - List all tags",
            "  git tag -d v1.0.0 - Delete a tag",
        ];
    }
}

// Need to import GitRepository type
import type { GitRepository } from "~/models/GitRepository";
