"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, Trophy, UserRound } from "lucide-react";
import { PageLayout } from "~/components/layout/PageLayout";
import { ClientOnly } from "~/components/ClientOnly";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useAccountDialog } from "~/components/account/AccountDialog";
import { useAuth } from "~/contexts/AuthContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { accountsEnabled, type LeaderboardResponse } from "~/lib/accountApi";
import { getRankStatus } from "~/lib/ranks";
import { cn } from "~/lib/utils";

type Load = { state: "loading" } | { state: "error" } | { state: "ready"; data: LeaderboardResponse };

function LeaderboardView() {
    const { t, language } = useLanguage();
    const auth = useAuth();
    const { openAccount } = useAccountDialog();
    const [load, setLoad] = useState<Load>({ state: "loading" });
    const [toggling, setToggling] = useState(false);

    const refresh = useCallback(async () => {
        setLoad(current => (current.state === "ready" ? current : { state: "loading" }));
        const result = await auth.fetchLeaderboard();
        setLoad(result.ok ? { state: "ready", data: result } : { state: "error" });
    }, [auth]);

    // Reload when signing in or out, so "your standing" appears and disappears with the session.
    useEffect(() => {
        void refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.signedIn]);

    const toggleHidden = async (hidden: boolean) => {
        setToggling(true);
        const result = await auth.setLeaderboardHidden(hidden);
        setToggling(false);
        if (result.ok) await refresh();
    };

    if (load.state === "loading") {
        return (
            <div className="flex items-center gap-2" role="status">
                <Loader2 className="text-gm-cyan h-5 w-5 animate-spin" aria-hidden="true" />
                <span className="text-gm-ink-soft">{t("leaderboard.loading")}</span>
            </div>
        );
    }

    if (load.state === "error") {
        return (
            <div className="space-y-3" role="alert">
                <p className="text-gm-coral">{t("leaderboard.error")}</p>
                <Button variant="outline" onClick={() => void refresh()}>
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    {t("leaderboard.retry")}
                </Button>
            </div>
        );
    }

    const { data } = load;
    const me = data.me;
    const updated = new Date(data.generatedAt).toLocaleTimeString(language, { hour: "2-digit", minute: "2-digit" });

    return (
        <>
            {/* Your standing. Only a signed-in account has one; everyone else is invited to make one. */}
            <div className="gm-inset mb-6 space-y-3 p-4">
                {auth.signedIn && me ? (
                    <>
                        <p className="text-gm-ink flex items-center gap-2 font-semibold">
                            <UserRound className="text-gm-grape-hi h-4 w-4" aria-hidden="true" />
                            {me.hidden
                                ? t("leaderboard.standingHidden")
                                : me.rank === null
                                  ? t("leaderboard.standingNone")
                                  : t("leaderboard.standing")
                                        .replace("{rank}", String(me.rank))
                                        .replace("{total}", String(data.total))}
                        </p>
                        <label className="flex cursor-pointer items-start gap-3">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={!me.hidden}
                                disabled={toggling}
                                onClick={() => void toggleHidden(!me.hidden)}
                                className={cn(
                                    "focus-visible:outline-gm-cyan relative mt-0.5 h-6 w-11 shrink-0 rounded-full border-2 transition-colors focus-visible:outline-3 focus-visible:outline-offset-2",
                                    me.hidden ? "border-gm-line bg-gm-night" : "border-gm-lime-edge bg-gm-lime",
                                )}>
                                <span
                                    className={cn(
                                        "bg-gm-ink absolute top-0.5 h-4 w-4 rounded-full transition-[inset-inline-start]",
                                        me.hidden ? "start-0.5" : "start-5",
                                    )}
                                    aria-hidden="true"
                                />
                                <span className="sr-only">{t("leaderboard.toggle")}</span>
                            </button>
                            <span>
                                <span className="text-gm-ink block text-sm font-semibold">
                                    {t("leaderboard.toggle")}
                                </span>
                                <span className="text-gm-ink-dim block text-xs">{t("leaderboard.toggleHint")}</span>
                            </span>
                        </label>
                    </>
                ) : (
                    <Button onClick={openAccount}>
                        <UserRound className="h-4 w-4" aria-hidden="true" />
                        {t("leaderboard.signInCta")}
                    </Button>
                )}
            </div>

            {data.top.length === 0 ? (
                <p className="text-gm-ink-soft">{t("leaderboard.empty")}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-start text-sm">
                        <thead>
                            <tr className="text-gm-ink-dim border-gm-line border-b-2 text-xs uppercase">
                                <th scope="col" className="w-14 px-2 py-2 text-start font-semibold">
                                    {t("leaderboard.colRank")}
                                </th>
                                <th scope="col" className="px-2 py-2 text-start font-semibold">
                                    {t("leaderboard.colPlayer")}
                                </th>
                                <th scope="col" className="hidden px-2 py-2 text-end font-semibold sm:table-cell">
                                    {t("leaderboard.colLevels")}
                                </th>
                                <th scope="col" className="px-2 py-2 text-end font-semibold">
                                    {t("leaderboard.colScore")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.top.map((entry, index) => {
                                const mine = auth.signedIn && auth.username === entry.username;
                                const title = t(`rank.${getRankStatus(entry.score).rank.id}`);
                                return (
                                    <tr
                                        key={`${entry.username}-${index}`}
                                        className={cn(
                                            "border-gm-line border-b",
                                            mine && "bg-gm-grape/40 font-semibold",
                                        )}>
                                        <td
                                            className={cn(
                                                "px-2 py-3 tabular-nums",
                                                entry.rank <= 3 ? "text-gm-gold font-bold" : "text-gm-ink-soft",
                                            )}>
                                            {entry.rank}
                                        </td>
                                        <td className="text-gm-ink px-2 py-3">
                                            <span className="[overflow-wrap:anywhere]">{entry.username}</span>
                                            {mine && (
                                                <span className="bg-gm-grape text-gm-ink ms-2 rounded-full px-2 py-0.5 text-xs">
                                                    {t("leaderboard.you")}
                                                </span>
                                            )}
                                            <span className="text-gm-ink-dim block text-xs font-normal">{title}</span>
                                        </td>
                                        <td className="text-gm-ink-soft hidden px-2 py-3 text-end tabular-nums sm:table-cell">
                                            {entry.levels}
                                        </td>
                                        <td className="text-gm-ink px-2 py-3 text-end tabular-nums">{entry.score}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="text-gm-ink-dim mt-6 text-xs">{t("leaderboard.footnote")}</p>
            <p className="text-gm-ink-dim mt-1 text-xs">{t("leaderboard.updated").replace("{time}", updated)}</p>
        </>
    );
}

export default function LeaderboardPage() {
    const { t } = useLanguage();

    return (
        <PageLayout>
            <section className="container mx-auto px-4 py-8 sm:py-12">
                <div className="mx-auto max-w-3xl">
                    <h1 className="font-display text-gm-ink flex items-center gap-3 text-2xl sm:text-3xl">
                        <Trophy className="text-gm-gold h-7 w-7 shrink-0" aria-hidden="true" />
                        <span className="[text-wrap:balance]">{t("leaderboard.title")}</span>
                    </h1>
                    <p className="text-gm-ink-soft mt-3 mb-8 max-w-2xl text-sm sm:text-base">
                        {t("leaderboard.subtitle")}
                    </p>

                    {accountsEnabled() ? (
                        <ClientOnly fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
                            <LeaderboardView />
                        </ClientOnly>
                    ) : (
                        <p className="text-gm-ink-soft">{t("leaderboard.disabled")}</p>
                    )}
                </div>
            </section>
        </PageLayout>
    );
}
