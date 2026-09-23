/**
 * GitMastery's optional account API.
 *
 * The game does not need this Worker. It is entirely playable with no account, storing progress in
 * localStorage exactly as it always has; an account only adds the ability to carry that progress
 * to another device. So every failure mode here must be survivable: if this Worker is down, the
 * client keeps playing and keeps queueing, and nothing is lost.
 *
 * The security posture assumes the attacker has read this file, because they can — the repository
 * is public. Nothing here relies on an endpoint being unknown, a value being obscure, or a client
 * being the real game client.
 */

import {
    DUMMY_HASH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    createSessionToken,
    hashPassword,
    hashSessionToken,
    verifyPassword,
} from "./crypto";
import { clientIp, errorResponse, handlePreflight, isQuotaExhausted, json, noContent, nowSeconds } from "./http";
import { foldEvents } from "./ledger";
import { checkUsername } from "./moderation/username";
import { clearFailures, loginGate, recordFailure, registerGate, syncGate } from "./ratelimit";
import { MAX_BODY_BYTES, validateSyncRequest } from "./validate";
import type { Env, SyncResponse } from "./types";
import * as db from "./db";

/** A reject list of the most-guessed passwords. Short on purpose: a long list belongs elsewhere. */
const COMMON_PASSWORDS = new Set([
    "password",
    "password1",
    "password123",
    "12345678",
    "123456789",
    "1234567890",
    "qwertyui",
    "qwerty123",
    "iloveyou",
    "princess",
    "sunshine",
    "football",
    "baseball",
    "welcome1",
    "admin123",
    "letmein1",
    "passwort",
    "gitmastery",
    "git12345",
]);

function isAcceptablePassword(password: unknown): password is string {
    if (typeof password !== "string") return false;
    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) return false;
    if (COMMON_PASSWORDS.has(password.toLowerCase())) return false;
    // One character repeated is long but not a password.
    if (/^(.)\1*$/.test(password)) return false;
    return true;
}

/**
 * Read a JSON body, refusing oversized ones before parsing.
 *
 * The size check comes first deliberately. Parsing a 90MB body to then discover it has too many
 * events would be exactly the CPU exhaustion an attacker wants, so the cost of a hostile request
 * has to stay near zero.
 */
async function readJson(request: Request): Promise<unknown | undefined> {
    const declared = request.headers.get("Content-Length");
    if (declared !== null && Number(declared) > MAX_BODY_BYTES) return undefined;

    const text = await request.text().catch(() => null);
    if (text === null || text.length > MAX_BODY_BYTES) return undefined;

    try {
        return JSON.parse(text) as unknown;
    } catch {
        return undefined;
    }
}

function bearerToken(request: Request): string | null {
    const header = request.headers.get("Authorization");
    if (!header?.startsWith("Bearer ")) return null;
    const token = header.slice(7).trim();
    return token.length > 0 && token.length <= 256 ? token : null;
}

function sessionExpiry(env: Env): number {
    const days = Number.parseInt(env.SESSION_TTL_DAYS, 10);
    return nowSeconds() + (Number.isFinite(days) && days > 0 ? days : 90) * 24 * 60 * 60;
}

interface Authed {
    session: db.SessionUser;
    tokenHash: string;
}

async function authenticate(request: Request, env: Env): Promise<Authed | null> {
    const token = bearerToken(request);
    if (!token) return null;
    const tokenHash = await hashSessionToken(token);
    const session = await db.findSessionUser(env.DB, tokenHash);
    return session ? { session, tokenHash } : null;
}

/** The pepper has no fallback. A deploy that forgot the secret must fail loudly, not silently. */
function pepperOrNull(env: Env): string | null {
    const secret = env.PASSWORD_PEPPER;
    return typeof secret === "string" && secret.length >= 16 ? secret : null;
}

async function handleRegister(request: Request, env: Env, pepper: string): Promise<Response> {
    const gate = await registerGate(env, clientIp(request));
    if (!gate.ok) {
        return errorResponse("rate_limited", 429, request, env, { "Retry-After": String(gate.retryAfter) });
    }

    const body = await readJson(request);
    if (typeof body !== "object" || body === null) return errorResponse("malformed", 400, request, env);
    const { username, password } = body as { username?: unknown; password?: unknown };

    const name = checkUsername(username);
    if (!name.ok) return json({ error: "invalid_username", reason: name.reason }, 400, request, env);
    if (!isAcceptablePassword(password)) return errorResponse("weak_password", 400, request, env);

    const passwordHash = await hashPassword(password, pepper);
    const { token, tokenHash } = await createSessionToken();
    const expiresAt = sessionExpiry(env);

    const userId = await db.createUser(env.DB, name.username, name.normalized, passwordHash, tokenHash, expiresAt);
    if (userId === 0) return errorResponse("username_taken", 409, request, env);

    const state = await db.loadState(env.DB, userId);
    return json(
        { token, expiresAt: new Date(expiresAt * 1000).toISOString(), username: name.username, state },
        201,
        request,
        env,
    );
}

