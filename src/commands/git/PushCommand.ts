import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import type { GitRepository } from "~/models/GitRepository";
import { hint, refSuggestionHints, unknownFlagError } from "../base/GitErrors";
import { requireRepository } from "../helpers/gitFormat";

type RefUpdate = {
    line: string;
    ok: boolean;
    rejected?: "fetch first" | "non-fast-forward" | "stale info" | "already exists";
};

export class PushCommand implements Command {
    name = "git push";
    description = "Update remote refs along with associated objects";
    usage = "git push [<options>] [<repository> [<refspec>...]]";
    examples = [
        "git push",
        "git push origin main",
        "git push -u origin feature",
        "git push --force-with-lease",
        "git push origin --delete old-branch",
        "git push origin v1.0.0",
        "git push --tags",
        "git push origin HEAD:refs/heads/review",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "u",
            "set-upstream",
            "f",
            "force",
            "force-with-lease",
            "all",
            "branches",
            "tags",
            "follow-tags",
            "delete",
            "d",
            "n",
            "dry-run",
            "q",
            "quiet",
            "v",
            "verbose",
            "atomic",
            "prune",
            "mirror",
            "porcelain",
            "no-verify",
        ],
        value: ["repo", "o", "push-option"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const flags = args.flags;
        const setUpstream = flags.u !== undefined || flags["set-upstream"] !== undefined;
        const force = flags.f !== undefined || flags.force !== undefined;
        const forceWithLease = flags["force-with-lease"] !== undefined;
        const deleteMode = flags.d !== undefined || flags.delete !== undefined;
        const dryRun = flags.n !== undefined || flags["dry-run"] !== undefined;
        const quiet = flags.q !== undefined || flags.quiet !== undefined;

        const remotes = repo.getRemotes();
        const branch = repo.getBranchName();
        const upstream = branch ? repo.getUpstream(branch) : null;

        let remote = args.positionalArgs[0];
        const refspecs = args.positionalArgs.slice(1);

        if (remote === undefined) {
            remote =
                upstream?.remote ??
                (Object.keys(remotes).length === 1 ? Object.keys(remotes)[0] : remotes.origin ? "origin" : undefined);
            if (remote === undefined) {
                return [
                    "fatal: No configured push destination.",
                    "Either specify the URL from the command-line or configure a remote repository using",
                    "",
                    "    git remote add <name> <url>",
                    "",
                    "and then push using the remote name",
                    "",
                    "    git push <name>",
                    "",
                    hint("A remote is a saved nickname for a repository URL."),
                ];
            }
        }

        // Git treats an unknown remote name as a URL and fails to reach it, so that is the error it
        // prints; the hints explain what a remote is and how to add one.
        if (!remotes[remote]) {
            const configured = Object.keys(remotes);
            return [
                `fatal: '${remote}' does not appear to be a git repository`,
                "fatal: Could not read from remote repository.",
                "",
                "Please make sure you have the correct access rights",
                "and the repository exists.",
                ...refSuggestionHints(remote, configured),
                hint("A remote is a saved nickname for a repository URL."),
                hint(`Add one with: git remote add ${remote} https://github.com/user/repo.git`),
                ...(configured.length > 0 ? [hint(`Configured remotes: ${configured.join(", ")}`)] : []),
            ];
        }
        const url = remotes[remote]!;

        const updates: RefUpdate[] = [];
        const tracked: string[] = [];
        let objects = 0;

        const pushBranch = (src: string, dst: string, forced: boolean): string[] | null => {
            const localId = repo.resolveCommit(src);
            if (!localId) {
                return [
                    `error: src refspec ${src} does not match any`,
                    `error: failed to push some refs to '${url}'`,
                    ...refSuggestionHints(src, repo.getBornBranches()),
                ];
            }
            if (dryRun) {
                updates.push({ line: ` * [new branch]      ${src} -> ${dst}`, ok: true });
                return null;
            }
            const result = repo.pushRef(remote!, localId, dst, { force: forced || force, forceWithLease });
            const label = `${src} -> ${dst}`;
            switch (result.kind) {
                case "up-to-date":
                    break;
                case "new":
                    objects += result.objects;
                    updates.push({ line: ` * [new branch]      ${label}`, ok: true });
                    break;
                case "updated":
                    objects += result.objects;
                    updates.push({
                        line: result.forced
                            ? ` + ${repo.abbrev(result.from)}...${repo.abbrev(result.to)} ${label} (forced update)`
                            : `   ${repo.abbrev(result.from)}..${repo.abbrev(result.to)}  ${label}`,
                        ok: true,
                    });
                    break;
                case "deleted":
                    updates.push({ line: ` - [deleted]         ${dst}`, ok: true });
                    break;
                case "rejected":
                    updates.push({
                        line: ` ! [rejected]        ${label} (${result.reason})`,
                        ok: false,
                        rejected: result.reason,
                    });
                    break;
                case "error":
                    return result.lines;
            }
            if (result.kind !== "rejected" && setUpstream && repo.getBornBranches().includes(src)) {
                repo.setUpstream(src, remote!, dst);
                tracked.push(`branch '${src}' set up to track '${remote}/${dst}'.`);
            }
            return null;
        };

        if (flags.tags !== undefined || flags["follow-tags"] !== undefined) {
            for (const tag of repo.getTagsList()) {
                const result = dryRun ? "new" : repo.pushTag(remote, tag, force);
                if (result === "new") updates.push({ line: ` * [new tag]         ${tag} -> ${tag}`, ok: true });
                if (result === "rejected")
                    updates.push({
                        line: ` ! [rejected]        ${tag} -> ${tag} (already exists)`,
                        ok: false,
                        rejected: "already exists",
                    });
            }
            if (flags.tags !== undefined && refspecs.length === 0)
                return this.report(repo, url, updates, tracked, objects, quiet);
        }

        if (deleteMode) {
            if (refspecs.length === 0) return ["fatal: --delete doesn't make sense without any refs"];
            for (const name of refspecs) {
                if (repo.hasTag(name) && !(name in repo.getRemoteBranches(remote))) {
                    if (repo.deleteRemoteTag(remote, name))
                        updates.push({ line: ` - [deleted]         ${name}`, ok: true });
                    else
                        return [
                            `error: unable to delete '${name}': remote ref does not exist`,
                            `error: failed to push some refs to '${url}'`,
                        ];
                    continue;
                }
                const result = repo.pushRef(remote, null, name);
                if (result.kind === "error") return [...result.lines, `error: failed to push some refs to '${url}'`];
                updates.push({ line: ` - [deleted]         ${name}`, ok: true });
            }
            return this.report(repo, url, updates, tracked, objects, quiet);
        }

        if (flags.all !== undefined || flags.branches !== undefined) {
            for (const name of repo.getBornBranches()) {
                const error = pushBranch(name, name, false);
                if (error) return error;
            }
            return this.report(repo, url, updates, tracked, objects, quiet);
        }

        if (refspecs.length === 0) {
            if (!branch) {
                return [
                    "fatal: You are not currently on a branch.",
                    "To push the history leading to the current (detached HEAD)",
                    "state now, use",
                    "",
                    `    git push ${remote} HEAD:<name-of-remote-branch>`,
                    "",
                ];
            }
            if (!upstream && !setUpstream) {
                return [
                    `fatal: The current branch ${branch} has no upstream branch.`,
                    "To push the current branch and set the remote as upstream, use",
                    "",
                    `    git push --set-upstream ${remote} ${branch}`,
                    "",
                    hint("An upstream is the remote branch this local branch is paired with."),
                    hint("Without it, a bare 'git push' does not know where to send your commits."),
                    hint("-u (short for --set-upstream) saves that pairing once, so every later"),
                    hint("'git push' and 'git pull' on this branch needs no arguments at all."),
                ];
            }
            if (repo.getHeadCommitId() === null) {
                return [
                    `error: src refspec ${branch} does not match any`,
                    `error: failed to push some refs to '${url}'`,
                ];
            }
            const error = pushBranch(branch, upstream?.branch ?? branch, false);
            if (error) return error;
            return this.report(repo, url, updates, tracked, objects, quiet);
        }

        for (const spec of refspecs) {
            const forced = spec.startsWith("+");
            const body = forced ? spec.substring(1) : spec;
            const [srcRaw, dstRaw] = body.includes(":") ? body.split(":") : [body, undefined];
            const src = srcRaw ?? "";
            if (src === "") {
                // ":branch" deletes it.
                const result = repo.pushRef(remote, null, (dstRaw ?? "").replace(/^refs\/heads\//, ""));
                if (result.kind === "error") return [...result.lines, `error: failed to push some refs to '${url}'`];
                updates.push({ line: ` - [deleted]         ${dstRaw}`, ok: true });
                continue;
            }
            // A tag name pushes the tag.
            if (repo.hasTag(src) && !repo.getBornBranches().includes(src) && dstRaw === undefined) {
                const result = repo.pushTag(remote, src, forced || force);
                if (result === "new") updates.push({ line: ` * [new tag]         ${src} -> ${src}`, ok: true });
                if (result === "rejected")
                    updates.push({
                        line: ` ! [rejected]        ${src} -> ${src} (already exists)`,
                        ok: false,
                        rejected: "already exists",
                    });
                continue;
            }
            const resolvedSrc = src === "HEAD" ? (branch ?? "HEAD") : src;
            const dst = (dstRaw ?? (src === "HEAD" ? (upstream?.branch ?? branch ?? "HEAD") : src)).replace(
                /^refs\/heads\//,
                "",
            );
            const error = pushBranch(resolvedSrc, dst, forced);
            if (error) return error;
        }
        return this.report(repo, url, updates, tracked, objects, quiet);
    }

    /** Git's transfer progress, the ref update table, then any errors and hints. */
    private report(
        repo: GitRepository,
        url: string,
        updates: RefUpdate[],
        tracked: string[],
        objects: number,
        quiet: boolean,
    ): string[] {
        if (updates.length === 0) return quiet ? [] : ["Everything up-to-date", ...tracked];

        const lines: string[] = [];
        const sentRefs = updates.some(u => u.ok && !u.line.includes("[deleted]") && !u.line.includes("[new tag]"));
        if (objects === 0 && sentRefs && !quiet) lines.push("Total 0 (delta 0), reused 0 (delta 0), pack-reused 0");
        if (objects > 0 && !quiet) {
            const total = objects * 3;
            const written = Math.max(1, objects * 2);
            const bytes = 180 + objects * 140;
            lines.push(
                `Enumerating objects: ${total}, done.`,
                `Counting objects: 100% (${total}/${total}), done.`,
                "Delta compression using up to 8 threads",
                `Compressing objects: 100% (${written}/${written}), done.`,
                `Writing objects: 100% (${written}/${written}), ${bytes} bytes | ${bytes}.00 KiB/s, done.`,
                `Total ${written} (delta 0), reused 0 (delta 0), pack-reused 0`,
            );
        }

        // GitHub suggests opening a pull request for a newly pushed branch.
        const github = /github\.com[/:]([^/]+\/[^/.]+)/.exec(url);
        const newBranch = updates.find(u => u.line.includes("[new branch]"));
        const newBranchName = newBranch ? (/-> (\S+)/.exec(newBranch.line)?.[1] ?? "") : "";
        if (github && newBranch && !quiet && !["main", "master"].includes(newBranchName)) {
            const name = newBranchName;
            lines.push(
                "remote: ",
                `remote: Create a pull request for '${name}' on GitHub by visiting:`,
                `remote:      https://github.com/${github[1]}/pull/new/${name}`,
                "remote: ",
            );
        }

        lines.push(`To ${url}`, ...updates.map(u => u.line));
        if (!quiet) lines.push(...tracked);

        const rejected = updates.filter(u => !u.ok);
        if (rejected.length > 0) {
            lines.push(`error: failed to push some refs to '${url}'`);
            const reason = rejected[0]!.rejected;
            if (reason === "fetch first") {
                lines.push(
                    "hint: Updates were rejected because the remote contains work that you do not",
                    "hint: have locally. This is usually caused by another repository pushing to",
                    "hint: the same ref. If you want to integrate the remote changes, use",
                    "hint: 'git pull' before pushing again.",
                    "hint: See the 'Note about fast-forwards' in 'git push --help' for details.",
                );
            } else if (reason === "non-fast-forward") {
                lines.push(
                    "hint: Updates were rejected because the tip of your current branch is behind",
                    "hint: its remote counterpart. If you want to integrate the remote changes,",
                    "hint: use 'git pull' before pushing again.",
                    "hint: See the 'Note about fast-forwards' in 'git push --help' for details.",
                );
            } else if (reason === "already exists") {
                lines.push("hint: Updates were rejected because the tag already exists in the remote.");
            } else if (reason === "stale info") {
                lines.push(
                    "hint: The remote branch changed since you last fetched it; run 'git fetch' and check before forcing.",
                );
            }
        }
        return lines;
    }
}
