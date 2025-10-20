import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class InitCommand implements Command {
    name = "git init";
    description = "Initialize a new Git repository";
    usage = "git init";
    examples = ["git init"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    execute(_args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, fileSystem, currentDirectory } = context;

        // Check if .git directory already exists in THIS exact directory
        const gitPath = currentDirectory === '/' ? '/.git' : `${currentDirectory}/.git`;
        const hasGitDir = fileSystem.getDirectoryContents(gitPath) !== null;

        // If git repo exists in this exact directory and it's our repo, reinitialize
        if (hasGitDir && gitRepository.isInitialized() && gitRepository.getRepositoryRoot() === currentDirectory) {
            const success = gitRepository.init(currentDirectory);
            if (success) {
                if (currentDirectory === '/') {
                    return [`Reinitialized existing Git repository in .git/`];
                }
                return [`Reinitialized existing Git repository in ${currentDirectory}/.git/`];
            }
        }

        // Try to init new repository
        const success = gitRepository.init(currentDirectory);
        if (success) {
            if (currentDirectory === '/') {
                return [`Initialized empty Git repository in .git/`];
            }
            return [`Initialized empty Git repository in ${currentDirectory}/.git/`];
        }

        return ["Repository already initialized elsewhere. Only one repository is supported."];
    }
}
