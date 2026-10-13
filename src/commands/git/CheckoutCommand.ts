import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { GitRepository, type Tree } from "~/models/GitRepository";
import { hint, unknownFlagError } from "../base/GitErrors";
import { matchPathspec, requireRepository } from "../helpers/gitFormat";
import { createAndSwitch, detachAt, guessRemoteBranch, switchToBranch, unknownBranchHints } from "../helpers/switching";

export class CheckoutCommand implements Command {
    name = "git checkout";
    description = "Switch branches or restore working tree files";
    usage = "git checkout [<options>] <branch>";
    examples = [
        "git checkout main",
        "git checkout -",
        "git checkout -b feature",
        "git checkout -b feature main",
        "git checkout abc1234",
        "git checkout -- file.txt",
        "git checkout HEAD~1 -- file.txt",
        "git checkout --theirs conflicted.txt",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        // -b/-B take the new branch name; declared boolean so the name stays positional.
        boolean: [
            "b",
            "B",
            "f",
            "q",
            "t",
            "p",
            "track",
            "no-track",
            "detach",
            "force",
            "quiet",
            "patch",
            "ours",
            "theirs",
            "merge",
            "m",
            "guess",
            "no-guess",
        ],
        value: ["orphan"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const flags = args.flags;
        const force = flags.f !== undefined || flags.force !== undefined;

        // Everything after "--" is a path; the token before it (if any) is the source commit.
        const dashDash = args.args.indexOf("--");
        const positional = [...args.positionalArgs];
        let pathspecs: string[] = [];
        let source: string | undefined;
        if (dashDash !== -1) {
            pathspecs = args.args.slice(dashDash + 1);
            const before = positional.slice(0, positional.length - pathspecs.length);
            source = before[0];
            if (before.length > 1) return [`fatal: only one reference expected, ${before.length} given.`];
        }

        // -b/-B <new-branch> [<start-point>]
        const createFlag = (["b", "B"] as const).find(f => flags[f] !== undefined);
        if (createFlag) {
            const value = flags[createFlag];
            const name = typeof value === "string" && value !== "" ? value : positional.shift();
            if (!name) return [`error: switch \`${createFlag}' requires a value`];
            const problem = GitRepository.branchNameProblem(name);
            if (problem) return [`fatal: '${name}' is not a valid branch name`, hint(problem)];
            if (repo.getBornBranches().includes(name) && createFlag === "b") {
                return [
                    `fatal: a branch named '${name}' already exists`,
                    hint(`To move onto it, use: git checkout ${name}`),
                ];
            }
            const startSpec = positional[0];
            let startId: string | null = null;
            if (startSpec !== undefined) {
                const id = repo.resolveCommit(startSpec);
                if (!id)
                    return [`fatal: '${startSpec}' is not a commit and a branch '${name}' cannot be created from it`];
                startId = id;
            }
            const trackFrom =
                startSpec && startSpec in repo.getRemoteTrackingRefs() && flags["no-track"] === undefined
                    ? startSpec
                    : undefined;
            return createAndSwitch(context, name, startId, { reset: createFlag === "B", trackFrom, force });
        }

        if (typeof flags.orphan === "string") {
            const name = flags.orphan;
            if (repo.getBornBranches().includes(name)) return [`fatal: a branch named '${name}' already exists`];
            // Unlike `switch --orphan`, checkout keeps the files staged in the new, empty branch.
            repo.setUnbornBranch(name);
            return [`Switched to a new branch '${name}'`];
        }

        if (dashDash !== -1) {
            return this.restorePaths(context, source, pathspecs, flags, false);
        }

        if (flags.ours !== undefined || flags.theirs !== undefined) {
            return this.restorePaths(context, undefined, positional, flags);
        }

        let target = positional[0];
        if (target === undefined) {
            if (flags.detach !== undefined) target = "HEAD";
            else return [];
        }
        if (target === "-") {
            const previous = repo.previousCheckout(1);
            if (!previous) return ["error: pathspec '-' did not match any file(s) known to git"];
            target = previous;
        }

        // `git checkout <commit> <path>...` without "--"
        if (positional.length > 1) {
            if (repo.resolveCommit(target)) return this.restorePaths(context, target, positional.slice(1), flags);
            return this.restorePaths(context, undefined, positional, flags);
        }

        if (flags.detach === undefined && repo.getBornBranches().includes(target)) {
            return switchToBranch(context, target, { force });
        }

        const commitId = repo.resolveCommit(target);
        if (commitId && flags.detach === undefined && flags["no-guess"] === undefined) {
            // A name that is only a remote branch creates a local tracking branch (DWIM).
            const guessed = !(target in repo.getRemoteTrackingRefs()) ? guessRemoteBranch(repo, target) : null;
            if (guessed)
                return createAndSwitch(context, target, repo.getRemoteTrackingRefs()[guessed]!, {
                    trackFrom: guessed,
                    force,
                });
        }
        if (commitId) {
            return detachAt(context, commitId, target, { force });
        }

        const guessed = flags["no-guess"] === undefined ? guessRemoteBranch(repo, target) : null;
        if (guessed) {
            return createAndSwitch(context, target, repo.getRemoteTrackingRefs()[guessed]!, {
                trackFrom: guessed,
                force,
            });
        }

        // Not a branch or commit: Git tries it as a path.
        const asPath = matchPathspec(context, target, Object.keys(repo.getIndex()));
        if (asPath.length > 0) return this.restorePaths(context, undefined, [target], flags);

        return [
            `error: pathspec '${target}' did not match any file(s) known to git`,
            ...unknownBranchHints(repo, target, "-b"),
        ];
    }

    /**
     * `git checkout [<commit>] -- <paths>`: overwrite files from the index (or from a commit, which
     * also updates the index). `--ours`/`--theirs` pick one side of a conflict.
     */
    private restorePaths(
        context: CommandContext,
        source: string | undefined,
        pathspecs: string[],
        flags: CommandArgs["flags"],
        countPaths = true,
    ): string[] {
        const repo = context.gitRepository;
        if (pathspecs.length === 0) return ["fatal: you must specify path(s) to restore"];

        let sourceTree: Tree | null = null;
        let sourceLabel = "the index";
        if (source !== undefined) {
            const id = repo.resolveCommit(source);
            if (!id) return [`fatal: invalid reference: ${source}`];
            sourceTree = repo.treeOf(id);
            // Git names the tree it read the files from, not the commit.
            sourceLabel = GitRepository.treeId(sourceTree).substring(0, 7);
        }

        const index = repo.getIndex();
        const candidates = new Set([...Object.keys(sourceTree ?? index), ...repo.getUnmergedPaths()]);
        const paths = new Set<string>();
        for (const spec of pathspecs) {
            const matched = matchPathspec(context, spec, candidates);
            if (matched.length === 0) return [`error: pathspec '${spec}' did not match any file(s) known to git`];
            matched.forEach(p => paths.add(p));
        }

        const side = flags.ours !== undefined ? "ours" : flags.theirs !== undefined ? "theirs" : null;
        // Git counts the files it actually rewrote.
        let updated = 0;
        const write = (path: string, content: string) => {
            const fsPath = repo.toFsPath(path);
            if (context.fileSystem.getFileContents(fsPath) !== content) updated++;
            context.fileSystem.writeFile(fsPath, content);
        };
        for (const path of paths) {
            const conflict = repo.getUnmergedEntry(path);
            if (conflict && !side && sourceTree === null) {
                return [`error: path '${path}' is unmerged`];
            }
            if (conflict && side) {
                const content = conflict[side];
                if (content === undefined)
                    return [`error: path '${path}' does not have ${side === "ours" ? "our" : "their"} version`];
                write(path, content);
                continue;
            }
            if (sourceTree) {
                if (path in sourceTree) {
                    write(path, sourceTree[path]!);
                    repo.stagePath(path);
                }
            } else if (path in index) {
                write(path, index[path]!);
            }
        }

        // The count is only reported when the paths were not separated with "--".
        if (!countPaths) return [];
        return [`Updated ${updated} path${updated === 1 ? "" : "s"} from ${sourceLabel}`];
    }
}
