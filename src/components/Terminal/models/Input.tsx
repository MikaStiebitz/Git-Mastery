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
    theme,
    t,
}: TerminalInputProps) {
    return (
        <div className="relative border-t-2" style={{ borderColor: theme.border }}>
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2 px-3 py-2">
                {/* The branch and status live in the status bar above; the prompt is just the
                    caret you type after. */}
                <span
                    className="flex-shrink-0 [font-family:var(--font-code)] text-sm font-bold select-none"
                    style={{ color: theme.prompt }}
                    aria-hidden="true">
                    $
                </span>

                {/* Command suggestion tooltip - adjusted for mobile */}
                {showCommandSuggestion && (
                    <div
                        className="absolute start-3 top-0 z-(--z-dropdown) mt-[-30px] max-w-[calc(100%-1.5rem)] truncate rounded-[0.7rem] border-2 px-2 py-1 text-xs"
                        style={{ background: theme.background, borderColor: theme.border, color: theme.text }}>
                        <span className="hidden sm:inline">Press Tab to complete: </span>
                        <span className="[font-family:var(--font-code)] font-semibold" style={{ color: theme.prompt }}>
                            {commandSuggestion}
                        </span>
                    </div>
                )}

                <Input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="h-11 min-w-0 flex-1 border-0 bg-transparent px-0 [font-family:var(--font-code)] text-sm shadow-none focus-visible:outline-0"
                    style={{ color: theme.text, caretColor: theme.prompt }}
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
                    size="icon"
                    variant="ghost"
                    className="flex-shrink-0 hover:bg-black/20"
                    style={{ color: theme.prompt }}
                    aria-label={t("terminal.enterCommand")}>
                    <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
            </form>

            {/* Autocomplete dropdown - adjusted for mobile */}
            {showAutocomplete && fileAutocomplete.length > 0 && (
                <div className="gm-scroll border-gm-line bg-gm-night absolute start-0 end-0 bottom-full z-(--z-dropdown) max-h-40 overflow-y-auto rounded-t-[0.85rem] border-2 p-1">
                    {fileAutocomplete.map(file => (
                        <button
                            key={file}
                            type="button"
                            className="text-gm-ink-soft hover:bg-gm-deep hover:text-gm-ink active:bg-gm-grape active:text-gm-ink focus-visible:outline-gm-cyan flex min-h-11 w-full cursor-pointer items-center rounded-[0.7rem] px-2 py-1.5 text-start [font-family:var(--font-code)] text-xs transition-colors duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-3 focus-visible:-outline-offset-2 sm:min-h-9 sm:text-sm"
                            onClick={() => selectAutocompleteOption(file)}
                            onTouchEnd={e => {
                                e.preventDefault();
                                selectAutocompleteOption(file);
                            }}>
                            {file}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
