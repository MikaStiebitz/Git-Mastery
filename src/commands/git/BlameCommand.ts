import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { diffLines, toLines } from "~/models/git/diff";
import { unknownFlagError } from "../base/GitErrors";
import { isoDate, requireRepository, revisionError, toRepoPath } from "../helpers/gitFormat";

export class BlameCommand implements Command {
    name = "git blame";
    description = "Show what revision and author last modified each line of a file";
    usage = "git blame [<options>] [<rev>] [--] <file>";
    examples = [
        "git blame file.txt",
        "git blame -L 10,20 file.txt",
        "git blame -e file.txt",
        "git blame HEAD~2 -- file.txt",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "s",
            "e",
            "show-email",
            "w",
            "f",
            "show-name",
            "n",
            "show-number",
            "l",
            "p",
            "porcelain",
            "line-porcelain",
            "c",
            "t",
            "root",
        ],
        value: ["L", "C", "M", "abbrev"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const positional = args.positionalArgs;
        if (positional.length === 0) return [`usage: ${this.usage}`];

        const fileArg = positional[positional.length - 1]!;
        const revArg = positional.length > 1 ? positional[0] : undefined;
        const path = toRepoPath(context, fileArg);
        if (path === null) return [`fatal: '${fileArg}' is outside repository`];

        const headId = revArg ? repo.resolveCommit(revArg) : repo.getHeadCommitId();
        if (revArg && !headId) return revisionError(repo, revArg, "blame");
        if (!headId) return [`fatal: no such ref: HEAD`];

        // Without a revision, blame the working-tree version (uncommitted lines are "Not Committed Yet").
        const committed = repo.treeOf(headId)[path];
        const working = revArg ? committed : (context.fileSystem.getFileContents(repo.toFsPath(path)) ?? undefined);
        if (committed === undefined) {
            if (working !== undefined && !revArg) return [`fatal: no such path '${path}' in HEAD`];
            return [`fatal: no such path '${path}' in ${revArg ?? "HEAD"}`];
        }
        if (working === undefined) return [`fatal: cannot stat path '${fileArg}': No such file or directory`];

        const lines = toLines(working).lines;
        // owner[i] = commit id for line i; "" = not committed yet
        const owner: (string | null)[] = new Array<string | null>(lines.length).fill(null);

        // Map working lines onto the HEAD version first.
        let pending: { index: number; line: number }[] = [];
        {
            const ops = diffLines(toLines(committed).lines, lines);
            let oldLine = 0;
            let newLine = 0;
            for (const op of ops) {
                if (op.type === "equal") pending.push({ index: newLine, line: oldLine });
                if (op.type === "insert") owner[newLine] = "";
                if (op.type !== "insert") oldLine++;
                if (op.type !== "delete") newLine++;
            }
        }

        // Walk first-parent history, passing each line's blame to the parent while it is unchanged.
        let current = headId;
        while (pending.length > 0) {
            const commit = repo.getCommit(current)!;
            const parentId = commit.parents[0];
            const parentContent = parentId ? repo.treeOf(parentId)[path] : undefined;
            if (parentId === undefined || parentContent === undefined) {
                pending.forEach(p => (owner[p.index] = current));
                break;
            }
            const ops = diffLines(toLines(parentContent).lines, toLines(commit.tree[path]!).lines);
            const toParent = new Map<number, number>();
            let oldLine = 0;
            let newLine = 0;
            for (const op of ops) {
                if (op.type === "equal") toParent.set(newLine, oldLine);
                if (op.type !== "insert") oldLine++;
                if (op.type !== "delete") newLine++;
            }
            const next: { index: number; line: number }[] = [];
            for (const p of pending) {
                const parentLine = toParent.get(p.line);
                if (parentLine === undefined) owner[p.index] = current;
                else next.push({ index: p.index, line: parentLine });
            }
            pending = next;
            current = parentId;
        }

        // -L start,end
        let start = 1;
        let end = lines.length;
        const range = typeof args.flags.L === "string" ? args.flags.L : undefined;
        if (range) {
            const match = /^(\d+)(?:,(\+?)(\d+))?$/.exec(range);
            if (!match) return [`fatal: -L parameter '${range}' starting at line 1: No such line`];
            start = parseInt(match[1]!, 10);
            end = match[3] ? (match[2] ? start + parseInt(match[3], 10) - 1 : parseInt(match[3], 10)) : lines.length;
            if (start > lines.length)
                return [`fatal: file ${path} has only ${lines.length} line${lines.length === 1 ? "" : "s"}`];
            end = Math.min(end, lines.length);
        }

        const showEmail = args.flags.e !== undefined || args.flags["show-email"] !== undefined;
        const suppress = args.flags.s !== undefined;
        const longHash = args.flags.l !== undefined;
        const user = repo.getUser();

        const rows = lines.slice(start - 1, end).map((text, offset) => {
            const i = start - 1 + offset;
            const id = owner[i] ?? "";
            const commit = id ? repo.getCommit(id)! : null;
            const isRoot = commit !== null && commit.parents.length === 0;
            const hash =
                id === ""
                    ? "0".repeat(longHash ? 40 : 8)
                    : longHash
                      ? id
                      : (isRoot ? "^" : "") + id.substring(0, isRoot ? 7 : 8);
            const who = commit
                ? showEmail
                    ? `<${commit.email}>`
                    : commit.author
                : showEmail
                  ? `<${user.email}>`
                  : "Not Committed Yet";
            const when = commit ? isoDate(commit.timestamp) : isoDate(new Date());
            return { hash, who, when, number: i + 1, text };
        });

        const whoWidth = Math.max(...rows.map(r => r.who.length), 0);
        const numWidth = String(end).length;
        return rows.map(r =>
            suppress
                ? `${r.hash} ${String(r.number).padStart(numWidth)}) ${r.text}`
                : `${r.hash} (${r.who.padEnd(whoWidth)} ${r.when} ${String(r.number).padStart(numWidth)}) ${r.text}`,
        );
    }
}
