import { describe, it, expect } from "vitest";
import { parseCommand, splitCommandRespectingQuotes } from "../commands/base/CommandParser";

describe("CommandParser - Flag Parsing", () => {
    it("should parse --set-upstream as boolean flag", () => {
        const result = parseCommand("git push --set-upstream origin main");

        console.log("Command:", result.command);
        console.log("Flags:", result.args.flags);
        console.log("Positional Args:", result.args.positionalArgs);

        expect(result.command).toBe("git push");
        expect(result.args.flags["set-upstream"]).toBe(true);
        expect(result.args.positionalArgs).toEqual(["origin", "main"]);
    });

    it("should parse -u flag correctly", () => {
        const result = parseCommand("git push -u origin main");

        console.log("Command:", result.command);
        console.log("Flags:", result.args.flags);
        console.log("Positional Args:", result.args.positionalArgs);

        expect(result.command).toBe("git push");
        expect(result.args.flags["u"]).toBe(true);
        expect(result.args.positionalArgs).toEqual(["origin", "main"]);
    });

    it("should parse git push with only branch", () => {
        const result = parseCommand("git push origin feature/test");

        console.log("Command:", result.command);
        console.log("Positional Args:", result.args.positionalArgs);

        expect(result.command).toBe("git push");
        expect(result.args.positionalArgs).toEqual(["origin", "feature/test"]);
    });
});

describe("CommandParser - Quote Handling", () => {
    it("should preserve --grep value with spaces in double quotes", () => {
        const parts = splitCommandRespectingQuotes('git log --grep="fix bug"');

        expect(parts).toEqual(["git", "log", "--grep=fix bug"]);
    });

    it("should preserve --grep value with spaces in single quotes", () => {
        const parts = splitCommandRespectingQuotes("git log --grep='security issue'");

        expect(parts).toEqual(["git", "log", "--grep=security issue"]);
    });

    it("should parse mixed quoted long flags", () => {
        const result = parseCommand("git log --author='John Doe' --grep=\"feature fix\"");

        expect(result.command).toBe("git log");
        expect(result.args.flags.author).toBe("John Doe");
        expect(result.args.flags.grep).toBe("feature fix");
    });

    it("should keep escaped quotes inside a quoted value as one token", () => {
        const parts = splitCommandRespectingQuotes('git log --grep="fix \\\"critical\\\" bug"');
        const result = parseCommand('git log --grep="fix \\\"critical\\\" bug"');

        expect(parts).toEqual(["git", "log", '--grep=fix \\\"critical\\\" bug']);
        expect(result.args.flags.grep).toBe('fix \\\"critical\\\" bug');
    });
});
