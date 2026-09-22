import type { CommandArgs, FlagSpec } from "./Command";

/**
 * Split a raw input line into a command name and its parsed arguments.
 *
 * `spec` describes the flag semantics of the command being parsed. The registry resolves the command
 * first and then re-parses with that command's own spec, because how a token should be read depends
 * on which command is reading it: `git branch -m a b` renames, `git commit -m a` takes a message.
 */
export function parseCommand(
    commandStr: string,
    spec?: FlagSpec,
): {
    command: string;
    args: CommandArgs;
} {
    // Split the command respecting quotes
    const parts = splitCommandRespectingQuotes(commandStr.trim());
    const command = parts[0]?.toLowerCase() ?? "";

    if (command === "git" && parts.length > 1) {
        return {
            command: `git ${parts[1]?.toLowerCase()}`,
            args: parseArgs(parts.slice(2), spec),
        };
    }

    return {
        command,
        args: parseArgs(parts.slice(1), spec),
    };
}

// Split a raw input line into chained commands at unquoted ';' and '&&' separators.
// Quotes are preserved so each part can be parsed normally afterwards.
export function splitChainedCommands(input: string): string[] {
    const parts: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char === undefined) continue;

        if ((char === '"' || char === "'") && input[i - 1] !== "\\") {
            if (!inQuotes) {
                inQuotes = true;
                quoteChar = char;
            } else if (char === quoteChar) {
                inQuotes = false;
                quoteChar = "";
            }
            current += char;
            continue;
        }

        if (!inQuotes && char === ";") {
            parts.push(current);
            current = "";
            continue;
        }

        if (!inQuotes && char === "&" && input[i + 1] === "&") {
            parts.push(current);
            current = "";
            i++; // Skip the second '&'
            continue;
        }

        current += char;
    }

    parts.push(current);
    return parts.map(part => part.trim()).filter(part => part.length > 0);
}

export function splitCommandRespectingQuotes(commandStr: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < commandStr.length; i++) {
        const char = commandStr[i];

        // Handle quotes (both double and single)
        if ((char === '"' || char === "'") && (i === 0 || commandStr[i - 1] !== "\\")) {
            if (!inQuotes) {
                // Starting a quoted section
                inQuotes = true;
                quoteChar = char;
            } else if (char === quoteChar) {
                // Ending a quoted section if the quote matches the opening quote
                inQuotes = false;
                quoteChar = "";
            } else {
                // This is a different quote character inside quotes, treat as regular character
                current += char;
            }
            continue;
        }

        // Handle spaces - they split arguments when not in quotes
        if (char === " " && !inQuotes) {
            if (current) {
                result.push(current);
                current = "";
            }
            continue;
        }

        // Regular character
        current += char;
    }

    // Add the last part if there is one
    if (current) {
        result.push(current);
    }

    return result;
}

/**
 * Fallback flag semantics for commands that declare no FlagSpec of their own.
 *
 * These mirror the behaviour the parser had before per-command specs existed, so a command without
 * a spec keeps working exactly as it did. Commands that matter to the courses declare their own.
 */
const FALLBACK_SPEC: Required<FlagSpec> = {
    boolean: [
        "u",
        "f",
        "a",
        "set-upstream",
        "force",
        "all",
        "amend",
        "no-edit",
        "abort",
        "continue",
        "soft",
        "hard",
        "mixed",
        "oneline",
        "graph",
    ],
    value: ["m", "message", "author", "date", "format", "C", "D", "F", "p"],
};

/**
 * Parse a command's arguments into flags and positional arguments.
 *
 * Follows the same rules as a real getopt-style CLI, which is what makes the simulator forgiving of
 * the orders real people type:
 *  - flags may appear anywhere, so `git branch Feature -D` deletes "Feature" just like `git branch
 *    -D Feature` does;
 *  - `--` ends flag parsing, so a file literally named "-f" can still be addressed;
 *  - a value flag takes an attached value (`-mfix`, `--author=me`) or the next token (`-m fix`);
 *  - clustered short flags work (`-am "msg"` is `-a -m "msg"`), and a value flag inside a cluster
 *    consumes the rest of it.
 *
 * When `spec` is given, flags outside it are recorded in `unknownFlags` so the command can reject a
 * typo instead of silently ignoring it.
 */
