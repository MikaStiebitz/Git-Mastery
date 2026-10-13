import type { GitRepository, Tree } from "~/models/GitRepository";
import {
    collapseRenames,
    decorations,
    diffStatLines,
    formatGitDate,
    indentMessage,
    isoDate,
    nameOnlyLines,
    nameStatusLines,
    relativeDate,
    treePatch,
} from "./gitFormat";

/**
 * How `git log` and `git show` print a commit: the pretty formats, dates, decorations, and the
 * patch/stat/name-only views of its change.
 */

export type DateMode = "default" | "relative" | "iso" | "short" | "unix";

export type LogFormatOptions = {
    pretty: string; // "medium" | "oneline" | "short" | "full" | "fuller" | "raw" | "format:..."
    abbrev: boolean;
    decorate: boolean;
    date: DateMode;
    patch: boolean;
    stat: boolean;
    nameOnly: boolean;
    nameStatus: boolean;
    paths?: string[];
};

export function formatDate(date: Date, mode: DateMode): string {
    switch (mode) {
        case "relative":
            return relativeDate(date);
        case "iso":
            return isoDate(date);
        case "short":
            return isoDate(date).substring(0, 10);
        case "unix":
            return String(Math.floor(date.getTime() / 1000));
        default:
            return formatGitDate(date);
    }
}

function parentTree(repo: GitRepository, id: string): Tree {
    const parent = repo.getCommit(id)!.parents[0];
    return parent ? repo.treeOf(parent) : {};
}

function inPaths(path: string, paths?: string[]): boolean {
    return !paths || paths.length === 0 || paths.some(p => path === p || path.startsWith(p.replace(/\/$/, "") + "/"));
}

/** The diff a commit introduces (against its first parent), as unified-diff lines. */
export function commitPatch(repo: GitRepository, id: string, paths?: string[]): string[] {
    const before = parentTree(repo, id);
    const after = repo.treeOf(id);
    const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])]
        .filter(p => before[p] !== after[p] && inPaths(p, paths))
        .sort();
    return treePatch(before, after, changed);
}

function changeLines(repo: GitRepository, id: string, options: LogFormatOptions): string[] {
    const commit = repo.getCommit(id)!;
    if (commit.parents.length > 1 && !options.stat && !options.nameOnly && !options.nameStatus) return [];
    const before = parentTree(repo, id);
    const after = repo.treeOf(id);
    const stat = repo.treeStat(before, after);
    stat.files = stat.files.filter(f => inPaths(f.path, options.paths));

    const lines: string[] = [];
    if (options.nameOnly)
        lines.push(
            ...nameOnlyLines(
                stat.files.map(f => f.path),
                before,
                after,
            ),
        );
    if (options.nameStatus) lines.push(...nameStatusLines(stat, before, after));
    if (options.stat) lines.push(...diffStatLines(collapseRenames(stat, before, after).stat));
    if (options.patch && commit.parents.length <= 1) {
        if (options.stat) lines.push("");
        lines.push(...commitPatch(repo, id, options.paths));
    }
    return lines;
}

/** Expand a --format string (%H, %h, %s, %an, %ad, %ar, %d, %b, %P, %p, %n …). */
export function expandFormat(repo: GitRepository, id: string, format: string, options: LogFormatOptions): string {
    const commit = repo.getCommit(id)!;
    const [subject, ...bodyLines] = commit.message.split("\n");
    const body = bodyLines.join("\n").replace(/^\n+/, "");
    const map: Record<string, string> = {
        H: id,
        h: repo.abbrev(id),
        T: "",
        t: "",
        P: commit.parents.join(" "),
        p: commit.parents.map(p => repo.abbrev(p)).join(" "),
        an: commit.author,
        aN: commit.author,
        ae: commit.email,
        aE: commit.email,
        ad: formatDate(commit.timestamp, options.date),
        aD: commit.timestamp.toUTCString(),
        ar: relativeDate(commit.timestamp),
        ai: isoDate(commit.timestamp),
        as: isoDate(commit.timestamp).substring(0, 10),
        at: String(Math.floor(commit.timestamp.getTime() / 1000)),
        cn: commit.author,
        ce: commit.email,
        cd: formatDate(commit.timestamp, options.date),
        cr: relativeDate(commit.timestamp),
        ci: isoDate(commit.timestamp),
        cs: isoDate(commit.timestamp).substring(0, 10),
        s: subject ?? "",
        f: (subject ?? "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        b: body ? body + "\n" : "",
        B: commit.message + "\n",
        d: decorations(repo, id),
        D: decorations(repo, id).replace(/^ \(|\)$/g, ""),
        n: "\n",
        "%": "%",
    };
    return format.replace(
        /%(an|aN|ae|aE|ad|aD|ar|ai|as|at|cn|ce|cd|cr|ci|cs|[HhTtPpsfbBdDn%])|%C\([a-z]+\)|%C(red|green|blue|reset)/g,
        (match, key: string | undefined) => {
            if (match.startsWith("%C")) return "";
            return key !== undefined ? (map[key] ?? match) : match;
        },
    );
}

/** One commit in the requested pretty format, including any patch/stat output. */
export function formatCommit(repo: GitRepository, id: string, options: LogFormatOptions): string[] {
    const commit = repo.getCommit(id)!;
    const hash = options.abbrev ? repo.abbrev(id) : id;
    const decoration = options.decorate ? decorations(repo, id) : "";
    const changes = changeLines(repo, id, options);
    const pretty = options.pretty;

    if (pretty.startsWith("format:") || pretty.startsWith("tformat:") || pretty.includes("%")) {
        const format = pretty.replace(/^t?format:/, "");
        const text = expandFormat(repo, id, format, options).split("\n");
        // A custom format is separated from the stat or patch by a blank line (unlike --oneline).
        return changes.length > 0 ? [...text, "", ...changes] : text;
    }

    if (pretty === "oneline") {
        const line = `${hash}${decoration} ${commit.message.split("\n")[0]}`;
        return changes.length > 0 ? [line, ...changes] : [line];
    }

    const lines = [`commit ${hash}${decoration}`];
    if (commit.parents.length > 1) {
        lines.push(`Merge: ${commit.parents.map(p => repo.abbrev(p)).join(" ")}`);
    }
    lines.push(`Author: ${commit.author} <${commit.email}>`);
    if (pretty === "full" || pretty === "fuller") {
        if (pretty === "fuller") lines.push(`AuthorDate: ${formatDate(commit.timestamp, options.date)}`);
        lines.push(`Commit: ${commit.author} <${commit.email}>`);
        if (pretty === "fuller") lines.push(`CommitDate: ${formatDate(commit.timestamp, options.date)}`);
    } else if (pretty !== "short") {
        lines.push(`Date:   ${formatDate(commit.timestamp, options.date)}`);
    }
    lines.push("");
    if (pretty === "short") lines.push(...indentMessage(commit.message.split("\n")[0] ?? ""));
    else lines.push(...indentMessage(commit.message));
    if (changes.length > 0) {
        lines.push("");
        lines.push(...changes);
    }
    return lines;
}

export function defaultLogOptions(): LogFormatOptions {
    return {
        pretty: "medium",
        abbrev: false,
        decorate: true,
        date: "default",
        patch: false,
        stat: false,
        nameOnly: false,
        nameStatus: false,
    };
}
