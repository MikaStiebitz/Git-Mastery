export interface EmojiSuggestion {
    emoji: string;
    description: string;
    keywords: string[];
}

export const EMOJI_SUGGESTIONS: EmojiSuggestion[] = [
    // Feature and additions
    { emoji: "✨", description: "Add new feature", keywords: ["feat", "feature", "add", "new", "implement"] },
    {
        emoji: "🎉",
        description: "Initial commit or major milestone",
        keywords: ["initial", "init", "milestone", "release"],
    },
    {
        emoji: "🚀",
        description: "Deploy or performance improvement",
        keywords: ["deploy", "launch", "performance", "optimize"],
    },

    // Bug fixes
    { emoji: "🐛", description: "Fix a bug", keywords: ["fix", "bug", "error", "issue", "patch"] },
    { emoji: "🚑", description: "Critical hotfix", keywords: ["hotfix", "critical", "urgent", "emergency"] },
    { emoji: "🩹", description: "Simple fix or patch", keywords: ["patch", "small", "minor", "quick"] },

    // Documentation
    {
        emoji: "📚",
        description: "Add or update documentation",
        keywords: ["docs", "documentation", "readme", "comment"],
    },
    { emoji: "💡", description: "Add or update comments in source code", keywords: ["comment", "explain", "clarify"] },

    // Code quality and refactoring
    { emoji: "♻️", description: "Refactor code", keywords: ["refactor", "restructure", "cleanup", "improve"] },
    {
        emoji: "🎨",
        description: "Improve structure/format of code",
        keywords: ["format", "style", "structure", "lint"],
    },
    { emoji: "⚡", description: "Improve performance", keywords: ["performance", "optimize", "speed", "fast"] },
    {
        emoji: "🔧",
        description: "Add or update configuration files",
        keywords: ["config", "configuration", "settings"],
    },

    // Testing
    { emoji: "✅", description: "Add or update tests", keywords: ["test", "testing", "spec", "unit"] },
    { emoji: "🧪", description: "Add experimental features", keywords: ["experiment", "experimental", "wip", "draft"] },

    // Dependencies and build
    { emoji: "⬆️", description: "Upgrade dependencies", keywords: ["upgrade", "update", "dependency", "bump"] },
    { emoji: "⬇️", description: "Downgrade dependencies", keywords: ["downgrade", "revert", "rollback"] },
    {
        emoji: "📦",
        description: "Add or update compiled files or packages",
        keywords: ["build", "compile", "package", "bundle"],
    },

    // Git operations
    { emoji: "🔀", description: "Merge branches", keywords: ["merge", "branch", "combine"] },
    { emoji: "🔄", description: "Revert changes", keywords: ["revert", "undo", "rollback", "restore"] },
    { emoji: "🏷️", description: "Add or update tags", keywords: ["tag", "version", "release"] },

    // Files and directories
    { emoji: "🗃️", description: "Changes to data or database", keywords: ["data", "database", "db", "migration"] },
    { emoji: "📝", description: "Add or update text files", keywords: ["text", "content", "copy", "write"] },
    { emoji: "🙈", description: "Add or update .gitignore file", keywords: ["gitignore", "ignore", "exclude"] },

    // Security and accessibility
    { emoji: "🔒", description: "Fix security issues", keywords: ["security", "auth", "permission", "vulnerability"] },
    { emoji: "♿", description: "Improve accessibility", keywords: ["accessibility", "a11y", "inclusive"] },

    // UI/UX
    {
        emoji: "💄",
        description: "Add or update the UI and style files",
        keywords: ["ui", "style", "css", "design", "visual"],
    },
    {
        emoji: "📱",
        description: "Work on responsive design",
        keywords: ["responsive", "mobile", "tablet", "breakpoint"],
    },

    // Infrastructure and DevOps
    {
        emoji: "🔨",
        description: "Add or update development scripts",
        keywords: ["script", "dev", "development", "tool"],
    },
    { emoji: "👷", description: "Add or update CI build system", keywords: ["ci", "build", "pipeline", "workflow"] },
    { emoji: "💚", description: "Fix CI Build", keywords: ["ci", "build", "fix", "pipeline"] },
];

export function getEmojiSuggestions(commitMessage: string): EmojiSuggestion[] {
    const lowerMessage = commitMessage.toLowerCase();
    const words = lowerMessage.split(/\s+/);

    const suggestions = EMOJI_SUGGESTIONS.filter(suggestion => {
        return suggestion.keywords.some(keyword =>
            words.some(word => word.includes(keyword) || keyword.includes(word)),
        );
    });

    // If no specific matches, return some general suggestions
    if (suggestions.length === 0) {
        return EMOJI_SUGGESTIONS.slice(0, 5); // Return first 5 as fallback
    }

    // Sort by relevance (how many keywords match)
    suggestions.sort((a, b) => {
        const aMatches = a.keywords.filter(keyword =>
            words.some(word => word.includes(keyword) || keyword.includes(word)),
        ).length;
        const bMatches = b.keywords.filter(keyword =>
            words.some(word => word.includes(keyword) || keyword.includes(word)),
        ).length;

        return bMatches - aMatches;
    });

    return suggestions.slice(0, 6); // Return top 6 suggestions
}

export function formatCommitWithEmoji(emoji: string, message: string): string {
    // Remove existing emoji at the start if any
    const cleanMessage = message
        .replace(
            /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u,
            "",
        )
        .trim();

    return `${emoji} ${cleanMessage}`;
}
