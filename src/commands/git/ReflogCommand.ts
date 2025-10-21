import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class ReflogCommand implements Command {
    name = "git reflog";
    description = "Manage reflog information";
    usage = "git reflog [options]";
    examples = [
        "git reflog",
        "git reflog --oneline",
        "git reflog --date=relative",
        "git reflog --all"
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, currentDirectory } = context;

        if (!gitRepository.isInitialized()) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        if (!gitRepository.isInRepository(currentDirectory)) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        // Parse options
        const showAll = args.positionalArgs.includes("--all");
        const showOneline = args.positionalArgs.includes("--oneline");
        const showDate = args.positionalArgs.includes("--date=relative") || args.positionalArgs.includes("--date=iso");
        const showRelative = args.positionalArgs.includes("--date=relative");
        const showIso = args.positionalArgs.includes("--date=iso");
        const showShort = args.positionalArgs.includes("--short");
        // Note: These options are parsed but not yet implemented
        // const showExpire = args.positionalArgs.includes("--expire");
        // const showExpireUnreachable = args.positionalArgs.includes("--expire-unreachable");
        // const showDelete = args.positionalArgs.includes("--delete");
        // const showExists = args.positionalArgs.includes("--exists");
        // const showUpdateref = args.positionalArgs.includes("--updateref");
        // const showNoWalk = args.positionalArgs.includes("--no-walk");
        // const showWalk = args.positionalArgs.includes("--walk-reflogs");
        // const showStaleFix = args.positionalArgs.includes("--stale-fix");
        // const showVerbose = args.positionalArgs.includes("-v") || args.positionalArgs.includes("--verbose");
        // const showQuiet = args.positionalArgs.includes("-q") || args.positionalArgs.includes("--quiet");
        const showHelp = args.positionalArgs.includes("-h") || args.positionalArgs.includes("--help");

        if (showHelp) {
            return [`usage: git reflog [<options>] [<ref>]

    --all                 show all refs
    --oneline            show in one line per entry
    --date=<format>      show date in specified format
    --short              show short format
    --expire=<time>      expire entries older than <time>
    --expire-unreachable=<time>  expire unreachable entries older than <time>
    --delete             delete entries
    --exists             check if ref exists
    --updateref          update ref
    --no-walk            don't walk the reflog
    --walk-reflogs       walk the reflog
    --stale-fix          fix stale reflog entries
    -v, --verbose        be verbose
    -q, --quiet          be quiet
    -h, --help           show this help message`];
        }

        // Get reflog entries from git repository
        const reflogEntries = gitRepository.getReflog();

        if (reflogEntries.length === 0) {
            return ["fatal: your current branch 'main' does not have any commits yet"];
        }

        const result: string[] = [];

        // Filter entries based on options
        let entries = reflogEntries;

        if (showAll) {
            // Show all refs (in a real implementation, this would show all branch reflogs)
            entries = reflogEntries;
        }

        // Sort by timestamp (newest first)
        entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Format each entry
        for (const entry of entries) {
            const commitHash = entry.commitHash.substring(0, 8);
            const action = entry.action;
            const message = entry.message;
            const timestamp = new Date(entry.timestamp);

            let dateStr = "";
            if (showDate) {
                if (showRelative) {
                    const now = new Date();
                    const diff = now.getTime() - timestamp.getTime();
                    const minutes = Math.floor(diff / 60000);
                    const hours = Math.floor(diff / 3600000);
                    const days = Math.floor(diff / 86400000);

                    if (days > 0) {
                        dateStr = `${days} day${days > 1 ? 's' : ''} ago`;
                    } else if (hours > 0) {
                        dateStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
                    } else if (minutes > 0) {
                        dateStr = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
                    } else {
                        dateStr = "just now";
                    }
                } else if (showIso) {
                    dateStr = timestamp.toISOString();
                } else {
                    dateStr = timestamp.toLocaleString();
                }
            }

            if (showOneline) {
                result.push(`${commitHash} HEAD@{${entry.index}}: ${action}: ${message}`);
            } else if (showShort) {
                result.push(`${commitHash} ${action}: ${message}`);
            } else {
                const datePart = dateStr ? ` (${dateStr})` : "";
                result.push(`${commitHash} HEAD@{${entry.index}}: ${action}: ${message}${datePart}`);
            }
        }

        return result;
    }
}
