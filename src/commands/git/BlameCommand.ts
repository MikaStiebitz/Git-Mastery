import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class BlameCommand implements Command {
    name = "git blame";
    description = "Show what revision and author last modified each line of a file";
    usage = "git blame [options] <file>";
    examples = [
        "git blame file.txt",
        "git blame -L 10,20 file.txt",
        "git blame --show-email file.txt",
        "git blame -l file.txt"
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, fileSystem, currentDirectory } = context;

        if (!gitRepository.isInitialized()) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        if (!gitRepository.isInRepository(currentDirectory)) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        if (args.positionalArgs.length === 0) {
            return ["usage: git blame [options] <file>"];
        }

        const filePath = args.positionalArgs[args.positionalArgs.length - 1];
        if (!filePath) {
            return ["usage: git blame [options] <file>"];
        }
        const fileContent = fileSystem.getFileContents(filePath);

        if (!fileContent) {
            return [`fatal: cannot stat '${filePath}': No such file or directory`];
        }

        // Parse options
        const options = args.positionalArgs.slice(0, -1);
        const showLineNumbers = !options.includes("-n") && !options.includes("--no-line-numbers");
        const showEmail = options.includes("-e") || options.includes("--show-email");
        const showLineRange = options.find((opt: string) => opt.startsWith("-L"));
        const showCommitHash = options.includes("-l") || options.includes("--long");
        const showAbbrev = !options.includes("--no-abbrev");

        let lineRange: [number, number] | null = null;
        if (showLineRange) {
            const rangeMatch = showLineRange.match(/-L(\d+),(\d+)/);
            if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
                lineRange = [parseInt(rangeMatch[1]), parseInt(rangeMatch[2])];
            }
        }

        // Get file content
        const lines = fileContent.split('\n');
        const startLine = lineRange ? lineRange[0] - 1 : 0;
        const endLine = lineRange ? lineRange[1] : lines.length;

        const result: string[] = [];

        // Find commits that modified this file
        const commits = gitRepository.getCommits();
        const fileCommits = Object.entries(commits)
            .filter(([_, commit]) => commit.files.includes(filePath))
            .sort(([_, a], [__, b]) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        if (fileCommits.length === 0) {
            return [`fatal: no such path '${filePath}' in HEAD`];
        }

        // For each line, find the last commit that modified it
        for (let i = startLine; i < Math.min(endLine, lines.length); i++) {
            const line = lines[i];
            if (!line || line.trim() === '') continue;

            // Find the most recent commit that could have modified this line
            const firstCommit = fileCommits[0];
            if (!firstCommit) continue;

            const [commitId, commit] = firstCommit; // Most recent commit that touched this file
            const commitHash = showAbbrev ? commitId.substring(0, 8) : commitId;
            const author = "Unknown Author"; // We don't store author in our model
            const email = showEmail ? ` <${author.toLowerCase().replace(' ', '.')}@example.com>` : "";
            const timestamp = new Date(commit.timestamp).toISOString();
            const lineNum = showLineNumbers ? ` ${i + 1}` : "";

            if (showCommitHash) {
                result.push(`${commitHash} (${author}${email} ${timestamp})${lineNum} ${line}`);
            } else {
                result.push(`${commitHash} (${author}${email})${lineNum} ${line}`);
            }
        }

        return result;
    }
}
