/**
 * CORS, JSON responses and D1 error classification.
 *
 * The static site and this Worker are different origins, so every response — including every
 * error response — needs CORS headers. A 429 without them shows up in the browser as an opaque
 * network failure rather than "you are being rate limited", which is the kind of bug that costs
 * an afternoon.
 */

import type { Env } from "./types";

/** Chromium caps preflight caching at 7200s, so there is no point asking for more. */
const MAX_AGE_SECONDS = 7200;

function allowedOrigins(env: Env): string[] {
    return env.ALLOWED_ORIGINS.split(",")
        .map(origin => origin.trim())
        .filter(Boolean);
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Is this Worker itself running on a developer's machine?
 *
 * Derived from the Worker's own hostname rather than from configuration, because configuration is
 * the part that gets forgotten. A deployed Worker is never served from localhost, so this cannot
 * loosen production no matter what anyone puts in `vars` — and `wrangler dev` works out of the box
 * instead of needing a flag nobody remembers.
 */
function isLocalRuntime(request: Request): boolean {
    try {
        return LOCAL_HOSTS.has(new URL(request.url).hostname);
    } catch {
        return false;
    }
}

/** A dev server on any port of the local machine, e.g. `http://localhost:3000`. */
function isLocalOrigin(origin: string): boolean {
    try {
        const url = new URL(origin);
        return url.protocol === "http:" && LOCAL_HOSTS.has(url.hostname);
    } catch {
        return false;
    }
}

/**
 * Headers for a request's origin.
 *
 * Exact match only. A `startsWith` or a regex here is how `https://gitmastery.me.evil.com` gets
 * itself allowlisted. `Vary: Origin` is unconditional, because without it a shared cache can
 * hand one site's `Access-Control-Allow-Origin` to another.
 */
export function corsHeaders(request: Request, env: Env): Record<string, string> {
    const headers: Record<string, string> = { Vary: "Origin" };
    const origin = request.headers.get("Origin");
    if (!origin) return headers;

    const permitted = allowedOrigins(env).includes(origin) || (isLocalRuntime(request) && isLocalOrigin(origin));
    if (!permitted) return headers;

    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS";
    // Neither Authorization nor a JSON content type is CORS-safelisted, so both must be named
    // here and every authenticated request will preflight.
    headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type";
    headers["Access-Control-Max-Age"] = String(MAX_AGE_SECONDS);
    // No Access-Control-Allow-Credentials: the bearer token makes cookies unnecessary, and
    // cookies would not work here anyway — workers.dev is on the Public Suffix List, so a cookie
    // shared with gitmastery.me would be a third-party cookie that Safari blocks outright.
    return headers;
}

export function handlePreflight(request: Request, env: Env): Response {
    const headers = corsHeaders(request, env);
    if (!headers["Access-Control-Allow-Origin"]) {
        return new Response(null, { status: 403, headers });
    }
    return new Response(null, { status: 204, headers });
}

export function json(
    body: unknown,
    status: number,
    request: Request,
    env: Env,
    extra?: Record<string, string>,
): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            ...corsHeaders(request, env),
            ...extra,
            "Content-Type": "application/json; charset=utf-8",
            // This API is never a browsing target and never cached.
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
        },
    });
}

export function errorResponse(
    code: string,
    status: number,
    request: Request,
    env: Env,
    extra?: Record<string, string>,
): Response {
    return json({ error: code }, status, request, env, extra);
}

export function noContent(request: Request, env: Env): Response {
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
}

/**
 * Detect a UNIQUE constraint violation.
 *
 * D1 throws a plain `Error` with no `code` property, so the message is all there is to go on, and
 * the useful message can be one or two levels down the `cause` chain. The message carries
 * `table.column`, which is what makes it safe to ask about a specific constraint rather than
 * treating every constraint failure as "username taken".
 */
export function isUniqueViolation(error: unknown, column?: string): boolean {
    let current: unknown = error;
    for (let depth = 0; current instanceof Error && depth < 5; depth++) {
        const message = current.message;
        if (message.includes("SQLITE_CONSTRAINT_UNIQUE") || message.includes("UNIQUE constraint failed")) {
            if (!column || message.includes(column)) return true;
        }
        current = current.cause;
    }
    return false;
}

/**
 * Detect D1's daily free-tier quota errors, which became hard failures in September 2026.
 *
 * Worth distinguishing from a generic 500: the correct client behaviour is to keep the outbox and
 * retry after midnight UTC, not to give up, and the correct message to the player is "saving is
 * paused" rather than "something went wrong".
 */
export function isQuotaExhausted(error: unknown): boolean {
    let current: unknown = error;
    for (let depth = 0; current instanceof Error && depth < 5; depth++) {
        if (/exceeded .*(daily|free tier).*(row read|row write|limit)/i.test(current.message)) return true;
        current = current.cause;
    }
    return false;
}

export function nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

export function clientIp(request: Request): string {
    return request.headers.get("CF-Connecting-IP") ?? "unknown";
}
