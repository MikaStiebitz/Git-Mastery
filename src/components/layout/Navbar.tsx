import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import {
    Coins,
    Heart,
    Trophy,
    GitBranch,
    Terminal,
    BookCopy,
    Home,
    Code,
    Languages,
    Menu,
    X,
    Github,
    Star,
    Download,
    HelpCircle,
    Settings,
    Check,
    Gamepad2,
} from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { ClientOnly } from "~/components/ClientOnly";
import { allStages } from "~/levels";
import { BadgeDisplay } from "~/components/BadgeDisplay";
import { DebugModal } from "~/components/DebugModal";
import { cn } from "~/lib/utils";
import { useSponsor } from "~/components/SponsorDialog";
import { ProgressManager } from "~/models/ProgressManager";
import { env } from "~/env";

interface NavbarProps {
    showLevelInfo?: boolean;
}

export function Navbar({ showLevelInfo = false }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const {
        currentStage,
        currentLevel,
        progressManager,
        debugGiveMoney,
        debugUnlockAllLevels,
        debugLockAllLevels,
        debugCompleteCurrentLevel,
    } = useGameContext();
    const { language, setLanguage, t } = useLanguage();
    const { openSponsor } = useSponsor();
    const stageName = t(allStages[currentStage as keyof typeof allStages]?.name ?? currentStage);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [repoStars, setRepoStars] = useState<number | null>(null);
    const [debugModalOpen, setDebugModalOpen] = useState(false);
    const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
    const [purse, setPurse] = useState({ score: 0, coins: 0 });

    // Determine which page we're on
    const normalizedPathname = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const isHomePage = normalizedPathname === "/";
    const isPlaygroundPage = normalizedPathname === "/playground";
    const isInstallationPage = normalizedPathname === "/installation";
    const isFaqPage = normalizedPathname === "/faq";
    const isArcadePage = normalizedPathname === "/arcade";
    const useCompactResponsiveLayout =
        showLevelInfo || isPlaygroundPage || isInstallationPage || isFaqPage || isArcadePage;
    // Bumped one breakpoint tier up (lg->xl / xl->2xl): the Arcade nav item added one more
    // button to every layout, so the previous breakpoints no longer left enough room and
    // caused the level-info / page-label text to get squeezed and wrap.
    const desktopNavClass = useCompactResponsiveLayout ? "2xl:flex 2xl:flex-nowrap" : "xl:flex xl:flex-nowrap";
    const mobileNavClass = useCompactResponsiveLayout ? "2xl:hidden" : "xl:hidden";
    const badgeDesktopClass = useCompactResponsiveLayout ? "2xl:block" : "xl:block";
    const pageLabelClass = useCompactResponsiveLayout ? "2xl:block" : "xl:block";

    // Language options
    const languages = [
        { code: "en", name: "English", nativeName: "English" },
        { code: "de", name: "German", nativeName: "Deutsch" },
        { code: "es", name: "Spanish", nativeName: "Español" },
        { code: "fa", name: "Persian", nativeName: "فارسی" },
        { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
        { code: "tr", name: "Turkish", nativeName: "Türkçe" },
    ];

    const handleLanguageSelect = (langCode: "en" | "de" | "es" | "fa" | "hi" | "tr") => {
        setLanguage(langCode);
        setLanguageDialogOpen(false);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // The arcade readout: points earned and coins left to spend. ProgressManager announces
    // every write, so clearing a level or buying in the shop updates the bar immediately.
    useEffect(() => {
        const read = () => setPurse({ score: progressManager.getProgress().score, coins: progressManager.getCoins() });
        read();
        window.addEventListener(ProgressManager.CHANGE_EVENT, read);
        window.addEventListener("storage", read);
        return () => {
            window.removeEventListener(ProgressManager.CHANGE_EVENT, read);
            window.removeEventListener("storage", read);
        };
    }, [progressManager, pathname]);

    // A route change always closes the drawer; otherwise it stays open over the new page.
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Escape closes the drawer, like every other dismissible surface in the app.
    useEffect(() => {
        if (!mobileMenuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [mobileMenuOpen]);

    // Navigate to learning - use localStorage for current level
    const navigateToLearning = () => {
        const progress = progressManager.getProgress();
        const stageId = progress.currentStage;
        const levelId = progress.currentLevel;

        // Navigate to the current level from localStorage
        router.push(`/${stageId.toLowerCase()}?stage=${stageId}&level=${levelId}`);
    };

    // Debug functions
    const handleDebugNavigateToLevel = (stage: string, level: number) => {
        // Convert stage names to lowercase for URL routing
        const stageMap: { [key: string]: string } = {
            Intro: "intro",
            Files: "files",
            Branches: "branches",
            Workflow: "workflow",
            TeamWork: "teamwork",
            Merge: "merge",
            Reset: "reset",
            Stash: "stash",
            Advanced: "advanced",
            Archaeology: "archaeology",
            Mastery: "mastery",
        };

        const urlStage = stageMap[stage] || stage.toLowerCase();
        router.push(`/${urlStage}?stage=${stage}&level=${level}`);
    };

    const handleDebugGiveMoney = (amount: number) => {
        debugGiveMoney(amount);
    };

    const handleDebugUnlockAllLevels = () => {
        debugUnlockAllLevels();
    };

    const handleDebugLockAllLevels = () => {
        debugLockAllLevels();
    };

    const handleDebugResetProgress = () => {
        progressManager.resetProgress();
        console.log("Debug: Reset all progress");
    };

    const handleDebugCompleteCurrentLevel = () => {
        debugCompleteCurrentLevel();
    };

    // Fetch GitHub star count for repository chip
    useEffect(() => {
        const controller = new AbortController();

        const fetchStars = async () => {
            try {
                const response = await fetch("https://api.github.com/repos/MikaStiebitz/Git-Mastery", {
                    signal: controller.signal,
                    headers: {
                        Accept: "application/vnd.github+json",
                    },
                });

                if (!response.ok) {
                    return;
                }

                const data: { stargazers_count?: number } = await response.json();

                if (typeof data.stargazers_count === "number") {
                    setRepoStars(data.stargazers_count);
                }
            } catch {
                // Keep chip usable even if API call fails/rate-limits.
            }
        };

        void fetchStars();

        return () => {
            controller.abort();
        };
    }, []);

    const formattedRepoStars =
        repoStars === null
            ? "--"
            : new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(repoStars);

    const pageLabel = isPlaygroundPage
        ? t("nav.playground")
        : isInstallationPage
          ? t("nav.installation")
          : isFaqPage
            ? t("nav.faq")
            : isArcadePage
              ? t("nav.arcade")
              : null;

    // One definition per destination, so the desktop bar and the mobile drawer can never
    // drift apart.
    const navLinks = [
        { href: "/", label: t("nav.home"), icon: Home, current: isHomePage },
        { href: "/playground", label: t("nav.playground"), icon: BookCopy, current: isPlaygroundPage },
        { href: "/arcade", label: t("nav.arcade"), icon: Gamepad2, current: isArcadePage },
        { href: "/installation", label: t("nav.installation"), icon: Download, current: isInstallationPage },
        { href: "/faq", label: t("nav.faq"), icon: HelpCircle, current: isFaqPage },
    ];

    const starChip = (className = "") => (
        <a
            href="https://github.com/MikaStiebitz/Git-Mastery"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group border-gm-line bg-gm-night text-gm-ink hover:border-gm-grape-hi inline-flex h-10 shrink-0 items-center gap-2 rounded-full border-2 px-3 transition-colors duration-150",
                className,
            )}
            aria-label={t("nav.starOnGithub")}>
            <Github
                className="text-gm-ink-soft group-hover:text-gm-ink h-4 w-4 transition-colors duration-150"
                aria-hidden="true"
            />
            <span className="flex items-center gap-1 text-xs font-bold tabular-nums">
                {formattedRepoStars}
                <Star className="fill-gm-gold text-gm-gold h-3.5 w-3.5" aria-hidden="true" />
            </span>
        </a>
    );

    /**
     * The cabinet readout: coins are the spendable currency and carry the gold, points are
     * the running total and stay quiet. It states facts, so it is not a control.
     */
    const purseChip = (className = "") => (
        <ClientOnly
            fallback={<div className={cn("h-10 w-[76px] shrink-0 sm:w-[124px]", className)} aria-hidden="true" />}>
            <div
                className={cn(
                    "border-gm-gold-edge bg-gm-night flex h-10 shrink-0 items-center gap-2 rounded-full border-2 px-3",
                    className,
                )}>
                <span className="text-gm-gold flex items-center gap-1.5 text-xs font-bold tabular-nums">
                    <Coins className="h-4 w-4" aria-hidden="true" />
                    {purse.coins}
                    <span className="sr-only">{t("shop.coins")}</span>
                </span>
                {/* Coins are the actionable number, so they stay on a phone; the running
                    total joins them once there is room. */}
                <span className="bg-gm-line hidden h-4 w-px shrink-0 sm:block" aria-hidden="true"></span>
                <span className="text-gm-ink-soft hidden items-center gap-1 text-xs font-semibold sm:flex">
                    <Trophy className="text-gm-ink-dim h-3.5 w-3.5" aria-hidden="true" />
                    <span className="tabular-nums">{purse.score}</span>
                    <span className="text-gm-ink-dim" aria-hidden="true">
                        XP
                    </span>
                    <span className="sr-only">{t("home.points")}</span>
                </span>
            </div>
        </ClientOnly>
    );

    return (
        <header className="border-gm-line bg-gm-void sticky top-0 z-(--z-sticky) border-b-2">
            <nav className="container mx-auto flex min-h-16 items-center gap-3 px-4" aria-label={t("nav.home")}>
                {/* Logo and brand */}
                <Link
                    href="/"
                    className="group focus-visible:outline-gm-cyan flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-4">
                    <span className="border-gm-grape-edge bg-gm-grape text-gm-ink group-hover:border-gm-lime-edge group-hover:bg-gm-lime group-hover:text-gm-void flex h-9 w-9 items-center justify-center rounded-[0.7rem] border-2 transition-colors duration-150">
                        <GitBranch className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-gm-ink hidden text-lg sm:inline">GitMastery</span>
                </Link>

                {/* Where you are: the level you're playing, or the page you're on */}
                {showLevelInfo ? (
                    <ClientOnly>
                        <span className="border-gm-line bg-gm-night text-gm-ink-soft hidden h-8 max-w-[240px] shrink items-center gap-1.5 truncate rounded-full border-2 px-3 text-xs font-semibold md:flex">
                            <span className="text-gm-lime [font-family:var(--font-code)]">L{currentLevel}</span>
                            <span className="truncate">{stageName}</span>
                        </span>
                    </ClientOnly>
                ) : (
                    pageLabel && (
                        <span className="text-gm-ink-soft hidden shrink truncate text-sm font-semibold md:inline">
                            {pageLabel}
                        </span>
                    )
                )}

                <div className="ms-auto flex items-center gap-2">
                    <div className="hidden xl:block">
                        <BadgeDisplay />
                    </div>

                    {/* Destinations. Icon-only from lg, labelled again from 2xl, and the page
                        you're on stays in the bar as a pressed key instead of disappearing. */}
                    <ul className="hidden items-center gap-1 lg:flex">
                        {navLinks.map(({ href, label, icon: Icon, current }) => (
                            <li key={href}>
                                <Button
                                    variant={current ? "secondary" : "ghost"}
                                    size={current ? "default" : "default"}
                                    className="px-3 2xl:px-4"
                                    asChild>
                                    <Link href={href} aria-current={current ? "page" : undefined} title={label}>
                                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        <span className="hidden 2xl:inline">{label}</span>
                                        <span className="sr-only 2xl:hidden">{label}</span>
                                    </Link>
                                </Button>
                            </li>
                        ))}
                    </ul>

                    {purseChip()}
                    {starChip("hidden sm:inline-flex")}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden sm:inline-flex"
                        onClick={openSponsor}
                        title={t("sponsor.action")}
                        aria-label={t("sponsor.action")}>
                        <Heart className="text-gm-gold h-4 w-4" aria-hidden="true" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden lg:inline-flex"
                        onClick={() => setLanguageDialogOpen(true)}
                        title={t("nav.language")}
                        aria-label={t("nav.language")}>
                        <Languages className="h-4 w-4" aria-hidden="true" />
                    </Button>

                    <Button onClick={navigateToLearning} className="hidden px-3 lg:inline-flex 2xl:px-4">
                        <Code className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="hidden 2xl:inline">{t("nav.startLearning")}</span>
                        <span className="sr-only 2xl:hidden">{t("nav.startLearning")}</span>
                    </Button>

                    {/* Mobile menu button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="lg:hidden"
                        onClick={toggleMobileMenu}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-nav"
                        aria-label={t("nav.language") && mobileMenuOpen ? "Close menu" : "Menu"}>
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <Menu className="h-5 w-5" aria-hidden="true" />
                        )}
                    </Button>
                </div>
            </nav>

            {/* Mobile navigation menu */}
            {mobileMenuOpen && (
                <div
                    id="mobile-nav"
                    className={`gm-scroll border-gm-line bg-gm-void max-h-[calc(100svh-4rem)] overflow-y-auto border-t-2 ${mobileNavClass}`}>
                    <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
                        {/* Current level info for mobile */}
                        {showLevelInfo && (
                            <ClientOnly>
                                <p className="text-gm-ink-soft text-sm font-semibold">
                                    {t("level.level")} {currentLevel} · {stageName}
                                </p>
                            </ClientOnly>
                        )}

                        <div className="mb-1 flex flex-wrap items-center justify-center gap-2">
                            <BadgeDisplay className="justify-center" />
                            {starChip("sm:hidden")}
                        </div>

                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                setLanguageDialogOpen(true);
                                setMobileMenuOpen(false);
                            }}>
                            <Languages className="text-gm-cyan h-4 w-4" aria-hidden="true" />
                            {t("nav.language")}:{" "}
                            {languages.find(l => l.code === language)?.nativeName ?? language.toUpperCase()}
                        </Button>

                        {navLinks.map(({ href, label, icon: Icon, current: isCurrent }) => (
                            <Button
                                key={href}
                                variant={isCurrent ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild>
                                <Link
                                    href={href}
                                    aria-current={isCurrent ? "page" : undefined}
                                    onClick={() => setMobileMenuOpen(false)}>
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                    {label}
                                </Link>
                            </Button>
                        ))}

                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/level" onClick={() => setMobileMenuOpen(false)}>
                                <Terminal className="h-4 w-4" aria-hidden="true" />
                                {t("nav.terminal")}
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                                openSponsor();
                                setMobileMenuOpen(false);
                            }}>
                            <Heart className="text-gm-gold h-4 w-4" aria-hidden="true" />
                            {t("sponsor.action")}
                        </Button>

                        <Button
                            className="mt-2 w-full"
                            onClick={() => {
                                navigateToLearning();
                                setMobileMenuOpen(false);
                            }}>
                            <Code className="h-4 w-4" aria-hidden="true" />
                            {t("nav.startLearning")}
                        </Button>
                    </div>
                </div>
            )}

            {/* Debug Modal - only show in debug mode */}
            {env.NEXT_PUBLIC_DEBUG_MODE && (
                <>
                    {/* Debug Button - fixed position */}
                    <Button
                        onClick={() => setDebugModalOpen(true)}
                        variant="secondary"
                        size="icon"
                        className="fixed end-4 bottom-4 z-(--z-dropdown)"
                        aria-label="Debug menu">
                        <Settings className="h-4 w-4" aria-hidden="true" />
                    </Button>

                    {/* Debug Modal */}
                    <DebugModal
                        isOpen={debugModalOpen}
                        onClose={() => setDebugModalOpen(false)}
                        onNavigateToLevel={handleDebugNavigateToLevel}
                        onGiveMoney={handleDebugGiveMoney}
                        onUnlockAllLevels={handleDebugUnlockAllLevels}
                        onLockAllLevels={handleDebugLockAllLevels}
                        onResetProgress={handleDebugResetProgress}
                        onCompleteCurrentLevel={handleDebugCompleteCurrentLevel}
                        currentStage={currentStage}
                        currentLevel={currentLevel}
                        availableStages={[
                            "Intro",
                            "Files",
                            "Branches",
                            "Workflow",
                            "TeamWork",
                            "Merge",
                            "Reset",
                            "Stash",
                            "Advanced",
                            "Archaeology",
                            "Mastery",
                        ]}
                        availableLevels={{
                            Intro: [1, 2, 3, 4, 5],
                            Files: [1, 2, 3, 4, 5],
                            Branches: [1, 2, 3, 4, 5],
                            Workflow: [1, 2, 3, 4, 5],
                            TeamWork: [1, 2, 3, 4, 5],
                            Merge: [1, 2, 3, 4, 5],
                            Reset: [1, 2, 3, 4, 5],
                            Stash: [1, 2, 3, 4, 5],
                            Advanced: [1, 2, 3, 4, 5],
                            Archaeology: [1, 2, 3, 4, 5],
                            Mastery: [1, 2, 3, 4, 5],
                        }}
                    />
                </>
            )}

            {/* Language Selection Dialog */}
            <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("nav.language")}</DialogTitle>
                        <DialogDescription>{t("nav.selectLanguage")}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-5 flex flex-col gap-2">
                        {languages.map(lang => {
                            const isActive = language === lang.code;
                            return (
                                <Button
                                    key={lang.code}
                                    variant={isActive ? "default" : "outline"}
                                    onClick={() =>
                                        handleLanguageSelect(lang.code as "en" | "de" | "es" | "fa" | "hi" | "tr")
                                    }
                                    aria-current={isActive}
                                    className="h-auto w-full justify-between py-3">
                                    <span className="flex flex-col items-start gap-0.5">
                                        <span className="font-bold">{lang.nativeName}</span>
                                        <span className="text-xs font-medium opacity-80">{lang.name}</span>
                                    </span>
                                    {isActive && <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />}
                                </Button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </header>
    );
}
