/**
 * Generates `src/moderation/wordlists.ts` from the LDNOOBW word lists.
 *
 * Run with `node scripts/gen-wordlists.mjs` after bumping `naughty-words`.
 *
 * Why generate rather than depend: `naughty-words` is CC-BY-4.0 while everything else here is
 * MIT, it was last published in 2020, and it ships 28 locales when this project needs 6. Baking
 * the six into a committed file keeps the licence out of the runtime dependency tree, keeps the
 * Worker bundle small, and — most usefully — makes the curated additions and exclusions below
 * reviewable in a diff instead of hidden behind a transform.
 */

import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** The locales the game ships. */
const LOCALES = ["en", "de", "es", "fa", "hi", "tr"];

/**
 * Terms LDNOOBW omits, added by hand.
 *
 * The German list in particular is thin on the words that actually matter for this filter: it
 * has none of the ethnic slurs and misses the most common German insult outright.
 */
const EXTRA_SLURS = [
    // German — absent from LDNOOBW's de.json entirely.
    "hurensohn",
    "neger",
    "kanake",
    "kanacke",
    "zigeuner",
    "untermensch",
    "judensau",
    "schwuchtel",
    // English — present in obscenity's dataset but repeated here so tier 1 does not depend on it.
    "nigger",
    "nigga",
    "faggot",
    "chink",
    "kike",
    "spic",
    "wetback",
    "tranny",
    "retard",
    // Ideological handles that are not profanity and so appear on no profanity list.
    "hitler",
    "nazi",
    "himmler",
    "goebbels",
    "holocaust",
    "heilhitler",
    "sieghei",
];

/**
 * Names that must not be claimable, because owning one lets an account speak with the site's
 * voice. Not profanity — impersonation.
 */
const RESERVED = [
    "admin",
    "administrator",
    "moderator",
    "mod",
    "staff",
    "support",
    "system",
    "root",
    "official",
    "gitmastery",
    "git-mastery",
    "owner",
    "team",
    "help",
    "security",
    "null",
    "undefined",
    "anonymous",
    "deleted",
];

/**
 * Short stems that match far more innocent names than offensive ones.
 *
 * Every one of these was verified to produce a false positive on a real name or word:
 * `Analyst`, `Pissarro`, `Titisee`, `Bratzel`, `Bonzenheimer`, `Fickel`, `Cumming`, `Dickson`,
 * `Assassin`, `Scunthorpe`. A username filter that rejects someone's surname is a worse bug
 * than one that lets a mild swear through, so these are excluded from substring matching and
 * left to obscenity's own word-boundary-aware English dataset.
 */
const FALSE_POSITIVE_STEMS = new Set([
    "anal",
    "arse",
    "ass",
    "bonze",
    "bratze",
    "cum",
    "dick",
    "dyke",
    "fick",
    "fuk",
    "hure",
    "homo",
    "jap",
    "lesbe",
    "muff",
    "nip",
    "paki",
    "piss",
    "pron",
    "sex",
    "tit",
    "titt",
    "twat",
    "wank",
    "willy",
    "xxx",
]);

/**
 * Legitimate substrings that may appear inside a rejected term. Fed to obscenity's whitelist.
 *
 * Most of these are real surnames. Every one was confirmed to be rejected without its entry
 * here, which is the only reason to trust a whitelist: it should be evidence, not superstition.
 */
const NAME_WHITELIST = [
    "analy", // analyst, analysis
    "assassin",
    "assess",
    "assign",
    "assist",
    "associate",
    "bass",
    "butters",
    "class",
    "cumber", // cucumber, Cumberland
    "cumming", // surname
    "cummins", // surname
    "cumul", // cumulative
    "dickens",
    "dickson",
    "document",
    "grape",
    "mass",
    "pass",
    "penistone",
    "pissarro", // surname
    "scunthorpe",
    "shitake", // shiitake
    "titan",
    "tith",
    "title",
];

