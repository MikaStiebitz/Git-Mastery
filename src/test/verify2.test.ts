import { describe, it, expect } from "vitest";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { LevelManager } from "~/models/LevelManager";
import { CommandProcessor } from "~/models/CommandProcessor";
import { ProgressManager } from "~/models/ProgressManager";

describe("intro level 4 fresh state", () => {
    it("git status shows config.js modified, not README untracked", () => {
        const fs = new FileSystem();
        const git = new GitRepository(fs);
        const lm = new LevelManager();
        const cp = new CommandProcessor(fs, git, new ProgressManager());
        lm.setupLevel("intro", 4, fs, git);
        cp.setCurrentDirectory("/");
        console.log("STATUS RAW:", JSON.stringify(git.getStatus()));
        console.log("WORKING TREE:", JSON.stringify(git.getWorkingTreeStatus()));
        const out = cp.processCommand("git status");
        console.log("git status output:\n" + out.join("\n"));
        const diff = cp.processCommand("git diff");
        console.log("git diff output:\n" + diff.join("\n"));
    });
});