async function handleLogin(request: Request, env: Env, pepper: string): Promise<Response> {
    const body = await readJson(request);
    if (typeof body !== "object" || body === null) return errorResponse("malformed", 400, request, env);
    const { username, password } = body as { username?: unknown; password?: unknown };

    // The same generic answer for a malformed username, an unknown account and a wrong password.
    const generic = () => errorResponse("invalid_credentials", 401, request, env);

    const name = checkUsername(username);
    const candidate = typeof password === "string" ? password : "";
    if (!name.ok || candidate.length === 0 || candidate.length > PASSWORD_MAX_LENGTH) return generic();

    const gate = await loginGate(env, name.normalized, clientIp(request));
    if (!gate.ok) {
        return errorResponse("rate_limited", 429, request, env, { "Retry-After": String(gate.retryAfter) });
    }

    const user = await db.findUserByKey(env.DB, name.normalized);

    // Always spend a full verification, even with no user to verify against. Returning early here
    // would make a missing account answer in about a millisecond and a real one in five, which is
    // an account-enumeration oracle for anyone with a stopwatch.
    const stored = user?.password_hash ?? DUMMY_HASH;
    const { valid, needsRehash } = await verifyPassword(candidate, stored, pepper);

    if (!user || !valid) {
        // Recorded for unknown usernames too: a bucket that never locks out would itself reveal
        // that no such account exists.
        await recordFailure(env, name.normalized);
        return generic();
    }

    if (needsRehash) {
        await db.updatePassword(env.DB, user.id, await hashPassword(candidate, pepper));
    }

    const { token, tokenHash } = await createSessionToken();
    const expiresAt = sessionExpiry(env);
    await db.createSession(env.DB, user.id, tokenHash, expiresAt);
    await Promise.all([clearFailures(env, name.normalized), db.pruneExpiredSessions(env.DB, user.id)]);

    const state = await db.loadState(env.DB, user.id);
    return json(
        { token, expiresAt: new Date(expiresAt * 1000).toISOString(), username: user.username, state },
        200,
        request,
        env,
    );
}

async function handleSync(request: Request, env: Env, auth: Authed): Promise<Response> {
    const gate = await syncGate(env, auth.session.userId);
    if (!gate.ok) {
        return errorResponse("rate_limited", 429, request, env, { "Retry-After": String(gate.retryAfter) });
    }

    const body = await readJson(request);
    if (body === undefined) return errorResponse("payload_too_large", 413, request, env);

    const parsed = validateSyncRequest(body);
    if (!parsed) return errorResponse("malformed", 400, request, env);

    const [existing, startSeq] = await Promise.all([
        db.loadLedger(env.DB, auth.session.userId),
        db.maxSeq(env.DB, auth.session.userId),
    ]);

    const { accepted, rejected } = foldEvents({
        existing,
        events: parsed.request.events,
        now: Date.now(),
        accountCreatedAt: auth.session.createdAt * 1000,
        eggAlreadyAwarded: auth.session.eggAwardedAt > 0,
        imported: parsed.request.imported === true,
    });

    await db.commitBatch(env.DB, {
        userId: auth.session.userId,
        rows: accepted,
        startSeq,
        cursor: parsed.request.cursor,
        bests: parsed.request.bests,
        suspicion: parsed.malformedCount,
        markEggAwarded: accepted.some(row => row.kind === "egg"),
    });

    const state = await db.loadState(env.DB, auth.session.userId);
    const response: SyncResponse = { state, accepted: accepted.map(row => row.key), rejected };
    return json(response, 200, request, env);
}

async function handleChangePassword(request: Request, env: Env, auth: Authed, pepper: string): Promise<Response> {
    const body = await readJson(request);
    if (typeof body !== "object" || body === null) return errorResponse("malformed", 400, request, env);
    const { newPassword } = body as { newPassword?: unknown };

    if (!isAcceptablePassword(newPassword)) return errorResponse("weak_password", 400, request, env);

    // No current-password check: the session token this request carries is already the proof of
    // identity, the same way any other authenticated endpoint here works.
    const user = await db.findUserById(env.DB, auth.session.userId);
    if (!user) return errorResponse("invalid_credentials", 401, request, env);

    await db.updatePassword(env.DB, user.id, await hashPassword(newPassword, pepper));
    // Every session, including this one. A device whose token was stolen must lose it, and the
    // client re-authenticates silently with the new password.
    await db.deleteAllSessions(env.DB, user.id);

    return noContent(request, env);
}

