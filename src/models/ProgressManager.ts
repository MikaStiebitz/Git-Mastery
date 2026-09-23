import type { UserProgress } from "../types";
import { foldCompletedLevels, toStageId, toStageKey } from "../lib/stageIds";

/**
 * One thing the player did, queued for an account that may or may not exist yet.
 *
 * Note what an outbox entry does NOT carry: a coin amount, a score, or a price. It states a fact
 * — "intro/3 was cleared", "the golden terminal was bought" — and the server decides what that was
 * worth from its own catalog. Editing a coin total in localStorage therefore has nowhere to go:
 * there is no field on the wire that could carry it.
 */
export type OutboxEvent =
    | { kind: "level"; stage: string; level: number; at: string }
    | { kind: "minigame"; gameId: string; at: string }
    | { kind: "purchase"; itemId: string; at: string }
    | { kind: "egg"; at: string };

/** Identity of an event, used to keep the queue free of duplicates before it is ever sent. */
function outboxKey(event: OutboxEvent): string {
    switch (event.kind) {
        case "level":
            return `level:${event.stage}:${event.level}`;
        case "minigame":
            return `minigame:${event.gameId}`;
        case "purchase":
            return `purchase:${event.itemId}`;
        case "egg":
            return "egg:gitgud";
    }
}

export class ProgressManager {
    private progress: UserProgress;
    private readonly STORAGE_KEY = "git-game-progress";
    private readonly OUTBOX_KEY = "git-game-outbox";

    constructor() {
        const savedProgress = this.loadProgress();

        if (savedProgress) {
            this.progress = savedProgress;
        } else {
            this.progress = {
                completedLevels: {},
                currentStage: "Intro",
                currentLevel: 1,
                score: 0,
                coins: 0,
                lastSavedAt: new Date().toISOString(),
                purchasedItems: [],
                completedMinigames: [],
                minigameScores: {},
                doubleXpUntil: null,
            };
            this.saveProgress();
        }

        // Migration for existing users who don't have the new properties
        if (!this.progress) {
            console.error("Progress not initialized properly");
            return;
        }

        if (!this.progress.purchasedItems) {
            this.progress.purchasedItems = [];
        }
        if (!this.progress.completedMinigames) {
            this.progress.completedMinigames = [];
        }
        if (!this.progress.minigameScores) {
            this.progress.minigameScores = {};
        }
        if (this.progress.doubleXpUntil === undefined || this.progress.doubleXpUntil === null) {
            this.progress.doubleXpUntil = null;
        }
        if (this.progress.gitGudActivated === undefined) {
            this.progress.gitGudActivated = false;
        }
        if (!this.progress.coins) {
            // Migration: existing users get coins equal to their score
            this.progress.coins = this.progress.score || 0;
        }
    }

    // Get current progress
    public getProgress(): UserProgress {
        return { ...this.progress };
    }

    // Mark a level as completed
    public completeLevel(stage: string, level: number, score = 10): void {
        if (!this.progress.completedLevels[stage]) {
            this.progress.completedLevels[stage] = [];
        }

        if (!this.progress.completedLevels[stage].includes(level)) {
            this.progress.completedLevels[stage].push(level);

            // Apply double XP if active
            const finalScore = this.isDoubleXpActive() ? score * 2 : score;

            // Add to score (progress points - never decreases)
            this.progress.score += finalScore;

            // Add to coins (shop currency - can be spent)
            this.progress.coins += finalScore;

            this.enqueue({ kind: "level", stage: toStageId(stage), level, at: new Date().toISOString() });
        }

        this.progress.lastSavedAt = new Date().toISOString();
        this.saveProgress();
    }

    // Set current stage and level
    public setCurrentLevel(stage: string, level: number): void {
        this.progress.currentStage = stage;
        this.progress.currentLevel = level;
        this.progress.lastSavedAt = new Date().toISOString();
        this.saveProgress();
    }

    // Check if a level is completed
    public isLevelCompleted(stage: string, level: number): boolean {
        return !!this.progress.completedLevels[stage]?.includes(level);
    }

