/**
 * Git's revision syntax (gitrevisions(7)), resolved against the simulated repository.
 *
 * Supported, as in real Git:
 *   <sha1>                full or abbreviated (at least 4 hex digits) commit id
 *   <refname>             HEAD, @, branch, tag, remote-tracking branch (origin/main), remote (origin),
 *                         refs/heads/x, refs/tags/x, refs/remotes/o/x, ORIG_HEAD, MERGE_HEAD, FETCH_HEAD,
 *                         CHERRY_PICK_HEAD, REVERT_HEAD, stash
 *   <ref>@{<n>}           the n-th prior value of a ref, from its reflog (HEAD@{1}, main@{2}, stash@{0})
 *   @{<n>}                the n-th prior value of the current branch
 *   @{-<n>}               the n-th branch checked out before the current one (also "-" in commands)
 *   <ref>@{u}, @{upstream} the upstream of a branch
 *   <rev>~<n>, <rev>~     the n-th first-parent ancestor
 *   <rev>^<n>, <rev>^     the n-th parent (^0 is the commit itself)
 *   <rev>^{commit}, ^{}   peel to a commit
 */

export type ReflogEntry = {
    oldId: string;
    newId: string;
    message: string;
    timestamp: Date;
};

export interface RevisionContext {
    /** Commit id a ref name points to; "unborn" for a branch without commits; null if unknown. */
    resolveRefName(name: string): string | "unborn" | null;
    /** Reflog of a ref (full name such as "HEAD" or "refs/heads/main"), newest entry first. */
    getReflog(fullRefName: string): ReflogEntry[];
    /** Full ref name for a short one ("main" → "refs/heads/main"), or null. */
    fullRefName(name: string): string | null;
    currentBranch(): string | null;
    /** The n-th previously checked-out branch (or commit, if HEAD was detached), 1-based. */
    previousCheckout(n: number): string | null;
    upstreamOf(branch: string): string | null;
    commitIdsWithPrefix(prefix: string): string[];
    parentsOf(id: string): string[] | null;
}

export type RevisionResult =
    | { ok: true; id: string }
    | {
          ok: false;
          reason: "unknown" | "unborn" | "ambiguous" | "reflog-too-short" | "no-upstream";
          message?: string[];
      };

const SUFFIX = /(\^\{[a-z]*\}|\^[0-9]*|~[0-9]*)$/;

export function resolveRevision(spec: string, ctx: RevisionContext): RevisionResult {
    if (!spec || /\s/.test(spec) || spec.includes("..")) return { ok: false, reason: "unknown" };

    // Peel suffixes off the right-hand end first; they apply innermost-first.
    const suffixes: string[] = [];
    let base = spec;
    let match: RegExpMatchArray | null;
    while ((match = SUFFIX.exec(base)) && match.index !== undefined && match.index > 0) {
        suffixes.unshift(match[1]!);
        base = base.substring(0, match.index);
    }

    const resolvedBase = resolveBase(base, ctx);
    if (!resolvedBase.ok) return resolvedBase;

    let id = resolvedBase.id;
    for (const suffix of suffixes) {
        if (suffix.startsWith("^{")) continue; // everything here is already a commit

        const isTilde = suffix.startsWith("~");
        const count = suffix.length === 1 ? 1 : parseInt(suffix.substring(1), 10);

        if (isTilde) {
            for (let i = 0; i < count; i++) {
                const parents = ctx.parentsOf(id);
                if (!parents || parents.length === 0) return { ok: false, reason: "unknown" };
                id = parents[0]!;
            }
        } else if (count > 0) {
            const parents = ctx.parentsOf(id);
            const parent = parents?.[count - 1];
            if (!parent) return { ok: false, reason: "unknown" };
            id = parent;
        }
    }

    return { ok: true, id };
}

