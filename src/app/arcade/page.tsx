"use client";

import { useState } from "react";
import { PageLayout } from "~/components/layout/PageLayout";
import { ClientOnly } from "~/components/ClientOnly";
import { useLanguage } from "~/contexts/LanguageContext";
import { useGameContext } from "~/contexts/GameContext";
import { MinigameGrid } from "~/components/minigames/MinigameGrid";
import { MINIGAMES } from "~/components/minigames/registry";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Gamepad2, Coins, ArrowLeft } from "lucide-react";

export default function ArcadePage() {
    const { t } = useLanguage();
    const { progressManager, currentDifficulty } = useGameContext();
    const [activeMinigame, setActiveMinigame] = useState<string | null>(null);

    const activeDef = MINIGAMES.find(game => game.id === activeMinigame) ?? null;

    const handleComplete = (gameId: string, score: number) => {
        // The coins are the arcade's advertised reward from the registry; `score` is what the
        // player just scored. Passing `score` as the reward — which this used to do — paid out a
        // time-dependent number many times larger than the "+10" on the card.
        const reward = MINIGAMES.find(game => game.id === gameId)?.coins ?? 0;
        progressManager.completeMinigame(gameId, reward, score);
        setActiveMinigame(null);
    };

    return (
        <PageLayout>
            <section className="container mx-auto px-4 py-8 sm:py-12">
                {activeDef ? (
                    <div className="mx-auto max-w-3xl">
                        <Button variant="ghost" onClick={() => setActiveMinigame(null)} className="mb-4">
                            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                            {t("arcade.backToArcade")}
                        </Button>
                        <activeDef.Component
                            onComplete={score => handleComplete(activeDef.id, score)}
                            onClose={() => setActiveMinigame(null)}
                            difficulty={currentDifficulty}
                        />
                    </div>
                ) : (
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="min-w-0">
                                <h1 className="font-display text-gm-ink flex items-center gap-3 text-2xl sm:text-3xl">
                                    <Gamepad2 className="text-gm-grape-hi h-7 w-7 shrink-0" aria-hidden="true" />
                                    <span className="[text-wrap:balance] [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                                        {t("arcade.title")}
                                    </span>
                                </h1>
                                <p className="text-gm-ink-soft mt-3 max-w-2xl text-sm sm:text-base">
                                    {t("arcade.subtitle")}
                                </p>
                            </div>
                            {/* Coin purse: gold is currency and nothing else, so it carries the whole pill. */}
                            <ClientOnly fallback={<Skeleton className="h-11 w-40 rounded-full" />}>
                                <div className="border-gm-gold-edge bg-gm-night flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 shadow-[0_4px_0_var(--color-gm-gold-edge)]">
                                    <Coins className="text-gm-gold h-5 w-5" aria-hidden="true" />
                                    <span className="text-gm-gold font-bold tabular-nums">
                                        {progressManager.getCoins()}
                                    </span>
                                    <span className="text-gm-ink-dim text-sm">{t("shop.coins")}</span>
                                </div>
                            </ClientOnly>
                        </div>

                        <ClientOnly
                            fallback={
                                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {MINIGAMES.map(game => (
                                        <Skeleton key={game.id} className="h-52 rounded-2xl" />
                                    ))}
                                </div>
                            }>
                            <MinigameGrid
                                completedMinigames={progressManager.getCompletedMinigames()}
                                onPlay={setActiveMinigame}
                            />
                        </ClientOnly>
                    </div>
                )}
            </section>
        </PageLayout>
    );
}
