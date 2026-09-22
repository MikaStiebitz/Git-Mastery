import { type FileSystem } from "~/models/FileSystem";
import { type GitRepository } from "~/models/GitRepository";
import { type ProgressManager } from "~/models/ProgressManager";

export interface CommandArgs {
    args: string[];
    flags: Record<string, boolean | string>;
    positionalArgs: string[];
    /**
     * Flags the command's own FlagSpec does not list, in the spelling the user typed ("-x",
     * "--foce"). Only filled when the command declares a flagSpec; commands opt in to reporting
     * them so a typo becomes a real error instead of being silently ignored.
     */
    unknownFlags?: string[];
}

/**
 * Which flags a single command accepts, and whether each one swallows the following token.
 *
 * Git's flags mean different things per command — `-d` is a boolean "delete" for `git branch` but
 * `--delete` for `git push`, and `-m` takes a message for `git commit` while being boolean "move"
 * for `git branch`. A single global list therefore cannot parse them correctly: it either eats a
 * positional argument that belonged to the command (`git branch -D fix` losing "fix") or treats a
 * value flag as boolean. Every command declares its own spec instead.
 */
export interface FlagSpec {
    /** Flags that are always boolean and never consume the next token. */
    boolean?: readonly string[];
    /** Flags that take a value, either attached (-mfix, --author=x) or as the next token. */
    value?: readonly string[];
}

export interface CommandContext {
    fileSystem: FileSystem;
    gitRepository: GitRepository;
    currentDirectory: string;
    setCurrentDirectory: (path: string) => void;
    progressManager: ProgressManager;
}

export interface Command {
    // Metadaten
    name: string;
    description: string;
    usage: string;
    examples: string[];

    // Eigenschaften für Autovervollständigung
    includeInTabCompletion: boolean;
    supportsFileCompletion: boolean;

    /** Flag semantics for this command. Omitted means "use the generic fallback spec". */
    flagSpec?: FlagSpec;

    // Methode zum Ausführen des Befehls
    execute(args: CommandArgs, context: CommandContext): string[];

    // Methode zur Validierung (optional)
    validate?(args: CommandArgs): { isValid: boolean; errorMessage?: string };
}
