/**
 * Stars: how cleanly a level was solved.
 *
 * Every cleared level is worth at least one star. A second and third reward not typing wrong
 * commands on the way: up to two failed commands keeps two stars, none at all earns three. That
 * needs no per-level data to maintain — "a command that failed" is already something the game
 * measures — and it rewards the thing the course is trying to teach, which is knowing what a
 * command does before running it.
 *
 * Stars are cosmetic and never priced: they pay no coins and no score, so a forged value buys
 * nothing and the economy cap in the account Worker is untouched. Only two- and three-star results
 * are stored, because one star is implied by the level being completed at all.
 */

export const MAX_STARS = 3;

/** Failed commands tolerated for two stars. */
export const TWO_STAR_MAX_MISTAKES = 2;

export function starsForMistakes(mistakes: number): number {
    if (Number.isNaN(mistakes) || mistakes <= 0) return MAX_STARS;
    return mistakes <= TWO_STAR_MAX_MISTAKES ? 2 : 1;
}

/** The key a level's stars are stored under. Matches the Worker's ledger subject: "intro/3". */
export function starKey(stageId: string, level: number): string {
    return `${stageId.toLowerCase()}/${level}`;
}

/** Stars for one level: the stored result, or one star if the level is merely completed. */
export function levelStarCount(
    levelStars: Record<string, number> | undefined,
    key: string,
    completed: boolean,
): number {
    if (!completed) return 0;
    const stored = levelStars?.[key];
    return typeof stored === "number" && stored >= 1 && stored <= MAX_STARS ? Math.floor(stored) : 1;
}

/** "★★☆" for a count. A text glyph so it also works inside the plain-text terminal. */
export function formatStars(count: number): string {
    const clamped = Math.max(0, Math.min(MAX_STARS, Math.floor(count)));
    return "★".repeat(clamped) + "☆".repeat(MAX_STARS - clamped);
}

/** Sum of stars over every completed level. */
export function totalStars(completedLevels: Record<string, number[]>, levelStars: Record<string, number> | undefined) {
    // A Set, because saved progress in the wild can hold both "Intro" and "intro" for one stage.
    const keys = new Set<string>();
    for (const [stage, levels] of Object.entries(completedLevels)) {
        for (const level of levels) keys.add(starKey(stage, level));
    }
    let total = 0;
    for (const key of keys) total += levelStarCount(levelStars, key, true);
    return total;
}
