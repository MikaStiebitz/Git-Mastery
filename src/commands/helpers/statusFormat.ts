import type { CommandContext } from "../base/Command";
import type { StatusEntry } from "~/models/GitRepository";
import { displayPath, matchPathspec } from "./gitFormat";

/** `git status` options that change what is listed. */
export type StatusOptions = {
    /** -u/--untracked-files: "no" hides untracked files, "all" lists each one instead of directories. */
    untracked?: "no" | "normal" | "all";
    /** Only report these paths (`git status src/`). */
    pathspecs?: string[];
};

function statusEntriesFor(context: CommandContext, options: StatusOptions): StatusEntry[] {
    let entries = context.gitRepository.statusEntries();
    if (options.pathspecs && options.pathspecs.length > 0) {
        const all = entries.map(e => e.path);
        const keep = new Set(options.pathspecs.flatMap(spec => matchPathspec(context, spec, all)));
        entries = entries.filter(e => keep.has(e.path));
    }
    if (options.untracked === "no") entries = entries.filter(e => e.worktree !== "?");
    return entries;
}

/**
 * `git status` in its long form, shared with `git commit` (which prints the same report when there
 * is nothing to commit) and the commands that stop half-way (merge, rebase, cherry-pick).
 */

const LABELS: Record<string, string> = {
    A: "new file:   ",
    M: "modified:   ",
    D: "deleted:    ",
};

/**
 * Staged renames: a path deleted from the index and a new path with identical content. Maps the new
 * path to the old one, and the old path to null (so it is not listed separately).
 */
export function detectRenames(context: CommandContext, staged: StatusEntry[]): Map<string, string | null> {
    const repo = context.gitRepository;
    const head = repo.getHeadTree();
    const index = repo.getIndex();
    const renames = new Map<string, string | null>();
    const deleted = staged.filter(e => e.index === "D");
    for (const added of staged.filter(e => e.index === "A")) {
        const match = deleted.find(d => !renames.has(d.path) && head[d.path] === index[added.path]);
        if (match) {
            renames.set(added.path, match.path);
            renames.set(match.path, null);
        }
    }
    return renames;
}

/** Untracked files, collapsed to their topmost untracked directory the way Git lists them. */
export function untrackedDisplay(
    context: CommandContext,
    entries: StatusEntry[],
    options: { all?: boolean; fromRoot?: boolean } = {},
): string[] {
    const repo = context.gitRepository;
    const tracked = Object.keys(repo.getIndex());
    const show = (path: string) => {
        if (options.fromRoot) return path;
        const shown = displayPath(context, path);
        return shown === "" ? "." : shown;
    };
    const shown = new Set<string>();
    for (const entry of entries.filter(e => e.worktree === "?")) {
        const parts = entry.path.split("/");
        let collapsed = entry.path;
        for (let depth = 1; depth < parts.length && !options.all; depth++) {
            const dir = parts.slice(0, depth).join("/");
            if (!tracked.some(t => t.startsWith(dir + "/"))) {
                collapsed = dir + "/";
                break;
            }
        }
        // A directory is shown relative to the cwd like a file inside it would be ("./" for the cwd).
        const dirShown = (dir: string) => (options.fromRoot ? dir + "/" : show(`${dir}/_`).slice(0, -1) || "./");
        shown.add(collapsed.endsWith("/") ? dirShown(collapsed.slice(0, -1)) : show(collapsed));
    }
    return [...shown].sort();
}

/** The two-letter code `git status -s` shows for an unmerged path. */
function unmergedCode(context: CommandContext, path: string): string {
    const entry = context.gitRepository.getUnmergedEntry(path);
    if (!entry) return "UU";
    const { base, ours, theirs } = entry;
    if (ours === undefined && theirs === undefined) return "DD";
    if (base === undefined && theirs === undefined) return "AU";
    if (base === undefined && ours === undefined) return "UA";
    if (theirs === undefined) return "UD";
    if (ours === undefined) return "DU";
    if (base === undefined) return "AA";
    return "UU";
}

