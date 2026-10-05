"use client";

import { useLanguage } from "~/contexts/LanguageContext";
import { ACHIEVEMENT_ICONS, ACHIEVEMENT_ORDER } from "~/components/achievementIcons";
import type { AchievementId } from "~/lib/achievements";
import { cn } from "~/lib/utils";

interface AchievementStripProps {
    /** Unlocked achievement ids, as the Worker reports them. */
    ids: readonly string[];
    /** How many icons to show before collapsing the rest into "+n". */
    max?: number;
    className?: string;
}

const known = new Set<string>(ACHIEVEMENT_ORDER);

/** A row of small icons for a player's unlocked achievements. Decorative; the profile has the words. */
export function AchievementStrip({ ids, max = 6, className }: AchievementStripProps) {
    const { t } = useLanguage();
    // An id from a newer Worker than this build knows is skipped rather than rendered broken.
    const shown = ids.filter((id): id is AchievementId => known.has(id));
    if (shown.length === 0) return null;

    return (
        <span className={cn("flex flex-wrap items-center gap-1", className)}>
            {shown.slice(0, max).map(id => {
                const Icon = ACHIEVEMENT_ICONS[id];
                return (
                    <span
                        key={id}
                        title={t(`achievement.${id}.name`)}
                        className="border-gm-gold-edge bg-gm-gold text-gm-void flex h-5 w-5 items-center justify-center rounded-md border">
                        <Icon className="h-3 w-3" aria-hidden="true" />
                    </span>
                );
            })}
            {shown.length > max && (
                <span className="text-gm-ink-dim text-xs font-semibold tabular-nums">+{shown.length - max}</span>
            )}
        </span>
    );
}
