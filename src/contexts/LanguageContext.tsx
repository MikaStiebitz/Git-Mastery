"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "~/translations";
import { DEFAULT_LANGUAGE, detectLanguage, isLanguage, type Language } from "~/lib/languages";

export type { Language };

export type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Only languages the visitor picked themselves are stored. Auto-detected ones
// are recomputed on every visit so a wrong guess never sticks.
const STORAGE_KEY = "gitgud-language";
const EXPLICIT_KEY = "gitgud-language-explicit";

// Before the explicit marker existed, the auto-detected language was stored too.
// Hindi was often guessed from an Indian timezone, so drop that legacy value.
const LEGACY_GUESSED_LANGUAGES: Language[] = ["hi"];

const readStoredLanguage = (): Language | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!isLanguage(saved)) return null;
        const explicit = localStorage.getItem(EXPLICIT_KEY) === "1";
        if (!explicit && LEGACY_GUESSED_LANGUAGES.includes(saved)) return null;
        return saved;
    } catch {
        return null;
    }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Start in English; the effect below switches to the saved or detected language
    const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

    useEffect(() => {
        const saved = readStoredLanguage();
        if (saved) {
            setLanguageState(saved);
            return;
        }

        let timeZone: string | undefined;
        try {
            timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
            // Without a timezone we rely on the browser language alone
        }
        const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
        setLanguageState(detectLanguage(browserLanguages.filter(Boolean), timeZone));
    }, []);

    // Remember the language only when the visitor chooses it
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        try {
            localStorage.setItem(STORAGE_KEY, lang);
            localStorage.setItem(EXPLICIT_KEY, "1");
        } catch {
            // Storage unavailable (private mode); the choice lasts for this session
        }
    };

    // Translation function
    const t = (key: string): string => {
        const langTranslations = translations[language];
        if (!langTranslations || !langTranslations[key as keyof typeof langTranslations]) {
            // If translation not found, try to find it in English as fallback
            if (language !== "en" && translations.en[key as keyof typeof translations.en]) {
                return translations.en[key as keyof typeof translations.en];
            }
            // Return the key itself if no translation found
            return key;
        }
        return langTranslations[key as keyof typeof langTranslations];
    };

    return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
