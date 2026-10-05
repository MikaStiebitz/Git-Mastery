"use client";

import { Crown } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import type { LeaderboardEntry } from "~/lib/accountApi";
import { getRankStatus } from "~/lib/ranks";
import { AchievementStrip } from "~/components/leaderboard/AchievementStrip";
import { cn } from "~/lib/utils";

interface PodiumProps {
    /** The first three entries, best first. Fewer is fine. */
    entries: readonly LeaderboardEntry[];
    mine: string | null;
    onOpen: (username: string) => void;
}

/** Tallest in the middle, the way a podium is read: second, first, third. */
const ORDER = [1, 0, 2] as const;
const HEIGHTS = ["min-h-52", "min-h-44", "min-h-40"] as const;
const TONES = [
    "border-gm-gold-edge bg-gm-gold/15 text-gm-gold",
    "border-gm-line bg-gm-night text-gm-ink-soft",
    "border-gm-coral/60 bg-gm-coral/10 text-gm-coral",
] as const;

export function Podium({ entries, mine, onOpen }: PodiumProps) {
    const { t } = useLanguage();
    if (entries.length === 0) return null;

    return (
        <ol className="mb-6 grid grid-cols-3 items-end gap-2 sm:gap-4" aria-label={t("leaderboard.title")}>
            {ORDER.map(place => {
                const entry = entries[place];
                if (!entry) return <li key={place} aria-hidden="true" />;

                const title = t(`rank.${getRankStatus(entry.score).rank.id}`);
                return (
                    <li key={place}>
                        <button
                            type="button"
                            onClick={() => onOpen(entry.username)}
                            aria-label={t("leaderboard.viewProfile").replace("{name}", entry.username)}
                            className={cn(
                                "focus-visible:outline-gm-cyan flex w-full cursor-pointer flex-col items-center justify-end gap-1 rounded-2xl border-2 p-3 text-center transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2",
                                TONES[place],
                                HEIGHTS[place],
                                mine === entry.username && "ring-gm-lime ring-2",
                            )}>
                            {place === 0 ? (
                                <Crown className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <span className="font-display text-xl tabular-nums" aria-hidden="true">
                                    {entry.rank}
                                </span>
                            )}
                            <span className="sr-only">#{entry.rank}</span>
                            <span className="text-gm-ink w-full text-sm font-bold [overflow-wrap:anywhere] sm:text-base">
                                {entry.username}
                            </span>
                            <span className="text-gm-ink-dim text-xs">{title}</span>
                            <span className="text-gm-ink font-display text-lg tabular-nums">{entry.score} XP</span>
                            <AchievementStrip ids={entry.achievements} max={4} className="justify-center" />
                        </button>
                    </li>
                );
            })}
        </ol>
    );
}
