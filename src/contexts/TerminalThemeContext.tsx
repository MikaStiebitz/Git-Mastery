"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface TerminalTheme {
    id: string;
    name: string;
    colors: {
        background: string;
        text: string;
        accent: string;
        border: string;
        prompt: string;
        success: string;
        error: string;
        warning: string;
    };
    locked?: boolean;
}

const TERMINAL_THEMES: TerminalTheme[] = [
    {
        id: "default",
        name: "Default Purple",
        colors: {
            background: "#1a1625",
            text: "#e5e4e2",
            accent: "#a855f7",
            border: "#7c3aed",
            prompt: "#a855f7",
            success: "#22c55e",
            error: "#ef4444",
            warning: "#f59e0b",
        },
    },
    {
        id: "dark-terminal",
        name: "Dark Blue",
        colors: {
            background: "#0f172a",
            text: "#cbd5e1",
            accent: "#3b82f6",
            border: "#1e40af",
            prompt: "#60a5fa",
            success: "#22c55e",
            error: "#ef4444",
            warning: "#f59e0b",
        },
        locked: true,
    },
    {
        id: "matrix-terminal",
        name: "Matrix Green",
        colors: {
            background: "#000000",
            text: "#00ff00",
            accent: "#00ff00",
            border: "#008800",
            prompt: "#00ff00",
            success: "#00ff00",
            error: "#ff0000",
            warning: "#ffff00",
        },
        locked: true,
    },
    {
        id: "golden-terminal",
        name: "Golden Luxury",
        colors: {
            background: "#1a1410",
            text: "#fbbf24",
            accent: "#f59e0b",
            border: "#d97706",
            prompt: "#f59e0b",
            success: "#22c55e",
            error: "#ef4444",
            warning: "#f59e0b",
        },
        locked: true,
    },
];

interface TerminalThemeContextType {
    currentTheme: TerminalTheme;
    availableThemes: TerminalTheme[];
    setTheme: (themeId: string) => void;
    isThemeUnlocked: (themeId: string) => boolean;
}

const TerminalThemeContext = createContext<TerminalThemeContextType | undefined>(undefined);

interface TerminalThemeProviderProps {
    children: ReactNode;
    purchasedItems: string[];
}

export function TerminalThemeProvider({ children, purchasedItems }: TerminalThemeProviderProps) {
    const [currentThemeId, setCurrentThemeId] = useState<string>("default");

    // Load saved theme from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("terminal-theme");
            if (savedTheme) {
                setCurrentThemeId(savedTheme);
            }
        }
    }, []);

    // Save theme to localStorage when it changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("terminal-theme", currentThemeId);
        }
    }, [currentThemeId]);

    const isThemeUnlocked = (themeId: string): boolean => {
        if (themeId === "default") return true;
        return purchasedItems.includes(themeId);
    };

    const setTheme = (themeId: string) => {
        if (isThemeUnlocked(themeId)) {
            setCurrentThemeId(themeId);
        }
    };

    const currentTheme = TERMINAL_THEMES.find(theme => theme.id === currentThemeId) ?? TERMINAL_THEMES[0]!;

    const value = {
        currentTheme,
        availableThemes: TERMINAL_THEMES,
        setTheme,
        isThemeUnlocked,
    };

    return <TerminalThemeContext.Provider value={value}>{children}</TerminalThemeContext.Provider>;
}

export function useTerminalTheme() {
    const context = useContext(TerminalThemeContext);
    if (context === undefined) {
        throw new Error("useTerminalTheme must be used within a TerminalThemeProvider");
    }
    return context;
}
