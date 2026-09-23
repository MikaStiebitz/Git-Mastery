"use client";

import { useEffect, useRef } from "react";

/**
 * Fire a callback when a sequence of keys is typed in order.
 *
 * Matches on `KeyboardEvent.code` — the physical key — rather than on the character produced, so
 * the same sequence works on every keyboard layout the app ships in, and Shift and Caps Lock make
 * no difference.
 *
 * Keystrokes inside a text field never count. This app has a terminal input at the centre of most
 * pages, and a sequence that could be triggered by typing a Git command into it would fire
 * constantly by accident.
 *
 * @param sequence Physical key codes in order, e.g. `["KeyG", "KeyI", "KeyT"]`.
 * @param onMatch  Called once each time the full sequence completes.
 * @param gapMs    How long a pause may be between two keys before the attempt resets.
 */
export function useKeySequence(sequence: readonly string[], onMatch: () => void, gapMs = 1500): void {
    // Kept in a ref so that changing the handler does not tear down and rebuild the listener
    // mid-sequence, which would silently discard the player's progress through it.
    const onMatchRef = useRef(onMatch);
    onMatchRef.current = onMatch;

    useEffect(() => {
        if (typeof window === "undefined" || sequence.length === 0) return;

        let position = 0;
        let lastKeyAt = 0;

        const isTyping = (target: EventTarget | null): boolean => {
            if (!(target instanceof HTMLElement)) return false;
            const tag = target.tagName;
            return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
        };

        const onKeyDown = (event: KeyboardEvent) => {
            // A shortcut the browser or the OS owns is not somebody typing a word.
            if (event.ctrlKey || event.metaKey || event.altKey) {
                position = 0;
                return;
            }
            if (isTyping(event.target)) {
                position = 0;
                return;
            }

            const now = event.timeStamp;
            if (position > 0 && now - lastKeyAt > gapMs) position = 0;

            if (event.code === sequence[position]) {
                position += 1;
                lastKeyAt = now;

                if (position === sequence.length) {
                    position = 0;
                    onMatchRef.current();
                }
                return;
            }

            // A wrong key restarts — but if it is the first key of the sequence, it starts a new
            // attempt rather than wasting it, so "refreflog" still works.
            position = event.code === sequence[0] ? 1 : 0;
            lastKeyAt = now;
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [gapMs, sequence]);
}
