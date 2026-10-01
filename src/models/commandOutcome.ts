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
export function didCommandFail(output: string[]): boolean {
    return output.some(line => {
        const lowerLine = line.toLowerCase();

        // A merge conflict is a normal state to be in, not a failed command.
        if (lowerLine.includes("merge") && lowerLine.includes("failed")) return false;
        if (lowerLine.includes("automatic merge failed")) return false;

        return (
            lowerLine.includes("error:") ||
            lowerLine.includes("fatal:") ||
            lowerLine.includes("failed") ||
            lowerLine.includes("aborting commit") ||
            lowerLine.includes("not a git repository") ||
            lowerLine.includes("nothing specified") ||
            lowerLine.includes("did not match any files") ||
            (lowerLine.includes("pathspec") && lowerLine.includes("did not match")) ||
            // Git reports "nothing to commit" as a successful no-op, but for a level it means the
            // commit the task asked for never happened.
            lowerLine.includes("nothing to commit") ||
            lowerLine.includes("no changes added to commit") ||
            lowerLine.includes("nothing added to commit")
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
export function isMistake(output: string[]): boolean {
    return (
        didCommandFail(output) ||
        output.some(line => {
            const lowerLine = line.toLowerCase();
            return lowerLine.includes("command not found") || lowerLine.includes("is not a git command");
        })
    );
}
