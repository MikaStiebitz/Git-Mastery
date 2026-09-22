"use client";

import { Instagram, Play } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";

/**
 * Creators who posted about GitMastery on their own. The cards are drawn here rather than
 * embedded: Instagram's thumbnail URLs expire and its embed script would drag a third party
 * into the page, so each card is a link wearing the site's own vocabulary. No like or view
 * counts — they would be a hard-coded snapshot that rots, and Instagram doesn't expose view
 * counts to logged-out visitors at all.
 */
const REELS = [
    { handle: "softwarewithnick", url: "https://www.instagram.com/reel/DWoi-4RDliT/" },
    { handle: "softwarewithnick", url: "https://www.instagram.com/reel/DWojk9kgqUC/" },
    { handle: "staxx_ai", url: "https://www.instagram.com/reel/DXMVbNOEmWh/" },
    { handle: "shivaconceptsolution", url: "https://www.instagram.com/reel/DRcloKUDRAd/" },
];

export function FeaturedReels() {
    const { t } = useLanguage();

    return (
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {REELS.map(reel => (
                <li key={reel.url}>
                    <a
                        href={reel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t("home.featured.watch")} — @${reel.handle}`}
                        className="group border-gm-line bg-gm-night focus-visible:outline-gm-cyan hover:border-gm-grape-hi block overflow-hidden rounded-[1.4rem] border-2 shadow-[0_5px_0_var(--color-gm-line)] transition-[transform,box-shadow,border-color] duration-150 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_9px_0_var(--color-gm-line)] focus-visible:outline-3 focus-visible:outline-offset-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                        {/* The screen: the site's own dot grid, with the play key as the subject */}
                        <div className="bg-gm-void relative flex aspect-4/5 items-center justify-center [background-image:radial-gradient(var(--color-gm-line)_1.5px,transparent_1.6px)] [background-size:18px_18px]">
                            <Instagram
                                className="text-gm-ink-dim group-hover:text-gm-ink absolute end-3 top-3 h-4 w-4 transition-colors duration-150"
                                aria-hidden="true"
                            />
                            <span className="border-gm-lime-edge bg-gm-lime text-gm-void flex h-14 w-14 items-center justify-center rounded-[1rem] border-2 shadow-[0_4px_0_var(--color-gm-lime-edge)] transition-transform duration-150 ease-[var(--ease-out-expo)] group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                                <Play className="ms-0.5 h-6 w-6 fill-current" aria-hidden="true" />
                            </span>
                        </div>

                        {/* The handle is the whole point of the card, so it wraps instead of
                            being cut off on a narrow phone. */}
                        <p className="border-gm-line text-gm-ink border-t-2 px-3 py-2.5 [font-family:var(--font-code)] text-[13px] leading-snug font-semibold [overflow-wrap:anywhere]">
                            @{reel.handle}
                        </p>
                    </a>
                </li>
            ))}
        </ul>
    );
}
