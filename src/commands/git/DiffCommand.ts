import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import type { GitRepository, Tree } from "~/models/GitRepository";
import { fileDiff } from "~/models/git/diff";
import { hint, unknownFlagError } from "../base/GitErrors";
import {
    diffStatLines,
    displayPath,
    matchPathspec,
    requireRepository,
    revisionError,
    shortStat,
} from "../helpers/gitFormat";

export class DiffCommand implements Command {
    name = "git diff";
    description = "Show changes between commits, commit and working tree, etc";
    usage = "git diff [<options>] [<commit>] [--] [<path>...]";
    examples = [
        "git diff",
        "git diff --staged",
        "git diff HEAD",
        "git diff HEAD~1 HEAD",
        "git diff main..feature",
        "git diff --stat",
        "git diff README.md",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "cached",
            "staged",
            "stat",
            "numstat",
            "shortstat",
            "name-only",
            "name-status",
            "color",
            "no-color",
            "w",
            "ignore-all-space",
            "b",
            "patch",
            "p",
            "u",
            "no-patch",
            "s",
            "quiet",
            "exit-code",
            "R",
        ],
        value: ["U", "unified", "M", "find-renames", "diff-filter"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const staged = args.flags.staged !== undefined || args.flags.cached !== undefined;

        // Revisions first, then paths (Git's own disambiguation).
        const dashDash = args.args.indexOf("--");
        const positional = args.positionalArgs;
        let revArgs: string[] = [];
        let pathArgs: string[] = [];
        if (dashDash !== -1) {
            const afterCount = args.args.length - dashDash - 1;
            pathArgs = positional.slice(positional.length - afterCount);
            revArgs = positional.slice(0, positional.length - afterCount);
        } else {
            for (const arg of positional) {
                if (pathArgs.length === 0 && (arg.includes("..") || repo.resolveCommit(arg))) {
                    revArgs.push(arg);
                } else {
                    pathArgs.push(arg);
                }
            }
        }

        // Expand A..B and A...B
        const revs: string[] = [];
        let symmetricBase: string | null = null;
        for (const arg of revArgs) {
            const sym = /^(.*)\.\.\.(.*)$/.exec(arg);
            const range = /^(.*)\.\.(.*)$/.exec(arg);
            if (sym) {
                const a = repo.resolveCommit(sym[1] || "HEAD");
                const b = repo.resolveCommit(sym[2] || "HEAD");
                if (!a) return revisionError(repo, sym[1] || "HEAD", "diff");
                if (!b) return revisionError(repo, sym[2] || "HEAD", "diff");
                symmetricBase = repo.mergeBase(a, b);
                revs.push(b);
            } else if (range) {
                const a = repo.resolveCommit(range[1] || "HEAD");
                const b = repo.resolveCommit(range[2] || "HEAD");
                if (!a) return revisionError(repo, range[1] || "HEAD", "diff");
                if (!b) return revisionError(repo, range[2] || "HEAD", "diff");
                revs.push(a, b);
            } else {
                const id = repo.resolveCommit(arg);
                if (!id) return revisionError(repo, arg, "diff");
                revs.push(id);
            }
        }
        if (revs.length > 2 && symmetricBase === null) return ["error: too many revisions for 'git diff'"];

        // Pick the two sides.
        let oldTree: Tree;
        let newTree: Tree;
        let worktreeSide = false;
        const work = repo.readWorkingTree();
        const index = repo.getIndex();
        const headTree = repo.getHeadTree();

        if (symmetricBase !== null || (revArgs.length === 1 && revArgs[0]!.includes("..."))) {
            oldTree = symmetricBase ? repo.treeOf(symmetricBase) : {};
            newTree = repo.treeOf(revs[0]!);
        } else if (revs.length === 2) {
            oldTree = repo.treeOf(revs[0]!);
            newTree = repo.treeOf(revs[1]!);
        } else if (revs.length === 1) {
            oldTree = repo.treeOf(revs[0]!);
            if (staged) {
                newTree = index;
            } else {
                // Commit vs working tree: tracked files only.
                newTree = {};
                for (const path of new Set([...Object.keys(index), ...Object.keys(oldTree)])) {
                    if (path in work) newTree[path] = work[path]!;
                }
                worktreeSide = true;
            }
        } else if (staged) {
            oldTree = headTree;
            newTree = index;
        } else {
            oldTree = index;
            newTree = {};
            for (const path of Object.keys(index)) {
                if (path in work) newTree[path] = work[path]!;
            }
            worktreeSide = true;
        }

        if (args.flags.R !== undefined) [oldTree, newTree] = [newTree, oldTree];

        // Restrict to the requested paths.
        let paths = [...new Set([...Object.keys(oldTree), ...Object.keys(newTree)])]
            .filter(p => oldTree[p] !== newTree[p])
            .sort();
        if (pathArgs.length > 0) {
            const known = new Set([...Object.keys(oldTree), ...Object.keys(newTree), ...Object.keys(work)]);
            const selected = new Set<string>();
            for (const spec of pathArgs) {
                const matched = matchPathspec(context, spec, known);
                if (matched.length === 0 && dashDash === -1) {
                    return [
                        `fatal: ambiguous argument '${spec}': unknown revision or path not in the working tree.`,
                        "Use '--' to separate paths from revisions, like this:",
                        "'git <command> [<revision>...] -- [<file>...]'",
                    ];
                }
                matched.forEach(p => selected.add(p));
            }
            paths = paths.filter(p => selected.has(p));
        }

        const unmerged = worktreeSide && !staged && revs.length === 0 ? repo.getUnmergedPaths() : [];
        const quiet =
            args.flags.s !== undefined || args.flags.quiet !== undefined || args.flags["no-patch"] !== undefined;

        const stat = repo.treeStat(oldTree, newTree);
        stat.files = stat.files.filter(f => paths.includes(f.path));

        const output: string[] = [];
        if (args.flags["name-only"] !== undefined) {
            output.push(...paths.map(p => displayPath(context, p)));
        } else if (args.flags["name-status"] !== undefined) {
            output.push(...stat.files.map(f => `${f.status}\t${displayPath(context, f.path)}`));
        } else if (args.flags.numstat !== undefined) {
            output.push(...stat.files.map(f => `${f.insertions}\t${f.deletions}\t${f.path}`));
        } else if (args.flags.shortstat !== undefined) {
            if (stat.files.length > 0) output.push(shortStat(stat));
        } else if (args.flags.stat !== undefined) {
            output.push(...diffStatLines(stat));
        } else if (!quiet) {
            for (const path of unmerged) {
                const entry = repo.getUnmergedEntry(path);
                output.push(`diff --cc ${path}`);
                const current = work[path];
                output.push(...fileDiff(path, entry?.ours, current).slice(1));
            }
            for (const path of paths) {
                if (unmerged.includes(path)) continue;
                output.push(...fileDiff(path, oldTree[path], newTree[path]));
            }
        }

        // Real Git prints nothing when there is nothing to compare, and that is kept — but silence
        // is indistinguishable from a broken command when you are learning, so a hint explains why.
        if (output.length === 0 && !quiet && revs.length === 0 && pathArgs.length === 0) {
            return this.explainEmptyDiff(repo, staged);
        }
        return output;
    }

    /** Why `git diff` had nothing to say, in terms of what the player can see on screen. */
    private explainEmptyDiff(repo: GitRepository, isStaged: boolean): string[] {
        const entries = repo.statusEntries();
        const untracked = entries.filter(e => e.worktree === "?").length;
        const staged = entries.filter(e => e.index !== " " && e.index !== "U").length;

        if (isStaged) {
            return staged > 0
                ? [hint("Nothing staged differs from the last commit.")]
                : [
                      hint("Nothing is staged, so there is nothing to compare."),
                      hint("Stage something with 'git add <file>', then try again."),
                  ];
        }

        if (staged > 0) {
            return [
                hint("Your changes are already staged, so 'git diff' (working tree vs staging area) is empty."),
                hint("Run 'git diff --staged' to see what will be committed."),
            ];
        }

        if (untracked > 0) {
            return [
                hint(`No tracked changes. Git can see ${untracked} untracked file${untracked === 1 ? "" : "s"},`),
                hint("but an untracked file has no committed version to compare against — that is why"),
                hint("it shows no diff. Run 'git add <file>' first, then 'git diff --staged'."),
            ];
        }

        return [hint("No changes. Your files match the last commit.")];
    }
}
