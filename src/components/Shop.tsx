"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { ShoppingCart, Star, Zap, Trophy, Coins, Sparkles, Gamepad2 } from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";

interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    icon: React.ReactNode;
    category: "cosmetic" | "utility" | "achievement" | "special";
    rarity: "common" | "rare" | "epic" | "legendary";
}

interface ShopProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Shop({ isOpen, onClose }: ShopProps) {
    const { progressManager } = useGameContext();
    const { t } = useLanguage();

    // State für force re-render nach Käufen
    const [, forceUpdate] = useState({});

    // Force re-render when dialog opens to show latest progress
    useEffect(() => {
        // Component will re-render when isOpen changes
    }, [isOpen]);

    // Get fresh data on each render to ensure updates are reflected
    const progress = progressManager.getProgress();
    const playerPoints = progress.score;
    const purchasedItems = progressManager.getPurchasedItems();

    // Define shop items with translations
    const shopItems: ShopItem[] = [
        {
            id: "dark-terminal",
            name: t("shop.item.darkTerminal.name"),
            description: t("shop.item.darkTerminal.description"),
            price: 25,
            icon: <Star className="h-6 w-6" />,
            category: "cosmetic",
            rarity: "common",
        },
        {
            id: "matrix-terminal",
            name: t("shop.item.matrixTerminal.name"),
            description: t("shop.item.matrixTerminal.description"),
            price: 50,
            icon: <Zap className="h-6 w-6" />,
            category: "cosmetic",
            rarity: "rare",
        },
        {
            id: "golden-terminal",
            name: t("shop.item.goldenTerminal.name"),
            description: t("shop.item.goldenTerminal.description"),
            price: 100,
            icon: <Trophy className="h-6 w-6" />,
            category: "cosmetic",
            rarity: "legendary",
        },
        {
            id: "git-mascot",
            name: t("shop.item.gitMascot.name"),
            description: t("shop.item.gitMascot.description"),
            price: 75,
            icon: <Sparkles className="h-6 w-6" />,
            category: "special",
            rarity: "rare",
        },
        {
            id: "victory-sound",
            name: t("shop.item.victorySound.name"),
            description: t("shop.item.victorySound.description"),
            price: 40,
            icon: <Gamepad2 className="h-6 w-6" />,
            category: "special",
            rarity: "common",
        },
        {
            id: "double-xp",
            name: t("shop.item.doubleXp.name"),
            description: t("shop.item.doubleXp.description"),
            price: 120,
            icon: <Zap className="h-6 w-6" />,
            category: "utility",
            rarity: "epic",
        },
        {
            id: "emoji-commits",
            name: t("shop.item.emojiCommits.name"),
            description: t("shop.item.emojiCommits.description"),
            price: 35,
            icon: <Sparkles className="h-6 w-6" />,
            category: "special",
            rarity: "common",
        },
        {
            id: "git-legend",
            name: t("shop.item.gitLegend.name"),
            description: t("shop.item.gitLegend.description"),
            price: 200,
            icon: <Trophy className="h-6 w-6" />,
            category: "achievement",
            rarity: "legendary",
        },
    ];

    const handlePurchase = (item: ShopItem) => {
        if (playerPoints >= item.price && !purchasedItems.includes(item.id)) {
            // Spend points and purchase item
            if (progressManager.spendPoints(item.price)) {
                progressManager.purchaseItem(item.id);

                // Handle special item effects
                if (item.id === "double-xp") {
                    progressManager.activateDoubleXp();
                    console.log("Double XP activated for 7 days!");
                }

                // Force component re-render to show updated state
                forceUpdate({});

                // Show success message
                console.log(`Successfully purchased ${item.name}!`);
            }
        }
    };

    const getRarityColor = (rarity: ShopItem["rarity"]) => {
        switch (rarity) {
            case "common":
                return "text-gray-400 border-gray-600";
            case "rare":
                return "text-blue-400 border-blue-600";
            case "epic":
                return "text-purple-400 border-purple-600";
            case "legendary":
                return "text-yellow-400 border-yellow-600";
        }
    };

    const getRarityBg = (rarity: ShopItem["rarity"]) => {
        switch (rarity) {
            case "common":
                return "bg-gray-900/20";
            case "rare":
                return "bg-blue-900/20";
            case "epic":
                return "bg-purple-900/20";
            case "legendary":
                return "bg-yellow-900/20";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="mx-2 flex max-h-[90vh] w-[calc(100vw-1rem)] max-w-4xl flex-col overflow-hidden border-purple-900/20 bg-[#1a1625] text-purple-100 sm:mx-6 sm:w-[calc(100vw-3rem)] md:mx-0 md:w-full">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center text-xl text-white sm:text-2xl">
                        <ShoppingCart className="mr-2 h-5 w-5 text-purple-400 sm:h-6 sm:w-6" />
                        {t("shop.title")}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-purple-300 sm:text-base">
                        {t("shop.subtitle")}
                    </DialogDescription>
                    <div className="flex items-center space-x-2 text-base font-semibold text-yellow-400 sm:text-lg">
                        <Coins className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">
                            {t("shop.balance")}: {playerPoints} {t("progress.points")}
                        </span>
                    </div>
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2">
                    <div className="mt-6 grid max-w-full grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
                        {shopItems.map(item => {
                            const isPurchased = purchasedItems.includes(item.id);
                            const canAfford = playerPoints >= item.price;

                            return (
                                <Card
                                    key={item.id}
                                    className={`border transition-all duration-300 ${getRarityColor(item.rarity)} ${getRarityBg(item.rarity)} ${
                                        isPurchased ? "opacity-60" : "hover:shadow-lg hover:shadow-purple-500/20"
                                    } min-w-0`}>
                                    <CardHeader className="p-4 sm:p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className={`${getRarityColor(item.rarity).split(" ")[0]}`}>
                                                    {item.icon}
                                                </div>
                                                <CardTitle
                                                    className={`text-base ${getRarityColor(item.rarity).split(" ")[0]} sm:text-lg`}>
                                                    {item.name}
                                                </CardTitle>
                                            </div>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs capitalize ${getRarityColor(item.rarity)}`}>
                                                {t(`shop.rarity.${item.rarity}`)}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 overflow-hidden p-4 pt-0 sm:space-y-4 sm:p-6 sm:pt-0">
                                        <p className="break-words text-xs text-purple-200 sm:text-sm">
                                            {item.description}
                                        </p>

                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center space-x-1 text-yellow-400">
                                                <Coins className="h-4 w-4" />
                                                <span className="text-sm font-semibold sm:text-base">{item.price}</span>
                                            </div>

                                            <Button
                                                onClick={() => handlePurchase(item)}
                                                disabled={isPurchased || !canAfford}
                                                size="sm"
                                                className={`w-full sm:w-auto ${
                                                    isPurchased
                                                        ? "cursor-not-allowed bg-green-600 text-white"
                                                        : !canAfford
                                                          ? "cursor-not-allowed bg-gray-600 text-gray-300"
                                                          : "bg-purple-600 text-white hover:bg-purple-700"
                                                }`}>
                                                {isPurchased
                                                    ? t("shop.purchased")
                                                    : !canAfford
                                                      ? t("shop.insufficient")
                                                      : t("shop.buy")}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 flex flex-shrink-0 justify-center">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="border-purple-700 text-purple-300 hover:bg-purple-900/50">
                        {t("minigame.close")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
