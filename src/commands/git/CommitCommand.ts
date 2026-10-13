import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { hint, unknownFlagError } from "../base/GitErrors";
import { commitSummary, matchPathspec, requireRepository, revisionError } from "../helpers/gitFormat";
import { longStatus } from "../helpers/statusFormat";
import { resolvePath } from "~/lib/utils";

export class CommitCommand implements Command {
    name = "git commit";
    description = "Record changes to the repository";
    usage =
        "git commit [-a | --interactive | --patch] [-s] [-v] [-u<mode>] [--amend] [--dry-run] [(-c | -C | --squash) <commit> | --fixup [(amend|reword):]<commit>] [-F <file> | -m <msg>] [--reset-author] [--allow-empty] [--allow-empty-message] [--no-verify] [-e] [--author=<author>] [--date=<date>] [--cleanup=<mode>] [--[no-]status] [-i | -o] [--pathspec-from-file=<file> [--pathspec-file-nul]] [(--trailer <token>[(=|:)<value>])...] [-S[<keyid>]] [--] [<pathspec>...]";
    examples = [
        'git commit -m "Initial commit"',
        'git commit -am "Fix typo"',
        "git commit",
        'git commit --amend -m "Better message"',
        "git commit --amend --no-edit",
        'git commit --allow-empty -m "Trigger CI"',
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "a",
            "all",
            "amend",
            "no-edit",
            "e",
            "edit",
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
            "dry-run",
            "reset-author",
            "o",
            "only",
            "i",
            "include",
        ],
        value: [
            "m",
            "message",
            "author",
            "date",
            "F",
            "file",
            "C",
            "reuse-message",
            "c",
            "reedit-message",
            "fixup",
            "squash",
        ],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined)
            return unknownFlagError(unknownFlag, "git commit [<options>] [--] <pathspec>...");

        // `-m` as the very last word has no message to take.
        const last = args.args[args.args.length - 1];
        if (last !== undefined && /^-[a-zA-Z]*m$/.test(last) && !last.startsWith("--")) {
            return ["error: switch `m' requires a value"];
        }
        if (last === "--message") return ["error: option `message' requires a value"];

        // -m may be given several times; each becomes its own paragraph. The parser keeps the last
        // value only, so collect them from the raw arguments.
        const messages = this.collectMessages(args);
        let message = messages.join("\n\n").trim();
        const messageFlagProvided =
            messages.length > 0 || args.flags.m !== undefined || args.flags.message !== undefined;

        // -F <file>: the message comes from a file.
        const fileFlag =
            typeof args.flags.F === "string"
                ? args.flags.F
                : typeof args.flags.file === "string"
                  ? args.flags.file
                  : undefined;
        if (fileFlag !== undefined) {
            const content = context.fileSystem.getFileContents(resolvePath(fileFlag, context.currentDirectory));
            if (content === null) return [`fatal: could not read log file '${fileFlag}': No such file or directory`];
            message = content.trim();
        }

        // -C/-c <commit>: reuse another commit's message.
        const reuse = [args.flags.C, args.flags["reuse-message"], args.flags.c, args.flags["reedit-message"]].find(
            v => typeof v === "string",
        ) as string | undefined;
        if (reuse !== undefined) {
            const id = repo.resolveCommit(reuse);
            if (!id) return [`fatal: could not lookup commit '${reuse}'`];
            message = repo.getCommit(id)!.message;
        }

        const author = this.parseAuthor(args);
        if (author === "invalid") {
            const value = String(args.flags.author);
            return [`fatal: --author '${value}' is not 'Name <email>' and matches no existing author`];
        }

        const quiet = args.flags.q !== undefined || args.flags.quiet !== undefined;
        const signoff = args.flags.s !== undefined || args.flags.signoff !== undefined;
        const allowEmpty = args.flags["allow-empty"] !== undefined;
        const allowEmptyMessage = args.flags["allow-empty-message"] !== undefined;
        const isAmend = args.flags.amend !== undefined;
        const noEdit = args.flags["no-edit"] !== undefined;

        // A conflict must be resolved (and marked with `git add`) before anything can be committed.
        if (repo.hasMergeConflicts() && args.flags.a === undefined && args.flags.all === undefined) {
            return [
                "error: Committing is not possible because you have unmerged files.",
                "hint: Fix them up in the work tree, and then use 'git add/rm <file>'",
                "hint: as appropriate to mark resolution and make a commit.",
                "fatal: Exiting because of an unresolved conflict.",
            ];
        }

        // `git commit -a` and `git commit <paths>` stage into a temporary index: if no commit comes of
        // it, the real index is left exactly as it was.
        const indexBefore = repo.snapshotIndex();
        const abandon = (lines: string[]) => {
            repo.restoreIndex(indexBefore);
            return lines;
        };

        let onlyPaths: string[] | null = null;
        // After a commit of only some paths, the real index gets just those paths updated.
        const keepOnly = (lines: string[]) => {
            if (onlyPaths) {
                repo.restoreIndex(indexBefore);
                onlyPaths.forEach(p => repo.stagePath(p));
            }
            return lines;
        };

        // `git commit "my message"` — the single most common beginner mistake. Git reads a bare
        // argument as a path to commit, not as the message.
        if (args.positionalArgs.length > 0) {
            const candidates = new Set([...Object.keys(repo.getIndex()), ...Object.keys(repo.getHeadTree())]);
            const paths = new Set<string>();
            for (const spec of args.positionalArgs) {
                const matched = matchPathspec(context, spec, candidates);
                if (matched.length === 0) {
                    const lines = [`error: pathspec '${spec}' did not match any file(s) known to git`];
                    if (!messageFlagProvided) {
                        lines.push(
                            hint(`A bare word after 'git commit' means "commit this file", not the message.`),
                            hint(`To set the message, use -m: git commit -m "${spec}"`),
                        );
                    }
                    return lines;
                }
                matched.forEach(p => paths.add(p));
            }
            const include = args.flags.i !== undefined || args.flags.include !== undefined;
            if (repo.isMerging() && !include) return ["fatal: cannot do a partial commit during a merge."];
            if (include) {
                // --include: stage those files on top of what is staged already.
                paths.forEach(p => repo.stagePath(p));
            } else {
                // `git commit <paths>` (--only) commits exactly those files as they are in the working
                // tree on top of HEAD; whatever else is staged stays staged for a later commit.
                onlyPaths = [...paths];
                repo.restoreIndex({ index: repo.getHeadTree(), unmerged: {} });
                onlyPaths.forEach(p => repo.stagePath(p));
            }
        }

        // -a/--all stages every already-tracked file that changed, then commits. It deliberately does
        // not pick up untracked files, which is why `git commit -am` on a brand-new file still fails.
        if (args.flags.a !== undefined || args.flags.all !== undefined) {
            for (const entry of repo.statusEntries()) {
                if (entry.worktree === "M" || entry.worktree === "D" || entry.index === "U") repo.stagePath(entry.path);
            }
        }

        if (args.flags["dry-run"] !== undefined) {
            return abandon(longStatus(context));
        }

        if (signoff && message) {
            message += `\n\nSigned-off-by: ${repo.getUser().name} <${repo.getUser().email}>`;
        }

        if (isAmend) {
            const headBefore = repo.getHeadCommitId();
            const amended = this.handleAmend(
                context,
                message,
                noEdit || !messageFlagProvided,
                author,
                quiet,
                allowEmpty,
            );
            return repo.getHeadCommitId() === headBefore ? abandon(amended) : keepOnly(amended);
        }

        // Nothing staged: Git shows the status instead of committing.
        if (!allowEmpty && !repo.isMerging() && repo.indexMatchesHead()) {
            return abandon(this.nothingToCommit(context));
        }

        // A -m/--message flag with an empty or whitespace-only value must not create a commit
        if (messageFlagProvided && !message && !allowEmptyMessage) {
            return abandon(["Aborting commit due to empty commit message."]);
        }

        if (!message && !messageFlagProvided && fileFlag === undefined && reuse === undefined) {
            // No message given: the UI opens the commit-message editor, as real Git opens $EDITOR, and
            // commits the index afterwards — so the named paths have to be in the real index.
            keepOnly([]);
            return [];
        }

        const commitId = repo.commit(message, true, { author: author ?? undefined });
        if (!commitId) return abandon(this.nothingToCommit(context));

        return keepOnly(quiet ? [] : commitSummary(repo, commitId));
    }

    /** Every -m/--message value in order (Git joins them as paragraphs). */
    private collectMessages(args: CommandArgs): string[] {
        const messages: string[] = [];
        const raw = args.args;
        for (let i = 0; i < raw.length; i++) {
            const token = raw[i]!;
            if (token === "--") break;
            if (token === "-m" || token === "--message") {
                const value = raw[i + 1];
                if (value !== undefined) messages.push(value);
                i++;
            } else if (token.startsWith("--message=")) {
                messages.push(token.substring("--message=".length));
            } else if (/^-[a-zA-Z]*m/.test(token) && !token.startsWith("--")) {
                // Clustered: -am "msg" or attached: -m"msg" / -amfix
                const after = token.substring(token.indexOf("m") + 1);
                if (after.length > 0) {
                    messages.push(after);
                } else {
                    const value = raw[i + 1];
                    if (value !== undefined) messages.push(value);
                    i++;
                }
            }
        }
        if (messages.length === 0) {
            const single =
                typeof args.flags.m === "string"
                    ? args.flags.m
                    : typeof args.flags.message === "string"
                      ? args.flags.message
                      : undefined;
            if (single !== undefined) messages.push(single);
        }
        return messages.map(m => m.trim());
    }

    private parseAuthor(args: CommandArgs): { name: string; email: string } | null | "invalid" {
        const value = args.flags.author;
        if (typeof value !== "string") return null;
        const match = /^(.*?)\s*<([^>]*)>$/.exec(value.trim());
        if (!match) return "invalid";
        return { name: match[1]!, email: match[2]! };
    }

    /**
     * What Git prints when nothing is staged — the answer to "why can't I just commit?".
     *
     * Git commits the staging area, not the working directory, so a file you edited but never added
     * is invisible to `git commit`. Real Git shows the status report; the hint names the rule behind
     * it, since the wording alone assumes you already know that staging exists.
     */
    private nothingToCommit(context: CommandContext): string[] {
        // The commit template says "Initial commit" where `git status` says "No commits yet".
        const lines = longStatus(context).map(line => (line === "No commits yet" ? "Initial commit" : line));
        const hasChanges = context.gitRepository.statusEntries().length > 0;
        if (hasChanges) {
            lines.push(hint("A commit records the staging area, not your folder."));
            lines.push(hint("Editing a file changes your folder; 'git add <file>' puts that change into the"));
            lines.push(hint("staging area; 'git commit' then saves everything staged as one snapshot."));
        }
        return lines;
    }

    private handleAmend(
        context: CommandContext,
        message: string,
        keepMessage: boolean,
        author: { name: string; email: string } | null,
        quiet: boolean,
        allowEmpty: boolean,
    ): string[] {
        const repo = context.gitRepository;
        const last = repo.getLastCommit();
        if (!last) return ["fatal: You have nothing to amend."];
        if (repo.isMerging()) return ["fatal: You are in the middle of a merge -- cannot amend."];

        // Amending a commit into one that changes nothing needs --allow-empty, as in Git.
        const sameTree = (a: Record<string, string>, b: Record<string, string>) =>
            JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());
        const parentTree = last.parents[0] ? repo.treeOf(last.parents[0]) : {};
        if (!allowEmpty && last.parents.length < 2 && sameTree(repo.getIndex(), parentTree)) {
            // Git's status for an amend: "No changes" takes the place of the summary line.
            const status = longStatus(context);
            if (/^(nothing to commit|nothing added to commit|no changes added to commit)/.test(status.at(-1) ?? "")) {
                status.pop();
            }
            if (status.at(-1) !== "") status.push("");
            if (!last.parents[0]) status.splice(1, 0, "", "Initial commit");
            return [
                ...status,
                "No changes",
                "You asked to amend the most recent commit, but doing so would make",
                "it empty. You can repeat your command with --allow-empty, or you can",
                'remove the commit entirely with "git reset HEAD^".',
            ];
        }

        const id = repo.amendLastCommit(keepMessage && !message ? undefined : message, { author: author ?? undefined });
        if (!id) return revisionError(repo, "HEAD", "commit");
        return quiet ? [] : commitSummary(repo, id, { amend: true });
    }
}
