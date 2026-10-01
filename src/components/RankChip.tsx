"use client";

import { Medal } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { getRankStatus } from "~/lib/ranks";
import { cn } from "~/lib/utils";

interface RankChipProps {
    score: number;
    className?: string;
}

/**
 * The player's rank with a thin bar towards the next one.
 *
 * Purely presentational: the rank is derived from the score the caller already has, so the chip
 * needs no state and no network.
 */
export function RankChip({ score, className }: RankChipProps) {
    const { t } = useLanguage();
    const status = getRankStatus(score);
    const name = t(`rank.${status.rank.id}`);
    const hint = status.next
        ? t("rank.toNext")
              .replace("{points}", String(status.pointsToNext))
              .replace("{rank}", t(`rank.${status.next.id}`))
        : t("rank.top");

    return (
        <span
            title={`${t("rank.label")}: ${name} — ${hint}`}
            className={cn(
                "border-gm-line bg-gm-night text-gm-ink inline-flex h-10 shrink-0 flex-col justify-center gap-1 rounded-full border-2 px-3",
                className,
            )}>
            <span className="flex items-center gap-1.5 text-xs leading-none font-bold">
                <Medal className="text-gm-grape-hi h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">{t("rank.label")}:</span>
                {name}
            </span>
            <span
                className="bg-gm-line block h-1 w-full overflow-hidden rounded-full"
                role="progressbar"
                aria-label={hint}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(status.progress * 100)}>
                <span
                    className="bg-gm-grape-hi block h-full rounded-full transition-[width] duration-300"
                    style={{ width: `${Math.round(status.progress * 100)}%` }}
                />
            </span>
        </span>
    );
}
