import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Send } from "lucide-react";
import type { TerminalInputProps } from "../types";

export function TerminalInput({
    input,
    inputRef,
    handleFormSubmit,
    handleInputChange,
    handleKeyDown,
    commandSuggestion,
    showCommandSuggestion,
    showAutocomplete,
    fileAutocomplete,
    selectAutocompleteOption,
    renderFancyPrompt,
    t,
    isRTL,
}: TerminalInputProps) {
    const direction = isRTL ? "rtl" : "ltr";
    const suggestionPositionClass = isRTL ? "right-2 sm:right-0" : "left-2 sm:left-0";

    return (
        <div className="relative border-t border-purple-800/50">
            <form
                onSubmit={handleFormSubmit}
                className="flex min-h-[3rem] items-center gap-2 px-2 py-2 sm:min-h-[2.5rem] sm:px-3"
                dir={direction}>
                <div className="hidden max-w-[60%] flex-shrink-0 overflow-hidden sm:block">{renderFancyPrompt()}</div>

                {/* Command suggestion tooltip - adjusted for mobile */}
                {showCommandSuggestion && (
                    <div
                        className={`absolute top-0 z-10 mt-[-28px] rounded border border-purple-800 bg-purple-900/90 px-2 py-1 text-xs text-purple-300 ${suggestionPositionClass} sm:mt-[-30px]`}
                        dir={direction}
                        style={{ textAlign: "start" }}>
                        <span className="hidden sm:inline">{t("terminal.pressTabToComplete")} </span>
                        <span className="font-mono font-semibold">{commandSuggestion}</span>
                    </div>
                )}

                <Input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="min-w-[100px] flex-grow border-none bg-transparent font-mono text-sm text-purple-300 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm"
                    placeholder={t("terminal.enterCommand")}
                    autoComplete="off"
                    spellCheck="false"
                    inputMode="text"
                    enterKeyHint="send"
                    dir="auto"
                    style={{ textAlign: "start" }}
                    onFocus={() => {
                        // On mobile, ensure input is visible
                        if (window.innerWidth < 768) {
                            setTimeout(() => {
                                inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                            }, 300);
                        }
                    }}
                />

                <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0 px-2 text-purple-400 hover:bg-purple-800/50 hover:text-purple-200 sm:px-3">
                    <Send className="h-4 w-4" />
                </Button>
            </form>

            {/* Autocomplete dropdown - adjusted for mobile */}
            {showAutocomplete && fileAutocomplete.length > 0 && (
                <div
                    className="absolute bottom-full left-0 right-0 z-10 max-h-32 overflow-y-auto rounded-t border border-purple-800 bg-purple-900/95 p-1 shadow-lg backdrop-blur-sm"
                    dir={direction}
                    style={{ textAlign: "start" }}>
                    {fileAutocomplete.map(file => (
                        <div
                            key={file}
                            className="cursor-pointer rounded px-2 py-1.5 font-mono text-xs text-purple-300 hover:bg-purple-800 active:bg-purple-700 sm:py-1 sm:text-sm"
                            onClick={() => selectAutocompleteOption(file)}
                            onTouchEnd={e => {
                                e.preventDefault();
                                selectAutocompleteOption(file);
                            }}>
                            {file}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
