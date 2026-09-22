import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { buildCommitGraph } from "~/lib/buildCommitGraph";

export class LogCommand implements Command {
    name = "git log";
    description = "Show commit logs";
    usage = "git log [options]";
    examples = ["git log", "git log --oneline", "git log --graph"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "oneline",
            "graph",
            "all",
            "decorate",
            "no-decorate",
            "stat",
            "p",
            "patch",
            "name-only",
            "name-status",
            "reverse",
            "merges",
            "no-merges",
            "abbrev-commit",
            "first-parent",
            "follow",
            "q",
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
        ],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, currentDirectory } = context;

        if (!gitRepository.isInitialized()) {
            return ["Not a git repository. Run 'git init' first."];
        }
        if (!gitRepository.isInRepository(currentDirectory)) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        // Flags (support both parsed flags and raw positional tokens for robustness)
        const tokens = args.positionalArgs ?? [];
        const isOneline = args.flags.oneline !== undefined || tokens.includes("--oneline");
        const showGraph = args.flags.graph !== undefined || tokens.includes("--graph");

        // Parse --author and --grep (support --key=value or --key value)
        const getOptionValue = (key: string): string | undefined => {
            const eqToken = tokens.find(t => t.startsWith(`${key}=`));
            if (eqToken) return eqToken.substring(key.length + 1).replace(/^"|"$/g, "");
            const idx = tokens.indexOf(key);
            if (idx !== -1) {
                const next = tokens[idx + 1];
                if (typeof next === "string") {
                    return next.replace(/^"|"$/g, "");
                }
            }
            return undefined;
        };

        const authorFilter = getOptionValue("--author");
        const grepFilter = getOptionValue("--grep");

        // --graph uses all commits across all branches, ignoring author/grep filters
        if (showGraph) {
            const allCommits = gitRepository.getAllCommits();
            if (Object.keys(allCommits).length === 0) {
                return ["No commits yet"];
            }
            // Enrich each commit with a pseudo-author (not stored in the model)
            const pseudoAuthors = ["Sam", "Alex", "Taylor", "Lee"];
            const getPseudoAuthor = (id: string) =>
                pseudoAuthors[Math.abs(id.charCodeAt(0) || 0) % pseudoAuthors.length] ?? "Unknown";
            const enriched = Object.fromEntries(
                Object.entries(allCommits).map(([id, c]) => [id, { ...c, author: getPseudoAuthor(id) }]),
            );
            const branchHeads = gitRepository.getBranchHeads();
            const currentBranch = gitRepository.getCurrentBranch();
            const graph = buildCommitGraph(enriched, branchHeads, currentBranch);
            return [`__GIT_GRAPH__:${JSON.stringify(graph)}`];
        }

        const commits = gitRepository.getCommits();

        if (Object.keys(commits).length === 0) {
            return ["No commits yet"];
        }

        const output: string[] = [];

        // Deterministic pseudo-author assignment for simulation purposes
        const pseudoAuthors: string[] = ["Sam", "Alex", "Taylor", "Lee"];
        const getPseudoAuthor = (id: string): string => {
            const idx = Math.abs(id.charCodeAt(0) || 0) % pseudoAuthors.length;
            const a = pseudoAuthors[idx];
            return a ?? "Unknown";
        };

        // Build list newest-first, then apply filters
        const commitEntries = Object.entries(commits).reverse();

        const filtered = commitEntries.filter(([id, commit]) => {
            const author = getPseudoAuthor(id) || "Unknown";
            const authorOk = authorFilter ? author.toLowerCase().includes((authorFilter ?? "").toLowerCase()) : true;
            const grepOk = grepFilter ? commit.message.toLowerCase().includes((grepFilter ?? "").toLowerCase()) : true;
            return authorOk && grepOk;
        });

        // If filters remove everything, show friendly message (mimics Git's empty result)
        if (filtered.length === 0) {
            return [];
        }

        filtered.forEach(([commitId, commit]) => {
            const shortId = commitId.substring(0, 7);
            const date = commit.timestamp.toISOString().split("T")[0];
            const author = getPseudoAuthor(commitId);

            if (isOneline) {
                output.push(`${shortId} ${commit.message}`);
            } else {
                output.push(`commit ${commitId}`);
                output.push(`Author: ${author}`);
                output.push(`Date: ${date}`);
                output.push("");
                output.push(`    ${commit.message}`);
                output.push("");
            }
        });

        return output;
    }
}
