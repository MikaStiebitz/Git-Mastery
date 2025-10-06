import type { CommandContext } from "../base/Command";

/**
 * Check if current directory is within a git repository
 * Returns error message if not, null if okay
 */
export function checkGitRepository(context: CommandContext): string | null {
    const { gitRepository, currentDirectory } = context;

    if (!gitRepository.isInitialized()) {
        return "fatal: not a git repository (or any of the parent directories): .git";
    }

    if (!gitRepository.isInRepository(currentDirectory)) {
        return "fatal: not a git repository (or any of the parent directories): .git";
    }

    return null;
}
