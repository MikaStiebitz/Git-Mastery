import { useState, useEffect } from "react";
import { Lightbulb, X } from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { getRandomGitTip } from "~/lib/ProGitTips";
import { Button } from "./ui/button";

export function ProTipDisplay() {
    const { progressManager, currentStage, currentLevel } = useGameContext();
    const { t } = useLanguage();
    const [currentTip, setCurrentTip] = useState("");
    const [isEnabled, setIsEnabled] = useState(true);

    // Check if user has purchased pro-tips
    const hasProTips = progressManager.getPurchasedItems().includes("pro-tips");

    // Load enabled state from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("proTipsEnabled");
            if (saved !== null) {
                setIsEnabled(saved === "true");
            }
        }
    }, []);

    // Generate new tip when level changes
    useEffect(() => {
        if (hasProTips && currentStage && currentLevel && isEnabled) {
            setCurrentTip(getRandomGitTip());
        }
    }, [currentStage, currentLevel, hasProTips, isEnabled]);

    // Save enabled state to localStorage
    const toggleEnabled = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        if (typeof window !== "undefined") {
            localStorage.setItem("proTipsEnabled", String(newState));
        }
    };

    // Don't render if user hasn't purchased the item or tips are disabled
    if (!hasProTips || !isEnabled || !currentTip) {
        return null;
    }

    // Simple, always-visible tip bar integrated into footer
    return (
        <div className="border-gm-line bg-gm-night border-t-2 px-4 py-2.5">
            <div className="container mx-auto flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Lightbulb className="text-gm-gold h-4 w-4 shrink-0" aria-hidden="true" />
                    <p className="text-gm-ink-soft min-w-0 text-sm">
                        <span className="text-gm-ink font-semibold">{t("shop.proTip.title")}: </span>
                        {currentTip}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleEnabled}
                    className="h-8 w-8 shrink-0 p-0"
                    aria-label={t("shop.proTip.hide")}>
                    <X className="h-4 w-4" aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}