function resolveBase(base: string, ctx: RevisionContext): RevisionResult {
    // <ref>@{...}
    const at = /^(.*)@\{(.+)\}$/.exec(base);
    if (at) {
        const refPart = at[1]!;
        const selector = at[2]!;

        // @{-n}: previously checked-out branch
        if (refPart === "" && /^-\d+$/.test(selector)) {
            const previous = ctx.previousCheckout(parseInt(selector.substring(1), 10));
            if (!previous) return { ok: false, reason: "unknown" };
            return resolveBase(previous, ctx);
        }

        // @{u} / @{upstream} / @{push}
        if (["u", "upstream", "push"].includes(selector.toLowerCase())) {
            const branch = refPart === "" || refPart === "HEAD" ? ctx.currentBranch() : refPart;
            const upstream = branch ? ctx.upstreamOf(branch) : null;
            if (!branch || !upstream) {
                return {
                    ok: false,
                    reason: "no-upstream",
                    message: [`fatal: no upstream configured for branch '${branch ?? "HEAD"}'`],
                };
            }
            return resolveBase(upstream, ctx);
        }

        // @{n}: reflog entry
        if (/^\d+$/.test(selector)) {
            const n = parseInt(selector, 10);
            let fullName: string | null;
            let displayName: string;
            if (refPart === "") {
                const current = ctx.currentBranch();
                fullName = current ? `refs/heads/${current}` : "HEAD";
                displayName = current ?? "HEAD";
            } else if (refPart === "HEAD" || refPart === "@") {
                fullName = "HEAD";
                displayName = "HEAD";
            } else {
                fullName = ctx.fullRefName(refPart);
                displayName = refPart;
            }
            if (!fullName) return { ok: false, reason: "unknown" };

            const log = ctx.getReflog(fullName);
            if (log.length === 0) return { ok: false, reason: "unknown" };
            if (n === 0) return { ok: true, id: log[0]!.newId };
            const entry = log[n];
            // An entry that records the ref going away (a rename) leaves the value as it was.
            if (entry && /^0+$/.test(entry.newId)) return { ok: true, id: log[n - 1]?.newId ?? entry.oldId };
            if (entry) return { ok: true, id: entry.newId };
            // The oldest entry's "before" value is reachable as the entry just past the end.
            if (n === log.length && /^0+$/.test(log[n - 1]!.oldId) === false) {
                return { ok: true, id: log[n - 1]!.oldId };
            }
            return {
                ok: false,
                reason: "reflog-too-short",
                message: [`fatal: log for '${displayName}' only has ${log.length} entries`],
            };
        }

        return { ok: false, reason: "unknown" };
    }

    if (base === "@") return resolveBase("HEAD", ctx);

    // A ref name wins over a hex prefix, exactly as in Git.
    const ref = ctx.resolveRefName(base);
    if (ref === "unborn") return { ok: false, reason: "unborn" };
    if (ref) return { ok: true, id: ref };

    if (/^[0-9a-f]{4,40}$/i.test(base)) {
        const matches = ctx.commitIdsWithPrefix(base.toLowerCase());
        if (matches.length === 1) return { ok: true, id: matches[0]! };
        if (matches.length > 1) {
            return {
                ok: false,
                reason: "ambiguous",
                message: [
                    `error: short object ID ${base} is ambiguous`,
                    "hint: The candidates are:",
                    ...matches.map(id => `hint:   ${id.substring(0, 7)} commit`),
                ],
            };
        }
    }

    return { ok: false, reason: "unknown" };
}

/**
 * Real Git's error for an argument that is neither a revision nor a path. (Git really does print
 * the literal "<command>" placeholder in the last line.)
 */
export function ambiguousArgument(arg: string, _command?: string): string[] {
    return [
        `fatal: ambiguous argument '${arg}': unknown revision or path not in the working tree.`,
        "Use '--' to separate paths from revisions, like this:",
        "'git <command> [<revision>...] -- [<file>...]'",
    ];
}
