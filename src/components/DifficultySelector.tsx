"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "~/components/ui/dialog";
import { Check, Circle, Settings } from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { difficulties } from "~/config/difficulties";
import { allStages } from "~/levels";
import type { DifficultyLevel } from "~/types";

interface DifficultySelectorProps {
    isOpen: boolean;
    onClose: () => void;
    isInitialSelection?: boolean;
}

export function DifficultySelector({ isOpen, onClose, isInitialSelection = false }: DifficultySelectorProps) {
    const { currentDifficulty, setCurrentDifficulty } = useGameContext();
    const { t } = useLanguage();
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(currentDifficulty);

    // Updates selectedDifficulty whenever currentDifficulty changes
    useEffect(() => {
        setSelectedDifficulty(currentDifficulty);
    }, [currentDifficulty]);

    const handleConfirm = () => {
        setCurrentDifficulty(selectedDifficulty);
        onClose();
    };

    // Arrow keys move through the options the way a real radio group does: selection and
    // focus travel together, and the group stays a single tab stop.
    const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
        const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
        if (!forward && !backward) return;

        event.preventDefault();
        const nextIndex = (index + (forward ? 1 : -1) + difficulties.length) % difficulties.length;
        const nextDifficulty = difficulties[nextIndex];
        if (!nextDifficulty) return;

        setSelectedDifficulty(nextDifficulty.id);
        const options = event.currentTarget.parentElement?.children;
        (options?.[nextIndex] as HTMLElement | undefined)?.focus();
    };

    // The three options are one choice, so the selected card carries three signals at once:
    // a lime border, a lime tint and a filled check. Colour never decides on its own.
    const optionClasses = (isSelected: boolean) =>
        isSelected
            ? "border-gm-lime bg-gm-lime/10 shadow-[0_4px_0_var(--color-gm-lime-edge)]"
            : "border-gm-line hover:border-gm-grape-hi";

    return (
        <Dialog open={isOpen} onOpenChange={() => !isInitialSelection && onClose()}>
            <DialogContent
                className="sm:max-w-3xl"
                onPointerDownOutside={e => isInitialSelection && e.preventDefault()}
                onEscapeKeyDown={e => isInitialSelection && e.preventDefault()}
                showClose={!isInitialSelection}>
                <DialogHeader>
                    {isInitialSelection && (
                        <p className="gm-chip bg-gm-grape text-gm-ink self-start">{t("difficulty.firstTime")}</p>
                    )}
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="text-gm-grape-hi h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden="true" />
                        {isInitialSelection ? t("difficulty.welcomeTitle") : t("difficulty.changeTitle")}
                    </DialogTitle>
                    <DialogDescription>
                        {isInitialSelection ? t("difficulty.welcomeDescription") : t("difficulty.changeDescription")}
                    </DialogDescription>
                </DialogHeader>

                <div
                    role="radiogroup"
                    aria-label={t("difficulty.selectTitle")}
                    className="mt-5 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                    {difficulties.map((diff, index) => {
                        const isSelected = selectedDifficulty === diff.id;

                        return (
                            <button
                                key={diff.id}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                tabIndex={isSelected ? 0 : -1}
                                onKeyDown={event => handleOptionKeyDown(event, index)}
                                onClick={() => setSelectedDifficulty(diff.id)}
                                className={`gm-inset focus-visible:outline-gm-cyan flex cursor-pointer flex-col gap-3 p-4 text-start transition-[border-color,background-color,box-shadow] duration-200 ease-[var(--ease-out-expo)] focus-visible:outline-3 focus-visible:outline-offset-2 ${optionClasses(
                                    isSelected,
                                )}`}>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-3xl leading-none sm:text-4xl" aria-hidden="true">
                                        {diff.icon}
                                    </span>
                                    {isSelected ? (
                                        <span className="border-gm-lime-edge bg-gm-lime text-gm-void inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2">
                                            <Check className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    ) : (
                                        <Circle className="text-gm-ink-dim h-7 w-7 shrink-0" aria-hidden="true" />
                                    )}
                                </div>

                                <h3 className="text-gm-ink text-lg font-bold [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                                    {t(`difficulty.${diff.id}`)}
                                </h3>

                                <p className="text-gm-ink-soft text-sm leading-relaxed">
                                    {t(`difficulty.${diff.id}.description`)}
                                </p>

                                <div className="flex flex-1 flex-col gap-2">
                                    <p className="text-gm-ink-dim text-xs font-semibold">
                                        {t("difficulty.topicsCovered")}:
                                    </p>
                                    <div className="flex flex-wrap content-start gap-1.5">
                                        {diff.stages.map(stage => (
                                            <span
                                                key={stage}
                                                className="gm-chip border-gm-line bg-gm-deep text-gm-ink-soft">
                                                {t(allStages[stage as keyof typeof allStages]?.name ?? stage)}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <p className="text-gm-ink-dim text-xs">
                                    {t("difficulty.maxPoints")}: <span className="text-gm-gold">{diff.maxPoints}</span>
                                </p>
                            </button>
                        );
                    })}
                </div>

                <DialogFooter>
                    {!isInitialSelection && (
                        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            {t("difficulty.cancel")}
                        </Button>
                    )}
                    <Button onClick={handleConfirm} className="w-full sm:w-auto">
                        {isInitialSelection ? t("difficulty.startLearning") : t("difficulty.applyChanges")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
