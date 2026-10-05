"use client";

import { Lock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { ACHIEVEMENT_ICONS, ACHIEVEMENT_ORDER } from "~/components/achievementIcons";
import { MINIGAMES } from "~/components/minigames/registry";
import { useLanguage } from "~/contexts/LanguageContext";
import type { PlayerProfile } from "~/lib/accountApi";
import { getRankStatus } from "~/lib/ranks";
import { cn } from "~/lib/utils";

interface PlayerDialogProps {
    username: string | null;
    profile: PlayerProfile | null;
    onClose: () => void;
}

/** Another player, as the board knows them: rank, numbers, every achievement and their arcade bests. */
export function PlayerDialog({ username, profile, onClose }: PlayerDialogProps) {
    const { t, language } = useLanguage();
    const open = username !== null && profile !== null;

    const status = profile ? getRankStatus(profile.score) : null;
    const unlocked = new Set(profile?.achievements ?? []);
    const since = profile
        ? new Date(profile.since).toLocaleDateString(language, { year: "numeric", month: "long" })
        : "";

    return (
        <Dialog open={open} onOpenChange={next => !next && onClose()}>
            <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
                {username && profile && status && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="[overflow-wrap:anywhere]">{username}</DialogTitle>
                            <DialogDescription>
                                {t(`rank.${status.rank.id}`)} ·{" "}
                                {t("leaderboard.profile.since").replace("{date}", since)}
                            </DialogDescription>
                        </DialogHeader>

                        <dl className="mt-4 grid grid-cols-2 gap-3">
                            <div className="gm-inset p-3">
                                <dt className="text-gm-ink-dim text-xs uppercase">{t("leaderboard.colScore")}</dt>
                                <dd className="font-display text-gm-ink text-2xl tabular-nums">{profile.score}</dd>
                            </div>
                            <div className="gm-inset p-3">
                                <dt className="text-gm-ink-dim text-xs uppercase">{t("leaderboard.colLevels")}</dt>
                                <dd className="font-display text-gm-ink text-2xl tabular-nums">{profile.levels}</dd>
                            </div>
                        </dl>

                        <section aria-labelledby="profile-achievements" className="mt-5">
                            <h3 id="profile-achievements" className="text-gm-ink mb-2 text-sm font-semibold">
                                {t("leaderboard.profile.achievements")
                                    .replace("{count}", String(unlocked.size))
                                    .replace("{total}", String(ACHIEVEMENT_ORDER.length))}
                            </h3>
                            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {ACHIEVEMENT_ORDER.map(id => {
                                    const done = unlocked.has(id);
                                    const Icon = ACHIEVEMENT_ICONS[id];
                                    // The one secret stays secret on someone else's profile until it is found.
                                    const hidden = id === "git-gud" && !done;
                                    return (
                                        <li
                                            key={id}
                                            className={cn(
                                                "gm-inset flex items-center gap-2 p-2",
                                                done ? "" : "opacity-50",
                                            )}>
                                            <span
                                                className={cn(
                                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2",
                                                    done
                                                        ? "border-gm-gold-edge bg-gm-gold text-gm-void"
                                                        : "border-gm-line bg-gm-night text-gm-ink-dim",
                                                )}
                                                aria-hidden="true">
                                                {done ? <Icon className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                                            </span>
                                            <span className="text-gm-ink text-sm font-semibold">
                                                {hidden ? t("achievement.secret.name") : t(`achievement.${id}.name`)}
                                                <span className="sr-only">
                                                    {" "}
                                                    (
                                                    {done
                                                        ? t("achievements.state.unlocked")
                                                        : t("achievements.state.locked")}
                                                    )
                                                </span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>

                        <section aria-labelledby="profile-arcade" className="mt-5">
                            <h3 id="profile-arcade" className="text-gm-ink mb-2 text-sm font-semibold">
                                {t("leaderboard.profile.arcade")}
                            </h3>
                            <ul className="space-y-1.5">
                                {MINIGAMES.map(game => {
                                    const best = profile.bests[game.id];
                                    return (
                                        <li key={game.id} className="flex items-center justify-between text-sm">
                                            <span className="text-gm-ink-soft">{t(game.nameKey)}</span>
                                            <span className="text-gm-ink font-semibold tabular-nums">
                                                {best && best > 0 ? best : "—"}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
