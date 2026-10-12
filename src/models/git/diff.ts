import { sha1 } from "./sha1";

/**
 * Line-based diffing, unified-diff formatting and three-way merging.
 *
 * This is what lets `git diff`, `git show`, `git log -p`, `git blame`, merges, cherry-picks, reverts
 * and rebases work on the real content of the files instead of printing canned output.
 */

export type EditOp = { type: "equal" | "delete" | "insert"; line: string };

/** A file's content as lines, plus whether its final line ends with a newline. */
export type Lines = { lines: string[]; eol: boolean };

export function toLines(content: string): Lines {
    if (content === "") return { lines: [], eol: true };
    const eol = content.endsWith("\n");
    const body = eol ? content.slice(0, -1) : content;
    return { lines: body.split("\n"), eol };
}

export function fromLines(lines: string[], eol: boolean): string {
    if (lines.length === 0) return "";
    return lines.join("\n") + (eol ? "\n" : "");
}

/** Git's blob id for a piece of content: sha1("blob <bytes>\0<content>"). */
export function blobId(content: string): string {
    const bytes = new TextEncoder().encode(content).length;
    return sha1(`blob ${bytes}\0${content}`);
}

const NO_EOL = "\u0000\\ No newline at end of file";

/**
 * The lines Git compares. A last line without a trailing newline is a different line from the same
 * text with one — that is how Git reports "\ No newline at end of file" — so it gets a marker suffix.
 */
function comparable({ lines, eol }: Lines): string[] {
    if (lines.length === 0 || eol) return lines;
    return [...lines.slice(0, -1), lines[lines.length - 1]! + NO_EOL];
}

/** Minimal edit script turning `a` into `b`, via longest common subsequence. */
export function diffLines(a: string[], b: string[]): EditOp[] {
    // Trim the common prefix and suffix first: most edits touch a few lines of a longer file.
    let start = 0;
    while (start < a.length && start < b.length && a[start] === b[start]) start++;
    let endA = a.length;
    let endB = b.length;
    while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
        endA--;
        endB--;
    }

    const midA = a.slice(start, endA);
    const midB = b.slice(start, endB);
    const ops: EditOp[] = a.slice(0, start).map(line => ({ type: "equal", line }));

    const n = midA.length;
    const m = midB.length;

    if (n * m > 4_000_000) {
        // Too large to diff precisely in the browser; fall back to "replace the middle".
        midA.forEach(line => ops.push({ type: "delete", line }));
        midB.forEach(line => ops.push({ type: "insert", line }));
    } else {
        // lcs[i][j] = LCS length of midA[i..] and midB[j..]
        const lcs: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
        for (let i = n - 1; i >= 0; i--) {
            const row = lcs[i]!;
            const below = lcs[i + 1]!;
            for (let j = m - 1; j >= 0; j--) {
                row[j] = midA[i] === midB[j] ? below[j + 1]! + 1 : Math.max(below[j]!, row[j + 1]!);
            }
        }

        let i = 0;
        let j = 0;
        while (i < n && j < m) {
            if (midA[i] === midB[j]) {
                ops.push({ type: "equal", line: midA[i]! });
                i++;
                j++;
            } else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) {
                ops.push({ type: "delete", line: midA[i]! });
                i++;
            } else {
                ops.push({ type: "insert", line: midB[j]! });
                j++;
            }
        }
        while (i < n) ops.push({ type: "delete", line: midA[i++]! });
        while (j < m) ops.push({ type: "insert", line: midB[j++]! });
    }

    a.slice(endA).forEach(line => ops.push({ type: "equal", line }));
    return ops;
}

export type DiffStat = { insertions: number; deletions: number };

export function diffStat(oldContent: string | undefined, newContent: string | undefined): DiffStat {
    const ops = diffLines(comparable(toLines(oldContent ?? "")), comparable(toLines(newContent ?? "")));
    return {
        insertions: ops.filter(op => op.type === "insert").length,
        deletions: ops.filter(op => op.type === "delete").length,
    };
}

