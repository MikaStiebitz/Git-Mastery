import type { CommandProcessor } from "~/models/CommandProcessor";
import type { FileSystem } from "~/models/FileSystem";
import type { GitRepository } from "~/models/GitRepository";
import type { AutocompleteState, CompletionItem } from "../types";
import commandRegistry from "~/commands";

export class AutocompleteService {
    constructor(
        private commandProcessor: CommandProcessor,
        private fileSystem: FileSystem,
        private gitRepository?: GitRepository,
    ) {}

    /**
     * The command name Tab would complete to, or undefined when there is nothing left to add.
     *
     * Matched against the text exactly as typed, trailing space included. Trimming first is what
     * made `cd ` suggest `cd`: the trimmed form matches that command exactly, so accepting the
     * suggestion rewrote the line without the space — the cursor appeared to jump backwards, and
     * the space you had just typed to start naming a directory was gone.
     *
     * A suggestion that does not extend what is on screen is not a suggestion, so a command that is
     * already complete returns nothing and Tab moves on to completing its arguments instead.
     */
    getCommandSuggestion(partialCommand: string): string | undefined {
        if (!partialCommand || partialCommand.trim() === "") return undefined;

        const typed = partialCommand.toLowerCase();
        const completionCommands = commandRegistry.getTabCompletionCommands();

        const matches = completionCommands.filter(
            cmd => cmd.toLowerCase().startsWith(typed) && cmd.length > partialCommand.length,
        );

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

        // Nothing is offered until the command name is actually finished. `git checkout` with the
        // cursor still against the "t" is someone typing a command, not an argument — listing every
        // file in the directory at that point is the noise this menu was accused of. A trailing
        // space, or a third token, is what says "I have moved on to the argument".
        const commandTokens = commandName.includes(" ") ? 2 : 1;
        const endsWithSpace = /\s$/.test(input);
        const isTypingArgument = endsWithSpace || parts.length > commandTokens;

        if (!isTypingArgument) {
            const suggestion = this.getCommandSuggestion(input);
            return {
                fileMatches: [],
                showMenu: false,
                commandSuggestion: suggestion ?? "",
                showCommandSuggestion: !!suggestion,
                typedPrefix: "",
            };
        }

        // Check if this command needs branch autocomplete
        const needsBranchCompletion = this.commandSupportsBranchCompletion(commandName);

        if (needsBranchCompletion) {
            // A command that takes a branch offers branches or nothing. Falling through to file
            // completion here is what made `git checkout` list README.md and src/ in a folder that
            // is not a repository yet — an answer to a question nobody asked.
            if (!this.gitRepository?.isInitialized()) {
                return {
                    fileMatches: [],
                    showMenu: false,
                    commandSuggestion: "",
                    showCommandSuggestion: false,
                    typedPrefix: "",
                };
            }
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
                typedPrefix: "",
            };
        }

        if (!supportsFileCompletion) {
            return {
                fileMatches: [],
                showMenu: false,
                commandSuggestion: commandSuggestion ?? "",
                showCommandSuggestion: !!commandSuggestion,
                typedPrefix: "",
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
                typedPrefix: "",
            };
        }

        // Filter files based on the current input path. A directory is carried as such so the menu
        // can mark it and so completing it can leave the trailing slash in place, the way a shell
        // does — otherwise every directory completion needs a second manual keystroke.
        const typed = filePart || "";
        const matchingFiles: CompletionItem[] = Object.keys(contents)
            .filter(file => file !== ".git")
            .filter(file => file.startsWith(typed))
            .sort((a, b) => a.localeCompare(b))
            .map(file => ({
                value: file,
                kind: contents[file]?.type === "directory" ? ("directory" as const) : ("file" as const),
            }));

        if (matchingFiles.length === 0) {
            return {
                fileMatches: [],
                showMenu: false,
                commandSuggestion: commandSuggestion ?? "",
                showCommandSuggestion: !!commandSuggestion,
                typedPrefix: typed,
            };
        }

        const commonPrefix = this.longestCommonPrefix(matchingFiles.map(f => f.value));

        return {
            fileMatches: matchingFiles,
            showMenu: matchingFiles.length > 1,
            commandSuggestion: commandSuggestion ?? "",
            showCommandSuggestion: !!commandSuggestion,
            commonPrefix: commonPrefix.length > typed.length ? commonPrefix : undefined,
            typedPrefix: typed,
        };
    }

    /** The longest prefix shared by every candidate — what Tab inserts before offering a choice. */
    private longestCommonPrefix(values: string[]): string {
        if (values.length === 0) return "";
        let prefix = values[0] ?? "";
        for (const value of values.slice(1)) {
            while (prefix && !value.startsWith(prefix)) {
                prefix = prefix.slice(0, -1);
            }
            if (!prefix) break;
        }
        return prefix;
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
                typedPrefix: "",
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
                    typedPrefix: "",
                };
            }

            branchPart = parts.length > 2 ? parts.slice(2).join(" ") : "";
        } else {
            // For other commands, branch name comes after the subcommand
            branchPart = parts.length > 2 ? parts.slice(2).join(" ") : "";
        }

        // Filter branches that match the current input
        const matchingBranches = branches.filter(branch => branch.toLowerCase().startsWith(branchPart.toLowerCase()));

        if (matchingBranches.length === 0) {
            return {
                fileMatches: [],
                showMenu: false,
                commandSuggestion: "",
                showCommandSuggestion: false,
                typedPrefix: branchPart,
            };
        }

        const commonPrefix = this.longestCommonPrefix(matchingBranches);

        return {
            fileMatches: matchingBranches.map(value => ({ value, kind: "branch" as const })),
            showMenu: matchingBranches.length > 1,
            commandSuggestion: "",
            showCommandSuggestion: false,
            commonPrefix: commonPrefix.length > branchPart.length ? commonPrefix : undefined,
            typedPrefix: branchPart,
        };
    }

    generateCompletedCommand(input: string, selectedItem: string): string {
        // Split current input into command and arguments
        const parts = input.trim().split(/\s+/);

        if (parts[0] === "git" && parts.length > 1) {
            const gitSubcommand = parts[1];

            // For git commands with branch/file completion
            if (
                gitSubcommand === "switch" ||
                gitSubcommand === "checkout" ||
                gitSubcommand === "merge" ||
                gitSubcommand === "rebase" ||
                gitSubcommand === "diff" ||
                gitSubcommand === "log" ||
                gitSubcommand === "reset"
            ) {
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
