import { Terminal } from "lucide-react";

// Function to highlight Git commands and format bold text
export function highlightGitCommands(text: string) {
    // First split by backticks for code
    const parts = text.split(/(`[^`]+`)/g);

    return parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`")) {
            const command = part.slice(1, -1);
            // Check if it's a git command — a command is lime, like in the terminal
            if (command.toLowerCase().includes("git ")) {
                return (
                    <span
                        key={index}
                        className="border-gm-lime-edge bg-gm-void text-gm-lime inline-flex items-center gap-1 rounded-[0.5rem] border-2 px-2 py-0.5 [font-family:var(--font-code)] text-sm">
                        <Terminal className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                        {command}
                    </span>
                );
            }
            // Regular code highlighting for non-git commands
            return (
                <code
                    key={index}
                    className="bg-gm-deep text-gm-ink rounded-[0.5rem] px-1.5 py-0.5 [font-family:var(--font-code)] text-sm">
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
                                <strong key={`${index}-${boldIndex}`} className="text-gm-ink font-semibold">
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