    /**
     * Wipe local progress.
     *
     * This clears the outbox too. Anything still queued describes progress that no longer exists
     * locally, and uploading it after a reset would resurrect exactly what the player asked to be
     * rid of. It does not touch the cloud save — that is a separate, explicit choice in the
     * account panel, because two different reset buttons already exist in the UI and neither
     * should quietly reach across to another device.
     */
    public resetProgress(): void {
        this.progress = {
            completedLevels: {},
            currentStage: "Intro",
            currentLevel: 1,
            score: 0,
            coins: 0,
            lastSavedAt: new Date().toISOString(),
            purchasedItems: [],
            completedMinigames: [],
            minigameScores: {},
            // Previously omitted, which left the easter egg flag set through a reset: the bonus
            // stayed spent while the discovery it paid for was gone.
            doubleXpUntil: null,
            gitGudActivated: false,
        };
        this.clearOutbox();
        this.saveProgress();
    }

    // Shop functionality
    public spendPoints(amount: number): boolean {
        if (this.progress.coins >= amount) {
            this.progress.coins -= amount;
            this.progress.lastSavedAt = new Date().toISOString();
            this.saveProgress();
            return true;
        }
        return false;
    }

    public addCoins(amount: number): void {
        // Apply double XP to coin rewards if active
        const finalAmount = this.isDoubleXpActive() ? amount * 2 : amount;
        this.progress.coins += finalAmount;
        this.progress.lastSavedAt = new Date().toISOString();
        this.saveProgress();
    }

    public getCoins(): number {
        return this.progress.coins;
    }

    public purchaseItem(itemId: string): boolean {
        if (!this.progress.purchasedItems.includes(itemId)) {
            this.progress.purchasedItems.push(itemId);
            this.enqueue({ kind: "purchase", itemId, at: new Date().toISOString() });
            this.progress.lastSavedAt = new Date().toISOString();
            this.saveProgress();
            return true;
        }
        return false;
    }

    public isPurchased(itemId: string): boolean {
        return this.progress.purchasedItems.includes(itemId);
    }

    public getPurchasedItems(): string[] {
        return [...this.progress.purchasedItems];
    }

    /**
     * Record a finished minigame. Pays coins once; the high score is cosmetic and updates always.
     *
     * The two numbers used to be one, and that was a real coin leak: callers passed the gameplay
     * score — `score * 2 + timeLeft` in Branch Master — as the coin reward, so a game the arcade
     * advertises as "+10" could pay a hundred or more, and paid differently every run. `coinReward`
     * is now the arcade's advertised figure from the minigame registry, and `gameplayScore` is the
     * number shown on the results screen.
     */
    public completeMinigame(gameId: string, coinReward: number, gameplayScore = coinReward): void {
        if (!this.progress.completedMinigames.includes(gameId)) {
            this.progress.completedMinigames.push(gameId);

            // Minigames only give coins (with double XP if active)
            this.addCoins(coinReward);
            this.enqueue({ kind: "minigame", gameId, at: new Date().toISOString() });
        }

        // Update high score if better
        const currentHighScore = this.progress.minigameScores[gameId] ?? 0;
        if (gameplayScore > currentHighScore) {
            this.progress.minigameScores[gameId] = gameplayScore;
        }

        this.progress.lastSavedAt = new Date().toISOString();
        this.saveProgress();
    }

    public isMinigameCompleted(gameId: string): boolean {
        return this.progress.completedMinigames.includes(gameId);
    }

    public getMinigameScore(gameId: string): number {
        return this.progress.minigameScores[gameId] || 0;
    }

    public getCompletedMinigames(): string[] {
        return [...this.progress.completedMinigames];
    }

    /**
     * Fired after every write so UI that isn't re-rendered by React state — the navbar's
     * score and coin readout, for instance — can pick up a purchase or a cleared level.
     * The browser's own `storage` event only fires in *other* tabs, so this is the same
     * signal for the tab that made the change.
     */
    public static readonly CHANGE_EVENT = "gitmastery:progress";

