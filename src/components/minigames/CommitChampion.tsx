"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { GitCommit, Timer, Trophy, X, CheckCircle, XCircle } from "lucide-react";

interface CommitChampionProps {
    onComplete: (score: number) => void;
    onClose: () => void;
    difficulty?: "beginner" | "advanced" | "pro";
}

interface CommitChallenge {
    scenario: string;
    changedFiles: string[];
    goodExamples: string[];
    badExamples: string[];
    difficulty: "beginner" | "advanced" | "pro";
}

const COMMIT_CHALLENGES: CommitChallenge[] = [
    // Beginner
    {
        scenario: "You fixed a typo in the README file",
        changedFiles: ["README.md"],
        goodExamples: ["Fix typo in README", "Fix README typo", "Correct spelling in README"],
        badExamples: ["fixed stuff", "update", "changes", "asdf"],
        difficulty: "beginner",
    },
    {
        scenario: "You added a new login button to the homepage",
        changedFiles: ["homepage.html", "styles.css"],
        goodExamples: ["Add login button to homepage", "Add homepage login button", "Implement login button"],
        badExamples: ["add button", "homepage changes", "stuff", "wip"],
        difficulty: "beginner",
    },
    {
        scenario: "You removed an unused CSS class",
        changedFiles: ["styles.css"],
        goodExamples: ["Remove unused CSS class", "Clean up unused styles", "Delete obsolete CSS class"],
        badExamples: ["css", "cleanup", "remove stuff", "delete"],
        difficulty: "beginner",
    },

    // Advanced
    {
        scenario: "You refactored the user authentication system to use JWT tokens instead of sessions",
        changedFiles: ["auth.js", "middleware.js", "package.json", "config.js"],
        goodExamples: [
            "Refactor auth system to use JWT tokens",
            "Replace session auth with JWT",
            "Migrate authentication to JWT",
        ],
        badExamples: ["auth changes", "refactor", "jwt stuff", "update auth"],
        difficulty: "advanced",
    },
    {
        scenario: "You optimized database queries in the user service, reducing load time by 40%",
        changedFiles: ["userService.js", "database.js"],
        goodExamples: [
            "Optimize database queries in user service",
            "Improve user service query performance",
            "Optimize user service DB queries",
        ],
        badExamples: ["optimize", "database", "performance", "faster queries"],
        difficulty: "advanced",
    },
    {
        scenario: "You implemented caching for API responses and added error handling for network timeouts",
        changedFiles: ["api.js", "cache.js", "errorHandler.js"],
        goodExamples: [
            "Add API response caching and timeout handling",
            "Implement API caching with error handling",
            "Add caching and timeout error handling",
        ],
        badExamples: ["api improvements", "caching", "error handling", "network stuff"],
        difficulty: "advanced",
    },

    // Pro
    {
        scenario:
            "You resolved a race condition in the payment processor that was causing duplicate charges during high traffic",
        changedFiles: ["paymentProcessor.js", "transactionLock.js", "tests/payment.test.js"],
        goodExamples: [
            "Fix race condition in payment processor",
            "Resolve payment processor race condition",
            "Fix duplicate charge race condition",
        ],
        badExamples: ["fix payment bug", "payment issues", "race condition", "concurrency fix"],
        difficulty: "pro",
    },
    {
        scenario: "You implemented a distributed cache invalidation strategy across multiple microservices",
        changedFiles: ["cacheManager.js", "serviceA.js", "serviceB.js", "eventBus.js", "config/redis.js"],
        goodExamples: [
            "Implement distributed cache invalidation",
            "Add microservices cache invalidation",
            "Implement cross-service cache invalidation",
        ],
        badExamples: ["cache invalidation", "distributed caching", "microservices update", "cache changes"],
        difficulty: "pro",
    },
];

