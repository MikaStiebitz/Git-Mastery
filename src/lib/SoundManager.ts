"use client";

import { useCallback } from "react";

// Sound file paths - these would need to be added to public/sounds/
const SOUND_PATHS = {
    levelComplete: "/sounds/level-complete.mp3",
    success: "/sounds/success.mp3",
    achievement: "/sounds/achievement.mp3",
    error: "/sounds/error.mp3",
    click: "/sounds/click.mp3",
    notification: "/sounds/notification.mp3"
};

export class SoundManager {
    private isEnabled: boolean;
    private audioCache: Map<string, HTMLAudioElement>;

    constructor(isEnabled = false) {
        this.isEnabled = isEnabled;
        this.audioCache = new Map();
        this.preloadSounds();
    }

    private preloadSounds() {
        if (typeof window === "undefined") return;

        Object.entries(SOUND_PATHS).forEach(([key, path]) => {
            try {
                const audio = new Audio();
                audio.preload = "auto";
                audio.volume = 0.6; // Default volume

                // Handle sound loading errors gracefully
                audio.addEventListener('error', () => {
                    console.warn(`Sound file not found: ${key} at ${path}`);
                });

                audio.addEventListener('canplaythrough', () => {
                    console.log(`Sound loaded: ${key}`);
                });

                audio.src = path;
                this.audioCache.set(key, audio);
            } catch (error) {
                console.warn(`Failed to preload sound: ${key}`, error);
            }
        });
    }

    public setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }

    public play(soundKey: keyof typeof SOUND_PATHS) {
        if (!this.isEnabled || typeof window === "undefined") return;

        const audio = this.audioCache.get(soundKey);
        if (audio) {
            try {
                // Reset the audio to the beginning
                audio.currentTime = 0;
                const playPromise = audio.play();

                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // This is normal - browser might block autoplay
                        console.log(`Sound play blocked or failed: ${soundKey}`, error.name);
                    });
                }
            } catch (error) {
                console.warn(`Error playing sound: ${soundKey}`, error);
            }
        } else {
            console.warn(`Sound not found in cache: ${soundKey}`);
        }
    }

    public setVolume(volume: number) {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        this.audioCache.forEach(audio => {
            audio.volume = clampedVolume;
        });
    }
}

// Global sound manager instance
let globalSoundManager: SoundManager | null = null;

export function initializeSoundManager(isEnabled: boolean): SoundManager {
    if (!globalSoundManager) {
        globalSoundManager = new SoundManager(isEnabled);
    } else {
        globalSoundManager.setEnabled(isEnabled);
    }
    return globalSoundManager;
}

export function getSoundManager(): SoundManager | null {
    return globalSoundManager;
}

// React hook for using sound manager
export function useSoundManager(isEnabled: boolean) {
    const soundManager = initializeSoundManager(isEnabled);

    const playSound = useCallback((soundKey: keyof typeof SOUND_PATHS) => {
        soundManager.play(soundKey);
    }, [soundManager]);

    const setVolume = useCallback((volume: number) => {
        soundManager.setVolume(volume);
    }, [soundManager]);

    return {
        playSound,
        setVolume,
        setEnabled: soundManager.setEnabled.bind(soundManager)
    };
}
