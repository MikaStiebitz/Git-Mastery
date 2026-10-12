import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { unknownFlagError } from "../base/GitErrors";
import { requireRepository, toRepoPath } from "../helpers/gitFormat";

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
        const isDir = (path: string) =>
            path === "" ||
            Object.keys(work).some(p => p.startsWith(path + "/")) ||
            Object.keys(index).some(p => p.startsWith(path + "/"));
        const destIsDir = isDir(dest) || destArg.endsWith("/");
        if (sources.length > 1 && !destIsDir) return [`fatal: destination '${destArg}' is not a directory`];

        const moves: [string, string][] = [];
        for (const srcArg of sources) {
            const src = toRepoPath(context, srcArg);
            const fail = (reason: string) => `fatal: ${reason}, source=${srcArg}, destination=${destArg}`;
            if (src === null || (!(src in work) && !(src in index) && !isDir(src))) {
                if (skipErrors) continue;
                return [fail("bad source")];
            }
            const name = src.split("/").pop()!;
            const target = destIsDir ? (dest === "" ? name : `${dest}/${name}`) : dest;

            if (isDir(src)) {
                const tracked = Object.keys(index).filter(p => p.startsWith(src + "/"));
                if (tracked.length === 0) {
                    if (skipErrors) continue;
                    return [fail("source directory is empty")];
                }
                if (isDir(target) && !force) return [fail("destination already exists")];
                for (const p of tracked) moves.push([p, target + p.substring(src.length)]);
                continue;
            }

            if (!(src in index)) {
                if (skipErrors) continue;
                return [fail("not under version control")];
            }
            if (repo.getUnmergedEntry(src)) return [fail("conflicted")];
            if (target in work && !force) {
                if (skipErrors) continue;
                return [fail("destination exists")];
            }
            if (target === src) return [fail("can not move directory into itself")];
            moves.push([src, target]);
        }

        const output: string[] = [];
        for (const [from, to] of moves) {
            if (verbose) output.push(`Renaming ${from} to ${to}`);
            if (!dryRun) repo.movePath(from, to);
        }
        return output;
    }
}
