"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { FileEditor } from "~/components/FileEditor";
import { ProgressBar } from "~/components/ProgressBar";
import { RequirementChecklist } from "~/components/RequirementChecklist";
import { useGameContext } from "~/contexts/GameContext";
import { type LevelType } from "~/types";
import { highlightGitCommands } from "~/lib/textHighlighting";
import {
    HelpCircleIcon,
    ArrowRightIcon,
    AlertTriangle,
    Shield,
    BookOpen,
    Code,
    Pencil,
    Trash2,
    ChevronDown,
    ChevronRight,
    FileIcon,
    Folder,
    GitGraph as GitGraphIcon,
} from "lucide-react";
import { PageLayout } from "~/components/layout/PageLayout";
import { ClientOnly } from "~/components/ClientOnly";
import { useLanguage } from "~/contexts/LanguageContext";
import { StoryDialog } from "~/components/StoryDialog";
import { GitMascot } from "~/components/GitMascot";
import { LevelVisualizer } from "~/components/LevelVisualizer";
import dynamic from "next/dynamic";
import { TerminalSkeleton } from "~/components/ui/TerminalSkeleton";
import { CommitDialog } from "~/components/CommitDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { RotateCcw } from "lucide-react";
import { getDifficultyConfigForStage } from "~/config/difficulties";

// Dynamically import Terminal component with SSR disabled
const Terminal = dynamic(() => import("~/components/Terminal").then(mod => ({ default: mod.Terminal })), {
    ssr: false,
    loading: () => <TerminalSkeleton className="h-[580px]" />,
});

// File tree node type definition
interface FileTreeNode {
    name: string;
    path: string;
    isDirectory: boolean;
    children: Record<string, FileTreeNode>;
}

