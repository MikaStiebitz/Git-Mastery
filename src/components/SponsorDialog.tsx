"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { Coffee, Github, Heart, Server, Sparkles, Unlock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useLanguage } from "~/contexts/LanguageContext";

const GITHUB_SPONSORS_URL = "https://github.com/sponsors/MikaStiebitz";
const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/mika.stiebitz";

interface SponsorContextValue {
    openSponsor: () => void;
}

const SponsorContext = createContext<SponsorContextValue | null>(null);

/** Opens the sponsor dialog from anywhere inside the layout (navbar, footer, landing page). */
export function useSponsor(): SponsorContextValue {
    const context = useContext(SponsorContext);
    if (!context) {
        throw new Error("useSponsor must be used inside <SponsorProvider>");
    }
    return context;
}

/**
 * The ask, in one place. Money is gold in this system, so the whole dialog is gold — the one
 * surface where gold means real support rather than in-game coins. Every line explains what a
 * sponsorship actually pays for; the note makes clear that nothing here is required to play.
 */
function SponsorContent() {
    const { t } = useLanguage();
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        // A stalled ticker (hidden tab, headless renderer) must never leave the ask blank, so the
        // entrance only moves things that are already painted — it never fades them in from zero.
        if (document.visibilityState !== "visible") return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const moved =
                    "[data-sponsor-heart], [data-sponsor-head] > *, [data-sponsor-reason], [data-sponsor-cta] > *";
                const tl = gsap.timeline({
                    defaults: { ease: "expo.out" },
                    onComplete: () => gsap.set(moved, { clearProps: "all" }),
                });
                tl.from("[data-sponsor-heart]", { scale: 0.4, rotate: -12, duration: 0.7 })
                    .fromTo(
                        "[data-sponsor-ring]",
                        { scale: 0.6, autoAlpha: 0.6 },
                        { scale: 1.9, autoAlpha: 0, duration: 1.1, ease: "power2.out" },
                        0.1,
                    )
                    .from("[data-sponsor-head] > *", { y: 14, duration: 0.55, stagger: 0.07 }, 0.15)
                    .from("[data-sponsor-reason]", { x: 18, duration: 0.5, stagger: 0.08 }, 0.3)
                    .from("[data-sponsor-cta] > *", { y: 16, duration: 0.5, stagger: 0.08 }, 0.45);
            });
        }, root);

        return () => ctx.revert();
    }, []);

    const reasons = [
        { icon: Server, label: t("sponsor.hosting") },
        { icon: Sparkles, label: t("sponsor.development") },
        { icon: Unlock, label: t("sponsor.openSource") },
    ];

    return (
        <div ref={rootRef}>
            <DialogHeader data-sponsor-head>
                <span className="relative mb-1 flex h-14 w-14 items-center justify-center" aria-hidden="true">
                    <span
                        data-sponsor-ring
                        className="border-gm-gold absolute inset-0 rounded-[1rem] border-2 opacity-0"></span>
                    <span
                        data-sponsor-heart
                        className="border-gm-gold-edge bg-gm-gold text-gm-void flex h-14 w-14 items-center justify-center rounded-[1rem] border-2">
                        <Heart className="h-7 w-7 fill-current" />
                    </span>
                </span>
                <DialogTitle>{t("sponsor.title")}</DialogTitle>
                <DialogDescription className="text-base">{t("sponsor.lead")}</DialogDescription>
            </DialogHeader>

            <ul className="mt-6 flex flex-col gap-2.5">
                {reasons.map(({ icon: Icon, label }) => (
                    <li
                        key={label}
                        data-sponsor-reason
                        className="gm-inset text-gm-ink-soft flex items-center gap-3 px-3.5 py-3 text-sm leading-snug">
                        <Icon className="text-gm-gold h-5 w-5 shrink-0" aria-hidden="true" />
                        {label}
                    </li>
                ))}
            </ul>

            <div data-sponsor-cta className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                    href={GITHUB_SPONSORS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-arcade btn-arcade-gold btn-arcade-sm flex-1">
                    <Github className="h-4 w-4" aria-hidden="true" />
                    {t("sponsor.github")}
                </a>
                <a
                    href={BUY_ME_A_COFFEE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-arcade btn-arcade-night btn-arcade-sm flex-1">
                    <Coffee className="text-gm-gold h-4 w-4" aria-hidden="true" />
                    {t("sponsor.coffee")}
                </a>
            </div>

            <p className="text-gm-ink-dim mt-4 text-center text-xs">{t("sponsor.note")}</p>
        </div>
    );
}

export function SponsorProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SponsorContext.Provider value={{ openSponsor: () => setIsOpen(true) }}>
            {children}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">{isOpen && <SponsorContent />}</DialogContent>
            </Dialog>
        </SponsorContext.Provider>
    );
}
