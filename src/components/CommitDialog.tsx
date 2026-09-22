"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useLanguage } from "~/contexts/LanguageContext";
import { GitCommit, Smile } from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { getEmojiSuggestions, formatCommitWithEmoji, type EmojiSuggestion } from "~/lib/EmojiSuggestions";

export function CommitDialog() {
    const { t } = useLanguage();
    const { isCommitDialogOpen, handleCommit, closeCommitDialog, progressManager } = useGameContext();
    const [message, setMessage] = useState("");
    const [showEmojiSuggestions, setShowEmojiSuggestions] = useState(false);
    const [emojiSuggestions, setEmojiSuggestions] = useState<EmojiSuggestion[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Check if emoji commits are purchased
    const hasEmojiCommits = progressManager.getPurchasedItems().includes("emoji-commits");

    // Focus textarea when dialog opens
    useEffect(() => {
        if (isCommitDialogOpen && textareaRef.current) {
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [isCommitDialogOpen]);

    // Reset message when dialog closes
    useEffect(() => {
        if (!isCommitDialogOpen) {
            setMessage("");
            setShowEmojiSuggestions(false);
            setEmojiSuggestions([]);
        }
    }, [isCommitDialogOpen]);

    // Update emoji suggestions when message changes
    useEffect(() => {
        if (hasEmojiCommits && message.trim()) {
            const suggestions = getEmojiSuggestions(message);
            setEmojiSuggestions(suggestions);
        } else {
            setEmojiSuggestions([]);
        }
    }, [message, hasEmojiCommits]);

    // Handle adding emoji to message
    const addEmojiToMessage = (emoji: string) => {
        const formattedMessage = formatCommitWithEmoji(emoji, message);
        setMessage(formattedMessage);
        setShowEmojiSuggestions(false);

        // Focus back to textarea
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 100);
    };

    // Handle commit action
    const performCommit = () => {
        if (message.trim()) {
            handleCommit(message.trim());
            setMessage("");
            closeCommitDialog();
        }
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+Enter or Cmd+Enter to commit
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            performCommit();
        }

        // Escape to cancel (handled by DialogContent)
    };

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

    return (
        <Dialog open={isCommitDialogOpen} onOpenChange={closeCommitDialog}>
            <DialogContent onKeyDown={handleKeyDown}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <GitCommit className="text-gm-lime h-5 w-5 shrink-0" aria-hidden="true" />
                        {t("commit.title") || "Commit Message"}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="font-code min-h-[150px] text-sm"
                        placeholder={t("commit.placeholder") || "Enter a commit message describing your changes..."}
                        autoFocus={!isMobileDevice()}
                    />

                    {/* Emoji suggestions */}
                    {hasEmojiCommits && emojiSuggestions.length > 0 && (
                        <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <span className="text-gm-ink-soft text-sm font-semibold">Suggested emojis:</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-pressed={showEmojiSuggestions}
                                    onClick={() => setShowEmojiSuggestions(!showEmojiSuggestions)}>
                                    <Smile className="h-4 w-4" aria-hidden="true" />
                                    {showEmojiSuggestions ? "Hide" : "Show"}
                                </Button>
                            </div>

                            {(showEmojiSuggestions || emojiSuggestions.length <= 3) && (
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {emojiSuggestions.slice(0, 6).map((suggestion, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addEmojiToMessage(suggestion.emoji)}
                                            className="h-auto w-full justify-start py-2 text-start whitespace-normal">
                                            <span className="text-lg" aria-hidden="true">
                                                {suggestion.emoji}
                                            </span>
                                            <span className="text-gm-ink-soft text-xs">{suggestion.description}</span>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <p className="text-gm-ink-dim mt-3 text-xs leading-relaxed">
                        {t("commit.tip") ||
                            "First line should be a short summary. Leave a blank line then add details if needed."}
                    </p>
                </div>

                <DialogFooter className="sm:justify-between">
                    <p className="font-code text-gm-ink-dim hidden text-xs md:block">
                        {t("editor.escToCancel") || "Press ESC to cancel, CTRL+Enter to commit"}
                    </p>
                    <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                        <Button variant="outline" onClick={closeCommitDialog} className="w-full sm:w-auto">
                            {t("editor.cancel") || "Cancel"}
                        </Button>
                        <Button onClick={performCommit} disabled={!message.trim()} className="w-full sm:w-auto">
                            <GitCommit className="h-4 w-4" aria-hidden="true" />
                            {t("commit.button") || "Commit Changes"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
