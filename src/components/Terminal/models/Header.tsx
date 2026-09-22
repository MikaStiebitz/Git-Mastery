import { Button } from "~/components/ui/button";
import { HelpCircleIcon, RotateCcw, Palette } from "lucide-react";
import type { TerminalHeaderProps } from "../types";

/**
 * The terminal's own title bar: a live LED and the real working path, instead of the
 * three mac-window dots. The bar's surface is mixed from the active theme's border and
 * background, so a purchased theme (Matrix, Golden) keeps its own identity here too.
 */
export function TerminalHeader({
    path,
    theme,
    showHelpButton,
    showResetButton,
    handleShowHelp,
    handleReset,
    handleShowThemes,
    t,
}: TerminalHeaderProps) {
    const actionClass = "hover:bg-black/20";

    return (
        <div
            className="flex items-center justify-between gap-2 border-b-2 px-3 py-1.5"
            style={{
                background: `color-mix(in oklab, ${theme.border} 28%, ${theme.background})`,
                borderColor: theme.border,
            }}>
            <div className="flex min-w-0 items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                    <span
                        className="absolute inset-0 animate-pulse rounded-full motion-reduce:animate-none"
                        style={{ background: theme.prompt, opacity: 0.35 }}></span>
                    <span className="absolute inset-[3px] rounded-full" style={{ background: theme.prompt }}></span>
                </span>
                <span
                    className="truncate [font-family:var(--font-code)] text-xs"
                    style={{ color: theme.text }}
                    title={path}>
                    {path}
                </span>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
                <Button
                    variant="ghost"
                    size="icon"
                    className={actionClass}
                    style={{ color: theme.text }}
                    onClick={handleShowThemes}
                    title={t("themes.changeTooltip")}
                    aria-label={t("themes.changeTooltip")}>
                    <Palette className="h-4 w-4" aria-hidden="true" />
                </Button>

                {showHelpButton && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={actionClass}
                        style={{ color: theme.text }}
                        onClick={handleShowHelp}
                        title={t("terminal.help")}
                        aria-label={t("terminal.help")}>
                        <HelpCircleIcon className="h-4 w-4" aria-hidden="true" />
                    </Button>
                )}

                {showResetButton && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={actionClass}
                        style={{ color: theme.text }}
                        onClick={handleReset}
                        title={t("level.resetLevel")}
                        aria-label={t("level.resetLevel")}>
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    </Button>
                )}
            </div>
        </div>
    );
}
