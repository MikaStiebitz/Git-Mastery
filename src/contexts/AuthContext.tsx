"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import * as api from "~/lib/accountApi";
import { ProgressManager } from "~/models/ProgressManager";
import { toStageId } from "~/lib/stageIds";
import { useGameContext } from "~/contexts/GameContext";

/**
 * The optional account layer.
 *
 * Two rules shape everything here, and both are about staying out of the way:
 *
 * 1. Gameplay never awaits the network. Progress is written to localStorage synchronously, as it
 *    always was, and this provider uploads it afterwards on its own schedule. A dead Worker, a
 *    flight-mode session or no account at all are all indistinguishable from the player's side.
 * 2. Nothing is ever destroyed silently. The one operation that can overwrite local progress —
 *    signing in on a device that has its own save — takes a copy first and asks before acting.
 */

const TOKEN_KEY = "git-game-token";
const USERNAME_KEY = "git-game-username";

/** Debounce after a progress change. Long enough to coalesce a burst, short enough to feel live. */
const FLUSH_DEBOUNCE_MS = 1_500;
const BACKOFF_MS = [2_000, 8_000, 30_000, 120_000, 600_000] as const;

export type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "paused";

export interface RejectedPurchase {
    itemId: string;
}

export interface AuthContextValue {
    /** Whether this build has an account API at all. */
    enabled: boolean;
    username: string | null;
    signedIn: boolean;
    status: SyncStatus;
    /** Purchases the server could not confirm, shown once and dismissible. */
    rejectedPurchases: RejectedPurchase[];
    dismissRejections: () => void;
    /** Number of facts waiting to upload. */
    pendingCount: number;

    register: (username: string, password: string) => Promise<api.ApiResult<api.AuthSuccess>>;
    signIn: (username: string, password: string) => Promise<api.ApiResult<api.AuthSuccess>>;
    signOut: () => Promise<void>;
    syncNow: () => Promise<void>;

    changePassword: (currentPassword: string, newPassword: string) => Promise<api.ApiResult<Record<string, never>>>;
    changeUsername: (newUsername: string) => Promise<api.ApiResult<{ username: string }>>;
    resetCloudProgress: () => Promise<api.ApiResult<{ state: api.ServerState }>>;
    deleteAccount: (password: string) => Promise<api.ApiResult<Record<string, never>>>;

    /** Set when signing in found progress on both sides and the player has to choose. */
    pendingMerge: PendingMerge | null;
    resolveMerge: (choice: "merge" | "keepCloud" | "cancel") => Promise<void>;
}

export interface PendingMerge {
    username: string;
    token: string;
    expiresAt: string;
    serverState: api.ServerState;
    /** What merging would add, for the preview. */
    localLevels: number;
    localMinigames: number;
    localPurchases: number;
    localCoins: number;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
    return context;
}

