"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Self-playing hero demo: a terminal types a real (and valid) Git session while the commit
 * graph underneath reacts, then loops. The server-rendered markup is the finished state, so
 * with reduced motion, no JS or a headless renderer the demo simply shows the end result.
 */

type Line =
    | { kind: "cmd"; text: string; step: number }
    | { kind: "out"; text: string; step: number; tone?: "ok" | "xp" };

const SCRIPT: Line[] = [
    { kind: "cmd", text: 'git commit -m "hello world"', step: 0 },
    { kind: "out", text: "[main a1f3c9e] hello world", step: 0 },
    { kind: "cmd", text: "git switch -c feature", step: 1 },
    { kind: "out", text: "Switched to a new branch 'feature'", step: 1 },
    { kind: "cmd", text: 'git commit -am "add cat gifs"', step: 2 },
    { kind: "out", text: "[feature 7b2d410] add cat gifs", step: 2 },
    { kind: "cmd", text: "git switch main", step: 3 },
    { kind: "out", text: "Switched to branch 'main'", step: 3 },
    { kind: "cmd", text: 'git commit -am "fix typo"', step: 4 },
    { kind: "out", text: "[main 3e9a0b2] fix typo", step: 4 },
    { kind: "cmd", text: "git merge feature", step: 5 },
    { kind: "out", text: "Merge made by the 'ort' strategy.", step: 5, tone: "ok" },
];

// Graph geometry (viewBox 0 0 340 128). main runs along y=88, feature along y=40.
const MAIN_Y = 88;
const FEAT_Y = 40;
const N = {
    c1: { x: 44, y: MAIN_Y },
    f1: { x: 150, y: FEAT_Y },
    c2: { x: 196, y: MAIN_Y },
    m: { x: 292, y: MAIN_Y },
};

const GRAPE = "var(--color-gm-grape-hi)";
const CYAN = "var(--color-gm-cyan)";
const LIME = "var(--color-gm-lime)";

