import type { Command, CommandContext } from "./Command";
import { parseCommand } from "./CommandParser";
import { unknownGitSubcommand, unknownShellCommand } from "./GitErrors";

export class CommandRegistry {
    private commands: Map<string, Command> = new Map<string, Command>();
    private aliases: Map<string, string> = new Map<string, string>();

    // Befehl registrieren
    register(command: Command): void {
        this.commands.set(command.name, command);
    }

    // Alias registrieren
    registerAlias(alias: string, commandName: string): void {
        if (this.commands.has(commandName)) {
            this.aliases.set(alias, commandName);
        } else {
            console.warn(`Tried to create alias for non-existent command: ${commandName}`);
        }
    }

    // Befehl ausführen
    execute(commandStr: string, context: CommandContext): string[] {
        // First pass resolves only the command name; the arguments are parsed again below with that
        // command's own flag spec, because flag meanings are per-command (see FlagSpec).
        const { command } = parseCommand(commandStr);

        const cmd = this.resolve(command);

        if (!cmd) {
            return this.notFound(command);
        }

        const { args } = parseCommand(commandStr, cmd.flagSpec);

        // Validiere den Befehl, falls vorhanden
        if (cmd.validate) {
            const validation = cmd.validate(args);
            if (!validation.isValid) {
                return [validation.errorMessage ?? `Invalid usage of command: ${command}`];
            }
        }

        // Führe den Befehl aus
        return cmd.execute(args, context);
    }

    /** Look a command up by name, falling back to its aliases. */
    private resolve(command: string): Command | undefined {
        const direct = this.commands.get(command);
        if (direct) return direct;

        const aliasTarget = this.aliases.get(command);
        if (aliasTarget !== undefined) {
            return this.commands.get(aliasTarget);
        }

        return undefined;
    }

    /**
     * Report an unrecognised command the way the real tool would.
     *
     * A mistyped Git subcommand gets Git's own "is not a git command" error with its suggestion
     * block; anything else gets the shell's "command not found". Both suggest near-misses, so a
     * beginner's typo is a signpost instead of a dead end.
     */
    private notFound(command: string): string[] {
        if (command.startsWith("git ")) {
            const subcommand = command.substring(4);
            return unknownGitSubcommand(subcommand, this.getGitSubcommands());
        }

        if (command === "git") {
            return unknownGitSubcommand("", this.getGitSubcommands());
        }

        return unknownShellCommand(command, this.getShellCommands());
    }

    /** Every registered `git <subcommand>`, as bare subcommand names. */
    getGitSubcommands(): string[] {
        return [...this.commands.keys()]
            .filter(name => name.startsWith("git "))
            .map(name => name.substring(4))
            .sort();
    }

    /** Every registered command that is not a Git subcommand, plus aliases. */
    getShellCommands(): string[] {
        const names = [...this.commands.keys()].filter(name => !name.startsWith("git "));
        return [...names, ...this.aliases.keys()].sort();
    }

    // Alle Befehle für Tab-Completion abrufen
    getTabCompletionCommands(): string[] {
        const commands: string[] = [];

        for (const [name, cmd] of this.commands.entries()) {
            if (cmd.includeInTabCompletion) {
                commands.push(name);
            }
        }

        return commands;
    }

    // Prüfe, ob ein Befehl File-Completion unterstützt
    supportsFileCompletion(command: string): boolean {
        const cmd = this.commands.get(command);
        return !!cmd?.supportsFileCompletion;
    }

    // Hilfsinformationen zu einem Befehl abrufen
    getHelpForCommand(commandName: string): string[] {
        const cmd = this.commands.get(commandName);

        if (!cmd) {
            return [`No help available for command: ${commandName}`];
        }

        const help: string[] = [`Command: ${cmd.name}`, `Description: ${cmd.description}`, `Usage: ${cmd.usage}`];

        if (cmd.examples.length > 0) {
            help.push("Examples:");
            cmd.examples.forEach(example => help.push(`  ${example}`));
        }

        return help;
    }
}
