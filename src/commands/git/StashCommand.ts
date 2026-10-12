import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { fileDiff } from "~/models/git/diff";
import { GitRepository } from "~/models/GitRepository";
import { unknownFlagError } from "../base/GitErrors";
import { diffStatLines, matchPathspec, requireRepository } from "../helpers/gitFormat";
import { longStatus } from "../helpers/statusFormat";

export class StashCommand implements Command {
    name = "git stash";
    description = "Stash the changes in a dirty working directory away";
    usage =
        "git stash [push [-u] [-m <message>] | list | show [-p] [<stash>] | pop | apply | drop | clear | branch <name>]";
    examples = [
        "git stash",
        'git stash push -m "half-done login"',
        "git stash -u",
        "git stash list",
        "git stash show -p",
        "git stash pop",
        "git stash apply stash@{1}",
        "git stash drop",
        "git stash branch experiment",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "u",
            "include-untracked",
            "a",
            "all",
            "q",
            "quiet",
            "p",
            "patch",
            "k",
            "keep-index",
            "no-keep-index",
            "index",
            "stat",
        ],
        value: ["m", "message"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const [sub = "push", ...rest] = args.positionalArgs;
        const quiet = args.flags.q !== undefined || args.flags.quiet !== undefined;

        switch (sub) {
            case "push":
                return this.push(context, args, rest, quiet);
            case "save":
                return this.push(context, args, [], quiet, rest.join(" ") || undefined);
            case "list":
                return repo.getStashEntries().map((entry, i) => `stash@{${i}}: ${entry.message}`);
            case "show":
                return this.show(context, args, rest[0]);
            case "pop":
            case "apply":
                return this.apply(context, sub, rest[0], args.flags.index !== undefined, quiet);
            case "drop": {
                const n = this.parseRef(rest[0]);
                if (n === null) return [`error: ${rest[0]} is not a valid reference`];
                if (repo.getStashEntries().length === 0) return ["No stash entries found."];
                const dropped = repo.dropStash(n);
                if (!dropped) return [`error: stash@{${n}} is not a valid reference`];
                return quiet ? [] : [`Dropped stash@{${n}} (${this.shortId(dropped.base, dropped.message)})`];
            }
            case "clear":
                repo.clearStash();
                return [];
            case "branch":
                return this.branch(context, rest[0], rest[1]);
            default:
                // `git stash -- <paths>` or `git stash <paths>` is push with a pathspec.
                if (!["list", "show"].includes(sub)) {
                    return this.push(context, args, args.positionalArgs, quiet);
                }
                return [`error: unknown subcommand: '${sub}'`, `usage: ${this.usage}`];
        }
    }

    private parseRef(ref: string | undefined): number | null {
        if (ref === undefined) return 0;
        const match = /^(?:stash@\{(\d+)\}|(\d+))$/.exec(ref);
        if (!match) return null;
        return parseInt(match[1] ?? match[2]!, 10);
    }

    private shortId(base: string, message: string): string {
        // The stash commit's id, abbreviated: derive one stable per entry.
        let h = 0;
        for (const ch of base + message) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
        return h.toString(16).padStart(8, "0").substring(0, 7);
    }

    private push(
        context: CommandContext,
        args: CommandArgs,
        pathspecs: string[],
        quiet: boolean,
        legacyMessage?: string,
    ): string[] {
        const repo = context.gitRepository;
        if (repo.getHeadCommitId() === null) return ["You do not have the initial commit yet"];
        if (repo.hasMergeConflicts()) {
            return [...repo.getUnmergedPaths().map(p => `${p}: needs merge`), "error: could not write index"];
        }

        const message =
            legacyMessage ??
            (typeof args.flags.m === "string"
                ? args.flags.m
                : typeof args.flags.message === "string"
                  ? args.flags.message
                  : undefined);
        const includeUntracked =
            args.flags.u !== undefined ||
            args.flags["include-untracked"] !== undefined ||
            args.flags.a !== undefined ||
            args.flags.all !== undefined;
        const keepIndex = args.flags.k !== undefined || args.flags["keep-index"] !== undefined;

        let paths: string[] | undefined;
        if (pathspecs.length > 0) {
            const candidates = new Set([...Object.keys(repo.readWorkingTree()), ...Object.keys(repo.getIndex())]);
            paths = [];
            for (const spec of pathspecs) {
                const matched = matchPathspec(context, spec, candidates);
                if (matched.length === 0) {
                    return [
                        `error: pathspec '${spec}' did not match any file(s) known to git`,
                        "Did you forget to 'git add'?",
                    ];
                }
                paths.push(...matched);
            }
        }

        const saved = repo.stashSave(message, { includeUntracked, keepIndex, paths });
        if (!saved) return ["No local changes to save"];
        const entry = repo.getStashEntries()[0]!;
        return quiet ? [] : [`Saved working directory and index state ${entry.message}`];
    }

