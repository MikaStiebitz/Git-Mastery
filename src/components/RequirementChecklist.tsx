"use client";

import { Check } from "lucide-react";

/** A single objective row. `label` is already translated by the caller. */
export interface RequirementChecklistItem {
    label: string;
    completed: boolean;
}

interface RequirementChecklistProps {
    items: RequirementChecklistItem[];
    className?: string;
}

/**
 * The level's objectives, rendered as a real list. State is carried by three signals at
 * once — marker shape, check icon and colour — so a player who cannot separate lime from
 * grey still sees what is done. Rows are insets because the list always lives inside a
 * panel; a card inside a card is never the answer here.
 */
export function RequirementChecklist({ items, className = "" }: RequirementChecklistProps) {
    return (
        <ul className={`space-y-2 ${className}`}>
            {items.map((item, index) => (
                <li
                    key={index}
                    className="gm-inset flex items-start gap-3 p-3 transition-colors duration-150 ease-[var(--ease-out-expo)]">
                    <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[0.4rem] border-2 transition-colors duration-150 ease-[var(--ease-out-expo)] ${
                            item.completed ? "border-gm-lime-edge bg-gm-lime text-gm-void" : "border-gm-line bg-gm-void"
                        }`}>
                        {item.completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                    <span
                        className={`text-sm sm:text-base ${
                            item.completed
                                ? "text-gm-lime decoration-gm-lime-edge line-through decoration-2"
                                : "text-gm-ink-soft"
                        }`}>
                        {item.label}
                    </span>
                </li>
            ))}
        </ul>
    );
}
