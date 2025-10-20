import type { CommandProcessor } from "~/models/CommandProcessor";
import type { FileSystem } from "~/models/FileSystem";
import type { GitRepository } from "~/models/GitRepository";
import type { AutocompleteState } from "../types";
import commandRegistry from "~/commands";

export class AutocompleteService {
    constructor(
        private commandProcessor: CommandProcessor,
        private fileSystem: FileSystem,
        private gitRepository?: GitRepository,
    ) {}

    getCommandSuggestion(partialCommand: string): string | undefined {
        if (!partialCommand || partialCommand.trim() === "") return undefined;

        // Normalize input (lowercase, trim spaces)
        const normalizedInput = partialCommand.toLowerCase().trim();

        // Get all tab-completion-enabled commands from registry
        const completionCommands = commandRegistry.getTabCompletionCommands();

        // Find matching commands that start with the input
        const matches = completionCommands.filter(cmd => cmd.toLowerCase().startsWith(normalizedInput));

        // Return the first match or undefined
        return matches.length > 0 ? matches[0] : undefined;
    }

    processTabAutocomplete(input: string): AutocompleteState {
        // Normalize input by removing excess spaces
        const normalizedInput = input.trim().replace(/\s+/g, " ");

        // Extract command and arguments
        const parts = normalizedInput.split(" ");
        let commandName = parts[0] ?? "";

        // Special handling for Git commands (two-word commands)
        if (commandName === "git" && parts.length > 1) {
            commandName = `git ${parts[1]}`;
        }

        // Check if this command needs branch autocomplete
        const needsBranchCompletion = this.commandSupportsBranchCompletion(commandName);

        if (needsBranchCompletion && this.gitRepository?.isInitialized()) {
            return this.processBranchAutocomplete(input, commandName, parts);
        }

        // Check if this is a command that supports file completion
        const supportsFileCompletion = commandRegistry.supportsFileCompletion(commandName);

        // If command suggestion is active but we don't have file completion,
        // complete the command when Tab is pressed
        const commandSuggestion = this.getCommandSuggestion(input);

        if (commandSuggestion && !supportsFileCompletion) {
            return {
                fileMatches: [],
                showMenu: false,
                commandSuggestion: "",
                showCommandSuggestion: false,
            };
        }

        if (!supportsFileCompletion) {
            return {
                fileMatches: [],
                showMenu: false,
                commandSuggestion: commandSuggestion ?? "",
                showCommandSuggestion: !!commandSuggestion,
            };
        }

        // For commands that support file completion, handle file path autocomplete
        let filePart = "";

        if (parts.length > 1) {
            // Extract the potential file path part
            if (
                commandName === "git add" ||
                commandName === "git rm" ||
                commandName === "git checkout" ||
                commandName === "git restore"
            ) {
                // For Git commands with subcommands, use the remaining parts as file path
                filePart = parts.slice(2).join(" ");
            } else {
                // For regular commands, use everything after the command as file path
                filePart = parts.slice(1).join(" ");
            }
        }

        // Get files in the current directory
        const currentDir = this.commandProcessor.getCurrentDirectory();
        const contents = this.fileSystem.getDirectoryContents(currentDir);
        if (!contents) {
            return {
                fileMatches: [],
                showMenu: false,
                commandSuggestion: commandSuggestion ?? "",
                showCommandSuggestion: !!commandSuggestion,
            };
        }

        // Filter files based on the current input path
        const matchingFiles = Object.keys(contents).filter(file => file.startsWith(filePart || ""));

        if (matchingFiles.length === 0) {
            return {
                fileMatches: [],
                showMenu: false,
                commandSuggestion: commandSuggestion ?? "",
                showCommandSuggestion: !!commandSuggestion,
            };
        }

        return {
            fileMatches: matchingFiles,
            showMenu: matchingFiles.length > 1,
            commandSuggestion: commandSuggestion ?? "",
            showCommandSuggestion: !!commandSuggestion,
        };
    }

    private commandSupportsBranchCompletion(commandName: string): boolean {
        // Commands that accept branch names
        const branchCommands = [
            "git switch",
            "git checkout",
            "git merge",
            "git rebase",
            "git branch",
            "git diff",
            "git log",
            "git reset",
        ];
        return branchCommands.includes(commandName);
    }

    private processBranchAutocomplete(input: string, commandName: string, parts: string[]): AutocompleteState {
        if (!this.gitRepository) {
            return {
                fileMatches: [],
                showMenu: false,
                commandSuggestion: "",
                showCommandSuggestion: false,
            };
        }

        // Get all branches
        const branches = this.gitRepository.getBranches();

        // Extract the branch name part being typed
        let branchPart = "";

        // For "git switch" or "git checkout", the branch name is after the subcommand
        if (commandName === "git switch" || commandName === "git checkout") {
            // Handle flags like -c, -b
            const flagIndex = parts.findIndex(p => p === "-c" || p === "-b" || p === "-C");
            if (flagIndex !== -1 && parts.length > flagIndex + 1) {
                // Don't autocomplete after -c/-b flags (creating new branch)
                return {
                    fileMatches: [],
                    showMenu: false,
                    commandSuggestion: "",
                    showCommandSuggestion: false,
                };
            }

            branchPart = parts.length > 2 ? parts.slice(2).join(" ") : "";
        } else {
            // For other commands, branch name comes after the subcommand
            branchPart = parts.length > 2 ? parts.slice(2).join(" ") : "";
        }

        // Filter branches that match the current input
        const matchingBranches = branches.filter(branch =>
            branch.toLowerCase().startsWith(branchPart.toLowerCase())
        );

        if (matchingBranches.length === 0) {
            return {
                fileMatches: [],
                showMenu: false,
                commandSuggestion: "",
                showCommandSuggestion: false,
            };
        }

        return {
            fileMatches: matchingBranches,
            showMenu: matchingBranches.length > 1,
            commandSuggestion: "",
            showCommandSuggestion: false,
        };
    }

    generateCompletedCommand(input: string, selectedItem: string): string {
        // Split current input into command and arguments
        const parts = input.trim().split(/\s+/);

        if (parts[0] === "git" && parts.length > 1) {
            const gitSubcommand = parts[1];

            // For git commands with branch/file completion
            if (gitSubcommand === "switch" ||
                gitSubcommand === "checkout" ||
                gitSubcommand === "merge" ||
                gitSubcommand === "rebase" ||
                gitSubcommand === "diff" ||
                gitSubcommand === "log" ||
                gitSubcommand === "reset") {
                // Check if there are flags
                const flags = parts.slice(2).filter(p => p.startsWith("-"));
                if (flags.length > 0) {
                    return `${parts[0]} ${gitSubcommand} ${flags.join(" ")} ${selectedItem}`;
                }
                return `${parts[0]} ${gitSubcommand} ${selectedItem}`;
            }

            // For other git commands with file completion
            return `${parts[0]} ${gitSubcommand} ${selectedItem}`;
        } else {
            // For regular commands: command filename
            return `${parts[0]} ${selectedItem}`;
        }
    }
}
