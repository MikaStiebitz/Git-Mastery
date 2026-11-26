import { describe, it, expect } from "vitest";

import commonEn from "~/translations/en/common";
import levelsEn from "~/translations/en/levels";
import terminalEn from "~/translations/en/terminal";
import homeEn from "~/translations/en/home";
import playgroundEn from "~/translations/en/playground";
import installationEn from "~/translations/en/installation";
import faqEn from "~/translations/en/faq";

import commonDe from "~/translations/de/common";
import levelsDe from "~/translations/de/levels";
import terminalDe from "~/translations/de/terminal";
import homeDe from "~/translations/de/home";
import playgroundDe from "~/translations/de/playground";
import installationDe from "~/translations/de/installation";
import faqDe from "~/translations/de/faq";

import commonEs from "~/translations/es/common";
import levelsEs from "~/translations/es/levels";
import terminalEs from "~/translations/es/terminal";
import homeEs from "~/translations/es/home";
import playgroundEs from "~/translations/es/playground";
import installationEs from "~/translations/es/installation";
import faqEs from "~/translations/es/faq";

import commonFa from "~/translations/fa/common";
import levelsFa from "~/translations/fa/levels";
import terminalFa from "~/translations/fa/terminal";
import homeFa from "~/translations/fa/home";
import playgroundFa from "~/translations/fa/playground";
import installationFa from "~/translations/fa/installation";
import faqFa from "~/translations/fa/faq";

import commonHi from "~/translations/hi/common";
import levelsHi from "~/translations/hi/levels";
import terminalHi from "~/translations/hi/terminal";
import homeHi from "~/translations/hi/home";
import playgroundHi from "~/translations/hi/playground";
import installationHi from "~/translations/hi/installation";
import faqHi from "~/translations/hi/faq";

import commonPtBR from "~/translations/pt-BR/common";
import levelsPtBR from "~/translations/pt-BR/levels";
import terminalPtBR from "~/translations/pt-BR/terminal";
import homePtBR from "~/translations/pt-BR/home";
import playgroundPtBR from "~/translations/pt-BR/playground";
import installationPtBR from "~/translations/pt-BR/installation";
import faqPtBR from "~/translations/pt-BR/faq";

import commonTr from "~/translations/tr/common";
import levelsTr from "~/translations/tr/levels";
import terminalTr from "~/translations/tr/terminal";
import homeTr from "~/translations/tr/home";
import playgroundTr from "~/translations/tr/playground";
import installationTr from "~/translations/tr/installation";
import faqTr from "~/translations/tr/faq";

type TranslationMap = Record<string, string>;

const files: Record<string, Record<string, TranslationMap>> = {
    common: {
        en: commonEn,
        de: commonDe,
        es: commonEs,
        fa: commonFa,
        hi: commonHi,
        "pt-BR": commonPtBR,
        tr: commonTr,
    },
    levels: {
        en: levelsEn,
        de: levelsDe,
        es: levelsEs,
        fa: levelsFa,
        hi: levelsHi,
        "pt-BR": levelsPtBR,
        tr: levelsTr,
    },
    terminal: {
        en: terminalEn,
        de: terminalDe,
        es: terminalEs,
        fa: terminalFa,
        hi: terminalHi,
        "pt-BR": terminalPtBR,
        tr: terminalTr,
    },
    home: { en: homeEn, de: homeDe, es: homeEs, fa: homeFa, hi: homeHi, "pt-BR": homePtBR, tr: homeTr },
    playground: {
        en: playgroundEn,
        de: playgroundDe,
        es: playgroundEs,
        fa: playgroundFa,
        hi: playgroundHi,
        "pt-BR": playgroundPtBR,
        tr: playgroundTr,
    },
    installation: {
        en: installationEn,
        de: installationDe,
        es: installationEs,
        fa: installationFa,
        hi: installationHi,
        "pt-BR": installationPtBR,
        tr: installationTr,
    },
    faq: { en: faqEn, de: faqDe, es: faqEs, fa: faqFa, hi: faqHi, "pt-BR": faqPtBR, tr: faqTr },
};

// Long strings (multi-sentence prose, story narratives, FAQ answers) that are still byte-identical
// to the English source are almost certainly copy-pasted and never translated, rather than a
// legitimate shared term (proper noun, URL, command syntax). Short identical values are common and
// fine (e.g. "Terminal", "FAQ", distro names, brand names like "GitHub Desktop").
const UNTRANSLATED_LENGTH_THRESHOLD = 150;

// Keys whose value is legitimately identical across every language regardless of length: literal
// shell scripts (comments and command syntax aren't prose to translate).
const UNTRANSLATABLE_KEYS = new Set([
    "installation.linux.enhanced.sourceSteps",
    "installation.mac.enhanced.homebrewSteps",
]);

// Placeholder names are interpolated by callers with plain replace(), so they
// must survive translation unchanged. Order does not matter for the check.
const placeholderSignature = (value: string) =>
    [...value.matchAll(/\{[a-zA-Z]+\}/g)]
        .map(match => match[0])
        .sort()
        .join("|");

describe("translation completeness", () => {
    for (const [fileName, langs] of Object.entries(files)) {
        const enKeys = Object.keys(langs.en ?? {});

        for (const lang of Object.keys(langs)) {
            if (lang === "en") continue;
            const obj = langs[lang]!;

            it(`${lang}/${fileName}.ts has every key that en/${fileName}.ts has`, () => {
                const missing = enKeys.filter(key => !(key in obj));
                expect(missing).toEqual([]);
            });

            it(`${lang}/${fileName}.ts has no long strings left untranslated (identical to English)`, () => {
                const stillEnglish = enKeys.filter(key => {
                    if (UNTRANSLATABLE_KEYS.has(key)) return false;
                    const enValue = langs.en![key];
                    const value = obj[key];
                    return (
                        typeof enValue === "string" &&
                        typeof value === "string" &&
                        value === enValue &&
                        enValue.length > UNTRANSLATED_LENGTH_THRESHOLD
                    );
                });
                expect(stillEnglish).toEqual([]);
            });

            it(`${lang}/${fileName}.ts preserves every placeholder`, () => {
                const mismatched = enKeys.filter(key => {
                    const enValue = langs.en![key];
                    const value = obj[key];
                    return (
                        typeof enValue === "string" &&
                        typeof value === "string" &&
                        placeholderSignature(enValue) !== placeholderSignature(value)
                    );
                });
                expect(mismatched).toEqual([]);
            });
        }
    }
});
