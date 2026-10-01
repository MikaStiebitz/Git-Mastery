import { splitCommandRespectingQuotes } from "~/commands/base/CommandParser";
import type { LevelRequirement, LevelType } from "~/types";

/**
 * Visual mode: Git commands as playable cards, the way Oh My Git! does it.
 *
 * A card is a command template with holes ("slots") in it. Playing a card fills the holes by
 * pointing at things on the board — a file, a branch, a commit — or, where Git wants a name or a
 * message, by typing it. The finished command then runs through exactly the same pipeline as a
 * typed one, so a played card is a real command: it shows up in the log, it can fail, and it
 * completes requirements the same way.
 *
 * This module is pure data and string handling, with no React, so the deck and the per-level hand
 * can be tested against every level in the game.
 */

/** What a slot asks the player for, and so which things on the board light up as targets. */
export type CardSlotKind =
    | "file" // one file
    | "files" // one file, or "." for everything
    | "branch" // an existing branch
    | "commit" // a commit in the graph (or HEAD)
    | "ref" // a branch or a commit
    | "dir" // a directory to change into
    | "name" // a new branch name
    | "message" // a commit or tag message
    | "tag" // a new tag name
    | "url" // a repository URL
    | "remote" // a remote name
    | "path" // a new file path
    | "pattern" // a search term
    | "author"; // an author name

/** Slot kinds that are filled by pointing at the board rather than by typing. */
export const BOARD_SLOT_KINDS: ReadonlySet<CardSlotKind> = new Set(["file", "files", "branch", "commit", "ref"]);

export const isBoardSlot = (kind: CardSlotKind): boolean => BOARD_SLOT_KINDS.has(kind);

/**
 * The card's colour, straight out of the Git legend: cyan is anything about branching, lime is a
 * commit, coral is undoing or throwing work away, grape is everything else.
 */
export type CardTone = "grape" | "lime" | "cyan" | "coral";

/** Where a card sits when the whole deck is laid out. */
export type CardGroup = "basics" | "branches" | "undo" | "history" | "remote";

export type CardIcon =
    | "init"
    | "status"
    | "add"
    | "commit"
    | "amend"
    | "remove"
    | "move"
    | "restore"
    | "diff"
    | "branch"
    | "switch"
    | "merge"
    | "rebase"
    | "abort"
    | "cherry"
    | "reset"
    | "revert"
    | "reflog"
    | "stash"
    | "stashPop"
    | "list"
    | "log"
    | "search"
    | "show"
    | "blame"
    | "bisect"
    | "tag"
    | "clone"
    | "folder"
    | "remote"
    | "push"
    | "pull";

/** One piece of a template token: literal text, or the index of the slot that fills it. */
type TokenPart = string | { slot: number };

export interface CardSlot {
    kind: CardSlotKind;
    /** How the hole is printed on the card face, e.g. `<file>`. */
    placeholder: string;
}

export interface GitCard {
    id: string;
    /** Human-readable template, e.g. `git reset --hard {commit}`. */
    template: string;
    /** The command the card runs, as words: `git reset` or `cd`. */
    base: string;
    /** Literal arguments the card always passes (flags and sub-commands), used to match requirements. */
    fixed: string[];
    slots: CardSlot[];
    tone: CardTone;
    group: CardGroup;
    icon: CardIcon;
    /** Parsed template, one entry per command-line word. */
    tokens: TokenPart[][];
}

const PLACEHOLDERS: Record<CardSlotKind, string> = {
    file: "<file>",
    files: "<file>",
    branch: "<branch>",
    commit: "<commit>",
    ref: "<branch|commit>",
    dir: "<folder>",
    name: "<new-branch>",
    message: '"<message>"',
    tag: "<tag>",
    url: "<url>",
    remote: "<remote>",
    path: "<new-path>",
    pattern: "<text>",
    author: "<author>",
};

/** Values a text slot starts with, so the common case is one tap. */
export const SLOT_DEFAULTS: Partial<Record<CardSlotKind, string>> = {
    url: "https://github.com/octocat/Hello-World.git",
    remote: "origin",
};

