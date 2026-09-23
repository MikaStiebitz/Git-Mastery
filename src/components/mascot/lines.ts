/**
 * What HEAD says.
 *
 * The character is HEAD, detached — the commit pointer that came off its branch and now follows the
 * player around. It is not a cheerful assistant: it wants to be re-attached, the player keeps not
 * doing it, and it has opinions. Every line is either true about Git or true about the player.
 *
 * Rules for adding lines:
 *  - Never "Great job!". State a Git fact that happens to be encouraging.
 *  - It must be true. A joke that teaches the wrong thing is worse than no joke.
 *  - It must have a referent in THIS game. There is no CI here, no pull request, no reviewer —
 *    jokes about them are borrowed from dev Twitter and land as filler.
 *  - English only, on purpose. Humour does not survive being translated six ways, and a flat joke
 *    in five languages is worse than a good one in the language it was written in.
 */

export type MascotCue = "levelComplete" | "stageComplete" | "firstCommit" | "struggle3" | "struggle7" | "idle" | "poke";

export const MASCOT_LINES: Record<MascotCue, readonly string[]> = {
    levelComplete: [
        "Committed. That SHA is yours now — good luck with the responsibility.",
        "Clean tree. I'd frame it, but I'm not attached to anything.",
        "For one second there I was pointing at a real branch. It was nice.",
        "Solved. I had it in two commands, but nobody's counting. I'm counting.",
        "Fast-forward: the most elegant way to avoid doing any work.",
        "That worked. I was about to suggest exactly that.",
        "Landed. Your history is one commit less embarrassing.",
        "Done. I felt that one in my ref.",
    ],
    stageComplete: [
        "A whole stage and not one force push. I'm almost proud.",
        "That earns a tag. Annotated. I won't be taking questions.",
        "Stage cleared. I'd throw confetti, but I am fundamentally a pointer.",
        "You could name a branch after me now. Just a thought.",
    ],
    firstCommit: ["Your first commit. It outlives us both. Well — me."],
    struggle3: [
        "Three in a row. `git blame` is pointing squarely at the keyboard.",
        "Three. I'm not judging. I'm a data structure. I'm mostly judging.",
        "Read the error, it's unusually polite in this repo.",
    ],
    struggle7: [
        "Seven. I'm going to say `git status` one more time and then I'll stop.",
        "Seven tries. At this point the repository is learning too.",
        "The hints button is right there. I won't tell anyone — I have no mouth.",
    ],
    idle: [
        "Still detached. No, I'm fine. Really.",
        "I could point at a branch. You'd only have to ask.",
        "Nothing here is real. Break whatever you like.",
    ],
    poke: [
        "Yes?",
        "I'm working.",
        "That tickles. I have no nerves, but still.",
        "Poke me again and I'll detach further.",
        "You have a whole course to finish and you're doing this.",
        "I'm a pointer. This is harassment of a pointer.",
    ],
} as const;

/**
 * Lines for specific commands, so the character reacts to what was actually typed rather than only
 * to outcomes. Keyed on the normalised `git <subcommand>` plus the flag that makes it interesting.
 */
export const MASCOT_COMMAND_LINES: Record<string, string> = {
    "git reset --hard": "Bold. Anything you hadn't committed is genuinely gone now.",
    "git push --force": "Force push. Somewhere a colleague just felt a chill.",
    "git rebase": "Rewriting history. My favourite genre.",
    "git stash": "Into the drawer it goes. You will forget it is there.",
    "git log": "Scrolling through the past. Relatable.",
    "git commit --amend": "Amending. We all wish we could.",
    "git reflog": "Ah, the safety net. Everyone finds it eventually.",
    "git gud": "...",
};

/**
 * A shuffle bag: every line in a cue is used once before any repeats.
 *
 * A plain random pick says the same thing twice in a row often enough to break the illusion that
 * anyone is home. Bags are module-scoped so the order survives a re-render, and reshuffle only when
 * exhausted. Deliberately not seeded — there is nothing to reproduce here.
 */
const bags = new Map<string, string[]>();

export function drawLine(cue: MascotCue): string {
    const pool = MASCOT_LINES[cue];
    if (pool.length === 0) return "";

    let bag = bags.get(cue);
    if (!bag || bag.length === 0) {
        bag = [...pool];
        // Fisher-Yates, then pop from the end.
        for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j]!, bag[i]!];
        }
        // Avoid immediately repeating the line that ended the previous bag.
        const last = lastDrawn.get(cue);
        if (bag.length > 1 && bag[bag.length - 1] === last) {
            [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1]!, bag[0]!];
        }
        bags.set(cue, bag);
    }

    const line = bag.pop() ?? pool[0]!;
    lastDrawn.set(cue, line);
    return line;
}

const lastDrawn = new Map<string, string>();

/** The line for a command, or undefined when this command is not worth a remark. */
export function lineForCommand(command: string): string | undefined {
    const normalised = command.trim().toLowerCase().replace(/\s+/g, " ");

    // Longest key first, so "git reset --hard" wins over "git reset".
    const keys = Object.keys(MASCOT_COMMAND_LINES).sort((a, b) => b.length - a.length);
    const match = keys.find(key => normalised === key || normalised.startsWith(`${key} `));

    return match ? MASCOT_COMMAND_LINES[match] : undefined;
}
