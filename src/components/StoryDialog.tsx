"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { type StoryContext } from "~/types";
import { useLanguage } from "~/contexts/LanguageContext";
import { BookOpen, Code } from "lucide-react";
import { highlightGitCommands } from "~/lib/textHighlighting";
import { useEffect, useCallback } from "react";

interface StoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    story: StoryContext;
    isAdvancedMode?: boolean;
    onToggleAdvancedMode?: () => void;
}

export function StoryDialog({
    isOpen,
    onClose,
    story,
    isAdvancedMode = false,
    onToggleAdvancedMode,
}: StoryDialogProps) {
    const { t } = useLanguage();

    // This is the key change - properly handle onOpenChange to respect the Dialog control flow
    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (!open) {
                // Only call onClose when the dialog is closing
                onClose();
            }
        },
        [onClose],
    );

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only handle keyboard events when dialog is open
            if (!isOpen) return;

            // Check for Ctrl+Enter (or Cmd+Enter on Mac)
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                handleOpenChange(false);
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, handleOpenChange]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="flex max-h-[90vh] max-w-[90vw] flex-col border-purple-900/20 bg-[#1a1625] text-purple-100 md:max-h-[80vh] md:max-w-3xl">
                <DialogHeader className="flex-shrink-0 pb-2">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
                        <DialogTitle className="flex items-center text-white">
                            <BookOpen className="mr-2 h-5 w-5 text-purple-400" />
                            {story.title}
                        </DialogTitle>
                        {onToggleAdvancedMode && (
                            <Button
                                variant="outline"
                                size="sm"
                                className={`mr-6 flex items-center text-xs ${
                                    isAdvancedMode
                                        ? "border-purple-600 bg-purple-800/30 text-purple-300"
                                        : "border-purple-700 text-purple-400"
                                } mt-2 sm:mt-0`}
                                onClick={onToggleAdvancedMode}>
                                <Code className="mr-1 h-3 w-3" />
                                {isAdvancedMode ? t("level.advancedModeOn") : t("level.advancedModeOff")}
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="min-h-0 flex-grow space-y-4 overflow-y-auto py-4">
                    <div className="whitespace-pre-line text-purple-200">{highlightGitCommands(story.narrative)}</div>

                    <div className="rounded-md border border-purple-800/30 bg-purple-900/30 p-3">
                        <h3 className="mb-2 font-medium text-purple-400">{t("level.realWorldContext")}</h3>
                        <p className="text-purple-200">{highlightGitCommands(story.realWorldContext)}</p>
                    </div>

                    <div className="rounded-md border border-purple-700/50 bg-purple-900/30 p-3">
                        <h3 className="mb-2 font-medium text-purple-300">{t("level.task")}</h3>
                        <p className="text-purple-200">{highlightGitCommands(story.taskIntroduction)}</p>
                    </div>
                </div>

                <DialogFooter className="flex-shrink-0">
                    <Button
                        onClick={() => handleOpenChange(false)}
                        className="w-full bg-purple-600 text-white hover:bg-purple-700 sm:w-auto">
                        {t("level.startCoding")} <span className="ml-2 text-xs opacity-75">(Ctrl+Enter)</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
