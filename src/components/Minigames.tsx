"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "~/components/ui/dialog";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { Gamepad2 } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { useGameContext } from "~/contexts/GameContext";
import { MinigameGrid } from "~/components/minigames/MinigameGrid";
import { MINIGAMES } from "~/components/minigames/registry";

interface MinigamesProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Minigames({ isOpen, onClose }: MinigamesProps) {
    const { t } = useLanguage();
    const { progressManager, currentDifficulty } = useGameContext();
    const [activeMinigame, setActiveMinigame] = useState<string | null>(null);

    const activeDef = MINIGAMES.find(game => game.id === activeMinigame) ?? null;

    const handleMinigameComplete = (gameId: string, score: number) => {
        // The coins are the arcade's advertised reward from the registry; `score` is what the
        // player just scored. Passing `score` as the reward — which this used to do — paid out a
        // time-dependent number many times larger than the "+10" on the card.
        const reward = MINIGAMES.find(game => game.id === gameId)?.coins ?? 0;
        progressManager.completeMinigame(gameId, reward, score);
        setActiveMinigame(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-3xl"
                showClose={!activeMinigame} // Hide X button when a minigame is active
            >
                {activeDef ? (
                    <>
                        <DialogHeader>
                            <VisuallyHidden>
                                <DialogTitle>{t(activeDef.nameKey)}</DialogTitle>
                            </VisuallyHidden>
                        </DialogHeader>
                        <div>
                            <activeDef.Component
                                onComplete={score => handleMinigameComplete(activeDef.id, score)}
                                onClose={() => setActiveMinigame(null)}
                                difficulty={currentDifficulty}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Gamepad2
                                    className="text-gm-grape-hi h-5 w-5 shrink-0 sm:h-6 sm:w-6"
                                    aria-hidden="true"
                                />
                                {t("minigame.title")}
                            </DialogTitle>
                            <DialogDescription>{t("minigame.subtitle")}</DialogDescription>
                        </DialogHeader>

                        <MinigameGrid
                            className="mt-5"
                            completedMinigames={progressManager.getCompletedMinigames()}
                            onPlay={setActiveMinigame}
                        />

                        <DialogFooter>
                            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
                                {t("minigame.close")}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
