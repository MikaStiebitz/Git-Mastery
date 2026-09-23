import { describe, expect, it } from "vitest";

import { corsHeaders, isQuotaExhausted, isUniqueViolation } from "../src/http";
import type { Env } from "../src/types";

/**
 * CORS, which is the only thing standing between this API and any website that wants to use a
 * visitor's session.
 */

const env = {
    ALLOWED_ORIGINS: "https://gitmastery.me,https://www.gitmastery.me",
    SESSION_TTL_DAYS: "90",
} as Env;

const request = (url: string, origin?: string) =>
    new Request(url, origin ? { headers: { Origin: origin } } : undefined);

const deployed = (origin?: string) => request("https://gitmastery-accounts.workers.dev/v1/sync", origin);
const local = (origin?: string) => request("http://localhost:8788/v1/sync", origin);

describe("the production allowlist is exact", () => {
    it("allows the site", () => {
        expect(corsHeaders(deployed("https://gitmastery.me"), env)["Access-Control-Allow-Origin"]).toBe(
            "https://gitmastery.me",
        );
    });

    // The reason this is an exact-match list and not a `startsWith` or a regex.
    it("refuses a domain that merely begins with the site's name", () => {
        for (const origin of [
            "https://gitmastery.me.evil.com",
            "https://evil.com/gitmastery.me",
            "https://gitmastery.me.co",
            "http://gitmastery.me",
        ]) {
            expect(corsHeaders(deployed(origin), env)["Access-Control-Allow-Origin"], origin).toBeUndefined();
        }
    });

    it("never answers with a wildcard", () => {
        const headers = corsHeaders(deployed("https://gitmastery.me"), env);
        expect(headers["Access-Control-Allow-Origin"]).not.toBe("*");
    });

    it("never allows credentials, because the bearer token makes cookies unnecessary", () => {
        const headers = corsHeaders(deployed("https://gitmastery.me"), env);
        expect(headers["Access-Control-Allow-Credentials"]).toBeUndefined();
    });

    it("always varies on Origin, so a shared cache cannot cross the answers over", () => {
        expect(corsHeaders(deployed(), env).Vary).toBe("Origin");
        expect(corsHeaders(deployed("https://evil.com"), env).Vary).toBe("Origin");
    });
});

describe("local development works without configuring anything", () => {
    /**
     * `wrangler dev` reads the top-level `vars`, which hold the production origins only. Rather
     * than requiring a flag or a second copy of the config, a Worker running on localhost accepts
     * a localhost origin — something a deployed Worker can never be.
     */
    it("allows a dev server when the Worker is itself on localhost", () => {
        expect(corsHeaders(local("http://localhost:3000"), env)["Access-Control-Allow-Origin"]).toBe(
            "http://localhost:3000",
        );
        expect(corsHeaders(local("http://127.0.0.1:5173"), env)["Access-Control-Allow-Origin"]).toBe(
            "http://127.0.0.1:5173",
        );
    });

    // The whole point: this leniency cannot reach production.
    it("refuses a localhost origin once the Worker is deployed", () => {
        expect(corsHeaders(deployed("http://localhost:3000"), env)["Access-Control-Allow-Origin"]).toBeUndefined();
    });

    it("does not treat a remote host that merely mentions localhost as local", () => {
        for (const origin of ["http://localhost.evil.com", "https://notlocalhost", "http://localhost.com"]) {
            expect(corsHeaders(local(origin), env)["Access-Control-Allow-Origin"], origin).toBeUndefined();
        }
    });
});

describe("classifying D1 errors", () => {
    it("recognises a unique violation, and which column it was", () => {
        const error = new Error(
            "D1_ERROR: UNIQUE constraint failed: users.username_key: SQLITE_CONSTRAINT (extended: SQLITE_CONSTRAINT_UNIQUE)",
        );

        expect(isUniqueViolation(error)).toBe(true);
        expect(isUniqueViolation(error, "users.username_key")).toBe(true);
        expect(isUniqueViolation(error, "users.email")).toBe(false);
    });

    // D1 wraps its errors, and the useful message can be a level or two down.
    it("looks down the cause chain", () => {
        const inner = new Error("UNIQUE constraint failed: users.username_key: SQLITE_CONSTRAINT_UNIQUE");
        expect(isUniqueViolation(new Error("wrapped", { cause: inner }))).toBe(true);
    });

    it("does not mistake another constraint for a duplicate username", () => {
        expect(isUniqueViolation(new Error("D1_ERROR: NOT NULL constraint failed: users.username"))).toBe(false);
        expect(isUniqueViolation(new Error("D1_ERROR: FOREIGN KEY constraint failed"))).toBe(false);
    });

    it("recognises the daily free-tier limit, which is a retry rather than a failure", () => {
        expect(isQuotaExhausted(new Error("Your account has exceeded D1's free tier daily row write limit."))).toBe(
            true,
        );
        expect(isQuotaExhausted(new Error('D1_ERROR: near "SELEKT": syntax error'))).toBe(false);
    });
});
