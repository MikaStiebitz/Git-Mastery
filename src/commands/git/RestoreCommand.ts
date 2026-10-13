import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import type { Tree } from "~/models/GitRepository";
import { unknownFlagError } from "../base/GitErrors";
import { matchPathspec, requireRepository } from "../helpers/gitFormat";

export class RestoreCommand implements Command {
    name = "git restore";
    description = "Restore working tree files";
    usage = "git restore [<options>] [--source=<tree>] [--staged] [--worktree] [--] <pathspec>...";
    examples = [
        "git restore file.txt",
        "git restore --staged file.txt",
        "git restore --staged --worktree file.txt",
        "git restore --source=HEAD~2 file.txt",
        "git restore .",
        "git restore --theirs conflicted.txt",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "staged",
            "S",
            "worktree",
            "W",
            "p",
            "patch",
            "q",
            "quiet",
            "ours",
            "theirs",
            "merge",
            "m",
            "overlay",
            "no-overlay",
            "ignore-unmerged",
        ],
        value: ["s", "source"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const flags = args.flags;
        if (flags.p !== undefined || flags.patch !== undefined) {
            return ["error: interactive restore needs a real terminal and is not available here."];
        }
        if (args.positionalArgs.length === 0) return ["fatal: you must specify path(s) to restore"];

        const staged = flags.staged !== undefined || flags.S !== undefined;
        const worktree = flags.worktree !== undefined || flags.W !== undefined || !staged;
        const side = flags.ours !== undefined ? "ours" : flags.theirs !== undefined ? "theirs" : null;

        // Source: --source, else HEAD for --staged, else the index.
        const sourceSpec =
            typeof flags.source === "string" ? flags.source : typeof flags.s === "string" ? flags.s : undefined;
        let source: Tree;
        if (sourceSpec !== undefined) {
            const id = repo.resolveCommit(sourceSpec);
            if (!id) return [`fatal: could not resolve ${sourceSpec}`];
            source = repo.treeOf(id);
        } else if (staged) {
            if (repo.getHeadCommitId() === null) return ["fatal: could not resolve HEAD"];
            source = repo.getHeadTree();
        } else {
            source = repo.getIndex();
        }

        const index = repo.getIndex();
        const unmergedPaths = repo.getUnmergedPaths();
        const candidates = new Set([...Object.keys(source), ...Object.keys(index), ...unmergedPaths]);

        const paths = new Set<string>();
        for (const spec of args.positionalArgs) {
            const matched = matchPathspec(context, spec, candidates);
            if (matched.length === 0) return [`error: pathspec '${spec}' did not match any file(s) known to git`];
            matched.forEach(p => paths.add(p));
        }

        for (const path of paths) {
            const conflict = repo.getUnmergedEntry(path);
            if (conflict && worktree && !staged && sourceSpec === undefined) {
                if (!side) {
                    if (flags["ignore-unmerged"] !== undefined) continue;
                    return [`error: path '${path}' is unmerged`];
                }
                const content = conflict[side];
                if (content === undefined)
                    return [`error: path '${path}' does not have ${side === "ours" ? "our" : "their"} version`];
                context.fileSystem.writeFile(repo.toFsPath(path), content);
                continue;
            }

            // Without the overlay mode, a path missing from the source is removed — but untracked
            // files are never touched by a worktree restore from the index.
            const tracked = path in index || path in source;
            if (!tracked) continue;

            if (staged) {
                if (sourceSpec !== undefined) {
                    const id = repo.resolveCommit(sourceSpec)!;
                    repo.unstagePath(path, id);
                } else {
                    repo.unstagePath(path);
                }
            }
            if (worktree) repo.restoreWorkingPath(path, source);
        }

        return [];
    }
}
