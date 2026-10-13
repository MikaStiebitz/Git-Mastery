import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { unknownFlagError } from "../base/GitErrors";
import { decorations, formatGitDate, isoDate, relativeDate, requireRepository } from "../helpers/gitFormat";

export class ReflogCommand implements Command {
    name = "git reflog";
    description = "Manage reflog information";
    usage = "git reflog [show] [<log-options>] [<ref>]";
    examples = [
        "git reflog",
        "git reflog show main",
        "git reflog -n 5",
        "git reflog --date=relative",
        "git reflog exists main",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["all", "no-abbrev", "oneline", "relative-date", "q", "quiet", "no-decorate", "decorate"],
        value: ["n", "max-count", "date", "format", "pretty"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        // `git reflog -3` is `-n 3`.
        const countArg = args.args.find(a => /^-\d+$/.test(a));
        const unknownFlag = args.unknownFlags?.find(f => !/^\d+$/.test(f));
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const positional = [...args.positionalArgs];
        const sub = positional[0];

        if (sub === "exists") {
            const ref = positional[1];
            if (!ref) return ["error: missing ref argument"];
            return repo.getRefLog(ref).length > 0 ? [] : [`error: reflog for '${ref}' does not exist`];
        }
        if (sub === "expire" || sub === "delete") {
            return [
                `hint: 'git reflog ${sub}' is not needed here; this repository keeps its reflog for the whole session.`,
            ];
        }
        if (sub === "show") positional.shift();

        const refArg = positional[0] ?? "HEAD";
        const refName = refArg === "@" ? "HEAD" : refArg;
        const entries = repo.getRefLog(refName);

        if (entries.length === 0) {
            if (refName === "HEAD" && repo.getHeadCommitId() === null) {
                return [`fatal: your current branch '${repo.getCurrentBranch()}' does not have any commits yet`];
            }
            if (refName !== "HEAD" && !repo.fullRefName(refName)) {
                return [
                    `fatal: ambiguous argument '${refArg}': unknown revision or path not in the working tree.`,
                    "Use '--' to separate paths from revisions, like this:",
                    "'git <command> [<revision>...] -- [<file>...]'",
                ];
            }
            return [];
        }

        const limitRaw = args.flags.n ?? args.flags["max-count"];
        const limit =
            typeof limitRaw === "string"
                ? parseInt(limitRaw, 10)
                : countArg !== undefined
                  ? parseInt(countArg.substring(1), 10)
                  : Infinity;
        const dateMode =
            typeof args.flags.date === "string"
                ? args.flags.date
                : args.flags["relative-date"] !== undefined
                  ? "relative"
                  : null;
        const fullHash = args.flags["no-abbrev"] !== undefined;
        const decorate = args.flags["no-decorate"] === undefined;

        // A reflog of a branch is addressed as <branch>@{n}; HEAD's as HEAD@{n}.
        const label = refName === "HEAD" ? "HEAD" : refName.replace(/^refs\/(heads|remotes)\//, "");

        // Entries that recorded the ref going away (a branch rename leaves one) are not shown, but
        // still count for the @{n} numbering.
        const shown = entries
            .map((entry, index) => ({ entry, index }))
            .filter(({ entry }) => !/^0+$/.test(entry.newId));
        return shown.slice(0, Number.isFinite(limit) ? limit : undefined).map(({ entry, index }) => {
            const hash = fullHash ? entry.newId : repo.abbrev(entry.newId);
            const decoration = decorate ? decorations(repo, entry.newId) : "";
            let selector = `${label}@{${index}}`;
            if (dateMode === "relative") selector = `${label}@{${relativeDate(entry.timestamp)}}`;
            else if (dateMode === "iso") selector = `${label}@{${isoDate(entry.timestamp)}}`;
            else if (dateMode) selector = `${label}@{${formatGitDate(entry.timestamp)}}`;
            return `${hash}${decoration} ${selector}: ${entry.message}`;
        });
    }
}