function LevelPageContent() {
    const {
        currentStage,
        currentLevel,
        isLevelCompleted,
        handleNextLevel,
        levelManager,
        progressManager,
        gitRepository,
        isFileEditorOpen,
        setIsFileEditorOpen,
        isAdvancedMode,
        toggleAdvancedMode,
        getEditableFiles,
        handleCommand,
        currentFile,
        openFileEditor,
        syncURLWithCurrentLevel,
        handleLevelFromUrl,
        shouldShowStoryDialog,
        setShouldShowStoryDialog,
        resetCurrentLevel,
        resetAllProgress,
    } = useGameContext();

    const searchParams = useSearchParams();

    const levelParamProcessedRef = useRef(false);
    const { t } = useLanguage();
    const [showHints, setShowHints] = useState(false);
    const [editableFiles, setEditableFiles] = useState<Array<{ name: string; path: string }>>([]);
    const [showStoryDialog, setShowStoryDialog] = useState(false);
    const [userClosedStoryDialog, setUserClosedStoryDialog] = useState(false);
    const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [activePanel, setActivePanel] = useState<"challenge" | "graph">("challenge");

    // Helper function to convert flat file list to tree structure
    const getFileTree = (files: Array<{ name: string; path: string }>): FileTreeNode => {
        const root: FileTreeNode = {
            name: "/",
            path: "/",
            isDirectory: true,
            children: {},
        };

        // Sort files to ensure parent directories are processed before their children
        const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

        for (const file of sortedFiles) {
            // Split path into segments
            const segments = file.path.split("/").filter(Boolean);

            if (segments.length === 0) continue; // Skip root

            const fileName = segments.pop() ?? "";

            // Navigate to the correct directory
            let currentDir = root;
            for (const segment of segments) {
                // Create directory if it doesn't exist
                if (!currentDir.children[segment]) {
                    currentDir.children[segment] = {
                        name: segment,
                        path: `${currentDir.path === "/" ? "" : currentDir.path}/${segment}`,
                        isDirectory: true,
                        children: {},
                    };
                }
                currentDir = currentDir.children[segment]!;
            }

            // Add file to the directory
            currentDir.children[fileName] = {
                name: fileName,
                path: file.path,
                isDirectory: false,
                children: {},
            };
        }

        return root;
    };

    // Recursive component to render a file tree item
    const FileTreeItem = ({
        item,
        level = 0,
        onEditFile,
        onDeleteFile,
    }: {
        item: FileTreeNode;
        level?: number;
        onEditFile: (path: string) => void;
        onDeleteFile: (path: string, name: string) => void;
    }) => {
        const [isOpen, setIsOpen] = useState(level === 0); // Root is open by default

        if (item.isDirectory) {
            // Directory
            const hasChildren = Object.keys(item.children).length > 0;

            return (
                <div className="mb-1">
                    <button
                        type="button"
                        aria-expanded={isOpen}
                        className="text-gm-ink-soft hover:bg-gm-deep hover:text-gm-ink focus-visible:outline-gm-cyan active:bg-gm-deep flex min-h-11 w-full cursor-pointer items-center gap-1.5 rounded-[0.7rem] px-2 text-start [font-family:var(--font-code)] text-sm transition-colors duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-3 focus-visible:outline-offset-2"
                        onClick={() => setIsOpen(!isOpen)}>
                        <span className="text-gm-grape-hi" aria-hidden="true">
                            {isOpen ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                                <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                            )}
                        </span>
                        <Folder className="text-gm-grape-hi h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.name === "/" ? "root" : item.name}</span>
                    </button>

                    {isOpen && hasChildren && (
                        <div className="border-gm-line ms-4 border-s ps-2">
                            {Object.values(item.children)
                                .sort((a, b) => {
                                    // Directories first, then files
                                    if (a.isDirectory && !b.isDirectory) return -1;
                                    if (!a.isDirectory && b.isDirectory) return 1;
                                    return a.name.localeCompare(b.name);
                                })
                                .map(child => (
                                    <FileTreeItem
                                        key={child.path}
                                        item={child}
                                        level={level + 1}
                                        onEditFile={onEditFile}
                                        onDeleteFile={onDeleteFile}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            );
        } else {
            // File
            return (
                <div className="mb-1 flex min-h-11 items-center justify-between gap-2 rounded-[0.7rem] px-2">
                    <div
                        className="text-gm-ink-soft flex min-w-0 items-center gap-1.5 text-start [font-family:var(--font-code)] text-sm"
                        title={item.path}>
                        <FileIcon className="text-gm-ink-dim h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.name}</span>
                    </div>
                    <div className="flex shrink-0 items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditFile(item.path)}
                            title={t("level.editFile")}
                            aria-label={t("level.editFile")}>
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-gm-coral"
                            onClick={() => onDeleteFile(item.path, item.name)}
                            title={t("level.deleteFile")}
                            aria-label={t("level.deleteFile")}>
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            );
        }
    };

    // Handle URL query parameters for level selection - HIGHEST PRIORITY
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stageParam = searchParams.get("stage");
            const levelParam = searchParams.get("level");

            if (stageParam && levelParam) {
                const levelNum = parseInt(levelParam);
                if (!isNaN(levelNum)) {
                    // Check if level exists
                    const levelExists = levelManager.getLevel(stageParam, levelNum);
                    if (levelExists) {
                        // Always call handleLevelFromUrl to ensure terminal is correctly initialized
                        // The function already checks if an update is needed internally
                        console.log(`Loading level from URL: ${stageParam}-${levelNum}`);
                        handleLevelFromUrl(stageParam, levelNum);
                        setUrlParamsProcessed(true);
                        levelParamProcessedRef.current = true;
                    }
                }
            } else {
                // No URL params, load from localStorage and sync URL
                console.log("No URL params found, loading from localStorage");
                const progress = progressManager.getProgress();
                if (progress.currentStage && progress.currentLevel) {
                    // Always call to ensure terminal is correctly initialized
                    handleLevelFromUrl(progress.currentStage, progress.currentLevel);
                }
                setUrlParamsProcessed(true);
                // Sync URL to match current state
                syncURLWithCurrentLevel();
            }
        }
    }, [searchParams, levelManager, handleLevelFromUrl, progressManager, syncURLWithCurrentLevel]);

    // Sync URL after level changes (including next level)
    useEffect(() => {
        // Always sync URL when stage or level changes, but only after URL params are processed
        if (urlParamsProcessed) {
            console.log(`Syncing URL: ${currentStage}-${currentLevel}`);
            syncURLWithCurrentLevel();
        }
    }, [currentStage, currentLevel, syncURLWithCurrentLevel, urlParamsProcessed]);

    // Get the current level data with translation
    const levelData: LevelType | null = levelManager.getLevel(currentStage, currentLevel, t);
    const progress = progressManager.getProgress();

    // Stage label for the level header. getStage without a translate function hands back the
    // raw stage, so only the one name key is translated instead of the whole stage tree.
    const stageNameKey = levelManager.getStage(currentStage)?.name;
    const stageName = stageNameKey ? t(stageNameKey) : currentStage;

    // Max points for the difficulty the current stage belongs to
    const currentDifficultyMaxPoints = getDifficultyConfigForStage(currentStage)?.maxPoints ?? 150;

    // Get double XP info
    const isDoubleXpActive = progressManager.isDoubleXpActive();
    const doubleXpHoursLeft = progressManager.getDoubleXpRemainingHours();

    // Reset URL params state when the component unmounts
    useEffect(() => {
        return () => {
            setUrlParamsProcessed(false);
            levelParamProcessedRef.current = false;
        };
    }, []);

    // Update editable files when terminal output changes (indicator of file system changes)
    const updateEditableFiles = useCallback(() => {
        setEditableFiles(getEditableFiles());
    }, [getEditableFiles]);

    useEffect(() => {
        updateEditableFiles();
    }, [updateEditableFiles]);

    // Handle next level navigation and reset story dialog state
    const handleNextLevelWithStory = () => {
        // Call handleNextLevel and check if there's actually a next level
        const nextLevelInfo = handleNextLevel();

        // Only show story dialog if there's actually a next level (not redirecting to home)
        if (nextLevelInfo && nextLevelInfo.stageId && typeof nextLevelInfo.levelId === "number") {
            // Reset the story dialog state when navigating to a new level
            setUserClosedStoryDialog(false);
            if (!isAdvancedMode) {
                setShowStoryDialog(true);
            }
        }
        // If nextLevelInfo is null or undefined, it means difficulty is completed and redirect is happening
    };

    // Story dialog display logic - Reset when levels change or triggered by GameContext
    useEffect(() => {
        if (levelData?.story) {
            if (!userClosedStoryDialog || shouldShowStoryDialog) {
                if (!isAdvancedMode) {
                    setShowStoryDialog(true);
                } else {
                    setShowStoryDialog(false);
                }

                // Reset the trigger flag
                if (shouldShowStoryDialog) {
                    setShouldShowStoryDialog(false);
                }
            }
        } else {
            setShowStoryDialog(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStage, currentLevel, levelData, isAdvancedMode, userClosedStoryDialog, shouldShowStoryDialog]);

    const handleCloseStoryDialog = () => {
        setShowStoryDialog(false);
        setUserClosedStoryDialog(true);
    };

    // Show a list of user-editable files as a hierarchical tree
    const renderEditableFiles = () => {
        const isGitInitialized = gitRepository.isInitialized();

        if (editableFiles.length === 0) {
            return (
                <div className="mt-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-gm-ink text-sm font-semibold sm:text-base">{t("level.filesToEdit")}</h3>
                        {!isGitInitialized && (
                            <span className="text-gm-coral flex items-center gap-1.5 text-xs font-semibold">
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                {t("level.gitNotInitialized")}
                            </span>
                        )}
                    </div>
                    <p className="text-gm-ink-dim text-sm">No editable files found.</p>
                </div>
            );
        }

        // Create file tree structure for hierarchical view
        const fileTree = getFileTree(editableFiles);

        const handleEditFile = (path: string) => {
            openFileEditor(path);
        };

        const handleDeleteFile = (path: string, name: string) => {
            if (window.confirm(t("level.confirmDelete").replace("{file}", name))) {
                handleCommand(`rm ${path}`, false);
                updateEditableFiles();
            }
        };

        return (
            <div className="mt-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-gm-ink text-sm font-semibold sm:text-base">{t("level.filesToEdit")}</h3>
                    {!isGitInitialized && (
                        <span className="text-gm-coral flex items-center gap-1.5 text-xs font-semibold">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {t("level.gitNotInitialized")}
                        </span>
                    )}
                </div>
                <div className="gm-inset p-2 sm:p-3">
                    <FileTreeItem item={fileTree} onEditFile={handleEditFile} onDeleteFile={handleDeleteFile} />
                </div>
            </div>
        );
    };

    // Render the current level's challenge details
    const renderLevelChallenge = () => {
        if (!levelData) {
            return <div className="text-gm-ink-soft">{t("level.notFound")}</div>;
        }

        return (
            <ClientOnly>
                <div className="space-y-6">
                    {/* Header Section — the level title itself lives in the page header above */}
                    <p className="text-gm-ink-soft max-w-[52ch] text-sm leading-relaxed [text-wrap:pretty] sm:text-base">
                        {levelData.description}
                    </p>

                    {/* Objectives Section */}
                    <div className="space-y-3">
                        <h3 className="text-gm-ink text-sm font-semibold sm:text-base">{t("level.objectives")}</h3>
                        <RequirementChecklist
                            items={levelData.objectives.map((objective, index) => {
                                const objectiveNumber = index + 1;
                                const hasObjectiveIds = levelData.requirements.some(
                                    req => req.objectiveId !== undefined,
                                );
                                const isCompleted = hasObjectiveIds
                                    ? levelData.completedObjectives?.includes(objectiveNumber) || false
                                    : levelData.requirements[index]?.id
                                      ? levelData.completedRequirements?.includes(levelData.requirements[index]!.id!) ||
                                        false
                                      : false;

                                return { label: objective, completed: isCompleted };
                            })}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowHints(!showHints)}
                            aria-expanded={showHints}
                            className="flex-1 sm:min-w-[10rem]">
                            <HelpCircleIcon className="h-4 w-4" aria-hidden="true" />
                            <span className="truncate">{showHints ? t("level.hideHints") : t("level.showHints")}</span>
                        </Button>

                        {levelData?.story && (
                            <Button
                                variant="outline"
                                onClick={() => setShowStoryDialog(true)}
                                className="flex-1 sm:min-w-[10rem]">
                                <BookOpen className="h-4 w-4" aria-hidden="true" />
                                <span className="truncate">{t("level.storyButton")}</span>
                            </Button>
                        )}

                        {isLevelCompleted && (
                            <Button onClick={handleNextLevelWithStory} className="flex-1 sm:min-w-[10rem]">
                                <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                                <span className="truncate">{t("level.nextLevel")}</span>
                            </Button>
                        )}
                    </div>

                    {/* Hints Section */}
                    {showHints && (
                        <div className="gm-inset mt-1 p-3">
                            <h3 className="text-gm-ink mb-2 flex items-center gap-2 text-sm font-semibold">
                                <HelpCircleIcon className="text-gm-grape-hi h-4 w-4" aria-hidden="true" />
                                {t("level.hints")}
                            </h3>
                            <ul className="text-gm-ink-soft space-y-2 text-sm">
                                {levelData.hints.map((hint, index) => (
                                    <li key={index} className="flex items-baseline gap-2">
                                        <span className="text-gm-grape-hi flex-shrink-0" aria-hidden="true">
                                            •
                                        </span>
                                        <span>{highlightGitCommands(hint)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {renderEditableFiles()}
                </div>
            </ClientOnly>
        );
    };

    return (
        <PageLayout showLevelInfo>
            <div className="container mx-auto p-3 sm:p-4">
                {/* Level header: mono metadata for the stage/level coordinates, display face
                        for the level title itself. */}
                <ClientOnly fallback={<div className="mb-4 h-14 sm:mb-6 sm:h-16" />}>
                    <header className="mb-4 sm:mb-6">
                        <p className="text-gm-ink-dim [font-family:var(--font-code)] text-xs sm:text-sm">
                            {t("level.level")} {currentLevel} · {stageName}
                        </p>
                        <h1 className="font-display text-gm-ink mt-1 text-2xl leading-[1.05] [text-wrap:balance] [overflow-wrap:anywhere] sm:text-3xl sm:[overflow-wrap:normal]">
                            {levelData?.name ?? t("level.notFound")}
                        </h1>
                    </header>
                </ClientOnly>
                <ProgressBar
                    score={progress.score}
                    coins={progress.coins}
                    maxScore={currentDifficultyMaxPoints}
                    isDoubleXpActive={isDoubleXpActive}
                    doubleXpHoursLeft={doubleXpHoursLeft}
                    className="mb-4 sm:mb-6"
                />

                {/* Mobile-optimized layout: Stack vertically on mobile, side-by-side on desktop */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
                    {/* Challenge Card - Always show first on mobile for context */}
                    <Card className="order-1 flex min-w-0 flex-col overflow-hidden lg:order-2 lg:h-[580px]">
                        <CardHeader className="shrink-0 p-3 pb-3 sm:p-5 sm:pb-4">
                            <div className="flex items-center justify-between gap-2">
                                {/* Tab switcher: Challenge ⟷ Visual Git Graph */}
                                <div
                                    role="tablist"
                                    aria-label={t("level.currentChallenge")}
                                    className="gm-inset flex min-w-0 items-center gap-1 p-1">
                                    <button
                                        type="button"
                                        role="tab"
                                        id="level-tab-challenge"
                                        aria-selected={activePanel === "challenge"}
                                        aria-controls="level-panel-challenge"
                                        onClick={() => setActivePanel("challenge")}
                                        className={`focus-visible:outline-gm-cyan flex min-h-11 min-w-0 cursor-pointer items-center gap-1.5 rounded-[0.7rem] px-2.5 text-sm font-semibold transition-colors duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-3 focus-visible:outline-offset-2 sm:px-3 ${
                                            activePanel === "challenge"
                                                ? "bg-gm-grape text-gm-ink"
                                                : "text-gm-ink-dim hover:bg-gm-deep hover:text-gm-ink active:bg-gm-deep"
                                        }`}>
                                        <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        <span className="truncate">{t("level.tab.challenge")}</span>
                                    </button>
                                    <button
                                        type="button"
                                        role="tab"
                                        id="level-tab-graph"
                                        aria-selected={activePanel === "graph"}
                                        aria-controls="level-panel-graph"
                                        onClick={() => setActivePanel("graph")}
                                        className={`focus-visible:outline-gm-cyan flex min-h-11 min-w-0 cursor-pointer items-center gap-1.5 rounded-[0.7rem] px-2.5 text-sm font-semibold transition-colors duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-3 focus-visible:outline-offset-2 sm:px-3 ${
                                            activePanel === "graph"
                                                ? "bg-gm-grape text-gm-ink"
                                                : "text-gm-ink-dim hover:bg-gm-deep hover:text-gm-ink active:bg-gm-deep"
                                        }`}>
                                        <GitGraphIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        <span className="truncate">{t("level.tab.graph")}</span>
                                    </button>
                                </div>
                                {/* Mode Toggle in top right corner */}
                                <div className="group relative shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleAdvancedMode}
                                        aria-pressed={isAdvancedMode}
                                        aria-label={isAdvancedMode ? t("level.techModeOn") : t("level.storyModeOn")}
                                        className={
                                            isAdvancedMode ? "bg-gm-grape text-gm-ink hover:bg-gm-grape" : undefined
                                        }>
                                        {isAdvancedMode ? (
                                            <Code className="h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            <BookOpen className="h-4 w-4" aria-hidden="true" />
                                        )}
                                    </Button>
                                    {/* Hover/focus hint, hidden from screen readers because the
                                            button already carries the same text as its label. */}
                                    <div
                                        aria-hidden="true"
                                        className="border-gm-line bg-gm-deep text-gm-ink absolute end-0 top-full z-(--z-tooltip) mt-2 hidden w-max max-w-[14rem] rounded-[0.85rem] border-2 px-3 py-2 text-xs font-semibold group-focus-within:block group-hover:block">
                                        {isAdvancedMode ? t("level.techModeOn") : t("level.storyModeOn")}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent
                            className={`min-h-0 flex-grow p-3 pt-0 sm:p-5 sm:pt-0 ${
                                activePanel === "graph" ? "flex flex-col overflow-hidden" : "gm-scroll overflow-auto"
                            }`}>
                            {activePanel === "challenge" ? (
                                <div role="tabpanel" id="level-panel-challenge" aria-labelledby="level-tab-challenge">
                                    {renderLevelChallenge()}
                                </div>
                            ) : (
                                <div
                                    role="tabpanel"
                                    id="level-panel-graph"
                                    aria-labelledby="level-tab-graph"
                                    className="flex min-h-0 flex-1 flex-col">
                                    <ClientOnly>
                                        <LevelVisualizer className="min-h-[320px]" />
                                    </ClientOnly>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Terminal - Second on mobile, optimized height */}
                    {urlParamsProcessed ? (
                        <Terminal
                            className="order-2 h-[450px] min-w-0 sm:h-[500px] lg:order-1 lg:h-[580px]"
                            onResetClick={() => setShowResetModal(true)}
                        />
                    ) : (
                        <TerminalSkeleton className="order-2 h-[450px] min-w-0 sm:h-[500px] lg:order-1 lg:h-[580px]" />
                    )}
                </div>

                <FileEditor
                    isOpen={isFileEditorOpen}
                    onClose={() => setIsFileEditorOpen(false)}
                    fileName={currentFile.name}
                    initialContent={currentFile.content}
                />

                <CommitDialog />

                {/* Git Mascot - only show if purchased */}
                <ClientOnly>
                    <GitMascot
                        isActive={progressManager.getPurchasedItems().includes("git-mascot")}
                        onEncouragement={() => {
                            // Could add sound effects here later
                            console.log("Mascot is encouraging the player!");
                        }}
                    />
                </ClientOnly>
            </div>
            {levelData?.story && (
                <StoryDialog
                    isOpen={showStoryDialog}
                    onClose={handleCloseStoryDialog}
                    story={levelData.story}
                    isAdvancedMode={isAdvancedMode}
                    onToggleAdvancedMode={toggleAdvancedMode}
                />
            )}

            {/* Reset Modal */}
            <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("level.resetOptions")}</DialogTitle>
                        <DialogDescription>{t("level.resetDescription")}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-5 space-y-3">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                resetCurrentLevel();
                                setShowResetModal(false);
                            }}>
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            <span className="truncate">{t("level.resetLevel")}</span>
                        </Button>
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => {
                                if (window.confirm(t("level.resetAllConfirm"))) {
                                    resetAllProgress();
                                    setShowResetModal(false);
                                }
                            }}>
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            <span className="truncate">{t("level.resetAllProgress")}</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}

export default function LevelPage() {
    return (
        <Suspense fallback={<TerminalSkeleton className="h-[580px]" />}>
            <LevelPageContent />
        </Suspense>
    );
}
