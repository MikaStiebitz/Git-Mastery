import { describe, it, expect } from "vitest";
import { allStages } from "~/levels";
import { translations } from "~/translations";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { LevelManager } from "~/models/LevelManager";
import { CommandProcessor } from "~/models/CommandProcessor";
import { ProgressManager } from "~/models/ProgressManager";
import { splitCommandRespectingQuotes } from "~/commands/base/CommandParser";
import {
    CARD_DECK,
    CARD_GROUPS,
    buildCommand,
    cardForRequirement,
    extractCommands,
    findCardForCommand,
    getCard,
    getLevelHand,
    getSlotSuggestions,
    matchCommandToCard,
    type CardSlotKind,
} from "~/lib/visualCards";

const en = translations.en as Record<string, string>;
const t = (key: string) => en[key] ?? key;
const levelManager = new LevelManager();

/** Every level in the game, translated, the way the board sees it. */
const allLevels = Object.entries(allStages).flatMap(([stageId, stage]) =>
    Object.keys(stage.levels).map(id => ({
        stageId,
        levelId: Number(id),
        level: levelManager.getLevel(stageId, Number(id), t)!,
    })),
);

describe("card deck", () => {
    it("has unique card ids", () => {
        const ids = CARD_DECK.map(card => card.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("has a description for every card, a label for every slot kind and a heading for every group", () => {
        const slotKinds = new Set<CardSlotKind>(CARD_DECK.flatMap(card => card.slots.map(slot => slot.kind)));
        const missing = [
            ...CARD_DECK.map(card => `visual.card.${card.id}`),
            ...[...slotKinds].map(kind => `visual.slot.${kind}`),
            ...CARD_GROUPS.map(group => `visual.group.${group}`),
        ].filter(key => !(key in en));
        expect(missing).toEqual([]);
    });

    it("reads back every command it builds", () => {
        const samples: Record<CardSlotKind, string> = {
            file: "src/app.js",
            files: ".",
            branch: "feature/login",
            commit: "a1b2c3d",
            ref: "main",
            dir: "repo",
            name: "new-feature",
            message: "Fix the login bug",
            tag: "v1.0.0",
            url: "https://github.com/user/repo.git",
            remote: "origin",
            path: "src/config.js",
            pattern: "two words",
            author: "Sarah",
        };
        for (const card of CARD_DECK) {
            const values = card.slots.map(slot => samples[slot.kind]);
            const command = buildCommand(card, values);
            expect(matchCommandToCard(card, command), `${card.id}: ${command}`).toEqual(values);
            expect(findCardForCommand(command)?.card.id, command).toBe(card.id);
        }
    });

    it("quotes messages and values with spaces so they stay one argument", () => {
        expect(buildCommand(getCard("commit")!, ["Initial commit"])).toBe('git commit -m "Initial commit"');
        expect(buildCommand(getCard("commit")!, ['Say "hi"'])).toBe("git commit -m 'Say \"hi\"'");
        expect(buildCommand(getCard("log-grep")!, ["feature 2"])).toBe('git log --grep="feature 2"');
        expect(buildCommand(getCard("add")!, ["."])).toBe("git add .");
        expect(buildCommand(getCard("rebase-onto")!, ["main", "feature/payment-api"])).toBe(
            "git rebase main feature/payment-api",
        );
    });

    it("never lets a hole swallow a flag", () => {
        expect(matchCommandToCard(getCard("add")!, "git add -A")).toBeNull();
        expect(findCardForCommand("git branch -d old")?.card.id).toBe("branch-delete");
        expect(findCardForCommand("git rebase -i HEAD~3")?.card.id).toBe("rebase-interactive");
    });
});

describe("extractCommands", () => {
    it("finds commands in backticks and in plain prose", () => {
        expect(extractCommands("Use `git switch -c feature` to start")).toEqual(["git switch -c feature"]);
        expect(extractCommands("Start by stashing: git stash")).toEqual(["git stash"]);
        expect(extractCommands("Switch to main: git switch main (or git checkout main)")).toEqual([
            "git switch main",
            "git checkout main",
        ]);
        expect(extractCommands("Stage everything with git add .")).toEqual(["git add ."]);
    });
});

describe("level hands", () => {
    it("deal a card for every command requirement in every level", () => {
        const gaps: string[] = [];
        for (const { stageId, levelId, level } of allLevels) {
            const hand = getLevelHand(level).map(card => card.id);
            for (const requirement of level.requirements) {
                if (!requirement.command) continue; // state checks (edit a file) are done on the board
                const card = cardForRequirement(requirement);
                if (!card || !hand.includes(card.id)) {
                    gaps.push(
                        `${stageId} ${levelId}: ${requirement.command} ${JSON.stringify(requirement.requiresArgs)}`,
                    );
                }
            }
        }
        expect(gaps).toEqual([]);
    });

    it("pick the card whose flags a requirement asks for", () => {
        const pick = (command: string, requiresArgs?: string[]) =>
            cardForRequirement({ id: "x", command, requiresArgs, description: "" })?.id;

        expect(pick("git reset", ["--soft"])).toBe("reset-soft");
        expect(pick("git reset", ["--hard"])).toBe("reset-hard");
        expect(pick("git reset", ["<hash>"])).toBe("reset");
        expect(pick("git switch", ["-c"])).toBe("switch-create");
        expect(pick("git switch", ["main"])).toBe("switch");
        expect(pick("git commit")).toBe("commit");
        expect(pick("git commit", ["--amend"])).toBe("commit-amend");
        expect(pick("git push")).toBe("push");
        expect(pick("git push", ["origin"])).toBe("push-branch");
        expect(pick("git push", ["-u", "origin"])).toBe("push-upstream");
        expect(pick("git push", ["--tags"])).toBe("push-tags");
        expect(pick("git rebase", ["main", "feature/payment-api"])).toBe("rebase-onto");
        expect(pick("git tag")).toBe("tag-list");
        expect(pick("git tag", ["any"])).toBe("tag");
        expect(pick("git tag", ["-a"])).toBe("tag-annotated");
        expect(pick("git branch", ["-D", "experiment/new-ui"])).toBe("branch-force-delete");
        expect(pick("git log", ["--author"])).toBe("log-author");
        expect(pick("git stash", ["pop"])).toBe("stash-pop");
        expect(pick("git bisect", ["good"])).toBe("bisect-good");
        expect(pick("")).toBeUndefined();
    });

    it("include commands the hints spell out, and suggest the names they use", () => {
        const stash2 = allLevels.find(l => l.stageId === "Stash" && l.levelId === 2)!.level;
        const switchCreate = getCard("switch-create")!;
        expect(getLevelHand(stash2).map(card => card.id)).toContain("switch-create");
        expect(getSlotSuggestions(stash2, switchCreate, 0)).toContain("feature/new-task");
    });

    it("never suggest a placeholder", () => {
        const files4 = allLevels.find(l => l.stageId === "Files" && l.levelId === 4)!.level;
        const suggestions = getSlotSuggestions(files4, getCard("mv")!, 1);
        expect(suggestions.some(s => s.includes("<"))).toBe(false);
    });
});

/**
 * Playing levels with nothing but cards, the way the board does it: board slots get what the
 * player would tap (a file path, a branch name, a commit id from the graph), typed slots get text.
 */
describe("playing levels with cards", () => {
    function startLevel(stageId: string, levelId: number) {
        const fileSystem = new FileSystem();
        const gitRepository = new GitRepository(fileSystem);
        const progressManager = new ProgressManager();
        const manager = new LevelManager();
        const processor = new CommandProcessor(fileSystem, gitRepository, progressManager);
        manager.setupLevel(stageId, levelId, fileSystem, gitRepository);
        processor.setCurrentDirectory("/");
        const level = manager.getLevel(stageId, levelId, t)!;
        const hand = getLevelHand(level).map(card => card.id);

        let completed = false;
        const play = (cardId: string, ...values: string[]) => {
            expect(hand, `${stageId} ${levelId} deals ${cardId}`).toContain(cardId);
            const command = buildCommand(getCard(cardId)!, values);
            const output = processor.processCommand(command);
            const [cmd, ...args] = splitCommandRespectingQuotes(command);
            completed = manager.checkLevelCompletion(stageId, levelId, cmd!, args, gitRepository) || completed;
            return output;
        };

        return { fileSystem, gitRepository, play, isCompleted: () => completed };
    }

    it("Files 1: drop `git add` on all files", () => {
        const game = startLevel("Files", 1);
        game.play("add", ".");
        expect(game.isCompleted()).toBe(true);
    });

    it("Branches 2: create a branch with a typed name", () => {
        const game = startLevel("Branches", 2);
        game.play("switch-create", "new-feature");
        expect(game.isCompleted()).toBe(true);
        expect(game.gitRepository.getCurrentBranch()).toBe("new-feature");
    });

    it("Merge 1: drop `git merge` on the other branch in the graph", () => {
        const game = startLevel("Merge", 1);
        const other = Object.keys(game.gitRepository.getBranchHeads()).find(
            b => b !== game.gitRepository.getCurrentBranch(),
        )!;
        game.play("merge", other);
        expect(game.isCompleted()).toBe(true);
    });

    it("Reset 2: hard-reset by picking commits in the graph", () => {
        const game = startLevel("Reset", 2);
        const history = game.gitRepository.getCommitHistory();
        game.play("reset-hard", history[history.length - 2]!);
        game.play("reset-hard", "HEAD");
        const after = game.gitRepository.getCommitHistory();
        game.play("reset-hard", after[0]!);
        expect(game.isCompleted()).toBe(true);
    });

    it("Reset 4: revert HEAD with the quick pick", () => {
        const game = startLevel("Reset", 4);
        game.play("log-oneline");
        game.play("revert", "HEAD");
        expect(game.isCompleted()).toBe(true);
    });

    it("Rebase 5: pick two branches for the two-argument rebase", () => {
        const game = startLevel("Rebase", 5);
        game.play("rebase-onto", "main", "feature/payment-api");
        expect(game.isCompleted()).toBe(true);
    });

    it("Advanced 3: show a commit picked by its hash", () => {
        const game = startLevel("Advanced", 3);
        const [first] = game.gitRepository.getCommitHistory();
        game.play("show", first!);
        expect(game.isCompleted()).toBe(true);
    });

    it("Archaeology 4: unstage one file, then discard changes in another", () => {
        const game = startLevel("Archaeology", 4);
        game.play("restore-staged", "config.js");
        game.play("restore", "notes.md");
        expect(game.isCompleted()).toBe(true);
    });

    it("Remote 1: add a remote with the suggested name and URL", () => {
        const game = startLevel("Remote", 1);
        const card = getCard("remote-add")!;
        const [remote] = getSlotSuggestions(null, card, 0);
        const [url] = getSlotSuggestions(null, card, 1);
        game.play("remote-add", remote!, url!);
        expect(game.isCompleted()).toBe(true);
    });

    it("Intro 3: clone, then change into the folder the clone created", () => {
        const game = startLevel("Intro", 3);
        game.play("clone", getSlotSuggestions(null, getCard("clone")!, 0)[0]!);
        const folders = Object.entries(game.fileSystem.getDirectoryContents("/") ?? {})
            .filter(([name, item]) => item.type === "directory" && !name.startsWith("."))
            .map(([name]) => name);
        expect(folders.length).toBeGreaterThan(0);
        game.play("cd", folders[0]!);
        expect(game.isCompleted()).toBe(true);
    });

    it("Stash 2: the hint's `git switch -c` card finishes the level", () => {
        const game = startLevel("Stash", 2);
        game.play("stash");
        game.play("switch", "main");
        game.play("switch-create", "feature/new-task");
        game.play("switch", "feature/old-task");
        game.play("stash-pop");
        expect(game.isCompleted()).toBe(true);
    });
});
