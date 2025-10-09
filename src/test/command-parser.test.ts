import { describe, it, expect } from "vitest";
import { parseCommand } from "../commands/base/CommandParser";

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