/**
 * German transliterations. `ß` is the one that matters and the one that silently breaks.
 *
 * NFKD does not decompose `ß` into `ss` — it leaves it alone — so stripping non-ASCII turns
 * `scheiße` into `scheie`, which matches nothing a person would ever type. The umlauts do
 * decompose, giving `a`/`o`/`u`, but German convention writes them `ae`/`oe`/`ue` in ASCII, so
 * both spellings are emitted and a name is checked against the list either way.
 */
const TRANSLITERATIONS = [
    ["ß", "ss"],
    ["ä", "ae"],
    ["ö", "oe"],
    ["ü", "ue"],
];

const MIN_TERM_LENGTH = 5;

/**
 * Every ASCII spelling of a term that a person might actually type.
 *
 * Returns a set because `ö` has two plausible spellings (`o` and `oe`) and the list has to match
 * whichever one a user picked.
 */
function asciiVariants(term) {
    let variants = new Set([term]);

    for (const [from, to] of TRANSLITERATIONS) {
        const next = new Set();
        for (const variant of variants) {
            next.add(variant.replaceAll(from, to));
            // The diacritic-stripping path, which NFKD gives for umlauts but not for ß.
            next.add(variant.replaceAll(from, from === "ß" ? "ss" : to[0]));
        }
        variants = next;
    }

    const cleaned = new Set();
    for (const variant of variants) {
        const ascii = variant
            .normalize("NFKD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]/g, "");
        if (ascii.length > 0) cleaned.add(ascii);
    }
    return cleaned;
}

const slurs = new Set();
const profanity = new Set();

for (const slur of EXTRA_SLURS) {
    for (const variant of asciiVariants(slur.toLowerCase())) slurs.add(variant);
}

for (const locale of LOCALES) {
    /** @type {string[]} */
    const terms = require(`naughty-words/${locale}.json`);
    for (const raw of terms) {
        // Multi-word entries cannot appear in a username, which has no spaces.
        const term = raw.toLowerCase().trim();
        if (term.includes(" ")) continue;

        for (const normalised of asciiVariants(term)) {
            if (normalised.length < MIN_TERM_LENGTH) continue;
            if (FALSE_POSITIVE_STEMS.has(normalised)) continue;
            if (slurs.has(normalised)) continue;

            profanity.add(normalised);
        }
    }
}

const sorted = set => [...set].sort();
const asList = values => values.map(value => `    ${JSON.stringify(value)},`).join("\n");

const output = `/**
 * Word lists for username moderation. GENERATED — do not edit by hand.
 *
 * Regenerate with \`node scripts/gen-wordlists.mjs\`. The curated additions, the reserved names
 * and the false-positive exclusions all live in that script, where they can be reviewed.
 *
 * Derived from the List of Dirty, Naughty, Obscene, and Otherwise Bad Words
 * (https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words),
 * © Shutterstock, licensed CC-BY-4.0 (https://creativecommons.org/licenses/by/4.0/),
 * filtered to ${LOCALES.join("/")} and extended by hand.
 *
 * Reading this file is unpleasant. It exists so that nobody has to read these words in a
 * username on the site.
 */

/** Zero tolerance. Matched anywhere in the name, including across separators and leetspeak. */
export const SLURS: readonly string[] = [
${asList(sorted(slurs))}
];

/** Ordinary profanity. Same matching, kept separate so the two tiers can diverge later. */
export const PROFANITY: readonly string[] = [
${asList(sorted(profanity))}
];

/** Names nobody may register, because holding one impersonates the site. */
export const RESERVED_NAMES: readonly string[] = [
${asList(sorted(new Set(RESERVED.map(name => name.toLowerCase()))))}
];

/** Innocent substrings that would otherwise trip a match. */
export const NAME_WHITELIST: readonly string[] = [
${asList(sorted(new Set(NAME_WHITELIST)))}
];
`;

const target = new URL("../src/moderation/wordlists.ts", import.meta.url);
writeFileSync(target, output);
console.log(
    `wrote ${slurs.size} slurs, ${profanity.size} profanity terms, ` +
        `${RESERVED.length} reserved names, ${NAME_WHITELIST.length} whitelist entries`,
);
