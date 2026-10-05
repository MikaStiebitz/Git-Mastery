/**
 * Small pieces of leaderboard logic that are worth testing on their own.
 */

export interface RivalInput {
    score: number;
    rank: number | null;
    hidden: boolean;
}

export type RivalHint =
    /** Someone is ahead: how far, and who. */
    | { kind: "ahead"; name: string; points: number }
    /** Outside the listed accounts: how far from the last listed one. */
    | { kind: "top"; points: number; count: number }
    /** First place: the lead over the next listed player. */
    | { kind: "lead"; points: number }
    | null;

/**
 * What to say to a player about the people near them.
 *
 * Built from the list the board already shows, so it costs nothing extra to compute. A hidden or
 * unranked player gets no hint: telling someone how to climb a board they have left is noise.
 *
 * `listed` is how many accounts the list can hold. A full list means anyone below its last score is
 * outside it, and the useful thing to say then is how far the door is, not who is a thousand places up.
 */
export function rivalHint(
    me: RivalInput,
    top: readonly { username: string; score: number }[],
    listed: number,
): RivalHint {
    if (me.hidden || me.rank === null || top.length === 0) return null;

    const lowest = Math.min(...top.map(entry => entry.score));
    if (top.length >= listed && me.score < lowest) {
        return { kind: "top", points: lowest - me.score, count: listed };
    }

    const ahead = top.filter(entry => entry.score > me.score);
    if (ahead.length > 0) {
        const nearest = Math.min(...ahead.map(entry => entry.score));
        const rival = ahead.find(entry => entry.score === nearest)!;
        return { kind: "ahead", name: rival.username, points: nearest - me.score };
    }

    const behind = top.filter(entry => entry.score < me.score);
    if (behind.length > 0) {
        return { kind: "lead", points: me.score - Math.max(...behind.map(entry => entry.score)) };
    }

    return null;
}
