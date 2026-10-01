import { describe, it, expect } from "vitest";
import { MAX_STARS, formatStars, levelStarCount, starKey, starsForMistakes, totalStars } from "~/lib/stars";

describe("stars", () => {
    it("rewards a clean run with three stars and degrades with mistakes", () => {
        expect(starsForMistakes(0)).toBe(3);
        expect(starsForMistakes(1)).toBe(2);
        expect(starsForMistakes(2)).toBe(2);
        expect(starsForMistakes(3)).toBe(1);
        expect(starsForMistakes(50)).toBe(1);
    });

    it("never awards fewer than one star for a clear, whatever the input", () => {
        expect(starsForMistakes(Number.NaN)).toBe(3); // no count is no mistakes, not a penalty
        expect(starsForMistakes(Infinity)).toBe(1);
    });

    it("builds the same key the Worker uses for a ledger subject", () => {
        expect(starKey("TeamWork", 2)).toBe("teamwork/2");
        expect(starKey("intro", 3)).toBe("intro/3");
    });

    it("counts a completed level as one star unless more is stored", () => {
        expect(levelStarCount({}, "intro/1", true)).toBe(1);
        expect(levelStarCount({ "intro/1": 3 }, "intro/1", true)).toBe(3);
        expect(levelStarCount({ "intro/1": 3 }, "intro/1", false)).toBe(0);
    });

    it("ignores out-of-range stored values", () => {
        expect(levelStarCount({ "intro/1": 9 }, "intro/1", true)).toBe(1);
        expect(levelStarCount({ "intro/1": 0 }, "intro/1", true)).toBe(1);
    });

    it("formats for the terminal", () => {
        expect(formatStars(3)).toBe("★★★");
        expect(formatStars(1)).toBe("★☆☆");
        expect(formatStars(99)).toBe("★".repeat(MAX_STARS));
        expect(formatStars(-4)).toBe("☆☆☆");
    });

    it("totals stars across levels, counting a stage spelled two ways once", () => {
        const completed = { Intro: [1, 2], intro: [2, 3], Files: [1] };
        const stars = { "intro/1": 3, "intro/2": 2 };
        // intro/1=3, intro/2=2, intro/3=1 (implied), files/1=1
        expect(totalStars(completed, stars)).toBe(7);
    });
});
