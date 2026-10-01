import { describe, it, expect } from "vitest";
import { RANKS, getRankStatus } from "~/lib/ranks";

describe("ranks", () => {
    it("starts everyone as a rookie", () => {
        const status = getRankStatus(0);
        expect(status.rank.id).toBe("rookie");
        expect(status.progress).toBe(0);
        expect(status.next?.id).toBe("committer");
    });

    it("keeps thresholds strictly ascending from zero", () => {
        expect(RANKS[0]!.minScore).toBe(0);
        for (let i = 1; i < RANKS.length; i++) {
            expect(RANKS[i]!.minScore).toBeGreaterThan(RANKS[i - 1]!.minScore);
        }
    });

    it("switches rank exactly at the threshold", () => {
        const second = RANKS[1]!;
        expect(getRankStatus(second.minScore - 1).rank.id).toBe("rookie");
        expect(getRankStatus(second.minScore).rank.id).toBe(second.id);
    });

    it("reports the points still missing and the bar position", () => {
        const status = getRankStatus(65); // halfway between 30 and 100
        expect(status.rank.id).toBe("committer");
        expect(status.pointsToNext).toBe(35);
        expect(status.progress).toBeCloseTo(0.5);
    });

    it("tops out cleanly, including past the Double XP ceiling", () => {
        const top = RANKS[RANKS.length - 1]!;
        for (const score of [top.minScore, 600, 5000]) {
            const status = getRankStatus(score);
            expect(status.rank.id).toBe(top.id);
            expect(status.next).toBeNull();
            expect(status.pointsToNext).toBe(0);
            expect(status.progress).toBe(1);
        }
    });

    it("treats garbage scores as zero", () => {
        expect(getRankStatus(Number.NaN).rank.id).toBe("rookie");
        expect(getRankStatus(-50).rank.id).toBe("rookie");
    });
});
