"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "~/translations";

type Language = "de" | "en" | "fa";

export type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to English with auto-detection on first load
    const [language, setLanguageState] = useState<Language>("en");

    // Auto-detect language from browser on initial load
    useEffect(() => {
        const savedLanguage = localStorage.getItem("gitgud-language");

        if (savedLanguage === "en" || savedLanguage === "de" || savedLanguage === "fa") {
            // Use saved language preference
            setLanguageState(savedLanguage);
        } else {
            // Auto-detect from browser locale
            const browserLanguage = navigator.language || navigator.languages?.[0] || "en";
            const detectedLanguage = browserLanguage.toLowerCase();

            // Check if browser language indicates German
            if (detectedLanguage.startsWith("de")) {
                setLanguageState("de");
                localStorage.setItem("gitgud-language", "de");
            } else if (detectedLanguage.startsWith("fa")) {
                // Check if browser language indicates Persian/Farsi
                setLanguageState("fa");
                localStorage.setItem("gitgud-language", "fa");
            } else {
                // Default to English for all other languages
                setLanguageState("en");
                localStorage.setItem("gitgud-language", "en");
            }
        }
    }, []);

    // Save language to localStorage when it changes
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("gitgud-language", lang);
    };

    // Translation function
    const t = (key: string): string => {
        if (!translations[language][key as keyof (typeof translations)[typeof language]]) {
            // If translation not found, try to find it in English as fallback
            if (language !== "en" && translations.en[key as keyof typeof translations.en]) {
                return translations.en[key as keyof typeof translations.en];
            }
            // Return the key itself if no translation found
            return key;
        }
        return translations[language][key as keyof (typeof translations)[typeof language]];
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
