import type { CommandContext } from "../base/Command";
import type { GitRepository, Tree, TreeStat } from "~/models/GitRepository";
import { resolvePath } from "~/lib/utils";
import { ambiguousArgument } from "~/models/git/revision";
import { fileDiff } from "~/models/git/diff";
import { notARepository } from "../base/GitErrors";

/**
 * Shared plumbing for the Git commands: repository checks, path conversion, revision errors and the
 * output formats Git reuses across commands (dates, commit summaries, diffstats).
 */

/** The error lines if the command is not run inside the repository, else null. */
export function requireRepository(context: CommandContext): string[] | null {
    const { gitRepository, currentDirectory } = context;
    if (!gitRepository.isInitialized() || !gitRepository.isInRepository(currentDirectory)) {
        return notARepository();
    }
    return null;
}

/** Repository-relative path for a path typed relative to the current directory, or null if outside. */
export function toRepoPath(context: CommandContext, arg: string): string | null {
    const absolute = resolvePath(arg, context.currentDirectory);
    return context.gitRepository.toRepoPath(absolute);
}

/** A repository path as Git prints it: relative to the directory the command runs in. */
export function displayPath(context: CommandContext, repoPath: string): string {
    const cwd = context.gitRepository.toRepoPath(context.currentDirectory) ?? "";
    if (cwd === "") return repoPath;
    const from = cwd.split("/");
    const to = repoPath.split("/");
    let common = 0;
    while (common < from.length && common < to.length - 1 && from[common] === to[common]) common++;
    return [...Array<string>(from.length - common).fill(".."), ...to.slice(common)].join("/");
}

/**
 * Paths matched by a pathspec: an exact file, a directory (everything below it), "." (everything below
 * the current directory) or a glob such as "*.js".
 */
