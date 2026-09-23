/**
 * Login and registration throttling, in two layers.
 *
 * Neither layer is sufficient alone. The rate limit binding is free and costs no latency, but
 * Cloudflare documents its counters as per-location and "intentionally designed to not be used as
 * an accurate accounting system" — a distributed credential-stuffing run hits many locations and
 * each gets its own budget. The D1 lockout is globally exact but costs a written row, so it is
 * paid only on a failed attempt: the write bill goes to attackers, not to players.
 *
 * Plan availability for the binding is not documented anywhere Cloudflare publishes, so every
 * call here fails OPEN. A limiter outage must never lock out every player.
 */

import { nowSeconds } from "./http";
import type { Env } from "./types";

const LOCKOUT_THRESHOLD = 8;
const WINDOW_SECONDS = 900;
const LOCKOUT_SECONDS = 900;

/**
 * Record a failed login and return the resulting lockout, if any.
 *
 * The repeated CASE is not redundancy: in SQLite the right-hand sides of an UPDATE's SET clauses
 * all see the pre-update row, so `fails + 1` inside the third CASE is the same value the first
 * CASE computes, not the one it assigned.
 */
const RECORD_FAILURE_SQL = `
INSERT INTO login_attempts (username_key, fails, window_start, locked_until)
VALUES (?1, 1, unixepoch(), 0)
ON CONFLICT(username_key) DO UPDATE SET
    fails        = CASE WHEN window_start < unixepoch() - ${WINDOW_SECONDS} THEN 1 ELSE fails + 1 END,
    window_start = CASE WHEN window_start < unixepoch() - ${WINDOW_SECONDS} THEN unixepoch() ELSE window_start END,
    locked_until = CASE
        WHEN (CASE WHEN window_start < unixepoch() - ${WINDOW_SECONDS} THEN 1 ELSE fails + 1 END) >= ${LOCKOUT_THRESHOLD}
        THEN unixepoch() + ${LOCKOUT_SECONDS}
        ELSE locked_until END
RETURNING locked_until`;

/** Layer one. Absent or failing binding means "allow". */
async function perLocation(limiter: RateLimit | undefined, key: string): Promise<boolean> {
    if (!limiter) return true;
    try {
        const { success } = await limiter.limit({ key });
        return success;
    } catch {
        return true;
    }
}

export interface Gate {
    ok: boolean;
    /** Seconds until the caller may try again. Only meaningful when `ok` is false. */
    retryAfter: number;
}

const ALLOWED: Gate = { ok: true, retryAfter: 0 };

/**
 * Is this account locked out right now?
 *
 * Deliberately also consulted for usernames that do not exist. An endpoint that never locks out
 * an unknown name tells an attacker which names are unknown.
 */
export async function lockedUntil(env: Env, usernameKey: string): Promise<number> {
    const row = await env.DB.prepare(
        "SELECT locked_until FROM login_attempts WHERE username_key = ?1 AND locked_until > unixepoch() LIMIT 1",
    )
        .bind(usernameKey)
        .first<{ locked_until: number }>();
    return row?.locked_until ?? 0;
}

export async function recordFailure(env: Env, usernameKey: string): Promise<void> {
    await env.DB.prepare(RECORD_FAILURE_SQL).bind(usernameKey).first<{ locked_until: number }>();
}

export async function clearFailures(env: Env, usernameKey: string): Promise<void> {
    await env.DB.prepare("DELETE FROM login_attempts WHERE username_key = ?1").bind(usernameKey).run();
}

export async function loginGate(env: Env, usernameKey: string, ip: string): Promise<Gate> {
    const [byUser, byIp] = await Promise.all([
        perLocation(env.RL_LOGIN_USER, `login:${usernameKey}`),
        // A wide net only. Cloudflare's own guidance warns against keying on IP alone, since a
        // school or an office shares one; the username bucket does the real work.
        perLocation(env.RL_LOGIN_IP, `login:ip:${ip}`),
    ]);
    if (!byUser || !byIp) return { ok: false, retryAfter: 60 };

    const until = await lockedUntil(env, usernameKey);
    if (until > 0) return { ok: false, retryAfter: Math.max(1, until - nowSeconds()) };

    return ALLOWED;
}

/**
 * Registration throttling.
 *
 * No email means registration is free and unlimited by design, which makes it the cheapest way to
 * exhaust D1's daily write quota and take saving offline for everyone. This is the only thing
 * standing in the way, so it is deliberately strict.
 */
export async function registerGate(env: Env, ip: string): Promise<Gate> {
    const allowed = await perLocation(env.RL_REGISTER_IP, `register:ip:${ip}`);
    return allowed ? ALLOWED : { ok: false, retryAfter: 60 };
}

export async function syncGate(env: Env, userId: number): Promise<Gate> {
    const allowed = await perLocation(env.RL_SYNC_USER, `sync:${userId}`);
    return allowed ? ALLOWED : { ok: false, retryAfter: 10 };
}
