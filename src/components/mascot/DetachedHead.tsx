"use client";

import { useId } from "react";

interface DetachedHeadProps {
    size?: number;
    /** Drives the pose: idle drift, a re-attachment on success, or leaning in when stuck. */
    mood?: "idle" | "landed" | "stuck";
    className?: string;
}

/**
 * HEAD, detached — the mascot.
 *
 * The design system already calls HEAD "the player's token", so the mascot IS HEAD: a commit node
 * that has come off its branch. That earns every part of the drawing. It floats because it is not
 * attached to anything, and its severed ref-pointer snaps onto a branch line for a moment every time
 * the player lands a level — which is the whole celebration, instead of the sparks every mascot in
 * every product fires on success.
 *
 * Inline SVG with flat fills and a hard edge underneath, like an arcade keycap, so it ships in a
 * static export with no asset pipeline and reads at 64px. Every id is scoped with useId(): the Shop
 * renders a second instance in a dialog over the level page, and duplicate ids would let one
 * instance's gradient and clip paths hijack the other's.
 */
export function DetachedHead({ size = 64, mood = "idle", className = "" }: DetachedHeadProps) {
    const uid = useId().replace(/:/g, "");
    const glow = `${uid}-glow`;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
            className={`gm-mascot gm-mascot--${mood} ${className}`}
            style={{ overflow: "visible" }}>
            <defs>
                <radialGradient id={glow} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--color-gm-lime)" stopOpacity="0.42" />
                    <stop offset="100%" stopColor="var(--color-gm-lime)" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* The branch it snaps back onto. Hidden until a level lands, then drawn in from the
                inline-start edge — the dash offset is animated in CSS. */}
            <g className="gm-mascot__branch">
                <path
                    d="M2 46 H22"
                    stroke="var(--color-gm-lime-edge)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    pathLength={1}
                />
                <circle cx="22" cy="46" r="4" fill="var(--color-gm-lime-edge)" />
            </g>

            {/* The severed ref pointer. Limp while detached, taut on landing. */}
            <path
                className="gm-mascot__tail"
                d="M24 44 C 26 40, 24 36, 27 33"
                stroke="var(--color-gm-lime-edge)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />

            <g className="gm-mascot__body">
                <circle cx="34" cy="28" r="19" fill={`url(#${glow})`} className="gm-mascot__halo" />
                {/* Keycap edge, then face — the same two-layer trick the arcade buttons use. */}
                <circle cx="34" cy="30" r="15" fill="var(--color-gm-lime-edge)" />
                <circle cx="34" cy="28" r="15" fill="var(--color-gm-lime)" />

                <g className="gm-mascot__eyes" fill="var(--color-gm-void)">
                    <rect x="27" y="24" width="4" height="7" rx="2" />
                    <rect x="37" y="24" width="4" height="7" rx="2" />
                </g>
                <path
                    className="gm-mascot__mouth"
                    d="M29 35 Q34 38 39 35"
                    stroke="var(--color-gm-void)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                />
            </g>

            {/* The tag. It says what the character is, and HEAD is never translated. */}
            <g className="gm-mascot__tag">
                <rect
                    x="36"
                    y="44"
                    width="26"
                    height="13"
                    rx="4"
                    fill="var(--color-gm-void)"
                    stroke="var(--color-gm-lime-edge)"
                    strokeWidth="2"
                />
                <text
                    x="49"
                    y="53.5"
                    textAnchor="middle"
                    fill="var(--color-gm-lime)"
                    style={{ fontFamily: "var(--font-code)", fontSize: "8px", fontWeight: 700 }}>
                    HEAD
                </text>
            </g>
        </svg>
    );
}
