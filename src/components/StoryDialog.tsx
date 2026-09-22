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
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <DialogTitle className="flex min-w-0 items-center gap-2 text-lg sm:text-xl">
                            <BookOpen className="text-gm-grape-hi h-5 w-5 shrink-0" aria-hidden="true" />
                            <span className="min-w-0 [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                                {story.title}
                            </span>
                        </DialogTitle>
                        {onToggleAdvancedMode && (
                            <Button
                                variant={isAdvancedMode ? "secondary" : "outline"}
                                size="sm"
                                aria-pressed={isAdvancedMode}
                                className="w-full shrink-0 sm:w-auto"
                                onClick={onToggleAdvancedMode}>
                                <Code className="h-4 w-4" aria-hidden="true" />
                                {isAdvancedMode ? t("level.advancedModeOn") : t("level.advancedModeOff")}
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    <p className="text-gm-ink-soft whitespace-pre-line">{highlightGitCommands(story.narrative)}</p>

                    <div className="gm-inset p-4">
                        <h3 className="text-gm-ink mb-2 text-sm font-bold">{t("level.realWorldContext")}</h3>
                        <p className="text-gm-ink-soft text-sm whitespace-pre-line">
                            {highlightGitCommands(story.realWorldContext)}
                        </p>
                    </div>

                    <div className="gm-inset border-gm-lime-edge p-4">
                        <h3 className="text-gm-ink mb-2 text-sm font-bold">{t("level.task")}</h3>
                        <p className="text-gm-ink-soft text-sm whitespace-pre-line">
                            {highlightGitCommands(story.taskIntroduction)}
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
                        {t("level.startCoding")}
                        <span className="font-code hidden text-xs opacity-75 sm:inline">(Ctrl+Enter)</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
