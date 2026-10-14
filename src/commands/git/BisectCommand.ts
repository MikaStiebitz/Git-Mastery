import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { unknownFlagError } from "../base/GitErrors";
import { diffStatLines, formatGitDate, indentMessage, requireRepository } from "../helpers/gitFormat";

export class BisectCommand implements Command {
    name = "git bisect";
    description = "Use binary search to find the commit that introduced a bug";
    usage =
        "git bisect (start [<bad> [<good>...]] | bad [<rev>] | good [<rev>...] | skip [<rev>] | reset [<commit>] | log | view)";
    examples = [
        "git bisect start",
        "git bisect bad",
        "git bisect good v1.0",
        "git bisect start HEAD HEAD~5",
        "git bisect skip",
        "git bisect reset",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["no-checkout", "first-parent"],
        value: ["term-old", "term-new", "term-good", "term-bad"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const [sub, ...revs] = args.positionalArgs;
        if (!sub) return [`usage: ${this.usage}`];

        const state = repo.getBisectState();
        const sub2 = sub === "new" ? "bad" : sub === "old" ? "good" : sub;

        switch (sub2) {
            case "start": {
                if (repo.getHeadCommitId() === null) return ["fatal: Bad HEAD - I need a HEAD"];
                if (state) this.reset(context, undefined);
                if (repo.statusEntries().some(e => e.worktree !== "?")) {
                    return [
                        "error: Your local changes would be overwritten by checkout.",
                        "Please commit your changes or stash them before you bisect.",
                    ];
                }
                repo.startBisect();
                const [bad, ...goods] = revs;
                const lines: string[] = [];
                if (bad) {
                    const id = repo.resolveCommit(bad);
                    if (!id) {
                        repo.endBisect();
                        return [`fatal: '${bad}' does not appear to be a valid revision`];
                    }
                    repo.markBisect("bad", id);
                }
                for (const good of goods) {
                    const id = repo.resolveCommit(good);
                    if (!id) {
                        repo.endBisect();
                        return [`fatal: '${good}' does not appear to be a valid revision`];
                    }
                    repo.markBisect("good", id);
                }
                lines.push(...this.next(context));
                return lines;
            }

            case "bad":
            case "good":
            case "skip": {
                if (!state)
                    return [
                        'You need to start by "git bisect start"',
                        "",
                        "hint: Run 'git bisect start' first, then mark commits good or bad.",
                    ];
                const targets = revs.length > 0 ? revs : ["HEAD"];
                for (const rev of targets) {
                    const id = repo.resolveCommit(rev);
                    if (!id)
                        return [
                            `fatal: Needed a single revision`,
                            `fatal: '${rev}' does not appear to be a valid revision`,
                        ];
                    repo.markBisect(sub2, id);
                }
                return this.next(context);
            }

            case "reset":
                if (!state) return ["We are not bisecting."];
                return this.reset(context, revs[0]);

            case "log":
                if (!state) return ["error: We are not bisecting."];
                return ["git bisect start", ...state.log];

            case "view":
            case "visualize": {
                if (!state) return ["error: We are not bisecting."];
                const ids = repo.bisectCandidates();
                return ids.map(id => `${repo.abbrev(id)} ${repo.getCommit(id)!.message.split("\n")[0]}`);
            }

            case "terms":
                return ["Your current terms are good for the old state", "and bad for the new state."];

            case "run":
                return [
                    "error: 'git bisect run' needs a script to run, which is not available here.",
                    "hint: Test each commit yourself and mark it with 'git bisect good' or 'git bisect bad'.",
                ];

            default:
                return [`error: unknown command: '${sub}'`, `usage: ${this.usage}`];
        }
    }

    /** After a mark: report what is still missing, check out the next commit, or name the culprit. */
    private next(context: CommandContext): string[] {
        const repo = context.gitRepository;
        const state = repo.getBisectState()!;

        if (!state.bad && state.good.length === 0) return ["status: waiting for both good and bad commits"];
        if (!state.bad)
            return [
                `status: waiting for bad commit, ${state.good.length} good commit${state.good.length === 1 ? "" : "s"} known`,
            ];
        if (state.good.length === 0) return ["status: waiting for good commit(s), bad commit known"];

        if (state.good.some(g => g === state.bad || !repo.isAncestor(g, state.bad!))) {
            return [
                "Some good revs are not ancestors of the bad rev.",
                "git bisect cannot work properly in this case.",
                "Maybe you mistook good and bad revs?",
            ];
        }

        const candidates = repo.bisectCandidates().filter(id => !state.skipped.includes(id) || id === state.bad);
        if (candidates.length <= 1) {
            const culprit = state.bad;
            const commit = repo.getCommit(culprit)!;
            const parentTree = commit.parents[0] ? repo.treeOf(commit.parents[0]) : {};
            return [
                `${culprit} is the first bad commit`,
                `commit ${culprit}`,
                `Author: ${commit.author} <${commit.email}>`,
                `Date:   ${formatGitDate(commit.timestamp)}`,
                "",
                ...indentMessage(commit.message),
                "",
                ...diffStatLines(repo.treeStat(parentTree, commit.tree)),
            ];
        }

        // Pick the commit that splits the remaining candidates most evenly.
        const total = candidates.length;
        let best = candidates[0]!;
        let bestScore = -1;
        for (const id of candidates) {
            if (id === state.bad || state.skipped.includes(id)) continue;
            const below = candidates.filter(c => repo.isAncestor(c, id)).length;
            const score = Math.min(below, total - below);
            if (score > bestScore) {
                bestScore = score;
                best = id;
            }
        }
        // Git's arithmetic (bisect.c): what is left once this one is tested, and estimate_bisect_steps().
        const reaches = candidates.filter(c => repo.isAncestor(c, best)).length;
        const left = total - reaches - 1;
        const steps = (() => {
            if (total < 3) return 0;
            const n = Math.floor(Math.log2(total));
            const e = 2 ** n;
            return e < 3 * (total - e) ? n : n - 1;
        })();
        const moved = repo.moveHead({ detach: best }, { reflogTo: best });
        if (!moved.ok) return moved.error;
        return [
            `Bisecting: ${left} revision${left === 1 ? "" : "s"} left to test after this (roughly ${steps} step${steps === 1 ? "" : "s"})`,
            `[${best}] ${repo.getCommit(best)!.message.split("\n")[0]}`,
        ];
    }

    private reset(context: CommandContext, target: string | undefined): string[] {
        const repo = context.gitRepository;
        const state = repo.getBisectState()!;
        repo.endBisect();
        const back = target ?? state.startBranch ?? state.start;
        // Nothing was checked out yet: going back changes nothing.
        if (repo.getBranchName() === back) return [];
        const headId = repo.getHeadCommitId()!;
        const lines = [
            `Previous HEAD position was ${repo.abbrev(headId)} ${repo.getCommit(headId)!.message.split("\n")[0]}`,
        ];
        if (repo.getBranches().includes(back)) {
            const moved = repo.moveHead({ branch: back });
            if (!moved.ok) return moved.error;
            lines.push(`Switched to branch '${back}'`);
        } else {
            const id = repo.resolveCommit(back);
            if (!id) return [`error: '${back}' is not a valid commit`];
            repo.moveHead({ detach: id });
            lines.push(`HEAD is now at ${repo.abbrev(id)} ${repo.getCommit(id)!.message.split("\n")[0]}`);
        }
        return lines;
    }
}
