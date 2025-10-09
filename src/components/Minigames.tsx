"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { Gamepad2, GitBranch, GitCommit, GitMerge, Play, Trophy } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { useGameContext } from "~/contexts/GameContext";
import { BranchMaster } from "~/components/minigames/BranchMaster";
import { CommitChampion } from "~/components/minigames/CommitChampion";
import { MergeMaster } from "~/components/minigames/MergeMaster";

interface Minigame {
    id: string;
    name: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    coins: number;
    icon: React.ReactNode;
    category: string;
}

interface MinigamesProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Minigames({ isOpen, onClose }: MinigamesProps) {
    const { t } = useLanguage();
    const { progressManager, currentDifficulty } = useGameContext();
    const [activeMinigame, setActiveMinigame] = useState<string | null>(null);

    const completedMinigames = progressManager.getCompletedMinigames();

    // Define minigames with translations
    const minigames: Minigame[] = [
        {
            id: "branch-master",
            name: t("minigame.branchMaster.name"),
            description: t("minigame.branchMaster.description"),
            difficulty: "easy",
            coins: 10,
            icon: <GitBranch className="h-6 w-6" />,
            category: t("minigame.branchMaster.category"),
        },
        {
            id: "commit-champion",
            name: t("minigame.commitChampion.name"),
            description: t("minigame.commitChampion.description"),
            difficulty: "medium",
            coins: 20,
            icon: <GitCommit className="h-6 w-6" />,
            category: t("minigame.commitChampion.category"),
        },
        {
            id: "merge-master",
            name: t("minigame.mergeMaster.name"),
            description: t("minigame.mergeMaster.description"),
            difficulty: "hard",
            coins: 30,
            icon: <GitMerge className="h-6 w-6" />,
            category: t("minigame.mergeMaster.category"),
        },
    ];

    const handlePlayMinigame = (game: Minigame) => {
        setActiveMinigame(game.id);
    };

    const handleMinigameComplete = (gameId: string, score: number) => {
        progressManager.completeMinigame(gameId, score);
        setActiveMinigame(null);
    };

    const handleMinigameClose = () => {
        setActiveMinigame(null);
    };

    const getDifficultyColor = (difficulty: Minigame["difficulty"]) => {
        switch (difficulty) {
            case "easy":
                return "text-green-400 border-green-600 bg-green-900/20";
            case "medium":
                return "text-yellow-400 border-yellow-600 bg-yellow-900/20";
            case "hard":
                return "text-red-400 border-red-600 bg-red-900/20";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="mx-2 w-[calc(100vw-1rem)] max-w-4xl border-purple-900/20 bg-[#1a1625] text-purple-100 sm:mx-6 sm:w-[calc(100vw-3rem)] md:mx-0 md:w-full"
                showClose={!activeMinigame} // Hide X button when minigame is active
            >
                {activeMinigame ? (
                    // Show the selected minigame
                    <>
                        <DialogHeader>
                            <VisuallyHidden>
                                <DialogTitle>
                                    {activeMinigame === "branch-master" && "Branch Master Minigame"}
                                    {activeMinigame === "commit-champion" && "Commit Champion Minigame"}
                                    {activeMinigame === "merge-master" && "Merge Master Minigame"}
                                </DialogTitle>
                            </VisuallyHidden>
                        </DialogHeader>
                        <div>
                            {activeMinigame === "branch-master" && (
                                <BranchMaster
                                    onComplete={score => handleMinigameComplete("branch-master", score)}
                                    onClose={handleMinigameClose}
                                    difficulty={currentDifficulty}
                                />
                            )}
                            {activeMinigame === "commit-champion" && (
                                <CommitChampion
                                    onComplete={score => handleMinigameComplete("commit-champion", score)}
                                    onClose={handleMinigameClose}
                                    difficulty={currentDifficulty}
                                />
                            )}
                            {activeMinigame === "merge-master" && (
                                <MergeMaster
                                    onComplete={score => handleMinigameComplete("merge-master", score)}
                                    onClose={handleMinigameClose}
                                    difficulty={currentDifficulty}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    // Show minigame selection
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center text-xl text-white sm:text-2xl">
                                <Gamepad2 className="mr-2 h-5 w-5 text-purple-400 sm:h-6 sm:w-6" />
                                {t("minigame.title")}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-purple-300 sm:text-base">
                                {t("minigame.subtitle")}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {minigames.map(game => {
                                const isCompleted = completedMinigames.includes(game.id);

                                return (
                                    <Card
                                        key={game.id}
                                        className={`border transition-all duration-300 hover:scale-105 ${getDifficultyColor(game.difficulty)} ${
                                            isCompleted ? "opacity-60" : ""
                                        } flex flex-col`}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className={getDifficultyColor(game.difficulty).split(" ")[0]}>
                                                        {game.icon}
                                                    </div>
                                                    <CardTitle
                                                        className={`text-lg ${getDifficultyColor(game.difficulty).split(" ")[0]}`}>
                                                        {game.name}
                                                    </CardTitle>
                                                </div>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs capitalize ${getDifficultyColor(game.difficulty).split(" ")[0]} ${getDifficultyColor(game.difficulty).split(" ")[1]}`}>
                                                    {t(`difficulty.${game.difficulty}`)}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-1 flex-col">
                                            <div className="flex-1 space-y-4">
                                                <p className="text-sm text-purple-200">{game.description}</p>
                                            </div>

                                            <div className="mb-2 mt-4 text-center">
                                                <div className="text-sm text-purple-400">
                                                    <strong>{game.category}</strong> • +{game.coins}{" "}
                                                    {t("shop.coins")}
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => handlePlayMinigame(game)}
                                                className={`w-full ${"bg-purple-600 text-white hover:bg-purple-700"}`}>
                                                {isCompleted ? (
                                                    <>
                                                        <Trophy className="mr-2 h-4 w-4" />
                                                        {t("minigame.playAgain")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="mr-2 h-4 w-4" />
                                                        {t("minigame.play")}
                                                    </>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="border-purple-700 text-purple-300 hover:bg-purple-900/50">
                                {t("minigame.close")}
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
