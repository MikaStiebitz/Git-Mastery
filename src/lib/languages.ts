export type Language = "de" | "en" | "es" | "fa" | "hi" | "tr";

/**
 * How aggressively we pick a language for first-time visitors.
 *
 * - "full": use the browser language, then fall back to a timezone guess
 * - "browser": use the browser language only (a timezone says little about the language)
 * - "off": never pick it automatically; visitors get English and choose it themselves
 *
 * Use "off" for languages that are spoken across a country that has many
 * other major languages (e.g. Hindi in India), where "this person is in
 * country X" does not mean "this person reads language Y".
 */
export type AutoDetect = "full" | "browser" | "off";

export type LanguageConfig = {
    code: Language;
    name: string;
    nativeName: string;
    autoDetect: AutoDetect;
    /** Language tag prefixes (lowercase) matched against navigator.languages */
    browserPrefixes: string[];
    /** IANA timezone fragments that suggest this language (only used with autoDetect "full") */
    timezones: string[];
};

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGES: LanguageConfig[] = [
    { code: "en", name: "English", nativeName: "English", autoDetect: "full", browserPrefixes: ["en"], timezones: [] },
    {
        code: "de",
        name: "German",
        nativeName: "Deutsch",
        autoDetect: "full",
        browserPrefixes: ["de"],
        timezones: ["Berlin", "Vienna", "Zurich"],
    },
    {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        autoDetect: "full",
        browserPrefixes: ["es"],
        timezones: ["Madrid", "Mexico_City", "Buenos_Aires"],
    },
    {
        code: "fa",
        name: "Persian",
        nativeName: "فارسی",
        autoDetect: "full",
        browserPrefixes: ["fa", "per"],
        timezones: ["Tehran", "Kabul", "Dushanbe"],
    },
    // India has many major languages (Tamil, Telugu, Bengali, Marathi, ...), so
    // neither the browser language nor the timezone is a reliable hint for Hindi.
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", autoDetect: "off", browserPrefixes: ["hi"], timezones: [] },
    {
        code: "tr",
        name: "Turkish",
        nativeName: "Türkçe",
        autoDetect: "full",
        browserPrefixes: ["tr"],
        timezones: ["Istanbul"],
    },
];

export const isLanguage = (value: unknown): value is Language =>
    typeof value === "string" && LANGUAGES.some(l => l.code === value);

/**
 * Pick a language for a first-time visitor. Only languages whose `autoDetect`
 * allows it are ever returned; everything else ends up as English.
 */
export const detectLanguage = (browserLanguages: readonly string[], timeZone?: string): Language => {
    for (const tag of browserLanguages) {
        const lower = tag.toLowerCase();
        const match = LANGUAGES.find(
            l => l.autoDetect !== "off" && l.browserPrefixes.some(prefix => lower.startsWith(prefix)),
        );
        if (match) return match.code;
    }

    if (timeZone) {
        const match = LANGUAGES.find(l => l.autoDetect === "full" && l.timezones.some(tz => timeZone.includes(tz)));
        if (match) return match.code;
    }

    return DEFAULT_LANGUAGE;
};
