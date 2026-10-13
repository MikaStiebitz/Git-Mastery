import type { CommandContext } from "../base/Command";
import type { GitRepository } from "~/models/GitRepository";
import { hint } from "../base/GitErrors";
import { headIsNowAt } from "./gitFormat";

/**
 * The parts of `git switch` and `git checkout` that move HEAD: the messages around detached HEAD,
 * carried-over local changes, upstream status and commits left behind are all shared by both.
 */

/** "Your branch is up to date with 'origin/main'." style line(s) after switching, if tracked. */
export function trackingSummary(repo: GitRepository, branch: string): string[] {
    const ab = repo.aheadBehind(branch);
    if (!ab || ab.gone) return [];
    if (ab.ahead === 0 && ab.behind === 0) return [`Your branch is up to date with '${ab.upstream}'.`];
    if (ab.behind === 0) {
        return [
            `Your branch is ahead of '${ab.upstream}' by ${ab.ahead} commit${ab.ahead === 1 ? "" : "s"}.`,
            '  (use "git push" to publish your local commits)',
        ];
    }
    if (ab.ahead === 0) {
        return [
            `Your branch is behind '${ab.upstream}' by ${ab.behind} commit${ab.behind === 1 ? "" : "s"}, and can be fast-forwarded.`,
            '  (use "git pull" to update your local branch)',
        ];
    }
    return [
        `Your branch and '${ab.upstream}' have diverged,`,
        `and have ${ab.ahead} and ${ab.behind} different commits each, respectively.`,
        '  (use "git pull" if you want to integrate the remote branch with yours)',
    ];
}

/** Local changes that came along with the switch, as Git lists them ("M\tfile"). */
function carriedChanges(repo: GitRepository): string[] {
    return repo
        .statusEntries()
        .filter(e => e.worktree !== "?")
        .map(e => `${e.worktree !== " " ? e.worktree : e.index}\t${e.path}`);
}

/** Before leaving a detached HEAD: warn about commits that no branch will reach any more. */
function leavingDetached(repo: GitRepository, targetId: string | null): string[] {
    const headId = repo.getHeadCommitId();
    if (repo.getBranchName() !== null || !headId || headId === targetId) return [];

    const reachable = [
        ...Object.values(repo.getBranchHeads()),
        ...Object.values(repo.getRemoteTrackingRefs()),
        ...[...repo.getTags().values()],
    ];
    const orphans = repo.revList([headId], reachable);
    const subject = (id: string) => repo.getCommit(id)!.message.split("\n")[0];

    if (orphans.length === 0) {
        return [`Previous HEAD position was ${repo.abbrev(headId)} ${subject(headId)}`];
    }
    const n = orphans.length;
    return [
        `Warning: you are leaving ${n} commit${n === 1 ? "" : "s"} behind, not connected to`,
        "any of your branches:",
        "",
        ...orphans.slice(0, 4).map(id => `  ${repo.abbrev(id)} ${subject(id)}`),
        ...(n > 4 ? [` ... and ${n - 4} more.`] : []),
        "",
        "If you want to keep it by creating a new branch, this may be a good time",
        "to do so with:",
        "",
        ` git branch <new-branch-name> ${repo.abbrev(headId)}`,
        "",
    ];
}

/** Error lines if an operation in progress (unresolved conflicts) blocks switching, else null. */
export function blockedByConflicts(repo: GitRepository): string[] | null {
    const unmerged = repo.getUnmergedPaths();
    if (unmerged.length === 0) return null;
    return [...unmerged.map(p => `${p}: needs merge`), "error: you need to resolve your current index first"];
}

/** Switch to an existing local branch. */
export function switchToBranch(context: CommandContext, branch: string, options: { force?: boolean } = {}): string[] {
    const repo = context.gitRepository;
    if (repo.getBranchName() === branch) {
        repo.noteCheckoutOfCurrentBranch();
        repo.endOperationsOnSwitch();
        return [`Already on '${branch}'`, ...trackingSummary(repo, branch)];
    }
    const blocked = !options.force ? blockedByConflicts(repo) : null;
    if (blocked) return blocked;

    const before = leavingDetached(repo, repo.getBranchTip(branch));
    const result = repo.moveHead({ branch }, { force: options.force });
    if (!result.ok) return result.error;
    repo.endOperationsOnSwitch();

    return [...before, ...carriedChanges(repo), `Switched to branch '${branch}'`, ...trackingSummary(repo, branch)];
}

