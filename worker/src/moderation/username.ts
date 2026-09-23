/**
 * Username validation: charset, shape, uniqueness-normalisation and moderation.
 *
 * Runs only on the server. The word lists are readable in this public repo either way, but
 * shipping the matcher to the browser would hand anyone an unlimited offline oracle for
 * brute-forcing a bypass; keeping it here makes every probe a rate-limited request instead.
 */

import { DataSet, RegExpMatcher, englishDataset, englishRecommendedTransformers, parseRawPattern } from "obscenity";
import { NAME_WHITELIST, PROFANITY, RESERVED_NAMES, SLURS } from "./wordlists";

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

/**
 * The charset gate, and it runs first for a reason.
 *
 * Restricting to ASCII letters, digits, `_` and `-` before anything else eliminates the entire
 * Unicode homoglyph class in one step: Cyrillic `а`, Greek `Μ`, Turkish dotless `ı`, fullwidth
 * `ｍｉｋａ` and zero-width joiners are simply not expressible, so nobody can register a name that
 * renders identically to someone else's. Lowercasing alone does not do this — of ten homoglyph
 * variants of one name, `toLowerCase()` leaves eight distinct.
 */
const USERNAME_PATTERN = /^[A-Za-z0-9_-]{3,20}$/;

export type UsernameRejection =
    | "too_short"
    | "too_long"
    | "charset"
    | "inappropriate"
    | "reserved"
    | "needs_letter_or_digit";

export type UsernameCheck =
    | { ok: true; username: string; normalized: string }
    | { ok: false; reason: UsernameRejection };

/**
 * The form used for the uniqueness index.
 *
 * Strips diacritics, case and separators, and collapses runs of three or more identical
 * characters, so `Mika`, `mika`, `m-i-k-a` and `miiiika` all collide rather than becoming four
 * accounts one of which is pretending to be another.
 */
export function normalizeUsername(raw: string): string {
    return raw
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/(.)\1{2,}/g, "$1$1");
}

/**
 * Digit-for-letter substitutions, used only for the reserved-name check.
 *
 * `1` is ambiguous — it stands in for both `i` and `l` — so both readings are produced and the
 * name is refused if any of them lands on a reserved word. That is the right bias here: `adm1n`
 * has no innocent reading, and the cost of over-refusing is one rejected username.
 *
 * This is not applied to the profanity lists, which have obscenity's own leetspeak transformers
 * for the job.
 */
function leetVariants(normalized: string): string[] {
    const simple = normalized
        .replace(/0/g, "o")
        .replace(/3/g, "e")
        .replace(/4/g, "a")
        .replace(/5/g, "s")
        .replace(/7/g, "t");
    return [normalized, simple.replace(/1/g, "i"), simple.replace(/1/g, "l")];
}

/**
 * Matchers, built once per isolate.
 *
 * Construction costs roughly 1.5ms against 0.02ms per check, so building these inside a request
 * handler would multiply the CPU cost of a registration by about seventy-five for nothing.
 */
function buildMatcher(terms: readonly string[], withEnglishDataset: boolean): RegExpMatcher {
    let dataset = new DataSet<{ originalWord: string }>();

    if (withEnglishDataset) {
        dataset = dataset.addAll(englishDataset);
    }

    for (const term of terms) {
        // `parseRawPattern`, not `pattern`: `pattern` is a tagged-template function that reads
        // `strings.raw[0]`, so calling it with a runtime string throws a TypeError.
        dataset = dataset.addPhrase(phrase =>
            phrase.setMetadata({ originalWord: term }).addPattern(parseRawPattern(term)),
        );
    }

    dataset = dataset.addPhrase(phrase =>
        NAME_WHITELIST.reduce(
            (builder, allowed) => builder.addWhitelistedTerm(allowed),
            phrase.setMetadata({ originalWord: "__whitelist" }),
        ),
    );

    return new RegExpMatcher({ ...dataset.build(), ...englishRecommendedTransformers });
}

const slurMatcher = buildMatcher(SLURS, false);
const profanityMatcher = buildMatcher(PROFANITY, true);
const reserved = new Set(RESERVED_NAMES.map(normalizeUsername));

/**
 * Both the raw and the normalised form are tested against both matchers.
 *
 * Neither alone is enough: testing only the raw string misses separator tricks (`f u c k`,
 * `f.u.c.k`), while testing only the normalised string defeats obscenity's own leetspeak and
 * confusable transformers, because stripping non-letters turns `b!tch` into `btch`.
 */
function hasMatch(matcher: RegExpMatcher, raw: string, normalized: string): boolean {
    return matcher.hasMatch(raw) || matcher.hasMatch(normalized);
}

export function checkUsername(raw: unknown): UsernameCheck {
    if (typeof raw !== "string") return { ok: false, reason: "charset" };

    const username = raw.trim();
    if (username.length < USERNAME_MIN_LENGTH) return { ok: false, reason: "too_short" };
    if (username.length > USERNAME_MAX_LENGTH) return { ok: false, reason: "too_long" };
    if (!USERNAME_PATTERN.test(username)) return { ok: false, reason: "charset" };

    const normalized = normalizeUsername(username);
    // A name of only underscores and dashes normalises to nothing, which would collide with
    // every other such name and index as an empty string.
    if (normalized.length < USERNAME_MIN_LENGTH) return { ok: false, reason: "needs_letter_or_digit" };

    if (leetVariants(normalized).some(variant => reserved.has(variant))) {
        return { ok: false, reason: "reserved" };
    }
    if (hasMatch(slurMatcher, username, normalized)) return { ok: false, reason: "inappropriate" };
    if (hasMatch(profanityMatcher, username, normalized)) return { ok: false, reason: "inappropriate" };

    return { ok: true, username, normalized };
}
