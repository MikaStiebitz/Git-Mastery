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
    fileAutocomplete: CompletionItem[];
    activeCompletion: number;
    setActiveCompletion: (index: number) => void;
    completionPrefix: string;
    selectAutocompleteOption: (file: string) => void;
    theme: TerminalThemeColors;
    t: (key: string) => string;
}

export interface HistoryState {
    commands: string[];
    index: number;
}

/** What a completion candidate is, so the menu can show it as what it is. */
export type CompletionKind = "file" | "directory" | "branch";

export interface CompletionItem {
    value: string;
    kind: CompletionKind;
}

export interface AutocompleteState {
    fileMatches: CompletionItem[];
    showMenu: boolean;
    commandSuggestion: string;
    showCommandSuggestion: boolean;
    /**
     * The longest prefix every candidate shares, when it is longer than what has been typed.
     *
     * This is what a real shell inserts on the first Tab before it shows you anything: with
     * `src/a` and `src/b` present, Tab gets you to `src/` and only then offers the choice. Without
     * it the first Tab dumps the whole directory, which is the behaviour being complained about.
     */
    commonPrefix?: string;
    /** What was typed so far for the argument being completed — used to highlight the match. */
    typedPrefix: string;
}
