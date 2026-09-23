import { env } from "~/env";
import type { OutboxEvent } from "~/models/ProgressManager";

/**
 * The client for the optional account API.
 *
 * Every function here can fail, and none of them failing is allowed to matter: the account is a
 * convenience layered on top of a game that already works entirely in localStorage. So there are
 * no thrown exceptions to catch at call sites — each call returns a result object, and a
 * network failure is an ordinary outcome rather than an error.
 */

export interface ServerState {
    completedLevels: Record<string, number[]>;
    currentStage: string;
    currentLevel: number;
    score: number;
    coins: number;
    purchasedItems: string[];
    completedMinigames: string[];
    minigameScores: Record<string, number>;
    doubleXpUntil: string | null;
    gitGudActivated: boolean;
    serverTime: string;
}

export interface AuthSuccess {
    token: string;
    expiresAt: string;
    username: string;
    state: ServerState;
}

export interface SyncSuccess {
    state: ServerState;
    accepted: string[];
    rejected: { key: string; reason: string }[];
}

/**
 * A failed call, described in terms a caller can act on.
 *
 * `code` is the server's machine-readable reason (`username_taken`, `invalid_credentials`) or one
 * of the transport codes below. `retryable` is the important one: it decides whether the outbox
 * keeps its events or drops them.
 */
export interface ApiFailure {
    ok: false;
    code: string;
    status: number;
    retryable: boolean;
    /** Extra detail some endpoints attach, e.g. which username rule was broken. */
    reason?: string;
}

export type ApiResult<T> = ({ ok: true } & T) | ApiFailure;

/** Configured at build time. Absent means the account feature is simply not part of this build. */
export const ACCOUNT_API_URL = env.NEXT_PUBLIC_ACCOUNT_API_URL?.replace(/\/+$/, "") ?? "";

export function accountsEnabled(): boolean {
    return ACCOUNT_API_URL.length > 0;
}

const TIMEOUT_MS = 12_000;

interface RequestOptions {
    method?: "GET" | "POST" | "DELETE";
    body?: unknown;
    token?: string;
}

async function call<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
    if (!accountsEnabled()) {
        return { ok: false, code: "accounts_disabled", status: 0, retryable: false };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(`${ACCOUNT_API_URL}${path}`, {
            method: options.method ?? "GET",
            headers: {
                ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
                ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
            },
            body: options.body === undefined ? undefined : JSON.stringify(options.body),
            signal: controller.signal,
        });

        if (response.status === 204) return { ok: true } as ApiResult<T>;

        const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;

        if (!response.ok) {
            return {
                ok: false,
                code: typeof payload.error === "string" ? payload.error : "http_error",
                status: response.status,
                // A 5xx or a rate limit will succeed later; a 400 or a 409 will not, and retrying
                // one forever would wedge the queue behind an event that can never be accepted.
                retryable: response.status >= 500 || response.status === 429,
                reason: typeof payload.reason === "string" ? payload.reason : undefined,
            };
        }

        return { ok: true, ...(payload as object) } as ApiResult<T>;
    } catch {
        // Offline, DNS failure, CORS rejection, or the 12s timeout. All of them mean "try again
        // later", which is exactly what keeping the outbox achieves.
        return { ok: false, code: "network_error", status: 0, retryable: true };
    } finally {
        clearTimeout(timeout);
    }
}

export function register(username: string, password: string): Promise<ApiResult<AuthSuccess>> {
    return call<AuthSuccess>("/v1/auth/register", { method: "POST", body: { username, password } });
}

export function login(username: string, password: string): Promise<ApiResult<AuthSuccess>> {
    return call<AuthSuccess>("/v1/auth/login", { method: "POST", body: { username, password } });
}

export function logout(token: string): Promise<ApiResult<Record<string, never>>> {
    return call("/v1/auth/logout", { method: "POST", token });
}

export function checkUsername(username: string): Promise<ApiResult<{ available: boolean; reason?: string }>> {
    return call("/v1/auth/check-username", { method: "POST", body: { username } });
}

export function fetchState(token: string): Promise<ApiResult<{ username: string; state: ServerState }>> {
    return call("/v1/state", { token });
}

export interface SyncPayload {
    events: OutboxEvent[];
    cursor?: { stage: string; level: number; at: string };
    bests?: Record<string, number>;
    imported?: boolean;
}

export function sync(token: string, payload: SyncPayload): Promise<ApiResult<SyncSuccess>> {
    return call<SyncSuccess>("/v1/sync", { method: "POST", token, body: payload });
}

export function changePassword(token: string, newPassword: string): Promise<ApiResult<Record<string, never>>> {
    return call("/v1/account/password", { method: "POST", token, body: { newPassword } });
}

export function changeUsername(token: string, newUsername: string): Promise<ApiResult<{ username: string }>> {
    return call("/v1/account/username", { method: "POST", token, body: { newUsername } });
}

export function resetCloudProgress(token: string): Promise<ApiResult<{ state: ServerState }>> {
    return call("/v1/account/reset", { method: "POST", token });
}

export function deleteAccount(token: string, password: string): Promise<ApiResult<Record<string, never>>> {
    return call("/v1/account", { method: "DELETE", token, body: { password } });
}

/** The largest batch the server accepts. Longer queues are flushed in several requests. */
export const MAX_EVENTS_PER_SYNC = 64;
