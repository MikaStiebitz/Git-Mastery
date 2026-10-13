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

/** Minimal edit script turning `a` into `b`, laid out the way Git's xdiff lays it out. */
export function diffLines(a: string[], b: string[]): EditOp[] {
    const changedA = new Uint8Array(a.length);
    const changedB = new Uint8Array(b.length);
    markChanges(a, b, changedA, changedB);

    // Like xdiff, slide each block of changes to its canonical place (both directions).
    compactChanges(a, changedA, changedB);
    compactChanges(b, changedB, changedA);

    const ops: EditOp[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length || j < b.length) {
        if (i < a.length && j < b.length && !changedA[i] && !changedB[j]) {
            ops.push({ type: "equal", line: a[i]! });
            i++;
            j++;
            continue;
        }
        while (i < a.length && changedA[i]) ops.push({ type: "delete", line: a[i++]! });
        while (j < b.length && changedB[j]) ops.push({ type: "insert", line: b[j++]! });
    }
    return ops;
}

/** Mark the lines of a and b that are not part of a longest common subsequence. */
function markChanges(a: string[], b: string[], changedA: Uint8Array, changedB: Uint8Array): void {
    // Trim the common prefix and suffix first: most edits touch a few lines of a longer file.
    let start = 0;
    while (start < a.length && start < b.length && a[start] === b[start]) start++;
    let endA = a.length;
    let endB = b.length;
    while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
        endA--;
        endB--;
    }
    const n = endA - start;
    const m = endB - start;

    if (n * m > 4_000_000) {
        // Too large to diff precisely in the browser; fall back to "replace the middle".
        changedA.fill(1, start, endA);
        changedB.fill(1, start, endB);
        return;
    }

    // lcs[i][j] = LCS length of a[start+i..endA) and b[start+j..endB)
    const lcs: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
    for (let i = n - 1; i >= 0; i--) {
        const row = lcs[i]!;
        const below = lcs[i + 1]!;
        for (let j = m - 1; j >= 0; j--) {
            row[j] = a[start + i] === b[start + j] ? below[j + 1]! + 1 : Math.max(below[j]!, row[j + 1]!);
        }
    }
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
        if (a[start + i] === b[start + j]) {
            i++;
            j++;
        } else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) {
            changedA[start + i++] = 1;
        } else {
            changedB[start + j++] = 1;
        }
    }
    while (i < n) changedA[start + i++] = 1;
    while (j < m) changedB[start + j++] = 1;
}

// ------------------------------------------------------------------------ xdiff's change compaction
// A port of xdl_change_compact() from Git's xdiff/xdiffi.c, including the indent heuristic that
// is on by default: among the equivalent places a block of added or removed lines could sit, pick
// the one a human would (after a blank line, at the right indentation, as low as possible).

type Group = { start: number; end: number };

function groupInit(changed: Uint8Array): Group {
    let end = 0;
    while (end < changed.length && changed[end]) end++;
    return { start: 0, end };
}

/** Move to the next group (possibly empty). Returns false at the end of the file. */
function groupNext(changed: Uint8Array, g: Group): boolean {
    if (g.end === changed.length) return false;
    g.start = g.end + 1;
    g.end = g.start;
    while (g.end < changed.length && changed[g.end]) g.end++;
    return true;
}

function groupPrevious(changed: Uint8Array, g: Group): boolean {
    if (g.start === 0) return false;
    g.end = g.start - 1;
    g.start = g.end;
    while (g.start > 0 && changed[g.start - 1]) g.start--;
    return true;
}

function groupSlideDown(lines: string[], changed: Uint8Array, g: Group): boolean {
    if (g.end < lines.length && lines[g.start] === lines[g.end]) {
        changed[g.start++] = 0;
        changed[g.end++] = 1;
        while (g.end < changed.length && changed[g.end]) g.end++;
        return true;
    }
    return false;
}

function groupSlideUp(lines: string[], changed: Uint8Array, g: Group): boolean {
    if (g.start > 0 && lines[g.start - 1] === lines[g.end - 1]) {
        changed[--g.start] = 1;
        changed[--g.end] = 0;
        while (g.start > 0 && changed[g.start - 1]) g.start--;
        return true;
    }
    return false;
}

