import { GitBranch, ArrowUp, ArrowDown, Check, Folder } from "lucide-react";
import type { TerminalStatusBarProps } from "../types";

/**
 * A statusline in the sense every editor and shell prompt uses one: where you are, which
 * branch you're on, and what is waiting to be committed or pushed. It replaces the pill
 * stack that used to be crammed into the input row — and unlike that row, it stays visible
 * on a phone.
 *
 * Inside the terminal the active theme owns the palette — a purchased Matrix terminal must
 * not sprout grape pills — so every colour here comes from the theme. The one exception is
 * the branch pill on the default theme, where the Git legend still applies (grape is `main`,
 * cyan is any other line of history); the caller resolves that and passes the pair in.
 */
export function TerminalStatusBar({
    path,
    branchFill,
    branchInk,
    isGitInitialized,
    branch,
    stagedCount,
    modifiedCount,
    untrackedCount,
    unpushedCommitsCount,
    unpulledCommitsCount,
    theme,
    t,
}: TerminalStatusBarProps) {
    const isClean =
        stagedCount === 0 &&
        modifiedCount === 0 &&
        untrackedCount === 0 &&
        unpushedCommitsCount === 0 &&
        unpulledCommitsCount === 0;

    const counters = [
        { key: "staged", value: stagedCount, color: theme.success, glyph: "+", label: t("terminal.status.staged") },
        {
            key: "modified",
            value: modifiedCount,
            color: theme.warning,
            glyph: "~",
            label: t("terminal.status.modified"),
        },
        {
            key: "untracked",
            value: untrackedCount,
            color: theme.text,
            glyph: "?",
            label: t("terminal.status.untracked"),
            dim: true,
        },
    ].filter(c => c.value > 0);

    return (
        <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 px-3 py-1.5 [font-family:var(--font-code)] text-[11px]"
            style={{
                background: `color-mix(in oklab, ${theme.border} 28%, ${theme.background})`,
                borderColor: theme.border,
            }}>
            {/* Where you are */}
            <span className="flex min-w-0 items-center gap-1.5" style={{ color: theme.text, opacity: 0.75 }}>
                <Folder className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate" title={path}>
                    {path}
                </span>
            </span>

            {isGitInitialized ? (
                <>
                    {/* Which branch */}
                    <span
                        className="flex max-w-[45%] min-w-0 items-center gap-1 rounded-full px-2 py-0.5 font-bold"
                        style={{ background: branchFill, color: branchInk }}
                        title={branch}>
                        <GitBranch className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{branch}</span>
                    </span>

                    {/* What is waiting */}
                    {isClean ? (
                        <span className="flex items-center gap-1" style={{ color: theme.success }}>
                            <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                            {t("terminal.status.clean")}
                        </span>
                    ) : (
                        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            {counters.map(c => (
                                <span
                                    key={c.key}
                                    className="flex items-center gap-1 tabular-nums"
                                    style={{ color: c.color, opacity: c.dim ? 0.7 : 1 }}
                                    title={`${c.value} ${c.label}`}>
                                    <span aria-hidden="true">{c.glyph}</span>
                                    {c.value}
                                    <span className="sr-only">{c.label}</span>
                                </span>
                            ))}

                            {unpushedCommitsCount > 0 && (
                                <span
                                    className="flex items-center gap-0.5 tabular-nums"
                                    style={{ color: theme.accent }}
                                    title={`${unpushedCommitsCount} ${t("terminal.status.ahead")}`}>
                                    <ArrowUp className="h-3 w-3" aria-hidden="true" />
                                    {unpushedCommitsCount}
                                    <span className="sr-only">{t("terminal.status.ahead")}</span>
                                </span>
                            )}

                            {unpulledCommitsCount > 0 && (
                                <span
                                    className="flex items-center gap-0.5 tabular-nums"
                                    style={{ color: theme.accent }}
                                    title={`${unpulledCommitsCount} ${t("terminal.status.behind")}`}>
                                    <ArrowDown className="h-3 w-3" aria-hidden="true" />
                                    {unpulledCommitsCount}
                                    <span className="sr-only">{t("terminal.status.behind")}</span>
                                </span>
                            )}
                        </span>
                    )}
                </>
            ) : (
                <span style={{ color: theme.text, opacity: 0.55 }}>{t("terminal.status.noRepo")}</span>
            )}
        </div>
    );
}
