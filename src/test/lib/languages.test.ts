import { describe, expect, it } from "vitest";
import { detectLanguage } from "~/lib/languages";

describe("detectLanguage", () => {
    it("uses the browser language when the language allows auto-detection", () => {
        expect(detectLanguage(["de-DE"])).toBe("de");
        expect(detectLanguage(["tr"])).toBe("tr");
        expect(detectLanguage(["fa-IR"])).toBe("fa");
    });

    it("falls back to the timezone when the browser language is unsupported", () => {
        expect(detectLanguage(["fr-FR"], "Europe/Berlin")).toBe("de");
        expect(detectLanguage(["en-US"], "Europe/Istanbul")).toBe("en");
    });

    it("never picks Hindi automatically, not from the timezone", () => {
        expect(detectLanguage(["en-IN"], "Asia/Kolkata")).toBe("en");
        expect(detectLanguage(["ta-IN"], "Asia/Calcutta")).toBe("en");
    });

    it("never picks Hindi automatically, not from the browser language", () => {
        expect(detectLanguage(["hi-IN"], "Asia/Kolkata")).toBe("en");
    });

    it("skips languages with auto-detection off and uses the next browser language", () => {
        expect(detectLanguage(["hi-IN", "de"])).toBe("de");
    });

    it("defaults to English", () => {
        expect(detectLanguage([])).toBe("en");
        expect(detectLanguage(["ja-JP"], "Asia/Tokyo")).toBe("en");
    });
});