function readStored(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStored(key: string, value: string | null): void {
    if (typeof window === "undefined") return;
    try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
    } catch {
        // A browser refusing storage means the session lasts until the tab closes, which is a
        // reasonable outcome and not worth interrupting anyone over.
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const { progressManager } = useGameContext();

    const [username, setUsername] = useState<string | null>(null);
    const [status, setStatus] = useState<SyncStatus>("idle");
    const [pendingCount, setPendingCount] = useState(0);
    const [rejectedPurchases, setRejectedPurchases] = useState<RejectedPurchase[]>([]);
    const [pendingMerge, setPendingMerge] = useState<PendingMerge | null>(null);

    const tokenRef = useRef<string | null>(null);
    const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inFlight = useRef(false);
    const failureCount = useRef(0);

    const enabled = api.accountsEnabled();

    // Restore the session after mount rather than during render: this is a static export, so the
    // server-rendered HTML has no idea whether anyone is signed in, and reading localStorage while
    // rendering would produce markup that does not match what hydration expects.
    useEffect(() => {
        if (!enabled) return;
        tokenRef.current = readStored(TOKEN_KEY);
        setUsername(readStored(USERNAME_KEY));
        setPendingCount(progressManager.getOutbox().length);
    }, [enabled, progressManager]);

    const adopt = useCallback(
        (state: api.ServerState) => {
            progressManager.applyServerState(state);
            // The navbar purse and anything else reading progress outside React state listens for
            // this, so the coin total updates the moment the server's answer lands.
            window.dispatchEvent(new Event(ProgressManager.CHANGE_EVENT));
        },
        [progressManager],
    );

    /**
     * Upload whatever is queued and adopt the server's answer.
     *
     * Guarded against overlapping runs: two concurrent flushes would submit the same events twice,
     * and while the server would reject the duplicates harmlessly, it is wasted quota on a free
     * plan with a daily write budget.
     */
    const flush = useCallback(
        async (options: { imported?: boolean; force?: boolean } = {}) => {
            const token = tokenRef.current;
            if (!enabled || !token || inFlight.current) return;

            const queue = progressManager.getOutbox();
            const progress = progressManager.getProgress();

            if (queue.length === 0 && !options.force) {
                setStatus("synced");
                return;
            }

            inFlight.current = true;
            setStatus("syncing");

            try {
                // One request per batch the server will accept, oldest first, so a long offline
                // session drains in order rather than being truncated.
                const batches: (typeof queue)[] = [];
                for (let i = 0; i < Math.max(queue.length, 1); i += api.MAX_EVENTS_PER_SYNC) {
                    batches.push(queue.slice(i, i + api.MAX_EVENTS_PER_SYNC));
                }

                for (const batch of batches) {
                    const result = await api.sync(token, {
                        events: batch,
                        cursor: {
                            stage: toStageId(progress.currentStage),
                            level: progress.currentLevel,
                            at: new Date().toISOString(),
                        },
                        bests: progress.minigameScores,
                        imported: options.imported,
                    });

                    if (!result.ok) {
                        if (result.status === 401) {
                            // The session ended — a password change elsewhere, or an expiry. Keep
                            // the queue: those events still describe real progress, and they will
                            // upload intact after the next sign-in.
                            tokenRef.current = null;
                            writeStored(TOKEN_KEY, null);
                            setUsername(null);
                            setStatus("idle");
                            return;
                        }
                        failureCount.current += 1;
                        setStatus(result.code === "storage_quota_exhausted" ? "paused" : "offline");
                        return;
                    }

                    // Accepted and already-applied both mean the fact is safely recorded, so both
                    // leave the queue. Anything else stays and is retried.
                    const settled = [
                        ...result.accepted,
                        ...result.rejected.filter(r => r.reason === "already_applied").map(r => r.key),
                        ...result.rejected.filter(r => r.reason === "egg_already_awarded").map(r => r.key),
                    ];
                    const unaffordable = result.rejected.filter(r => r.reason === "unaffordable");
                    // An unaffordable purchase will not become affordable by retrying, so it also
                    // leaves the queue — the player is told, and their coins stay with the server.
                    progressManager.pruneOutbox([...settled, ...unaffordable.map(r => r.key)]);

                    if (unaffordable.length > 0) {
                        setRejectedPurchases(current => [
                            ...current,
                            ...unaffordable.map(r => ({ itemId: r.key.replace(/^purchase:/, "") })),
                        ]);
                    }

                    adopt(result.state);
                }

                failureCount.current = 0;
                setStatus("synced");
            } finally {
                inFlight.current = false;
                setPendingCount(progressManager.getOutbox().length);
            }
        },
        [adopt, enabled, progressManager],
    );

    /** Schedule a flush, coalescing the burst of writes a single level completion produces. */
    const scheduleFlush = useCallback(() => {
        if (!enabled || !tokenRef.current) return;
        if (flushTimer.current) clearTimeout(flushTimer.current);

        const delay =
            failureCount.current === 0
                ? FLUSH_DEBOUNCE_MS
                : (BACKOFF_MS[Math.min(failureCount.current - 1, BACKOFF_MS.length - 1)] ?? FLUSH_DEBOUNCE_MS);

        flushTimer.current = setTimeout(() => void flush(), delay);
    }, [enabled, flush]);

    useEffect(() => {
        if (!enabled) return;

        const onProgressChange = () => {
            setPendingCount(progressManager.getOutbox().length);
            scheduleFlush();
        };
        const onOnline = () => {
            failureCount.current = 0;
            void flush();
        };
        const onHidden = () => {
            // Leaving the page is the last chance to save this session's progress, so it does not
            // wait for the debounce.
            if (document.visibilityState === "hidden") void flush();
        };

        window.addEventListener(ProgressManager.CHANGE_EVENT, onProgressChange);
        window.addEventListener("online", onOnline);
        document.addEventListener("visibilitychange", onHidden);

        return () => {
            window.removeEventListener(ProgressManager.CHANGE_EVENT, onProgressChange);
            window.removeEventListener("online", onOnline);
            document.removeEventListener("visibilitychange", onHidden);
            if (flushTimer.current) clearTimeout(flushTimer.current);
        };
    }, [enabled, flush, progressManager, scheduleFlush]);

    /**
     * Take a session, deciding whether the local save can be adopted silently.
     *
     * Three cases. A device that has never been played on adopts the cloud save without a word. A
     * device whose progress the cloud already contains does the same, since there is nothing to
     * lose. Anything else is a genuine conflict and the player decides.
     */
    const accept = useCallback(
        (auth: api.AuthSuccess) => {
            const local = progressManager.getProgress();
            const server = auth.state;

            const localLevels = Object.values(local.completedLevels).flat().length;
            const serverLevelSet = new Set(
                Object.entries(server.completedLevels).flatMap(([stage, levels]) =>
                    levels.map(level => `${toStageId(stage)}:${level}`),
                ),
            );
            const localOnly = Object.entries(local.completedLevels).flatMap(([stage, levels]) =>
                levels.filter(level => !serverLevelSet.has(`${toStageId(stage)}:${level}`)),
            );
            const localOnlyItems = local.purchasedItems.filter(id => !server.purchasedItems.includes(id));
            const localOnlyGames = local.completedMinigames.filter(id => !server.completedMinigames.includes(id));

            const nothingToLose =
                progressManager.isUntouched() ||
                (localOnly.length === 0 && localOnlyItems.length === 0 && localOnlyGames.length === 0);

            if (nothingToLose) {
                tokenRef.current = auth.token;
                writeStored(TOKEN_KEY, auth.token);
                writeStored(USERNAME_KEY, auth.username);
                setUsername(auth.username);
                adopt(auth.state);
                setStatus("synced");
                void flush({ force: true });
                return;
            }

            setPendingMerge({
                username: auth.username,
                token: auth.token,
                expiresAt: auth.expiresAt,
                serverState: auth.state,
                localLevels,
                localMinigames: localOnlyGames.length,
                localPurchases: localOnlyItems.length,
                localCoins: local.coins,
            });
        },
        [adopt, flush, progressManager],
    );

    const resolveMerge = useCallback(
        async (choice: "merge" | "keepCloud" | "cancel") => {
            const merge = pendingMerge;
            if (!merge) return;
            setPendingMerge(null);

            if (choice === "cancel") return;

            tokenRef.current = merge.token;
            writeStored(TOKEN_KEY, merge.token);
            writeStored(USERNAME_KEY, merge.username);
            setUsername(merge.username);

            // Either path overwrites local progress, so a copy is kept first. This is the only
            // thing standing between a mis-click and a week of play.
            progressManager.backupLocal();

            if (choice === "keepCloud") {
                progressManager.clearOutbox();
                adopt(merge.serverState);
                setStatus("synced");
                return;
            }

            // Merging: every local fact becomes an event. The server prices them at 1x regardless
            // of any double-reward window, so an import cannot mint a doubled economy.
            const snapshot = progressManager.snapshotForMerge();
            progressManager.clearOutbox();
            progressManager.enqueueAll(snapshot);
            adopt(merge.serverState);
            await flush({ imported: true, force: true });
        },
        [adopt, flush, pendingMerge, progressManager],
    );

    const register = useCallback(
        async (name: string, password: string) => {
            const result = await api.register(name, password);
            if (result.ok) accept(result);
            return result;
        },
        [accept],
    );

    const signIn = useCallback(
        async (name: string, password: string) => {
            const result = await api.login(name, password);
            if (result.ok) accept(result);
            return result;
        },
        [accept],
    );

    const signOut = useCallback(async () => {
        const token = tokenRef.current;
        tokenRef.current = null;
        writeStored(TOKEN_KEY, null);
        writeStored(USERNAME_KEY, null);
        setUsername(null);
        setStatus("idle");
        // Local progress deliberately stays exactly as it is. Signing out is not a reset, and a
        // player who signs out mid-session should still have their game.
        if (token) await api.logout(token);
    }, []);

    const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
        const token = tokenRef.current;
        if (!token) return { ok: false as const, code: "unauthorized", status: 401, retryable: false };

        const result = await api.changePassword(token, currentPassword, newPassword);
        if (result.ok) {
            // The server revoked every session, including this one, so the client signs itself
            // straight back in with the new password rather than dropping the player out.
            const name = readStored(USERNAME_KEY);
            if (name) {
                const again = await api.login(name, newPassword);
                if (again.ok) {
                    tokenRef.current = again.token;
                    writeStored(TOKEN_KEY, again.token);
                }
            }
        }
        return result;
    }, []);

    const changeUsername = useCallback(async (newUsername: string) => {
        const token = tokenRef.current;
        if (!token) return { ok: false as const, code: "unauthorized", status: 401, retryable: false };

        const result = await api.changeUsername(token, newUsername);
        if (result.ok) {
            writeStored(USERNAME_KEY, result.username);
            setUsername(result.username);
        }
        return result;
    }, []);

    const resetCloudProgress = useCallback(async () => {
        const token = tokenRef.current;
        if (!token) return { ok: false as const, code: "unauthorized", status: 401, retryable: false };

        const result = await api.resetCloudProgress(token);
        if (result.ok) {
            progressManager.clearOutbox();
            adopt(result.state);
        }
        return result;
    }, [adopt, progressManager]);

    const deleteAccount = useCallback(async (password: string) => {
        const token = tokenRef.current;
        if (!token) return { ok: false as const, code: "unauthorized", status: 401, retryable: false };

        const result = await api.deleteAccount(token, password);
        if (result.ok) {
            tokenRef.current = null;
            writeStored(TOKEN_KEY, null);
            writeStored(USERNAME_KEY, null);
            setUsername(null);
            setStatus("idle");
            // The local save is untouched. Deleting the account removes it from the server;
            // it does not take the game away from the person who was playing it.
        }
        return result;
    }, []);

    const value: AuthContextValue = {
        enabled,
        username,
        signedIn: username !== null,
        status,
        rejectedPurchases,
        dismissRejections: () => setRejectedPurchases([]),
        pendingCount,
        register,
        signIn,
        signOut,
        syncNow: () => flush({ force: true }),
        changePassword,
        changeUsername,
        resetCloudProgress,
        deleteAccount,
        pendingMerge,
        resolveMerge,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
