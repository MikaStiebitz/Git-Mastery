"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Trophy, UserRound } from "lucide-react";
import { PageLayout } from "~/components/layout/PageLayout";
import { ClientOnly } from "~/components/ClientOnly";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useAccountDialog } from "~/components/account/AccountDialog";
import { AchievementStrip } from "~/components/leaderboard/AchievementStrip";
import { PlayerDialog } from "~/components/leaderboard/PlayerDialog";
import { Podium } from "~/components/leaderboard/Podium";
import { MINIGAMES } from "~/components/minigames/registry";
import { useAuth } from "~/contexts/AuthContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { accountsEnabled, type ArcadeEntry, type LeaderboardResponse } from "~/lib/accountApi";
import { rivalHint } from "~/lib/leaderboard";
import { getRankStatus } from "~/lib/ranks";
import { cn } from "~/lib/utils";

type Load = { state: "loading" } | { state: "error" } | { state: "ready"; data: LeaderboardResponse };

/** How many accounts the Worker lists on the overall board. Mirrors `TOP_COUNT` in the Worker. */
const LISTED = 50;

const ALL_GAMES = "all";

/** Gold, silver and bronze for the first three places; everything else stays quiet. */
function placeTone(rank: number): string {
    if (rank === 1) return "text-gm-gold font-bold";
    if (rank === 2) return "text-gm-ink font-bold";
    if (rank === 3) return "text-gm-coral font-bold";
    return "text-gm-ink-soft";
}

