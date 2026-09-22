"use client";

import { Check, Coins, Play, Trophy } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { MINIGAMES } from "~/components/minigames/registry";

interface MinigameGridProps {
    completedMinigames: string[];
    onPlay: (gameId: string) => void;
    className?: string;
}

/**
 * Every tile is the same keycap: night face, 2px edge border, hard zero-blur edge shadow.
 * Only the accent changes, and it follows the Git legend rather than taste — the colour
 * names the Git concept the game teaches.
 */
const TILE_ACCENTS = {
    grape: {
        border: "border-gm-grape-edge",
        icon: "bg-gm-grape/30 text-gm-grape-hi",
        edge: "shadow-[0_5px_0_var(--color-gm-grape-edge)] hover:shadow-[0_7px_0_var(--color-gm-grape-edge)] active:shadow-[0_1px_0_var(--color-gm-grape-edge)] motion-reduce:hover:shadow-[0_5px_0_var(--color-gm-grape-edge)]",
    },
    cyan: {
        border: "border-gm-cyan-edge",
        icon: "bg-gm-cyan/15 text-gm-cyan",
        edge: "shadow-[0_5px_0_var(--color-gm-cyan-edge)] hover:shadow-[0_7px_0_var(--color-gm-cyan-edge)] active:shadow-[0_1px_0_var(--color-gm-cyan-edge)] motion-reduce:hover:shadow-[0_5px_0_var(--color-gm-cyan-edge)]",
    },
    lime: {
        border: "border-gm-lime-edge",
        icon: "bg-gm-lime/15 text-gm-lime",
        edge: "shadow-[0_5px_0_var(--color-gm-lime-edge)] hover:shadow-[0_7px_0_var(--color-gm-lime-edge)] active:shadow-[0_1px_0_var(--color-gm-lime-edge)] motion-reduce:hover:shadow-[0_5px_0_var(--color-gm-lime-edge)]",
    },
    coral: {
        border: "border-gm-coral-edge",
        icon: "bg-gm-coral/15 text-gm-coral",
        edge: "shadow-[0_5px_0_var(--color-gm-coral-edge)] hover:shadow-[0_7px_0_var(--color-gm-coral-edge)] active:shadow-[0_1px_0_var(--color-gm-coral-edge)] motion-reduce:hover:shadow-[0_5px_0_var(--color-gm-coral-edge)]",
    },
} as const;

// cyan = feature branch, grape = main history, lime = commit, coral = conflict / fix.
const GAME_ACCENTS: Record<string, keyof typeof TILE_ACCENTS> = {
    "branch-master": "cyan",
    "graph-puzzle": "grape",
    "commit-champion": "lime",
    "merge-master": "coral",
};

export function MinigameGrid({ completedMinigames, onPlay, className = "" }: MinigameGridProps) {
    const { t } = useLanguage();

    return (
        <div className={`grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
            {MINIGAMES.map(game => {
                const isCompleted = completedMinigames.includes(game.id);
                const accent = TILE_ACCENTS[GAME_ACCENTS[game.id] ?? "grape"];

                return (
                    <button
                        key={game.id}
                        type="button"
                        onClick={() => onPlay(game.id)}
                        className={`group bg-gm-night focus-visible:outline-gm-cyan flex h-full min-w-0 cursor-pointer flex-col gap-3 rounded-2xl border-2 p-4 text-start transition-[transform,box-shadow,filter] duration-150 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-4 active:translate-y-[3px] motion-reduce:transition-[filter] motion-reduce:hover:translate-y-0 ${accent.border} ${accent.edge}`}>
                        <span className="flex items-start gap-3">
                            <span
                                className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.85rem] ${accent.icon}`}
                                aria-hidden="true">
                                {game.icon}
                                {isCompleted && (
                                    <span className="bg-gm-lime text-gm-void border-gm-night absolute -end-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2">
                                        <Check className="h-3 w-3" strokeWidth={3} />
                                    </span>
                                )}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="text-gm-ink block text-base leading-tight font-bold [overflow-wrap:anywhere]">
                                    {t(game.nameKey)}
                                </span>
                                <span className="text-gm-ink-dim mt-1 block text-xs">{t(game.categoryKey)}</span>
                            </span>
                            <span className="gm-chip bg-gm-grape text-gm-ink shrink-0">
                                {t(`difficulty.${game.difficulty}`)}
                            </span>
                        </span>

                        <span className="text-gm-ink-soft block text-sm leading-relaxed">{t(game.descriptionKey)}</span>

                        <span className="border-gm-line mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t-2 pt-3">
                            <span className="text-gm-gold flex items-center gap-1.5 text-sm font-semibold tabular-nums">
                                <Coins className="h-4 w-4" aria-hidden="true" />+{game.coins}
                                <span className="text-gm-ink-dim font-normal">{t("shop.coins")}</span>
                            </span>
                            <span className="text-gm-ink flex items-center gap-1.5 text-sm font-semibold">
                                {isCompleted ? (
                                    <Trophy className="text-gm-lime h-4 w-4" aria-hidden="true" />
                                ) : (
                                    <Play className="text-gm-lime h-4 w-4 fill-current" aria-hidden="true" />
                                )}
                                {t(isCompleted ? "minigame.playAgain" : "minigame.play")}
                            </span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