function Pill({ label, fill, ink, width }: { label: string; fill: string; ink: string; width: number }) {
    return (
        <>
            <rect x={-width / 2} y={-10} width={width} height={20} rx={10} fill={fill} />
            <text
                y={4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill={ink}
                style={{ fontFamily: "var(--font-code)" }}>
                {label}
            </text>
        </>
    );
}

export function HeroDemo({ title, label }: { title: string; label: string }) {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const q = gsap.utils.selector(root);
                const lines = q<HTMLElement>("[data-line]");
                const cmdText = q<HTMLElement>("[data-cmd]");
                const carets = q<HTMLElement>("[data-caret]");
                const idle = q<HTMLElement>("[data-idle]");
                const paths = q<SVGPathElement>("[data-path]");
                const nodes = q<SVGGElement>("[data-node]");
                const headRing = q<SVGGElement>("[data-head]");
                const mainPill = q<SVGGElement>("[data-pill='main']");
                const featPill = q<SVGGElement>("[data-pill='feature']");
                const xp = q<SVGGElement>("[data-xp]");

                const pathByName = (n: string) => paths.find(p => p.dataset.path === n)!;
                const nodeByName = (n: string) => nodes.find(g => g.dataset.node === n)!;
                const fulls = cmdText.map(el => el.dataset.cmd ?? "");

                // ── Initial state (the SSR markup is the *final* state) ─────────
                gsap.set(lines, { display: "none" });
                gsap.set(idle, { display: "none" });
                gsap.set(carets, { autoAlpha: 0 });
                cmdText.forEach(el => (el.textContent = ""));
                paths.forEach(p => {
                    const len = p.getTotalLength();
                    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
                });
                gsap.set(nodes, { scale: 0, transformOrigin: "50% 50%" });
                gsap.set(headRing, { x: N.c1.x, y: N.c1.y, autoAlpha: 0 });
                gsap.set(mainPill, { x: N.c1.x, y: MAIN_Y + 26, autoAlpha: 0 });
                gsap.set(featPill, { x: N.c1.x, y: MAIN_Y - 28, autoAlpha: 0 });
                gsap.set(xp, { x: N.m.x - 4, y: MAIN_Y - 30, autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" });

                const tl = gsap.timeline({
                    repeat: -1,
                    repeatDelay: 2.8,
                    paused: true,
                    defaults: { ease: "expo.out" },
                    onRepeat: () => cmdText.forEach(el => (el.textContent = "")),
                });

                const draw = (name: string, at: string | number = ">") =>
                    tl.to(pathByName(name), { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, at);
                const pop = (name: string, at: string | number = ">") =>
                    tl.to(nodeByName(name), { scale: 1, duration: 0.5 }, at);
                const moveHead = (to: { x: number; y: number }, at: string | number = "<") =>
                    tl.to(headRing, { x: to.x, y: to.y, autoAlpha: 1, duration: 0.5 }, at);

                let cmdIndex = 0;
                const typeStep = (step: number) => {
                    SCRIPT.forEach((line, i) => {
                        if (line.step !== step) return;
                        const el = lines[i]!;
                        if (line.kind === "cmd") {
                            const idx = cmdIndex++;
                            const target = cmdText[idx]!;
                            const full = fulls[idx]!;
                            const proxy = { n: 0 };
                            tl.set(el, { display: "flex" }, "+=0.35");
                            tl.set(carets[idx]!, { autoAlpha: 1 }, "<");
                            tl.to(
                                proxy,
                                {
                                    n: full.length,
                                    duration: full.length * 0.038,
                                    ease: "none",
                                    onUpdate: () => {
                                        target.textContent = full.slice(0, Math.round(proxy.n));
                                    },
                                },
                                "<",
                            );
                            tl.set(carets[idx]!, { autoAlpha: 0 }, "+=0.18");
                        } else {
                            tl.set(el, { display: "block" }, "+=0.08");
                        }
                    });
                };

                tl.to({}, { duration: 0.4 });
                // 1. first commit on main
                typeStep(0);
                pop("c1", "<");
                moveHead(N.c1);
                tl.to(mainPill, { autoAlpha: 1, duration: 0.4 }, "<");
                // 2. new branch, same commit
                typeStep(1);
                tl.to(featPill, { autoAlpha: 1, duration: 0.4 }, "<");
                // 3. commit on feature
                typeStep(2);
                draw("branch", "<");
                pop("f1", "-=0.2");
                moveHead(N.f1);
                tl.to(featPill, { x: N.f1.x, y: FEAT_Y - 26, duration: 0.5 }, "<");
                // 4. back to main
                typeStep(3);
                moveHead(N.c1);
                // 5. main moves on (now the branches have diverged)
                typeStep(4);
                draw("mainA", "<");
                pop("c2", "-=0.2");
                moveHead(N.c2);
                tl.to(mainPill, { x: N.c2.x, duration: 0.5 }, "<");
                // 6. three-way merge + reward
                typeStep(5);
                draw("merge", "<");
                draw("mainB", "<");
                pop("m", "-=0.15");
                moveHead(N.m);
                tl.to(mainPill, { x: N.m.x, duration: 0.5 }, "<");
                tl.to(xp, { autoAlpha: 1, scale: 1, duration: 0.6 }, "+=0.1");
                tl.to(xp, { y: MAIN_Y - 40, duration: 1.4, ease: "sine.out" }, "<");
                tl.set(idle, { display: "flex" });
                tl.to({}, { duration: 1 });

                // Only run while the demo is on screen.
                const st = ScrollTrigger.create({
                    trigger: root,
                    start: "top bottom",
                    end: "bottom top",
                    onToggle: self => (self.isActive ? tl.play() : tl.pause()),
                });
                if (st.isActive) tl.play();
            });
        }, root);

        return () => ctx.revert();
    }, []);

    let cmdCounter = 0;

    return (
        <figure
            ref={rootRef}
            aria-label={label}
            className="border-gm-line bg-gm-night relative m-0 w-full overflow-hidden rounded-[1.4rem] border-2 text-left shadow-[10px_10px_0_0_var(--color-gm-grape)]">
            {/* Title bar */}
            <div
                className="border-gm-line bg-gm-deep flex items-center gap-2 border-b-2 px-4 py-2.5"
                aria-hidden="true">
                {/* The same title bar as the real terminal: a live LED and the session path. */}
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="bg-gm-lime absolute inset-0 animate-pulse rounded-full opacity-35 motion-reduce:animate-none"></span>
                    <span className="bg-gm-lime absolute inset-[3px] rounded-full"></span>
                </span>
                <span className="text-gm-ink-soft ms-0.5 truncate [font-family:var(--font-code)] text-xs">
                    ~/{title}
                </span>
            </div>

            {/* Terminal: bottom-anchored so new lines push old ones up */}
            <div
                aria-hidden="true"
                className="flex h-[196px] flex-col justify-end overflow-hidden px-4 pt-3 pb-2 [font-family:var(--font-code)] text-[12.5px] leading-[1.6] sm:h-[212px] sm:text-[13px]">
                {SCRIPT.map((line, i) => {
                    if (line.kind === "cmd") {
                        const idx = cmdCounter++;
                        return (
                            <div key={i} data-line className="flex min-w-0 shrink-0 gap-2 whitespace-pre">
                                <span className="text-gm-lime select-none">$</span>
                                <span className="text-gm-ink truncate">
                                    <span data-cmd={line.text}>{line.text}</span>
                                    <span
                                        data-caret={idx}
                                        className="animate-caret bg-gm-lime invisible ml-px inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em]"></span>
                                </span>
                            </div>
                        );
                    }
                    return (
                        <div
                            key={i}
                            data-line
                            className={`block min-w-0 shrink-0 truncate ps-4 whitespace-pre ${line.tone === "ok" ? "text-gm-lime" : "text-gm-ink-dim"}`}>
                            {line.text}
                        </div>
                    );
                })}
                <div data-idle className="flex shrink-0 gap-2">
                    <span className="text-gm-lime">$</span>
                    <span className="animate-caret bg-gm-lime inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em]"></span>
                </div>
            </div>

            {/* Commit graph */}
            <div className="border-gm-line/70 bg-gm-void/60 border-t-2 border-dashed px-2 py-1.5">
                <svg viewBox="0 0 340 128" className="block h-auto w-full" fill="none" aria-hidden="true">
                    <path
                        data-path="mainA"
                        d={`M${N.c1.x} ${MAIN_Y} H${N.c2.x}`}
                        stroke={GRAPE}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <path
                        data-path="mainB"
                        d={`M${N.c2.x} ${MAIN_Y} H${N.m.x}`}
                        stroke={GRAPE}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <path
                        data-path="branch"
                        d={`M${N.c1.x} ${MAIN_Y} C${N.c1.x + 56} ${MAIN_Y} ${N.f1.x - 56} ${FEAT_Y} ${N.f1.x} ${FEAT_Y}`}
                        stroke={CYAN}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <path
                        data-path="merge"
                        d={`M${N.f1.x} ${FEAT_Y} C${N.f1.x + 80} ${FEAT_Y} ${N.m.x - 70} ${MAIN_Y} ${N.m.x} ${MAIN_Y}`}
                        stroke={CYAN}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />

                    {(
                        [
                            ["c1", N.c1, GRAPE],
                            ["f1", N.f1, CYAN],
                            ["c2", N.c2, GRAPE],
                            ["m", N.m, GRAPE],
                        ] as const
                    ).map(([name, p, c]) => (
                        <g key={name} data-node={name}>
                            <circle cx={p.x} cy={p.y} r="11" fill="var(--color-gm-night)" stroke={c} strokeWidth="4" />
                            <circle cx={p.x} cy={p.y} r="4" fill={c} />
                        </g>
                    ))}

                    {/* HEAD: a lime ring on whatever is checked out */}
                    <g data-head transform={`translate(${N.m.x} ${N.m.y})`}>
                        <circle r="17" stroke={LIME} strokeWidth="2.5" strokeDasharray="4 4" />
                    </g>

                    <g data-pill="main" transform={`translate(${N.m.x} ${MAIN_Y + 26})`}>
                        <Pill label="main" fill={GRAPE} ink="var(--color-gm-ink)" width={46} />
                    </g>
                    <g data-pill="feature" transform={`translate(${N.f1.x} ${FEAT_Y - 26})`}>
                        <Pill label="feature" fill={CYAN} ink="var(--color-gm-void)" width={62} />
                    </g>

                    <g data-xp transform={`translate(${N.m.x - 4} ${MAIN_Y - 40})`}>
                        <rect
                            x="-34"
                            y="-13"
                            width="68"
                            height="26"
                            rx="8"
                            fill="var(--color-gm-gold)"
                            transform="rotate(-6)"
                        />
                        <text
                            y="5"
                            textAnchor="middle"
                            fontSize="13"
                            fill="var(--color-gm-void)"
                            transform="rotate(-6)"
                            style={{ fontFamily: "var(--font-display)" }}>
                            +50 XP
                        </text>
                    </g>
                </svg>
            </div>
        </figure>
    );
}