function LeaderboardView() {
    const { t } = useLanguage();
    const auth = useAuth();
    const { openAccount } = useAccountDialog();
    const [load, setLoad] = useState<Load>({ state: "loading" });
    const [toggling, setToggling] = useState(false);
    const [game, setGame] = useState<string>(ALL_GAMES);
    const [openPlayer, setOpenPlayer] = useState<string | null>(null);

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

    const data = load.state === "ready" ? load.data : null;
    const me = data?.me ?? null;

    const hint = useMemo(
        () => (data && me ? rivalHint({ score: me.score, rank: me.rank, hidden: me.hidden }, data.top, LISTED) : null),
        [data, me],
    );

    if (load.state === "loading") {
        return (
            <div className="flex items-center gap-2" role="status">
                <Loader2 className="text-gm-cyan h-5 w-5 animate-spin" aria-hidden="true" />
                <span className="text-gm-ink-soft">{t("leaderboard.loading")}</span>
            </div>
        );
    }

    if (load.state === "error" || !data) {
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

    const updated = new Date(data.generatedAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    const mine = auth.signedIn ? auth.username : null;

    const arcadeRows: ArcadeEntry[] = game === ALL_GAMES ? data.arcade.total : (data.arcade.games[game] ?? []);
    const myArcade =
        me === null
            ? null
            : game === ALL_GAMES
              ? { best: Object.values(me.bests).reduce((sum, best) => sum + best, 0), rank: me.arcadeTotalRank }
              : { best: me.bests[game] ?? 0, rank: me.arcadeRanks[game] ?? null };

    const hintText =
        hint === null
            ? null
            : hint.kind === "ahead"
              ? t("leaderboard.rivalAhead").replace("{name}", hint.name).replace("{points}", String(hint.points))
              : hint.kind === "top"
                ? t("leaderboard.rivalTop")
                      .replace("{points}", String(hint.points))
                      .replace("{count}", String(hint.count))
                : t("leaderboard.rivalLead").replace("{points}", String(hint.points));

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
                        {hintText && <p className="text-gm-ink-soft text-sm">{hintText}</p>}
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

            <Tabs defaultValue="xp">
                <TabsList>
                    <TabsTrigger value="xp">{t("leaderboard.tab.xp")}</TabsTrigger>
                    <TabsTrigger value="arcade">{t("leaderboard.tab.arcade")}</TabsTrigger>
                </TabsList>

                <TabsContent value="xp">
                    {data.top.length === 0 ? (
                        <p className="text-gm-ink-soft">{t("leaderboard.empty")}</p>
                    ) : (
                        <>
                            <Podium entries={data.top.slice(0, 3)} mine={mine} onOpen={setOpenPlayer} />

                            <div
                                aria-hidden="true"
                                className="text-gm-ink-dim mb-1 grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-2 border-transparent px-3 text-xs uppercase sm:grid-cols-[2.5rem_minmax(0,1fr)_4rem_5rem]">
                                <span>{t("leaderboard.colRank")}</span>
                                <span>{t("leaderboard.colPlayer")}</span>
                                <span className="hidden text-end sm:block">{t("leaderboard.colLevels")}</span>
                                <span className="text-end">{t("leaderboard.colScore")}</span>
                            </div>

                            <ol className="space-y-1.5">
                                {data.top.slice(3).map(entry => {
                                    const isMe = mine === entry.username;
                                    return (
                                        <li key={entry.username}>
                                            <button
                                                type="button"
                                                onClick={() => setOpenPlayer(entry.username)}
                                                aria-label={t("leaderboard.viewProfile").replace(
                                                    "{name}",
                                                    entry.username,
                                                )}
                                                className={cn(
                                                    "border-gm-line hover:border-gm-grape-hi hover:bg-gm-deep focus-visible:outline-gm-cyan grid w-full cursor-pointer grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-start transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 sm:grid-cols-[2.5rem_minmax(0,1fr)_4rem_5rem]",
                                                    isMe && "bg-gm-grape/40 border-gm-grape-hi",
                                                )}>
                                                <span className={cn("tabular-nums", placeTone(entry.rank))}>
                                                    {entry.rank}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="text-gm-ink block font-semibold [overflow-wrap:anywhere]">
                                                        {entry.username}
                                                        {isMe && (
                                                            <span className="bg-gm-grape text-gm-ink ms-2 rounded-full px-2 py-0.5 text-xs">
                                                                {t("leaderboard.you")}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="text-gm-ink-dim block text-xs">
                                                        {t(`rank.${getRankStatus(entry.score).rank.id}`)}
                                                    </span>
                                                    <AchievementStrip ids={entry.achievements} className="mt-1" />
                                                </span>
                                                <span className="text-gm-ink-soft hidden text-end tabular-nums sm:block">
                                                    {entry.levels}
                                                </span>
                                                <span className="text-gm-ink text-end font-semibold tabular-nums">
                                                    {entry.score}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ol>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="arcade">
                    <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={t("leaderboard.tab.arcade")}>
                        {[
                            { id: ALL_GAMES, label: t("leaderboard.allGames") },
                            ...MINIGAMES.map(g => ({ id: g.id, label: t(g.nameKey) })),
                        ].map(option => (
                            <button
                                key={option.id}
                                type="button"
                                aria-pressed={game === option.id}
                                onClick={() => setGame(option.id)}
                                className={cn(
                                    "focus-visible:outline-gm-cyan cursor-pointer rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2",
                                    game === option.id
                                        ? "border-gm-grape-hi bg-gm-grape text-gm-ink"
                                        : "border-gm-line text-gm-ink-dim hover:bg-gm-deep hover:text-gm-ink",
                                )}>
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {game === ALL_GAMES && (
                        <p className="text-gm-ink-dim mb-3 text-xs">{t("leaderboard.arcadeTotalHint")}</p>
                    )}

                    {myArcade && myArcade.best > 0 && (
                        <p className="text-gm-ink-soft mb-3 text-sm font-semibold">
                            {myArcade.rank === null
                                ? t("leaderboard.arcadeMineHidden").replace("{score}", String(myArcade.best))
                                : t("leaderboard.arcadeMine")
                                      .replace("{score}", String(myArcade.best))
                                      .replace("{rank}", String(myArcade.rank))}
                        </p>
                    )}

                    {arcadeRows.length === 0 ? (
                        <p className="text-gm-ink-soft">{t("leaderboard.arcadeEmpty")}</p>
                    ) : (
                        <ol className="space-y-1.5">
                            {arcadeRows.map(entry => {
                                const isMe = mine === entry.username;
                                const canOpen = entry.username in data.profiles;
                                return (
                                    <li key={entry.username}>
                                        <button
                                            type="button"
                                            disabled={!canOpen}
                                            onClick={() => setOpenPlayer(entry.username)}
                                            aria-label={t("leaderboard.viewProfile").replace("{name}", entry.username)}
                                            className={cn(
                                                "border-gm-line hover:border-gm-grape-hi hover:bg-gm-deep focus-visible:outline-gm-cyan grid w-full cursor-pointer grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-start transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-default",
                                                isMe && "bg-gm-grape/40 border-gm-grape-hi",
                                            )}>
                                            <span className={cn("tabular-nums", placeTone(entry.rank))}>
                                                {entry.rank}
                                            </span>
                                            <span className="text-gm-ink font-semibold [overflow-wrap:anywhere]">
                                                {entry.username}
                                                {isMe && (
                                                    <span className="bg-gm-grape text-gm-ink ms-2 rounded-full px-2 py-0.5 text-xs">
                                                        {t("leaderboard.you")}
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-gm-ink-dim hidden text-xs sm:block">
                                                {entry.games !== undefined
                                                    ? `${entry.games} ${t("leaderboard.colGames")}`
                                                    : ""}
                                            </span>
                                            <span className="text-gm-ink text-end font-semibold tabular-nums">
                                                {entry.best}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </TabsContent>
            </Tabs>

            <p className="text-gm-ink-dim mt-6 text-xs">{t("leaderboard.footnote")}</p>
            <p className="text-gm-ink-dim mt-1 text-xs">{t("leaderboard.updated").replace("{time}", updated)}</p>

            <PlayerDialog
                username={openPlayer}
                profile={openPlayer ? (data.profiles[openPlayer] ?? null) : null}
                onClose={() => setOpenPlayer(null)}
            />
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
