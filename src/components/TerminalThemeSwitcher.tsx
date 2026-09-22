"use client";

import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Palette, Lock, Check } from "lucide-react";
import { useTerminalTheme } from "~/contexts/TerminalThemeContext";
import { useLanguage } from "~/contexts/LanguageContext";

interface TerminalThemeSwitcherProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TerminalThemeSwitcher({ isOpen, onClose }: TerminalThemeSwitcherProps) {
    const { currentTheme, availableThemes, setTheme, isThemeUnlocked } = useTerminalTheme();
    const { t } = useLanguage();

    const handleThemeSelect = (themeId: string) => {
        if (isThemeUnlocked(themeId)) {
            setTheme(themeId);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Palette className="text-gm-grape-hi h-5 w-5 shrink-0" aria-hidden="true" />
                        {t("themes.title")}
                    </DialogTitle>
                    <DialogDescription>{t("themes.subtitle")}</DialogDescription>
                </DialogHeader>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {availableThemes.map(theme => {
                        const isUnlocked = isThemeUnlocked(theme.id);
                        const isActive = currentTheme.id === theme.id;

                        return (
                            <button
                                key={theme.id}
                                type="button"
                                aria-pressed={isActive}
                                disabled={!isUnlocked}
                                onClick={() => handleThemeSelect(theme.id)}
                                className={`gm-inset focus-visible:outline-gm-cyan cursor-pointer p-4 text-start transition-[transform,box-shadow,border-color] duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transition-[border-color] ${
                                    isActive
                                        ? "border-gm-lime shadow-[0_4px_0_var(--color-gm-lime-edge)]"
                                        : "enabled:hover:border-gm-grape-hi shadow-[0_4px_0_var(--color-gm-line)] enabled:hover:-translate-y-0.5 enabled:active:translate-y-[3px] enabled:active:shadow-[0_1px_0_var(--color-gm-line)] motion-reduce:enabled:hover:translate-y-0"
                                } ${!isUnlocked ? "shadow-none" : ""}`}>
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <h3 className="text-gm-ink truncate font-semibold">{theme.name}</h3>
                                    <div className="flex flex-shrink-0 items-center gap-2">
                                        {isActive && <Check className="text-gm-lime h-4 w-4" aria-hidden="true" />}
                                        {!isUnlocked && <Lock className="text-gm-ink-dim h-4 w-4" aria-hidden="true" />}
                                    </div>
                                </div>

                                {/* Theme Preview — the purchased themes keep their own literal colours */}
                                <div
                                    className="overflow-hidden rounded-[0.7rem] border-2 p-2 [font-family:var(--font-code)] text-xs"
                                    style={{
                                        backgroundColor: theme.colors.background,
                                        borderColor: theme.colors.border,
                                        color: theme.colors.text,
                                    }}>
                                    <div className="mb-1 flex items-center gap-1 truncate">
                                        <span style={{ color: theme.colors.prompt }}>git-mastery:~$</span>
                                        <span>git status</span>
                                    </div>
                                    <div style={{ color: theme.colors.success }} className="mb-1 truncate">
                                        On branch main
                                    </div>
                                    <div style={{ color: theme.colors.warning }} className="truncate">
                                        Changes not staged for commit:
                                    </div>
                                    <div style={{ color: theme.colors.accent }} className="ms-2 truncate">
                                        modified: README.md
                                    </div>
                                </div>

                                {!isUnlocked && (
                                    <p className="text-gm-ink-dim mt-2 text-xs">{t("themes.unlockHint")}</p>
                                )}
                            </button>
                        );
                    })}
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button onClick={onClose} variant="outline">
                        {t("themes.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
