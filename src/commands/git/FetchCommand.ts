import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import type { GitRepository } from "~/models/GitRepository";
import { hint, refSuggestionHints, unknownFlagError } from "../base/GitErrors";
import { requireRepository } from "../helpers/gitFormat";

/** "From <url>" plus one line per updated ref, as `git fetch` (and `git pull`) prints them. */
export function fetchReport(
    repo: GitRepository,
    remote: string,
    updates: { ref: string; from: string | null; to: string; forced: boolean }[],
    options: { branch?: string; pruned?: string[] } = {},
): string[] {
    const url = repo.getRemotes()[remote] ?? remote;
    const lines: string[] = [];
    const pruned = options.pruned ?? [];
    if (updates.length === 0 && !options.branch && pruned.length === 0) return lines;

    const objects = updates.reduce(
        (sum, u) => sum + repo.revList([u.to], u.from ? [u.from] : Object.values(repo.getBranchHeads())).length,
        0,
    );
    if (objects > 0) {
        const total = objects * 3;
        lines.push(
            `remote: Enumerating objects: ${total}, done.`,
            `remote: Counting objects: 100% (${total}/${total}), done.`,
            `remote: Compressing objects: 100% (${objects}/${objects}), done.`,
            `remote: Total ${objects * 2} (delta 0), reused ${objects * 2} (delta 0), pack-reused 0`,
            `Unpacking objects: 100% (${objects * 2}/${objects * 2}), ${objects * 290} bytes | ${objects * 97}.00 KiB/s, done.`,
        );
    }
    lines.push(`From ${url.replace(/\.git$/, "")}`);

    const width = Math.max(10, ...updates.map(u => u.ref.length - remote.length - 1), (options.branch ?? "").length);
    if (options.branch) {
        lines.push(` * branch            ${options.branch.padEnd(width)} -> FETCH_HEAD`);
    }
    for (const update of updates) {
        const name = update.ref.substring(remote.length + 1);
        if (!update.from) {
            lines.push(` * [new branch]      ${name.padEnd(width)} -> ${update.ref}`);
        } else if (update.forced) {
            lines.push(
                ` + ${repo.abbrev(update.from)}...${repo.abbrev(update.to)} ${name.padEnd(width)} -> ${update.ref}  (forced update)`,
            );
        } else {
            lines.push(
                `   ${repo.abbrev(update.from)}..${repo.abbrev(update.to)}  ${name.padEnd(width)} -> ${update.ref}`,
            );
        }
    }
    for (const ref of pruned) {
        lines.push(` - [deleted]         (none)     -> ${ref}`);
    }
    return lines;
}

/** Git's error for a remote name that is not configured. */
export function unknownRemote(repo: GitRepository, remote: string): string[] {
    const configured = Object.keys(repo.getRemotes());
    return [
        `fatal: '${remote}' does not appear to be a git repository`,
        "fatal: Could not read from remote repository.",
        "",
        "Please make sure you have the correct access rights",
        "and the repository exists.",
        ...refSuggestionHints(remote, configured),
        ...(configured.length > 0 ? [hint(`Configured remotes: ${configured.join(", ")}`)] : []),
    ];
}

export class FetchCommand implements Command {
    name = "git fetch";
    description = "Download objects and refs from another repository";
    usage = "git fetch [<options>] [<repository> [<refspec>...]]";
    examples = ["git fetch", "git fetch origin", "git fetch origin main", "git fetch --all", "git fetch --prune"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "all",
            "p",
            "prune",
            "t",
            "tags",
            "q",
            "quiet",
            "v",
            "verbose",
            "n",
            "no-tags",
            "dry-run",
            "f",
            "force",
            "multiple",
        ],
        value: ["depth", "j", "jobs"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const remotes = Object.keys(repo.getRemotes());
        const prune = args.flags.p !== undefined || args.flags.prune !== undefined;
        const quiet = args.flags.q !== undefined || args.flags.quiet !== undefined;

        let targets: string[];
        let branch: string | undefined;
        if (args.flags.all !== undefined) {
            targets = remotes;
        } else {
            const branchName = repo.getBranchName();
            const upstream = branchName ? repo.getUpstream(branchName) : null;
            const remote =
                args.positionalArgs[0] ?? upstream?.remote ?? (remotes.includes("origin") ? "origin" : remotes[0]);
            if (!remote) {
                return [
                    "fatal: No remote repository specified.  Please, specify either a URL or a",
                    "remote name from which new revisions should be fetched.",
                ];
            }
            if (!remotes.includes(remote)) return unknownRemote(repo, remote);
            targets = [remote];
            branch = args.positionalArgs[1];
            if (branch && !(branch in repo.getRemoteBranches(remote)))
                return [`fatal: couldn't find remote ref ${branch}`];
        }

        const lines: string[] = [];
        for (const remote of targets) {
            if (args.flags.all !== undefined && !quiet) lines.push(`Fetching ${remote}`);
            const pruned = prune ? repo.pruneTrackingRefs(remote) : [];
            const updates = repo.fetch(remote, branch);
            lines.push(...fetchReport(repo, remote, updates, { branch, pruned }));
        }
        return quiet ? [] : lines;
    }
}
