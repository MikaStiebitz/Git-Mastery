"use client";

import { TerminalThemeProvider } from "~/contexts/TerminalThemeContext";
import { useGameContext } from "~/contexts/GameContext";
import type { ReactNode } from "react";

interface TerminalThemeWrapperProps {
    children: ReactNode;
}

export function TerminalThemeWrapper({ children }: TerminalThemeWrapperProps) {
    const { progressManager } = useGameContext();
    const purchasedItems = progressManager.getPurchasedItems();

    return <TerminalThemeProvider purchasedItems={purchasedItems}>{children}</TerminalThemeProvider>;
}
