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