export function parseArgs(args: string[], spec?: FlagSpec): CommandArgs {
    const result: CommandArgs = {
        args: [...args],
        flags: {},
        positionalArgs: [],
        unknownFlags: [],
    };

    const isStrict = spec !== undefined;
    const booleanFlags = new Set(spec?.boolean ?? FALLBACK_SPEC.boolean);
    const valueFlags = new Set(spec?.value ?? FALLBACK_SPEC.value);

    let flagsEnded = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === undefined) continue;

        if (flagsEnded) {
            result.positionalArgs.push(arg);
            continue;
        }

        // "--" separates flags from paths; everything after it is positional.
        if (arg === "--") {
            flagsEnded = true;
            continue;
        }

        // Long flag: --flag, --flag=value, --flag value
        if (arg.startsWith("--") && arg.length > 2) {
            const body = arg.substring(2);
            const eq = body.indexOf("=");

            if (eq !== -1) {
                const name = body.substring(0, eq);
                result.flags[name] = body.substring(eq + 1);
                if (isStrict && !booleanFlags.has(name) && !valueFlags.has(name)) {
                    result.unknownFlags!.push(`--${name}`);
                }
                continue;
            }

            if (booleanFlags.has(body)) {
                result.flags[body] = true;
                continue;
            }

            if (valueFlags.has(body)) {
                result.flags[body] = takeValue(args, i);
                if (consumesNextToken(args, i)) i++;
                continue;
            }

            // Unknown long flag. Strict commands report it; the fallback keeps the old guesswork.
            if (isStrict) {
                result.unknownFlags!.push(`--${body}`);
                result.flags[body] = true;
                continue;
            }

            result.flags[body] = takeValueOrTrue(args, i);
            if (consumesNextToken(args, i)) i++;
            continue;
        }

        // Short flag or cluster: -d, -am, -mfix
        if (arg.startsWith("-") && arg.length > 1) {
            const chars = arg.substring(1);

            for (let j = 0; j < chars.length; j++) {
                const char = chars[j];
                if (char === undefined) continue;

                if (booleanFlags.has(char)) {
                    result.flags[char] = true;
                    continue;
                }

                if (valueFlags.has(char)) {
                    const attached = chars.substring(j + 1);
                    if (attached.length > 0) {
                        result.flags[char] = attached;
                    } else {
                        result.flags[char] = takeValue(args, i);
                        if (consumesNextToken(args, i)) i++;
                    }
                    break; // The rest of the cluster was this flag's value.
                }

                if (isStrict) {
                    result.unknownFlags!.push(`-${char}`);
                    result.flags[char] = true;
                    continue;
                }

                // Fallback only: a lone unknown short flag swallows the next token, as before.
                if (chars.length === 1) {
                    result.flags[char] = takeValueOrTrue(args, i);
                    if (consumesNextToken(args, i)) i++;
                    continue;
                }

                result.flags[char] = true;
            }
            continue;
        }

        result.positionalArgs.push(arg);
    }

    return result;
}

/** True when the token after `index` can serve as a flag value (exists and is not itself a flag). */
function consumesNextToken(args: string[], index: number): boolean {
    const next = args[index + 1];
    return next !== undefined && (next === "-" || !next.startsWith("-"));
}

/** The next token as a flag value, or "" to signal "the flag needs a value but got none". */
function takeValue(args: string[], index: number): string {
    return consumesNextToken(args, index) ? args[index + 1]! : "";
}

/** Like takeValue, but yields boolean true when no value follows. */
function takeValueOrTrue(args: string[], index: number): string | boolean {
    return consumesNextToken(args, index) ? args[index + 1]! : true;
}
