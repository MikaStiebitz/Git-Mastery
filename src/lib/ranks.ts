/**
 * Ranks: a title for the score.
 *
 * Derived, never stored. The score already lives in the ledger and never decreases, so a rank is a
 * pure function of it — there is nothing to sync, nothing to forge separately and nothing that can
 * drift out of step with the number it describes. That is also why ranking up costs no writes.
 *
 * The thresholds are spaced against the real ceiling: 55 levels at 10 points plus the 50-point
 * easter egg is 600 without Double XP, so the top rank sits just below "every level cleared".
 */

export interface Rank {
    /** Stable id, also the translation key suffix: `rank.<id>`. */
    id: string;
    /** First score at which this rank applies. */
    minScore: number;
}

export const RANKS: readonly Rank[] = [
    { id: "rookie", minScore: 0 },
    { id: "committer", minScore: 30 },
    { id: "brancher", minScore: 100 },
    { id: "merger", minScore: 200 },
    { id: "rebaser", minScore: 300 },
    { id: "maintainer", minScore: 420 },
    { id: "master", minScore: 540 },
];

export interface RankStatus {
    rank: Rank;
    /** 0-based position in RANKS. */
    index: number;
    /** The rank after this one, or null at the top. */
    next: Rank | null;
    /** Points still needed for `next`, or 0 at the top. */
    pointsToNext: number;
    /** 0..1 progress between this rank and the next. 1 at the top. */
    progress: number;
}

export function getRankStatus(score: number): RankStatus {
    const safe = Number.isFinite(score) ? Math.max(0, score) : 0;

    let index = 0;
    for (let i = 0; i < RANKS.length; i++) {
        if (safe >= RANKS[i]!.minScore) index = i;
    }

    const rank = RANKS[index]!;
    const next = RANKS[index + 1] ?? null;
    const span = next ? next.minScore - rank.minScore : 0;

    return {
        rank,
        index,
        next,
        pointsToNext: next ? next.minScore - safe : 0,
        progress: next ? Math.min(1, (safe - rank.minScore) / span) : 1,
    };
}
