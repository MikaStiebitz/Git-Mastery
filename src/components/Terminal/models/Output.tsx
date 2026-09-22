import { ScrollArea } from "~/components/ui/scroll-area";
import type { TerminalOutputProps } from "../types";

export function TerminalOutput({
    terminalOutput,
    isLevelCompleted,
    isPlaygroundMode,
    scrollAreaRef,
    outputContainerRef,
    renderTerminalOutput,
    t,
}: TerminalOutputProps) {
    return (
        <div className="min-h-0 flex-1">
            <ScrollArea
                className="gm-scroll h-full px-3 py-3 [font-family:var(--font-code)] text-[13px] leading-[1.6] text-[var(--term-text)] sm:px-4"
                ref={scrollAreaRef}>
                <div ref={outputContainerRef} className="pb-4">
                    {terminalOutput.map((line, i) => (
                        <div key={i} className="break-words whitespace-pre-wrap">
                            {renderTerminalOutput(line)}
                        </div>
                    ))}

                    {isLevelCompleted && !isPlaygroundMode && (
                        <div className="mt-3 rounded-[0.85rem] border-2 border-[var(--term-success)] bg-[var(--term-success)] px-3 py-2 text-center font-sans text-sm font-semibold text-[var(--term-bg)]">
                            {t("terminal.levelCompleted")}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
