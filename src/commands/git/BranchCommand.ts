import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { GitRepository } from "~/models/GitRepository";
import { hint, refSuggestionHints, unknownFlagError } from "../base/GitErrors";
import { requireRepository } from "../helpers/gitFormat";

export class BranchCommand implements Command {
    name = "git branch";
    description = "List, create, or delete branches";
    usage = "git branch [<options>] [-r | -a] [--merged] [--no-merged]";
    examples = [
        "git branch",
        "git branch -v",
        "git branch -a",
        "git branch feature",
        "git branch feature main",
        "git branch recovery HEAD@{1}",
        "git branch -d old-branch",
        "git branch -D force-delete-branch",
        "git branch -m old-name new-name",
        "git branch -c source copy",
        "git branch -u origin/main",
        "git branch --show-current",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "d",
            "D",
            "m",
            "M",
            "c",
            "C",
            "r",
            "a",
            "v",
            "vv",
            "f",
            "q",
            "l",
            "delete",
            "force",
            "move",
            "copy",
            "remotes",
            "all",
            "list",
            "verbose",
            "quiet",
            "show-current",
            "unset-upstream",
            "no-track",
            "track",
        ],
        value: ["u", "set-upstream-to", "contains", "no-contains", "merged", "no-merged", "sort", "points-at"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        // A mistyped flag is an error, not something to ignore: `git branch -x feature` must not
        // quietly create a branch as though -x had never been typed.
        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const flags = args.flags;
        const names = args.positionalArgs;
        const force = flags.f !== undefined || flags.force !== undefined;

        if (flags["show-current"] !== undefined) {
            const branch = repo.getBranchName();
            return branch ? [branch] : [];
        }

        if (flags.d !== undefined || flags.delete !== undefined || flags.D !== undefined) {
            if (names.length === 0) return ["fatal: branch name required"];
            const isForce = flags.D !== undefined || force;
            const remote = flags.r !== undefined || flags.remotes !== undefined;
            return names.flatMap(name =>
                remote ? this.deleteRemoteTracking(repo, name) : this.deleteBranch(repo, name, isForce),
            );
        }

        if (flags.m !== undefined || flags.move !== undefined || flags.M !== undefined) {
            return this.renameOrCopy(repo, names, "rename", flags.M !== undefined || force);
        }

        if (flags.c !== undefined || flags.copy !== undefined || flags.C !== undefined) {
            return this.renameOrCopy(repo, names, "copy", flags.C !== undefined || force);
        }

        const upstreamTarget =
            typeof flags.u === "string"
                ? flags.u
                : typeof flags["set-upstream-to"] === "string"
                  ? flags["set-upstream-to"]
                  : undefined;
        if (upstreamTarget !== undefined || flags.u !== undefined) {
            return this.setUpstream(repo, upstreamTarget ?? "", names[0]);
        }

        if (flags["unset-upstream"] !== undefined) {
            const branch = names[0] ?? repo.getBranchName();
            if (!branch) return ["fatal: could not unset upstream of HEAD when it does not point to any branch"];
            if (!repo.unsetUpstream(branch)) return [`fatal: branch '${branch}' has no upstream information`];
            return [];
        }

        const listing =
            names.length === 0 ||
            flags.l !== undefined ||
            flags.list !== undefined ||
            flags.r !== undefined ||
            flags.remotes !== undefined ||
            flags.a !== undefined ||
            flags.all !== undefined ||
            flags.merged !== undefined ||
            flags["no-merged"] !== undefined ||
            flags.contains !== undefined ||
            flags["no-contains"] !== undefined ||
            flags["points-at"] !== undefined;

        if (listing && (names.length === 0 || flags.l !== undefined || flags.list !== undefined)) {
            return this.listBranches(repo, args, names);
        }
        if (listing && names.length > 0 && (flags.merged !== undefined || flags.contains !== undefined)) {
            return this.listBranches(repo, args, []);
        }

        return this.createBranch(repo, names[0]!, names[1], force, flags);
    }

