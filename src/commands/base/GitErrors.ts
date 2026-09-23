/**
 * Shared error and hint formatting, so every command fails the way real Git fails.
 *
 * Two rules hold throughout:
 *  1. The first line is byte-for-byte what real Git prints, so muscle memory built here transfers to
 *     a real terminal.
 *  2. Extra teaching lines use Git's own `hint:` prefix. Real Git prints hints too (advice.*), so
 *     this stays authentic while telling a beginner what to do next instead of only what went wrong.
 */

/**
 * What every Git command prints outside a repository.
 *
 * Real Git names the missing `.git` directory and says nothing about how to fix it; the hint adds
 * that, because "not a git repository (or any of the parent directories)" tells a beginner what is
 * wrong only if they already know what a repository is.
 */
export function notARepository(): string[] {
    return [
        "fatal: not a git repository (or any of the parent directories): .git",
        hint("Run 'git init' here to start tracking this folder with Git."),
    ];
}

/** Levenshtein distance, used to turn a typo into a suggestion. */
export function levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

    for (let i = 1; i <= a.length; i++) {
        const current = [i];
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            current[j] = Math.min(
                (current[j - 1] ?? 0) + 1, // insertion
                (previous[j] ?? 0) + 1, // deletion
                (previous[j - 1] ?? 0) + cost, // substitution
            );
        }
        previous = current;
    }

    return previous[b.length] ?? 0;
}

/**
 * Candidates close enough to `input` to be worth suggesting, best first.
 *
 * The threshold scales with word length: a 4-letter word gets one edit, longer words get more, so
 * "stauts" finds "status" but "push" never suggests "pull" as a certainty.
 */
export function didYouMean(input: string, candidates: readonly string[], limit = 3): string[] {
    const lowered = input.toLowerCase();
    const threshold = Math.max(1, Math.floor(lowered.length / 3));

    return candidates
        .map(candidate => {
            const lowerCandidate = candidate.toLowerCase();
            // A pure case difference or a prefix is a much stronger signal than edit distance alone.
            if (lowerCandidate === lowered) return { candidate, distance: 0 };
            if (lowerCandidate.startsWith(lowered) || lowered.startsWith(lowerCandidate)) {
                return { candidate, distance: 0.5 };
            }
            return { candidate, distance: levenshtein(lowered, lowerCandidate) };
        })
        .filter(entry => entry.distance <= threshold)
        .sort((a, b) => a.distance - b.distance || a.candidate.localeCompare(b.candidate))
        .slice(0, limit)
        .map(entry => entry.candidate);
}

/** Prefix teaching lines the way Git prefixes its own advice. */
export function hint(line: string): string {
    return `hint: ${line}`;
}

/**
 * What real Git prints for an unrecognised subcommand, including its suggestion block.
 *
 * `git: 'stauts' is not a git command. See 'git --help'.` — then, when something is close,
 * `The most similar command is` / `\tstatus`.
 */
export function unknownGitSubcommand(subcommand: string, knownSubcommands: readonly string[]): string[] {
    const lines = [`git: '${subcommand}' is not a git command. See 'git --help'.`];
    const suggestions = didYouMean(subcommand, knownSubcommands);

    if (suggestions.length > 0) {
        lines.push("");
        lines.push(suggestions.length === 1 ? "The most similar command is" : "The most similar commands are");
        suggestions.forEach(suggestion => lines.push(`\t${suggestion}`));
    } else {
        lines.push(hint("Type 'help' to see every command this terminal knows."));
    }

    return lines;
}

/** What a shell prints for a command that is not Git and not a known builtin. */
export function unknownShellCommand(command: string, knownCommands: readonly string[]): string[] {
    const lines = [`${command}: command not found`];
    const suggestions = didYouMean(command, knownCommands);

    if (suggestions.length > 0) {
        lines.push(hint(`Did you mean ${suggestions.map(s => `'${s}'`).join(" or ")}?`));
    } else {
        lines.push(hint("Type 'help' to see every command this terminal knows."));
    }

    return lines;
}

/**
 * Real Git's response to a flag it does not know, plus the command's usage line.
 *
 * Git prints `error: unknown switch \`x'` for a short flag and `error: unknown option \`foce'` for a
 * long one — the odd backtick-quote pairing is Git's, and it is reproduced here on purpose.
 */
export function unknownFlagError(flag: string, usage: string): string[] {
    const isLong = flag.startsWith("--");
    const bare = flag.replace(/^--?/, "");
    const lines = isLong ? [`error: unknown option \`${bare}'`] : [`error: unknown switch \`${bare}'`];

    lines.push(`usage: ${usage}`);
    return lines;
}

/**
 * The first unknown flag a command was given, if any.
 *
 * Commands call this before acting so `git branch -x feature` reports the typo instead of quietly
 * creating a branch as though `-x` had never been typed.
 */
export function firstUnknownFlag(unknownFlags: string[] | undefined): string | undefined {
    return unknownFlags?.[0];
}

/**
 * Suggest an existing path when the one the user named does not match anything.
 *
 * Compares the basename too, so `git add indx.js` finds `src/index.js` — a beginner rarely knows
 * whether the file they want needs a directory in front of it.
 */
export function pathSuggestionHints(input: string, existingPaths: readonly string[]): string[] {
    const wanted = input.replace(/^\.?\//, "");
    const candidates = existingPaths
        .map(path => path.replace(/^\//, ""))
        .filter(path => !path.startsWith(".git/") && path !== ".git");

    const byFullPath = didYouMean(wanted, candidates, 2);
    if (byFullPath.length > 0) {
        return [hint(`Did you mean ${byFullPath.map(p => `'${p}'`).join(" or ")}?`)];
    }

    const base = wanted.split("/").pop() ?? wanted;
    const byBasename = candidates.filter(path => didYouMean(base, [path.split("/").pop() ?? path], 1).length > 0);
    if (byBasename.length > 0) {
        return [
            hint(
                `Did you mean ${byBasename
                    .slice(0, 2)
                    .map(p => `'${p}'`)
                    .join(" or ")}?`,
            ),
        ];
    }

    return [hint("Run 'git status' to see which files Git can see right now.")];
}

/**
 * Suggest an existing ref when the one the user named does not exist.
 *
 * Branch names are case-sensitive in Git, which is the single most common surprise for beginners
 * (`git branch -D Feature` when the branch is `feature`), so a case-only mismatch says so outright.
 */
export function refSuggestionHints(name: string, existing: readonly string[]): string[] {
    const caseOnlyMatch = existing.find(branch => branch.toLowerCase() === name.toLowerCase() && branch !== name);

    if (caseOnlyMatch) {
        return [hint(`Branch names are case-sensitive. Did you mean '${caseOnlyMatch}'?`)];
    }

    const suggestions = didYouMean(name, existing);
    if (suggestions.length > 0) {
        return [hint(`Did you mean ${suggestions.map(s => `'${s}'`).join(" or ")}?`)];
    }

    return [];
}
