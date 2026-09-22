import type { ReactNode, RefObject } from "react";

export interface TerminalProps {
    className?: string;
    showHelpButton?: boolean;
    showResetButton?: boolean;
    isPlaygroundMode?: boolean;
    onResetClick?: () => void;
}

/** The runtime colours of the active (possibly purchased) terminal theme. */
export interface TerminalThemeColors {
    background: string;
    text: string;
    accent: string;
    border: string;
    prompt: string;
    success: string;
    error: string;
    warning: string;
}

export interface TerminalHeaderProps {
    path: string;
    theme: TerminalThemeColors;
    showHelpButton: boolean;
    showResetButton: boolean;
    handleShowHelp: () => void;
    handleReset: () => void;
    handleShowThemes?: () => void;
    t: (key: string) => string;
}

export interface TerminalStatusBarProps {
    path: string;
    /** Fill and ink of the branch pill, resolved against the Git legend or the active theme. */
    branchFill: string;
    branchInk: string;
    isGitInitialized: boolean;
    branch: string;
    stagedCount: number;
    modifiedCount: number;
    untrackedCount: number;
    unpushedCommitsCount: number;
    unpulledCommitsCount: number;
    theme: TerminalThemeColors;
    t: (key: string) => string;
}

export interface TerminalOutputProps {
    terminalOutput: string[];
    isLevelCompleted: boolean;
    isPlaygroundMode: boolean;
    scrollAreaRef: RefObject<HTMLDivElement | null>;
    outputContainerRef: RefObject<HTMLDivElement | null>;
    renderTerminalOutput: (line: string) => ReactNode;
    t: (key: string) => string;
}

export interface TerminalInputProps {
    input: string;
    inputRef: RefObject<HTMLInputElement | null>;
    handleFormSubmit: (e: React.FormEvent) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    commandSuggestion: string;
    showCommandSuggestion: boolean;
    showAutocomplete: boolean;
    fileAutocomplete: string[];
    selectAutocompleteOption: (file: string) => void;
    theme: TerminalThemeColors;
    t: (key: string) => string;
}

export interface HistoryState {
    commands: string[];
    index: number;
}

export interface AutocompleteState {
    fileMatches: string[];
    showMenu: boolean;
    commandSuggestion: string;
    showCommandSuggestion: boolean;
}