    private show(context: CommandContext, args: CommandArgs, ref: string | undefined): string[] {
        const repo = context.gitRepository;
        const entries = repo.getStashEntries();
        if (entries.length === 0) return ["No stash entries found."];
        const n = this.parseRef(ref);
        const entry = n === null ? undefined : entries[n];
        if (!entry) return [`error: ${ref} is not a valid reference`];

        const baseTree = repo.treeOf(entry.base);
        const after = { ...entry.worktree, ...(args.flags.u !== undefined ? entry.untracked : {}) };
        if (args.flags.p !== undefined || args.flags.patch !== undefined) {
            const paths = [...new Set([...Object.keys(baseTree), ...Object.keys(after)])]
                .filter(p => baseTree[p] !== after[p])
                .sort();
            return paths.flatMap(p => fileDiff(p, baseTree[p], after[p]));
        }
        return diffStatLines(repo.treeStat(baseTree, after));
    }

    private apply(
        context: CommandContext,
        mode: "pop" | "apply",
        ref: string | undefined,
        restoreIndex: boolean,
        quiet: boolean,
    ): string[] {
        const repo = context.gitRepository;
        const entries = repo.getStashEntries();
        if (entries.length === 0) return ["No stash entries found."];
        const n = this.parseRef(ref);
        if (n === null || !entries[n]) return [`error: ${ref} is not a valid reference`];
        const entry = entries[n]!;

        const result = repo.applyStash(n, { restoreIndex });
        if (!result.ok) return result.error;

        const lines: string[] = [];
        if (result.conflicts.length > 0) {
            for (const conflict of result.conflicts) {
                lines.push(`Auto-merging ${conflict.path}`, ...repo.conflictLines(conflict));
            }
            lines.push(...longStatus(context));
            lines.push("The stash entry is kept in case you need it again.");
            return lines;
        }

        if (!quiet) lines.push(...longStatus(context));
        if (mode === "pop") {
            repo.dropStash(n);
            if (!quiet) lines.push(`Dropped refs/stash@{${n}} (${this.shortId(entry.base, entry.message)})`);
        }
        return lines;
    }

    private branch(context: CommandContext, name: string | undefined, ref: string | undefined): string[] {
        const repo = context.gitRepository;
        if (!name) return ["fatal: No branch name specified"];
        const entries = repo.getStashEntries();
        if (entries.length === 0) return ["No stash entries found."];
        const n = this.parseRef(ref);
        if (n === null || !entries[n]) return [`error: ${ref} is not a valid reference`];
        if (GitRepository.branchNameProblem(name)) return [`fatal: '${name}' is not a valid branch name`];
        if (repo.getBornBranches().includes(name)) return [`fatal: a branch named '${name}' already exists`];

        const entry = entries[n]!;
        repo.createBranch(name, entry.base);
        const moved = repo.moveHead({ branch: name });
        if (!moved.ok) {
            repo.deleteBranch(name);
            return moved.error;
        }
        const result = repo.applyStash(n, { restoreIndex: true });
        if (!result.ok) return result.error;
        repo.dropStash(n);
        return [
            `Switched to a new branch '${name}'`,
            ...longStatus(context),
            `Dropped refs/stash@{${n}} (${this.shortId(entry.base, entry.message)})`,
        ];
    }
}
