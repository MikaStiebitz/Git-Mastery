"use client";

import { Trophy, Star, Award, Crown, Zap } from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { ClientOnly } from "./ClientOnly";

interface BadgeDisplayProps {
    className?: string;
}

/** One achievement token: a solid accent tile plus a plain-text tooltip on hover/focus. */
function BadgeToken({
    label,
    tone,
    children,
}: {
    label: string;
    tone: "gold" | "grape" | "lime" | "cyan" | "coral";
    children: React.ReactNode;
}) {
    const tones = {
        gold: "border-gm-gold-edge bg-gm-gold text-gm-void",
        grape: "border-gm-grape-edge bg-gm-grape text-gm-ink",
        lime: "border-gm-lime-edge bg-gm-lime text-gm-void",
        cyan: "border-gm-cyan-edge bg-gm-cyan text-gm-void",
        coral: "border-gm-coral-edge bg-gm-coral text-gm-void",
    } as const;

    return (
        <div className="group relative">
            <span
                tabIndex={0}
                role="img"
                aria-label={label}
                className={`flex h-9 w-9 items-center justify-center rounded-[0.7rem] border-2 ${tones[tone]} focus-visible:outline-gm-cyan focus-visible:outline-3 focus-visible:outline-offset-2`}>
                {children}
            </span>
            <span
                className="border-gm-line bg-gm-night text-gm-ink pointer-events-none absolute -bottom-1 left-1/2 z-(--z-tooltip) hidden -translate-x-1/2 translate-y-full rounded-lg border-2 px-2 py-1 text-xs font-semibold whitespace-nowrap group-focus-within:block group-hover:block"
                aria-hidden="true">
                {label}
            </span>
        </div>
    );
}

export function BadgeDisplay({ className = "" }: BadgeDisplayProps) {
    const { progressManager } = useGameContext();

    const purchasedItems = progressManager.getPurchasedItems();
    const progress = progressManager.getProgress();

    // Check if user has the Git Legend badge
    const hasGitLegendBadge = purchasedItems.includes("git-legend");

    // Check for other achievements
    const totalScore = progress.score;
    const completedLevels = Object.values(progress.completedLevels).reduce((acc, levels) => acc + levels.length, 0);
    const completedMinigames = progress.completedMinigames.length;

    if (!hasGitLegendBadge && totalScore < 500) {
        return null; // Don't show badge display if no achievements yet
    }

    return (
        <ClientOnly>
            <div className={`flex items-center gap-2 ${className}`}>
                {hasGitLegendBadge && (
                    <BadgeToken label="Git Legend" tone="gold">
                        <Crown className="h-5 w-5" aria-hidden="true" />
                    </BadgeToken>
                )}

                {totalScore >= 500 && (
                    <BadgeToken label={`High Achiever (${totalScore} pts)`} tone="grape">
                        <Star className="h-5 w-5 fill-current" aria-hidden="true" />
                    </BadgeToken>
                )}

                {completedLevels >= 10 && (
                    <BadgeToken label={`Level Master (${completedLevels} levels)`} tone="lime">
                        <Trophy className="h-5 w-5" aria-hidden="true" />
                    </BadgeToken>
                )}

                {completedMinigames >= 3 && (
                    <BadgeToken label="Minigame Champion" tone="cyan">
                        <Award className="h-5 w-5" aria-hidden="true" />
                    </BadgeToken>
                )}

                {progressManager.isDoubleXpActive() && (
                    <BadgeToken
                        label={`2X XP Active (${progressManager.getDoubleXpRemainingHours()}h left)`}
                        tone="coral">
                        <Zap className="h-5 w-5 fill-current" aria-hidden="true" />
                    </BadgeToken>
                )}
            </div>
        </ClientOnly>
    );
}
