import type { CommandContext } from "../base/Command";
import type { GitRepository, Tree, TreeStat } from "~/models/GitRepository";
import { resolvePath } from "~/lib/utils";
import { ambiguousArgument } from "~/models/git/revision";
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
        const base = context.gitRepository.toRepoPath(context.currentDirectory) ?? "";
        const pattern = new RegExp(
            "^" +
                (base ? base.replace(/[.+^${}()|[\]\\]/g, "\\$&") + "/" : "") +
                spec
                    .replace(/^\.\//, "")
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
function renameLabel(from: string, to: string): string {
    const a = from.split("/");
    const b = to.split("/");
    let common = 0;
    while (common < a.length - 1 && common < b.length - 1 && a[common] === b[common]) common++;
    if (common === 0) return `${from} => ${to}`;
    return `${a.slice(0, common).join("/")}/{${a.slice(common).join("/")} => ${b.slice(common).join("/")}}`;
}

/**
 * Pair deleted and added files with identical content into renames, as Git's rename detection does.
 * The returned stat counts each rename as one changed file with no line changes.
 */
export function collapseRenames(
    stat: TreeStat,
    before: Tree,
    after: Tree,
): { stat: TreeStat; renames: [string, string][] } {
    const renames: [string, string][] = [];
    const used = new Set<string>();
    for (const added of stat.files.filter(f => f.status === "A")) {
        const deleted = stat.files.find(
            f => f.status === "D" && !used.has(f.path) && before[f.path] === after[added.path],
        );
        if (deleted) {
            used.add(deleted.path).add(added.path);
            renames.push([deleted.path, added.path]);
        }
    }
    const files = stat.files.filter(f => !used.has(f.path));
    for (const [from, to] of renames)
        files.push({ path: renameLabel(from, to), insertions: 0, deletions: 0, status: "M" });
    return { stat: { files }, renames };
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
export function commitSummary(repo: GitRepository, commitId: string, extra: { amend?: boolean } = {}): string[] {
    const commit = repo.getCommit(commitId)!;
    const branch = repo.getBranchName() ?? "detached HEAD";
    const root = commit.parents.length === 0 ? " (root-commit)" : "";
    const parentTree: Tree = commit.parents[0] ? repo.treeOf(commit.parents[0]) : {};
    const { stat, renames } = collapseRenames(repo.treeStat(parentTree, commit.tree), parentTree, commit.tree);
    const lines = [`[${branch}${root} ${repo.abbrev(commitId)}] ${commit.message.split("\n")[0]}`];
    if (extra.amend) lines.push(` Date: ${formatGitDate(commit.timestamp)}`);
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
    const parts: string[] = [];
    const branchName = repo.getBranchName();
    const headId = repo.getHeadCommitId();
    const branches = Object.entries(repo.getBranchHeads())
        .filter(([, tip]) => tip === id)
        .map(([name]) => name)
        .sort();

    if (headId === id) {
        if (branchName && branches.includes(branchName)) {
            parts.push(`HEAD -> ${branchName}`);
        } else {
            parts.push("HEAD");
        }
    }
    for (const name of branches) {
        if (name !== branchName || headId !== id) parts.push(name);
    }
    for (const [name, tip] of Object.entries(repo.getRemoteTrackingRefs()).sort()) {
        if (tip === id) parts.push(name);
    }
    for (const [tag, tip] of repo.getTags()) {
        if (tip === id) parts.push(`tag: ${tag}`);
    }
    return parts.length > 0 ? ` (${parts.join(", ")})` : "";
}

/** Indent a commit message the way `git log` does. */
export function indentMessage(message: string): string[] {
    return message.split("\n").map(line => (line ? `    ${line}` : ""));
}
