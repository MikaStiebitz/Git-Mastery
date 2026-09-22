"use client";

import { Instagram, Play } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";

/**
 * Creators who posted about GitMastery on their own.
 *
 * The cards are drawn here rather than embedded, and they deliberately carry no imagery from
 * Instagram: thumbnails and profile pictures are signed URLs that expire, and re-hosting them
 * would mean copying someone else's protected work (and, for a profile picture, their likeness)
 * onto our own server. What the cards do carry is a short quote from the post itself, with the
 * handle and a link back — attribution, not appropriation. Quotes stay in the language they
 * were posted in.
 */
const REELS = [
    {
        handle: "softwarewithnick",
        quote: "Master git easily 😎",
        url: "https://www.instagram.com/reel/DWoi-4RDliT/",
    },
    {
        handle: "softwarewithnick",
        quote: "Master git easily 😎",
        url: "https://www.instagram.com/reel/DWojk9kgqUC/",
    },
    {
        handle: "staxx_ai",
        quote: "Website no one really talks about… but should 👀",
        url: "https://www.instagram.com/reel/DXMVbNOEmWh/",
    },
    {
        handle: "shivaconceptsolution",
        quote: "Want to master Git without crying over lost commits ever again? 😭",
        url: "https://www.instagram.com/reel/DRcloKUDRAd/",
    },
];

export function FeaturedReels() {
    const { t } = useLanguage();

    return (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {REELS.map(reel => (
                <li key={reel.url}>
                    <a
                        href={reel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t("home.featured.watch")} — @${reel.handle}`}
                        className="group border-gm-line bg-gm-night focus-visible:outline-gm-cyan hover:border-gm-grape-hi flex h-full flex-col overflow-hidden rounded-[1.4rem] border-2 shadow-[0_5px_0_var(--color-gm-line)] transition-[transform,box-shadow,border-color] duration-150 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_9px_0_var(--color-gm-line)] focus-visible:outline-3 focus-visible:outline-offset-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                        <figure className="m-0 flex h-full flex-col">
                            <div className="bg-gm-void relative flex flex-1 flex-col justify-between gap-5 [background-image:radial-gradient(var(--color-gm-line)_1.5px,transparent_1.6px)] [background-size:18px_18px] p-5">
                                <Instagram
                                    className="text-gm-ink-dim group-hover:text-gm-ink h-5 w-5 transition-colors duration-150"
                                    aria-hidden="true"
                                />

                                <blockquote className="text-gm-ink m-0 text-[15px] leading-snug font-semibold text-pretty">
                                    &ldquo;{reel.quote}&rdquo;
                                </blockquote>

                                <span className="border-gm-lime-edge bg-gm-lime text-gm-void flex h-12 w-12 items-center justify-center rounded-[0.9rem] border-2 shadow-[0_4px_0_var(--color-gm-lime-edge)] transition-transform duration-150 ease-[var(--ease-out-expo)] group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                                    <Play className="ms-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                                </span>
                            </div>

                            <figcaption className="border-gm-line text-gm-ink border-t-2 px-4 py-3 [font-family:var(--font-code)] text-[13px] leading-snug font-semibold [overflow-wrap:anywhere]">
                                @{reel.handle}
                            </figcaption>
                        </figure>
                    </a>
                </li>
            ))}
        </ul>
    );
}
