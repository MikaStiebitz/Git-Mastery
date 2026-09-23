import { allStages } from "~/levels";

/**
 * Translating between the two names every stage has.
 *
 * `allStages` is keyed by a capitalised name — "Intro", "TeamWork" — and that key is what reaches
 * `completedLevels` in localStorage, because `UserProgress.currentStage` starts life as "Intro".
 * Each stage also carries a lowercase `id` ("intro", "teamwork"), which is what the URLs use and
 * what the account API's ledger keys are built from.
 *
 * The two differ only by case, so converting one way is `toLowerCase()`. Converting back needs a
 * lookup, which is what this module exists for. Getting it wrong is not a cosmetic bug: a level
 * banked as `level:Intro:1` and again as `level:intro:1` is one level paid for twice, and a
 * server that has never heard of the stage `Intro` would record a real completion at no reward.
 */

/** Lowercase id -> the capitalised key the game stores progress under. */
const keyByLowercaseId = new Map<string, string>(
    Object.entries(allStages).map(([key, stage]) => [stage.id.toLowerCase(), key]),
);

/** The id used on the wire and in ledger keys. Always lowercase. */
export function toStageId(stageKeyOrId: string): string {
    return stageKeyOrId.toLowerCase();
}

/**
 * The key the game stores progress under.
 *
 * Falls back to the input when the stage is unknown, so progress for a stage this build has not
 * heard of is preserved rather than silently dropped on the floor.
 */
export function toStageKey(stageId: string): string {
    return keyByLowercaseId.get(stageId.toLowerCase()) ?? stageId;
}

/**
 * Merge `completedLevels` entries that differ only by case.
 *
 * Saved progress in the wild can hold both "Intro" and "intro" as separate keys, because nothing
 * ever forced one spelling. Folding them before anything is uploaded stops the same level being
 * submitted under two keys, one of which the server would not recognise.
 */
export function foldCompletedLevels(completedLevels: Record<string, number[]>): Record<string, number[]> {
    const folded = new Map<string, Set<number>>();

    for (const [stage, levels] of Object.entries(completedLevels)) {
        const id = toStageId(stage);
        const existing = folded.get(id) ?? new Set<number>();
        for (const level of levels) {
            if (Number.isInteger(level) && level > 0) existing.add(level);
        }
        folded.set(id, existing);
    }

    const result: Record<string, number[]> = {};
    for (const [id, levels] of folded) {
        result[toStageKey(id)] = [...levels].sort((a, b) => a - b);
    }
    return result;
}