export function matchPathspec(context: CommandContext, spec: string, candidates: Iterable<string>): string[] {
    const all = [...candidates];
    const hasGlob = /[*?[]/.test(spec);

    if (hasGlob) {
        // Resolve "." and ".." against the current directory first ("../*.txt" from src/).
        const segments = (context.gitRepository.toRepoPath(context.currentDirectory) ?? "").split("/").filter(Boolean);
        const rest = spec.split("/");
        while (rest.length > 1 && (rest[0] === "." || rest[0] === "..")) {
            if (rest.shift() === "..") segments.pop();
        }
        const base = segments.join("/");
        const pattern = new RegExp(
            "^" +
                (base ? base.replace(/[.+^${}()|[\]\\]/g, "\\$&") + "/" : "") +
                rest
                    .join("/")
                    .replace(/[.+^${}()|\\]/g, "\\$&")
                    .replace(/\*\*/g, "\u0000")
                    .replace(/\*/g, ".*")
                    .replace(/\?/g, ".")
                    .replace(/\u0000/g, ".*") +
                "$",
        );
        return all.filter(path => pattern.test(path));
    }

    const target = toRepoPath(context, spec);
    if (target === null) return [];
    if (target === "") return all;
    return all.filter(path => path === target || path.startsWith(target + "/"));
}

/** Does this argument read as a revision (or a range of them) — Git's first guess for a bare word? */
export function looksLikeRevision(repo: GitRepository, arg: string, allowObjectPaths = false): boolean {
    const spec = arg.startsWith("^") ? arg.substring(1) : arg;
    const range = /^(.*?)(\.\.\.?)(.*)$/.exec(spec);
    if (range) {
        const side = (s: string) => s === "" || repo.resolveCommit(s) !== undefined;
        return side(range[1]!) && side(range[3]!) && (range[1] !== "" || range[3] !== "");
    }
    if (allowObjectPaths && spec.includes(":")) return true;
    return repo.resolveCommit(spec) !== undefined || repo.getTagObject(spec) !== undefined;
}

/**
 * Split a command's positional arguments into revisions and paths the way Git does: everything
 * before "--" is a revision and everything after it a path; without "--", leading words that
 * resolve as revisions are revisions, and the rest must name files that exist in the working tree
 * (or be wildcard patterns). Anything else is the "ambiguous argument" error.
 */
export function splitRevisionsAndPaths(
    context: CommandContext,
    args: { args: string[]; positionalArgs: string[] },
    command: string,
    options: { allowObjectPaths?: boolean } = {},
): { ok: true; revs: string[]; paths: string[]; dashDash: boolean } | { ok: false; error: string[] } {
    const repo = context.gitRepository;
    const positional = args.positionalArgs;
    const dashDash = args.args.indexOf("--");
    if (dashDash !== -1) {
        const afterCount = args.args.length - dashDash - 1;
        return {
            ok: true,
            revs: positional.slice(0, positional.length - afterCount),
            paths: positional.slice(positional.length - afterCount),
            dashDash: true,
        };
    }
    const revs: string[] = [];
    const paths: string[] = [];
    for (const arg of positional) {
        if (paths.length === 0 && looksLikeRevision(repo, arg, options.allowObjectPaths)) {
            revs.push(arg);
            continue;
        }
        const repoPath = toRepoPath(context, arg);
        const onDisk =
            repoPath !== null &&
            (context.fileSystem.getFileContents(resolvePath(arg, context.currentDirectory)) !== null ||
                context.fileSystem.getDirectoryContents(resolvePath(arg, context.currentDirectory)) !== null);
        if (onDisk || /[*?[]/.test(arg)) {
            paths.push(arg);
            continue;
        }
        if (paths.length > 0 && looksLikeRevision(repo, arg))
            return { ok: false, error: ambiguousArgument(arg, command) };
        const resolution = repo.resolveRevision(arg);
        if (!resolution.ok && resolution.message) return { ok: false, error: resolution.message };
        return { ok: false, error: ambiguousArgument(arg, command) };
    }
    return { ok: true, revs, paths, dashDash: false };
}

/** Error lines for a revision that did not resolve, in the wording the given command uses. */
export function revisionError(repo: GitRepository, spec: string, command: string): string[] {
    const result = repo.resolveRevision(spec);
    if (!result.ok && result.message) {
        return result.reason === "ambiguous"
            ? [...result.message, ...ambiguousArgument(spec, command)]
            : result.message;
    }
    return ambiguousArgument(spec, command);
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Git's default date format: "Mon Oct 12 19:03:45 2026 +0200". */
export function formatGitDate(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    return (
        `${DAYS[date.getDay()]} ${MONTHS[date.getMonth()]} ${date.getDate()} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${date.getFullYear()} ` +
        `${sign}${pad(Math.floor(abs / 60))}${pad(abs % 60)}`
    );
}

/** "3 minutes ago", as --date=relative and reflog's relative mode print it. */
export function relativeDate(date: Date, now = new Date()): string {
    const seconds = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000));
    const unit = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"} ago`;
    if (seconds < 90) return unit(seconds, "second");
    const minutes = Math.round(seconds / 60);
    if (minutes < 90) return unit(minutes, "minute");
    const hours = Math.round(minutes / 60);
    if (hours < 36) return unit(hours, "hour");
    const days = Math.round(hours / 24);
    if (days < 14) return unit(days, "day");
    if (days < 70) return unit(Math.round(days / 7), "week");
    return unit(Math.round(days / 30), "month");
}

/** ISO-like date: "2026-10-12 19:03:45 +0200". */
export function isoDate(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ` +
        `${sign}${pad(Math.floor(abs / 60))}${pad(abs % 60)}`
    );
}

/** " 2 files changed, 5 insertions(+), 1 deletion(-)" */
export function shortStat(stat: TreeStat): string {
    const files = stat.files.length;
    const insertions = stat.files.reduce((sum, f) => sum + f.insertions, 0);
    const deletions = stat.files.reduce((sum, f) => sum + f.deletions, 0);
    let line = ` ${files} file${files === 1 ? "" : "s"} changed`;
    if (insertions > 0 || deletions === 0) line += `, ${insertions} insertion${insertions === 1 ? "" : "s"}(+)`;
    if (deletions > 0 || insertions === 0) line += `, ${deletions} deletion${deletions === 1 ? "" : "s"}(-)`;
    return line;
}

/** Git's compact rename notation: "src/{a.js => b.js}". */
/** Git's pprint_rename(): "src/{old.txt => new.txt}", "{a => b}/file.txt" or "old => new". */
export function renameLabel(from: string, to: string): string {
    // Common prefix, up to and including the last shared "/".
    let pfx = 0;
    for (let i = 0; i < from.length && i < to.length && from[i] === to[i]; i++) if (from[i] === "/") pfx = i + 1;
    // Common suffix, from a shared "/" on (it may reuse the prefix's slash).
    let sfx = 0;
    const adjust = pfx ? 1 : 0;
    let a = from.length;
    let b = to.length;
    while (pfx - adjust <= a && pfx - adjust <= b && from[a] === to[b]) {
        if (from[a] === "/") sfx = from.length - a;
        a--;
        b--;
    }
    const aMid = Math.max(0, from.length - pfx - sfx);
    const bMid = Math.max(0, to.length - pfx - sfx);
    const middle = `${from.substring(pfx, pfx + aMid)} => ${to.substring(pfx, pfx + bMid)}`;
    if (pfx + sfx === 0) return middle;
    return `${from.substring(0, pfx)}{${middle}}${from.substring(from.length - sfx)}`;
}

/** Exact renames among changed paths: deleted and added files with identical content (new → old). */
export function exactRenames(before: Tree, after: Tree, paths: string[]): Map<string, string> {
    const renames = new Map<string, string>();
    const used = new Set<string>();
    const deleted = paths.filter(p => p in before && !(p in after)).sort();
    for (const added of paths.filter(p => !(p in before) && p in after).sort()) {
        const source = deleted.find(d => !used.has(d) && before[d] === after[added]);
        if (source) {
            used.add(source);
            renames.set(added, source);
        }
    }
    return renames;
}

/** The patch between two trees for the given changed paths, with exact renames shown as renames. */
export function treePatch(before: Tree, after: Tree, paths: string[]): string[] {
    const renames = exactRenames(before, after, paths);
    const sources = new Set(renames.values());
    const lines: string[] = [];
    for (const path of [...paths].sort()) {
        if (sources.has(path)) continue;
        const from = renames.get(path);
        if (from) {
            lines.push(
                `diff --git a/${from} b/${path}`,
                "similarity index 100%",
                `rename from ${from}`,
                `rename to ${path}`,
            );
        } else {
            lines.push(...fileDiff(path, before[path], after[path]));
        }
    }
    return lines;
}

/** `--name-status` lines with renames as "R100". */
export function nameStatusLines(stat: TreeStat, before: Tree, after: Tree): string[] {
    const renames = exactRenames(
        before,
        after,
        stat.files.map(f => f.path),
    );
    const sources = new Set(renames.values());
    return stat.files
        .filter(f => !sources.has(f.path))
        .map(f => (renames.has(f.path) ? `R100\t${renames.get(f.path)}\t${f.path}` : `${f.status}\t${f.path}`));
}

/** `--name-only` paths with a rename listed under its new name only. */
export function nameOnlyLines(paths: string[], before: Tree, after: Tree): string[] {
    const sources = new Set(exactRenames(before, after, paths).values());
    return paths.filter(p => !sources.has(p));
}

/**
 * Pair deleted and added files with identical content into renames, as Git's rename detection does.
 * The returned stat counts each rename as one changed file with no line changes, listed where the
 * new path sorts.
 */
export function collapseRenames(
    stat: TreeStat,
    before: Tree,
    after: Tree,
): { stat: TreeStat; renames: [string, string][] } {
    const map = exactRenames(
        before,
        after,
        stat.files.map(f => f.path),
    );
    const sources = new Set(map.values());
    const files = stat.files
        .filter(f => !sources.has(f.path))
        .map(f => {
            const from = map.get(f.path);
            return from ? { path: renameLabel(from, f.path), insertions: 0, deletions: 0, status: "M" as const } : f;
        });
    return { stat: { files }, renames: [...map.entries()].map(([to, from]) => [from, to] as [string, string]) };
}

/** The create/delete/rename mode lines `git commit` and `git merge` print under the summary. */
export function modeLines(stat: TreeStat, renames: [string, string][] = []): string[] {
    return [
        ...stat.files
            .filter(f => f.status !== "M")
            .map(f => ` ${f.status === "A" ? "create" : "delete"} mode 100644 ${f.path}`),
        ...renames.map(([from, to]) => ` rename ${renameLabel(from, to)} (100%)`),
    ];
}

/** The per-file " path | 3 ++-" lines plus summary, as `git merge`, `git pull` and `--stat` print. */
export function diffStatLines(stat: TreeStat, width = 60): string[] {
    if (stat.files.length === 0) return [];
    const nameWidth = Math.max(...stat.files.map(f => f.path.length));
    const maxChanges = Math.max(...stat.files.map(f => f.insertions + f.deletions));
    const countWidth = String(maxChanges).length;
    const barWidth = Math.max(1, width - nameWidth - countWidth - 4);
    const scale = maxChanges > barWidth ? barWidth / maxChanges : 1;

    const lines = stat.files.map(f => {
        const total = f.insertions + f.deletions;
        const plus = Math.round(f.insertions * scale) || (f.insertions > 0 ? 1 : 0);
        const minus = Math.round(f.deletions * scale) || (f.deletions > 0 ? 1 : 0);
        const bar = `${"+".repeat(plus)}${"-".repeat(minus)}`;
        return ` ${f.path.padEnd(nameWidth)} | ${String(total).padStart(countWidth)}${bar ? " " + bar : ""}`;
    });
    return [...lines, shortStat(stat)];
}

/** The two lines `git commit` prints: "[main abc1234] Message" and the stat. */
export function commitSummary(
    repo: GitRepository,
    commitId: string,
    extra: { amend?: boolean; showDate?: boolean } = {},
): string[] {
    const commit = repo.getCommit(commitId)!;
    const branch = repo.getBranchName() ?? "detached HEAD";
    // Git says "root-commit" when HEAD was unborn, so not for an amended root commit.
    const root = commit.parents.length === 0 && !extra.amend ? " (root-commit)" : "";
    const parentTree: Tree = commit.parents[0] ? repo.treeOf(commit.parents[0]) : {};
    const { stat, renames } = collapseRenames(repo.treeStat(parentTree, commit.tree), parentTree, commit.tree);
    const lines = [`[${branch}${root} ${repo.abbrev(commitId)}] ${commit.message.split("\n")[0]}`];
    // Commits that keep an older author date (amend, cherry-pick) show it.
    if (extra.amend || extra.showDate) lines.push(` Date: ${formatGitDate(commit.timestamp)}`);
    if (stat.files.length > 0) lines.push(shortStat(stat), ...modeLines(stat, renames));
    return lines;
}

/** "HEAD is now at abc1234 Message" */
export function headIsNowAt(repo: GitRepository): string {
    const id = repo.getHeadCommitId();
    if (!id) return "HEAD is now at (no commit)";
    return `HEAD is now at ${repo.abbrev(id)} ${repo.getCommit(id)!.message.split("\n")[0]}`;
}

/** Ref decorations for a commit, as `git log` shows them: "(HEAD -> main, origin/main, tag: v1)". */
export function decorations(repo: GitRepository, id: string): string {
    const branchName = repo.getBranchName();
    const headId = repo.getHeadCommitId();
    // Git lists HEAD first, then the other refs in reverse order of their full names: tags, then
    // remote-tracking branches, then local branches, each group from Z to A.
    const refs: { full: string; label: string }[] = [];
    for (const [name, tip] of Object.entries(repo.getBranchHeads())) {
        if (tip !== id || (name === branchName && headId === id)) continue;
        refs.push({ full: `refs/heads/${name}`, label: name });
    }
    for (const [name, tip] of Object.entries(repo.getRemoteTrackingRefs())) {
        if (tip === id) refs.push({ full: `refs/remotes/${name}`, label: name });
    }
    for (const [tag, tip] of repo.getTags()) {
        if (tip === id) refs.push({ full: `refs/tags/${tag}`, label: `tag: ${tag}` });
    }
    refs.sort((a, b) => (a.full < b.full ? 1 : a.full > b.full ? -1 : 0));

    const parts: string[] = [];
    if (headId === id)
        parts.push(branchName && repo.getBranchTip(branchName) === id ? `HEAD -> ${branchName}` : "HEAD");
    parts.push(...refs.map(r => r.label));
    return parts.length > 0 ? ` (${parts.join(", ")})` : "";
}

/** Indent a commit message the way `git log` does. */
export function indentMessage(message: string): string[] {
    return message.split("\n").map(line => (line ? `    ${line}` : ""));
}
