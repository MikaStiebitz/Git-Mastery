import type React from "react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { cn } from "~/lib/utils";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { useTerminalTheme } from "~/contexts/TerminalThemeContext";
import { TerminalHeader } from "./models/Header";
import { TerminalOutput } from "./models/Output";
import { TerminalInput } from "./models/Input";
import { TerminalStatusBar } from "./models/StatusBar";
import { TerminalThemeSwitcher } from "../TerminalThemeSwitcher";
import { CommandService } from "./services/Command";
import { HistoryService } from "./services/History";
import { AutocompleteService } from "./services/Autocomplete";
import { OutputFormatterService } from "./services/OutputFormatter";
import type { TerminalProps } from "./types";

export function Terminal({
    className,
    showHelpButton = true,
    showResetButton = true,
    isPlaygroundMode = false,
    onResetClick,
}: TerminalProps) {
    const {
        terminalOutput,
        handleCommand,
        resetCurrentLevel,
        commandProcessor,
        fileSystem,
        gitRepository,
        currentStage,
        currentLevel,
        isLevelCompleted,
        openFileEditor,
        openCommitDialog,
    } = useGameContext();

    const { t } = useLanguage();

    // Initialize OOP service classes - use useMemo to maintain instances across renders
    const commandService = useMemo(
        () => new CommandService(handleCommand, isPlaygroundMode, isLevelCompleted, openFileEditor, openCommitDialog),
        [handleCommand, isPlaygroundMode, isLevelCompleted, openFileEditor, openCommitDialog],
    );

    const historyService = useMemo(() => new HistoryService(), []);

    const autocompleteService = useMemo(
        () => new AutocompleteService(commandProcessor, fileSystem, gitRepository),
        [commandProcessor, fileSystem, gitRepository],
    );

    const outputFormatter = useMemo(() => new OutputFormatterService(terminalOutput), [terminalOutput]);
    const { currentTheme } = useTerminalTheme();

    // Terminal state
    const [input, setInput] = useState("");
    const [fileAutocomplete, setFileAutocomplete] = useState<string[]>([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [commandSuggestion, setCommandSuggestion] = useState<string>("");
    const [showCommandSuggestion, setShowCommandSuggestion] = useState<boolean>(false);
    const [showThemeDialog, setShowThemeDialog] = useState(false);

    // References for DOM manipulation
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when terminal output changes
    useEffect(() => {
        if (scrollAreaRef.current) {
            // For Radix UI ScrollArea, we need to find the viewport element
            const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");

            if (viewport) {
                // Use requestAnimationFrame to ensure this happens after all DOM updates
                requestAnimationFrame(() => {
                    viewport.scrollTop = viewport.scrollHeight;
                });
            }
        }
    }, [terminalOutput]);

    // Also auto-scroll when form is submitted (command entered)
    const scrollToBottom = useCallback(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
            if (viewport) {
                // Use a small delay to ensure the new content is rendered
                setTimeout(() => {
                    viewport.scrollTop = viewport.scrollHeight;
                }, 10);
            }
        }
    }, []);

    // Focus input field on mount (not on mobile devices)
    useEffect(() => {
        if (inputRef.current && !isMobileDevice()) {
            inputRef.current.focus();
        }
    }, []);

    // Check if device is likely mobile
    const isMobileDevice = () => {
        if (typeof window !== "undefined") {
            return (
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                window.innerWidth <= 768
            );
        }
        return false;
    };

    // Handle form submission (user presses Enter)
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Close the autocomplete menu
        setShowAutocomplete(false);
        setShowCommandSuggestion(false);

        // Execute command via service
        commandService.executeCommand(input);

        // Add to command history
        historyService.addToHistory(input);

        // Clear input
        setInput("");

        // Trigger auto-scroll
        scrollToBottom();
    };

    // Handle input changes and update command suggestions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInput(newValue);

        // Get command suggestion if applicable
        const suggestion = autocompleteService.getCommandSuggestion(newValue);
        setCommandSuggestion(suggestion ?? "");
        setShowCommandSuggestion(!!suggestion);

        // Hide file autocomplete when typing
        setShowAutocomplete(false);
    };

    // Process Tab-autocomplete for files
    const handleTabAutocomplete = () => {
        const result = autocompleteService.processTabAutocomplete(input);

        if (result.fileMatches.length === 1) {
            // If there's only one match, complete it directly
            setInput(autocompleteService.generateCompletedCommand(input, result.fileMatches[0] ?? ""));
            setShowAutocomplete(false);
        } else if (result.fileMatches.length > 1) {
            // If there are multiple matches, show the autocomplete menu
            setFileAutocomplete(result.fileMatches);
            setShowAutocomplete(true);
        }

        // Update command suggestions
        setCommandSuggestion(result.commandSuggestion);
        setShowCommandSuggestion(result.showCommandSuggestion);
    };

    // Select a suggestion from the autocomplete menu
    const selectAutocompleteOption = (file: string) => {
        setInput(autocompleteService.generateCompletedCommand(input, file));
        setShowAutocomplete(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Handle keyboard shortcuts and navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Handle command history navigation with up/down arrows
        if (e.key === "ArrowUp") {
            e.preventDefault();
            const historyState = historyService.navigateUp();
            if (historyState.index >= 0 && historyState.commands[historyState.index]) {
                setInput(historyState.commands[historyState.index] ?? "");
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const historyState = historyService.navigateDown();
            if (historyState.index >= 0 && historyState.commands[historyState.index]) {
                setInput(historyState.commands[historyState.index] ?? "");
            } else {
                setInput("");
            }
        } else if (e.key === "Tab") {
            e.preventDefault();

            // If we have a command suggestion, use it
            if (showCommandSuggestion && commandSuggestion) {
                setInput(commandSuggestion);
                setShowCommandSuggestion(false);
                return;
            }

            // Otherwise, try file autocomplete
            handleTabAutocomplete();
        } else if (e.key === "Escape") {
            // Escape key closes all popups
            setShowAutocomplete(false);
            setShowCommandSuggestion(false);
        }
    };

    // Handle help button click
    const handleShowHelp = () => {
        handleCommand("help", isPlaygroundMode);
    };

    // Handle theme button click
    const handleShowThemes = () => {
        setShowThemeDialog(true);
    };

    // Handle reset button click with confirmation
    const handleReset = () => {
        if (onResetClick) {
            onResetClick();
        } else {
            if (window.confirm(t("level.resetConfirm"))) {
                resetCurrentLevel();
            }
        }
    };

    // Everything the status bar needs: where we are, which branch, what is pending.
    const gitStatus = useMemo(() => {
        const currentDir = commandProcessor.getCurrentDirectory();
        const isInRepository = gitRepository.isInitialized() && gitRepository.isInRepository(currentDir);
        const status = isInRepository ? gitRepository.getStatus() : {};
        const values = Object.values(status);

        return {
            path: currentDir === "/" ? "~/" : `~${currentDir}`,
            isGitInitialized: isInRepository,
            branch: isInRepository ? gitRepository.getCurrentBranch() : "",
            stagedCount: values.filter(s => s === "staged").length,
            modifiedCount: values.filter(s => s === "modified").length,
            untrackedCount: values.filter(s => s === "untracked").length,
            unpushedCommitsCount: isInRepository ? gitRepository.getUnpushedCommitCount() : 0,
            unpulledCommitsCount: isInRepository ? gitRepository.getUnpulledCommitCount() : 0,
        };
        // terminalOutput is the signal that a command ran and the repository may have moved on.
    }, [commandProcessor, gitRepository, terminalOutput]);

    // The branch pill keeps the Git legend on the default theme (grape is `main`, cyan is any
    // other line of history) and hands the choice to a purchased theme, which owns its own
    // palette. Both pairings are checked for contrast, not assumed.
    const branchPill = useMemo(() => {
        const isMain = /^(main|master|trunk)$/i.test(gitStatus.branch);
        if (currentTheme.id !== "default") {
            return { fill: currentTheme.colors.accent, ink: currentTheme.colors.background };
        }
        return isMain
            ? { fill: "var(--color-gm-grape)", ink: "var(--color-gm-ink)" }
            : { fill: "var(--color-gm-cyan)", ink: "var(--color-gm-void)" };
    }, [gitStatus.branch, currentTheme]);

    // The title bar shows the session you are in, the way a real shell shows its cwd.
    const sessionPath = isPlaygroundMode ? "~/playground" : `~/${currentStage.toLowerCase()}/level-${currentLevel}`;

    return (
        <>
            <div
                className={cn(
                    "gm-panel gm-term-frame flex w-full min-w-0 flex-col overflow-hidden shadow-[0_6px_0_var(--color-gm-line)]",
                    className,
                    // A purchased theme's material: bezel, glow, and the travelling highlight on
                    // gold. It comes last among the theme classes so its box-shadow beats the
                    // panel's flat drop edge above.
                    currentTheme.frameClass,
                    // Last, so a legacy `rounded-md` from a call site can't undo the panel shape.
                    "rounded-[1.4rem]",
                )}
                style={
                    {
                        // The purchasable themes stay in charge of the terminal body: the panel
                        // utility only supplies the shape, these three win over it.
                        backgroundColor: currentTheme.colors.background,
                        borderColor: currentTheme.colors.border,
                        color: currentTheme.colors.text,
                        // Output lines are coloured by role, not by token, so a bought theme
                        // actually repaints what the terminal prints — not just its frame.
                        "--term-bg": currentTheme.colors.background,
                        "--term-text": currentTheme.colors.text,
                        "--term-accent": currentTheme.colors.accent,
                        "--term-prompt": currentTheme.colors.prompt,
                        "--term-success": currentTheme.colors.success,
                        "--term-error": currentTheme.colors.error,
                        "--term-warning": currentTheme.colors.warning,
                    } as React.CSSProperties
                }>
                {/* The material layer. Out of flow and paint-contained, so the bezel and its
                    travelling highlight can never repaint the output above them. Only themes that
                    define a material render it. */}
                {currentTheme.frameClass && (
                    <span className="gm-term-fx" aria-hidden="true">
                        <span className="gm-term-fx__ring">
                            <span className="gm-term-fx__sweep" />
                        </span>
                    </span>
                )}

                <TerminalHeader
                    path={sessionPath}
                    theme={currentTheme.colors}
                    showHelpButton={showHelpButton}
                    showResetButton={showResetButton && !isPlaygroundMode}
                    handleShowHelp={handleShowHelp}
                    handleReset={handleReset}
                    handleShowThemes={handleShowThemes}
                    t={t}
                />

                <TerminalOutput
                    terminalOutput={terminalOutput}
                    isLevelCompleted={isLevelCompleted}
                    isPlaygroundMode={isPlaygroundMode}
                    scrollAreaRef={scrollAreaRef}
                    outputContainerRef={outputContainerRef}
                    renderTerminalOutput={line => outputFormatter.renderTerminalOutput(line)}
                    t={t}
                />

                <TerminalStatusBar
                    {...gitStatus}
                    branchFill={branchPill.fill}
                    branchInk={branchPill.ink}
                    theme={currentTheme.colors}
                    t={t}
                />

                <TerminalInput
                    input={input}
                    inputRef={inputRef}
                    handleFormSubmit={handleFormSubmit}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    commandSuggestion={commandSuggestion}
                    showCommandSuggestion={showCommandSuggestion}
                    showAutocomplete={showAutocomplete}
                    fileAutocomplete={fileAutocomplete}
                    selectAutocompleteOption={selectAutocompleteOption}
                    theme={currentTheme.colors}
                    t={t}
                />
            </div>

            <TerminalThemeSwitcher isOpen={showThemeDialog} onClose={() => setShowThemeDialog(false)} />
        </>
    );
}
