import { allStages } from "~/levels";
import { difficulties, getDifficultyConfigForStage } from "~/config/difficulties";
import type { DifficultyLevel } from "~/types";

/**
 * How far through the course a player actually is.
 *
 * This is deliberately separate from points. Points are a lifetime score: they are doubled by the
 * Double XP purchase and never decrease, so they cannot express "how much is left" — a player with
 * Double XP earns the configured maximum at half the levels. Course progress counts levels, which is
 * the only quantity that both matches what the player is looking at and has a real ceiling.
 */

export interface StageProgress {
    stageId: string;
    /** Levels in this stage the player has finished. */
    done: number;
    /** Levels this stage has in total. */
    total: number;
    /** 1-based position of the level currently open, or null if it is not part of this stage. */
    position: number | null;
    /** Every level in this stage is finished. */
    complete: boolean;
}

export interface DifficultyProgress {
    difficultyId: DifficultyLevel;
    /** Levels finished across every stage of this difficulty. */
    levelsDone: number;
    /** Levels this difficulty has in total. */
    levelsTotal: number;
    /** Stages in which every level is finished. */
    stagesDone: number;
    /** Stages this difficulty has in total. */
    stagesTotal: number;
    /** 1-based position of the current stage within the difficulty, or null if it is not in it. */
    stagePosition: number | null;
}

/** Level ids of a stage, ascending. Empty for an unknown stage. */
export function getStageLevelIds(stageId: string): number[] {
    const stage = allStages[stageId as keyof typeof allStages];
    if (!stage) return [];
    return Object.keys(stage.levels)
        .map(Number)
        .filter(id => Number.isFinite(id))
        .sort((a, b) => a - b);
}

/**
 * Progress through a single stage.
 *
 * `completedLevels` is UserProgress.completedLevels — a map of stage id to finished level ids. Only
 * ids the stage actually defines are counted, so a stale entry left behind by a renamed or removed
 * level cannot push `done` above `total`.
 */
export function getStageProgress(
    stageId: string,
    completedLevels: Record<string, number[]>,
    currentLevelId?: number,
): StageProgress {
    const levelIds = getStageLevelIds(stageId);
    const completed = new Set(completedLevels[stageId] ?? []);
    const done = levelIds.filter(id => completed.has(id)).length;

    const index = currentLevelId === undefined ? -1 : levelIds.indexOf(currentLevelId);

    return {
        stageId,
        done,
        total: levelIds.length,
        position: index === -1 ? null : index + 1,
        complete: levelIds.length > 0 && done === levelIds.length,
    };
}

/** Progress across every stage of a difficulty. */
export function getDifficultyProgress(
    difficultyId: DifficultyLevel,
    completedLevels: Record<string, number[]>,
    currentStageId?: string,
): DifficultyProgress {
    const config = difficulties.find(d => d.id === difficultyId);
    const stages = config?.stages ?? [];

    let levelsDone = 0;
    let levelsTotal = 0;
    let stagesDone = 0;

    for (const stageId of stages) {
        const stage = getStageProgress(stageId, completedLevels);
        levelsDone += stage.done;
        levelsTotal += stage.total;
        if (stage.complete) stagesDone += 1;
    }

    const index = currentStageId === undefined ? -1 : stages.indexOf(currentStageId);

    return {
        difficultyId,
        levelsDone,
        levelsTotal,
        stagesDone,
        stagesTotal: stages.length,
        stagePosition: index === -1 ? null : index + 1,
    };
}

/**
 * The difficulty a stage belongs to.
 *
 * A player can open a stage that is not part of the difficulty they last selected (via a URL, or
 * after switching), so the stage is the authority for which course this progress describes — not the
 * stored preference.
 */
export function getDifficultyForStage(stageId: string): DifficultyLevel | null {
    return (getDifficultyConfigForStage(stageId)?.id as DifficultyLevel | undefined) ?? null;
}