/** Render one line of a hunk, expanding the no-newline marker into Git's own follow-up line. */
function renderLine(prefix: string, line: string): string[] {
    if (line.endsWith(NO_EOL)) {
        return [prefix + line.slice(0, -NO_EOL.length), "\\ No newline at end of file"];
    }
    return [prefix + line];
}

/** The @@ hunks of a unified diff between two versions of a file (no file header). */
export function unifiedHunks(oldContent: string, newContent: string, context = 3): string[] {
    const ops = diffLines(comparable(toLines(oldContent)), comparable(toLines(newContent)));
    if (!ops.some(op => op.type !== "equal")) return [];

    // Positions (1-based) of each op in the old and new files.
    const annotated: { op: EditOp; oldLine: number; newLine: number }[] = [];
    let oldLine = 1;
    let newLine = 1;
    for (const op of ops) {
        annotated.push({ op, oldLine, newLine });
        if (op.type !== "insert") oldLine++;
        if (op.type !== "delete") newLine++;
    }

    // Group changes that are within 2*context lines of each other into one hunk.
    const changeIdx = annotated.map((a, i) => (a.op.type === "equal" ? -1 : i)).filter(i => i >= 0);
    const groups: { from: number; to: number }[] = [];
    for (const idx of changeIdx) {
        const last = groups[groups.length - 1];
        if (last && idx - last.to <= context * 2 + 1) {
            last.to = idx;
        } else {
            groups.push({ from: idx, to: idx });
        }
    }

    const out: string[] = [];
    for (const group of groups) {
        const from = Math.max(0, group.from - context);
        const to = Math.min(annotated.length - 1, group.to + context);
        const slice = annotated.slice(from, to + 1);

        const oldCount = slice.filter(a => a.op.type !== "insert").length;
        const newCount = slice.filter(a => a.op.type !== "delete").length;
        const first = slice[0]!;
        const oldStart = oldCount === 0 ? first.oldLine - 1 : first.oldLine;
        const newStart = newCount === 0 ? first.newLine - 1 : first.newLine;

        out.push(`@@ -${formatRange(oldStart, oldCount)} +${formatRange(newStart, newCount)} @@`);
        for (const { op } of slice) {
            const prefix = op.type === "equal" ? " " : op.type === "delete" ? "-" : "+";
            out.push(...renderLine(prefix, op.line));
        }
    }
    return out;
}

function formatRange(start: number, count: number): string {
    return count === 1 ? `${start}` : `${start},${count}`;
}

/**
 * A full `diff --git` section for one path, the way Git prints it.
 *
 * `oldContent` undefined means the file is new; `newContent` undefined means it was deleted.
 */
export function fileDiff(path: string, oldContent: string | undefined, newContent: string | undefined): string[] {
    if (oldContent === newContent) return [];

    const header = [`diff --git a/${path} b/${path}`];
    const oldId = oldContent === undefined ? "0000000" : blobId(oldContent).substring(0, 7);
    const newId = newContent === undefined ? "0000000" : blobId(newContent).substring(0, 7);

    if (oldContent === undefined) {
        header.push("new file mode 100644", `index ${oldId}..${newId}`);
    } else if (newContent === undefined) {
        header.push("deleted file mode 100644", `index ${oldId}..${newId}`);
    } else {
        header.push(`index ${oldId}..${newId} 100644`);
    }

    const hunks = unifiedHunks(oldContent ?? "", newContent ?? "");
    if (hunks.length === 0) return header; // e.g. an empty file being added or removed

    header.push(oldContent === undefined ? "--- /dev/null" : `--- a/${path}`);
    header.push(newContent === undefined ? "+++ /dev/null" : `+++ b/${path}`);
    return [...header, ...hunks];
}

// ---------------------------------------------------------------------------------------------------
// Three-way merge
// ---------------------------------------------------------------------------------------------------