/** Create a branch at `startId` (or HEAD) and switch to it. */
export function createAndSwitch(
    context: CommandContext,
    name: string,
    startId: string | null,
    options: { reset?: boolean; trackFrom?: string; force?: boolean } = {},
): string[] {
    const repo = context.gitRepository;
    const headId = repo.getHeadCommitId();

    if (headId === null && startId === null) {
        // Unborn HEAD: there is nothing to point the branch at yet, so HEAD just changes name.
        repo.setUnbornBranch(name);
        return [`Switched to a new branch '${name}'`];
    }

    const blocked = !options.force ? blockedByConflicts(repo) : null;
    if (blocked) return blocked;

    const target = startId ?? headId!;
    const before = leavingDetached(repo, target);
    const existed = repo.getBornBranches().includes(name);
    const previousTip = repo.getBranchTip(name);

    // Check the move would succeed before creating the branch, so a refused switch leaves nothing behind.
    if (target !== headId && !options.force) {
        repo.createBranch(name, target, true);
        const result = repo.moveHead({ branch: name });
        if (!result.ok) {
            if (existed && previousTip) repo.createBranch(name, previousTip, true);
            else repo.deleteBranch(name);
            return result.error;
        }
    } else {
        repo.createBranch(name, target, true);
        const result = repo.moveHead({ branch: name }, { force: options.force });
        if (!result.ok) return result.error;
    }

    repo.endOperationsOnSwitch();
    const lines = [...before];
    if (options.trackFrom) {
        const [remote, ...rest] = options.trackFrom.split("/");
        repo.setUpstream(name, remote!, rest.join("/"));
        lines.push(`branch '${name}' set up to track '${options.trackFrom}'.`);
    }
    lines.push(...carriedChanges(repo));
    lines.push(
        existed && options.reset ? `Switched to and reset branch '${name}'` : `Switched to a new branch '${name}'`,
    );
    if (options.trackFrom) lines.push(...trackingSummary(repo, name));
    return lines;
}

/** Detach HEAD at a commit, with Git's long explanation of what that means. */
export function detachAt(
    context: CommandContext,
    id: string,
    spec: string,
    options: { force?: boolean; advice?: boolean } = {},
): string[] {
    const repo = context.gitRepository;
    const blocked = !options.force ? blockedByConflicts(repo) : null;
    if (blocked) return blocked;

    const wasDetached = repo.getBranchName() === null;
    const before = leavingDetached(repo, id);
    const result = repo.moveHead({ detach: id }, { force: options.force, reflogTo: spec });
    if (!result.ok) return result.error;
    repo.endOperationsOnSwitch();

    const lines = [...before];
    if (options.advice !== false && !wasDetached) {
        lines.push(
            `Note: switching to '${spec}'.`,
            "",
            "You are in 'detached HEAD' state. You can look around, make experimental",
            "changes and commit them, and you can discard any commits you make in this",
            "state without impacting any branches by switching back to a branch.",
            "",
            "If you want to create a new branch to retain commits you create, you may",
            "do so (now or later) by using -c with the switch command. Example:",
            "",
            "  git switch -c <new-branch-name>",
            "",
            "Or undo this operation with:",
            "",
            "  git switch -",
            "",
            "Turn off this advice by setting config variable advice.detachedHead to false",
            "",
        );
    }
    lines.push(...carriedChanges(repo), headIsNowAt(repo));
    return lines;
}

/** Suggestions for a name that is neither a branch nor a commit. */
export function unknownBranchHints(repo: GitRepository, name: string, createFlag: "-c" | "-b"): string[] {
    const branches = repo.getBornBranches();
    const caseMatch = branches.find(b => b.toLowerCase() === name.toLowerCase() && b !== name);
    if (caseMatch) return [hint(`Branch names are case-sensitive. Did you mean '${caseMatch}'?`)];
    // Substring matches only count for names long enough to mean something ("x" is in everything).
    const lower = name.toLowerCase();
    const similar = branches.filter(b => {
        const other = b.toLowerCase();
        return (lower.length >= 3 && other.includes(lower)) || (other.length >= 3 && lower.includes(other));
    });
    if (similar.length > 0) return [hint(`Did you mean ${similar.map(b => `'${b}'`).join(" or ")}?`)];
    const verb = createFlag === "-c" ? "switch" : "checkout";
    return [hint(`To create a new branch with that name, use: git ${verb} ${createFlag} ${name}`)];
}

/**
 * The remote-tracking branch `git switch <name>`/`git checkout <name>` would guess for a name that
 * is not a local branch (`--guess`, on by default): exactly one remote with that branch.
 */
export function guessRemoteBranch(repo: GitRepository, name: string): string | null {
    const matches = Object.keys(repo.getRemoteTrackingRefs()).filter(ref => ref.split("/").slice(1).join("/") === name);
    return matches.length === 1 ? matches[0]! : null;
}
