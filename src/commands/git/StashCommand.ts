import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class StashCommand implements Command {
    name = "git stash";
    description = "Stash the changes in a dirty working directory away";
    usage = "git stash [push|list|pop|apply]";
    examples = ["git stash", "git stash pop", "git stash list", "git stash apply"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository } = context;

        if (!gitRepository.isInitialized()) {
            return ["Not a git repository. Run 'git init' first."];
        }

        // Determine the subcommand (default is "push")
        let subcommand = "push";
        if (args.positionalArgs.length > 0) {
            subcommand = args.positionalArgs[0] ?? "";
        }

        switch (subcommand) {
            case "push":
            case "save":
                // Stash changes
                {
                    const success = gitRepository.stashSave();
                    if (!success) {
                        return ["No local changes to save"];
                    }
                    return [
                        "Saved working directory and index state WIP on " +
                            gitRepository.getCurrentBranch() +
                            ": Changes stashed successfully.",
                    ];
                }

            case "pop":
                // Pop stashed changes
                {
                    const result = gitRepository.stashApply(true);
                    if (!result.success) {
                        return ["No stash entries found."];
                    }

                    const output = ["On branch " + gitRepository.getCurrentBranch()];

                    if (result.files.length > 0) {
                        output.push("Changes not staged for commit:");
                        output.push('  (use "git add <file>..." to update what will be committed)');
                        output.push('  (use "git restore <file>..." to discard changes in working directory)');
                        output.push("");
                        result.files.forEach(file => {
                            output.push(`\tmodified:   ${file}`);
                        });
                        output.push("");
                    }

                    output.push("Dropped refs/stash@{0}");
                    return output;
                }

            case "list":
                // List stashes (simplified)
                return ["stash@{0}: WIP on " + gitRepository.getCurrentBranch() + ": Changes"];

            case "apply":
                // Apply stashed changes without removing them
                {
                    const result = gitRepository.stashApply(false);
                    if (!result.success) {
                        return ["No stash entries found."];
                    }

                    const output = ["On branch " + gitRepository.getCurrentBranch()];

                    if (result.files.length > 0) {
                        output.push("Changes not staged for commit:");
                        output.push('  (use "git add <file>..." to update what will be committed)');
                        output.push('  (use "git restore <file>..." to discard changes in working directory)');
                        output.push("");
                        result.files.forEach(file => {
                            output.push(`\tmodified:   ${file}`);
                        });
                        output.push("");
                    }

                    return output;
                }

            default:
                return [
                    "Unsupported stash operation: " +
                        subcommand +
                        "\nSupported operations: git stash, git stash pop, git stash list, git stash apply",
                ];
        }
    }
}
