import { Terminal } from "lucide-react";

// Function to highlight Git commands and format bold text
export function highlightGitCommands(text: string) {
    // First split by backticks for code
    const parts = text.split(/(`[^`]+`)/g);

    return parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`")) {
            const command = part.slice(1, -1);
            // Check if it's a git command
            if (command.toLowerCase().includes("git ")) {
                return (
                    <span
                        key={index}
                        className="inline-flex items-center rounded-md border border-gray-700 bg-gray-900 px-2 py-1 font-mono text-sm text-green-400 shadow-md">
                        <Terminal className="mr-1 h-3 w-3" />
                        {command}
                    </span>
                );
            }
            // Regular code highlighting for non-git commands
            return (
                <code key={index} className="rounded bg-purple-800/40 px-1.5 py-0.5 font-mono text-sm text-purple-300">
                    {command}
                </code>
            );
        }

        // Handle bold text with **text**
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        if (boldParts.length > 1) {
            return (
                <span key={index}>
                    {boldParts.map((boldPart, boldIndex) => {
                        if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
                            return (
                                <strong key={`${index}-${boldIndex}`} className="font-semibold text-purple-100">
                                    {boldPart.slice(2, -2)}
                                </strong>
                            );
                        }
                        return boldPart;
                    })}
                </span>
            );
        }

        return part;
    });
}
