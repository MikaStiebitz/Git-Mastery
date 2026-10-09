import { splitCommandRespectingQuotes } from "~/commands/base/CommandParser";

const COMMIT_SUMMARY_LINE = /^\[[^\]\s]+(?: \(root-commit\))? [0-9a-f]{7}\] /;

/**
 * `[main abc1234] <message>` echoes whatever the player typed as the commit message. That is their
 * text, not Git's, so a message containing "failed" or "command not found" (in any language) must
 * not read as a failure or a mistake.
 */
function gitOwnLines(output: string[], command?: string): string[] {
    const typed = typedWords(command);
    return output
        .filter(line => !COMMIT_SUMMARY_LINE.test(line))
        .map(line => typed.reduce((rest, word) => rest.split(word).join(""), line.toLowerCase()));
}

/**
 * The words the player chose themselves: file, branch, tag and remote names, commit messages. Commands
 * echo them on success ("Created branch 'failed-login'"), and a name that happens to contain a failure
 * phrase must not turn a working command into a mistake. The command words themselves stay, because
 * "nothing to commit" is only a failure when it is Git saying it.
 */
function typedWords(command?: string): string[] {
    if (!command) return [];
    const tokens = splitCommandRespectingQuotes(command.trim());
    const rest = tokens.slice(tokens[0]?.toLowerCase() === "git" ? 2 : 1);
    return [...new Set(rest.filter(t => t.length >= 3 && !t.startsWith("-")).map(t => t.toLowerCase()))].sort(
        (a, b) => b.length - a.length,
    );
}

/** Without the command we cannot tell, so stay strict (the pre-existing behaviour). */
function isCommitCommand(command?: string): boolean {
    if (!command) return true;
    const [cmd, sub] = splitCommandRespectingQuotes(command.trim());
    return cmd?.toLowerCase() === "git" && sub?.toLowerCase() === "commit";
}

/**
 * Did a command fail, judged from what it printed?
 *
 * Level completion is only checked for commands that worked, so this decides whether a typed command
 * counts at all. It reads the output rather than a status code because the simulated commands return
 * lines, not codes — which means the phrases below are load-bearing: a failure mode that prints none
 * of them would let a level complete on a command that achieved nothing.
 *
 * Shared by the terminal and the tests so both agree on what "worked" means.
 */
export function didCommandFail(output: string[], command?: string): boolean {
    const commitMayBeEmpty = isCommitCommand(command);
    return gitOwnLines(output, command).some(line => {
        const lowerLine = line.toLowerCase();

        // A merge conflict is a normal state to be in, not a failed command.
        if (lowerLine.includes("merge") && lowerLine.includes("failed")) return false;
        if (lowerLine.includes("automatic merge failed")) return false;

        return (
            lowerLine.includes("error:") ||
            lowerLine.includes("fatal:") ||
            // "Failed to create file: x" opens the line. Matching "failed" anywhere would also catch
            // `git status`, `git branch` or `git diff` listing a file or branch that is merely named so.
            lowerLine.startsWith("failed to ") ||
            lowerLine.includes("aborting commit") ||
            lowerLine.includes("not a git repository") ||
            lowerLine.includes("nothing specified") ||
            lowerLine.includes("did not match any files") ||
            (lowerLine.includes("pathspec") && lowerLine.includes("did not match")) ||
            // Git reports "nothing to commit" as a successful no-op, but for a level it means the
            // commit the task asked for never happened. Only `git commit` can fail that way: a
            // clean `git status` prints the same words and is exactly what a careful player runs.
            (commitMayBeEmpty &&
                (lowerLine.includes("nothing to commit") ||
                    lowerLine.includes("no changes added to commit") ||
                    lowerLine.includes("nothing added to commit")))
        );
    });
}

/**
 * Did the player make a mistake, judged from what the command printed?
 *
 * Wider than `didCommandFail`, which decides whether a command may complete a level and must stay
 * narrow: a mistyped command is not a failed *Git* operation, but it is exactly the slip the star
 * rating is about, and counting it is what makes "no failed commands" mean what it says.
 */
export function isMistake(output: string[], command?: string): boolean {
    return (
        didCommandFail(output, command) ||
        gitOwnLines(output, command).some(line => {
            const lowerLine = line.toLowerCase();
            return lowerLine.includes("command not found") || lowerLine.includes("is not a git command");
        })
    );
}