    private listBranches(repo: GitRepository, args: CommandArgs, patterns: string[]): string[] {
        const flags = args.flags;
        const verbose = flags.v !== undefined || flags.verbose !== undefined || flags.vv !== undefined;
        const veryVerbose = flags.vv !== undefined || args.args.includes("-vv");
        const showRemote = flags.r !== undefined || flags.remotes !== undefined;
        const showAll = flags.a !== undefined || flags.all !== undefined;
        const headId = repo.getHeadCommitId();
        const current = repo.getBranchName();

        const filterCommit = (option: string | boolean | undefined): string | undefined | null => {
            if (option === undefined) return undefined;
            const spec = typeof option === "string" && option !== "" ? option : "HEAD";
            return repo.resolveCommit(spec) ?? null;
        };
        const merged = filterCommit(flags.merged);
        const noMerged = filterCommit(flags["no-merged"]);
        const contains = filterCommit(flags.contains);
        const noContains = filterCommit(flags["no-contains"]);
        const pointsAt = filterCommit(flags["points-at"]);
        for (const [option, value] of [
            ["merged", merged],
            ["no-merged", noMerged],
            ["contains", contains],
            ["no-contains", noContains],
            ["points-at", pointsAt],
        ] as const) {
            if (value === null) return [`error: malformed object name ${String(flags[option])}`];
        }

        const keep = (tip: string, name: string): boolean => {
            if (
                patterns.length > 0 &&
                !patterns.some(p =>
                    new RegExp("^" + p.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$").test(name),
                )
            ) {
                return false;
            }
            if (merged && !repo.isAncestor(tip, merged)) return false;
            if (noMerged && repo.isAncestor(tip, noMerged)) return false;
            if (contains && !repo.isAncestor(contains, tip)) return false;
            if (noContains && repo.isAncestor(noContains, tip)) return false;
            if (pointsAt && tip !== pointsAt) return false;
            return true;
        };

        type Row = { marker: string; name: string; tip: string; upstream?: string };
        const rows: Row[] = [];

        if (!showRemote) {
            if (!current && headId) {
                const label = repo.getRebaseState()
                    ? `(no branch, rebasing ${repo.getRebaseState()!.branch ?? "detached HEAD"})`
                    : repo.getBisectState()
                      ? `(no branch, bisect started on ${repo.getBisectState()!.startBranch ?? "HEAD"})`
                      : `(HEAD detached ${repo.detachedLabel()?.at === false ? "from" : "at"} ${repo.detachedLabel()?.name ?? repo.abbrev(headId)})`;
                if (keep(headId, label)) rows.push({ marker: "*", name: label, tip: headId });
            }
            for (const [name, tip] of Object.entries(repo.getBranchHeads()).sort(([a], [b]) => (a < b ? -1 : 1))) {
                if (!keep(tip, name)) continue;
                const upstream = repo.getUpstream(name);
                rows.push({
                    marker: name === current ? "*" : " ",
                    name,
                    tip,
                    upstream: upstream ? GitRepository.upstreamRefName(upstream) : undefined,
                });
            }
        }

        if (showRemote || showAll) {
            for (const [name, tip] of Object.entries(repo.getRemoteTrackingRefs()).sort(([a], [b]) =>
                a < b ? -1 : 1,
            )) {
                if (!keep(tip, name)) continue;
                rows.push({ marker: " ", name: showAll ? `remotes/${name}` : name, tip });
            }
        }

        if (!verbose) return rows.map(r => `${r.marker} ${r.name}`);

        const width = Math.max(...rows.map(r => r.name.length), 0);
        return rows.map(r => {
            const commit = repo.getCommit(r.tip)!;
            let tracking = "";
            if (veryVerbose && r.upstream) {
                const ab = repo.aheadBehind(r.name);
                const parts: string[] = [];
                if (ab?.gone) parts.push("gone");
                if (ab && ab.ahead > 0) parts.push(`ahead ${ab.ahead}`);
                if (ab && ab.behind > 0) parts.push(`behind ${ab.behind}`);
                tracking = `[${r.upstream}${parts.length ? ": " + parts.join(", ") : ""}] `;
            }
            return `${r.marker} ${r.name.padEnd(width)} ${repo.abbrev(r.tip)} ${tracking}${commit.message.split("\n")[0]}`;
        });
    }

    private createBranch(
        repo: GitRepository,
        branchName: string,
        startPoint: string | undefined,
        force: boolean,
        flags: CommandArgs["flags"],
    ): string[] {
        const invalidReason = GitRepository.branchNameProblem(branchName);
        if (invalidReason) {
            return [`fatal: '${branchName}' is not a valid branch name`, hint(invalidReason)];
        }

        const exists = repo.getBornBranches().includes(branchName);
        if (exists && !force) {
            return [
                `fatal: a branch named '${branchName}' already exists`,
                hint(`To move onto it instead of creating it, use: git switch ${branchName}`),
            ];
        }
        if (exists && force && branchName === repo.getBranchName()) {
            return [
                `fatal: cannot force update the branch '${branchName}' used by worktree at '${repo.getRepositoryRoot()}'`,
            ];
        }

        const spec = startPoint ?? "HEAD";
        const startId = repo.resolveCommit(spec);
        if (!startId) {
            const result = repo.resolveRevision(spec);
            if (!result.ok && result.message && result.reason !== "ambiguous") return result.message;
            const shown = startPoint ?? repo.getCurrentBranch();
            return [`fatal: not a valid object name: '${shown}'`, ...refSuggestionHints(spec, repo.getBornBranches())];
        }

        repo.createBranch(branchName, startPoint !== undefined ? startId : undefined, force);

        // Branching from a remote-tracking branch sets it up as upstream (branch.autoSetupMerge).
        const trackingRefs = repo.getRemoteTrackingRefs();
        if (startPoint && startPoint in trackingRefs && flags["no-track"] === undefined) {
            const [remote, ...rest] = startPoint.split("/");
            repo.setUpstream(branchName, remote!, rest.join("/"));
            return [`branch '${branchName}' set up to track '${startPoint}'.`];
        }

        // Like real Git, creating a branch prints nothing.
        return [];
    }

    private deleteBranch(repo: GitRepository, branchName: string, isForce: boolean): string[] {
        const allBranches = repo.getBornBranches();

        // Branch names are case-sensitive in Git, so `git branch -D Feature` against a "feature"
        // branch lands here — the hint says why instead of leaving a dead end.
        if (!allBranches.includes(branchName)) {
            return [`error: branch '${branchName}' not found`, ...refSuggestionHints(branchName, allBranches)];
        }

        if (branchName === repo.getBranchName()) {
            return [
                `error: cannot delete branch '${branchName}' used by worktree at '${repo.getRepositoryRoot()}'`,
                hint(
                    `Move to another branch first, for example: git switch ${allBranches.find(b => b !== branchName) ?? "main"}`,
                ),
            ];
        }

        const tip = repo.getBranchTip(branchName)!;
        if (!isForce) {
            // -d only deletes work that is safe elsewhere: merged into its upstream, or into HEAD.
            const upstream = repo.getUpstream(branchName);
            const upstreamTip = upstream ? repo.resolveCommit(GitRepository.upstreamRefName(upstream)) : undefined;
            const base = upstreamTip ?? repo.getHeadCommitId();
            if (!base || !repo.isAncestor(tip, base)) {
                return [
                    `error: the branch '${branchName}' is not fully merged`,
                    hint(`If you are sure you want to delete it, run 'git branch -D ${branchName}'`),
                    hint(`-d refuses to throw work away; -D deletes anyway.`),
                ];
            }
        }

        repo.deleteBranch(branchName);
        return [`Deleted branch ${branchName} (was ${repo.abbrev(tip)}).`];
    }

    private deleteRemoteTracking(repo: GitRepository, name: string): string[] {
        const tip = repo.getRemoteTrackingRefs()[name];
        if (!tip) return [`error: remote-tracking branch '${name}' not found`];
        repo.deleteTrackingRef(name);
        return [`Deleted remote-tracking branch ${name} (was ${repo.abbrev(tip)}).`];
    }

    private renameOrCopy(repo: GitRepository, names: string[], mode: "rename" | "copy", force: boolean): string[] {
        if (names.length === 0) return ["fatal: branch name required"];
        if (names.length > 2) return [`fatal: too many arguments for a ${mode} operation`];

        const current = repo.getBranchName();
        const source = names.length === 2 ? names[0]! : current;
        const target = names.length === 2 ? names[1]! : names[0]!;
        if (!source) return [`fatal: cannot ${mode} the current branch while not on any`];

        const allBranches = repo.getBranches();
        if (!allBranches.includes(source)) {
            return [
                `error: refname refs/heads/${source} not found`,
                `fatal: branch ${mode} failed`,
                ...refSuggestionHints(source, allBranches),
            ];
        }

        const invalidReason = GitRepository.branchNameProblem(target);
        if (invalidReason) return [`fatal: '${target}' is not a valid branch name`, hint(invalidReason)];

        if (allBranches.includes(target) && !force && target !== source) {
            return [`fatal: a branch named '${target}' already exists`];
        }
        // -M/-C may overwrite a branch, but never the one checked out.
        if (allBranches.includes(target) && target === current && target !== source) {
            return [
                `fatal: cannot force update the branch '${target}' used by worktree at '${repo.getRepositoryRoot() ?? "/"}'`,
            ];
        }

        if (mode === "rename") {
            // Renaming a branch to its own name still rewrites it (and logs it), like Git.
            if (!repo.renameBranch(source, target, force || target === source)) return [`fatal: branch rename failed`];
            return [];
        }

        if (!repo.copyBranch(source, target, force)) return [`fatal: branch copy failed`];
        return [];
    }

    private setUpstream(repo: GitRepository, target: string, branchArg: string | undefined): string[] {
        const branch = branchArg ?? repo.getBranchName();
        if (!branch)
            return ["fatal: could not set upstream of HEAD to " + target + " when it does not point to any branch"];
        if (!repo.getBranches().includes(branch)) return [`fatal: branch '${branch}' does not exist`];
        if (!target) return ["error: option `set-upstream-to' requires a value"];

        const refs = repo.getRemoteTrackingRefs();
        if (!(target in refs)) {
            if (repo.getBornBranches().includes(target)) {
                repo.setUpstream(branch, ".", target);
                return [`branch '${branch}' set up to track '${target}'.`];
            }
            return [
                `fatal: the requested upstream branch '${target}' does not exist`,
                "hint: ",
                "hint: If you are planning on basing your work on an upstream",
                "hint: branch that already exists at the remote, you may need to",
                'hint: run "git fetch" to retrieve it.',
                "hint: ",
                "hint: If you are planning to push out a new local branch that",
                "hint: will track its remote counterpart, you may want to use",
                'hint: "git push -u" to set the upstream config as you push.',
            ];
        }
        const [remote, ...rest] = target.split("/");
        repo.setUpstream(branch, remote!, rest.join("/"));
        return [`branch '${branch}' set up to track '${target}'.`];
    }
}
