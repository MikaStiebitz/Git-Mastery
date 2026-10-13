import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { GitRepository, type MergeOutcome } from "~/models/GitRepository";
import { hint, refSuggestionHints, unknownFlagError } from "../base/GitErrors";
import { commitSummary, diffStatLines, modeLines, requireRepository } from "../helpers/gitFormat";

export class MergeCommand implements Command {
    name = "git merge";
    description = "Join two or more development histories together";
    usage = "git merge [<options>] [<commit>...]";
    examples = [
        "git merge feature",
        "git merge --no-ff feature",
        "git merge --ff-only origin/main",
        "git merge --squash feature",
        "git merge --abort",
        "git merge --continue",
        "git merge -m 'Merge message' feature",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "no-ff",
            "ff",
            "ff-only",
            "abort",
            "continue",
            "quit",
            "squash",
            "no-squash",
            "commit",
            "no-commit",
            "e",
            "edit",
            "no-edit",
            "q",
            "quiet",
            "v",
            "verbose",
            "stat",
            "n",
            "no-stat",
            "allow-unrelated-histories",
            "log",
            "no-log",
        ],
        value: ["m", "message", "s", "strategy", "X", "strategy-option", "F", "file"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const flags = args.flags;

        if (flags.abort !== undefined || flags.quit !== undefined) {
            if (!repo.getMergeState()) return ["fatal: There is no merge to abort (MERGE_HEAD missing)."];
            repo.abortMerge();
            return [];
        }

        if (flags.continue !== undefined) {
            const state = repo.getMergeState();
            if (!state) return ["fatal: There is no merge in progress (MERGE_HEAD missing)."];
            if (repo.hasMergeConflicts()) {
                return [
                    "error: Committing is not possible because you have unmerged files.",
                    "hint: Fix them up in the work tree, and then use 'git add/rm <file>'",
                    "hint: as appropriate to mark resolution and make a commit.",
                    "fatal: Exiting because of an unresolved conflict.",
                ];
            }
            const id = repo.commit(state.message, true);
            return id ? commitSummary(repo, id) : ["fatal: could not conclude the merge"];
        }

        // A merge can't start while another one (or any conflict) is unfinished.
        if (repo.hasMergeConflicts()) {
            return [
                "error: Merging is not possible because you have unmerged files.",
                "hint: Fix them up in the work tree, and then use 'git add/rm <file>'",
                "hint: as appropriate to mark resolution and make a commit.",
                "fatal: Exiting because of an unresolved conflict.",
            ];
        }
        if (repo.isMerging()) {
            return [
                "fatal: You have not concluded your merge (MERGE_HEAD exists).",
                "Please, commit your changes before you merge.",
            ];
        }

        let targets = args.positionalArgs;
        if (targets.length === 0) {
            // No argument: merge the upstream of the current branch.
            const branch = repo.getBranchName();
            const upstream = branch ? repo.getUpstream(branch) : null;
            if (!upstream) return ["fatal: No remote for the current branch."];
            targets = [GitRepository.upstreamRefName(upstream)];
        }

        if (targets.length > 1) {
            return this.octopus(repo, targets, flags);
        }

        let target = targets[0]!;
        if (target === "-") target = repo.previousCheckout(1) ?? "-";
        const theirsId = repo.resolveCommit(target);
        if (!theirsId) {
            return [
                `merge: ${target} - not something we can merge`,
                ...refSuggestionHints(target, repo.getBornBranches()),
            ];
        }

        if (
            repo.getBranchName() !== null &&
            repo.getBranchTip(repo.getBranchName()!) === theirsId &&
            target === repo.getBranchName()
        ) {
            return ["Already up to date."];
        }

        const message =
            typeof flags.m === "string" ? flags.m : typeof flags.message === "string" ? flags.message : undefined;
        const ff = flags["no-ff"] !== undefined ? "no-ff" : flags["ff-only"] !== undefined ? "ff-only" : "auto";
        const squash = flags.squash !== undefined;
        const noCommit = flags["no-commit"] !== undefined;
        const quiet = flags.q !== undefined || flags.quiet !== undefined;
        const noStat = flags.n !== undefined || flags["no-stat"] !== undefined;

        const headBefore = repo.getHeadCommitId();
        const outcome = repo.mergeCommit(theirsId, {
            label: target,
            ff,
            squash,
            noCommit,
            message,
            allowUnrelated: flags["allow-unrelated-histories"] !== undefined,
        });

        const lines = this.describe(repo, outcome, headBefore, { squash, noCommit, noStat });
        return quiet ? lines.filter(l => /^(error|fatal|CONFLICT|Automatic merge failed)/.test(l)) : lines;
    }

    /** `git merge a b c`: one merge commit with a parent for every branch (the octopus strategy). */
    private octopus(repo: GitRepository, targets: string[], flags: CommandArgs["flags"]): string[] {
        const heads: { id: string; label: string }[] = [];
        for (const target of targets) {
            const id = repo.resolveCommit(target);
            if (!id)
                return [
                    `merge: ${target} - not something we can merge`,
                    ...refSuggestionHints(target, repo.getBornBranches()),
                ];
            heads.push({ id, label: target });
        }
        const message =
            typeof flags.m === "string" ? flags.m : typeof flags.message === "string" ? flags.message : undefined;
        const outcome = repo.mergeOctopus(heads, { message, noCommit: flags["no-commit"] !== undefined });

        switch (outcome.kind) {
            case "up-to-date":
                return ["Already up to date."];
            case "error":
                return outcome.lines;
            case "merged": {
                const lines = [...outcome.progress];
                if (outcome.commitId === null) {
                    lines.push("Automatic merge went well; stopped before committing as requested");
                    return lines;
                }
                lines.push(
                    "Merge made by the 'octopus' strategy.",
                    ...diffStatLines(outcome.stat),
                    ...modeLines(outcome.stat),
                );
                return lines;
            }
            case "conflict":
                return [...outcome.progress, "Automatic merge failed; fix conflicts and then commit the result."];
        }
    }

    private describe(
        repo: GitRepository,
        outcome: MergeOutcome,
        headBefore: string | null,
        options: { squash: boolean; noCommit: boolean; noStat: boolean },
    ): string[] {
        switch (outcome.kind) {
            case "up-to-date":
                return ["Already up to date."];
            case "error":
                return outcome.lines;
            case "fast-forward": {
                const lines = [
                    `Updating ${headBefore ? repo.abbrev(headBefore) : "0000000"}..${repo.abbrev(outcome.to)}`,
                    "Fast-forward",
                ];
                if (!options.noStat) lines.push(...diffStatLines(outcome.stat), ...modeLines(outcome.stat));
                return lines;
            }
            case "merged": {
                const lines = outcome.autoMerged.map(p => `Auto-merging ${p}`);
                if (options.squash) {
                    lines.push(
                        "Squash commit -- not updating HEAD",
                        "Automatic merge went well; stopped before committing as requested",
                    );
                    return lines;
                }
                if (outcome.commitId === null) {
                    lines.push("Automatic merge went well; stopped before committing as requested");
                    return lines;
                }
                lines.push("Merge made by the 'ort' strategy.");
                if (!options.noStat) lines.push(...diffStatLines(outcome.stat), ...modeLines(outcome.stat));
                return lines;
            }
            case "conflict": {
                const lines = repo.mergeReport(outcome.autoMerged, outcome.conflicts);
                lines.push("Automatic merge failed; fix conflicts and then commit the result.");
                return lines;
            }
        }
    }
}
