"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { Save } from "lucide-react";
import { CodeField } from "./editor/CodeField";

interface FileEditorProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string;
    initialContent?: string;
}

export function FileEditor({ isOpen, onClose, fileName, initialContent = "" }: FileEditorProps) {
    const { handleFileEdit } = useGameContext();
    const { t } = useLanguage();
    const [content, setContent] = useState(initialContent);
    const [isDirty, setIsDirty] = useState(false);

    // Reset content when the file or mode changes - with useCallback for performance
    useEffect(() => {
        setContent(initialContent);
        setIsDirty(false);
    }, [initialContent, fileName]);

    // Memoize handlers for better performance
    const handleSave = useCallback(() => {
        if (isDirty) {
            handleFileEdit(fileName, content);
        }
        onClose();
    }, [isDirty, fileName, content, handleFileEdit, onClose]);

    const handleContentChange = useCallback((next: string) => {
        setContent(next);
        setIsDirty(true);
    }, []);

    const handleCancel = useCallback(() => {
        if (isDirty && !window.confirm(t("editor.unsavedChanges"))) {
            return;
        }
        onClose();
    }, [isDirty, onClose, t]);

    // Check if device is likely mobile - memoized for performance
    const isMobileDevice = useCallback(() => {
        if (typeof window !== "undefined") {
            return (
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                window.innerWidth <= 768
            );
        }
        return false;
    }, []);

    // Handle keyboard shortcuts - memoized for performance
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            // Support Ctrl+Enter or Cmd+Enter to save
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                handleSave();
            }

            // Use Escape to cancel
            if (e.key === "Escape") {
                e.preventDefault();
                handleCancel();
            }
        },
        [handleSave, handleCancel],
    );

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="h-[88svh] sm:max-w-4xl" onKeyDown={handleKeyDown}>
                <DialogHeader className="shrink-0">
                    <DialogTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
                        <span className="font-code min-w-0 truncate" title={fileName}>
                            {fileName}
                        </span>
                        {isDirty && (
                            <span className="gm-chip border-gm-coral-edge text-gm-coral">{t("editor.unsaved")}</span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2">
                    <p className="text-gm-ink-dim text-xs font-semibold">{t("editor.fileContent")}</p>
                    <CodeField
                        value={content}
                        onValueChange={handleContentChange}
                        fileName={fileName}
                        autoFocus={!isMobileDevice()}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <DialogFooter className="shrink-0 sm:justify-between">
                    <p className="font-code text-gm-ink-dim hidden text-xs md:block">{t("editor.escToCancel")}</p>
                    <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                        <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                            {t("editor.cancel")}
                        </Button>
                        <Button onClick={handleSave} className="w-full sm:w-auto">
                            <Save className="h-4 w-4" aria-hidden="true" />
                            {t("editor.save")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
