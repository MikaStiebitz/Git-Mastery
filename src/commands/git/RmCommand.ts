import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { hint, unknownFlagError } from "../base/GitErrors";
import { displayPath, matchPathspec, requireRepository, toRepoPath } from "../helpers/gitFormat";

export class RmCommand implements Command {
    name = "git rm";
    description = "Remove files from the working tree and from the index";
    usage = "git rm [-f | --force] [-n] [-r] [--cached] [--ignore-unmatch] [--quiet] [--] <pathspec>...";
    examples = ["git rm file.txt", "git rm --cached secrets.env", "git rm -r old-folder", "git rm '*.log'"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["cached", "r", "f", "force", "q", "quiet", "n", "dry-run", "ignore-unmatch"],
        value: [],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        if (args.positionalArgs.length === 0) return ["fatal: No pathspec was given. Which files should I remove?"];

        const flags = args.flags;
        const cached = flags.cached !== undefined;
        const recursive = flags.r !== undefined;
        const force = flags.f !== undefined || flags.force !== undefined;
        const dryRun = flags.n !== undefined || flags["dry-run"] !== undefined;
        const quiet = flags.q !== undefined || flags.quiet !== undefined;

        const index = repo.getIndex();
        const headTree = repo.getHeadTree();
        const work = repo.readWorkingTree();
        const tracked = new Set([...Object.keys(index), ...repo.getUnmergedPaths()]);

        const paths = new Set<string>();
        for (const spec of args.positionalArgs) {
            const matched = matchPathspec(context, spec, tracked);
            if (matched.length === 0) {
                if (flags["ignore-unmatch"] !== undefined) continue;
                const lines = [`fatal: pathspec '${spec}' did not match any files`];
                const repoPath = toRepoPath(context, spec);
                if (repoPath !== null && repoPath in work) {
                    lines.push(
                        hint(`'${spec}' is not tracked by Git, so there is nothing to remove from the repository.`),
                    );
                    lines.push(hint(`To delete the file itself, use: rm ${spec}`));
                }
                return lines;
            }
            const repoPath = toRepoPath(context, spec);
            // A wildcard matches files wherever they are; only a directory name needs -r.
            const isDirectory = !/[*?[]/.test(spec) && (matched.length > 1 || matched[0] !== repoPath);
            if (isDirectory && !recursive) return [`fatal: not removing '${spec}' recursively without -r`];
            matched.forEach(p => paths.add(p));
        }

        // Git refuses to throw away changes that exist nowhere else, unless forced.
        if (!force) {
            const stagedAndModified: string[] = [];
            const localMods: string[] = [];
            const stagedOnly: string[] = [];
            for (const path of paths) {
                if (repo.getUnmergedEntry(path)) continue;
                // A file that is already gone from the working tree has nothing left to lose.
                if (!(path in work)) continue;
                const inHead = headTree[path];
                const inIndex = index[path];
                const inWork = work[path];
                const indexDiffers = inIndex !== inHead;
                const workDiffers = inWork !== undefined && inWork !== inIndex;
                if (indexDiffers && workDiffers) stagedAndModified.push(path);
                else if (!cached && workDiffers) localMods.push(path);
                else if (!cached && indexDiffers) stagedOnly.push(path);
            }
            const refuse = (title: string, list: string[], advice: string) => [
                `error: the following file${list.length === 1 ? " has" : "s have"} ${title}:`,
                ...list.map(p => `    ${displayPath(context, p)}`),
                advice,
            ];
            // Git reports every kind of problem at once, then gives up.
            const errors = [
                ...(stagedAndModified.length > 0
                    ? refuse(
                          "staged content different from both the\nfile and the HEAD",
                          stagedAndModified,
                          "(use -f to force removal)",
                      )
                    : []),
                ...(stagedOnly.length > 0
                    ? refuse(
                          "changes staged in the index",
                          stagedOnly,
                          "(use --cached to keep the file, or -f to force removal)",
                      )
                    : []),
                ...(localMods.length > 0
                    ? refuse(
                          "local modifications",
                          localMods,
                          "(use --cached to keep the file, or -f to force removal)",
                      )
                    : []),
            ];
            if (errors.length > 0) return errors;
        }

        const output: string[] = [];
        for (const path of [...paths].sort()) {
            if (!quiet) output.push(`rm '${path}'`);
            if (!dryRun) repo.removePath(path, cached);
        }
        return output;
    }
}