type Hunk = { start: number; end: number; lines: string[]; side: "ours" | "theirs" };

/** The changed regions of `side` relative to `base`, as replacements of base[start, end). */
function hunksAgainstBase(base: string[], side: string[], name: "ours" | "theirs"): Hunk[] {
    const ops = diffLines(base, side);
    const hunks: Hunk[] = [];
    let baseIdx = 0;
    let current: Hunk | null = null;

    for (const op of ops) {
        if (op.type === "equal") {
            if (current) {
                hunks.push(current);
                current = null;
            }
            baseIdx++;
            continue;
        }
        current ??= { start: baseIdx, end: baseIdx, lines: [], side: name };
        if (op.type === "delete") {
            baseIdx++;
            current.end = baseIdx;
        } else {
            current.lines.push(op.line);
        }
    }
    if (current) hunks.push(current);
    return hunks;
}

/** Apply a side's hunks that fall inside base[from, to) and return the resulting lines. */
function applyWithin(base: string[], hunks: Hunk[], from: number, to: number): string[] {
    const out: string[] = [];
    let pos = from;
    for (const hunk of hunks) {
        out.push(...base.slice(pos, hunk.start));
        out.push(...hunk.lines);
        pos = hunk.end;
    }
    out.push(...base.slice(pos, to));
    return out;
}

export type MergeResult = { content: string; conflicts: number };

/**
 * Merge two descendants of `base` line by line, as `git merge` does for a file changed on both sides.
 * Non-overlapping changes combine cleanly; overlapping ones become a conflict block with Git's markers.
 */
export function mergeFile(
    base: string,
    ours: string,
    theirs: string,
    labels: { ours: string; theirs: string },
): MergeResult {
    if (ours === theirs) return { content: ours, conflicts: 0 };
    if (base === ours) return { content: theirs, conflicts: 0 };
    if (base === theirs) return { content: ours, conflicts: 0 };

    const baseLines = toLines(base);
    const oursLines = toLines(ours);
    const theirsLines = toLines(theirs);
    const b = baseLines.lines;

    const all = [
        ...hunksAgainstBase(b, oursLines.lines, "ours"),
        ...hunksAgainstBase(b, theirsLines.lines, "theirs"),
    ].sort((x, y) => x.start - y.start || x.end - y.end);

    // Group hunks whose base ranges overlap or touch; each group is resolved on its own.
    const groups: Hunk[][] = [];
    let groupEnd = -1;
    for (const hunk of all) {
        const last = groups[groups.length - 1];
        if (last && hunk.start <= groupEnd) {
            last.push(hunk);
            groupEnd = Math.max(groupEnd, hunk.end);
        } else {
            groups.push([hunk]);
            groupEnd = hunk.end;
        }
    }

    const out: string[] = [];
    let conflicts = 0;
    let pos = 0;

    for (const group of groups) {
        const from = Math.min(...group.map(h => h.start));
        const to = Math.max(...group.map(h => h.end));
        out.push(...b.slice(pos, from));

        const oursHunks = group.filter(h => h.side === "ours");
        const theirsHunks = group.filter(h => h.side === "theirs");
        const oursText = applyWithin(b, oursHunks, from, to);
        const theirsText = applyWithin(b, theirsHunks, from, to);

        if (theirsHunks.length === 0) {
            out.push(...oursText);
        } else if (oursHunks.length === 0) {
            out.push(...theirsText);
        } else if (oursText.join("\n") === theirsText.join("\n")) {
            out.push(...oursText);
        } else {
            conflicts++;
            out.push(`<<<<<<< ${labels.ours}`, ...oursText, "=======", ...theirsText, `>>>>>>> ${labels.theirs}`);
        }
        pos = to;
    }
    out.push(...b.slice(pos));

    const eol = ours === base ? theirsLines.eol : oursLines.eol || (conflicts > 0 && theirsLines.eol);
    return { content: fromLines(out, eol || conflicts > 0), conflicts };
}
