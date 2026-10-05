"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { OutputFormatterService } from "~/components/Terminal/services/OutputFormatter";

interface CommandLogProps {
    lines: string[];
    className?: string;
    /** Shown when there is nothing to print yet. */
    emptyText?: string;
    /** Keep the newest line in view, like a terminal. Off for a short strip that should start at the command. */
    followTail?: boolean;
    /** The last command failed: the frame turns coral, so a failure reads before the text does. */
    failed?: boolean;
    "aria-label"?: string;
}

/**
 * Read-only terminal output for visual mode.
 *
 * It is the terminal's own formatter, so a played card prints exactly what the typed command
 * would have: diffs, graphs, errors and all. The colour roles are pinned to the default terminal
 * palette; the purchasable terminal themes belong to the terminal itself.
 */
export function CommandLog({
    lines,
    className = "",
    emptyText,
    followTail = false,
    failed = false,
    ...rest
}: CommandLogProps) {
    const formatter = useMemo(() => new OutputFormatterService(lines), [lines]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!followTail || !scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [lines, followTail]);

    return (
        <div
            ref={scrollRef}
            role="log"
            aria-label={rest["aria-label"]}
            className={`gm-inset gm-scroll overflow-auto px-3 py-2 [font-family:var(--font-code)] text-[12px] leading-[1.6] text-[var(--term-text)] ${className}`}
            style={
                {
                    "--term-bg": "var(--color-gm-void)",
                    "--term-text": "var(--color-gm-ink)",
                    "--term-accent": "var(--color-gm-cyan)",
                    "--term-prompt": "var(--color-gm-lime)",
                    "--term-success": "var(--color-gm-lime)",
                    "--term-error": "var(--color-gm-coral)",
                    "--term-warning": "var(--color-gm-coral)",
                    ...(failed ? { borderColor: "var(--color-gm-coral-edge)" } : {}),
                } as CSSProperties
            }>
            {lines.length === 0 && emptyText ? (
                <p className="text-gm-ink-dim font-sans">{emptyText}</p>
            ) : (
                lines.map((line, i) => (
                    <div key={i} className="break-words whitespace-pre-wrap">
                        {formatter.renderTerminalOutput(line)}
                    </div>
                ))
            )}
        </div>
    );
}
