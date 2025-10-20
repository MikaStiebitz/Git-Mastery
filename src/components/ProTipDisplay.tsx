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
        <div className="border-t border-blue-500/30 bg-gradient-to-r from-blue-950/95 via-purple-950/95 to-blue-950/95 px-4 py-2">
            <div className="container mx-auto flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3">
                    <Lightbulb className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                    <div className="flex items-baseline space-x-2">
                        <span className="text-xs font-semibold text-blue-300">{t("shop.proTip.title")}:</span>
                        <p className="text-xs text-purple-100">{currentTip}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleEnabled}
                    className="h-6 w-6 p-0 text-blue-300 hover:bg-blue-900/50 hover:text-blue-100"
                    title={t("shop.proTip.hide")}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