function defineCard(
    id: string,
    template: string,
    tone: CardTone,
    group: CardGroup,
    icon: CardIcon,
    slotKinds: CardSlotKind[] = [],
): GitCard {
    const words = template.split(" ");
    const slots: CardSlot[] = [];
    const tokens: TokenPart[][] = words.map(word => {
        const parts: TokenPart[] = [];
        const re = /\{(\w+)\}/g;
        let last = 0;
        let match: RegExpExecArray | null;
        while ((match = re.exec(word)) !== null) {
            if (match.index > last) parts.push(word.slice(last, match.index));
            const kind = slotKinds[slots.length];
            if (!kind) throw new Error(`Card ${id}: no slot kind for {${match[1]}}`);
            parts.push({ slot: slots.length });
            slots.push({ kind, placeholder: PLACEHOLDERS[kind] });
            last = match.index + match[0].length;
        }
        if (last < word.length) parts.push(word.slice(last));
        return parts;
    });
    if (slots.length !== slotKinds.length) throw new Error(`Card ${id}: slot count mismatch`);

    const baseLength = words[0] === "git" ? 2 : 1;
    const base = words.slice(0, baseLength).join(" ");

    // A literal word after the base is a fixed argument. For `--author={author}` the flag in front
    // of the hole counts too, because that is what a requirement asks for ("--author").
    const fixed: string[] = [];
    tokens.slice(baseLength).forEach(parts => {
        const first = parts[0];
        if (typeof first !== "string") return;
        if (parts.length === 1) fixed.push(first);
        else if (first.endsWith("=")) fixed.push(first.slice(0, -1));
    });

    return { id, template, base, fixed, slots, tone, group, icon, tokens };
}

