import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { runSeed } from "./differential";

/**
 * Plays random command sequences against the simulator and the real `git` binary and requires
 * both to end up in the same state after every step — and, in output mode, to print the same for
 * `git status`, `git log`, `git diff` and friends. FUZZ_SEEDS / FUZZ_STEPS / FUZZ_START widen the
 * search locally (FUZZ_OUTPUT=1 compares outputs for all of them, FUZZ_TIMEOUT raises the time
 * limit); CI runs a fixed, fast slice of both.
 */
const gitVersion = (() => {
    try {
        const match = /(\d+)\.(\d+)/.exec(execFileSync("git", ["--version"], { encoding: "utf8" }));
        return match ? { major: Number(match[1]), minor: Number(match[2]) } : null;
    } catch {
        return null;
    }
})();
// The simulator follows Git 2.43. Repository states agree with any later Git; printed output is
// only compared against the exact version it was checked with, since wording moves between releases.
const hasGit = gitVersion !== null && (gitVersion.major > 2 || (gitVersion.major === 2 && gitVersion.minor >= 43));
const sameGit = gitVersion?.major === 2 && gitVersion.minor === 43;

const SEEDS = Number(process.env.FUZZ_SEEDS ?? 40);
const STEPS = Number(process.env.FUZZ_STEPS ?? 30);
const START = Number(process.env.FUZZ_START ?? 1);
const TIMEOUT = Number(process.env.FUZZ_TIMEOUT ?? 600_000);

function divergentSeeds(seeds: number, steps: number, start: number, outputs: boolean): string[] {
    const failures: string[] = [];
    for (let seed = start; seed < start + seeds; seed++) {
        const { divergence, trace } = runSeed(seed, steps, { outputs });
        if (divergence) {
            failures.push(
                [
                    `seed ${seed}, step ${divergence.step}: ${divergence.command} -> ${divergence.field} differs`,
                    `  real: ${JSON.stringify(divergence.real)}`,
                    `  sim:  ${JSON.stringify(divergence.sim)}`,
                    `  real output: ${JSON.stringify(divergence.realOut)}`,
                    `  sim output:  ${JSON.stringify(divergence.simOut)}`,
                    `  trace: ${trace.join(" | ")}`,
                ].join("\n"),
            );
        }
    }
    if (failures.length > 0)
        process.stdout.write(
            `\n${failures.length} divergent seeds\n${failures.slice(0, Number(process.env.FUZZ_SHOW ?? 3)).join("\n\n")}\n`,
        );
    return failures;
}

describe.skipIf(!hasGit)("differential test against real git", () => {
    it(
        `agrees with real git on ${SEEDS} random sequences of ${STEPS} steps`,
        () => {
            expect(divergentSeeds(SEEDS, STEPS, START, process.env.FUZZ_OUTPUT === "1" && sameGit)).toEqual([]);
        },
        TIMEOUT,
    );

    // Output comparison runs a handful of read-only commands after every step, so CI keeps it small.
    it.skipIf(process.env.FUZZ_SEEDS !== undefined || !sameGit)(
        "prints what real git prints on 10 random sequences of 25 steps",
        () => {
            expect(divergentSeeds(10, 25, 1001, true)).toEqual([]);
        },
        TIMEOUT,
    );
});
