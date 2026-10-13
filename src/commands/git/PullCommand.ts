import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { unknownFlagError } from "../base/GitErrors";
import { diffStatLines, modeLines, requireRepository } from "../helpers/gitFormat";
import { fetchReport, unknownRemote } from "./FetchCommand";

export class PullCommand implements Command {
    name = "git pull";
    description = "Fetch from and integrate with another repository or a local branch";
    usage = "git pull [<options>] [<repository> [<refspec>...]]";
    examples = ["git pull", "git pull origin main", "git pull --rebase", "git pull --ff-only"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "rebase",
            "r",
            "no-rebase",
            "ff",
            "no-ff",
            "ff-only",
            "f",
            "force",
            "all",
            "q",
            "quiet",
            "v",
            "verbose",
            "autostash",
            "no-autostash",
            "prune",
            "p",
            "tags",
            "no-edit",
            "squash",
            "no-commit",
            "allow-unrelated-histories",
        ],
        value: ["s", "strategy", "X", "strategy-option", "depth"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const flags = args.flags;
        const branch = repo.getBranchName();
        const upstream = branch ? repo.getUpstream(branch) : null;
        const remotes = Object.keys(repo.getRemotes());

        if (repo.hasMergeConflicts()) {
            return [
                "error: Pulling is not possible because you have unmerged files.",
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

        let remote = args.positionalArgs[0];
        let remoteBranch = args.positionalArgs[1];

        if (remote === undefined) {
            if (remotes.length === 0) {
                return [
                    "fatal: No remote repository specified.  Please, specify either a URL or a",
                    "remote name from which new revisions should be fetched.",
                ];
            }
            if (!upstream) {
                if (!branch) {
                    return [
                        "You are not currently on a branch.",
                        "Please specify which branch you want to merge with.",
                        "See git-pull(1) for details.",
                        "",
                        "    git pull <remote> <branch>",
                        "",
                    ];
                }
                return [
                    "There is no tracking information for the current branch.",
                    "Please specify which branch you want to merge with.",
                    "See git-pull(1) for details.",
                    "",
                    "    git pull <remote> <branch>",
                    "",
                    "If you wish to set tracking information for this branch you can do so with:",
                    "",
                    `    git branch --set-upstream-to=${remotes.includes("origin") ? "origin" : remotes[0]}/<branch> ${branch}`,
                    "",
                ];
            }
            remote = upstream.remote;
            remoteBranch = upstream.branch;
        }

        if (!remotes.includes(remote)) return unknownRemote(repo, remote);
        if (remoteBranch === undefined) {
            if (upstream && upstream.remote === remote) remoteBranch = upstream.branch;
            else
                return [
                    `fatal: You asked to pull from the remote '${remote}', but did not specify`,
                    "a branch. Because this is not the default configured remote",
                    "for your current branch, you must specify a branch on the command line.",
                ];
        }
        if (!(remoteBranch in repo.getRemoteBranches(remote))) {
            return [`fatal: couldn't find remote ref ${remoteBranch}`];
        }

        const lines: string[] = [];
        const updates = repo.fetch(remote, remoteBranch);
        lines.push(
            ...fetchReport(repo, remote, updates, {
                branch: args.positionalArgs[1] !== undefined ? remoteBranch : undefined,
            }),
        );

        const theirs = repo.getRemoteBranches(remote)[remoteBranch]!;
        const url = repo.getRemotes()[remote]!.replace(/\.git$/, "");
        const useRebase = (flags.rebase !== undefined || flags.r !== undefined) && flags["no-rebase"] === undefined;

        if (useRebase) {
            return [...lines, ...this.pullRebase(context, theirs, `${remote}/${remoteBranch}`)];
        }

        const before = repo.getHeadCommitId();
        const outcome = repo.mergeCommit(theirs, {
            label: `${remote}/${remoteBranch}`,
            ff: flags["ff-only"] !== undefined ? "ff-only" : flags["no-ff"] !== undefined ? "no-ff" : "auto",
            message: `Merge branch '${remoteBranch}' of ${url}`,
            squash: flags.squash !== undefined,
            noCommit: flags["no-commit"] !== undefined,
            allowUnrelated: flags["allow-unrelated-histories"] !== undefined,
            reflogPrefix: `pull ${remote} ${remoteBranch}`,
        });

        switch (outcome.kind) {
            case "up-to-date":
                lines.push("Already up to date.");
                break;
            case "error":
                lines.push(...outcome.lines);
                break;
            case "fast-forward":
                lines.push(
                    `Updating ${before ? repo.abbrev(before) : "0000000"}..${repo.abbrev(outcome.to)}`,
                    "Fast-forward",
                    ...diffStatLines(outcome.stat),
                    ...modeLines(outcome.stat),
                );
                break;
            case "merged":
                outcome.autoMerged.forEach(p => lines.push(`Auto-merging ${p}`));
                if (outcome.commitId)
                    lines.push(
                        "Merge made by the 'ort' strategy.",
                        ...diffStatLines(outcome.stat),
                        ...modeLines(outcome.stat),
                    );
                else lines.push("Automatic merge went well; stopped before committing as requested");
                break;
            case "conflict": {
                lines.push(...repo.mergeReport(outcome.autoMerged, outcome.conflicts));
                lines.push("Automatic merge failed; fix conflicts and then commit the result.");
                break;
            }
        }
        return lines;
    }

    private pullRebase(context: CommandContext, theirs: string, label: string): string[] {
        const repo = context.gitRepository;
        const head = repo.getHeadCommitId();
        if (!head) return [];
        if (repo.statusEntries().some(e => e.worktree !== "?")) {
            return [
                "error: cannot pull with rebase: You have unstaged changes.",
                "error: Please commit or stash them.",
            ];
        }
        if (repo.isAncestor(theirs, head)) return ["Current branch is up to date."];
        const commits = repo.rebaseCommits(theirs, head);
        repo.startRebase({ onto: theirs, ontoLabel: label, commits, interactive: false });
        return repo.runRebase().lines;
    }
}
