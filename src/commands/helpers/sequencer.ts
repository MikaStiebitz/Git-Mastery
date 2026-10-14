import type { CommandArgs, CommandContext } from "../base/Command";
import { commitSummary, requireRepository, revisionError } from "./gitFormat";
import { unknownFlagError } from "../base/GitErrors";
import { longStatus } from "./statusFormat";

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

    // A single stopped pick (no sequencer directory) answers to either command's --continue;
    // --abort rolls back whatever cherry-pick or revert is in progress.
    const ours = state && (state.kind === mode || !state.multi) ? state : null;
    if (flags.abort !== undefined) {
        if (!state) return [`error: no ${mode} in progress`, `fatal: ${mode} failed`];
        const aborted = repo.abortSequencer();
        return aborted.ok ? [] : aborted.error;
    }
    if (flags.quit !== undefined) {
        // Nothing to forget is fine too.
        if (state) repo.clearSequencer();
        return [];
    }
    if (flags.skip !== undefined) {
        if (!state || state.kind !== mode) return [`error: no ${mode} in progress`, `fatal: ${mode} failed`];
        const skipped = repo.skipSequencerPick();
        if (!skipped.ok) return skipped.error;
        repo.clearSequencer();
        // A run that could not even start its current pick still lists it first.
        const remaining = state.remaining[0] === state.current ? state.remaining.slice(1) : state.remaining;
        return applyAll(mode, remaining, args, context, state.start, state.multi);
    }
    if (flags.continue !== undefined) {
        if (!ours || !state) return [`error: no ${mode} in progress`, `fatal: ${mode} failed`];
        if (state.concluded) {
            // The stopped pick was committed by hand; go on with the rest of the list.
            repo.clearSequencer();
            return applyAll(mode, state.remaining, args, context, state.start, state.multi);
        }
        if (repo.indexMatchesHead() && !repo.hasMergeConflicts()) {
            // Resolved to nothing.
            return emptyAdvice(mode, context);
        }
        const result = repo.continueSequencer();
        if (!result.ok) return result.error;
        const lines = commitSummary(repo, result.id, { showDate: state.kind === "cherry-pick" });
        repo.clearSequencer();
        return [...lines, ...applyAll(mode, state.remaining, args, context, state.start, state.multi)];
    }

    // Only a run of several commits counts as "in progress"; a single stopped pick is just a dirty index.
    if (state && (state.multi || state.concluded)) {
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

    // Expand ranges (A..B) into the commits they contain, oldest first. Anything but a single
    // commit is a "multi" run: Git keeps a sequencer directory for it.
    const multi = args.positionalArgs.length > 1 || args.positionalArgs.some(a => a.includes(".."));
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
    // A single stopped pick that is left behind is simply replaced by the new one.
    const noCommit = args.flags.n !== undefined || args.flags["no-commit"] !== undefined;
    if (state && !noCommit && repo.indexMatchesHead()) repo.clearSequencer();

    return applyAll(mode, ids, args, context, repo.getHeadCommitId(), multi);
}

function applyAll(
    mode: "cherry-pick" | "revert",
    ids: string[],
    args: CommandArgs,
    context: CommandContext,
    start: string | null = context.gitRepository.getHeadCommitId(),
    multi = false,
): string[] {
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
            start,
            multi: ids.length > 1 || multi,
        });

        switch (result.kind) {
            case "error": {
                // A run of several commits keeps its list even when a pick cannot start.
                const isMulti = ids.length > 1 || multi;
                if (isMulti) {
                    repo.holdSequencer({
                        kind: mode,
                        current: id,
                        concluded: true,
                        remaining: ids.slice(i),
                        start,
                        multi: true,
                        message: "",
                        author: { name: "", email: "", date: new Date() },
                    });
                }
                return [...lines, ...result.lines];
            }
            case "conflict": {
                lines.push(...repo.mergeReport(result.autoMerged, result.conflicts));
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
                lines.push(...commitSummary(repo, result.id, { showDate: mode === "cherry-pick" }));
                break;
        }
    }
    return lines;
}

function emptyAdvice(mode: "cherry-pick" | "revert", context: CommandContext): string[] {
    // Git runs `git commit`, which prints the long status, then explains why nothing was committed.
    // Only a pick left in progress gets the explanation; an empty revert just ends there.
    if (!context.gitRepository.getSequencer()) return longStatus(context);
    return [
        ...longStatus(context),
        `The previous ${mode} is now empty, possibly due to conflict resolution.`,
        "If you wish to commit it anyway, use:",
        "",
        "    git commit --allow-empty",
        "",
        `Otherwise, please use 'git ${mode} --skip'`,
    ];
}
