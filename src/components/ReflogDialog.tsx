"use client";

import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useKeySequence } from "~/hooks/useKeySequence";

/**
 * Nothing links here. Nothing documents it. It is reachable only by reading this file.
 *
 * The copy stays in English and out of `src/translations` on purpose: translation files are the
 * most-read plain text in the repo and are handled by people who are not reading components, so a
 * single string in there would give the whole thing away.
 */
const SEQUENCE = ["KeyR", "KeyE", "KeyF", "KeyL", "KeyO", "KeyG"] as const;

const REFLOG_LINES = [
    ["d4ng11n", "HEAD@{0}: checkout: moving from main to easter-egg"],
    ["c0ffee5", "HEAD@{1}: commit: read the source instead of the README"],
    ["1337b0b", "HEAD@{2}: commit: hide a door in the game, tell nobody"],
    ["dead6ee", "HEAD@{3}: reset: moving to HEAD~1"],
    ["0000000", "HEAD@{4}: init: it started as a weekend project"],
] as const;

export function ReflogDialog() {
    const [open, setOpen] = useState(false);

    useKeySequence(SEQUENCE, () => setOpen(true));

    // Nothing in the DOM until it is found, so it cannot be tripped over in devtools either.
    if (!open) return null;

    return (
        <Dialog open onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="font-mono text-base sm:text-lg">
                        $ git reflog --walk-reflogs --all
                    </DialogTitle>
                    <DialogDescription>
                        Nothing is ever really gone. You just have to know where to look.
                    </DialogDescription>
                </DialogHeader>

                <div className="gm-inset overflow-x-auto p-3">
                    <pre className="font-mono text-[11px] leading-relaxed sm:text-xs">
                        {REFLOG_LINES.map(([hash, message]) => (
                            <div key={hash}>
                                <span className="text-gm-gold">{hash}</span>{" "}
                                <span className="text-gm-ink-soft">{message}</span>
                            </div>
                        ))}
                    </pre>
                </div>

                <div className="gm-inset overflow-x-auto p-3">
                    <pre aria-hidden="true" className="text-gm-lime font-mono text-[11px] leading-tight sm:text-xs">
                        {"      * <- you are here\n     /\n*---*---*---*  main"}
                    </pre>
                    <span className="sr-only">A commit graph: one unmerged branch leaving main.</span>
                </div>

                <p className="text-gm-ink-soft text-sm leading-relaxed">
                    You did not find this by clicking. There is no button, no link, no line in the README, no entry in
                    the FAQ, and not one translation string — I checked. The only way in was reading the code, which
                    means you read the code. Whatever you were actually looking for in here, I hope you found that too.
                </p>

                <p className="text-gm-ink-dim text-xs leading-relaxed">
                    GitMastery — 13 stages, 55 levels, 4 mini games, 6 languages, and one branch that never got merged.
                    Built by Mika Stiebitz.
                </p>

                <p className="text-gm-ink-soft text-sm leading-relaxed">
                    There is at least one more thing in here that is written down nowhere. Hint: the terminal accepts a
                    command that does not exist in Git. Three letters. It is not porcelain and it is not plumbing. It is
                    an attitude.
                </p>

                <div className="flex flex-col gap-2">
                    <Button onClick={() => setOpen(false)} variant="outline" className="w-full sm:w-auto">
                        git checkout -
                    </Button>
                    {/* Says up front that nothing was granted, so nobody goes hunting for a payout
                        that does not exist. The egg stays entirely outside the economy. */}
                    <p className="text-gm-ink-dim text-xs">
                        Esc also works. Your coin balance is exactly as unimpressed as it was before.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
