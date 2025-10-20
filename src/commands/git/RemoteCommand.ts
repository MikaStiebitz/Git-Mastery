import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class RemoteCommand implements Command {
    name = "git remote";
    description = "Manage set of tracked repositories";
    usage = "git remote [add <name> <url> | -v]";
    examples = ["git remote", "git remote -v", "git remote add origin https://github.com/user/repo.git"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository } = context;

        if (!gitRepository.isInitialized()) {
            return ["Not a git repository. Run 'git init' first."];
        }

        // Handle different subcommands
        const subcommand = args.positionalArgs[0];

        // List remotes (default)
        if (args.positionalArgs.length === 0) {
            const remotes = gitRepository.getRemotes();
            const remoteNames = Object.keys(remotes);

            // Show URLs with -v flag
            if (args.flags.v || args.flags.verbose) {
                return remoteNames.flatMap(name => [
                    `${name}\t${remotes[name]} (fetch)`,
                    `${name}\t${remotes[name]} (push)`
                ]);
            }

            return remoteNames;
        }

        // Add a remote
        if (subcommand === "add") {
            if (args.positionalArgs.length < 3) {
                return ["error: wrong number of arguments, usage: git remote add <name> <url>"];
            }

            const name = args.positionalArgs[1] ?? "";
            const url = args.positionalArgs[2] ?? "";

            // Check if remote already exists
            const existingRemotes = gitRepository.getRemotes();
            if (existingRemotes[name]) {
                return [`error: remote '${name}' already exists`];
            }

            const success = gitRepository.addRemote(name, url);
            return success ? [`Added remote '${name}' with URL '${url}'`] : [`error: failed to add remote '${name}'`];
        }

        // Remove a remote
        if (subcommand === "remove" || subcommand === "rm") {
            if (args.positionalArgs.length < 2) {
                return ["error: wrong number of arguments, usage: git remote remove <name>"];
            }

            const name = args.positionalArgs[1] ?? "";
            const success = gitRepository.removeRemote(name);
            return success ? [`Removed remote '${name}'`] : [`error: No such remote: '${name}'`];
        }

        // Show remote details
        if (args.positionalArgs[0] === "-v" || args.positionalArgs[0] === "--verbose") {
            const remotes = gitRepository.getRemotes();
            const output: string[] = [];

            for (const [name, url] of Object.entries(remotes)) {
                output.push(`${name}\t${url} (fetch)`);
                output.push(`${name}\t${url} (push)`);
            }

            return output;
        }

        return ["error: Unknown subcommand. Supported: git remote, git remote add <name> <url>, git remote remove <name>, git remote -v"];
    }
}
