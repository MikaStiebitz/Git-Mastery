import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { hint, unknownFlagError } from "../base/GitErrors";

export class CloneCommand implements Command {
    name = "git clone";
    description = "Clone a repository into a new directory";
    usage = "git clone [<options>] [--] <repo> [<dir>]";
    examples = [
        "git clone https://github.com/user/repo.git",
        "git clone https://github.com/user/repo.git my-project",
        "git clone git@github.com:user/repo.git",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "bare",
            "mirror",
            "recursive",
            "recurse-submodules",
            "q",
            "quiet",
            "v",
            "verbose",
            "progress",
            "single-branch",
            "no-single-branch",
            "no-checkout",
            "n",
            "shared",
            "s",
            "l",
            "local",
        ],
        value: ["b", "branch", "depth", "o", "origin", "c", "config", "j", "jobs", "separate-git-dir", "filter"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { fileSystem, currentDirectory, gitRepository: repo } = context;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        if (args.positionalArgs.length === 0) {
            return ["fatal: You must specify a repository to clone.", "", `usage: ${this.usage}`];
        }
        if (args.positionalArgs.length > 2) return ["fatal: Too many arguments.", "", `usage: ${this.usage}`];

        const repoUrl = args.positionalArgs[0]!;

        // Reject anything that is not a repository location. `git clone <repository-url>` — the
        // placeholder from the instructions, copied literally — must fail as it does in real Git;
        // a beginner has to learn that the angle brackets are theirs to replace.
        const placeholder = /[<>]/.test(repoUrl);
        const looksLikeUrl =
            /^(https?|git|ssh|file):\/\//.test(repoUrl) || // https://host/path, git://, ssh://, file://
            /^[\w.-]+@[\w.-]+:.+/.test(repoUrl) || // git@github.com:user/repo.git
            /^(\.{1,2})?\//.test(repoUrl); // a local path

        if (placeholder || !looksLikeUrl) {
            return [
                `fatal: repository '${repoUrl}' does not exist`,
                ...(placeholder
                    ? [
                          hint(`'${repoUrl}' is a placeholder — the < > mean "put your own value here".`),
                          hint(`Try a real address, for example:`),
                          hint(`  git clone https://github.com/octocat/Hello-World.git`),
                      ]
                    : [
                          hint(`A repository address looks like one of these:`),
                          hint(`  https://github.com/user/repo.git`),
                          hint(`  git@github.com:user/repo.git`),
                      ]),
            ];
        }

        const match = repoUrl.match(/\/([^/]+?)(\.git)?\/?$/) ?? repoUrl.match(/:([^/]+?)(\.git)?$/);
        const repoName = match?.[1] ?? "repository";
        const targetDir = args.positionalArgs[1] ?? repoName;
        const fullPath = targetDir.startsWith("/")
            ? targetDir
            : currentDirectory === "/"
              ? `/${targetDir}`
              : `${currentDirectory}/${targetDir}`;

        const contents = fileSystem.getDirectoryContents(fullPath);
        if (fileSystem.getFileContents(fullPath) !== null || (contents !== null && Object.keys(contents).length > 0)) {
            return [`fatal: destination path '${targetDir}' already exists and is not an empty directory.`];
        }

        const branch =
            typeof args.flags.b === "string"
                ? args.flags.b
                : typeof args.flags.branch === "string"
                  ? args.flags.branch
                  : "main";
        if (branch !== "main") {
            return [`Cloning into '${targetDir}'...`, `fatal: Remote branch ${branch} not found in upstream origin`];
        }
        const quiet = args.flags.q !== undefined || args.flags.quiet !== undefined;

        // The project files the "remote" repository contains, committed in a short history.
        const files: [string, string, string][] = [
            ["README.md", `# ${repoName}\n\nCloned from ${repoUrl}\n`, "Initial commit"],
            [
                ".gitignore",
                "# Dependencies\nnode_modules/\n\n# Build output\ndist/\nbuild/\n\n# Environment variables\n.env\n.env.local\n",
                "Add .gitignore",
            ],
            [
                "src/main.js",
                `// Main application file\nconsole.log('Hello from ${repoName}!');\n`,
                "Add main application file",
            ],
        ];

        fileSystem.mkdir(fullPath);

        // This terminal tracks a single repository. If one exists elsewhere already, the files are
        // still created so the next steps of a lesson work, but it is not a second repository.
        if (repo.isInitialized()) {
            for (const [path, content] of files) fileSystem.writeFile(`${fullPath}/${path}`, content);
            return [
                `Cloning into '${targetDir}'...`,
                "done.",
                hint(`This terminal tracks one Git repository at a time (the one in ${repo.getRepositoryRoot()}),`),
                hint(`so '${targetDir}' got the project files but no history of its own.`),
            ];
        }

        repo.init(fullPath);
        repo.setSetupMode(true);
        for (const [path, content, message] of files) {
            fileSystem.writeFile(`${fullPath}/${path}`, content);
            repo.addFile(path);
            repo.commit(message);
        }
        repo.setSetupMode(false);
        const remoteName =
            typeof args.flags.o === "string"
                ? args.flags.o
                : typeof args.flags.origin === "string"
                  ? args.flags.origin
                  : "origin";
        repo.finishClone(remoteName, repoUrl);

        if (quiet) return [];
        const objects = files.length * 3;
        return [
            `Cloning into '${targetDir}'...`,
            `remote: Enumerating objects: ${objects}, done.`,
            `remote: Counting objects: 100% (${objects}/${objects}), done.`,
            `remote: Compressing objects: 100% (${objects - 2}/${objects - 2}), done.`,
            `remote: Total ${objects} (delta 0), reused ${objects} (delta 0), pack-reused 0`,
            `Receiving objects: 100% (${objects}/${objects}), done.`,
        ];
    }
}
