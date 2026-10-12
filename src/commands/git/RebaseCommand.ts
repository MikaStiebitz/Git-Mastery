import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { hint, unknownFlagError } from "../base/GitErrors";
import { requireRepository } from "../helpers/gitFormat";

/** Marker line the terminal turns into "open this file in the editor". */
export const OPEN_EDITOR_MARKER = "__OPEN_EDITOR__:";

export class RebaseCommand implements Command {
    name = "git rebase";
    description = "Reapply commits on top of another base tip";
    usage = "git rebase [-i] [--onto <newbase>] [<upstream> [<branch>]]";
    examples = [
        "git rebase main",
        "git rebase main feature",
        "git rebase -i HEAD~3",
        "git rebase --onto main old-base feature",
        "git rebase --continue",
        "git rebase --skip",
        "git rebase --abort",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "i",
            "interactive",
            "abort",
            "continue",
            "skip",
            "quit",
            "edit-todo",
            "show-current-patch",
            "autostash",
            "no-autostash",
            "f",
            "force-rebase",
            "r",
            "rebase-merges",
            "autosquash",
            "no-autosquash",
            "q",
            "quiet",
            "v",
            "verbose",
            "root",
        ],
        value: ["onto", "s", "strategy", "X", "strategy-option", "exec", "x"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const flags = args.flags;
        const state = repo.getRebaseState();

        if (flags.abort !== undefined || flags.quit !== undefined) {
            if (!state) return ["fatal: No rebase in progress?"];
            repo.clearEditorRequest();
            repo.abortRebase();
            return [];
        }

        if (flags.continue !== undefined) {
            if (!state) return ["fatal: No rebase in progress?"];
            if (state.awaitingTodo) {
                const text = context.fileSystem.getFileContents(this.todoPath(context)) ?? repo.rebaseTodoText();
                repo.clearEditorRequest();
                const error = repo.setRebaseTodo(text);
                if (error)
                    return [
                        error,
                        "You can fix this with 'git rebase --edit-todo' and then run 'git rebase --continue'.",
                        "Or you can abort the rebase with 'git rebase --abort'.",
                    ];
                if (repo.getRebaseState()!.todo.length === 0) {
                    repo.abortRebase();
                    return ["Nothing to do"];
                }
            }
            return repo.continueRebase().lines;
        }

        if (flags.skip !== undefined) {
            if (!state) return ["fatal: No rebase in progress?"];
            return repo.skipRebaseStep().lines;
        }

        if (flags["edit-todo"] !== undefined) {
            if (!state) return ["fatal: No rebase in progress?"];
            return this.openTodoEditor(context);
        }

        if (flags["show-current-patch"] !== undefined) {
            if (!state?.stopped) return ["fatal: No rebase in progress?"];
            return [`hint: run 'git show ${repo.abbrev(state.stopped.todo.id)}' to see the patch that stopped`];
        }

        if (state) {
            return [
                "fatal: It seems that there is already a rebase-merge directory, and",
                "I wonder if you are in the middle of another rebase.  If that is the",
                "case, please try",
                "\tgit rebase (--continue | --abort | --skip)",
                "If that is not the case, please",
                '\trm -fr ".git/rebase-merge"',
                "and run me again.  I am stopping in case you still have something",
                "valuable there.",
            ];
        }

        if (repo.isMerging() || repo.hasMergeConflicts()) {
            return ["error: cannot rebase: You have unmerged files.", "error: Please commit or stash them."];
        }

        // Refuse a dirty tree, like Git (unless --autostash).
        const autostash = flags.autostash !== undefined;
        const entries = repo.statusEntries().filter(e => e.worktree !== "?");
        if (entries.length > 0 && !autostash) {
            const unstaged = entries.some(e => e.worktree !== " ");
            return [
                unstaged
                    ? "error: cannot rebase: You have unstaged changes."
                    : "error: cannot rebase: Your index contains uncommitted changes.",
                "error: Please commit or stash them.",
            ];
        }

        const positional = args.positionalArgs;
        if (positional.length > 2) return [`fatal: too many arguments`, `usage: ${this.usage}`];

        const interactive = flags.i !== undefined || flags.interactive !== undefined;
        const branchArg = positional[1];
        let upstreamArg = positional[0];

        // Switch to <branch> first if given (git rebase main feature).
        if (branchArg !== undefined) {
            if (!repo.getBranches().includes(branchArg)) {
                const id = repo.resolveCommit(branchArg);
                if (!id) return [`fatal: no such branch/commit '${branchArg}'`];
            }
        }

        if (upstreamArg === undefined && flags.root === undefined) {
            const branch = branchArg ?? repo.getBranchName();
            const upstream = branch ? repo.getUpstream(branch) : null;
            if (!upstream || !repo.resolveCommit(`${upstream.remote}/${upstream.branch}`)) {
                return [
                    "There is no tracking information for the current branch.",
                    "Please specify which branch you want to rebase against.",
                    "See git-rebase(1) for details.",
                    "",
                    "    git rebase '<branch>'",
                    "",
                    "If you wish to set tracking information for this branch you can do so with:",
                    "",
                    `    git branch --set-upstream-to=<remote>/<branch> ${branch ?? "<branch>"}`,
                    "",
                ];
            }
            upstreamArg = `${upstream.remote}/${upstream.branch}`;
        }

        const upstreamId = upstreamArg !== undefined ? repo.resolveCommit(upstreamArg) : undefined;
        if (upstreamArg !== undefined && !upstreamId) return [`fatal: invalid upstream '${upstreamArg}'`];

        const ontoArg = typeof flags.onto === "string" ? flags.onto : undefined;
        const ontoId = ontoArg !== undefined ? repo.resolveCommit(ontoArg) : upstreamId;
        if (ontoArg !== undefined && !ontoId) return [`fatal: Does not point to a valid commit '${ontoArg}'`];

        let stashed = false;
        if (entries.length > 0 && autostash) {
            repo.stashSave("autostash");
            stashed = true;
        }

        const lines: string[] = [];
        if (branchArg !== undefined && branchArg !== repo.getBranchName()) {
            const id = repo.getBranchTip(branchArg) ?? repo.resolveCommit(branchArg)!;
            const moved = repo.getBranches().includes(branchArg)
                ? repo.moveHead({ branch: branchArg })
                : repo.moveHead({ detach: id });
            if (!moved.ok) return moved.error;
        }

        const headId = repo.getHeadCommitId();
        if (!headId) return ["fatal: no commits yet to rebase"];

        const commits = repo.rebaseCommits(upstreamId ?? "", headId).filter(Boolean);
        const allCommits =
            flags.root !== undefined
                ? repo
                      .revList([headId])
                      .filter(id => repo.getCommit(id)!.parents.length <= 1)
                      .reverse()
                : commits;
        const onto = ontoId!;
        const branchName = repo.getBranchName();

        // Nothing to do: the branch already sits directly on top of onto.
        const forced = flags["force-rebase"] !== undefined || flags.f !== undefined;
        const alreadyOnTop = allCommits.length === 0 || repo.getCommit(allCommits[0]!)!.parents[0] === onto;
        if (!interactive && !forced && repo.isAncestor(onto, headId) && alreadyOnTop) {
            if (stashed && repo.applyStash(0).ok) repo.dropStash(0);
            return [`Current branch ${branchName ?? "HEAD"} is up to date.`];
        }

        repo.startRebase({ onto, ontoLabel: ontoArg ?? upstreamArg ?? onto, commits: allCommits, interactive });

        if (interactive) return [...lines, ...this.openTodoEditor(context)];

        const result = repo.runRebase();
        lines.push(...result.lines);
        if (stashed && result.status === "done") {
            const applied = repo.applyStash(0);
            if (applied.ok && applied.conflicts.length === 0) {
                repo.dropStash(0);
                lines.push("Applied autostash.");
            } else {
                lines.push(
                    "Applying autostash resulted in conflicts.",
                    "Your changes are safe in the stash.",
                    'You can run "git stash pop" or "git stash drop" at any time.',
                );
            }
        }
        return lines;
    }

    private todoPath(context: CommandContext): string {
        const root = context.gitRepository.getRepositoryRoot() ?? "/";
        return `${root === "/" ? "" : root}/.git/rebase-merge/git-rebase-todo`;
    }

    /**
     * Interactive rebase opens the todo list in the editor; saving it continues the rebase. The
     * terminal opens the file for us and runs `git rebase --continue` once it is saved.
     */
    private openTodoEditor(context: CommandContext): string[] {
        const repo = context.gitRepository;
        const path = this.todoPath(context);
        context.fileSystem.writeFile(path, repo.rebaseTodoText());
        repo.requestEditor(path, "git rebase --continue");
        return [
            hint("Waiting for your editor to close the file..."),
            hint("Change 'pick' to reword, edit, squash, fixup or drop, reorder lines, then save."),
            hint("No editor? Run 'nano .git/rebase-merge/git-rebase-todo', then 'git rebase --continue'."),
            `${OPEN_EDITOR_MARKER}${path}`,
        ];
    }
}