/** Every card in the game, in the order the full deck is laid out. */
export const CARD_DECK: GitCard[] = [
    // Basics: the working directory, the staging area and the commit.
    defineCard("init", "git init", "grape", "basics", "init"),
    defineCard("status", "git status", "grape", "basics", "status"),
    defineCard("add", "git add {file}", "grape", "basics", "add", ["files"]),
    defineCard("commit", "git commit -m {message}", "lime", "basics", "commit", ["message"]),
    defineCard("commit-all", "git commit -a -m {message}", "lime", "basics", "commit", ["message"]),
    defineCard("commit-amend", "git commit --amend -m {message}", "lime", "basics", "amend", ["message"]),
    defineCard("diff", "git diff", "grape", "basics", "diff"),
    defineCard("diff-staged", "git diff --staged", "grape", "basics", "diff"),
    defineCard("mv", "git mv {file} {path}", "grape", "basics", "move", ["file", "path"]),
    defineCard("rm", "git rm {file}", "coral", "basics", "remove", ["file"]),
    defineCard("restore", "git restore {file}", "coral", "basics", "restore", ["files"]),
    defineCard("restore-staged", "git restore --staged {file}", "coral", "basics", "restore", ["files"]),

    // Branches: moving HEAD around and bringing lines of history together.
    defineCard("branch-list", "git branch", "cyan", "branches", "list"),
    defineCard("branch-create", "git branch {name}", "cyan", "branches", "branch", ["name"]),
    defineCard("branch-at", "git branch {name} {commit}", "cyan", "branches", "branch", ["name", "commit"]),
    defineCard("branch-delete", "git branch -d {branch}", "coral", "branches", "remove", ["branch"]),
    defineCard("branch-force-delete", "git branch -D {branch}", "coral", "branches", "remove", ["branch"]),
    defineCard("switch", "git switch {branch}", "cyan", "branches", "switch", ["branch"]),
    defineCard("switch-create", "git switch -c {name}", "cyan", "branches", "branch", ["name"]),
    defineCard("checkout", "git checkout {ref}", "cyan", "branches", "switch", ["ref"]),
    defineCard("checkout-create", "git checkout -b {name}", "cyan", "branches", "branch", ["name"]),
    defineCard("merge", "git merge {branch}", "cyan", "branches", "merge", ["branch"]),
    defineCard("merge-abort", "git merge --abort", "coral", "branches", "abort"),
    defineCard("rebase", "git rebase {branch}", "cyan", "branches", "rebase", ["branch"]),
    defineCard("rebase-onto", "git rebase {branch} {branch}", "cyan", "branches", "rebase", ["branch", "branch"]),
    defineCard("rebase-interactive", "git rebase -i {commit}", "cyan", "branches", "rebase", ["commit"]),
    defineCard("rebase-abort", "git rebase --abort", "coral", "branches", "abort"),
    defineCard("cherry-pick", "git cherry-pick {commit}", "cyan", "branches", "cherry", ["commit"]),

    // Undo: taking things back, from gentle to destructive.
    defineCard("reset-soft", "git reset --soft {commit}", "coral", "undo", "reset", ["commit"]),
    defineCard("reset", "git reset {commit}", "coral", "undo", "reset", ["commit"]),
    defineCard("reset-hard", "git reset --hard {commit}", "coral", "undo", "reset", ["commit"]),
    defineCard("revert", "git revert {commit}", "coral", "undo", "revert", ["commit"]),
    defineCard("reflog", "git reflog", "grape", "undo", "reflog"),
    defineCard("stash", "git stash", "grape", "undo", "stash"),
    defineCard("stash-pop", "git stash pop", "grape", "undo", "stashPop"),
    defineCard("stash-apply", "git stash apply", "grape", "undo", "stashPop"),
    defineCard("stash-list", "git stash list", "grape", "undo", "list"),

    // History: reading what happened.
    defineCard("log", "git log", "grape", "history", "log"),
    defineCard("log-oneline", "git log --oneline", "grape", "history", "log"),
    defineCard("log-author", "git log --author={author}", "grape", "history", "search", ["author"]),
    defineCard("log-grep", "git log --grep={pattern}", "grape", "history", "search", ["pattern"]),
    defineCard("log-pickaxe", "git log -S {pattern}", "grape", "history", "search", ["pattern"]),
    defineCard("show", "git show {commit}", "grape", "history", "show", ["commit"]),
    defineCard("blame", "git blame {file}", "grape", "history", "blame", ["file"]),
    defineCard("tag-list", "git tag", "grape", "history", "list"),
    defineCard("tag", "git tag {tag}", "grape", "history", "tag", ["tag"]),
    defineCard("tag-annotated", "git tag -a {tag} -m {message}", "grape", "history", "tag", ["tag", "message"]),
    defineCard("bisect-start", "git bisect start", "grape", "history", "bisect"),
    defineCard("bisect-bad", "git bisect bad", "coral", "history", "bisect"),
    defineCard("bisect-good", "git bisect good", "lime", "history", "bisect"),
    defineCard("bisect-reset", "git bisect reset", "grape", "history", "bisect"),

    // Remote: other copies of the repository.
    defineCard("clone", "git clone {url}", "grape", "remote", "clone", ["url"]),
    defineCard("cd", "cd {dir}", "grape", "remote", "folder", ["dir"]),
    defineCard("remote-add", "git remote add {remote} {url}", "grape", "remote", "remote", ["remote", "url"]),
    defineCard("push", "git push", "grape", "remote", "push"),
    defineCard("push-branch", "git push origin {branch}", "grape", "remote", "push", ["branch"]),
    defineCard("push-upstream", "git push -u origin {branch}", "grape", "remote", "push", ["branch"]),
    defineCard("push-tags", "git push --tags", "grape", "remote", "push"),
    defineCard("pull", "git pull", "grape", "remote", "pull"),
    defineCard("pull-branch", "git pull origin {branch}", "grape", "remote", "pull", ["branch"]),
];

const CARDS_BY_ID = new Map(CARD_DECK.map(card => [card.id, card]));

export function getCard(id: string): GitCard | undefined {
    return CARDS_BY_ID.get(id);
}

export const CARD_GROUPS: CardGroup[] = ["basics", "branches", "undo", "history", "remote"];

