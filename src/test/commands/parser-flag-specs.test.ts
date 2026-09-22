import { describe, it, expect } from "vitest";
import { parseCommand } from "~/commands/base/CommandParser";
import { BranchCommand } from "~/commands/git/BranchCommand";
import { CommitCommand } from "~/commands/git/CommitCommand";
import { SwitchCommand } from "~/commands/git/SwitchCommand";
import { CheckoutCommand } from "~/commands/git/CheckoutCommand";
import { PushCommand } from "~/commands/git/PushCommand";
import { LogCommand } from "~/commands/git/LogCommand";
import { AddCommand } from "~/commands/git/AddCommand";

const branchSpec = new BranchCommand().flagSpec;
const commitSpec = new CommitCommand().flagSpec;
const switchSpec = new SwitchCommand().flagSpec;
const checkoutSpec = new CheckoutCommand().flagSpec;
const pushSpec = new PushCommand().flagSpec;
const logSpec = new LogCommand().flagSpec;
const addSpec = new AddCommand().flagSpec;

describe("per-command flag specs", () => {
    describe("flags may appear after positional arguments", () => {
        // The order people actually type when they think of the branch first and the action second.
        it("reads `git branch Feature -D` as a forced delete of Feature", () => {
            const { args } = parseCommand("git branch Feature -D", branchSpec);

            expect(args.flags.D).toBe(true);
            expect(args.positionalArgs).toEqual(["Feature"]);
        });

        it("reads `git branch -D Feature` identically", () => {
            const { args } = parseCommand("git branch -D Feature", branchSpec);

            expect(args.flags.D).toBe(true);
            expect(args.positionalArgs).toEqual(["Feature"]);
        });

        it("reads `git branch test -d` as a delete, not a create", () => {
            const { args } = parseCommand("git branch test -d", branchSpec);

            expect(args.flags.d).toBe(true);
            expect(args.positionalArgs).toEqual(["test"]);
        });

        it("keeps the branch name positional for `git switch feature -f`", () => {
            const { args } = parseCommand("git switch feature -f", switchSpec);

            expect(args.flags.f).toBe(true);
            expect(args.positionalArgs).toEqual(["feature"]);
        });
    });

    describe("boolean flags never swallow the next token", () => {
        it("keeps the branch name for `git branch -d feature`", () => {
            const { args } = parseCommand("git branch -d feature", branchSpec);

            expect(args.flags.d).toBe(true);
            expect(args.positionalArgs).toEqual(["feature"]);
        });

        it("keeps the branch name for `git switch -c feature`", () => {
            const { args } = parseCommand("git switch -c feature", switchSpec);

            expect(args.flags.c).toBe(true);
            expect(args.positionalArgs).toEqual(["feature"]);
        });

        it("keeps the branch name for `git checkout -b feature`", () => {
            const { args } = parseCommand("git checkout -b feature", checkoutSpec);

            expect(args.flags.b).toBe(true);
            expect(args.positionalArgs).toEqual(["feature"]);
        });

        // Real `git branch -c` copies a branch; the name is a positional argument, not the flag's value.
        it("keeps the branch name for `git branch -c copy`", () => {
            const { args } = parseCommand("git branch -c copy", branchSpec);

            expect(args.flags.c).toBe(true);
            expect(args.positionalArgs).toEqual(["copy"]);
        });

        it("keeps remote and branch for `git push -u origin main`", () => {
            const { args } = parseCommand("git push -u origin main", pushSpec);

            expect(args.flags.u).toBe(true);
            expect(args.positionalArgs).toEqual(["origin", "main"]);
        });

        it("keeps the path for `git add -A .`", () => {
            const { args } = parseCommand("git add -A .", addSpec);

            expect(args.flags.A).toBe(true);
            expect(args.positionalArgs).toEqual(["."]);
        });
    });

    describe("value flags take their value", () => {
        it("takes the next token: -m msg", () => {
            const { args } = parseCommand('git commit -m "Add login"', commitSpec);

            expect(args.flags.m).toBe("Add login");
            expect(args.positionalArgs).toEqual([]);
        });

        it("takes an attached value: -mmsg", () => {
            const { args } = parseCommand('git commit -m"Add login"', commitSpec);

            expect(args.flags.m).toBe("Add login");
        });

        it("takes a --flag=value", () => {
            const { args } = parseCommand('git commit --message="Add login"', commitSpec);

            expect(args.flags.message).toBe("Add login");
        });

        it("reports an empty string when the value is missing", () => {
            const { args } = parseCommand("git commit -m", commitSpec);

            expect(args.flags.m).toBe("");
        });

        it("takes a value for `git branch -u origin/main`", () => {
            const { args } = parseCommand("git branch -u origin/main", branchSpec);

            expect(args.flags.u).toBe("origin/main");
            expect(args.positionalArgs).toEqual([]);
        });

        it("takes a numeric value for `git log -n 5`", () => {
            const { args } = parseCommand("git log -n 5", logSpec);

            expect(args.flags.n).toBe("5");
            expect(args.positionalArgs).toEqual([]);
        });
    });

    describe("clustered short flags", () => {
        it("splits -am into a boolean and a message", () => {
            const { args } = parseCommand('git commit -am "Quick fix"', commitSpec);

            expect(args.flags.a).toBe(true);
            expect(args.flags.m).toBe("Quick fix");
            expect(args.positionalArgs).toEqual([]);
        });

        it("consumes the rest of the cluster as the value flag's value", () => {
            const { args } = parseCommand("git commit -amQuickfix", commitSpec);

            expect(args.flags.a).toBe(true);
            expect(args.flags.m).toBe("Quickfix");
        });

        it("treats a cluster of booleans as separate flags", () => {
            const { args } = parseCommand("git log --oneline --graph --all", logSpec);

            expect(args.flags.oneline).toBe(true);
            expect(args.flags.graph).toBe(true);
            expect(args.flags.all).toBe(true);
        });
    });

    describe("-- ends flag parsing", () => {
        it("treats everything after -- as positional", () => {
            const { args } = parseCommand("git add -- -weird-file.txt", addSpec);

            expect(args.positionalArgs).toEqual(["-weird-file.txt"]);
            expect(args.flags.w).toBeUndefined();
        });
    });

    describe("unknown flags are recorded, not silently ignored", () => {
        it("records an unknown short flag", () => {
            const { args } = parseCommand("git branch -x feature", branchSpec);

            expect(args.unknownFlags).toEqual(["-x"]);
        });

        it("records an unknown long flag", () => {
            const { args } = parseCommand("git commit --mesage hi", commitSpec);

            expect(args.unknownFlags).toEqual(["--mesage"]);
        });

        it("records nothing when every flag is known", () => {
            const { args } = parseCommand('git commit -am "ok"', commitSpec);

            expect(args.unknownFlags).toEqual([]);
        });

        it("does not treat an unknown flag as consuming the branch name", () => {
            const { args } = parseCommand("git branch -x feature", branchSpec);

            expect(args.positionalArgs).toEqual(["feature"]);
        });
    });

    describe("commands without a spec keep the previous behaviour", () => {
        it("still parses -u as boolean and origin/main as positional", () => {
            const { args } = parseCommand("git push -u origin main");

            expect(args.flags.u).toBe(true);
            expect(args.positionalArgs).toEqual(["origin", "main"]);
        });

        it("still parses --author='John Doe'", () => {
            const { args } = parseCommand("git log --author='John Doe'");

            expect(args.flags.author).toBe("John Doe");
        });
    });
});
