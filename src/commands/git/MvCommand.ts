import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { unknownFlagError } from "../base/GitErrors";
import { displayPath, requireRepository, toRepoPath } from "../helpers/gitFormat";

export class MvCommand implements Command {
    name = "git mv";
    description = "Move or rename a file, a directory, or a symlink";
    usage = "git mv [<options>] <source>... <destination>";
    examples = ["git mv old-name.txt new-name.txt", "git mv file.txt docs/", "git mv src lib"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["f", "force", "n", "dry-run", "k", "v", "verbose"],
        value: [],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const positional = args.positionalArgs;
        if (positional.length < 2) return [`usage: ${this.usage}`];

        const force = args.flags.f !== undefined || args.flags.force !== undefined;
        const dryRun = args.flags.n !== undefined || args.flags["dry-run"] !== undefined;
        const verbose = args.flags.v !== undefined || args.flags.verbose !== undefined || dryRun;
        const skipErrors = args.flags.k !== undefined;

        const destArg = positional[positional.length - 1]!;
        const sources = positional.slice(0, -1);
        const dest = toRepoPath(context, destArg);
        if (dest === null) return [`fatal: '${destArg}' is outside repository`];

        const index = repo.getIndex();
        const work = repo.readWorkingTree();
        // What exists is decided by the file system, as Git's lstat() does: an empty directory counts.
        const isDir = (path: string) =>
            path === "" || context.fileSystem.getDirectoryContents(repo.toFsPath(path)) !== null;
        const exists = (path: string) => path in work || isDir(path);
        const destIsDir = isDir(dest);
        if (sources.length > 1 && !destIsDir) return [`fatal: destination '${destArg}' is not a directory`];

        const moves: [string, string][] = [];
        const targets = new Set<string>();
        for (const srcArg of sources) {
            const src = toRepoPath(context, srcArg);
            const name = (src ?? srcArg).split("/").pop()!;
            const target = destIsDir ? (dest === "" ? name : `${dest}/${name}`) : dest;
            const shownDest = !destIsDir && destArg.endsWith("/") ? destArg : displayPath(context, target);
            const fail = (reason: string) => [
                `fatal: ${reason}, source=${src === null ? srcArg : displayPath(context, src)}, destination=${shownDest}`,
            ];
            const skip = (reason: string) => (skipErrors ? null : fail(reason));

            let problem: string[] | null = null;
            if (src === null || !exists(src)) {
                problem = skip("bad source");
            } else if (target === src || target.startsWith(src + "/")) {
                problem = skip("can not move directory into itself");
            } else if (isDir(src)) {
                if (exists(target)) {
                    problem = skip("destination already exists");
                } else {
                    const tracked = Object.keys(index).filter(p => p.startsWith(src + "/"));
                    if (tracked.length === 0) problem = skip("source directory is empty");
                    else for (const p of tracked) moves.push([p, target + p.substring(src.length)]);
                }
                if (problem) return problem;
                continue;
            } else if (!(src in index)) {
                problem = skip("not under version control");
            } else if (repo.getUnmergedEntry(src)) {
                problem = fail("conflicted");
            } else if (exists(target) && !force) {
                problem = skip("destination exists");
            } else if (targets.has(target)) {
                problem = skip("multiple sources for the same target");
            } else if (!destIsDir && destArg.endsWith("/")) {
                problem = skip("destination directory does not exist");
            } else if (!isDir(target.includes("/") ? target.substring(0, target.lastIndexOf("/")) : "")) {
                problem = skipErrors ? null : [`fatal: renaming '${srcArg}' failed: No such file or directory`];
            } else {
                targets.add(target);
                moves.push([src, target]);
                continue;
            }
            if (problem) return problem;
        }

        const output: string[] = [];
        for (const [from, to] of moves) {
            if (verbose) output.push(`Renaming ${from} to ${to}`);
            if (!dryRun) repo.movePath(from, to);
        }
        return output;
    }
}
