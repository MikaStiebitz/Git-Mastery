import React from "react";
import { GitGraph } from "~/components/GitGraph";
import type { CommitGraph } from "~/lib/buildCommitGraph";

const GIT_GRAPH_PREFIX = "__GIT_GRAPH__:";

/**
 * Terminal output follows the Git legend: lime for commands and anything that succeeded,
 * cyan for branches and directories, coral for danger or lost work, dim ink for the rest.
 */
export class OutputFormatterService {
    constructor(private terminalOutput: string[]) {}

    /**
     * One line of a unified diff, or null when this is not diff output.
     *
     * Added and removed lines get a tinted band as well as a colour: colour alone puts the whole
     * burden on hue, and a diff is exactly the place where someone red-green colourblind needs the
     * shape of the block to tell them where a change starts and stops. The leading +/- is kept —
     * it is what real diffs show, and it is the non-colour signal.
     */
    private renderDiffLine(line: string): React.ReactNode | null {
        // File header: "diff --git a/src/config.js b/src/config.js"
        if (line.startsWith("diff --git ")) {
            return <div className="mt-2 font-semibold text-[var(--term-text)]">{line}</div>;
        }

        // Blob ids — true to real Git, and the least interesting line on screen.
        if (/^index [0-9a-f]+\.\.[0-9a-f]+/.test(line)) {
            return <div className="text-[var(--term-text)] opacity-50">{line}</div>;
        }

        // The two sides of the comparison.
        if (line.startsWith("--- ")) {
            return <div className="text-[var(--term-error)] opacity-80">{line}</div>;
        }
        if (line.startsWith("+++ ")) {
            return <div className="text-[var(--term-success)] opacity-80">{line}</div>;
        }

        // Hunk header: "@@ -1,3 +1,3 @@" — which lines of the file this block covers.
        if (/^@@ -\d+(,\d+)? \+\d+(,\d+)? @@/.test(line)) {
            return (
                <div className="mt-1 bg-[color-mix(in_oklab,var(--term-accent)_14%,transparent)] px-1 font-semibold text-[var(--term-accent)]">
                    {line}
                </div>
            );
        }

        // The changes themselves. A leading +/- only means "added/removed" inside a diff, so this
        // needs a diff to actually be on screen — otherwise any other command that happens to print
        // a dashed list would come out looking like deletions.
        if (!this.terminalOutput.some(l => l.startsWith("diff --git "))) return null;

        // Guarded against "--" / "++" so the headers above can never reach here, and against a
        // bare "-" or "+" on its own.
        if (line.length > 1 && line.startsWith("-") && !line.startsWith("--")) {
            return (
                <div className="bg-[color-mix(in_oklab,var(--term-error)_16%,transparent)] px-1 text-[var(--term-error)]">
                    {line}
                </div>
            );
        }
        if (line.length > 1 && line.startsWith("+") && !line.startsWith("++")) {
            return (
                <div className="bg-[color-mix(in_oklab,var(--term-success)_16%,transparent)] px-1 text-[var(--term-success)]">
                    {line}
                </div>
            );
        }

        return null;
    }