export function CommitChampion({ onComplete, onClose, difficulty = "beginner" }: CommitChampionProps) {
    const [currentChallenge, setCurrentChallenge] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(90); // 90 seconds for more thoughtful responses
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [commitMessage, setCommitMessage] = useState("");
    const [feedback, setFeedback] = useState<{ type: "good" | "bad" | null; message: string }>({
        type: null,
        message: "",
    });
    const [selectedChallenges, setSelectedChallenges] = useState<CommitChallenge[]>([]);

    const getFilteredChallenges = (diff: string) => {
        let filteredChallenges: CommitChallenge[] = [];

        switch (diff) {
            case "beginner":
                filteredChallenges = COMMIT_CHALLENGES.filter(c => c.difficulty === "beginner");
                break;
            case "advanced":
                filteredChallenges = [
                    ...COMMIT_CHALLENGES.filter(c => c.difficulty === "beginner"),
                    ...COMMIT_CHALLENGES.filter(c => c.difficulty === "advanced"),
                ];
                break;
            case "pro":
                filteredChallenges = COMMIT_CHALLENGES; // All challenges
                break;
        }

        return filteredChallenges.sort(() => Math.random() - 0.5).slice(0, 5);
    };

    const endGame = useCallback(() => {
        if (!gameEnded) {
            setGameEnded(true);
            const finalScore = Math.max(0, score + timeLeft); // Bonus points for remaining time
            onComplete(finalScore);
        }
    }, [gameEnded, score, timeLeft, onComplete]);

    const startGame = () => {
        const challenges = getFilteredChallenges(difficulty);
        setSelectedChallenges(challenges);
        setGameStarted(true);
        setCurrentChallenge(0);
        setScore(0);
        setTimeLeft(90);
        setGameEnded(false);
        setCommitMessage("");
        setFeedback({ type: null, message: "" });
    };

    // Timer effect
    useEffect(() => {
        if (gameStarted && !gameEnded && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            endGame();
        }
    }, [gameStarted, gameEnded, timeLeft, endGame]);

    const evaluateCommitMessage = (message: string, challenge: CommitChallenge) => {
        const msg = message.trim().toLowerCase();

        // Check if it matches good examples (partial match allowed)
        const isGood = challenge.goodExamples.some(example => {
            const exampleWords = example.toLowerCase().split(" ");
            const messageWords = msg.split(" ");
            const matchingWords = exampleWords.filter(word =>
                messageWords.some(msgWord => msgWord.includes(word) || word.includes(msgWord)),
            );
            return matchingWords.length >= Math.min(2, exampleWords.length - 1);
        });

        // Check if it matches bad examples
        const isBad = challenge.badExamples.some(example => {
            return msg.includes(example.toLowerCase()) || example.toLowerCase().includes(msg);
        });

        // Additional quality checks
        const isVague = ["fix", "update", "change", "stuff", "things", "work", "code"].includes(msg);
        const isTooShort = message.trim().split(" ").length < 2;
        const hasGoodStructure = message.length > 10 && message.length < 72; // Git best practices

        if (isBad || isVague || isTooShort || !hasGoodStructure) {
            return { isGood: false, points: 0 };
        } else if (isGood) {
            return { isGood: true, points: 15 };
        } else {
            // Partial credit for reasonable attempts
            return { isGood: true, points: 8 };
        }
    };

    const handleSubmitCommit = () => {
        if (!commitMessage.trim()) return;

        const challenge = selectedChallenges[currentChallenge];
        if (!challenge) return;

        const result = evaluateCommitMessage(commitMessage, challenge);

        if (result.isGood) {
            setScore(score + result.points);
            setFeedback({
                type: "good",
                message: result.points === 15 ? "Excellent commit message! 🎉" : "Good commit message! 👍",
            });
        } else {
            setFeedback({
                type: "bad",
                message: "Could be more specific. Try describing what you did and why.",
            });
        }

        setTimeout(() => {
            if (currentChallenge < selectedChallenges.length - 1) {
                setCurrentChallenge(currentChallenge + 1);
                setCommitMessage("");
                setFeedback({ type: null, message: "" });
            } else {
                endGame();
            }
        }, 2000);
    };

    const challenge = selectedChallenges[currentChallenge];
    // The clock only turns coral once it is genuinely about to run out.
    const timeCritical = timeLeft <= 10;

    if (!gameStarted) {
        return (
            <div className="mx-auto flex w-full max-w-md flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-gm-ink flex min-w-0 items-center gap-2.5 text-2xl [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                        <GitCommit className="text-gm-lime h-6 w-6 shrink-0" aria-hidden="true" />
                        Commit Champion
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
                <p className="text-gm-ink-soft">Write meaningful commit messages for different scenarios!</p>
                <div className="gm-inset flex flex-col gap-1.5 p-4">
                    <p className="text-gm-ink-dim text-sm">
                        • Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </p>
                    <p className="text-gm-ink-dim text-sm">• 5 scenarios • 90 seconds • Quality over speed!</p>
                </div>
                <Button onClick={startGame} size="lg" className="w-full">
                    Start Game
                </Button>
            </div>
        );
    }

    if (gameEnded) {
        const finalScore = Math.max(0, score + timeLeft);
        return (
            <div className="mx-auto flex w-full max-w-md flex-col gap-5">
                <h2 className="font-display text-gm-ink flex items-center justify-center gap-2.5 text-center text-2xl">
                    <Trophy className="text-gm-gold h-6 w-6 shrink-0" aria-hidden="true" />
                    Game Complete!
                </h2>
                <div className="gm-inset flex flex-col gap-2 p-5 text-center">
                    <p className="text-gm-ink text-lg">
                        Final Score:{" "}
                        <span className="font-display text-gm-gold text-2xl tabular-nums">{finalScore}</span>
                    </p>
                    <p className="text-gm-ink-soft text-sm">Quality Points: {score}</p>
                    <p className="text-gm-ink-soft text-sm">Time Bonus: {timeLeft} points</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button onClick={startGame} className="flex-1">
                        Play Again
                    </Button>
                    <Button onClick={onClose} variant="outline" className="flex-1">
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
            {/* HUD: name, clock, score — inset so it never reads as a card inside the dialog */}
            <div className="gm-inset flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5">
                <h2 className="text-gm-ink flex min-w-0 items-center gap-2 font-bold">
                    <GitCommit className="text-gm-lime h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">Commit Champion - Playing</span>
                </h2>
                <div className="flex items-center gap-3">
                    <span
                        className={`flex items-center gap-1.5 text-sm tabular-nums ${
                            timeCritical ? "text-gm-coral" : "text-gm-ink-soft"
                        }`}>
                        <Timer className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {timeLeft}s
                    </span>
                    <span className="text-gm-gold flex items-center gap-1.5 text-sm font-semibold tabular-nums">
                        <Trophy className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Score: {score}
                    </span>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
            </div>

            <div>
                <p className="text-gm-ink-dim text-sm">
                    Scenario {currentChallenge + 1} of {selectedChallenges.length}
                </p>
                <div className="border-gm-line bg-gm-void mt-1.5 h-2.5 w-full overflow-hidden rounded-full border-2">
                    <div
                        className="bg-gm-lime h-full transition-[width] duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none"
                        style={{ width: `${((currentChallenge + 1) / selectedChallenges.length) * 100}%` }}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-gm-ink text-lg [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                    {challenge?.scenario}
                </h3>
                <p className="text-gm-ink-dim mt-3 mb-2 text-sm">Files changed:</p>
                <div className="flex flex-wrap gap-1.5">
                    {challenge?.changedFiles.map((file, index) => (
                        <Badge key={index} variant="outline" className="[font-family:var(--font-code)]">
                            {file}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="commit-message" className="text-gm-ink-soft mb-2 block text-sm font-semibold">
                        Write your commit message:
                    </label>
                    <Input
                        id="commit-message"
                        value={commitMessage}
                        onChange={e => setCommitMessage(e.target.value)}
                        placeholder="e.g., Fix user login validation bug"
                        className="[font-family:var(--font-code)]"
                        maxLength={72}
                        onKeyPress={e => {
                            if (e.key === "Enter" && commitMessage.trim()) {
                                handleSubmitCommit();
                            }
                        }}
                    />
                    <p className="text-gm-ink-dim mt-1.5 text-xs">
                        {commitMessage.length}/72 characters (Git best practice: &lt;50 chars for summary)
                    </p>
                </div>

                <Button
                    onClick={handleSubmitCommit}
                    disabled={!commitMessage.trim() || feedback.type !== null}
                    className="w-full">
                    Submit Commit Message
                </Button>

                {feedback.type && (
                    <div
                        role="status"
                        aria-live="polite"
                        className={`flex flex-col gap-2 rounded-[0.85rem] border-2 p-3 text-center ${
                            feedback.type === "good"
                                ? "border-gm-lime-edge bg-gm-lime/12"
                                : "border-gm-coral-edge bg-gm-coral/12"
                        }`}>
                        <p
                            className={`flex items-center justify-center gap-2 font-semibold ${
                                feedback.type === "good" ? "text-gm-lime" : "text-gm-coral"
                            }`}>
                            {feedback.type === "good" ? (
                                <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                            ) : (
                                <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                            )}
                            {feedback.message}
                        </p>
                        {feedback.type === "bad" && (
                            <p className="text-gm-ink-soft text-xs [overflow-wrap:anywhere]">
                                Good examples: {challenge?.goodExamples.slice(0, 2).join(" • ")}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
