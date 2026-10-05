import { describe, it, expect } from "vitest";
import { didCommandFail, isMistake } from "~/models/commandOutcome";

describe("isMistake", () => {
    it("counts everything that counts as a failed command", () => {
        expect(isMistake(["fatal: not a git repository"])).toBe(true);
        expect(isMistake(["error: pathspec 'x' did not match any files"])).toBe(true);
    });

    it("also counts a mistyped command, which does not count as a failed Git operation", () => {
        const typo = ["gti: command not found", "hint: Did you mean 'git'?"];
        expect(didCommandFail(typo)).toBe(false);
        expect(isMistake(typo)).toBe(true);
    });

    it("counts an unknown git subcommand", () => {
        expect(isMistake(["git: 'stauts' is not a git command. See 'git --help'."])).toBe(true);
    });

    it("does not count a command that worked", () => {
        expect(isMistake(["Initialized empty Git repository"])).toBe(false);
        expect(isMistake([])).toBe(false);
    });

    it("does not count a merge conflict, which is a normal state to be in", () => {
        expect(isMistake(["Automatic merge failed; fix conflicts and then commit the result."])).toBe(false);
    });
});
