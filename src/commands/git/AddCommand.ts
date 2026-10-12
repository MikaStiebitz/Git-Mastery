import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { getAllFiles } from "~/lib/utils";
import { hint, pathSuggestionHints, unknownFlagError } from "../base/GitErrors";
import { displayPath, matchPathspec, requireRepository, toRepoPath } from "../helpers/gitFormat";

export class AddCommand implements Command {
    name = "git add";
    description = "Add file contents to the index";
    usage = "git add [<options>] [--] <pathspec>...";
    examples = ["git add file.txt", "git add .", "git add src/", "git add -A", "git add -u", "git add '*.js'"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "A",
            "all",
            "no-all",
            "ignore-removal",
            "p",
            "patch",
            "u",
            "update",
            "f",
            "force",
            "n",
            "dry-run",
            "i",
            "interactive",
            "v",
            "verbose",
            "ignore-errors",
            "intent-to-add",
            "N",
        ],
        value: [],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const all = args.flags.A !== undefined || args.flags.all !== undefined;
        const update = args.flags.u !== undefined || args.flags.update !== undefined;
        const force = args.flags.f !== undefined || args.flags.force !== undefined;
        const dryRun = args.flags.n !== undefined || args.flags["dry-run"] !== undefined;
        const verbose = args.flags.v !== undefined || args.flags.verbose !== undefined || dryRun;
        const ignoreRemoval = args.flags["ignore-removal"] !== undefined || args.flags["no-all"] !== undefined;

        if (
            args.flags.p !== undefined ||
            args.flags.patch !== undefined ||
            args.flags.i !== undefined ||
            args.flags.interactive !== undefined
        ) {
            return [
                "error: interactive staging needs a real terminal and is not available here.",
                hint("Stage whole files instead: git add <file>"),
            ];
        }

        let specs = args.positionalArgs;
        if (specs.length === 0) {
            if (!all && !update) {
                return ["Nothing specified, nothing added.", hint("Maybe you wanted to say 'git add .'?")];
            }
            // -A and -u without a pathspec work on the whole tree, not just the current directory.
            specs = [context.gitRepository.toFsPath("")];
        }

        const work = repo.readWorkingTree();
        const index = repo.getIndex();
        const unmerged = new Set(repo.getUnmergedPaths());
        const candidates = new Set([...Object.keys(work), ...Object.keys(index), ...unmerged]);

        const toStage = new Set<string>();
        const ignoredExplicit: string[] = [];

        for (const spec of specs) {
            const repoPath = toRepoPath(context, spec);
            if (repoPath === null) {
                return [`fatal: ${spec}: '${spec}' is outside repository at '${repo.getRepositoryRoot()}'`];
            }

            const matched = matchPathspec(context, spec, candidates);
            if (matched.length === 0) {
                return [
                    `fatal: pathspec '${spec}' did not match any files`,
                    ...pathSuggestionHints(spec, getAllFiles(context.fileSystem, context.currentDirectory)),
                ];
            }

            const isExactFile = matched.length === 1 && matched[0] === repoPath;
            for (const path of matched) {
                const tracked = path in index || unmerged.has(path);
                if (!tracked) {
                    if (update) continue;
                    if (repo.isIgnored(path) && !force) {
                        if (isExactFile) ignoredExplicit.push(path);
                        continue;
                    }
                }
                if (!(path in work) && ignoreRemoval) continue;
                toStage.add(path);
            }
        }

        if (ignoredExplicit.length > 0) {
            return [
                "The following paths are ignored by one of your .gitignore files:",
                ...ignoredExplicit.map(p => displayPath(context, p)),
                hint("Use -f if you really want to add them."),
                hint('Disable this message with "git config set advice.addIgnoredFile false"'),
            ];
        }

        const output: string[] = [];
        for (const path of [...toStage].sort()) {
            const inWork = path in work;
            const changed = unmerged.has(path) || (inWork ? index[path] !== work[path] : path in index);
            if (!changed) continue;
            if (verbose)
                output.push(inWork ? `add '${displayPath(context, path)}'` : `remove '${displayPath(context, path)}'`);
            if (!dryRun) repo.stagePath(path);
        }

        // Like real Git, a successful `git add` prints nothing (unless -v or -n).
        return output;
    }
}
