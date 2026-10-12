import type { CommandArgs, CommandContext } from "../base/Command";
import { commitSummary, requireRepository, revisionError } from "./gitFormat";
import { hint, unknownFlagError } from "../base/GitErrors";

/**
 * `git cherry-pick` and `git revert` share Git's sequencer: apply a list of commits one by one,
 * stop on a conflict, and resume with --continue / --skip / --abort / --quit.
 */
export function runSequencerCommand(
    mode: "cherry-pick" | "revert",
    args: CommandArgs,
    context: CommandContext,
    usage: string,
): string[] {
    const notRepo = requireRepository(context);
    if (notRepo) return notRepo;
    const repo = context.gitRepository;

    const unknownFlag = args.unknownFlags?.[0];
    if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, usage);

    const flags = args.flags;
    const state = repo.getSequencer();
    const other = mode === "cherry-pick" ? "revert" : "cherry-pick";

    if (flags.abort !== undefined) {
        if (!state || state.kind !== mode) return [`error: no ${mode} in progress`, `fatal: ${mode} failed`];
        repo.abortSequencer();
        return [];
    }
    if (flags.quit !== undefined) {
        if (!state) return [`error: no ${mode} in progress`, `fatal: ${mode} failed`];
        repo.clearSequencer();
        return [];
    }
    if (flags.skip !== undefined) {
        if (!state || state.kind !== mode) return [`error: no ${mode} in progress`, `fatal: ${mode} failed`];
        const remaining = state.remaining;
        repo.abortSequencer();
        const head = repo.getHeadCommitId();
        if (head) repo.resetTo(head, "hard", "HEAD");
        return applyAll(mode, remaining, args, context);
    }
    if (flags.continue !== undefined) {
        if (!state || state.kind !== mode) return [`error: no ${mode} in progress`, `fatal: ${mode} failed`];
        if (repo.indexMatchesHead() && !repo.hasMergeConflicts()) {
            // Resolved to nothing.
            return emptyAdvice(mode, context);
        }
        const result = repo.continueSequencer();
        if (!result.ok) return result.error;
        const lines = commitSummary(repo, result.id);
        const remaining = state.remaining;
        repo.clearSequencer();
        return [...lines, ...applyAll(mode, remaining, args, context)];
    }

    if (state) {
        return [
            `error: ${state.kind === mode ? `${mode} is already in progress` : `${other} is already in progress`}`,
            `hint: try "git ${state.kind} (--continue | --abort | --quit)"`,
            `fatal: ${mode} failed`,
        ];
    }
    if (repo.hasMergeConflicts() || repo.isMerging()) {
        return [
            `error: ${mode === "cherry-pick" ? "Cherry-picking" : "Reverting"} is not possible because you have unmerged files.`,
            "hint: Fix them up in the work tree, and then use 'git add/rm <file>'",
            "hint: as appropriate to mark resolution and make a commit.",
            "fatal: Exiting because of an unresolved conflict.",
        ];
    }

    if (args.positionalArgs.length === 0) {
        return [`usage: ${usage}`];
    }
    if (repo.getHeadCommitId() === null) {
        return [`error: your local changes would be overwritten by ${mode}.`, `fatal: ${mode} failed`];
    }

    // Expand ranges (A..B) into the commits they contain, oldest first.
    const ids: string[] = [];
    for (const arg of args.positionalArgs) {
        const range = /^(.*)\.\.(.*)$/.exec(arg);
        if (range) {
            const a = repo.resolveCommit(range[1] || "HEAD");
            const b = repo.resolveCommit(range[2] || "HEAD");
            if (!a) return revisionError(repo, range[1] || "HEAD", mode);
            if (!b) return revisionError(repo, range[2] || "HEAD", mode);
            const list = repo.revList([b], [a]).reverse();
            ids.push(...(mode === "revert" ? list.reverse() : list));
        } else {
            const id = repo.resolveCommit(arg);
            if (!id) return [`fatal: bad revision '${arg}'`];
            ids.push(id);
        }
    }
    if (ids.length === 0) return ["error: empty commit set passed", `fatal: ${mode} failed`];

    return applyAll(mode, ids, args, context);
}

function applyAll(mode: "cherry-pick" | "revert", ids: string[], args: CommandArgs, context: CommandContext): string[] {
    const repo = context.gitRepository;
    const flags = args.flags;
    const noCommit = flags.n !== undefined || flags["no-commit"] !== undefined;
    const mainlineRaw = flags.m ?? flags.mainline;
    const mainline = typeof mainlineRaw === "string" ? parseInt(mainlineRaw, 10) : undefined;
    const lines: string[] = [];

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i]!;
        const subject = repo.getCommit(id)!.message.split("\n")[0];
        const result = repo.applyCommit(id, mode, {
            noCommit,
            mainline,
            remaining: ids.slice(i + 1),
            recordOrigin: flags.x !== undefined,
        });

        switch (result.kind) {
            case "error":
                return [...lines, ...result.lines];
            case "conflict": {
                result.autoMerged.forEach(p => lines.push(`Auto-merging ${p}`));
                result.conflicts.forEach(c => lines.push(...repo.conflictLines(c)));
                const verb = mode === "cherry-pick" ? "apply" : "revert";
                lines.push(
                    `error: could not ${verb} ${repo.abbrev(id)}... ${subject}`,
                    "hint: After resolving the conflicts, mark them with",
                    'hint: "git add/rm <pathspec>", then run',
                    `hint: "git ${mode} --continue".`,
                    'hint: You can instead skip this commit with "git ' + mode + ' --skip".',
                    `hint: To abort and get back to the state before "git ${mode}",`,
                    `hint: run "git ${mode} --abort".`,
                );
                return lines;
            }
            case "empty":
                return [...lines, ...emptyAdvice(mode, context)];
            case "applied":
                result.autoMerged.forEach(p => lines.push(`Auto-merging ${p}`));
                break;
            case "committed":
                result.autoMerged.forEach(p => lines.push(`Auto-merging ${p}`));
                lines.push(...commitSummary(repo, result.id));
                break;
        }
    }
    if (noCommit) lines.push(hint(`The changes are staged but not committed. Commit them with 'git commit'.`));
    return lines;
}

function emptyAdvice(mode: "cherry-pick" | "revert", context: CommandContext): string[] {
    const repo = context.gitRepository;
    const branch = repo.getBranchName();
    return [
        branch ? `On branch ${branch}` : `HEAD detached at ${repo.abbrev(repo.getHeadCommitId()!)}`,
        `You are currently ${mode === "cherry-pick" ? "cherry-picking" : "reverting"} commit ${repo.abbrev(repo.getSequencer()?.current ?? repo.getHeadCommitId()!)}.`,
        `  (all conflicts fixed: run "git ${mode} --continue")`,
        `  (use "git ${mode} --skip" to skip this patch)`,
        `  (use "git ${mode} --abort" to cancel the ${mode} operation)`,
        "",
        "nothing to commit, working tree clean",
        `The previous ${mode} is now empty, possibly due to conflict resolution.`,
        "If you wish to commit it anyway, use:",
        "",
        "    git commit --allow-empty",
        "",
        `Otherwise, please use 'git ${mode} --skip'`,
    ];
}
