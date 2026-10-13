import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { buildCommitGraph, type CommitData } from "~/lib/buildCommitGraph";
import { unknownFlagError } from "../base/GitErrors";
import { matchPathspec, requireRepository, revisionError, splitRevisionsAndPaths } from "../helpers/gitFormat";
import { defaultLogOptions, formatCommit, type DateMode } from "../helpers/logFormat";
import type { GitRepository } from "~/models/GitRepository";

export class LogCommand implements Command {
    name = "git log";
    description = "Show commit logs";
    usage = "git log [<options>] [<revision-range>] [[--] <path>...]";
    examples = [
        "git log",
        "git log --oneline",
        "git log --oneline --graph --all",
        "git log -3",
        "git log -p README.md",
        "git log --stat",
        "git log main..feature",
        "git log --author=Sam",
        'git log --grep="fix"',
        "git log -S password",
        'git log --format="%h %an %s"',
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "oneline",
            "graph",
            "all",
            "branches",
            "tags",
            "remotes",
            "decorate",
            "no-decorate",
            "stat",
            "shortstat",
            "p",
            "u",
            "patch",
            "no-patch",
            "name-only",
            "name-status",
            "reverse",
            "merges",
            "no-merges",
            "abbrev-commit",
            "no-abbrev-commit",
            "first-parent",
            "follow",
            "q",
            "i",
            "regexp-ignore-case",
            "relative-date",
            "all-match",
            "invert-grep",
            "topo-order",
            "date-order",
        ],
        value: [
            "n",
            "max-count",
            "author",
            "committer",
            "grep",
            "since",
            "after",
            "until",
            "before",
            "format",
            "pretty",
            "skip",
            "S",
            "G",
            "date",
        ],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;
        const flags = args.flags;

        // "-3" means "-n 3"; the parser sees it as an unknown short flag.
        let limit: number | undefined;
        for (const token of args.args) {
            const match = /^-(\d+)$/.exec(token);
            if (match) limit = parseInt(match[1]!, 10);
        }
        const unknownFlag = args.unknownFlags?.find(f => !/^-\d$/.test(f));
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const n = flags.n ?? flags["max-count"];
        if (typeof n === "string") limit = parseInt(n, 10);
        const skip = typeof flags.skip === "string" ? parseInt(flags.skip, 10) : 0;

        // Separate revisions from paths.
        const split = splitRevisionsAndPaths(
            context,
            { args: args.args, positionalArgs: args.positionalArgs.filter(p => !/^-\d+$/.test(p)) },
            "log",
        );
        if (!split.ok) return split.error;
        const revArgs = split.revs;
        const paths = split.paths;

        const includes: string[] = [];
        const excludes: string[] = [];
        const allPaths = new Set([...Object.keys(repo.readWorkingTree()), ...Object.keys(repo.getIndex())]);
        for (const commit of Object.values(repo.getAllCommits()))
            Object.keys(commit.tree).forEach(p => allPaths.add(p));

        for (const arg of revArgs) {
            const symmetric = /^(.*)\.\.\.(.*)$/.exec(arg);
            const range = /^(.*)\.\.(.*)$/.exec(arg);
            if (symmetric) {
                const a = repo.resolveCommit(symmetric[1] || "HEAD");
                const b = repo.resolveCommit(symmetric[2] || "HEAD");
                if (!a || !b) return revisionError(repo, !a ? symmetric[1] || "HEAD" : symmetric[2] || "HEAD", "log");
                includes.push(a, b);
                const base = repo.mergeBase(a, b);
                if (base) excludes.push(base);
            } else if (range) {
                const a = repo.resolveCommit(range[1] || "HEAD");
                const b = repo.resolveCommit(range[2] || "HEAD");
                if (!a || !b) return revisionError(repo, !a ? range[1] || "HEAD" : range[2] || "HEAD", "log");
                excludes.push(a);
                includes.push(b);
            } else if (arg.startsWith("^")) {
                const id = repo.resolveCommit(arg.substring(1));
                if (!id) return revisionError(repo, arg.substring(1), "log");
                excludes.push(id);
            } else {
                const id = repo.resolveCommit(arg);
                if (!id) return revisionError(repo, arg, "log");
                includes.push(id);
            }
        }

        if (flags.all !== undefined || flags.branches !== undefined)
            includes.push(...Object.values(repo.getBranchHeads()));
        if (flags.all !== undefined || flags.remotes !== undefined)
            includes.push(...Object.values(repo.getRemoteTrackingRefs()));
        if (flags.all !== undefined || flags.tags !== undefined) includes.push(...repo.getTags().values());
        if (flags.all !== undefined) {
            const head = repo.getHeadCommitId();
            if (head) includes.push(head);
        }

        if (includes.length === 0) {
            const head = repo.getHeadCommitId();
            if (!head) {
                if (revArgs.length > 0 || flags.all !== undefined) return [];
                return [`fatal: your current branch '${repo.getCurrentBranch()}' does not have any commits yet`];
            }
            includes.push(head);
        }

        const repoPaths = paths.flatMap(p => {
            const matched = matchPathspec(context, p, allPaths);
            return matched.length > 0 ? matched : [p];
        });

        let ids = repo.revList(includes, excludes, { firstParent: flags["first-parent"] !== undefined });
        ids = this.filter(repo, ids, args, repoPaths);
        if (flags.reverse !== undefined) ids.reverse();
        ids = ids.slice(skip, limit !== undefined ? skip + limit : undefined);

        if (flags.graph !== undefined) {
            return this.graph(repo, ids);
        }

