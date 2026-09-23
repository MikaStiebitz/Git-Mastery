import { describe, expect, it } from "vitest";

import { checkUsername, normalizeUsername } from "../src/moderation/username";

/**
 * Username moderation.
 *
 * Two failure modes matter and they pull against each other: letting a slur through, and rejecting
 * somebody's actual surname. The second is the one that gets no bug report — the person just
 * leaves — so the false-positive list here is as long as the blocked list on purpose.
 */

const accepted = (name: string) => {
    const result = checkUsername(name);
    return result.ok ? result.normalized : `REJECTED(${result.reason})`;
};

describe("ordinary names are left alone", () => {
    const names = ["Mika", "git_wizard", "coder-99", "MergeMaster", "rebase_king", "a_b-c", "xX_rebase_Xx", "commit42"];

    for (const name of names) {
        it(`accepts ${name}`, () => {
            expect(checkUsername(name).ok).toBe(true);
        });
    }
});

describe("real words and surnames that a naive word list would reject", () => {
    // Every one of these was verified to be rejected before its whitelist entry existed. That is
    // the only reason to trust a whitelist: it should be evidence, not superstition.
    const names = [
        "analyst42",
        "Assassin",
        "Scunthorpe",
        "Penistone",
        "Dickson",
        "Cumming",
        "Pissarro",
        "Bratzel",
        "Titan",
        "bassline",
        "classic",
        "assistant",
        "associate",
        "cucumber",
    ];

    for (const name of names) {
        it(`does not reject ${name}`, () => {
            expect(accepted(name)).not.toMatch(/^REJECTED/);
        });
    }
});

describe("slurs are refused however they are spelled", () => {
    const names = [
        "hurensohn",
        "h_u_r_e_n_s_o_h_n",
        "HuReNsOhN",
        "n1gger",
        "ni66er",
        "NEGER",
        "n3g3r",
        "kanake",
        "judensau",
        "hitler",
        "H1tl3r",
        "arschloch",
        "4rschl0ch",
        "Sch3isse",
    ];

    for (const name of names) {
        it(`refuses ${name}`, () => {
            expect(checkUsername(name).ok).toBe(false);
        });
    }
});

describe("names that impersonate the site are reserved", () => {
    for (const name of ["admin", "Admin", "adm1n", "moderator", "gitmastery", "support", "system"]) {
        it(`refuses ${name}`, () => {
            const result = checkUsername(name);
            expect(result.ok).toBe(false);
        });
    }
});

describe("the charset gate closes the homoglyph hole", () => {
    /**
     * This is why the charset check runs before anything else. Lowercasing does not help: of ten
     * ways to render "mika" with lookalike characters, `toLowerCase()` leaves eight of them as
     * distinct strings, each free to register as a separate account that renders identically to
     * somebody else's.
     */
    const impostors = [
        "mikа", // Cyrillic а
        "Μika", // Greek Mu
        "ｍｉｋａ", // fullwidth
        "mi​ka", // zero-width space
        "mıka", // Turkish dotless i
        "miká", // combining accent
        "münchen", // non-ASCII, however legitimate
    ];

    for (const name of impostors) {
        it(`refuses ${JSON.stringify(name)}`, () => {
            const result = checkUsername(name);
            expect(result.ok).toBe(false);
            if (!result.ok) expect(result.reason).toBe("charset");
        });
    }
});

describe("shape rules", () => {
    it("refuses a name shorter than three characters", () => {
        expect(accepted("ab")).toBe("REJECTED(too_short)");
    });

    it("refuses a name longer than twenty", () => {
        expect(accepted("a".repeat(21))).toBe("REJECTED(too_long)");
    });

    it("refuses a name made only of separators, which would normalise to nothing", () => {
        expect(accepted("___")).toBe("REJECTED(needs_letter_or_digit)");
        expect(accepted("-_-")).toBe("REJECTED(needs_letter_or_digit)");
    });

    it("refuses whitespace and punctuation", () => {
        for (const name of ["git wizard", "git.wizard", "git/wizard", "git@home", "<script>"]) {
            expect(checkUsername(name).ok, name).toBe(false);
        }
    });

    it("refuses anything that is not a string", () => {
        for (const value of [null, undefined, 42, {}, []]) {
            expect(checkUsername(value).ok).toBe(false);
        }
    });
});

describe("the uniqueness key folds the variants that matter", () => {
    it("collapses case and separators so they cannot become separate accounts", () => {
        expect(normalizeUsername("Mika")).toBe("mika");
        expect(normalizeUsername("MIKA")).toBe("mika");
        expect(normalizeUsername("m-i-k-a")).toBe("mika");
        expect(normalizeUsername("m_i_k_a")).toBe("mika");
    });

    it("collapses runs of three or more repeats", () => {
        expect(normalizeUsername("miiiika")).toBe("miika");
        expect(normalizeUsername("miiiiiiiiika")).toBe("miika");
    });

    it("keeps genuinely different names apart", () => {
        expect(normalizeUsername("mika")).not.toBe(normalizeUsername("mike"));
        expect(normalizeUsername("git")).not.toBe(normalizeUsername("gut"));
    });
});
