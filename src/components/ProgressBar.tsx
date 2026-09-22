import { BadgeCheck, Trophy, Coins, Flame } from "lucide-react";
import { ClientOnly } from "./ClientOnly";
import { useLanguage } from "~/contexts/LanguageContext";

interface ProgressBarProps {
    score: number;
    coins: number;
    maxScore: number;
    isDoubleXpActive?: boolean;
    doubleXpHoursLeft?: number;
    className?: string;
}

export function ProgressBar({
    score,
    coins,
    maxScore,
    isDoubleXpActive = false,
    doubleXpHoursLeft = 0,
    className = "",
}: ProgressBarProps) {
    const { t } = useLanguage();
    const percentage = Math.min(100, Math.round((score / maxScore) * 100));

    // Define milestone points
    const milestones = [
        { at: 25, label: t("progress.beginner"), icon: <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> },
        { at: 50, label: t("progress.intermediate"), icon: <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> },
        { at: 75, label: t("progress.expert"), icon: <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> },
        { at: 100, label: t("progress.gitMaster"), icon: <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> },
    ];

    // Find current milestone
    const currentMilestone = milestones.filter(milestone => percentage >= milestone.at).pop();

    return (
        <ClientOnly fallback={<div className={`h-[74px] ${className}`} />}>
            <div className={className}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <div className="text-gm-ink flex flex-wrap items-center gap-2 text-base font-semibold">
                        <span>{t("progress.title")}</span>
                        {currentMilestone && (
                            <span className="gm-chip bg-gm-lime text-gm-void">
                                {currentMilestone.icon}
                                {currentMilestone.label}
                            </span>
                        )}
                        {isDoubleXpActive && (
                            <span className="gm-chip bg-gm-coral text-gm-void">
                                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                                2x XP
                                {doubleXpHoursLeft > 0 && <span className="tabular-nums">({doubleXpHoursLeft}h)</span>}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="text-gm-ink-soft tabular-nums">
                            {score}/{maxScore} {t("progress.points")} ({percentage}%)
                        </span>
                        <span className="gm-chip border-gm-gold-edge bg-gm-void text-gm-gold">
                            <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="tabular-nums">{coins}</span>
                        </span>
                    </div>
                </div>

                <div
                    className="border-gm-line bg-gm-void relative h-3 w-full overflow-hidden rounded-full border-2"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={maxScore}
                    aria-valuenow={score}
                    aria-label={t("progress.title")}>
                    <div
                        className={`h-full rounded-full transition-[width] duration-300 ease-[var(--ease-out-expo)] ${
                            isDoubleXpActive ? "bg-gm-coral" : "bg-gm-lime"
                        }`}
                        style={{ width: `${percentage}%` }}
                    />

                    {/* Milestone markers */}
                    {milestones.map(milestone => (
                        <div
                            key={milestone.at}
                            className={`absolute top-0 h-full w-0.5 ${
                                percentage >= milestone.at ? "bg-gm-void/60" : "bg-gm-line"
                            }`}
                            style={{ insetInlineStart: `${milestone.at}%` }}
                            aria-hidden="true"
                        />
                    ))}
                </div>

                <div className="relative mt-1.5 h-4 w-full text-xs font-medium tabular-nums" aria-hidden="true">
                    {milestones.map(milestone => (
                        <div
                            key={milestone.at}
                            className={`absolute -translate-x-1/2 ${
                                percentage >= milestone.at ? "text-gm-lime" : "text-gm-ink-dim"
                            }`}
                            style={{ insetInlineStart: `${milestone.at}%` }}>
                            {milestone.at}%
                        </div>
                    ))}
                </div>
            </div>
        </ClientOnly>
    );
}
