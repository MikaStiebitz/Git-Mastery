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
    let quote: '"' | "'" | null = null;

    for (let i = 0; i < input.length; i++) {
        const char = input[i]!;

        // A backslash (outside single quotes) keeps the next character from meaning anything.
        if (char === "\\" && quote !== "'" && i + 1 < input.length) {
            current += char + input[++i];
            continue;
        }
        if (char === '"' || char === "'") {
            if (quote === null) quote = char;
            else if (quote === char) quote = null;
            current += char;
            continue;
        }

        if (quote === null && char === ";") {
            parts.push(current);
            current = "";
            continue;
        }

        if (quote === null && char === "&" && input[i + 1] === "&") {
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

/**
 * Split a command line into words the way a POSIX shell does: whitespace separates words, quotes
 * group them ("" and '' still make an — empty — word), a backslash outside quotes takes the next
 * character literally, and inside double quotes it escapes only " \ $ and `.
 */
export function splitCommandRespectingQuotes(commandStr: string): string[] {
    const result: string[] = [];
    let current = "";
    let inWord = false;
    let quote: '"' | "'" | null = null;

    for (let i = 0; i < commandStr.length; i++) {
        const char = commandStr[i]!;

        if (quote === "'") {
            if (char === "'") quote = null;
            else current += char;
            continue;
        }

        if (quote === '"') {
            if (char === '"') {
                quote = null;
            } else if (char === "\\" && i + 1 < commandStr.length && '"\\$`'.includes(commandStr[i + 1]!)) {
                current += commandStr[++i];
            } else {
                current += char;
            }
            continue;
        }

        if (char === '"' || char === "'") {
            quote = char;
            inWord = true;
            continue;
        }
        if (char === "\\" && i + 1 < commandStr.length) {
            current += commandStr[++i];
            inWord = true;
            continue;
        }
        if (char === " " || char === "\t") {
            if (inWord) result.push(current);
            current = "";
            inWord = false;
            continue;
        }
        current += char;
        inWord = true;
    }

    if (inWord) result.push(current);
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
    optional: [],
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
    const optionalFlags = new Set(spec?.optional ?? []);

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
                if (isStrict && !booleanFlags.has(name) && !valueFlags.has(name) && !optionalFlags.has(name)) {
                    result.unknownFlags!.push(`--${name}`);
                }
                continue;
            }

            if (booleanFlags.has(body) || optionalFlags.has(body)) {
                result.flags[body] = true;
                continue;
            }

            if (valueFlags.has(body)) {
                const takesAny = isStrict && !OPTIONAL_VALUE.has(body);
                result.flags[body] = takeValue(args, i, takesAny);
                if (consumesNextToken(args, i, takesAny)) i++;
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

                if (optionalFlags.has(char)) {
                    const attached = chars.substring(j + 1);
                    result.flags[char] = attached.length > 0 ? attached : true;
                    break;
                }

                if (valueFlags.has(char)) {
                    const attached = chars.substring(j + 1);
                    if (attached.length > 0) {
                        result.flags[char] = attached;
                    } else {
                        result.flags[char] = takeValue(args, i, isStrict);
                        if (consumesNextToken(args, i, isStrict)) i++;
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

/**
 * Long options whose value is optional (`git branch --merged [<commit>]`): they only take the next
 * token when it is not itself an option.
 */
const OPTIONAL_VALUE = new Set(["merged", "no-merged", "contains", "no-contains", "points-at"]);

/**
 * True when the token after `index` serves as the flag's value. A required value takes the next
 * token whatever it looks like (`git commit -m -x` commits the message "-x", as getopt does);
 * otherwise only a token that is not itself a flag.
 */
function consumesNextToken(args: string[], index: number, takesAny = false): boolean {
    const next = args[index + 1];
    if (next === undefined) return false;
    return takesAny || next === "-" || !next.startsWith("-");
}

/** The next token as a flag value, or "" to signal "the flag needs a value but got none". */
function takeValue(args: string[], index: number, takesAny = false): string {
    return consumesNextToken(args, index, takesAny) ? args[index + 1]! : "";
}

/** Like takeValue, but yields boolean true when no value follows. */
function takeValueOrTrue(args: string[], index: number): string | boolean {
    return consumesNextToken(args, index) ? args[index + 1]! : true;
}
