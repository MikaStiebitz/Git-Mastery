import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class TagCommand implements Command {
    name = "git tag";
    description = "Create, list, delete or verify tags";
    usage = "git tag [-l] [-d <tagname>] [-a <tagname>] [-m <message>] [<tagname>] [<commit>]";
    examples = [
        "git tag",
        "git tag v1.0.0",
        "git tag -a v1.0.0 -m 'Release version 1.0.0'",
        "git tag v1.0.0 abc123",
        "git tag -l",
        "git tag -d v1.0.0",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository } = context;

        if (!gitRepository.isInitialized()) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        // List tags
        if (args.positionalArgs.length === 0 || args.flags["-l"] || args.flags["--list"]) {
            return this.listTags(gitRepository);
        }

        // Delete tag
        if (args.flags.d || args.flags["-d"] || args.flags["--delete"]) {
            const tagName = args.positionalArgs[0];
            if (!tagName) {
                return ["error: tag name required for deletion"];
            }
            return this.deleteTag(tagName, gitRepository);
        }

        // Create tag (with or without -a flag)
        const tagName = args.positionalArgs[0];
        if (!tagName) {
            return ["error: tag name required"];
        }

        const commitHash = args.positionalArgs[1];
        const message = args.flags.m as string | undefined;
        const isAnnotated = args.flags.a !== undefined;

        return this.createTag(tagName, commitHash, gitRepository, message, isAnnotated);
    }

    private listTags(gitRepository: GitRepository): string[] {
        const tags = gitRepository.getTagsList();
        if (tags.length === 0) {
            return [];
        }
        return tags;
    }

    private deleteTag(tagName: string, gitRepository: GitRepository): string[] {
        const result = gitRepository.deleteTag(tagName);
        return [result.message];
    }

    private createTag(
        tagName: string,
        commitHash: string | undefined,
        gitRepository: GitRepository,
        message?: string,
        isAnnotated?: boolean,
    ): string[] {
        const result = gitRepository.createTag(tagName, commitHash);

        if (!result.success) {
            return [result.message];
        }

        const commits = gitRepository.getCommits();
        const shortHash = result.commitHash ? result.commitHash.substring(0, 7) : "unknown";
        const commitMessage = result.commitHash && commits[result.commitHash]
            ? commits[result.commitHash]?.message ?? "unknown"
            : "unknown";

        const output: string[] = [];

        if (isAnnotated && message) {
            output.push(`Created annotated tag '${tagName}' at ${shortHash}`);
            output.push(`Message: ${message}`);
        } else {
            output.push(`Created tag '${tagName}' at ${shortHash} (${commitMessage})`);
        }

        output.push("");
        output.push("Tags are useful for marking important points in history like releases:");
        output.push("  git tag v1.0.0  - Mark current commit");
        output.push("  git tag -a v1.0.0 -m 'Release 1.0.0' - Create annotated tag");
        output.push("  git tag -l      - List all tags");
        output.push("  git tag -d v1.0.0 - Delete a tag");
        output.push("  git push origin v1.0.0 - Push a tag to remote");
        output.push("  git push --tags - Push all tags to remote");

        return output;
    }
}

// Need to import GitRepository type
import type { GitRepository } from "~/models/GitRepository";
