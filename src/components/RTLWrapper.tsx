"use client";

import React, { useEffect } from "react";
import { useLanguage } from "~/contexts/LanguageContext";

interface RTLWrapperProps {
    children: React.ReactNode;
}

export function RTLWrapper({ children }: RTLWrapperProps) {
    const { language } = useLanguage();

    useEffect(() => {
        const html = document.documentElement;
        
        // Set language attribute
        html.setAttribute("lang", language);
        
        // Set direction based on language
        if (language === "fa") {
            html.setAttribute("dir", "rtl");
            html.classList.add("rtl");
        } else {
            html.setAttribute("dir", "ltr");
            html.classList.remove("rtl");
        }
    }, [language]);

    return <>{children}</>;
}
