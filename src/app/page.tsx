"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    GitBranch,
    GitCommit,
    GitMerge,
    Rocket,
    Check,
    Lock,
    Activity,
    Award,
    Star,
    ArrowRight,
    Github,
    Settings2,
    ShoppingCart,
    Gamepad2,
    Heart,
    Play,
    TerminalSquare,
    Coins,
} from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { PageLayout } from "~/components/layout/PageLayout";
import { ClientOnly } from "~/components/ClientOnly";
import { useLanguage } from "~/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { DifficultySelector } from "~/components/DifficultySelector";
import { Shop } from "~/components/Shop";
import { Minigames } from "~/components/Minigames";
import { HeroDemo } from "~/components/home/HeroDemo";
import { FeaturedReels } from "~/components/home/FeaturedReels";
import { useSponsor } from "~/components/SponsorDialog";
import { MINIGAMES } from "~/components/minigames/registry";
import { getAvailableStagesForDifficulty } from "~/config/difficulties";
import type { DifficultyLevel } from "~/types";

const TICKER = [
    "git init",
    "git add .",
    "git commit -m",
    "git switch -c",
    "git merge",
    "git rebase -i",
    "git stash pop",
    "git cherry-pick",
    "git reflog",
    "git bisect",
    "git push",
    "git gud",
];

/** Horizontal command ticker. Duplicated once so the -50% loop is seamless. */
function Ticker({ className = "", reverse = false }: { className?: string; reverse?: boolean }) {
    return (
        <div
            className={`animate-marquee flex w-max motion-reduce:animate-none ${reverse ? "[animation-direction:reverse]" : ""}`}>
            {[0, 1].map(copy => (
                <ul key={copy} className={`flex shrink-0 items-center ${className}`} aria-hidden={copy === 1}>
                    {TICKER.map(cmd => (
                        <li key={cmd} className="flex items-center whitespace-nowrap">
                            {cmd}
                            <Star className="mx-6 h-[0.7em] w-[0.7em] fill-current" aria-hidden="true" />
                        </li>
                    ))}
                </ul>
            ))}
        </div>
    );
}

/**
 * Looping hero backdrop. The poster is the first frame of the clip, so the page looks the
 * same with or without video. Playback only starts when the visitor hasn't asked for
 * reduced motion or reduced data.
 */
function HeroBackdrop() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

        const sync = () => {
            if (reduce.matches || saveData) {
                video.pause();
                return;
            }
            if (video.preload !== "auto") {
                video.preload = "auto";
                video.load();
            }
            void video.play().catch(() => undefined);
        };
        sync();
        reduce.addEventListener("change", sync);
        return () => reduce.removeEventListener("change", sync);
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <video
                ref={videoRef}
                className="hero-video absolute inset-0 h-full w-full scale-105 object-cover object-[72%_50%]"
                poster="/hero-rails.webp"
                muted
                loop
                playsInline
                preload="none">
                <source src="/hero-rails.webm" type="video/webm" />
                <source src="/hero-rails.mp4" type="video/mp4" />
            </video>
            {/* Scrims keep the headline at AA contrast over the brightest frame */}
            <div className="bg-gm-void/65 absolute inset-0 lg:bg-transparent lg:bg-[linear-gradient(90deg,var(--color-gm-void)_0%,color-mix(in_oklch,var(--color-gm-void)_82%,transparent)_38%,transparent_72%)]"></div>
            <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,var(--color-gm-void),transparent)]"></div>
        </div>
    );
}

