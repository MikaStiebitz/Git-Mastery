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
}: TerminalInputProps) {
    return (
        <div className="relative border-t border-purple-800/50">
            <form
                onSubmit={handleFormSubmit}
                className="flex min-h-[3rem] items-center gap-2 px-2 py-2 sm:min-h-[2.5rem] sm:px-3">
                <div className="hidden max-w-[60%] flex-shrink-0 overflow-hidden sm:block">{renderFancyPrompt()}</div>

                {/* Command suggestion tooltip - adjusted for mobile */}
                {showCommandSuggestion && (
                    <div className="absolute left-2 top-0 z-10 mt-[-28px] rounded border border-purple-800 bg-purple-900/90 px-2 py-1 text-xs text-purple-300 sm:left-0 sm:mt-[-30px]">
                        <span className="hidden sm:inline">Press Tab to complete: </span>
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
                <div className="absolute bottom-full left-0 right-0 z-10 max-h-32 overflow-y-auto rounded-t border border-purple-800 bg-purple-900/95 p-1 shadow-lg backdrop-blur-sm">
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
