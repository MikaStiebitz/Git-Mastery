import type { UserProgress } from "../types";

export class ProgressManager {
    private progress: UserProgress;
    private readonly STORAGE_KEY = "git-game-progress";

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
                lastSavedAt: new Date().toISOString(),
                purchasedItems: [],
                completedMinigames: [],
                minigameScores: {},
            };
            this.saveProgress();
        }

        // Migration for existing users who don't have the new properties
        if (!this.progress.purchasedItems) {
            this.progress.purchasedItems = [];
        }
        if (!this.progress.completedMinigames) {
            this.progress.completedMinigames = [];
        }
        if (!this.progress.minigameScores) {
            this.progress.minigameScores = {};
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
            this.progress.score += score;
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

    // Reset all progress
    public resetProgress(): void {
        this.progress = {
            completedLevels: {},
            currentStage: "Intro",
            currentLevel: 1,
            score: 0,
            lastSavedAt: new Date().toISOString(),
            purchasedItems: [],
            completedMinigames: [],
            minigameScores: {},
        };
        this.saveProgress();
    }

    // Shop functionality
    public spendPoints(amount: number): boolean {
        if (this.progress.score >= amount) {
            this.progress.score -= amount;
            this.progress.lastSavedAt = new Date().toISOString();
            this.saveProgress();
            return true;
        }
        return false;
    }

    public purchaseItem(itemId: string): boolean {
        if (!this.progress.purchasedItems.includes(itemId)) {
            this.progress.purchasedItems.push(itemId);
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

    // Minigame functionality
    public completeMinigame(gameId: string, score: number): void {
        if (!this.progress.completedMinigames.includes(gameId)) {
            this.progress.completedMinigames.push(gameId);
            this.progress.score += score;
        }

        // Update high score if better
        const currentHighScore = this.progress.minigameScores[gameId] || 0;
        if (score > currentHighScore) {
            this.progress.minigameScores[gameId] = score;
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

    // Save progress to localStorage
    private saveProgress(): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progress));
        }
    }

    // Load progress from localStorage
    private loadProgress(): UserProgress | null {
        if (typeof window !== "undefined") {
            const savedData = localStorage.getItem(this.STORAGE_KEY);
            if (savedData) {
                try {
                    return JSON.parse(savedData) as UserProgress;
                } catch (e) {
                    console.error("Failed to parse saved progress", e);
                }
            }
        }
        return null;
    }
}
