import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class CloneCommand implements Command {
    name = "git clone";
    description = "Clone a repository into a new directory";
    usage = "git clone <repository> [directory]";
    examples = [
        "git clone https://github.com/user/repo.git",
        "git clone https://github.com/user/repo.git my-project",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { fileSystem, currentDirectory } = context;

        if (args.positionalArgs.length === 0) {
            return [
                "fatal: You must specify a repository to clone.",
                "",
                "Usage: git clone <repository> [directory]",
                "",
                "Examples:",
                "  git clone https://github.com/user/repo.git",
                "  git clone https://github.com/user/repo.git my-project",
            ];
        }

        const repoUrl = args.positionalArgs[0];
        let repoName: string;

        // Extract repository name from URL
        if (repoUrl) {
            const match = repoUrl.match(/\/([^/]+?)(\.git)?$/);
            if (match && match[1]) {
                repoName = match[1];
            } else {
                repoName = "repository";
            }
        } else {
            return ["fatal: Invalid repository URL."];
        }

        // Use custom directory name if provided
        const targetDir = args.positionalArgs[1] ?? repoName;

        // Build full path
        const fullPath = currentDirectory === "/" ? `/${targetDir}` : `${currentDirectory}/${targetDir}`;

        // Check if directory already exists
        const contents = fileSystem.getDirectoryContents(fullPath);
        if (contents !== null && Object.keys(contents).length > 0) {
            return [`fatal: destination path '${targetDir}' already exists and is not an empty directory.`];
        }

        // Create the repository directory
        fileSystem.mkdir(fullPath);

        // Create mock repository structure
        fileSystem.writeFile(`${fullPath}/README.md`, `# ${repoName}\n\nCloned from ${repoUrl}\n`);
        fileSystem.mkdir(`${fullPath}/src`);
        fileSystem.writeFile(`${fullPath}/src/main.js`, `// Main application file\nconsole.log('Hello from ${repoName}!');\n`);
        fileSystem.writeFile(
            `${fullPath}/.gitignore`,
            `# Dependencies\nnode_modules/\n\n# Build output\ndist/\nbuild/\n\n# Environment variables\n.env\n.env.local\n`,
        );

        return [
            `Cloning into '${targetDir}'...`,
            `remote: Enumerating objects: 100, done.`,
            `remote: Counting objects: 100% (100/100), done.`,
            `remote: Compressing objects: 100% (75/75), done.`,
            `remote: Total 100 (delta 25), reused 100 (delta 25), pack-reused 0`,
            `Receiving objects: 100% (100/100), 45.23 KiB | 3.45 MiB/s, done.`,
            `Resolving deltas: 100% (25/25), done.`,
            "",
            `Successfully cloned repository into '${targetDir}'.`,
            `Use 'cd ${targetDir}' to navigate into the repository.`,
        ];
    }
}
