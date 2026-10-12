import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { unknownFlagError } from "../base/GitErrors";
import { displayPath, headIsNowAt, matchPathspec, requireRepository, revisionError } from "../helpers/gitFormat";
import { ambiguousArgument } from "~/models/git/revision";

export class ResetCommand implements Command {
    name = "git reset";
    description = "Reset current HEAD to the specified state";
    usage = "git reset [--mixed | --soft | --hard | --merge | --keep] [-q] [<commit>]";
    examples = [
        "git reset --soft HEAD~1",
        "git reset HEAD~1",
        "git reset --hard HEAD~1",
        "git reset --hard HEAD@{1}",
        "git reset --hard ORIG_HEAD",
        "git reset file.txt",
        "git reset --hard origin/main",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["soft", "hard", "mixed", "merge", "keep", "q", "quiet", "p", "patch", "N", "intent-to-add"],
        value: [],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const modes = (["soft", "mixed", "hard", "merge", "keep"] as const).filter(m => args.flags[m] !== undefined);
        if (modes.length > 1) return [`fatal: options '--${modes[0]}' and '--${modes[1]}' cannot be used together`];
        const explicitMode = modes[0];
        const mode = explicitMode ?? "mixed";
        const quiet = args.flags.q !== undefined || args.flags.quiet !== undefined;

        if (args.flags.p !== undefined || args.flags.patch !== undefined) {
            return ["error: interactive reset needs a real terminal and is not available here."];
        }

        // Split the arguments into an optional commit and paths, the way Git disambiguates them.
        const dashDash = args.args.indexOf("--");
        const positional = args.positionalArgs;
        let revision: string | undefined;
        let paths: string[] = [];

        if (dashDash !== -1) {
            const afterCount = args.args.length - dashDash - 1;
            paths = positional.slice(positional.length - afterCount);
            const before = positional.slice(0, positional.length - afterCount);
            revision = before[0];
            if (before.length > 1) paths = [...before.slice(1), ...paths];
        } else if (positional.length > 0) {
            const first = positional[0]!;
            const isRevision = repo.resolveRevision(first).ok || (first === "HEAD" && repo.getHeadCommitId() === null);
            if (isRevision) {
                revision = first;
                paths = positional.slice(1);
            } else {
                const tracked = new Set([...Object.keys(repo.getIndex()), ...Object.keys(repo.getHeadTree())]);
                const allPaths = positional.every(p => matchPathspec(context, p, tracked).length > 0);
                if (!allPaths) {
                    // Not a commit and not a file: this is where `HEAD@{1}` used to fail (issue #109).
                    const resolution = repo.resolveRevision(first);
                    if (!resolution.ok && resolution.message && resolution.reason === "reflog-too-short") {
                        return resolution.message;
                    }
                    return revisionError(repo, first, "reset");
                }
                paths = positional;
            }
        }

        if (paths.length > 0) {
            if (explicitMode && explicitMode !== "mixed") return [`fatal: Cannot do ${explicitMode} reset with paths.`];
            return this.resetPaths(context, revision ?? "HEAD", paths, quiet);
        }

        const spec = revision ?? "HEAD";

        // On an unborn branch the only thing to reset is the index.
        if (repo.getHeadCommitId() === null) {
            if (spec !== "HEAD") return ambiguousArgument(spec, "reset");
            for (const path of Object.keys(repo.getIndex())) repo.unstagePath(path, null);
            return [];
        }

        const targetId = repo.resolveCommit(spec);
        if (!targetId) return revisionError(repo, spec, "reset");

        const result = repo.resetTo(targetId, mode, spec);
        if (!result.ok) return result.error;

        if (quiet) return [];
        if (mode === "hard" || mode === "merge" || mode === "keep") return [headIsNowAt(repo)];
        if (mode === "mixed") return this.unstagedAfterReset(context);
        return [];
    }

    /** `git reset [<commit>] -- <paths>`: copy those paths from the commit into the index only. */
    private resetPaths(context: CommandContext, spec: string, pathspecs: string[], quiet: boolean): string[] {
        const repo = context.gitRepository;
        const id = repo.getHeadCommitId() === null && spec === "HEAD" ? null : repo.resolveCommit(spec);
        if (id === undefined) return revisionError(repo, spec, "reset");

        const source = id ? repo.treeOf(id) : {};
        const candidates = new Set([
            ...Object.keys(repo.getIndex()),
            ...Object.keys(source),
            ...repo.getUnmergedPaths(),
        ]);
        const paths = new Set<string>();
        for (const pathspec of pathspecs) {
            const matched = matchPathspec(context, pathspec, candidates);
            if (matched.length === 0) {
                return [`error: pathspec '${pathspec}' did not match any file(s) known to git`];
            }
            matched.forEach(p => paths.add(p));
        }
        for (const path of paths) repo.unstagePath(path, id);
        return quiet ? [] : this.unstagedAfterReset(context);
    }

    private unstagedAfterReset(context: CommandContext): string[] {
        const changed = context.gitRepository
            .statusEntries()
            .filter(e => e.worktree === "M" || e.worktree === "D")
            .map(e => `${e.worktree}\t${displayPath(context, e.path)}`);
        return changed.length > 0 ? ["Unstaged changes after reset:", ...changed] : [];
    }
}
