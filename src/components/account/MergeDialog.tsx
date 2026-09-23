"use client";

import { useState } from "react";
import { CloudDownload, GitMerge, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useAuth } from "~/contexts/AuthContext";
import { useLanguage } from "~/contexts/LanguageContext";

/**
 * The one moment this feature can destroy something, so it is the one moment it asks.
 *
 * It appears only when signing in finds real progress on both sides that disagree — a player who
 * has never played on this device, or whose local progress the account already contains, never
 * sees it. There is no default action and no way to dismiss it by accident: whichever option is
 * chosen, a copy of the local save is written first.
 */
export function MergeDialog() {
    const { t } = useLanguage();
    const { pendingMerge, resolveMerge } = useAuth();
    const [busy, setBusy] = useState(false);

    if (!pendingMerge) return null;

    const choose = async (choice: "merge" | "keepCloud" | "cancel") => {
        setBusy(true);
        await resolveMerge(choice);
        setBusy(false);
    };

    const fill = (key: string) =>
        t(key)
            .replace("{levels}", String(pendingMerge.localLevels))
            .replace("{minigames}", String(pendingMerge.localMinigames))
            .replace("{purchases}", String(pendingMerge.localPurchases))
            .replace("{coins}", String(pendingMerge.localCoins))
            .replace("{username}", pendingMerge.username);

    return (
        <Dialog open onOpenChange={() => void choose("cancel")}>
            <DialogContent className="sm:max-w-lg" showClose={false}>
                <DialogHeader>
                    <DialogTitle>{t("account.merge.title")}</DialogTitle>
                    <DialogDescription>{fill("account.merge.description")}</DialogDescription>
                </DialogHeader>

                <div className="gm-inset space-y-1 p-4 text-sm">
                    <p className="text-gm-ink">{fill("account.merge.preview")}</p>
                    {/* Said before they choose, not discovered afterwards: the server recalculates
                        coins from what was actually earned, so the number can go down. */}
                    <p className="text-gm-ink-dim text-xs">{fill("account.merge.coinsWarning")}</p>
                </div>

                <div className="space-y-3">
                    <Button className="w-full justify-start" disabled={busy} onClick={() => void choose("merge")}>
                        <GitMerge className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="text-left">
                            {t("account.merge.mergeAction")}
                            <span className="block text-xs font-normal opacity-80">{t("account.merge.mergeHint")}</span>
                        </span>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={busy}
                        onClick={() => void choose("keepCloud")}>
                        <CloudDownload className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="text-left">
                            {t("account.merge.keepCloudAction")}
                            <span className="text-gm-ink-dim block text-xs font-normal">
                                {t("account.merge.keepCloudHint")}
                            </span>
                        </span>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        disabled={busy}
                        onClick={() => void choose("cancel")}>
                        <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="text-left">
                            {t("account.merge.cancelAction")}
                            <span className="block text-xs font-normal opacity-80">
                                {t("account.merge.cancelHint")}
                            </span>
                        </span>
                    </Button>
                </div>

                <p className="text-gm-ink-dim text-xs">{t("account.merge.backupNote")}</p>
            </DialogContent>
        </Dialog>
    );
}
