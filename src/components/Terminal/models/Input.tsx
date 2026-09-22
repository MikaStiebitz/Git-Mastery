import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Send } from "lucide-react";
import type { TerminalInputProps } from "../types";

/** Shared type styling, so the ghost completion sits exactly under the real text. */
const INPUT_TYPE = "[font-family:var(--font-code)] text-sm";

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
    // The suggestion is the whole command, so the part worth showing is what it adds to what has
    // already been typed. Comparing case-insensitively keeps "GIT IN" → "git init" aligned, and an
    // empty remainder means the command is already complete and there is nothing to offer.
    const completion =
        showCommandSuggestion && commandSuggestion.toLowerCase().startsWith(input.toLowerCase())
            ? commandSuggestion.slice(input.length)
            : "";

    return (
        <div className="relative border-t-2" style={{ borderColor: theme.border }}>
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2 px-3 py-2">
                {/* The branch and status live in the status bar above; the prompt is just the
                    caret you type after. */}
                <span
                    className={`flex-shrink-0 font-bold select-none ${INPUT_TYPE}`}
                    style={{ color: theme.prompt }}
                    aria-hidden="true">
                    $
                </span>

                {/*
                 * The completion is drawn inline, the way a shell does it, instead of in a chip
                 * floating above the input: there is nothing to collide with the autocomplete menu,
                 * it reads as one continuous command, and it needs no wording to explain itself.
                 *
                 * Alignment comes from rendering the already-typed text invisibly ahead of the
                 * remainder in the same type, so the ghost lines up without measuring anything.
                 */}
                <div className="relative min-w-0 flex-1">
                    {completion && (
                        <div
                            className={`pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre ${INPUT_TYPE}`}
                            aria-hidden="true">
                            <span className="invisible">{input}</span>
                            <span style={{ color: theme.text, opacity: 0.4 }}>{completion}</span>
                        </div>
                    )}

                    <Input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={`relative h-11 w-full border-0 bg-transparent px-0 shadow-none focus-visible:outline-0 ${INPUT_TYPE}`}
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
                </div>

                {/* A key cap rather than a sentence: it survives every translation, and it stays
                    readable at phone width where the old label was hidden entirely. */}
                {completion && (
                    <kbd
                        className="hidden flex-shrink-0 rounded-[0.45rem] border-2 px-1.5 py-0.5 text-[10px] leading-none font-bold tracking-wide uppercase sm:block"
                        style={{ borderColor: theme.border, color: theme.prompt }}>
                        Tab ⇥
                    </kbd>
                )}

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
