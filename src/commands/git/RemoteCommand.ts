import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { hint, unknownFlagError } from "../base/GitErrors";
import { requireRepository } from "../helpers/gitFormat";
import { fetchReport } from "./FetchCommand";

export class RemoteCommand implements Command {
    name = "git remote";
    description = "Manage set of tracked repositories";
    usage =
        "git remote [-v | --verbose] | add <name> <url> | rename <old> <new> | remove <name> | set-url <name> <url> | get-url <name> | show <name> | prune <name>";
    examples = [
        "git remote",
        "git remote -v",
        "git remote add origin https://github.com/user/repo.git",
        "git remote show origin",
        "git remote rename origin upstream",
        "git remote set-url origin git@github.com:user/repo.git",
        "git remote remove origin",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["v", "verbose", "f", "fetch", "n", "dry-run", "push", "all"],
        value: ["t", "track", "m", "master"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const [sub, ...rest] = args.positionalArgs;
        const remotes = repo.getRemotes();
        const verbose = args.flags.v !== undefined || args.flags.verbose !== undefined;

        const noSuchRemote = (name: string) => [`error: No such remote: '${name}'`];

        switch (sub) {
            case undefined:
                if (verbose) {
                    return Object.entries(remotes).flatMap(([name, url]) => [
                        `${name}\t${url} (fetch)`,
                        `${name}\t${url} (push)`,
                    ]);
                }
                return Object.keys(remotes);

            case "add": {
                const [name, url] = rest;
                if (!name || !url) return ["usage: git remote add [<options>] <name> <url>"];
                if (remotes[name]) return [`error: remote ${name} already exists.`];
                if (!/^[A-Za-z0-9._-]+$/.test(name)) return [`fatal: '${name}' is not a valid remote name`];
                if (/[<>]/.test(url)) {
                    repo.addRemote(name, url);
                    return [
                        hint(`'${url}' looks like a placeholder — the < > mean "put your own value here".`),
                        hint(`Fix it with: git remote set-url ${name} https://github.com/user/repo.git`),
                    ];
                }
                repo.addRemote(name, url);
                if (args.flags.f !== undefined || args.flags.fetch !== undefined) {
                    return [`Updating ${name}`, ...fetchReport(repo, name, repo.fetch(name))];
                }
                return [];
            }

            case "remove":
            case "rm": {
                const [name] = rest;
                if (!name) return ["usage: git remote remove <name>"];
                if (!remotes[name]) return noSuchRemote(name);
                repo.removeRemote(name);
                return [];
            }

            case "rename": {
                const [oldName, newName] = rest;
                if (!oldName || !newName) return ["usage: git remote rename [--[no-]progress] <old> <new>"];
                if (!remotes[oldName]) return noSuchRemote(oldName);
                if (remotes[newName]) return [`error: remote ${newName} already exists.`];
                repo.renameRemote(oldName, newName);
                return [];
            }

            case "get-url": {
                const [name] = rest;
                if (!name) return ["usage: git remote get-url [--push] [--all] <name>"];
                if (!remotes[name]) return noSuchRemote(name);
                return [remotes[name]!];
            }

            case "set-url": {
                const [name, url] = rest;
                if (!name || !url) return ["usage: git remote set-url [--push] <name> <newurl> [<oldurl>]"];
                if (!remotes[name]) return noSuchRemote(name);
                repo.setRemoteUrl(name, url);
                return [];
            }

            case "show": {
                const names = rest.length > 0 ? rest : Object.keys(remotes);
                if (rest.length === 0) return Object.keys(remotes);
                const lines: string[] = [];
                for (const name of names) {
                    if (!remotes[name]) return noSuchRemote(name);
                    const serverBranches = repo.getRemoteBranches(name);
                    const tracking = repo.getRemoteTrackingRefs();
                    const branchNames = Object.keys(serverBranches).sort();
                    lines.push(`* remote ${name}`, `  Fetch URL: ${remotes[name]}`, `  Push  URL: ${remotes[name]}`);
                    lines.push(
                        `  HEAD branch: ${branchNames.includes("main") ? "main" : (branchNames[0] ?? "(unknown)")}`,
                    );
                    if (branchNames.length > 0) {
                        lines.push(branchNames.length === 1 ? "  Remote branch:" : "  Remote branches:");
                        branchNames.forEach(b =>
                            lines.push(
                                `    ${b} ${`${name}/${b}` in tracking ? "tracked" : "new (next fetch will store in remotes/" + name + ")"}`,
                            ),
                        );
                    }
                    const pulls = repo
                        .getBornBranches()
                        .map(b => [b, repo.getUpstream(b)] as const)
                        .filter(([, u]) => u?.remote === name);
                    if (pulls.length > 0) {
                        lines.push(
                            pulls.length === 1
                                ? "  Local branch configured for 'git pull':"
                                : "  Local branches configured for 'git pull':",
                        );
                        pulls.forEach(([b, u]) => lines.push(`    ${b} merges with remote ${u!.branch}`));
                        lines.push(
                            pulls.length === 1
                                ? "  Local ref configured for 'git push':"
                                : "  Local refs configured for 'git push':",
                        );
                        pulls.forEach(([b, u]) => {
                            const local = repo.getBranchTip(b);
                            const remoteTip = serverBranches[u!.branch];
                            const state = !remoteTip
                                ? "create"
                                : local === remoteTip
                                  ? "up to date"
                                  : local && repo.isAncestor(remoteTip, local)
                                    ? "fast-forwardable"
                                    : "local out of date";
                            lines.push(`    ${b} pushes to ${u!.branch} (${state})`);
                        });
                    }
                }
                return lines;
            }

            case "prune": {
                const [name] = rest;
                if (!name) return ["usage: git remote prune [<options>] <name>..."];
                if (!remotes[name]) return noSuchRemote(name);
                const pruned = repo.pruneTrackingRefs(name);
                if (pruned.length === 0) return [];
                return [`Pruning ${name}`, `URL: ${remotes[name]}`, ...pruned.map(ref => ` * [pruned] ${ref}`)];
            }

            case "update": {
                const lines: string[] = [];
                for (const name of Object.keys(remotes)) {
                    lines.push(`Fetching ${name}`, ...fetchReport(repo, name, repo.fetch(name)));
                }
                return lines;
            }

            default:
                return [`error: unknown subcommand: \`${sub}'`, `usage: ${this.usage}`];
        }
    }
}
