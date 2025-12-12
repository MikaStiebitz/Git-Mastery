import { Github, FileIcon, X, Circle, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import type { TerminalPromptProps } from "../types";

export function TerminalPrompt({
    currentDirectory,
    isGitInitialized,
    branch,
    stagedCount,
    modifiedCount,
    untrackedCount,
    unpushedCommitsCount,
    unpulledCommitsCount,
}: TerminalPromptProps) {
    // Format display path
    const displayPath = currentDirectory === "/" ? "/" : currentDirectory;
    const pathSegments = displayPath.split("/").filter(Boolean);
    const shortPath = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "/";

    // Truncate long branch names for display
    const truncateBranchName = (branchName: string, maxLength: number = 15) => {
        if (branchName.length <= maxLength) return branchName;
        return branchName.slice(0, maxLength - 3) + "...";
    };

    const displayBranch = truncateBranchName(branch);

    return (
        <div className="flex max-w-full flex-wrap items-center space-x-1">
            {/* Username segment */}
            <span className="whitespace-nowrap rounded-r bg-gradient-to-r from-purple-700 to-purple-600 px-2 py-0.5 text-xs text-white">
                user@gitmastery
            </span>

            {/* Directory segment */}
            <span className="flex items-center whitespace-nowrap rounded bg-gradient-to-r from-purple-600 to-purple-500 px-2 py-0.5 text-xs text-white">
                <FileIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                <span className="max-w-[80px] truncate" title={shortPath}>
                    {shortPath}
                </span>
            </span>

            {/* Git segment - only show if initialized */}
            {isGitInitialized && (
                <span
                    className={`flex max-w-[200px] items-center rounded px-2 py-0.5 text-xs text-white ${
                        stagedCount || modifiedCount || untrackedCount
                            ? "bg-gradient-to-r from-yellow-700 to-yellow-600"
                            : "bg-gradient-to-r from-green-700 to-green-600"
                    }`}
                    title={branch !== displayBranch ? branch : undefined}>
                    <Github className="mr-1 h-3 w-3 flex-shrink-0" />
                    <span className="min-w-0 flex-shrink truncate">{displayBranch}</span>

                    {/* Git status indicators - flex-shrink-0 to prevent compression */}
                    <div className="ml-1 flex flex-shrink-0 items-center space-x-1">
                        {stagedCount > 0 && (
                            <span className="flex items-center text-green-300">
                                <Circle className="mr-0.5 h-2 w-2 fill-current" />
                                {stagedCount}
                            </span>
                        )}

                        {modifiedCount > 0 && (
                            <span className="flex items-center text-yellow-300">
                                <Circle className="mr-0.5 h-2 w-2 fill-current" />
                                {modifiedCount}
                            </span>
                        )}

                        {untrackedCount > 0 && (
                            <span className="flex items-center text-red-300">
                                <X className="h-3 w-3" />
                                {untrackedCount}
                            </span>
                        )}

                        {/* Unpushed commits indicator */}
                        {unpushedCommitsCount > 0 && (
                            <span className="flex items-center text-blue-300">
                                <ArrowUpIcon className="mr-0.5 h-3 w-3" />
                                {unpushedCommitsCount}
                            </span>
                        )}

                        {/* Unpulled commits indicator (available to pull from remote) */}
                        {unpulledCommitsCount > 0 && (
                            <span className="flex items-center text-cyan-300">
                                <ArrowDownIcon className="mr-0.5 h-3 w-3" />
                                {unpulledCommitsCount}
                            </span>
                        )}
                    </div>
                </span>
            )}

            {/* Command prompt symbol */}
            <span className="flex-shrink-0 text-purple-400">λ</span>
        </div>
    );
}
