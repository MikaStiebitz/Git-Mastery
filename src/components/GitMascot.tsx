"use client";

import { useState, useEffect, useCallback } from "react";
import { Github } from "lucide-react";

interface GitMascotProps {
    isActive: boolean;
    onEncouragement?: () => void;
}

const SUCCESS_MESSAGES = [
    "Amazing! Level completed! 🎉",
    "Git-ting better every level! 💪",
    "Fantastic work! 🏆",
    "You're mastering Git! ⭐",
    "Excellent progress! 🎯",
    "Keep up the great work! 🚀",
    "Level conquered! 🌟",
    "Git skills unlocked! ✨",
];

export function GitMascot({ isActive }: GitMascotProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    // Show mascot only on level completion
    const showSuccessAnimation = useCallback(() => {
        if (!isActive) return;

        const randomMessage = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)] || "Great job!";

        setCurrentMessage(randomMessage);
        setIsVisible(true);
        setIsAnimating(true);

        // Hide after 4 seconds
        setTimeout(() => {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 300);
        }, 4000);
    }, [isActive]);

    // Expose success animation to parent components
    useEffect(() => {
        interface WindowWithMascot extends Window {
            triggerMascotSuccess?: () => void;
        }

        (window as WindowWithMascot).triggerMascotSuccess = showSuccessAnimation;
        return () => {
            delete (window as WindowWithMascot).triggerMascotSuccess;
        };
    }, [showSuccessAnimation]);

    if (!isVisible || !isActive) return null;

    return (
        <div
            className={`fixed end-6 bottom-6 z-(--z-toast) transition-all duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none ${
                isAnimating ? "animate-in slide-in-from-bottom-4 fade-in" : "animate-out slide-out-to-bottom-4 fade-out"
            }`}>
            <div className="relative">
                {/* Speech bubble */}
                <div
                    role="status"
                    className="gm-panel relative mb-3 max-w-[16rem] p-3 shadow-[0_6px_0_var(--color-gm-line)]">
                    <p className="text-gm-ink text-sm font-medium text-pretty">{currentMessage}</p>
                    {/* Arrow pointing down to mascot: border layer first, then the face */}
                    <span
                        className="border-t-gm-line absolute start-6 -bottom-[10px] h-0 w-0 border-s-[10px] border-e-[10px] border-t-[10px] border-s-transparent border-e-transparent"
                        aria-hidden="true"></span>
                    <span
                        className="border-t-gm-night absolute start-[26px] -bottom-[6px] h-0 w-0 border-s-[8px] border-e-[8px] border-t-[8px] border-s-transparent border-e-transparent"
                        aria-hidden="true"></span>
                </div>

                {/* GitHub Mascot — calm idle breathing instead of a bounce */}
                <div className="border-gm-lime-edge bg-gm-night relative flex h-16 w-16 animate-pulse items-center justify-center rounded-full border-2 shadow-[0_4px_0_var(--color-gm-lime-edge)] motion-reduce:animate-none">
                    {/* GitHub Icon */}
                    <Github className="text-gm-lime h-9 w-9" aria-hidden="true" />

                    {/* Celebration markers: lime for the win, gold for the reward */}
                    <span
                        className="bg-gm-lime absolute -start-1 -top-1 h-3 w-3 rounded-full"
                        aria-hidden="true"></span>
                    <span className="bg-gm-gold absolute -end-2 -top-2 h-4 w-4 rounded-full" aria-hidden="true"></span>
                </div>
            </div>
        </div>
    );
}