/** Cards every level hand gets, because they never hurt and always teach something. */
const ALWAYS_IN_HAND = ["status"];

// ── Building and reading commands ─────────────────────────────────────────────────────────────

/**
 * Quote a value so the command parser hands it back as one word.
 *
 * The parser splits on spaces outside quotes and strips the quotes, but it does not unescape a
 * backslash-quote. So rather than escape, pick the quote character the value does not contain.
 */
function quoteValue(value: string, always: boolean): string {
    const needsQuotes = always || /[\s"']/.test(value) || value === "";
    if (!needsQuotes) return value;
    if (!value.includes('"')) return `"${value}"`;
    if (!value.includes("'")) return `'${value}'`;
    return `"${value.replace(/"/g, "'")}"`;
}

/** The command a card runs once every slot has a value. */
export function buildCommand(card: GitCard, values: string[]): string {
    return card.tokens
        .map(parts => {
            const isWholeSlot = parts.length === 1 && typeof parts[0] !== "string";
            return parts
                .map(part => {
                    if (typeof part === "string") return part;
                    const slot = card.slots[part.slot]!;
                    const value = values[part.slot] ?? "";
                    // Messages are always quoted, like everyone types them; anything else only when
                    // it has to be. A value glued to a flag (`--grep=two words`) needs quotes too.
                    return quoteValue(value, slot.kind === "message" && isWholeSlot);
                })
                .join("");
        })
        .join(" ");
}

/**
 * Read a typed command back as a card: the slot values if `command` is exactly this card's
 * template with holes filled in, otherwise null.
 */
export function matchCommandToCard(card: GitCard, command: string): string[] | null {
    const words = splitCommandRespectingQuotes(command.trim());
    if (words.length !== card.tokens.length) return null;

    const values: string[] = [];
    for (let i = 0; i < words.length; i++) {
        const word = words[i]!;
        const parts = card.tokens[i]!;

        if (parts.length === 1 && typeof parts[0] === "string") {
            if (word !== parts[0]) return null;
            continue;
        }

        // Literal prefix (or nothing) followed by one hole, which is the only shape templates use.
        const prefix = typeof parts[0] === "string" ? parts[0] : "";
        const hole = parts.find((p): p is { slot: number } => typeof p !== "string");
        if (!hole || !word.startsWith(prefix)) return null;
        const value = word.slice(prefix.length);
        // A hole never swallows a flag: `git add -A` is not `git add {file}`.
        if (value === "" || (prefix === "" && value.startsWith("-"))) return null;
        values[hole.slot] = value;
    }
    return values;
}

/** The first card in `cards` that `command` is an instance of, with its slot values. */
export function findCardForCommand(
    command: string,
    cards: GitCard[] = CARD_DECK,
): { card: GitCard; values: string[] } | null {
    for (const card of cards) {
        const values = matchCommandToCard(card, command);
        if (values) return { card, values };
    }
    return null;
}

// ── Which cards a level deals ─────────────────────────────────────────────────────────────────

/** Requirement arguments that are rules for the matcher, not words the player types. */
const META_ARGS = new Set(["any", "<hash>"]);

/**
 * The card that best fulfils one requirement, or undefined when no card can.
 *
 * A requirement names a command and the arguments it insists on. Flags and sub-commands
 * ("--hard", "pop") must be printed on the card itself; anything else ("main", "HEAD") is a value
 * the player supplies through a slot. Among the cards that qualify, the one adding the fewest
 * extra flags wins, then the one whose number of holes fits best — so `git reset --soft` deals
 * the soft-reset card and not the hard one, and `git rebase main feature` deals the two-branch
 * rebase.
 */
export function cardForRequirement(requirement: LevelRequirement): GitCard | undefined {
    if (!requirement.command) return undefined;

    const candidates = CARD_DECK.filter(card => card.base === requirement.command);
    if (candidates.length === 0) return undefined;

    const knownWords = new Set(candidates.flatMap(card => card.fixed));
    const args = requirement.requiresArgs ?? [];
    const flags = args.filter(arg => !META_ARGS.has(arg) && (arg.startsWith("-") || knownWords.has(arg)));
    const values = args.filter(arg => !META_ARGS.has(arg) && !flags.includes(arg));
    const needsAnyArg = args.includes("any");
    const needsCommit = args.includes("<hash>");

    let best: GitCard | undefined;
    let bestScore = Infinity;
    for (const card of candidates) {
        if (!flags.every(flag => card.fixed.includes(flag))) continue;
        if (card.slots.length < values.length) continue;
        if (needsAnyArg && card.slots.length + card.fixed.length === 0) continue;
        if (needsCommit && !card.slots.some(slot => slot.kind === "commit" || slot.kind === "ref")) continue;

        const extraFlags = card.fixed.filter(word => !flags.includes(word)).length;
        const holeMismatch = Math.abs(card.slots.length - Math.max(values.length, needsAnyArg ? 1 : 0));
        const score = extraFlags * 10 + holeMismatch;
        if (score < bestScore) {
            best = card;
            bestScore = score;
        }
    }
    return best;
}

/**
 * Commands a piece of level text mentions: everything in `backticks`, plus bare `git …` runs in
 * prose like "Start by stashing: git stash".
 */
export function extractCommands(text: string): string[] {
    const found: string[] = [];

    for (const match of text.matchAll(/`([^`]+)`/g)) {
        const code = match[1]!.trim();
        if (/^(git|cd)\b/.test(code)) found.push(code);
    }

    const prose = text.replace(/`[^`]*`/g, " ");
    for (const match of prose.matchAll(/\bgit [a-z-]+(?: [^\s,;:()]+)*/g)) {
        // A sentence-ending full stop is punctuation, not part of the last argument ("git add .").
        found.push(match[0].replace(/(\S)\.$/, "$1"));
    }

    return found;
}

/**
 * The commands a level tells the player to use. The story is left out on purpose: narratives
 * name-drop commands for colour ("one day you'll need bisect"), and those are not part of the task.
 */
function commandsInLevel(level: LevelType): string[] {
    return [level.description, ...level.objectives, ...level.hints].flatMap(extractCommands);
}

/**
 * The hand a level deals in visual mode, in the order the player will most likely need it.
 *
 * Cards come from the level's own requirements, so every level can be finished with the hand it
 * deals, plus any command the level's hints or objectives spell out (stash level 2 asks for a
 * `git switch` but its hint says `git switch -c`, and the hint is what the player will reach for).
 */
export function getLevelHand(level: LevelType): GitCard[] {
    const ids: string[] = [];
    const add = (card: GitCard | undefined) => {
        if (card && !ids.includes(card.id)) ids.push(card.id);
    };

    level.requirements.forEach(requirement => add(cardForRequirement(requirement)));
    commandsInLevel(level).forEach(command => add(findCardForCommand(command)?.card));
    ALWAYS_IN_HAND.forEach(id => add(getCard(id)));

    return ids.map(id => getCard(id)!);
}

/** A value from level text is only a useful suggestion if it is not itself a placeholder. */
function isConcreteValue(value: string): boolean {
    return value.length > 0 && !/[<>…]|\.\.\./.test(value) && !/^your[\s-]/i.test(value);
}

/**
 * Values the level's own text uses for a card's typed slot: the branch name the hint creates, the
 * commit message an objective quotes. Offered as one-tap chips next to the input.
 */
export function getSlotSuggestions(level: LevelType | null, card: GitCard, slotIndex: number): string[] {
    const suggestions: string[] = [];
    const slot = card.slots[slotIndex];
    if (!slot) return suggestions;

    if (level) {
        for (const command of commandsInLevel(level)) {
            const value = matchCommandToCard(card, command)?.[slotIndex];
            if (value && isConcreteValue(value) && !suggestions.includes(value)) suggestions.push(value);
        }
    }

    const fallback = SLOT_DEFAULTS[slot.kind];
    if (fallback && !suggestions.includes(fallback)) suggestions.push(fallback);

    return suggestions.slice(0, 4);
}