async function handleChangeUsername(request: Request, env: Env, auth: Authed): Promise<Response> {
    const body = await readJson(request);
    if (typeof body !== "object" || body === null) return errorResponse("malformed", 400, request, env);
    const { newUsername } = body as { newUsername?: unknown };

    // The same moderation as registration. This is the endpoint people forget, and it is exactly
    // where a clean name gets renamed into a slur.
    const name = checkUsername(newUsername);
    if (!name.ok) return json({ error: "invalid_username", reason: name.reason }, 400, request, env);

    const changed = await db.updateUsername(env.DB, auth.session.userId, name.username, name.normalized);
    if (!changed) return errorResponse("username_taken", 409, request, env);

    return json({ username: name.username }, 200, request, env);
}

async function handleDeleteAccount(request: Request, env: Env, auth: Authed, pepper: string): Promise<Response> {
    const body = await readJson(request);
    if (typeof body !== "object" || body === null) return errorResponse("malformed", 400, request, env);
    const { password } = body as { password?: unknown };
    if (typeof password !== "string") return errorResponse("invalid_credentials", 401, request, env);

    const user = await db.findUserById(env.DB, auth.session.userId);
    if (!user) return errorResponse("invalid_credentials", 401, request, env);

    const { valid } = await verifyPassword(password, user.password_hash, pepper);
    if (!valid) return errorResponse("invalid_credentials", 401, request, env);

    await db.deleteUser(env.DB, user.id);
    return noContent(request, env);
}

async function route(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const method = request.method;

    if (method === "OPTIONS") return handlePreflight(request, env);

    if (path === "/v1/health" && method === "GET") {
        return json({ ok: true, time: new Date().toISOString() }, 200, request, env);
    }

    // Everything past this point either hashes a password or reads a session, and both need the
    // pepper. A missing secret is a deploy error, so it fails loudly rather than degrading.
    const pepper = pepperOrNull(env);
    if (!pepper) return errorResponse("server_misconfigured", 500, request, env);

    if (path === "/v1/auth/register" && method === "POST") return handleRegister(request, env, pepper);
    if (path === "/v1/auth/login" && method === "POST") return handleLogin(request, env, pepper);

    if (path === "/v1/auth/check-username" && method === "POST") {
        const gate = await registerGate(env, clientIp(request));
        if (!gate.ok) {
            return errorResponse("rate_limited", 429, request, env, { "Retry-After": String(gate.retryAfter) });
        }
        const body = await readJson(request);
        const name = checkUsername((body as { username?: unknown } | null)?.username);
        if (!name.ok) return json({ available: false, reason: name.reason }, 200, request, env);
        const existing = await db.findUserByKey(env.DB, name.normalized);
        return json({ available: existing === null }, 200, request, env);
    }

    const auth = await authenticate(request, env);
    if (!auth) return errorResponse("unauthorized", 401, request, env);

    if (path === "/v1/auth/logout" && method === "POST") {
        await db.deleteSession(env.DB, auth.tokenHash);
        return noContent(request, env);
    }

    if (path === "/v1/state" && method === "GET") {
        return json(
            { username: auth.session.username, state: await db.loadState(env.DB, auth.session.userId) },
            200,
            request,
            env,
        );
    }

    if (path === "/v1/sync" && method === "POST") return handleSync(request, env, auth);
    if (path === "/v1/account/password" && method === "POST") return handleChangePassword(request, env, auth, pepper);
    if (path === "/v1/account/username" && method === "POST") return handleChangeUsername(request, env, auth);

    if (path === "/v1/account/reset" && method === "POST") {
        await db.resetProgress(env.DB, auth.session.userId);
        return json({ state: await db.loadState(env.DB, auth.session.userId) }, 200, request, env);
    }

    if (path === "/v1/account" && method === "DELETE") return handleDeleteAccount(request, env, auth, pepper);

    return errorResponse("not_found", 404, request, env);
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        try {
            return await route(request, env);
        } catch (error) {
            // D1's daily free-tier limits became hard failures in September 2026. Saying so lets
            // the client keep its outbox and retry after midnight UTC instead of discarding
            // progress, and lets the player see "saving is paused" rather than a generic error.
            if (isQuotaExhausted(error)) {
                return errorResponse("storage_quota_exhausted", 503, request, env, { "Retry-After": "3600" });
            }
            console.error("unhandled", error instanceof Error ? error.message : String(error));
            return errorResponse("internal_error", 500, request, env);
        }
    },
} satisfies ExportedHandler<Env>;