/** The "On branch …" header block, including upstream and in-progress operation notes. */
export function statusHeader(context: CommandContext): string[] {
    const repo = context.gitRepository;
    const lines: string[] = [];
    const branch = repo.getBranchName();
    const rebase = repo.getRebaseState();
    const bisect = repo.getBisectState();

    if (rebase) {
        const onto = repo.abbrev(rebase.onto);
        if (rebase.interactive) lines.push(`interactive rebase in progress; onto ${onto}`);
        else lines.push(`rebase in progress; onto ${onto}`);
    } else if (branch) {
        lines.push(`On branch ${branch}`);
    } else {
        const label = repo.detachedLabel();
        if (label) lines.push(`HEAD detached ${label.at ? "at" : "from"} ${label.name}`);
    }

    // Git ends every block after the first line with a blank line (wt_longstatus_print_trailer).
    if (branch && !rebase) {
        const ab = repo.aheadBehind(branch);
        if (ab && !ab.gone) {
            if (ab.ahead === 0 && ab.behind === 0) {
                lines.push(`Your branch is up to date with '${ab.upstream}'.`);
            } else if (ab.behind === 0) {
                lines.push(
                    `Your branch is ahead of '${ab.upstream}' by ${ab.ahead} commit${ab.ahead === 1 ? "" : "s"}.`,
                    '  (use "git push" to publish your local commits)',
                );
            } else if (ab.ahead === 0) {
                lines.push(
                    `Your branch is behind '${ab.upstream}' by ${ab.behind} commit${ab.behind === 1 ? "" : "s"}, and can be fast-forwarded.`,
                    '  (use "git pull" to update your local branch)',
                );
            } else {
                lines.push(
                    `Your branch and '${ab.upstream}' have diverged,`,
                    `and have ${ab.ahead} and ${ab.behind} different commits each, respectively.`,
                    '  (use "git pull" if you want to integrate the remote branch with yours)',
                );
            }
            lines.push("");
        }
    }

    const unmerged = repo.getUnmergedPaths();
    if (repo.isMerging()) {
        if (unmerged.length > 0) {
            lines.push(
                "You have unmerged paths.",
                '  (fix conflicts and run "git commit")',
                '  (use "git merge --abort" to abort the merge)',
            );
        } else {
            lines.push("All conflicts fixed but you are still merging.", '  (use "git commit" to conclude merge)');
        }
        lines.push("");
    }

    const seq = repo.getSequencer();
    if (seq?.concluded) {
        lines.push(
            `${seq.kind === "cherry-pick" ? "Cherry-pick" : "Revert"} currently in progress.`,
            `  (run "git ${seq.kind} --continue" to continue)`,
            `  (use "git ${seq.kind} --skip" to skip this patch)`,
            `  (use "git ${seq.kind} --abort" to cancel the ${seq.kind} operation)`,
            "",
        );
    } else if (seq) {
        const verb = seq.kind === "cherry-pick" ? "cherry-picking" : "reverting";
        lines.push(`You are currently ${verb} commit ${repo.abbrev(seq.current)}.`);
        if (unmerged.length > 0) lines.push(`  (fix conflicts and run "git ${seq.kind} --continue")`);
        else lines.push(`  (all conflicts fixed: run "git ${seq.kind} --continue")`);
        lines.push(
            `  (use "git ${seq.kind} --skip" to skip this patch)`,
            `  (use "git ${seq.kind} --abort" to cancel the ${seq.kind} operation)`,
            "",
        );
    }

    if (rebase) {
        const where = rebase.branch ? `branch '${rebase.branch}'` : "detached HEAD";
        if (rebase.stopped && !rebase.stopped.conflict) {
            lines.push(
                `You are currently editing a commit while rebasing ${where} on '${repo.abbrev(rebase.onto)}'.`,
                '  (use "git commit --amend" to amend the current commit)',
                '  (use "git rebase --continue" once you are satisfied with your changes)',
            );
        } else {
            lines.push(`You are currently rebasing ${where} on '${repo.abbrev(rebase.onto)}'.`);
            if (unmerged.length > 0) lines.push('  (fix conflicts and then run "git rebase --continue")');
            else lines.push('  (all conflicts fixed: run "git rebase --continue")');
            lines.push(
                '  (use "git rebase --skip" to skip this patch)',
                '  (use "git rebase --abort" to check out the original branch)',
            );
        }
        lines.push("");
    }

    if (bisect) {
        lines.push(
            `You are currently bisecting, started from branch '${bisect.startBranch ?? bisect.start}'.`,
            '  (use "git bisect reset" to get back to the original branch)',
            "",
        );
    }

    if (repo.getHeadCommitId() === null) lines.push("", "No commits yet", "");

    return lines;
}

