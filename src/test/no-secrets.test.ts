import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { env } from "~/env";

/**
 * A guard against this public repository gaining a secret.
 *
 * Generic secret scanners look for things that look like keys. They would not catch this project's
 * most likely mistake, which is a genuinely sensitive value being given a `NEXT_PUBLIC_` prefix or
 * added to the `client` block of `src/env.js`. Under `output: "export"` there is no server at
 * runtime, so every client variable is inlined into files served to the public — a secret there is
 * not merely exposed, it is published.
 */

const ROOT = process.cwd();

/** Client env vars that are allowed to exist. Adding one here should take a moment's thought. */
const ALLOWED_CLIENT_VARS = new Set([
    // A feature flag, false in production.
    "NEXT_PUBLIC_DEBUG_MODE",
    // Public by construction: it is rendered into a `data-cf-beacon` attribute on every page.
    "NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN",
    // The account API's address. An endpoint the browser calls, so it is public either way.
    "NEXT_PUBLIC_ACCOUNT_API_URL",
]);

describe("no secrets reach the browser", () => {
    it("has no client env var that is not on the allowlist", () => {
        const source = readFileSync(join(ROOT, "src/env.js"), "utf8");
        const clientBlock = /client:\s*\{([\s\S]*?)\n    \},/.exec(source)?.[1] ?? "";
        const declared = [...clientBlock.matchAll(/(NEXT_PUBLIC_[A-Z0-9_]+)\s*:/g)].map(match => match[1]!);

        expect(declared.length).toBeGreaterThan(0);
        expect(declared.filter(name => !ALLOWED_CLIENT_VARS.has(name))).toEqual([]);
    });

    /**
     * The one that would quietly destroy the anti-cheat.
     *
     * If a signing or pepper key were ever imported into the app bundle, the browser could sign
     * whatever it liked and the server's validation would become decoration — and the key itself
     * would ship to every visitor.
     */
    it("never references the Worker's pepper from application code", () => {
        const offenders: string[] = [];

        const walk = (dir: string) => {
            for (const entry of readdirSync(dir)) {
                const path = join(dir, entry);
                if (statSync(path).isDirectory()) {
                    walk(path);
                    continue;
                }
                if (!/\.(ts|tsx|js|jsx)$/.test(entry)) continue;
                // This file necessarily names the thing it is looking for.
                if (path.endsWith("no-secrets.test.ts")) continue;

                const content = readFileSync(path, "utf8");
                if (/PASSWORD_PEPPER|SESSION_SECRET/.test(content)) offenders.push(path.replace(ROOT, ""));
            }
        };

        walk(join(ROOT, "src"));
        expect(offenders).toEqual([]);
    });

    it("keeps the account API URL optional, so a build without it still works", () => {
        // Not asserting a value — it is unset in CI and set in production. What matters is that
        // nothing requires it, because the game has to build and run without any backend at all.
        expect(() => env.NEXT_PUBLIC_ACCOUNT_API_URL).not.toThrow();
    });

    /**
     * Tracked, not merely present.
     *
     * A developer having a local `.env.local` or `worker/.dev.vars` is correct — that is where
     * local secrets are supposed to live. The failure worth catching is one of them being added to
     * the repository, which is a question about git's index, not about the filesystem.
     */
    it("has no env or secret file in the repository", () => {
        const tracked = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" }).split("\n");
        const leaked = tracked.filter(path => /(^|\/)\.env($|\.)|(^|\/)\.dev\.vars$/.test(path));

        expect(leaked).toEqual([]);
    });

    it("ignores every path a Worker secret could land in", () => {
        const gitignore = readFileSync(join(ROOT, ".gitignore"), "utf8");

        for (const pattern of [".dev.vars", ".wrangler/", "worker/node_modules/"]) {
            expect(gitignore, `.gitignore is missing ${pattern}`).toContain(pattern);
        }
    });
});
