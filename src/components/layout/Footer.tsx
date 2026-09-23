import { Heart, GitBranch, Github, BookCopy, Gamepad2, Download, HelpCircle, Home, Scale } from "lucide-react";
import { useSponsor } from "../SponsorDialog";
import Link from "next/link";
import { useLanguage } from "~/contexts/LanguageContext";
import { ProTipDisplay } from "../ProTipDisplay";

interface FooterProps {
    className?: string;
}

/**
 * The footer is the second door into the app, not a legal afterthought: every destination
 * that the top bar collapses on a phone is reachable here, next to the repository link.
 */
export function Footer({ className = "" }: FooterProps) {
    const { t } = useLanguage();
    const { openSponsor } = useSponsor();

    const links = [
        { href: "/", label: t("nav.home"), icon: Home },
        { href: "/playground", label: t("nav.playground"), icon: BookCopy },
        { href: "/arcade", label: t("nav.arcade"), icon: Gamepad2 },
        { href: "/installation", label: t("nav.installation"), icon: Download },
        { href: "/faq", label: t("nav.faq"), icon: HelpCircle },
    ];

    return (
        <footer className={`bg-gm-void mt-auto ${className}`}>
            {/* Pro Tips Bar - only shows if purchased */}
            <ProTipDisplay />

            <div className="border-gm-line border-t-2">
                <div className="container mx-auto grid gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                    {/* Mark and sign-off */}
                    <div className="max-w-sm">
                        <Link
                            href="/"
                            className="group focus-visible:outline-gm-cyan inline-flex items-center gap-2 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-4">
                            <span className="border-gm-grape-edge bg-gm-grape text-gm-ink group-hover:border-gm-lime-edge group-hover:bg-gm-lime group-hover:text-gm-void flex h-9 w-9 items-center justify-center rounded-[0.7rem] border-2 transition-colors duration-150">
                                <GitBranch className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span className="font-display text-gm-ink text-lg">GitMastery</span>
                        </Link>
                    </div>

                    {/* Destinations */}
                    <nav aria-label={t("nav.home")}>
                        <ul className="flex flex-col gap-1">
                            {links.map(({ href, label, icon: Icon }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-gm-ink-soft hover:text-gm-lime focus-visible:outline-gm-cyan -ms-2 inline-flex min-h-9 items-center gap-2.5 rounded-[0.7rem] px-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-3 focus-visible:-outline-offset-2">
                                        <Icon className="text-gm-ink-dim h-4 w-4" aria-hidden="true" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Project */}
                    <div className="flex flex-col gap-1">
                        <a
                            href="https://github.com/MikaStiebitz/Git-Mastery"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gm-ink-soft hover:text-gm-lime focus-visible:outline-gm-cyan -ms-2 inline-flex min-h-9 items-center gap-2.5 rounded-[0.7rem] px-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-3 focus-visible:-outline-offset-2">
                            <Github className="text-gm-ink-dim h-4 w-4" aria-hidden="true" />
                            GitHub
                        </a>
                        <button
                            type="button"
                            onClick={openSponsor}
                            className="text-gm-ink-soft hover:text-gm-gold focus-visible:outline-gm-cyan -ms-2 inline-flex min-h-9 cursor-pointer items-center gap-2.5 rounded-[0.7rem] px-2 text-start text-sm font-semibold transition-colors duration-150 focus-visible:outline-3 focus-visible:-outline-offset-2">
                            <Heart className="text-gm-gold h-4 w-4" aria-hidden="true" />
                            {t("sponsor.action")}
                        </button>
                        <Link
                            href="/impressum"
                            className="text-gm-ink-soft hover:text-gm-lime focus-visible:outline-gm-cyan -ms-2 inline-flex min-h-9 items-center gap-2.5 rounded-[0.7rem] px-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-3 focus-visible:-outline-offset-2">
                            <Scale className="text-gm-ink-dim h-4 w-4" aria-hidden="true" />
                            {t("footer.legalNotice")}
                        </Link>
                    </div>
                </div>

                <div className="border-gm-line border-t-2">
                    <p className="text-gm-ink-dim container mx-auto flex flex-wrap items-center justify-center gap-1 px-4 py-4 text-center text-xs">
                        Git Mastery — made with
                        <Heart className="fill-gm-coral text-gm-coral h-3.5 w-3.5" aria-hidden="true" />
                        by
                        <Link
                            className="text-gm-ink-soft hover:text-gm-lime focus-visible:outline-gm-cyan rounded font-semibold underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2"
                            href="https://github.com/MikaStiebitz">
                            Mika Stiebitz
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
