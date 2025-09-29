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
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
                isAnimating ? "animate-in slide-in-from-bottom-4 fade-in" : "animate-out slide-out-to-bottom-4 fade-out"
            }`}>
            <div className="relative">
                {/* Speech bubble */}
                <div className="mb-2 max-w-xs rounded-lg bg-white p-3 shadow-lg">
                    <p className="text-sm font-medium text-gray-800">{currentMessage}</p>
                    {/* Arrow pointing down to mascot */}
                    <div className="absolute -bottom-2 left-6 h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
                </div>

                {/* GitHub Mascot */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                    {/* GitHub Icon */}
                    <Github className="animate-bounce h-10 w-10 text-white" />

                    {/* Celebration sparkles */}
                    <div className="animate-ping absolute -left-2 -top-2 h-4 w-4 rounded-full bg-yellow-400 opacity-75"></div>
                    <div className="animate-ping animation-delay-300 absolute -right-3 -top-1 h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
                    <div className="animate-ping animation-delay-500 absolute -bottom-3 -left-1 h-2 w-2 rounded-full bg-blue-400 opacity-75"></div>
                    <div className="animate-ping animation-delay-700 absolute -bottom-2 -right-2 h-3 w-3 rounded-full bg-purple-400 opacity-75"></div>
                </div>
            </div>
        </div>
    );
}