export default function Home() {
    const { levelManager, progressManager, currentDifficulty, setCurrentDifficulty } = useGameContext();
    const { t } = useLanguage();
    const { openSponsor } = useSponsor();
    const router = useRouter();
    const [progress, setProgress] = useState(progressManager.getProgress());
    const [showDifficultySelector, setShowDifficultySelector] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [showMinigames, setShowMinigames] = useState(false);
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    // Handle mounting to avoid hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // ── GSAP: hero entrance ────────────────────────────────────────────────
    // Set up exactly once. The hero markup is server-rendered and never depends on
    // `isMounted`, so it deliberately does NOT share the mount-gated effect below:
    // reverting and rebuilding the context while the entrance timeline was mid-flight
    // used to strand the secondary CTA row at opacity 0.
    useEffect(() => {
        if (!rootRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const heroTargets = ".hero-word > span, .hero-play, .hero-sub, .hero-cta > *, .hero-panel";

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const tl = gsap.timeline({
                    defaults: { ease: "expo.out" },
                    // Drop the inline styles the entrance wrote so no interruption can
                    // leave a hero control stuck at opacity 0.
                    onComplete: () => gsap.set(heroTargets, { clearProps: "all" }),
                });
                tl.from(".hero-word > span", { yPercent: 115, duration: 1, stagger: 0.07 })
                    .from(
                        ".hero-play",
                        { scale: 0.3, rotate: -18, autoAlpha: 0, duration: 1.1, transformOrigin: "20% 80%" },
                        "-=0.7",
                    )
                    .from(".hero-sub", { y: 18, autoAlpha: 0, duration: 0.8 }, "-=0.8")
                    .from(".hero-cta > *", { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.06 }, "-=0.65")
                    .from(".hero-panel", { y: 60, rotate: 4, autoAlpha: 0, duration: 1.2 }, 0.35);

                // Video drifts slower than the page for a little depth.
                gsap.to(".hero-video", {
                    yPercent: 12,
                    ease: "none",
                    scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true },
                });
            });

            // The demo cartridge tilts toward the pointer (fine pointers only).
            mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
                const hero = document.querySelector<HTMLElement>(".hero-section");
                const panel = document.querySelector<HTMLElement>(".hero-tilt");
                if (!hero || !panel) return;
                gsap.set(panel, { transformPerspective: 1100 });
                const rx = gsap.quickTo(panel, "rotationX", { duration: 0.9, ease: "power3.out" });
                const ry = gsap.quickTo(panel, "rotationY", { duration: 0.9, ease: "power3.out" });
                const onMove = (e: PointerEvent) => {
                    const r = hero.getBoundingClientRect();
                    ry(((e.clientX - r.left) / r.width - 0.5) * 9);
                    rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
                };
                const onLeave = () => {
                    rx(0);
                    ry(0);
                };
                hero.addEventListener("pointermove", onMove);
                hero.addEventListener("pointerleave", onLeave);
                return () => {
                    hero.removeEventListener("pointermove", onMove);
                    hero.removeEventListener("pointerleave", onLeave);
                };
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    // ── GSAP: scroll choreography for the client-rendered sections ──────────
    // Gated on `isMounted` because everything below lives inside <ClientOnly> and
    // only exists after hydration.
    useEffect(() => {
        if (!isMounted || !rootRef.current) return;
        // Scroll reveals hide their target until the trigger fires. On a tab that is hidden at
        // mount the ticker never runs, so the sections would ship blank — in that case the page
        // simply stays static and fully visible.
        if (document.visibilityState !== "visible") return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                // HUD slides up like a game overlay
                gsap.from(".hud", {
                    y: 40,
                    autoAlpha: 0,
                    duration: 0.9,
                    ease: "expo.out",
                    scrollTrigger: { trigger: ".hud", start: "top 92%", once: true },
                });

                // Stat counters roll up
                gsap.utils.toArray<HTMLElement>("[data-counter]").forEach(el => {
                    const target = parseInt(el.dataset.counter ?? "0", 10);
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 1.4,
                        ease: "power2.out",
                        scrollTrigger: { trigger: el, start: "top 95%", once: true },
                        onUpdate: () => {
                            el.textContent = String(Math.round(obj.val));
                        },
                    });
                });

                // Stage map: the lane fills as you scroll, stations light up as they're reached
                const fill = document.querySelector(".lane-fill");
                if (fill) {
                    gsap.fromTo(
                        fill,
                        { scaleY: 0 },
                        {
                            scaleY: 1,
                            ease: "none",
                            scrollTrigger: {
                                trigger: ".stage-list",
                                start: "top 65%",
                                end: "bottom 65%",
                                scrub: 0.4,
                            },
                        },
                    );
                }

                gsap.utils.toArray<HTMLElement>("[data-stage]").forEach(row => {
                    const tl = gsap.timeline({
                        defaults: { ease: "expo.out" },
                        scrollTrigger: { trigger: row, start: "top 82%", once: true },
                    });
                    tl.from(row.querySelector("[data-stage-node]"), { scale: 0.4, autoAlpha: 0, duration: 0.8 })
                        .from(row.querySelector("[data-stage-body]"), { x: 40, autoAlpha: 0, duration: 0.9 }, "<0.05")
                        .from(
                            row.querySelectorAll("[data-level]"),
                            { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.05 },
                            "<0.2",
                        );
                });

                // Feature cartridges drop in with a little tilt, each from its own side
                gsap.utils.toArray<HTMLElement>("[data-cart]").forEach((el, i) => {
                    gsap.from(el, {
                        y: 70,
                        rotate: i % 2 === 0 ? -6 : 6,
                        autoAlpha: 0,
                        duration: 1.1,
                        ease: "expo.out",
                        scrollTrigger: { trigger: el, start: "top 85%", once: true },
                    });
                });
                gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(el => {
                    gsap.from(el, {
                        y: 30,
                        autoAlpha: 0,
                        duration: 0.9,
                        ease: "expo.out",
                        scrollTrigger: { trigger: el, start: "top 88%", once: true },
                    });
                });
            });
        }, rootRef);

        return () => ctx.revert();
    }, [isMounted]);

    // Update progress when it changes
    useEffect(() => {
        if (!isMounted) return;

        const updateProgress = () => {
            setProgress(progressManager.getProgress());
        };

        updateProgress();

        // Update on storage events (in case another tab changes the progress)
        window.addEventListener("storage", updateProgress);

        return () => {
            window.removeEventListener("storage", updateProgress);
        };
    }, [progressManager, isMounted]);

    // Check for first visit and show difficulty selector
    useEffect(() => {
        if (!isMounted) return;

        const hasVisitedBefore = localStorage.getItem("gitgud-has-visited");
        const hasSelectedDifficulty = localStorage.getItem("gitgud-difficulty");

        // Show difficulty selector if it's the first visit OR no difficulty has been selected
        if (!hasVisitedBefore || !hasSelectedDifficulty) {
            setIsFirstVisit(true);
            setShowDifficultySelector(true);
            localStorage.setItem("gitgud-has-visited", "true");
        }
    }, [isMounted]);

    // Get all stages with translated content - filtered by difficulty
    const allStages = levelManager.getAllStages(t);
    const availableStageIds = getAvailableStagesForDifficulty(currentDifficulty);
    const stages = Object.fromEntries(
        Object.entries(allStages).filter(([stageId]) => availableStageIds.includes(stageId)),
    );

    // Navigation function to use correct URL structure for [level] dynamic route
    const navigateToLevel = (stageId: string, levelId: number) => {
        router.push(`/${stageId.toLowerCase()}?stage=${stageId}&level=${levelId}`);
    };

    const getStageIcon = (stageId: string) => {
        const cls = "h-6 w-6 sm:h-7 sm:w-7";
        switch (stageId) {
            case "Intro":
                return <Rocket className={cls} aria-hidden="true" />;
            case "Branches":
                return <GitBranch className={cls} aria-hidden="true" />;
            case "Merge":
                return <GitMerge className={cls} aria-hidden="true" />;
            case "Rebase":
                return <Activity className={cls} aria-hidden="true" />;
            case "Remote":
                return <Github className={cls} aria-hidden="true" />;
            default:
                return <GitCommit className={cls} aria-hidden="true" />;
        }
    };

    // Check if a stage is unlocked
    const isStageUnlocked = (stageId: string) => {
        if (stageId === "Intro") return true;

        const stageOrder = Object.keys(stages);
        const stageIndex = stageOrder.indexOf(stageId);

        if (stageIndex <= 0) return true;

        const previousStage = stageOrder[stageIndex - 1];
        if (!previousStage) return true;

        // Stage is unlocked if at least one level of the previous stage is completed
        return (progress.completedLevels[previousStage]?.length ?? 0) > 0;
    };

    // Check if a level is unlocked
    const isLevelUnlocked = (stageId: string, levelId: number) => {
        if (!isStageUnlocked(stageId)) return false;

        if (levelId === 1) return true;

        // Level is unlocked if the previous level is completed
        return progressManager.isLevelCompleted(stageId, levelId - 1);
    };

    // Check if a level is completed
    const isLevelCompleted = (stageId: string, levelId: number) => {
        return progressManager.isLevelCompleted(stageId, levelId);
    };

    // Check if current difficulty is completed
    const isDifficultyCompleted = () => {
        const availableStageIds = getAvailableStagesForDifficulty(currentDifficulty);
        return availableStageIds.every(stageId => {
            const stageData = stages[stageId];
            if (!stageData) return false;
            const totalLevels = Object.keys(stageData.levels).length;
            const completedLevels = progress.completedLevels[stageId]?.length ?? 0;
            return completedLevels === totalLevels;
        });
    };

    // Get next difficulty level
    const getNextDifficulty = (): DifficultyLevel | null => {
        const difficultyOrder: DifficultyLevel[] = ["beginner", "advanced", "pro"];
        const currentIndex = difficultyOrder.indexOf(currentDifficulty);
        if (currentIndex >= 0 && currentIndex < difficultyOrder.length - 1) {
            return difficultyOrder[currentIndex + 1]!;
        }
        return null;
    };

    // Calculate progress percentage
    const calculateProgress = (stageId: string) => {
        const stageLevels = Object.keys(stages[stageId]?.levels ?? {}).length;
        const completedLevels = progress.completedLevels[stageId]?.length ?? 0;

        return stageLevels > 0 ? (completedLevels / stageLevels) * 100 : 0;
    };

    //Changes learning path heading based on difficulty (and language)
    function learningPathHeading(): string {
        const headingKey = `home.learningPath.${currentDifficulty}`;
        const translatedHeading = t(headingKey);
        return translatedHeading === headingKey ? t("home.learningPath.default") : translatedHeading;
    }

    const completedCount = Object.values(progress.completedLevels).flat().length;
    const nextDifficulty = getNextDifficulty();

    const features = [
        {
            key: "sandbox",
            title: t("home.feature1.title"),
            description: t("home.feature1.description"),
            shadow: "shadow-[12px_12px_0_0_var(--color-gm-lime)]",
            tilt: "-rotate-2",
            action: (
                <Link href="/playground" className="btn-arcade btn-arcade-sm btn-arcade-night">
                    <TerminalSquare className="text-gm-lime h-4 w-4" aria-hidden="true" />
                    {t("nav.playground")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </Link>
            ),
            visual: (
                <div className="p-5 [font-family:var(--font-code)] text-[13px] leading-[1.75] sm:p-7 sm:text-sm">
                    <p className="text-gm-ink">
                        <span className="text-gm-lime">$ </span>git reset --hard HEAD~3
                    </p>
                    <p className="text-gm-coral">HEAD is now at 1c0ffee initial commit</p>
                    <p className="text-gm-ink mt-2">
                        <span className="text-gm-lime">$ </span>git reflog
                    </p>
                    <p className="text-gm-ink-dim">
                        <span className="text-gm-gold">3e9a0b2</span> HEAD@&#123;1&#125;: commit: fix typo
                    </p>
                    <p className="text-gm-ink mt-2">
                        <span className="text-gm-lime">$ </span>git reset --hard HEAD@&#123;1&#125;
                    </p>
                    <p className="text-gm-lime">HEAD is now at 3e9a0b2 fix typo ✓</p>
                    <p className="text-gm-ink mt-2">
                        <span className="text-gm-lime">$ </span>
                        <span className="animate-caret bg-gm-lime inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] motion-reduce:animate-none"></span>
                    </p>
                </div>
            ),
        },
        {
            key: "games",
            title: t("home.feature2.title"),
            description: t("home.feature2.description"),
            shadow: "shadow-[12px_12px_0_0_var(--color-gm-coral)]",
            tilt: "rotate-2",
            action: (
                <button
                    type="button"
                    onClick={() => setShowMinigames(true)}
                    className="btn-arcade btn-arcade-sm btn-arcade-night">
                    <Gamepad2 className="text-gm-coral h-4 w-4" aria-hidden="true" />
                    {t("home.miniGames")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </button>
            ),
            visual: (
                <ul className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6">
                    {MINIGAMES.map((game, i) => (
                        <li
                            key={game.id}
                            className={`flex flex-col gap-3 rounded-2xl border-2 p-4 ${
                                [
                                    "border-gm-cyan/50 text-gm-cyan",
                                    "border-gm-coral/50 text-gm-coral",
                                    "border-gm-lime/50 text-gm-lime",
                                    "border-gm-gold/50 text-gm-gold",
                                ][i % 4]
                            }`}>
                            <span aria-hidden="true">{game.icon}</span>
                            <span className="text-gm-ink text-sm leading-snug font-semibold">{t(game.nameKey)}</span>
                            <span className="text-gm-gold mt-auto flex items-center gap-1 text-xs font-semibold">
                                <Coins className="h-3.5 w-3.5" aria-hidden="true" />+{game.coins}
                            </span>
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            key: "shop",
            title: t("home.feature3.title"),
            description: t("home.feature3.description"),
            shadow: "shadow-[12px_12px_0_0_var(--color-gm-gold)]",
            tilt: "-rotate-1",
            action: (
                <button
                    type="button"
                    onClick={() => setShowShop(true)}
                    className="btn-arcade btn-arcade-sm btn-arcade-night">
                    <ShoppingCart className="text-gm-gold h-4 w-4" aria-hidden="true" />
                    {t("home.shop")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </button>
            ),
            visual: (
                <div className="group/themes relative h-[248px] sm:h-[280px]">
                    {[
                        {
                            name: t("shop.item.darkTerminal.name"),
                            bg: "bg-[oklch(0.2_0.03_250)]",
                            ink: "text-[oklch(0.8_0.12_240)]",
                            pos: "left-[6%] top-[14%] -rotate-[8deg] group-hover/themes:-translate-x-3 group-hover/themes:-rotate-[11deg]",
                        },
                        {
                            name: t("shop.item.matrixTerminal.name"),
                            bg: "bg-[oklch(0.14_0.02_150)]",
                            ink: "text-[oklch(0.85_0.2_145)]",
                            pos: "left-[22%] top-[24%] rotate-[2deg]",
                        },
                        {
                            name: t("shop.item.goldenTerminal.name"),
                            bg: "bg-[oklch(0.26_0.05_80)]",
                            ink: "text-gm-gold",
                            pos: "left-[38%] top-[36%] rotate-[9deg] group-hover/themes:translate-x-3 group-hover/themes:rotate-[12deg]",
                        },
                    ].map(theme => (
                        <div
                            key={theme.name}
                            className={`border-gm-void/70 absolute w-[56%] overflow-hidden rounded-xl border-2 shadow-[0_10px_24px_-8px_rgb(0_0_0/0.6)] transition-transform duration-500 ease-[var(--ease-out-expo)] ${theme.bg} ${theme.pos}`}>
                            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                                <span className="h-2 w-2 rounded-full bg-white/30"></span>
                                <span className="h-2 w-2 rounded-full bg-white/30"></span>
                                <span className="h-2 w-2 rounded-full bg-white/30"></span>
                            </div>
                            <div
                                className={`px-3 py-3 [font-family:var(--font-code)] text-xs leading-relaxed ${theme.ink}`}>
                                <p>$ git gud</p>
                                <p className="truncate opacity-80">{theme.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <PageLayout>
            <div ref={rootRef} className="bg-gm-void text-gm-ink min-h-screen overflow-x-clip">
                {/* ── Hero: title screen ───────────────────────────────────── */}
                <section className="hero-section relative isolate overflow-hidden">
                    <HeroBackdrop />

                    <div className="container mx-auto grid min-h-[calc(100svh-4rem)] items-center gap-12 px-4 pt-14 pb-24 sm:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-28">
                        <div className="max-w-[40rem] text-center lg:text-start">
                            <h1 className="font-display text-gm-ink text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.98] tracking-[0.01em] [text-wrap:balance] break-words">
                                {t("home.title")
                                    .split(" ")
                                    .map((word, i) => (
                                        <span
                                            key={i}
                                            className="hero-word inline-block overflow-hidden pb-[0.08em] align-bottom">
                                            <span className="inline-block">{word}&nbsp;</span>
                                        </span>
                                    ))}
                                <span className="mt-[0.18em] block">
                                    <span className="hero-play bg-gm-lime text-gm-void inline-block -rotate-3 rounded-[0.3em] px-[0.28em] pt-[0.14em] pb-[0.04em] text-[1.3em] shadow-[0_0.12em_0_var(--color-gm-lime-edge)]">
                                        {t("home.title2")}
                                    </span>
                                </span>
                            </h1>

                            <p className="hero-sub text-gm-ink-soft mx-auto mt-8 max-w-[34rem] text-lg leading-relaxed text-pretty sm:text-xl lg:mx-0">
                                {t("home.subtitle")}
                            </p>

                            <div className="hero-cta mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center lg:justify-start">
                                <Link
                                    href="/intro"
                                    className="btn-arcade btn-arcade-lime group min-h-[3.75rem] px-7 text-lg">
                                    <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                                    {t("home.startLearning")}
                                    <ArrowRight
                                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
                                        aria-hidden="true"
                                    />
                                </Link>
                                <Link
                                    href="/playground"
                                    className="btn-arcade btn-arcade-grape min-h-[3.75rem] px-7 text-lg">
                                    <TerminalSquare className="h-5 w-5" aria-hidden="true" />
                                    {t("home.cheatSheet")}
                                </Link>
                            </div>

                            {/* Secondary actions: the only entry points to the difficulty picker,
                                shop and mini games, so they stay solid and legible over the video. */}
                            <div className="hero-cta mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                <button
                                    type="button"
                                    onClick={() => setShowDifficultySelector(true)}
                                    className="btn-arcade btn-arcade-sm btn-arcade-night">
                                    <Settings2 className="text-gm-grape-hi h-4 w-4" aria-hidden="true" />
                                    {t("home.difficulty")}
                                    <ClientOnly>
                                        <span className="bg-gm-grape text-gm-ink rounded-full px-2 py-0.5 text-xs font-semibold">
                                            {t(`difficulty.${currentDifficulty}`)}
                                        </span>
                                    </ClientOnly>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowShop(true)}
                                    className="btn-arcade btn-arcade-sm btn-arcade-night">
                                    <ShoppingCart className="text-gm-gold h-4 w-4" aria-hidden="true" />
                                    {t("home.shop")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowMinigames(true)}
                                    className="btn-arcade btn-arcade-sm btn-arcade-night">
                                    <Gamepad2 className="text-gm-lime h-4 w-4" aria-hidden="true" />
                                    {t("home.miniGames")}
                                </button>
                            </div>
                        </div>

                        <div className="hero-panel mx-auto w-full max-w-[30rem] lg:ms-auto lg:me-0">
                            <div className="hero-tilt">
                                <HeroDemo title={t("home.heroTerminalTitle")} label={t("home.demoLabel")} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Command ticker ───────────────────────────────────────── */}
                <div
                    className="border-gm-lime-edge bg-gm-lime relative z-10 -mx-[5%] -mt-10 -rotate-2 overflow-hidden border-y-4 py-3.5 sm:py-4"
                    aria-hidden="true">
                    <Ticker className="font-display text-gm-void text-lg sm:text-2xl" />
                </div>

                {/* ── Player HUD ───────────────────────────────────────────── */}
                <section className="container mx-auto px-4 pt-20 pb-24 sm:pt-24">
                    <ClientOnly fallback={<div className="h-[104px]" />}>
                        <div className="hud border-gm-line bg-gm-night flex flex-col overflow-hidden rounded-[1.4rem] border-2 shadow-[0_6px_0_var(--color-gm-line)] md:flex-row md:items-stretch">
                            <dl className="grid flex-1 grid-cols-2 md:grid-cols-4">
                                {[
                                    {
                                        label: t("home.points"),
                                        value: progress.score,
                                        counter: true,
                                        icon: <Star className="h-5 w-5 fill-current" />,
                                        tone: "text-gm-gold bg-gm-gold/12",
                                    },
                                    {
                                        label: t("home.completed"),
                                        value: completedCount,
                                        counter: true,
                                        icon: <Check className="h-5 w-5" strokeWidth={3} />,
                                        tone: "text-gm-lime bg-gm-lime/12",
                                    },
                                    {
                                        label: t("level.level"),
                                        value: progress.currentLevel,
                                        counter: true,
                                        icon: <Award className="h-5 w-5" />,
                                        tone: "text-gm-coral bg-gm-coral/12",
                                    },
                                    {
                                        label: t("level.branch"),
                                        value: progress.currentStage,
                                        counter: false,
                                        icon: <GitBranch className="h-5 w-5" />,
                                        tone: "text-gm-cyan bg-gm-cyan/12",
                                    },
                                ].map((stat, i) => (
                                    <div
                                        key={stat.label}
                                        className={`border-gm-line flex min-w-0 items-center gap-3 px-5 py-5 ${i % 2 === 1 ? "border-s-2" : ""} ${i > 1 ? "border-t-2 md:border-t-0" : ""} ${i === 2 ? "md:border-s-2" : ""}`}>
                                        <span
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.tone}`}
                                            aria-hidden="true">
                                            {stat.icon}
                                        </span>
                                        <div className="min-w-0">
                                            <dt className="text-gm-ink-dim text-sm">{stat.label}</dt>
                                            <dd
                                                className="font-display text-gm-ink truncate text-2xl tabular-nums"
                                                {...(stat.counter ? { "data-counter": stat.value } : {})}>
                                                {stat.value}
                                            </dd>
                                        </div>
                                    </div>
                                ))}
                            </dl>
                            <div className="border-gm-line flex items-center border-t-2 p-4 md:border-s-2 md:border-t-0 md:px-6">
                                <button
                                    type="button"
                                    onClick={() => navigateToLevel(progress.currentStage, progress.currentLevel)}
                                    className="btn-arcade btn-arcade-lime group w-full whitespace-nowrap md:w-auto">
                                    <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                                    {t("home.continue")}
                                </button>
                            </div>
                        </div>
                    </ClientOnly>
                </section>

                {/* Difficulty completion celebration */}
                {isMounted && isDifficultyCompleted() && nextDifficulty && (
                    <section className="container mx-auto px-4 pb-20" data-reveal>
                        <div className="border-gm-lime-edge bg-gm-night mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[1.4rem] border-2 p-8 text-center shadow-[10px_10px_0_0_var(--color-gm-lime)] sm:p-10">
                            <Award className="text-gm-gold h-12 w-12" aria-hidden="true" />
                            <h2 className="font-display text-gm-ink text-2xl sm:text-3xl">Difficulty Mastered!</h2>
                            <p className="text-gm-ink-soft max-w-prose">
                                Congratulations! You&apos;ve completed all levels in {currentDifficulty} difficulty.
                                Ready for the next challenge?
                            </p>
                            <button
                                type="button"
                                onClick={() => setCurrentDifficulty(nextDifficulty)}
                                className="btn-arcade btn-arcade-lime">
                                Advance to {nextDifficulty} Difficulty
                                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                            </button>
                        </div>
                    </section>
                )}

                {/* ── Stage map ────────────────────────────────────────────── */}
                <section className="path-section bg-gm-grape relative py-24 [clip-path:polygon(0_2.5vw,100%_0,100%_calc(100%-2.5vw),0_100%)] sm:py-32">
                    {/* Dot-matrix texture */}
                    <div
                        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(var(--color-gm-grape-edge)_1.5px,transparent_1.6px)] [background-size:22px_22px] opacity-60"
                        aria-hidden="true"></div>

                    <div className="relative container mx-auto px-4">
                        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
                            <h2 className="font-display text-gm-ink max-w-3xl text-[clamp(1.8rem,4.6vw,3.6rem)] leading-[1.02] [text-wrap:balance] [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                                {learningPathHeading()}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowDifficultySelector(true)}
                                className="btn-arcade btn-arcade-sm btn-arcade-night">
                                <Settings2 className="text-gm-grape-hi h-4 w-4" aria-hidden="true" />
                                {t("home.difficulty")}
                                <ClientOnly>
                                    <span className="bg-gm-grape text-gm-ink rounded-full px-2 py-0.5 text-xs font-semibold">
                                        {t(`difficulty.${currentDifficulty}`)}
                                    </span>
                                </ClientOnly>
                            </button>
                        </div>

                        <ClientOnly>
                            <ol className="stage-list relative mt-14 sm:mt-20">
                                {/* The main lane; fills with lime as you scroll */}
                                <div
                                    className="bg-gm-grape-edge absolute start-[26px] top-2 bottom-2 w-2 -translate-x-1/2 overflow-hidden rounded-full sm:start-[36px] rtl:translate-x-1/2"
                                    aria-hidden="true">
                                    <div className="lane-fill bg-gm-lime h-full w-full origin-top"></div>
                                </div>

                                {Object.entries(stages).map(([stageId, stageData], index) => {
                                    const isUnlocked = isStageUnlocked(stageId);
                                    const totalLevels = Object.keys(stageData.levels).length;
                                    const completedLevels = progress.completedLevels[stageId]?.length ?? 0;
                                    const progressPercent = calculateProgress(stageId);
                                    const isDone = totalLevels > 0 && completedLevels === totalLevels;
                                    const isCurrent = stageId === progress.currentStage;

                                    return (
                                        <li
                                            key={stageId}
                                            data-stage
                                            className="relative grid grid-cols-[52px_minmax(0,1fr)] gap-x-5 py-7 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-x-9 sm:py-10">
                                            {/* Station on the lane */}
                                            <div
                                                data-stage-node
                                                className={`relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border-4 sm:h-[72px] sm:w-[72px] ${
                                                    isDone
                                                        ? "border-gm-lime-edge bg-gm-lime text-gm-void"
                                                        : isUnlocked
                                                          ? "border-gm-ink bg-gm-night text-gm-ink"
                                                          : "border-gm-grape-edge bg-gm-grape text-gm-ink-soft"
                                                } ${isCurrent ? "outline-gm-lime outline-4 outline-offset-4" : ""}`}>
                                                {isUnlocked ? (
                                                    getStageIcon(stageId)
                                                ) : (
                                                    <Lock className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                                                )}
                                            </div>

                                            <div
                                                data-stage-body
                                                className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-center lg:gap-12">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                                        <span className="text-gm-ink-soft [font-family:var(--font-code)] text-sm tabular-nums">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>
                                                        {isCurrent && (
                                                            <span className="bg-gm-lime text-gm-void rounded-md px-2 py-0.5 [font-family:var(--font-code)] text-xs font-bold">
                                                                HEAD
                                                            </span>
                                                        )}
                                                        <span
                                                            className={`ms-auto flex items-center gap-1.5 text-sm font-semibold tabular-nums lg:ms-0 ${isDone ? "text-gm-lime" : "text-gm-ink-soft"}`}>
                                                            <Award className="h-4 w-4" aria-hidden="true" />
                                                            {completedLevels}/{totalLevels}
                                                        </span>
                                                    </div>
                                                    <h3
                                                        className={`font-display mt-2 text-[clamp(1.3rem,5.4vw,2.5rem)] leading-[1.05] [overflow-wrap:anywhere] sm:[overflow-wrap:normal] ${isUnlocked ? "text-gm-ink" : "text-gm-ink-soft"}`}>
                                                        {stageData.name}
                                                    </h3>
                                                    <p
                                                        className={`text-gm-ink-soft mt-3 max-w-[52ch] text-base leading-relaxed sm:text-lg`}>
                                                        {stageData.description}
                                                    </p>
                                                    <div
                                                        className="bg-gm-grape-edge mt-5 h-2.5 w-full max-w-md overflow-hidden rounded-full"
                                                        role="progressbar"
                                                        aria-valuemin={0}
                                                        aria-valuemax={totalLevels}
                                                        aria-valuenow={completedLevels}
                                                        aria-label={stageData.name}>
                                                        <div
                                                            className="bg-gm-lime h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-expo)]"
                                                            style={{ width: `${progressPercent}%` }}></div>
                                                    </div>
                                                </div>

                                                <ul className="flex flex-wrap gap-3">
                                                    {Object.keys(stageData.levels).map(levelId => {
                                                        const level = parseInt(levelId);
                                                        const levelUnlocked = isLevelUnlocked(stageId, level);
                                                        const levelCompleted = isLevelCompleted(stageId, level);
                                                        const state = levelCompleted
                                                            ? t("home.completed")
                                                            : levelUnlocked
                                                              ? t("home.startLevel")
                                                              : t("home.locked");

                                                        return (
                                                            <li key={levelId} data-level>
                                                                <button
                                                                    type="button"
                                                                    disabled={!levelUnlocked}
                                                                    onClick={() => navigateToLevel(stageId, level)}
                                                                    aria-label={`${t("level.level")} ${levelId}: ${state}`}
                                                                    title={`${t("level.level")} ${levelId}`}
                                                                    className={`font-display focus-visible:outline-gm-cyan relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-xl transition-[transform,box-shadow,filter] duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-3 focus-visible:outline-offset-4 ${
                                                                        levelCompleted
                                                                            ? "border-gm-lime-edge bg-gm-lime text-gm-void cursor-pointer shadow-[0_4px_0_var(--color-gm-lime-edge)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_var(--color-gm-lime-edge)] active:translate-y-[3px] active:shadow-[0_1px_0_var(--color-gm-lime-edge)]"
                                                                            : levelUnlocked
                                                                              ? "border-gm-grape-edge bg-gm-ink text-gm-grape-edge cursor-pointer shadow-[0_4px_0_var(--color-gm-grape-edge)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_var(--color-gm-grape-edge)] active:translate-y-[3px] active:shadow-[0_1px_0_var(--color-gm-grape-edge)]"
                                                                              : "border-gm-grape-edge/70 bg-gm-grape-edge/50 text-gm-ink-soft cursor-not-allowed"
                                                                    }`}>
                                                                    {levelUnlocked ? (
                                                                        levelId
                                                                    ) : (
                                                                        <Lock className="h-4 w-4" aria-hidden="true" />
                                                                    )}
                                                                    {levelCompleted && (
                                                                        <span className="border-gm-lime-edge bg-gm-void text-gm-lime absolute -end-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2">
                                                                            <Check
                                                                                className="h-3 w-3"
                                                                                strokeWidth={4}
                                                                                aria-hidden="true"
                                                                            />
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </ClientOnly>
                    </div>
                </section>

                {/* ── What's in the cartridge ──────────────────────────────── */}
                <section className="container mx-auto px-4 py-24 sm:py-32">
                    <h2
                        className="font-display text-gm-ink max-w-3xl text-[clamp(1.8rem,4.6vw,3.6rem)] leading-[1.02] [text-wrap:balance] [overflow-wrap:anywhere] sm:[overflow-wrap:normal]"
                        data-reveal>
                        {t("home.gameFeatures")}
                    </h2>

                    <div className="mt-16 flex flex-col gap-20 sm:mt-20 sm:gap-28">
                        {features.map((feature, i) => (
                            <article
                                key={feature.key}
                                className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
                                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                                    <div
                                        data-cart
                                        className={`border-gm-line bg-gm-night overflow-hidden rounded-[1.6rem] border-2 ${feature.shadow} ${feature.tilt} transition-transform duration-500 ease-[var(--ease-out-expo)] hover:rotate-0`}
                                        aria-hidden="true">
                                        {feature.visual}
                                    </div>
                                </div>
                                <div className="max-w-[34rem]" data-reveal>
                                    <h3 className="font-display text-gm-ink text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.05] [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gm-ink-soft mt-4 text-lg leading-relaxed text-pretty">
                                        {feature.description}
                                    </p>
                                    <div className="mt-7">{feature.action}</div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ── Creators who posted about it ─────────────────────────── */}
                <section className="container mx-auto px-4 pb-24 sm:pb-32">
                    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3" data-reveal>
                        <h2 className="font-display text-gm-ink max-w-2xl text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.05] [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                            {t("home.featured.title")}
                        </h2>
                        <p className="text-gm-ink-dim max-w-sm text-sm">{t("home.featured.note")}</p>
                    </div>

                    <div className="mt-8 sm:mt-10" data-reveal>
                        <FeaturedReels />
                    </div>
                </section>

                {/* ── Final call: insert coin ──────────────────────────────── */}
                <section className="border-gm-line bg-gm-night relative isolate overflow-hidden border-t-2 py-28 sm:py-36">
                    <div
                        className="pointer-events-none absolute inset-0 -z-10 flex -rotate-6 flex-col justify-center gap-4 opacity-[0.55] select-none"
                        aria-hidden="true">
                        <Ticker className="font-display text-gm-deep text-[clamp(3rem,9vw,7rem)]" />
                        <Ticker reverse className="font-display text-gm-deep text-[clamp(3rem,9vw,7rem)]" />
                    </div>

                    <div className="container mx-auto flex flex-col items-center px-4 text-center" data-reveal>
                        <h2 className="font-display text-gm-ink max-w-4xl text-[clamp(1.8rem,7.5vw,5rem)] leading-[1] [text-wrap:balance] [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                            {t("home.chooseChallenge")}
                        </h2>
                        <p className="text-gm-ink-soft mt-6 max-w-[40rem] text-lg leading-relaxed text-pretty">
                            {t("home.subtitle")}
                        </p>
                        <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center">
                            <Link
                                href="/intro"
                                className="btn-arcade btn-arcade-lime group min-h-[3.75rem] px-8 text-lg">
                                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                                {t("home.startLearning")}
                                <ArrowRight
                                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
                                    aria-hidden="true"
                                />
                            </Link>
                            <button
                                type="button"
                                onClick={() => setShowDifficultySelector(true)}
                                className="btn-arcade btn-arcade-grape min-h-[3.75rem] px-8 text-lg">
                                <Settings2 className="h-5 w-5" aria-hidden="true" />
                                {t("home.difficulty")}
                            </button>
                        </div>

                        {/* The ask, kept quiet: one line of fact, one link. The dialog does the
                            explaining for anyone who taps it. */}
                        <p className="text-gm-ink-dim mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
                            {t("sponsor.landingLine")}
                            <button
                                type="button"
                                onClick={openSponsor}
                                className="text-gm-gold hover:text-gm-ink focus-visible:outline-gm-cyan inline-flex cursor-pointer items-center gap-1.5 rounded font-semibold underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2">
                                <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
                                {t("sponsor.landingCta")}
                            </button>
                        </p>
                    </div>
                </section>
            </div>

            <DifficultySelector
                isOpen={showDifficultySelector}
                onClose={() => {
                    setShowDifficultySelector(false);
                    setIsFirstVisit(false);
                }}
                isInitialSelection={isFirstVisit}
            />

            <Shop isOpen={showShop} onClose={() => setShowShop(false)} />

            <Minigames isOpen={showMinigames} onClose={() => setShowMinigames(false)} />
        </PageLayout>
    );
}
