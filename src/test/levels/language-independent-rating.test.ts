/**
 * Issue #103: the star rating must not depend on the UI language.
 *
 * Stars count commands whose *output* looks like a mistake. Output can echo what the player typed (a
 * commit message, file names), and players type in their own language, so the same correct solution
 * of Level files/4 must rate identically whatever the words or characters in their commit message.
 */
import { describe, it, expect } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { LevelManager } from "~/models/LevelManager";
import { CommandProcessor } from "~/models/CommandProcessor";
import { ProgressManager } from "~/models/ProgressManager";
import { splitCommandRespectingQuotes } from "~/commands/base/CommandParser";
import { didCommandFail, isMistake } from "~/models/commandOutcome";
import { starsForMistakes } from "~/lib/stars";

const MESSAGES = [
    // One per UI language
    "Rename config file",
    "Konfigurationsdatei umbenannt",
    "Archivo de configuración renombrado",
    "Yapılandırma dosyası yeniden adlandırıldı",
    "फ़ाइल का नाम बदला",
    "نام فایل تغییر کرد",
    // Special characters
    "Größe: Straße über ändern – ß ö ü Ä",
    "Datei umbenannt 🎉",
    "Umbenennung (config) & more; $HOME `x` #1",
    "it's renamed",
    // Words the outcome check looks for, in a player's message
    "Fix: error: failed to load config",
    "fatal: kein Fehler",
    "nothing to commit, working tree clean",
    "Merge failed? Nein, alles gut",
    "pathspec 'x' did not match any files",
    "command not found und is not a git command",
    "Aborting commit due to empty commit message.",
];

function solveLevel(commitCommand: (message: string) => string, message: string) {
    const fileSystem = new FileSystem();
    const gitRepository = new GitRepository(fileSystem);
    const processor = new CommandProcessor(fileSystem, gitRepository, new ProgressManager());
    const levelManager = new LevelManager();
    expect(levelManager.setupLevel("files", 4, fileSystem, gitRepository)).toBe(true);

    let mistakes = 0;
    let completed = false;
    for (const command of ["git mv src/app-config.js src/config.js", commitCommand(message)]) {
        const output = processor.processCommand(command);
        if (isMistake(output)) mistakes += 1;
        const [cmd = "", ...args] = splitCommandRespectingQuotes(command.trim());
        if (!didCommandFail(output)) {
            completed = levelManager.checkLevelCompletion("files", 4, cmd, args, gitRepository) || completed;
        }
    }
    return { mistakes, completed, last: gitRepository.getLastCommit()?.message };
}

describe("files/4 is rated the same whatever the commit message says", () => {
    const quotings: Array<[string, (m: string) => string]> = [
        ["double quotes", m => `git commit -m "${m.replace(/"/g, '\\"')}"`],
        ["single quotes", m => `git commit -m '${m.replace(/'/g, "")}'`],
    ];

    for (const [label, build] of quotings) {
        for (const message of MESSAGES) {
            it(`${label}: ${message}`, () => {
                const result = solveLevel(build, message);
                expect(result.mistakes).toBe(0);
                expect(result.completed).toBe(true);
                expect(starsForMistakes(result.mistakes)).toBe(3);
                expect(result.last).toBeTruthy();
            });
        }
    }
});

describe("successful commands are never a mistake because of the words in them", () => {
    function run(commands: string[]) {
        const fileSystem = new FileSystem();
        const gitRepository = new GitRepository(fileSystem);
        const processor = new CommandProcessor(fileSystem, gitRepository, new ProgressManager());
        return commands.map(command => ({ command, output: processor.processCommand(command) }));
    }

    const NAMES = ["failed-login", "error-fix", "fatal-fehler", "nothing-to-commit", "kein-fehler"];

    for (const name of NAMES) {
        it(`names containing "${name}" (files, branches, tags, remotes, folders, messages)`, () => {
            const results = run([
                "git init",
                `touch ${name}.txt`,
                `git add ${name}.txt`,
                `git commit -m "${name}"`,
                `git branch ${name}`,
                `git switch ${name}`,
                `git mv ${name}.txt moved-${name}.txt`,
                `git tag ${name}-v1`,
                `git tag -a ${name}-v2 -m "${name}"`,
                `git remote add ${name} https://example.com/repo.git`,
                `mkdir ${name}`,
                `cd ${name}`,
                "cd /",
                "git status",
                "git diff",
                "git branch",
                "git log --oneline",
                "ls",
            ]);
            for (const { command, output } of results) {
                expect(isMistake(output, command), `${command} → ${output.join(" | ")}`).toBe(false);
            }
        });
    }

    it("a clean `git status` is not a mistake, only an empty `git commit` is", () => {
        const [, , , , status, emptyCommit] = run([
            "git init",
            "touch a.txt",
            "git add a.txt",
            'git commit -m "first"',
            "git status",
            'git commit -m "again"',
        ]);
        expect(status!.output.join(" ")).toMatch(/nothing to commit/i);
        expect(isMistake(status!.output, status!.command)).toBe(false);
        expect(isMistake(emptyCommit!.output, emptyCommit!.command)).toBe(true);
    });

    it("real mistakes still count, whatever the names say", () => {
        const results = run(["git init", "git add failed-login.txt", "git switch failed-login", "gti status"]);
        for (const { command, output } of results.slice(1)) {
            expect(isMistake(output, command), command).toBe(true);
        }
    });

    it("`Failed to ...` command errors still count", () => {
        expect(isMistake(["Failed to create file: a.txt"], "touch a.txt")).toBe(true);
    });
});
