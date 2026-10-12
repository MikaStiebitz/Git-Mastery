import type { CommandContext } from "../base/Command";
import type { StatusEntry } from "~/models/GitRepository";
import { displayPath } from "./gitFormat";

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
export function untrackedDisplay(context: CommandContext, entries: StatusEntry[]): string[] {
    const repo = context.gitRepository;
    const tracked = Object.keys(repo.getIndex());
    const shown = new Set<string>();
    for (const entry of entries.filter(e => e.worktree === "?")) {
        const parts = entry.path.split("/");
        let collapsed = entry.path;
        for (let depth = 1; depth < parts.length; depth++) {
            const dir = parts.slice(0, depth).join("/");
            if (!tracked.some(t => t.startsWith(dir + "/"))) {
                collapsed = dir + "/";
                break;
            }
        }
        const display = collapsed.endsWith("/")
            ? displayPath(context, collapsed.slice(0, -1)) + "/"
            : displayPath(context, collapsed);
        shown.add(display);
    }
    return [...shown].sort();
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
        const id = repo.getHeadCommitId()!;
        const orig = repo.getRefLog("HEAD").find(e => e.message.startsWith("checkout:"))?.newId;
        lines.push(
            orig && orig !== id ? `HEAD detached from ${repo.abbrev(orig)}` : `HEAD detached at ${repo.abbrev(id)}`,
        );
    }

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
        }
    }

    if (repo.getHeadCommitId() === null) {
        lines.push("", "No commits yet");
    }

    const unmerged = repo.getUnmergedPaths();
    if (repo.isMerging()) {
        lines.push("");
        if (unmerged.length > 0) {
            lines.push(
                "You have unmerged paths.",
                '  (fix conflicts and run "git commit")',
                '  (use "git merge --abort" to abort the merge)',
            );
        } else {
            lines.push("All conflicts fixed but you are still merging.", '  (use "git commit" to conclude merge)');
        }
    }

    const seq = repo.getSequencer();
    if (seq) {
        const verb = seq.kind === "cherry-pick" ? "cherry-picking" : "reverting";
        lines.push("", `You are currently ${verb} commit ${repo.abbrev(seq.current)}.`);
        if (unmerged.length > 0) lines.push(`  (fix conflicts and run "git ${seq.kind} --continue")`);
        else lines.push(`  (all conflicts fixed: run "git ${seq.kind} --continue")`);
        lines.push(
            `  (use "git ${seq.kind} --skip" to skip this patch)`,
            `  (use "git ${seq.kind} --abort" to cancel the ${seq.kind} operation)`,
        );
    }

    if (rebase) {
        const where = rebase.branch ? `branch '${rebase.branch}'` : "detached HEAD";
        lines.push("");
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
    }

    if (bisect) {
        lines.push(
            "",
            `You are currently bisecting, started from branch '${bisect.startBranch ?? bisect.start}'.`,
            '  (use "git bisect reset" to get back to the original branch)',
        );
    }

    return lines;
}

/** The full long-format status report. */
export function longStatus(context: CommandContext): string[] {
    const repo = context.gitRepository;
    const entries = repo.statusEntries();
    const lines = statusHeader(context);
    // A bare "On branch x" is followed directly by the first section; any extra header lines
    // (upstream, operation in progress) are separated from it by a blank line.
    const compactHeader = lines.length === 1;
    const unborn = repo.getHeadCommitId() === null;

    const staged = entries.filter(e => e.index !== " " && e.index !== "U");
    const unmerged = entries.filter(e => e.index === "U");
    const unstaged = entries.filter(e => e.worktree === "M" || e.worktree === "D");
    const untracked = untrackedDisplay(context, entries);

    if (staged.length > 0) {
        lines.push(
            "",
            "Changes to be committed:",
            unborn
                ? '  (use "git rm --cached <file>..." to unstage)'
                : '  (use "git restore --staged <file>..." to unstage)',
        );
        const renames = detectRenames(context, staged);
        staged.forEach(e => {
            const rename = renames.get(e.path);
            if (rename === null) return; // the deleted half of a rename
            if (rename) lines.push(`\trenamed:    ${displayPath(context, rename)} -> ${displayPath(context, e.path)}`);
            else lines.push(`\t${LABELS[e.index]}${displayPath(context, e.path)}`);
        });
    }

    if (unmerged.length > 0) {
        lines.push("", "Unmerged paths:", '  (use "git add <file>..." to mark resolution)');
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
    }

    if (unstaged.length > 0) {
        lines.push(
            "",
            "Changes not staged for commit:",
            '  (use "git add <file>..." to update what will be committed)',
            '  (use "git restore <file>..." to discard changes in working directory)',
        );
        unstaged.forEach(e => lines.push(`\t${LABELS[e.worktree]}${displayPath(context, e.path)}`));
    }

    if (untracked.length > 0) {
        lines.push("", "Untracked files:", '  (use "git add <file>..." to include in what will be committed)');
        untracked.forEach(path => lines.push(`\t${path}`));
    }

    lines.push("");
    if (staged.length === 0 && unmerged.length === 0) {
        if (unstaged.length > 0) {
            lines.push('no changes added to commit (use "git add" and/or "git commit -a")');
        } else if (untracked.length > 0) {
            lines.push('nothing added to commit but untracked files present (use "git add" to track)');
        } else if (unborn) {
            lines.push('nothing to commit (create/copy files and use "git add" to track)');
        } else {
            lines.push("nothing to commit, working tree clean");
        }
    } else {
        lines.pop(); // there is something to commit; Git ends the report after the last section
    }

    if (compactHeader && lines[1] === "") lines.splice(1, 1);
    return lines;
}

/** `git status --short` lines ("XY path"). */
export function shortStatus(
    context: CommandContext,
    options: { branch?: boolean; porcelain?: boolean } = {},
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
    const entries = repo.statusEntries();
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
        const xy = e.index === "U" ? "UU" : `${e.index}${e.worktree}`;
        lines.push(`${xy} ${show(e.path)}`);
    }
    for (const path of options.porcelain
        ? entries.filter(e => e.worktree === "?").map(e => e.path)
        : untrackedDisplay(context, entries)) {
        lines.push(`?? ${path}`);
    }
    return lines;
}