/** The full long-format status report. */
export function longStatus(context: CommandContext, options: StatusOptions = {}): string[] {
    const repo = context.gitRepository;
    const entries = statusEntriesFor(context, options);
    const lines = statusHeader(context);
    const unborn = repo.getHeadCommitId() === null;

    const staged = entries.filter(e => e.index !== " " && e.index !== "U");
    const unmerged = entries.filter(e => e.index === "U");
    const unstaged = entries.filter(e => e.worktree === "M" || e.worktree === "D");
    const untracked = untrackedDisplay(context, entries, { all: options.untracked === "all" });

    // During a merge or cherry-pick Git gives no unstage hint (there is nothing simple to undo to).
    const sequencer = repo.getSequencer();
    const midOperation = repo.isMerging() || (sequencer?.kind === "cherry-pick" && !sequencer.concluded);
    if (staged.length > 0) {
        lines.push("Changes to be committed:");
        if (!midOperation) {
            lines.push(
                unborn
                    ? '  (use "git rm --cached <file>..." to unstage)'
                    : '  (use "git restore --staged <file>..." to unstage)',
            );
        }
        const renames = detectRenames(context, staged);
        staged.forEach(e => {
            const rename = renames.get(e.path);
            if (rename === null) return; // the deleted half of a rename
            if (rename) lines.push(`\trenamed:    ${displayPath(context, rename)} -> ${displayPath(context, e.path)}`);
            else lines.push(`\t${LABELS[e.index]}${displayPath(context, e.path)}`);
        });
        lines.push("");
    }

    if (unmerged.length > 0) {
        lines.push("Unmerged paths:");
        // Git's hints depend on what is going on: during a merge or cherry-pick there is nothing to
        // unstage; a deleted side needs "add/rm" rather than just "add".
        if (!midOperation) {
            lines.push(
                unborn
                    ? '  (use "git rm --cached <file>..." to unstage)'
                    : '  (use "git restore --staged <file>..." to unstage)',
            );
        }
        const deletedSide = unmerged.some(e => {
            const entry = repo.getUnmergedEntry(e.path);
            return entry?.ours === undefined || entry.theirs === undefined;
        });
        lines.push(
            deletedSide
                ? '  (use "git add/rm <file>..." as appropriate to mark resolution)'
                : '  (use "git add <file>..." to mark resolution)',
        );
        unmerged.forEach(e => {
            const entry = repo.getUnmergedEntry(e.path);
            const kind =
                entry?.ours === undefined
                    ? "deleted by us:   "
                    : entry.theirs === undefined
                      ? "deleted by them: "
                      : entry.base === undefined
                        ? "both added:      "
                        : "both modified:   ";
            lines.push(`\t${kind}${displayPath(context, e.path)}`);
        });
        lines.push("");
    }

    if (unstaged.length > 0) {
        lines.push(
            "Changes not staged for commit:",
            unstaged.some(e => e.worktree === "D")
                ? '  (use "git add/rm <file>..." to update what will be committed)'
                : '  (use "git add <file>..." to update what will be committed)',
            '  (use "git restore <file>..." to discard changes in working directory)',
        );
        unstaged.forEach(e => lines.push(`\t${LABELS[e.worktree]}${displayPath(context, e.path)}`));
        lines.push("");
    }

    if (untracked.length > 0) {
        lines.push("Untracked files:", '  (use "git add <file>..." to include in what will be committed)');
        untracked.forEach(path => lines.push(`\t${path}`));
        lines.push("");
    }

    const hideUntracked = options.untracked === "no";
    // Unmerged paths are not "to be committed": the summary line still says nothing is staged.
    if (staged.length > 0 && hideUntracked) {
        lines.push("Untracked files not listed (use -u option to show untracked files)");
    } else if (staged.length === 0) {
        if (unstaged.length > 0 || unmerged.length > 0) {
            lines.push('no changes added to commit (use "git add" and/or "git commit -a")');
        } else if (untracked.length > 0) {
            lines.push('nothing added to commit but untracked files present (use "git add" to track)');
        } else if (unborn) {
            lines.push('nothing to commit (create/copy files and use "git add" to track)');
        } else if (hideUntracked) {
            lines.push("nothing to commit (use -u to show untracked files)");
        } else {
            lines.push("nothing to commit, working tree clean");
        }
    }
    // With something to commit there is no summary line: the report ends with the last block's
    // blank line, exactly as Git prints it.
    return lines;
}

/** `git status --short` lines ("XY path"). */
export function shortStatus(
    context: CommandContext,
    options: { branch?: boolean; porcelain?: boolean } & StatusOptions = {},
): string[] {
    const repo = context.gitRepository;
    const lines: string[] = [];
    if (options.branch) {
        const branch = repo.getBranchName();
        if (!branch) {
            lines.push("## HEAD (no branch)");
        } else if (repo.getHeadCommitId() === null) {
            lines.push(`## No commits yet on ${branch}`);
        } else {
            const ab = repo.aheadBehind(branch);
            let line = `## ${branch}`;
            if (ab && !ab.gone) {
                line += `...${ab.upstream}`;
                const parts = [];
                if (ab.ahead > 0) parts.push(`ahead ${ab.ahead}`);
                if (ab.behind > 0) parts.push(`behind ${ab.behind}`);
                if (parts.length > 0) line += ` [${parts.join(", ")}]`;
            }
            lines.push(line);
        }
    }
    const entries = statusEntriesFor(context, options);
    const renames = detectRenames(
        context,
        entries.filter(e => e.index !== " " && e.index !== "U"),
    );
    const show = (p: string) => (options.porcelain ? p : displayPath(context, p));
    for (const e of entries.filter(e => e.worktree !== "?")) {
        const rename = renames.get(e.path);
        if (rename === null) continue;
        if (rename) {
            lines.push(`R${e.worktree} ${show(rename)} -> ${show(e.path)}`);
            continue;
        }
        const xy = e.index === "U" ? unmergedCode(context, e.path) : `${e.index}${e.worktree}`;
        lines.push(`${xy} ${show(e.path)}`);
    }
    for (const path of untrackedDisplay(context, entries, {
        all: options.untracked === "all",
        fromRoot: options.porcelain,
    })) {
        lines.push(`?? ${path}`);
    }
    return lines;
}