    // Save progress to localStorage
    private saveProgress(): void {
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progress));
                window.dispatchEvent(new Event(ProgressManager.CHANGE_EVENT));
            } catch (error) {
                // Handle localStorage quota exceeded or other errors
                if (error instanceof Error) {
                    if (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                        console.warn("localStorage quota exceeded. Game progress may not persist.", error);
                    } else if (error.name === "SecurityError") {
                        console.warn(
                            "localStorage access denied (possibly private browsing). Game progress will not persist.",
                            error,
                        );
                    } else {
                        console.error("Failed to save progress:", error);
                    }
                }
            }
        }
    }

    // Load progress from localStorage
    private loadProgress(): UserProgress | null {
        if (typeof window !== "undefined") {
            try {
                const savedData = localStorage.getItem(this.STORAGE_KEY);
                if (savedData) {
                    return JSON.parse(savedData) as UserProgress;
                }
            } catch (error) {
                // Handle both parse errors and access errors
                if (error instanceof Error) {
                    if (error.name === "SyntaxError") {
                        console.error("Failed to parse saved progress (corrupted data)", error);
                    } else if (error.name === "SecurityError") {
                        console.warn("localStorage access denied (possibly private browsing).");
                    } else {
                        console.error("Failed to load progress:", error);
                    }
                }
            }
        }
        return null;
    }

    // Check if double XP is currently active
    public isDoubleXpActive(): boolean {
        if (!this.progress.doubleXpUntil) return false;

        const expiryDate = new Date(this.progress.doubleXpUntil);
        const now = new Date();

        return now < expiryDate;
    }

    // Activate double XP for 7 days
    public activateDoubleXp(): void {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

        this.progress.doubleXpUntil = expiryDate.toISOString();
        this.saveProgress();
    }

    // Get remaining double XP time in hours
    public getDoubleXpRemainingHours(): number {
        if (!this.isDoubleXpActive()) return 0;

        const expiryDate = new Date(this.progress.doubleXpUntil!);
        const now = new Date();
        const diffMs = expiryDate.getTime() - now.getTime();

        return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60))); // Convert to hours
    }

    // Git Gud Easter Egg functionality
    public hasActivatedGitGud(): boolean {
        return this.progress.gitGudActivated || false;
    }

    public activateGitGud(): boolean {
        if (this.progress.gitGudActivated) {
            return false; // Already activated
        }

        this.progress.gitGudActivated = true;

        // Secret bonus: score + coins!
        const bonus = this.isDoubleXpActive() ? 100 : 50;
        this.progress.score += bonus;
        this.progress.coins += bonus;

        this.enqueue({ kind: "egg", at: new Date().toISOString() });
        this.progress.lastSavedAt = new Date().toISOString();
        this.saveProgress();
        return true; // First time activation
    }

    // ===== Cloud sync =====
    //
    // Everything below exists only for players who chose to make an account. With no account the
    // outbox simply accumulates and is never read, which costs a few kilobytes and changes
    // nothing about how the game plays.

    /**
     * A safety valve, not a real limit.
     *
     * Only 69 distinct events exist in the whole game and the queue is deduplicated by key, so
     * this ceiling is unreachable in normal play. It is here so that a bug elsewhere cannot grow
     * localStorage without bound.
     */
    private readonly MAX_OUTBOX = 300;

    /**
     * Queue a fact for upload.
     *
     * Synchronous and local: it writes to localStorage in the same tick as the mutation that
     * caused it and returns. Nothing about finishing a level ever waits on the network, so a slow
     * or missing server cannot make the game feel slow or lose a completion.
     */
    private enqueue(event: OutboxEvent): void {
        if (typeof window === "undefined") return;

        try {
            const queue = this.getOutbox();
            const key = outboxKey(event);
            if (queue.some(existing => outboxKey(existing) === key)) return;
            if (queue.length >= this.MAX_OUTBOX) return;

            queue.push(event);
            localStorage.setItem(this.OUTBOX_KEY, JSON.stringify(queue));
        } catch {
            // A full or unavailable localStorage must not break gameplay. The progress blob
            // itself is what matters, and it is written separately.
        }
    }

    /**
     * Queue facts that already happened, for the one-time import when a player with local progress
     * first signs in. Deduplicated the same way as live events, so importing twice is harmless.
     */
    public enqueueAll(events: OutboxEvent[]): void {
        for (const event of events) this.enqueue(event);
    }

    /** Everything waiting to be uploaded, oldest first. */
    public getOutbox(): OutboxEvent[] {
        if (typeof window === "undefined") return [];
        try {
            const raw = localStorage.getItem(this.OUTBOX_KEY);
            if (!raw) return [];
            const parsed: unknown = JSON.parse(raw);
            return Array.isArray(parsed) ? (parsed as OutboxEvent[]) : [];
        } catch {
            return [];
        }
    }

    /**
     * Drop events the server has finished with.
     *
     * Called with the keys the server accepted *and* the ones it recognised as already applied —
     * both mean "this fact is safely recorded", so both leave the queue. Anything else stays and
     * is retried, which is what makes a dead server or a flight-mode session lossless.
     */
    public pruneOutbox(settledKeys: string[]): void {
        if (typeof window === "undefined") return;
        const settled = new Set(settledKeys);
        try {
            const remaining = this.getOutbox().filter(event => !settled.has(outboxKey(event)));
            localStorage.setItem(this.OUTBOX_KEY, JSON.stringify(remaining));
        } catch {
            // Leaving the queue as it is only means those events are retried.
        }
    }

    public clearOutbox(): void {
        if (typeof window === "undefined") return;
        try {
            localStorage.removeItem(this.OUTBOX_KEY);
        } catch {
            // Nothing to do; an unreadable outbox is already effectively cleared.
        }
    }

    /**
     * Every fact this device knows about, as events.
     *
     * Used once, when a player with existing local progress signs in for the first time. Level
     * keys are folded to one spelling per stage first, because saved progress in the wild can hold
     * both "Intro" and "intro" and the server would treat those as different stages.
     */
    public snapshotForMerge(): OutboxEvent[] {
        const at = this.progress.lastSavedAt || new Date().toISOString();
        const events: OutboxEvent[] = [];

        for (const [stage, levels] of Object.entries(foldCompletedLevels(this.progress.completedLevels))) {
            for (const level of levels) {
                events.push({ kind: "level", stage: toStageId(stage), level, at });
            }
        }
        for (const gameId of this.progress.completedMinigames) {
            events.push({ kind: "minigame", gameId, at });
        }
        for (const itemId of this.progress.purchasedItems) {
            events.push({ kind: "purchase", itemId, at });
        }
        if (this.progress.gitGudActivated) {
            events.push({ kind: "egg", at });
        }

        return events;
    }

    /**
     * Adopt the server's version of the truth.
     *
     * `score` and `coins` are taken wholesale, never merged, because on the server they are sums
     * over a ledger the client cannot write to. This is the moment a cheated local balance
     * disappears — not because it was detected, but because it was never represented.
     *
     * Everything the server does not own is left alone: language, difficulty, advanced mode and
     * the rest are device preferences, not progress.
     */
    public applyServerState(state: {
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
    }): void {
        this.progress.completedLevels = foldCompletedLevels(state.completedLevels);
        this.progress.currentStage = toStageKey(state.currentStage);
        this.progress.currentLevel = state.currentLevel;
        this.progress.score = state.score;
        this.progress.coins = state.coins;
        this.progress.purchasedItems = [...state.purchasedItems];
        this.progress.completedMinigames = [...state.completedMinigames];
        this.progress.minigameScores = { ...state.minigameScores };
        this.progress.doubleXpUntil = state.doubleXpUntil;
        this.progress.gitGudActivated = state.gitGudActivated;
        this.progress.lastSavedAt = new Date().toISOString();
        this.saveProgress();
    }

    /**
     * Keep a copy of local progress before the cloud overwrites it.
     *
     * Nothing in the account flow destroys a save without leaving one of these behind, so a player
     * who picks the wrong option in the merge dialog has not lost a week of play — it is one
     * localStorage key away.
     */
    public backupLocal(): string {
        const key = `${this.STORAGE_KEY}.backup.${new Date().toISOString()}`;
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem(key, JSON.stringify(this.progress));
            } catch {
                // A backup that cannot be written must not block the sign-in it precedes.
            }
        }
        return key;
    }

    /** True when nothing has been played yet, so signing in can adopt the cloud save silently. */
    public isUntouched(): boolean {
        return (
            this.progress.score === 0 &&
            this.progress.coins === 0 &&
            Object.values(this.progress.completedLevels).every(levels => levels.length === 0) &&
            this.progress.purchasedItems.length === 0 &&
            this.progress.completedMinigames.length === 0 &&
            !this.progress.gitGudActivated
        );
    }
}
