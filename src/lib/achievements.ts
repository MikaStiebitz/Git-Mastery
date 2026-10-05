import { allStages } from "~/levels";
import { difficulties } from "~/config/difficulties";
import { getDifficultyProgress, getStageLevelIds } from "~/lib/courseProgress";
import { getRankStatus } from "~/lib/ranks";
import { MAX_STARS, levelStarCount, starKey, totalStars } from "~/lib/stars";
import { foldCompletedLevels } from "~/lib/stageIds";
import type { DifficultyLevel, UserProgress } from "~/types";

/**
 * Achievements: milestones worth showing off.
 *
 * Every achievement is derived from progress the player already has — nothing here is stored, so
 * unlocking one costs no write, can never disagree with the data it describes, and works the same
 * with or without an account. The price of that is that an achievement has no "unlocked on" date;
 * it is either true of your save or it is not.
 *
 * Each entry reports `current` and `target` so the UI can show how close a locked one is. That bar
 * is most of the motivation: a locked badge that says "7 / 10" gets finished, one that just says
 * "locked" is ignored.
 */

export type AchievementId =
    | "first-step"
    | "getting-going"
    | "halfway"
    | "completionist"
    | "stage-clear"
    | "beginner-course"
    | "advanced-course"
    | "pro-course"
    | "flawless"
    | "perfectionist"
    | "flawless-stage"
    | "star-collector"
    | "arcade-regular"
    | "maintainer"
    | "git-legend"
    | "git-gud";

export interface Achievement {
    id: AchievementId;
    /** Hidden until unlocked: the description is withheld so there is something left to find. */
    secret: boolean;
    current: number;
    target: number;
    unlocked: boolean;
}

export interface AchievementContext {
    /** How many minigames the arcade has. Passed in so this module stays free of UI imports. */
    minigameTotal: number;
}

/** Levels in the whole game, counted from the content itself rather than a constant that can rot. */
export function totalLevelCount(): number {
    return Object.keys(allStages).reduce((sum, stage) => sum + getStageLevelIds(stage).length, 0);
}

const PERFECTIONIST_TARGET = 20;
const STAR_COLLECTOR_TARGET = 75;

function entry(id: AchievementId, current: number, target: number, options: { secret?: boolean } = {}): Achievement {
    const capped = Math.max(0, Math.min(current, target));
    return { id, secret: options.secret ?? false, current: capped, target, unlocked: capped >= target };
}

export function getAchievements(progress: UserProgress, context: AchievementContext): Achievement[] {
    const completed = foldCompletedLevels(progress.completedLevels);
    const stars = progress.levelStars ?? {};

    // Only levels this build actually defines count, so a level removed in a later release cannot
    // inflate a total past its ceiling.
    const known = new Set<string>();
    for (const stageKey of Object.keys(allStages)) {
        for (const level of getStageLevelIds(stageKey)) {
            if (completed[stageKey]?.includes(level)) known.add(starKey(stageKey, level));
        }
    }

    const levelsDone = known.size;
    const levelsTotal = totalLevelCount();

    let threeStarLevels = 0;
    for (const key of known) {
        if (levelStarCount(stars, key, true) === MAX_STARS) threeStarLevels += 1;
    }

    let stagesDone = 0;
    let flawlessStages = 0;
    for (const stageKey of Object.keys(allStages)) {
        const ids = getStageLevelIds(stageKey);
        if (ids.length === 0) continue;
        const done = ids.every(id => known.has(starKey(stageKey, id)));
        if (!done) continue;
        stagesDone += 1;
        if (ids.every(id => levelStarCount(stars, starKey(stageKey, id), true) === MAX_STARS)) flawlessStages += 1;
    }

    const courseDone = (id: DifficultyLevel): boolean => {
        const p = getDifficultyProgress(id, completed);
        return p.levelsTotal > 0 && p.levelsDone === p.levelsTotal;
    };
    const hasDifficulty = (id: DifficultyLevel) => difficulties.some(d => d.id === id);

    const rank = getRankStatus(progress.score);
    const maintainerIndex = 5;

    return [
        entry("first-step", levelsDone, 1),
        entry("getting-going", levelsDone, 10),
        entry("halfway", levelsDone, Math.ceil(levelsTotal / 2)),
        entry("completionist", levelsDone, levelsTotal),
        entry("stage-clear", stagesDone, 1),
        entry("beginner-course", hasDifficulty("beginner") && courseDone("beginner") ? 1 : 0, 1),
        entry("advanced-course", hasDifficulty("advanced") && courseDone("advanced") ? 1 : 0, 1),
        entry("pro-course", hasDifficulty("pro") && courseDone("pro") ? 1 : 0, 1),
        entry("flawless", threeStarLevels, 1),
        entry("perfectionist", threeStarLevels, PERFECTIONIST_TARGET),
        entry("flawless-stage", flawlessStages, 1),
        entry("star-collector", totalStars(completed, stars), STAR_COLLECTOR_TARGET),
        entry("arcade-regular", progress.completedMinigames.length, Math.max(1, context.minigameTotal)),
        entry("maintainer", rank.index, maintainerIndex),
        entry("git-legend", progress.purchasedItems.includes("git-legend") ? 1 : 0, 1),
        entry("git-gud", progress.gitGudActivated ? 1 : 0, 1, { secret: true }),
    ];
}

/** Total stars the player could earn: three per level. */
export function maxStars(): number {
    return totalLevelCount() * MAX_STARS;
}
