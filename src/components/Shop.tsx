"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "~/components/ui/dialog";
import { ShoppingCart, Star, Zap, Trophy, Coins, Sparkles, Gamepad2, Lightbulb, Check, Ban } from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { getRandomGitTip } from "~/lib/ProGitTips";

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

/**
 * Rarity is a shop concept, not a Git one, so it rides the neutral / info / brand / reward
 * end of the palette. Lime and coral stay reserved for "owned" and "can't afford", which are
 * the two states a player actually acts on.
 */
const rarityBadgeVariant = {
    common: "outline",
    rare: "info",
    epic: "secondary",
    legendary: "reward",
} as const;

const rarityIconColor = {
    common: "text-gm-ink-dim",
    rare: "text-gm-cyan",
    epic: "text-gm-grape-hi",
    legendary: "text-gm-gold",
} as const;

export function Shop({ isOpen, onClose }: ShopProps) {
    const { progressManager } = useGameContext();
    const { t } = useLanguage();

    // State für force re-render nach Käufen
    const [, forceUpdate] = useState({});
    const [showProTip, setShowProTip] = useState(false);
    const [currentTip, setCurrentTip] = useState("");
    const [proTipsEnabled, setProTipsEnabled] = useState(true);

    // Load Pro Tips enabled state
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("proTipsEnabled");
            if (saved !== null) {
                setProTipsEnabled(saved === "true");
            }
        }
    }, []);

    // Force re-render when dialog opens to show latest progress
    useEffect(() => {
        // Component will re-render when isOpen changes
    }, [isOpen]);

    // Get fresh data on each render to ensure updates are reflected
    const progress = progressManager.getProgress();
    const playerCoins = progress.coins; // Use coins instead of score
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
            id: "pro-tips",
            name: t("shop.item.proTips.name"),
            description: t("shop.item.proTips.description"),
            price: 60,
            icon: <Lightbulb className="h-6 w-6" />,
            category: "utility",
            rarity: "rare",
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
        if (playerCoins >= item.price && !purchasedItems.includes(item.id)) {
            // Spend coins and purchase item
            if (progressManager.spendPoints(item.price)) {
                progressManager.purchaseItem(item.id);

                // Handle special item effects
                if (item.id === "double-xp") {
                    progressManager.activateDoubleXp();
                    console.log("Double XP activated for 7 days!");
                }

                // Handle pro-tips item
                if (item.id === "pro-tips") {
                    setCurrentTip(getRandomGitTip());
                    setShowProTip(true);
                }

                // Force component re-render to show updated state
                forceUpdate({});

                // Show success message
                console.log(`Successfully purchased ${item.name}!`);
            }
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShoppingCart className="text-gm-gold h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden="true" />
                            {t("shop.title")}
                        </DialogTitle>
                        <DialogDescription>{t("shop.subtitle")}</DialogDescription>
                        <p className="border-gm-gold-edge text-gm-gold mt-1 inline-flex items-center gap-2 self-start rounded-full border-2 px-3 py-1 text-sm font-semibold">
                            <Coins className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span>
                                {t("shop.balance")}: {playerCoins} {t("shop.coins")}
                            </span>
                        </p>
                    </DialogHeader>

                    <ul className="mt-5 grid list-none grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
                        {shopItems.map(item => {
                            const isPurchased = purchasedItems.includes(item.id);
                            const canAfford = playerCoins >= item.price;

                            return (
                                <li
                                    key={item.id}
                                    className={`gm-inset flex min-w-0 flex-col gap-3 p-4 transition-colors duration-200 ease-[var(--ease-out-expo)] ${
                                        isPurchased ? "border-gm-lime-edge" : ""
                                    }`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span
                                                className={`shrink-0 ${rarityIconColor[item.rarity]}`}
                                                aria-hidden="true">
                                                {item.icon}
                                            </span>
                                            <h3 className="text-gm-ink min-w-0 text-base font-bold [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                                                {item.name}
                                            </h3>
                                        </div>
                                        <Badge variant={rarityBadgeVariant[item.rarity]} className="shrink-0">
                                            {t(`shop.rarity.${item.rarity}`)}
                                        </Badge>
                                    </div>

                                    <p className="text-gm-ink-soft text-sm leading-relaxed">{item.description}</p>

                                    <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-gm-gold inline-flex items-center gap-1.5 font-semibold">
                                            <Coins className="h-4 w-4 shrink-0" aria-hidden="true" />
                                            <span>{item.price}</span>
                                            <span className="sr-only">{t("shop.coins")}</span>
                                        </p>

                                        {item.id === "pro-tips" && isPurchased ? (
                                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                                <Button
                                                    onClick={() => {
                                                        setCurrentTip(getRandomGitTip());
                                                        setShowProTip(true);
                                                    }}
                                                    size="sm"
                                                    variant="secondary"
                                                    className="w-full sm:w-auto">
                                                    <Lightbulb className="h-4 w-4" aria-hidden="true" />
                                                    {t("shop.showTip")}
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        const newState = !proTipsEnabled;
                                                        setProTipsEnabled(newState);
                                                        localStorage.setItem("proTipsEnabled", String(newState));
                                                        forceUpdate({});
                                                    }}
                                                    size="sm"
                                                    variant="outline"
                                                    aria-pressed={proTipsEnabled}
                                                    className="w-full sm:w-auto">
                                                    {proTipsEnabled
                                                        ? t("shop.proTip.disable")
                                                        : t("shop.proTip.enable")}
                                                </Button>
                                            </div>
                                        ) : isPurchased ? (
                                            /* Owned never rides on colour alone: lime chip + check + the word. */
                                            <Badge className="self-start sm:self-auto">
                                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                                {t("shop.purchased")}
                                            </Badge>
                                        ) : (
                                            <Button
                                                onClick={() => handlePurchase(item)}
                                                disabled={!canAfford}
                                                size="sm"
                                                variant={canAfford ? "secondary" : "destructive"}
                                                className="w-full sm:w-auto">
                                                {canAfford ? (
                                                    <>
                                                        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                                                        {t("shop.buy")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Ban className="h-4 w-4" aria-hidden="true" />
                                                        {t("shop.insufficient")}
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <DialogFooter>
                        <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
                            {t("minigame.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Pro Tip Dialog */}
            <Dialog open={showProTip} onOpenChange={setShowProTip}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lightbulb className="text-gm-gold h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden="true" />
                            {t("shop.proTip.title")}
                        </DialogTitle>
                        <DialogDescription>{t("shop.proTip.subtitle")}</DialogDescription>
                    </DialogHeader>

                    <div className="gm-inset mt-4 p-4">
                        <p className="text-gm-ink-soft leading-relaxed">{currentTip}</p>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setShowProTip(false)} variant="outline" className="w-full sm:w-auto">
                            {t("minigame.close")}
                        </Button>
                        <Button
                            onClick={() => {
                                setCurrentTip(getRandomGitTip());
                            }}
                            variant="secondary"
                            className="w-full sm:w-auto">
                            <Lightbulb className="h-4 w-4" aria-hidden="true" />
                            {t("shop.proTip.another")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

interface ShopContextValue {
    openShop: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

/** Opens the shop from anywhere inside the layout (navbar purse, landing page, level pages). */
export function useShop(): ShopContextValue {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error("useShop must be used inside <ShopProvider>");
    }
    return context;
}

/**
 * Mounts the shop once for the whole app.
 *
 * It used to live only on the landing page, so the coin balance in the navbar was a dead end on
 * every other route: the number told you what you could spend without offering anywhere to spend
 * it. One provider keeps a single dialog instance no matter who opens it.
 */
export function ShopProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ShopContext.Provider value={{ openShop: () => setIsOpen(true) }}>
            {children}
            <Shop isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </ShopContext.Provider>
    );
}
