"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface TerminalTheme {
    id: string;
    name: string;
    /**
     * Class that gives this theme its material — bezel, glow, motion — defined in globals.css.
     * The default theme has none: the free terminal is the design system's own panel, and the
     * material layer is the thing a purchase actually buys.
     */
    frameClass?: string;
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
        // The default theme is the arcade design system itself, so it reads as the same
        // object as the landing page terminal. The purchasable themes below keep their own
        // literal colours untouched.
        id: "default",
        name: "Default Purple",
        colors: {
            background: "var(--color-gm-night)",
            text: "var(--color-gm-ink)",
            // Cyan, not grape-hi: grape-hi is a graphics colour and fails as terminal text.
            // Gold stays reserved for points, so "needs attention" is coral.
            accent: "var(--color-gm-cyan)",
            border: "var(--color-gm-line)",
            prompt: "var(--color-gm-lime)",
            success: "var(--color-gm-lime)",
            error: "var(--color-gm-coral)",
            warning: "var(--color-gm-coral)",
        },
    },
    // The purchased themes below follow one rule, the same one the default theme follows: the theme's
    // colour is the frame and the accents, never the body text, and success / error / warning stay
    // distinguishable from each other and from the accent.
    //
    // They used to collapse those roles onto a single literal — Matrix set text, accent, prompt and
    // success all to #00ff00, Golden set text, accent, prompt and warning to the same amber — so the
    // whole terminal came out as one flat wash and the colour coding that tells a branch from an
    // error was lost the moment you bought one. Each theme keeps its identity here; what changed is
    // that the identity lives in the accents, and long output is readable.
    {
        id: "dark-terminal",
        name: "Dark Blue",
        frameClass: "gm-term-blue",
        colors: {
            background: "#0f172a",
            text: "#cbd5e1",
            accent: "#38bdf8",
            border: "#1e3a5f",
            prompt: "#60a5fa",
            success: "#4ade80",
            error: "#f87171",
            warning: "#fbbf24",
        },
        locked: true,
    },
    {
        id: "matrix-terminal",
        name: "Matrix Green",
        frameClass: "gm-term-matrix",
        colors: {
            // Phosphor on black, but a mint body text instead of pure #00ff00, which is unreadable
            // over a screen of output. The bright phosphor stays for the prompt and accents.
            background: "#050b05",
            text: "#b8f5c0",
            accent: "#39ff7a",
            border: "#1c4a28",
            prompt: "#39ff7a",
            success: "#39ff7a",
            error: "#ff5f56",
            warning: "#ffd166",
        },
        locked: true,
    },
    {
        id: "golden-terminal",
        name: "Golden Luxury",
        frameClass: "gm-term-gold",
        colors: {
            // Gold as the accent on warm near-black, not gold as every character on screen — which
            // is both what luxury actually looks like and what keeps a long log legible.
            background: "#16120c",
            text: "#ece3d4",
            accent: "#f5c451",
            border: "#4a3a1c",
            prompt: "#f0b429",
            success: "#a3d977",
            error: "#f07167",
            warning: "#e8963c",
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