const MAX_INDENT = 200;
const MAX_BLANKS = 20;
const INDENT_HEURISTIC_MAX_SLIDING = 100;

/** Indentation width of a line (tabs to multiples of 8), or -1 for a blank line. */
function getIndent(line: string): number {
    let indent = 0;
    for (const char of line) {
        if (!/\s/.test(char)) return indent;
        if (char === " ") indent += 1;
        else if (char === "\t") indent += 8 - (indent % 8);
        if (indent >= MAX_INDENT) return MAX_INDENT;
    }
    return -1;
}

type SplitScore = { effectiveIndent: number; penalty: number };

function scoreSplit(lines: string[], split: number, score: SplitScore): void {
    const endOfFile = split >= lines.length;
    const indentAt = endOfFile ? -1 : getIndent(lines[split]!);

    let preBlank = 0;
    let preIndent = -1;
    for (let i = split - 1; i >= 0; i--) {
        preIndent = getIndent(lines[i]!);
        if (preIndent !== -1) break;
        preBlank++;
        if (preBlank === MAX_BLANKS) {
            preIndent = 0;
            break;
        }
    }
    let postBlank = 0;
    let postIndent = -1;
    for (let i = split + 1; i < lines.length; i++) {
        postIndent = getIndent(lines[i]!);
        if (postIndent !== -1) break;
        postBlank++;
        if (postBlank === MAX_BLANKS) {
            postIndent = 0;
            break;
        }
    }

    if (preIndent === -1 && preBlank === 0) score.penalty += 1; // start of file
    if (endOfFile) score.penalty += 21;

    const blankAfter = indentAt === -1 ? 1 + postBlank : 0;
    const totalBlank = preBlank + blankAfter;
    score.penalty += -30 * totalBlank + 6 * blankAfter;

    const indent = indentAt !== -1 ? indentAt : postIndent;
    const anyBlanks = totalBlank !== 0;
    score.effectiveIndent += indent;

    if (indent === -1 || preIndent === -1) {
        // nothing to add
    } else if (indent > preIndent) {
        score.penalty += anyBlanks ? 10 : -4;
    } else if (indent === preIndent) {
        // nothing to add
    } else if (postIndent !== -1 && postIndent > indent) {
        score.penalty += anyBlanks ? 17 : 24;
    } else {
        score.penalty += anyBlanks ? 17 : 23;
    }
}

function scoreCompare(s1: SplitScore, s2: SplitScore): number {
    const cmpIndents =
        Number(s1.effectiveIndent > s2.effectiveIndent) - Number(s1.effectiveIndent < s2.effectiveIndent);
    return 60 * cmpIndents + (s1.penalty - s2.penalty);
}

