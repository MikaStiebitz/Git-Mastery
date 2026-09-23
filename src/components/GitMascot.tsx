"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DetachedHead } from "./mascot/DetachedHead";
import { drawLine, lineForCommand, type MascotCue } from "./mascot/lines";

interface GitMascotProps {
    /** Only rendered when the player owns the mascot. */
    isActive: boolean;
    /** Hidden while a dialog or the file editor owns the screen. */
    suppressed?: boolean;
}

/** Cue payload carried on the window event GameContext dispatches. */
export interface MascotEventDetail {
    cue: MascotCue | "command";
    command?: string;
}

export const MASCOT_EVENT = "gitmastery:mascot";

/** Fire a cue at the mascot from anywhere, without prop drilling through the level page. */
export function cueMascot(detail: MascotEventDetail): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent<MascotEventDetail>(MASCOT_EVENT, { detail }));
}

const VISIBLE_MS = 5200;

export function GitMascot({ isActive, suppressed = false }: GitMascotProps) {
    const [line, setLine] = useState<string | null>(null);
    const [mood, setMood] = useState<"idle" | "landed" | "stuck">("idle");
    /** Announced to screen readers. Kept separate from `line` so the live region can pre-exist. */
    const [announcement, setAnnouncement] = useState("");
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    /** One remark per level for command cues, so it never becomes a running commentary. */
    const commandRemarks = useRef(0);

    const say = useCallback((text: string, nextMood: "idle" | "landed" | "stuck") => {
        if (!text) return;

        setLine(text);
        setMood(nextMood);
        // Only the "you are stuck" cue is worth interrupting a screen reader for; the rest is
        // flavour, and flavour that talks over your actual work is not charming.
        setAnnouncement(nextMood === "stuck" ? text : "");

        if (hideTimer.current) clearTimeout(hideTimer.current);
        if (moodTimer.current) clearTimeout(moodTimer.current);
        hideTimer.current = setTimeout(() => setLine(null), VISIBLE_MS);
        moodTimer.current = setTimeout(() => setMood("idle"), 1600);
    }, []);

    useEffect(() => {
        if (!isActive) return;

        const onCue = (event: Event) => {
            const { cue, command } = (event as CustomEvent<MascotEventDetail>).detail ?? {};
            if (!cue) return;

            if (cue === "command") {
                if (commandRemarks.current >= 1) return;
                const remark = command ? lineForCommand(command) : undefined;
                if (!remark) return;
                commandRemarks.current += 1;
                say(remark, "idle");
                return;
            }

            if (cue === "levelComplete" || cue === "stageComplete" || cue === "firstCommit") {
                commandRemarks.current = 0;
                say(drawLine(cue), "landed");
                return;
            }

            say(drawLine(cue), cue === "struggle3" || cue === "struggle7" ? "stuck" : "idle");
        };

        window.addEventListener(MASCOT_EVENT, onCue);
        return () => window.removeEventListener(MASCOT_EVENT, onCue);
    }, [isActive, say]);

    useEffect(
        () => () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
            if (moodTimer.current) clearTimeout(moodTimer.current);
        },
        [],
    );

    if (!isActive) return null;

    return (
        <div className={`relative flex shrink-0 items-start ${suppressed ? "invisible" : ""}`}>
            {/* Permanent live region. A region mounted at the same moment its text appears is not
                announced at all, which is how most "accessible" toasts stay silent. */}
            <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {announcement}
            </span>

            {/* It is a pet, so it can be petted. The bubble itself never takes pointer events —
                only the character does — so nothing it says can block a click. */}
            <button
                type="button"
                onClick={() => say(drawLine("poke"), "idle")}
                aria-label="HEAD"
                className="focus-visible:outline-gm-cyan grid h-16 w-16 shrink-0 cursor-pointer place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-2">
                <DetachedHead size={64} mood={mood} />
            </button>

            {line && (
                <div
                    aria-hidden="true"
                    className="gm-panel animate-in fade-in slide-in-from-top-1 pointer-events-none absolute end-0 top-full z-(--z-dropdown) mt-1 w-[min(19rem,calc(100vw-2.5rem))] p-3 shadow-[0_5px_0_var(--color-gm-line)] duration-200">
                    <p className="text-gm-ink text-sm leading-snug font-medium text-pretty">{line}</p>
                    {/* Arrow: border layer first, then the face over it. */}
                    <span
                        className="border-b-gm-line absolute end-6 -top-[10px] h-0 w-0 border-s-[9px] border-e-[9px] border-b-[10px] border-s-transparent border-e-transparent"
                        aria-hidden="true"
                    />
                    <span
                        className="border-b-gm-night absolute end-[26px] -top-[6px] h-0 w-0 border-s-[7px] border-e-[7px] border-b-[8px] border-s-transparent border-e-transparent"
                        aria-hidden="true"
                    />
                </div>
            )}
        </div>
    );
}
