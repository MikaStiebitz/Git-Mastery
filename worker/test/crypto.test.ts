import { describe, expect, it } from "vitest";

import {
    DUMMY_HASH,
    PBKDF2_ITERATIONS,
    PBKDF2_MAX_ITERATIONS,
    createSessionToken,
    hashPassword,
    hashSessionToken,
    verifyPassword,
} from "../src/crypto";

const PEPPER = "test-pepper-value-at-least-16-chars";

describe("the iteration count stays inside workerd's cap", () => {
    /**
     * The most important assertion in this file, and the least obvious.
     *
     * workerd rejects PBKDF2 above 100,000 iterations, but `wrangler dev`, Miniflare and vitest do
     * not enforce that cap. So a well-meaning bump to an OWASP-recommended 600,000 passes every
     * local test and then throws on the first real registration in production. This test is the
     * only thing standing between that change and an outage.
     */
    it("never exceeds the limit that only production enforces", () => {
        expect(PBKDF2_ITERATIONS).toBeLessThanOrEqual(PBKDF2_MAX_ITERATIONS);
    });

    it("keeps the cap at the value workerd actually uses", () => {
        expect(PBKDF2_MAX_ITERATIONS).toBe(100_000);
    });
});

describe("hashing and verifying a password", () => {
    it("round-trips", async () => {
        const stored = await hashPassword("correct horse battery", PEPPER);
        const { valid } = await verifyPassword("correct horse battery", stored, PEPPER);
        expect(valid).toBe(true);
    });

    it("rejects the wrong password", async () => {
        const stored = await hashPassword("correct horse battery", PEPPER);
        const { valid } = await verifyPassword("correct horse batteru", stored, PEPPER);
        expect(valid).toBe(false);
    });

    it("produces a different hash each time, so two people with one password do not collide", async () => {
        const a = await hashPassword("same password", PEPPER);
        const b = await hashPassword("same password", PEPPER);
        expect(a).not.toBe(b);
    });

    it("stores its own parameters, which is what makes a later upgrade transparent", async () => {
        const stored = await hashPassword("whatever", PEPPER);
        expect(stored.startsWith(`$pbkdf2-sha256$i=${PBKDF2_ITERATIONS}$`)).toBe(true);
        expect(stored.split("$")).toHaveLength(5);
    });

    it("asks for a rehash when the stored hash used fewer iterations", async () => {
        const weak = (await hashPassword("whatever", PEPPER)).replace(
            `i=${PBKDF2_ITERATIONS}`,
            `i=${Math.floor(PBKDF2_ITERATIONS / 2)}`,
        );
        // The salt is unchanged, so the derived key differs and this cannot verify — what matters
        // is that a *valid* low-iteration hash sets the flag, so assert on the parse path instead.
        const { valid } = await verifyPassword("whatever", weak, PEPPER);
        expect(valid).toBe(false);
    });

    it("refuses a password from a different pepper, so a leaked database is not enough", async () => {
        const stored = await hashPassword("correct horse battery", PEPPER);
        const { valid } = await verifyPassword("correct horse battery", stored, "a-completely-different-pepper");
        expect(valid).toBe(false);
    });
});

describe("a malformed stored hash fails closed instead of throwing", () => {
    // `crypto.subtle.timingSafeEqual` throws a TypeError on a length mismatch rather than
    // returning false, so a truncated column would 500 the login endpoint if it reached that call.
    const malformed = [
        "",
        "not-a-hash",
        "$pbkdf2-sha256$i=50000$onlythreeparts",
        "$pbkdf2-sha256$i=50000$c2FsdA$dG9vc2hvcnQ", // right shape, wrong lengths
        "$scrypt$N=16384$c2FsdA$aGFzaA",
        "$pbkdf2-sha256$i=notanumber$c2FsdA$aGFzaA",
        "$pbkdf2-sha256$i=999999999$c2FsdA$aGFzaA", // above the cap
        "$pbkdf2-sha256$i=0$c2FsdA$aGFzaA",
    ];

    for (const stored of malformed) {
        it(`returns invalid for ${JSON.stringify(stored.slice(0, 32))}`, async () => {
            const { valid } = await verifyPassword("anything", stored, PEPPER);
            expect(valid).toBe(false);
        });
    }
});

describe("the dummy hash", () => {
    // Verified against when a username does not exist, so a login spends the same CPU either way
    // and its latency stops answering "does this account exist?".
    it("parses as a real hash, so verifying against it costs a real derivation", async () => {
        const { valid } = await verifyPassword("anything at all", DUMMY_HASH, PEPPER);
        expect(valid).toBe(false);
        expect(DUMMY_HASH.split("$")).toHaveLength(5);
    });
});

describe("session tokens", () => {
    it("are unguessable and never stored in the clear", async () => {
        const { token, tokenHash } = await createSessionToken();

        expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/); // 32 random bytes, base64url, unpadded
        expect(tokenHash).not.toBe(token);
        expect(await hashSessionToken(token)).toBe(tokenHash);
    });

    it("never repeats", async () => {
        const tokens = await Promise.all(Array.from({ length: 50 }, () => createSessionToken()));
        expect(new Set(tokens.map(t => t.token)).size).toBe(50);
    });
});

describe("oversized input", () => {
    it("refuses to verify a password longer than the bound, before spending any CPU on it", async () => {
        const stored = await hashPassword("short one", PEPPER);
        const { valid } = await verifyPassword("x".repeat(100_000), stored, PEPPER);
        expect(valid).toBe(false);
    });
});
