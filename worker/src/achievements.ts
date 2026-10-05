/**
 * Achievements, worked out on the server so a leaderboard can show other people's.
 *
 * `src/lib/achievements.ts` computes the same thing from a player's own save. The two have to
 * agree — a badge that shows on your screen but not on the board, or the reverse, is a bug nobody
 * would believe — so `src/test/worker/achievements-parity.test.ts` runs both over the same saves
 * and fails if they differ. Change a rule in one place and that test tells you about the other.
 *
 * Pure: it takes plain data and returns ids, so it is tested without a database.
 */

import { DIFFICULTY_STAGES, MAINTAINER_MIN_SCORE, MINIGAME_COINS, STAGE_LEVELS, totalLevelCount } from "./catalog";

export const ACHIEVEMENT_IDS = [
    "first-step",
    "getting-going",
    "halfway",
    "completionist",
    "stage-clear",
    "beginner-course",
    "advanced-course",
    "pro-course",
    "flawless",
    "perfectionist",
    "flawless-stage",
    "star-collector",
    "arcade-regular",
    "maintainer",
    "git-legend",
    "git-gud",
] as const;

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

const PERFECTIONIST_TARGET = 20;
const STAR_COLLECTOR_TARGET = 75;

/** Everything the rules need to know about one account. */
export interface AchievementInput {
    /** Cleared levels as "stage/level", the ledger's own subject spelling. */
    levels: ReadonlySet<string>;
    /** Two- and three-star results by "stage/level". */
    stars: Readonly<Record<string, number>>;
    /** Minigames cleared (ledger rows), not high scores. */
    minigamesCleared: number;
    purchases: ReadonlySet<string>;
    eggFound: boolean;
    score: number;
}

function starsOf(stars: Readonly<Record<string, number>>, key: string): number {
    const stored = stars[key];
    return typeof stored === "number" && stored >= 1 && stored <= 3 ? Math.floor(stored) : 1;
}

/** The ids of every achievement this account has unlocked, in display order. */
export function unlockedAchievements(input: AchievementInput): AchievementId[] {
    // Only levels the catalog defines count, so a retired level cannot inflate a total.
    const done = new Set<string>();
    for (const [stage, levels] of Object.entries(STAGE_LEVELS)) {
        for (const level of levels) {
            const key = `${stage}/${level}`;
            if (input.levels.has(key)) done.add(key);
        }
    }

    const levelsDone = done.size;
    const levelsTotal = totalLevelCount();

    let threeStarLevels = 0;
    let starTotal = 0;
    for (const key of done) {
        const stars = starsOf(input.stars, key);
        starTotal += stars;
        if (stars === 3) threeStarLevels += 1;
    }

    const stageDone = (stage: string) => {
        const levels = STAGE_LEVELS[stage] ?? [];
        return levels.length > 0 && levels.every(level => done.has(`${stage}/${level}`));
    };

    let stagesDone = 0;
    let flawlessStages = 0;
    for (const [stage, levels] of Object.entries(STAGE_LEVELS)) {
        if (!stageDone(stage)) continue;
        stagesDone += 1;
        if (levels.every(level => starsOf(input.stars, `${stage}/${level}`) === 3)) flawlessStages += 1;
    }

    const courseDone = (course: string) => {
        const stages = DIFFICULTY_STAGES[course] ?? [];
        return stages.length > 0 && stages.every(stageDone);
    };

    const unlocked: Record<AchievementId, boolean> = {
        "first-step": levelsDone >= 1,
        "getting-going": levelsDone >= 10,
        halfway: levelsDone >= Math.ceil(levelsTotal / 2),
        completionist: levelsDone >= levelsTotal,
        "stage-clear": stagesDone >= 1,
        "beginner-course": courseDone("beginner"),
        "advanced-course": courseDone("advanced"),
        "pro-course": courseDone("pro"),
        flawless: threeStarLevels >= 1,
        perfectionist: threeStarLevels >= PERFECTIONIST_TARGET,
        "flawless-stage": flawlessStages >= 1,
        "star-collector": starTotal >= STAR_COLLECTOR_TARGET,
        "arcade-regular": input.minigamesCleared >= Math.max(1, Object.keys(MINIGAME_COINS).length),
        maintainer: input.score >= MAINTAINER_MIN_SCORE,
        "git-legend": input.purchases.has("git-legend"),
        "git-gud": input.eggFound,
    };

    return ACHIEVEMENT_IDS.filter(id => unlocked[id]);
}
