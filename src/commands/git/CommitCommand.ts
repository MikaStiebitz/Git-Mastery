import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import type { GitRepository } from "~/models/GitRepository";
import { hint, notARepository, unknownFlagError } from "../base/GitErrors";

export class CommitCommand implements Command {
    name = "git commit";
    description = "Record changes to the repository";
    usage = "git commit -m <message>";
    examples = [
        'git commit -m "Initial commit"',
        'git commit -m "Fix bug in login form"',
        "git commit",
        "git commit --amend -m 'Updated commit message'",
        "git commit --amend",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "a",
            "all",
            "amend",
            "no-edit",
            "allow-empty",
            "allow-empty-message",
            "v",
            "verbose",
            "q",
            "quiet",
            "s",
            "signoff",
            "n",
            "no-verify",
            "no-post-rewrite",
        ],
        value: ["m", "message", "author", "date", "F", "file", "C", "reuse-message", "c", "reedit-message"],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, currentDirectory } = context;

        if (!gitRepository.isInitialized()) {
            return notARepository();
        }
        if (!gitRepository.isInRepository(currentDirectory)) {
            return notARepository();
        }

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) {
            return unknownFlagError(unknownFlag, this.usage);
        }

        // Check for --amend flag
        const isAmend = args.flags.amend !== undefined;

        if (isAmend) {
            return this.handleAmend(args, gitRepository);
        }

        // Get the message
        const message =
            typeof args.flags.m === "string"
                ? args.flags.m.trim()
                : typeof args.flags.message === "string"
                  ? args.flags.message.trim()
                  : "";

        const messageFlagProvided = args.flags.m !== undefined || args.flags.message !== undefined;

        // `git commit "my message"` — the single most common beginner mistake. Git reads a bare
        // argument as a path to commit, not as the message, so it fails on a pathspec that does not
        // exist. Reproduce that error, then say what was actually meant.
        if (!messageFlagProvided && args.positionalArgs.length > 0) {
            const pathspec = args.positionalArgs[0]!;
            const allFiles = Object.keys(gitRepository.getStatus());

            if (!allFiles.includes(pathspec) && !allFiles.includes(pathspec.replace(/^\//, ""))) {
                return [
                    `fatal: pathspec '${pathspec}' did not match any files`,
                    hint(`A bare word after 'git commit' means "commit this file", not the message.`),
                    hint(`To set the message, use -m: git commit -m "${pathspec}"`),
                ];
            }
        }

        // -a/--all stages every already-tracked file that changed, then commits. It deliberately does
        // not pick up untracked files, which is why `git commit -am` on a brand-new file still fails.
        if (args.flags.a !== undefined || args.flags.all !== undefined) {
            const trackedChanges = Object.entries(gitRepository.getStatus())
                .filter(([, state]) => state === "modified" || state === "deleted")
                .map(([file]) => file);

            if (trackedChanges.length > 0) {
                gitRepository.addAll(trackedChanges);
            }
        }

        // Check if there's anything to commit
        const stagedFiles = Object.entries(gitRepository.getStatus())
            .filter(([_, status]) => status === "staged")
            .map(([file]) => file);

        if (stagedFiles.length === 0) {
            return this.nothingToCommit(gitRepository);
        }

        // A -m/--message flag with an empty or whitespace-only value must not create a commit
        if (messageFlagProvided && !message) {
            return ["Aborting commit due to empty commit message."];
        }

        if (message) {
            // If message is provided, commit directly
            const commitId = gitRepository.commit(message);

            if (!commitId) {
                return this.nothingToCommit(gitRepository);
            }

            // Generate accurate file statistics
            const fileCount = stagedFiles.length;
            const fileWord = fileCount === 1 ? "file" : "files";
            const insertions = fileCount; // Simplified: each file = 1 insertion
            const insertionWord = insertions === 1 ? "insertion" : "insertions";

            return [
                `[${gitRepository.getCurrentBranch()} ${commitId.substring(0, 7)}] ${message}`,
                ` ${fileCount} ${fileWord} changed, ${insertions} ${insertionWord}(+)`,
            ];
        }

        // If no message is provided, let the dialog be opened by returning without a message
        // The dialog should only open if we get here (meaning there are staged changes)
        return [];
    }

    /**
     * What Git prints when nothing is staged — the answer to "why can't I just commit?".
     *
     * Git commits the staging area, not the working directory, so a file you edited but never added
     * is invisible to `git commit`. Real Git shows the unstaged changes and the commands that would
     * fix it; the hint names the rule behind it, since the wording alone assumes you already know
     * that staging exists.
     */
    private nothingToCommit(gitRepository: GitRepository): string[] {
        const status = gitRepository.getStatus();
        const branch = gitRepository.getCurrentBranch();

        const modified = Object.entries(status)
            .filter(([, state]) => state === "modified" || state === "deleted")
            .map(([file, state]) => ({ file, state }));
        const untracked = Object.entries(status)
            .filter(([, state]) => state === "untracked")
            .map(([file]) => file);

        const lines = [`On branch ${branch}`];

        if (modified.length > 0) {
            lines.push("Changes not staged for commit:");
            lines.push('  (use "git add <file>..." to update what will be committed)');
            lines.push('  (use "git restore <file>..." to discard changes in working directory)');
            modified.forEach(({ file, state }) => {
                const label = state === "deleted" ? "deleted:" : "modified:";
                lines.push(`\t${label}   ${file}`);
            });
            lines.push("");
        }

        if (untracked.length > 0) {
            lines.push("Untracked files:");
            lines.push('  (use "git add <file>..." to include in what will be committed)');
            untracked.forEach(file => lines.push(`\t${file}`));
            lines.push("");
        }

        if (modified.length === 0 && untracked.length === 0) {
            lines.push("nothing to commit, working tree clean");
            return lines;
        }

        if (modified.length > 0) {
            lines.push('no changes added to commit (use "git add" and/or "git commit -a")');
        } else {
            lines.push('nothing added to commit but untracked files present (use "git add" to track)');
        }

        lines.push(hint("A commit records the staging area, not your folder."));
        lines.push(hint("Editing a file changes your folder; 'git add <file>' puts that change into the"));
        lines.push(hint("staging area; 'git commit' then saves everything staged as one snapshot."));

        return lines;
    }

    private handleAmend(args: CommandArgs, gitRepository: GitRepository): string[] {
        // Get the last commit
        const lastCommit = gitRepository.getLastCommit();

        if (!lastCommit) {
            return ["fatal: No commits yet to amend."];
        }

        // Get the new message if provided
        const newMessage =
            typeof args.flags.m === "string"
                ? args.flags.m.trim()
                : typeof args.flags.message === "string"
                  ? args.flags.message.trim()
                  : "";

        // Amend the last commit
        const result = gitRepository.amendLastCommit(newMessage);

        if (!result) {
            return ["fatal: Could not amend commit."];
        }

        const finalMessage = newMessage || lastCommit.message;
        const commitId = result.substring(0, 7);
        const branch = gitRepository.getCurrentBranch();

        return [
            `[${branch} ${commitId}] ${finalMessage}`,
            " Date: " + new Date().toISOString(),
            " 1 file changed, 1 insertion(+)",
        ];
    }
}
