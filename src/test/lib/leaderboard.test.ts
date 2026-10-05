import { describe, it, expect } from "vitest";
import { rivalHint } from "~/lib/leaderboard";

const top = [
    { username: "Ada", score: 100 },
    { username: "Linus", score: 80 },
    { username: "Grace", score: 60 },
];

describe("rivalHint", () => {
    it("names the nearest player ahead and the gap", () => {
        expect(rivalHint({ score: 70, rank: 3, hidden: false }, top, 50)).toEqual({
            kind: "ahead",
            name: "Linus",
            points: 10,
        });
    });

    it("reports the lead over the next player when in front", () => {
        expect(rivalHint({ score: 100, rank: 1, hidden: false }, top, 50)).toEqual({ kind: "lead", points: 20 });
    });

    it("says how far the door is when outside a full list", () => {
        expect(rivalHint({ score: 40, rank: 90, hidden: false }, top, 3)).toEqual({
            kind: "top",
            points: 20,
            count: 3,
        });
    });

    it("does not call someone outside the list when the list simply is not full", () => {
        const hint = rivalHint({ score: 40, rank: 4, hidden: false }, top, 50);
        expect(hint).toEqual({ kind: "ahead", name: "Grace", points: 20 });
    });

    it("stays quiet for a hidden, unranked or alone player", () => {
        expect(rivalHint({ score: 70, rank: 3, hidden: true }, top, 50)).toBeNull();
        expect(rivalHint({ score: 0, rank: null, hidden: false }, top, 50)).toBeNull();
        expect(rivalHint({ score: 70, rank: 1, hidden: false }, [], 50)).toBeNull();
    });
});