        const options = defaultLogOptions();
        const pretty =
            typeof flags.pretty === "string"
                ? flags.pretty
                : typeof flags.format === "string"
                  ? `tformat:${flags.format}`
                  : undefined;
        if (flags.oneline !== undefined) {
            options.pretty = "oneline";
            options.abbrev = true;
        } else if (pretty) {
            options.pretty = pretty;
        }
        if (flags["abbrev-commit"] !== undefined) options.abbrev = true;
        if (flags["no-abbrev-commit"] !== undefined) options.abbrev = false;
        if (flags["no-decorate"] !== undefined) options.decorate = false;
        const date =
            typeof flags.date === "string" ? flags.date : flags["relative-date"] !== undefined ? "relative" : "default";
        options.date = (["relative", "iso", "short", "unix"].includes(date) ? date : "default") as DateMode;
        options.patch = flags.p !== undefined || flags.u !== undefined || flags.patch !== undefined;
        options.stat = flags.stat !== undefined;
        options.nameOnly = flags["name-only"] !== undefined;
        options.nameStatus = flags["name-status"] !== undefined;
        options.paths = repoPaths;

        const output: string[] = [];
        ids.forEach((id, index) => {
            const lines = formatCommit(repo, id, options);
            output.push(...lines);
            const blank =
                options.pretty !== "oneline" &&
                !options.pretty.startsWith("tformat:") &&
                !options.pretty.startsWith("format:");
            if (blank && index < ids.length - 1) output.push("");
        });
        return output;
    }

    private filter(repo: GitRepository, ids: string[], args: CommandArgs, paths: string[]): string[] {
        const flags = args.flags;
        const ignoreCase = flags.i !== undefined || flags["regexp-ignore-case"] !== undefined;
        const regex = (value: string) => {
            try {
                return new RegExp(value, ignoreCase ? "i" : "");
            } catch {
                return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ignoreCase ? "i" : "");
            }
        };
        const author = typeof flags.author === "string" ? regex(flags.author) : null;
        const committer = typeof flags.committer === "string" ? regex(flags.committer) : null;
        const grep = typeof flags.grep === "string" ? regex(flags.grep) : null;
        const invertGrep = flags["invert-grep"] !== undefined;
        const pickaxe = typeof flags.S === "string" ? flags.S : null;
        const pickaxeRegex = typeof flags.G === "string" ? regex(flags.G) : null;
        const since = this.parseDate(flags.since ?? flags.after);
        const until = this.parseDate(flags.until ?? flags.before);

        return ids.filter(id => {
            const commit = repo.getCommit(id)!;
            if (flags.merges !== undefined && commit.parents.length < 2) return false;
            if (flags["no-merges"] !== undefined && commit.parents.length > 1) return false;
            if (author && !author.test(`${commit.author} <${commit.email}>`)) return false;
            if (committer && !committer.test(`${commit.author} <${commit.email}>`)) return false;
            if (grep && grep.test(commit.message) === invertGrep) return false;
            if (since && commit.timestamp < since) return false;
            if (until && commit.timestamp > until) return false;

            const parentTree = commit.parents[0] ? repo.treeOf(commit.parents[0]) : {};
            const changed = [...new Set([...Object.keys(parentTree), ...Object.keys(commit.tree)])].filter(
                p => parentTree[p] !== commit.tree[p],
            );

            if (paths.length > 0) {
                const touches = changed.some(p =>
                    paths.some(spec => p === spec || p.startsWith(spec.replace(/\/$/, "") + "/")),
                );
                if (!touches) return false;
            }
            if (pickaxe !== null) {
                // -S: commits where the number of occurrences of the string changed.
                const count = (text: string | undefined) => (text ?? "").split(pickaxe).length - 1;
                if (!changed.some(p => count(parentTree[p]) !== count(commit.tree[p]))) return false;
            }
            if (pickaxeRegex) {
                const lines = (text: string | undefined) => new Set((text ?? "").split("\n"));
                const hit = changed.some(p => {
                    const before = lines(parentTree[p]);
                    const after = lines(commit.tree[p]);
                    return (
                        [...after].some(l => !before.has(l) && pickaxeRegex.test(l)) ||
                        [...before].some(l => !after.has(l) && pickaxeRegex.test(l))
                    );
                });
                if (!hit) return false;
            }
            return true;
        });
    }

    /** Accepts ISO dates and "<n> <unit>(s) ago" / "yesterday". */
    private parseDate(value: string | boolean | undefined): Date | null {
        if (typeof value !== "string") return null;
        const now = Date.now();
        const ago = /^(\d+)[ .]?(second|minute|hour|day|week|month|year)s?([ .]ago)?$/.exec(value.trim());
        if (ago) {
            const unit: Record<string, number> = {
                second: 1e3,
                minute: 6e4,
                hour: 3.6e6,
                day: 8.64e7,
                week: 6.048e8,
                month: 2.592e9,
                year: 3.1536e10,
            };
            return new Date(now - parseInt(ago[1]!, 10) * unit[ago[2]!]!);
        }
        if (value === "yesterday") return new Date(now - 8.64e7);
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    /** The interactive graph the terminal renders for --graph. */
    private graph(repo: GitRepository, ids: string[]): string[] {
        if (ids.length === 0) return [];
        const selected = new Set(ids);
        const commits: Record<string, CommitData> = {};
        for (const id of [...ids].reverse()) {
            const c = repo.getCommit(id)!;
            commits[id] = {
                message: c.message.split("\n")[0] ?? "",
                timestamp: c.timestamp,
                files: c.files,
                parents: c.parents.filter(p => selected.has(p)),
                isMergeCommit: c.parents.length > 1,
                author: c.author,
            };
        }
        const heads = Object.fromEntries(Object.entries(repo.getBranchHeads()).filter(([, id]) => selected.has(id)));
        const graph = buildCommitGraph(commits, heads, repo.getBranchName() ?? "HEAD");
        return [`__GIT_GRAPH__:${JSON.stringify(graph)}`];
    }
}