function compactChanges(lines: string[], changed: Uint8Array, otherChanged: Uint8Array): void {
    const g = groupInit(changed);
    const go = groupInit(otherChanged);

    for (;;) {
        if (g.end !== g.start) {
            let groupSize: number;
            let earliestEnd: number;
            let endMatchingOther: number;
            do {
                groupSize = g.end - g.start;
                endMatchingOther = -1;

                // Shift the group up as far as possible, then down as far as possible, merging
                // with any group it bumps into.
                while (groupSlideUp(lines, changed, g)) groupPrevious(otherChanged, go);
                earliestEnd = g.end;
                if (go.end > go.start) endMatchingOther = g.end;

                while (groupSlideDown(lines, changed, g)) {
                    groupNext(otherChanged, go);
                    if (go.end > go.start) endMatchingOther = g.end;
                }
            } while (groupSize !== g.end - g.start);

            if (g.end === earliestEnd) {
                // It cannot move at all.
            } else if (endMatchingOther !== -1) {
                // Line it up with the change on the other side, so they form one hunk.
                while (go.end === go.start) {
                    groupSlideUp(lines, changed, g);
                    groupPrevious(otherChanged, go);
                }
            } else {
                // The indent heuristic.
                let shift = earliestEnd;
                if (g.end - groupSize - 1 > shift) shift = g.end - groupSize - 1;
                if (g.end - INDENT_HEURISTIC_MAX_SLIDING > shift) shift = g.end - INDENT_HEURISTIC_MAX_SLIDING;
                let bestShift = -1;
                let best: SplitScore = { effectiveIndent: 0, penalty: 0 };
                for (; shift <= g.end; shift++) {
                    const score: SplitScore = { effectiveIndent: 0, penalty: 0 };
                    scoreSplit(lines, shift, score);
                    scoreSplit(lines, shift - groupSize, score);
                    if (bestShift === -1 || scoreCompare(score, best) <= 0) {
                        best = score;
                        bestShift = shift;
                    }
                }
                while (g.end > bestShift) {
                    groupSlideUp(lines, changed, g);
                    groupPrevious(otherChanged, go);
                }
            }
        }
        if (!groupNext(changed, g)) break;
        groupNext(otherChanged, go);
    }
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

// ------------------------------------------------------------------------ combined diff (diff --cc)

type LostLine = { line: string; parents: number };

/**
 * Merge the lines lost from another parent into a line's lost list, coalescing equal lines (the
 * "--" lines) the way Git's coalesce_lines() does with an LCS.
 */
function coalesceLost(base: LostLine[], added: string[], parentBit: number): LostLine[] {
    const n = base.length;
    const m = added.length;
    const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
    const dir: ("match" | "new" | "base")[][] = Array.from({ length: n + 1 }, () =>
        new Array<"match" | "new" | "base">(m + 1).fill("new"),
    );
    for (let i = 1; i <= n; i++) dir[i]![0] = "base";
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (base[i - 1]!.line === added[j - 1]) {
                lcs[i]![j] = lcs[i - 1]![j - 1]! + 1;
                dir[i]![j] = "match";
            } else if (lcs[i]![j - 1]! >= lcs[i - 1]![j]!) {
                lcs[i]![j] = lcs[i]![j - 1]!;
                dir[i]![j] = "new";
            } else {
                lcs[i]![j] = lcs[i - 1]![j]!;
                dir[i]![j] = "base";
            }
        }
    }
    const reversed: LostLine[] = [];
    let i = n;
    let j = m;
    while (i > 0 || j > 0) {
        const d = dir[i]![j]!;
        if (d === "match") {
            reversed.push({ line: base[i - 1]!.line, parents: base[i - 1]!.parents | parentBit });
            i--;
            j--;
        } else if (d === "new") {
            reversed.push({ line: added[j - 1]!, parents: parentBit });
            j--;
        } else {
            reversed.push(base[i - 1]!);
            i--;
        }
    }
    return reversed.reverse();
}

/**
 * `git diff` of a path with a merge conflict: the "dense combined" diff of the working-tree file
 * against both sides (Git's combine-diff.c with --cc), with a column per parent.
 */