    renderTerminalOutput(line: string): React.ReactNode {
        // Render inline SVG git graph
        if (line.startsWith(GIT_GRAPH_PREFIX)) {
            try {
                const raw = JSON.parse(line.substring(GIT_GRAPH_PREFIX.length)) as CommitGraph;
                // Dates are serialized as strings — restore them
                const graph = {
                    ...raw,
                    nodes: raw.nodes.map(n => ({ ...n, timestamp: new Date(n.timestamp) })),
                };
                return (
                    <div className="gm-scroll overflow-x-auto py-2">
                        <GitGraph graph={graph} />
                    </div>
                );
            } catch {
                return <div className="text-[var(--term-error)]">Failed to render git graph</div>;
            }
        }

        // Check if this is a command line (starts with $)
        if (line.startsWith("$")) {
            const cmd = line.substring(1).trim();
            const parts = cmd.split(" ");

            if (parts[0] === "git") {
                return (
                    <div>
                        <span className="text-[var(--term-prompt)] select-none">$</span>{" "}
                        <span className="text-[var(--term-prompt)]">git</span>{" "}
                        <span className="text-[var(--term-text)]">{parts.slice(1).join(" ")}</span>
                    </div>
                );
            }

            return (
                <div>
                    <span className="text-[var(--term-prompt)] select-none">$</span>{" "}
                    <span className="text-[var(--term-text)]">{cmd}</span>
                </div>
            );
        }

        // A diff, coloured. This has to be tested before anything else, because every other rule
        // below would claim these lines first: "--- a/file" and "+++ b/file" start with - and +,
        // "diff --git" contains "git", and a hunk header is mostly punctuation. Unhighlighted, a
        // diff is the single most opaque thing this terminal prints — the whole point is that you
        // can see at a glance which line went and which line arrived.
        const diffLine = this.renderDiffLine(line);
        if (diffLine) return diffLine;

        // Teaching lines. Git prefixes its own advice with "hint:" and so do we; they are
        // deliberately quieter than the error they explain, so the error stays the headline.
        if (line.startsWith("hint:")) {
            return (
                <div className="text-[var(--term-text)] opacity-65">
                    <span className="opacity-70 select-none">hint:</span>
                    {line.slice(5)}
                </div>
            );
        }

        // Git's own failure lines — coral is the danger colour in the legend
        if (line.startsWith("error:") || line.startsWith("fatal:")) {
            return (
                <div>
                    <span className="text-[var(--term-error)]">{line}</span>
                </div>
            );
        }

        // Add folder highlighting for directory listings
        if (line.trim().endsWith("/") && !line.includes(":")) {
            return (
                <div>
                    <span className="text-[var(--term-accent)]">{line}</span>
                </div>
            );
        }

        // Match git status output patterns
        if (line.includes("new file:")) {
            return (
                <div>
                    <span className="text-[var(--term-success)]">{line}</span>
                </div>
            );
        }
        if (line.includes("modified:")) {
            return (
                <div>
                    <span className="text-[var(--term-warning)]">{line}</span>
                </div>
            );
        }
        if (line.includes("deleted:")) {
            return (
                <div>
                    <span className="text-[var(--term-error)]">{line}</span>
                </div>
            );
        }
        if (line.includes("Initialized empty Git")) {
            return (
                <div>
                    <span className="text-[var(--term-success)]">{line}</span>
                </div>
            );
        }
        if (line.includes("branch")) {
            return (
                <div>
                    <span className="text-[var(--term-accent)]">{line}</span>
                </div>
            );
        }

        // Handle untracked files section in git status output
        if (line.trim() === "Untracked files:") {
            return (
                <div>
                    <span className="font-semibold text-[var(--term-error)]">{line}</span>
                </div>
            );
        }

        // Color specific files listed under "Untracked files:"
        if (
            line.trim().startsWith("  ") &&
            !line.includes(":") &&
            this.terminalOutput.some(l => l.includes("Untracked files:"))
        ) {
            return (
                <div>
                    <span className="text-[var(--term-warning)]">{line}</span>
                </div>
            );
        }

        // Changes to be committed (staged files) - header
        if (line.trim() === "Changes to be committed:") {
            return (
                <div>
                    <span className="font-semibold text-[var(--term-success)]">{line}</span>
                </div>
            );
        }

        // Working tree clean message
        if (line.includes("working tree clean")) {
            return (
                <div>
                    <span className="text-[var(--term-success)]">{line}</span>
                </div>
            );
        }

        // Directory listing - highlight directories with cyan
        // This is for the ls command output
        const dirRegex = /^(.+)\/$/;
        const dirMatch = dirRegex.exec(line);
        if (dirMatch) {
            return (
                <div>
                    <span className="font-medium text-[var(--term-accent)]">{line}</span>
                </div>
            );
        }

        // Default formatting - use non-breaking space for empty lines to preserve height
        return <div className="text-[var(--term-text)] opacity-80">{line || "\u00A0"}</div>;
    }
}
