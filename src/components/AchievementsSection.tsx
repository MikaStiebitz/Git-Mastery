"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Award,
    Crown,
    EyeOff,
    Flag,
    Footprints,
    Gamepad2,
    GraduationCap,
    Layers,
    Lock,
    Medal,
    Rocket,
    Sparkles,
    Sprout,
    Star,
    Target,
    Trophy,
    Zap,
    type LucideIcon,
} from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { MINIGAMES } from "~/components/minigames/registry";
import { RankChip } from "~/components/RankChip";
import { getAchievements, maxStars, type AchievementId } from "~/lib/achievements";
import { ProgressManager } from "~/models/ProgressManager";
import { totalStars } from "~/lib/stars";
import { cn } from "~/lib/utils";

const ICONS: Record<AchievementId, LucideIcon> = {
    "first-step": Footprints,
    "getting-going": Rocket,
    halfway: Flag,
    completionist: Trophy,
    "stage-clear": Layers,
    "beginner-course": Sprout,
    "advanced-course": Zap,
    "pro-course": GraduationCap,
    flawless: Star,
    perfectionist: Target,
    "flawless-stage": Sparkles,
    "star-collector": Award,
    "arcade-regular": Gamepad2,
    maintainer: Medal,
    "git-legend": Crown,
    "git-gud": EyeOff,
};

/**
 * Milestones, how close the next ones are, and the star total.
 *
 * Reads progress through ProgressManager's change event like the navbar does, so it updates the
 * moment a level is cleared. Everything shown is derived from that progress; see lib/achievements.
 */
export function AchievementsSection() {
    const { progressManager } = useGameContext();
    const { t } = useLanguage();
    const [progress, setProgress] = useState(() => progressManager.getProgress());

    useEffect(() => {
        const read = () => setProgress(progressManager.getProgress());
        read();
        window.addEventListener(ProgressManager.CHANGE_EVENT, read);
        return () => window.removeEventListener(ProgressManager.CHANGE_EVENT, read);
    }, [progressManager]);

    const achievements = useMemo(() => getAchievements(progress, { minigameTotal: MINIGAMES.length }), [progress]);

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const stars = totalStars(progress.completedLevels, progress.levelStars);

    // A brand-new player has nothing to show and a wall of locked badges is noise, not motivation.
    const hasPlayed = Object.values(progress.completedLevels).some(levels => levels.length > 0);
    if (!hasPlayed) return null;

    return (
        <section className="container mx-auto px-4 pb-20" aria-labelledby="achievements-heading">
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 id="achievements-heading" className="font-display text-gm-ink text-2xl sm:text-3xl">
                            {t("achievements.title")}
                        </h2>
                        <p className="text-gm-ink-soft mt-2 max-w-prose">{t("achievements.subtitle")}</p>
                    </div>
                    <RankChip score={progress.score} />
                </div>

                <p className="text-gm-ink-soft mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
                    <span>
                        {t("achievements.unlocked")
                            .replace("{count}", String(unlockedCount))
                            .replace("{total}", String(achievements.length))}
                    </span>
                    <span className="flex items-center gap-1">
                        <Star className="fill-gm-gold text-gm-gold h-4 w-4" aria-hidden="true" />
                        <span className="tabular-nums">
                            {stars} / {maxStars()}
                        </span>
                        <span className="sr-only">{t("stars.label")}</span>
                    </span>
                </p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {achievements.map(achievement => {
                        const Icon = ICONS[achievement.id];
                        const hidden = achievement.secret && !achievement.unlocked;
                        const showBar = !achievement.unlocked && achievement.target > 1 && !hidden;

                        return (
                            <li
                                key={achievement.id}
                                className={cn(
                                    "gm-inset flex items-start gap-3 p-4",
                                    achievement.unlocked ? "" : "opacity-70",
                                )}>
                                <span
                                    className={cn(
                                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2",
                                        achievement.unlocked
                                            ? "border-gm-gold-edge bg-gm-gold text-gm-void"
                                            : "border-gm-line bg-gm-night text-gm-ink-dim",
                                    )}
                                    aria-hidden="true">
                                    {achievement.unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="text-gm-ink font-semibold">
                                        {hidden
                                            ? t("achievement.secret.name")
                                            : t(`achievement.${achievement.id}.name`)}
                                        <span className="sr-only">
                                            {" "}
                                            (
                                            {achievement.unlocked
                                                ? t("achievements.state.unlocked")
                                                : t("achievements.state.locked")}
                                            )
                                        </span>
                                    </p>
                                    <p className="text-gm-ink-soft mt-0.5 text-sm">
                                        {hidden
                                            ? t("achievement.secret.desc")
                                            : t(`achievement.${achievement.id}.desc`)}
                                    </p>

                                    {showBar && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <span
                                                className="bg-gm-line block h-1.5 flex-1 overflow-hidden rounded-full"
                                                role="progressbar"
                                                aria-valuemin={0}
                                                aria-valuemax={achievement.target}
                                                aria-valuenow={achievement.current}
                                                aria-label={t(`achievement.${achievement.id}.name`)}>
                                                <span
                                                    className="bg-gm-grape-hi block h-full rounded-full"
                                                    style={{
                                                        width: `${Math.round((achievement.current / achievement.target) * 100)}%`,
                                                    }}
                                                />
                                            </span>
                                            <span className="text-gm-ink-dim text-xs tabular-nums">
                                                {achievement.current}/{achievement.target}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