export function combinedDiff(path: string, parents: string[], result: string, context = 3): string[] {
    const resultLines = comparable(toLines(result));
    const cnt = resultLines.length;
    const allMask = (1 << parents.length) - 1;
    // flag: bit n = the line was added relative to parent n. lost: lines before it that parents had.
    const flag = new Array<number>(cnt + 1).fill(0);
    let lost: LostLine[][] = Array.from({ length: cnt + 1 }, () => []);
    const parentLno: number[][] = [];

    parents.forEach((parent, n) => {
        const bit = 1 << n;
        const lostHere: string[][] = Array.from({ length: cnt + 1 }, () => []);
        let r = 0;
        for (const op of diffLines(comparable(toLines(parent)), resultLines)) {
            if (op.type === "equal") r++;
            else if (op.type === "insert") flag[r++]! |= bit;
            else lostHere[r]!.push(op.line);
        }
        lost = lost.map((existing, k) =>
            lostHere[k]!.length > 0 ? coalesceLost(existing, lostHere[k]!, bit) : existing,
        );

        // The first line number in this parent if a hunk starts at result line k.
        const numbers: number[] = [];
        let lno = 1;
        for (let k = 0; k <= cnt; k++) {
            numbers[k] = lno;
            lno += lost[k]!.filter(l => l.parents & bit).length;
            if (k < cnt && !(flag[k]! & bit)) lno++;
        }
        numbers[cnt + 1] = lno;
        parentLno[n] = numbers;
    });

    // Which result lines belong to a hunk (make_hunks()).
    const interesting = (k: number) => (flag[k]! & allMask) !== 0 || lost[k]!.length > 0;
    const mark = new Array<boolean>(cnt + 2).fill(false);
    for (let k = 0; k <= cnt; k++) mark[k] = interesting(k);
    const findNext = (from: number, uninteresting: boolean) => {
        let k = from;
        while (k <= cnt && mark[k] === uninteresting) k++;
        return k;
    };
    const adjustTail = (begin: number, k: number) => (begin + 1 <= k && !(flag[k - 1]! & allMask) ? k - 1 : k);

    let i = findNext(0, false);
    if (i > cnt) return [];
    while (i <= cnt) {
        for (let k = Math.max(0, i - context); k < i; k++) mark[k] = true;
        for (;;) {
            let j = findNext(i, true);
            if (j > cnt) {
                i = cnt + 1;
                break;
            }
            const k = findNext(j, false);
            j = adjustTail(i, j);
            if (k < j + context) {
                while (j < k) mark[j++] = true;
                i = k;
                continue;
            }
            i = k;
            const until = Math.min(j + context, cnt + 1);
            while (j < until) mark[j++] = true;
            break;
        }
    }

    // Dense: drop hunks where the result just takes one side's version.
    i = 0;
    while (i <= cnt) {
        while (i <= cnt && !mark[i]) i++;
        if (i > cnt) break;
        const hunkBegin = i;
        let j = i + 1;
        for (; j <= cnt; j++) {
            if (!mark[j]) {
                let la = Math.min(adjustTail(hunkBegin, j) + context, cnt + 1);
                let contin = false;
                while (la && j <= --la) {
                    if (mark[la]) {
                        contin = true;
                        break;
                    }
                }
                if (!contin) break;
                j = la;
            }
        }
        const hunkEnd = j;
        let sameDiff = 0;
        let hasInteresting = false;
        for (let k = i; k < hunkEnd && !hasInteresting; k++) {
            const thisDiff = flag[k]! & allMask;
            if (thisDiff) {
                if (!sameDiff) sameDiff = thisDiff;
                else if (sameDiff !== thisDiff) hasInteresting = true;
            }
            for (const l of lost[k]!) {
                if (hasInteresting) break;
                if (!sameDiff) sameDiff = l.parents;
                else if (sameDiff !== l.parents) hasInteresting = true;
            }
        }
        if (!hasInteresting && sameDiff !== allMask) for (let k = hunkBegin; k < hunkEnd; k++) mark[k] = false;
        i = hunkEnd;
    }

    const out: string[] = [];
    const marker = "@".repeat(parents.length + 1);
    let lno = 0;
    for (;;) {
        while (lno <= cnt && !mark[lno]) lno++;
        if (lno > cnt) break;
        let hunkEnd = lno + 1;
        while (hunkEnd <= cnt && mark[hunkEnd]) hunkEnd++;
        let rlines = hunkEnd - lno;
        if (cnt < hunkEnd) rlines--;
        const ranges = parents.map(
            (_, n) => ` -${parentLno[n]![lno]},${parentLno[n]![hunkEnd]! - parentLno[n]![lno]!}`,
        );
        out.push(`${marker}${ranges.join("")} +${lno + 1},${rlines} ${marker}`);
        for (; lno < hunkEnd; lno++) {
            for (const l of lost[lno]!) {
                const columns = parents.map((_, n) => (l.parents & (1 << n) ? "-" : " ")).join("");
                out.push(...renderLine(columns, l.line));
            }
            if (lno >= cnt) {
                lno = cnt + 1; // the lines lost after the end were the last thing to show
                break;
            }
            const columns = parents.map((_, n) => (flag[lno]! & (1 << n) ? "+" : " ")).join("");
            out.push(...renderLine(columns, resultLines[lno]!));
        }
    }
    if (out.length === 0) return [];
    return [
        `diff --cc ${path}`,
        `index ${parents.map(p => blobId(p).substring(0, 7)).join(",")}..0000000`,
        `--- a/${path}`,
        `+++ b/${path}`,
        ...out,
    ];
}
