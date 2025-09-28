"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { GitBranch, Timer, Trophy, X } from "lucide-react";

interface BranchMasterProps {
    onComplete: (score: number) => void;
    onClose: () => void;
    difficulty?: "beginner" | "advanced" | "pro";
}

interface Challenge {
    instruction: string;
    correctAnswer: string;
    options: string[];
    difficulty: "beginner" | "advanced" | "pro";
}

const CHALLENGES: Challenge[] = [
    // Beginner questions
    {
        instruction: "Create a new branch called 'feature'",
        correctAnswer: "git branch feature",
        options: ["git branch feature", "git checkout feature", "git create feature", "git new feature"],
        difficulty: "beginner",
    },
    {
        instruction: "Switch to branch 'main'",
        correctAnswer: "git checkout main",
        options: ["git checkout main", "git branch main", "git switch-to main", "git go main"],
        difficulty: "beginner",
    },
    {
        instruction: "Create and switch to a new branch 'hotfix'",
        correctAnswer: "git checkout -b hotfix",
        options: [
            "git checkout -b hotfix",
            "git branch hotfix && git checkout hotfix",
            "git create hotfix",
            "git new-branch hotfix",
        ],
        difficulty: "beginner",
    },
    {
        instruction: "List all branches",
        correctAnswer: "git branch",
        options: ["git branch", "git branch -a", "git list branches", "git show branches"],
        difficulty: "beginner",
    },
    {
        instruction: "Delete branch 'old-feature'",
        correctAnswer: "git branch -d old-feature",
        options: [
            "git branch -d old-feature",
            "git delete old-feature",
            "git remove old-feature",
            "git branch --delete old-feature",
        ],
        difficulty: "beginner",
    },
    {
        instruction: "Show current branch name",
        correctAnswer: "git branch --show-current",
        options: ["git branch --show-current", "git current-branch", "git status", "git branch -c"],
        difficulty: "beginner",
    },

    // Advanced questions
    {
        instruction: "List all remote branches",
        correctAnswer: "git branch -r",
        options: ["git branch -r", "git branch --remote", "git remote branches", "git list remote"],
        difficulty: "advanced",
    },
    {
        instruction: "Create a branch from a specific commit (abc123)",
        correctAnswer: "git branch new-branch abc123",
        options: [
            "git branch new-branch abc123",
            "git checkout -b new-branch abc123",
            "git create-branch abc123",
            "git branch abc123 new-branch",
        ],
        difficulty: "advanced",
    },
    {
        instruction: "Force delete a branch that hasn't been merged",
        correctAnswer: "git branch -D unmerged-branch",
        options: [
            "git branch -D unmerged-branch",
            "git branch -d --force unmerged-branch",
            "git branch --delete-force unmerged-branch",
            "git branch -f -d unmerged-branch",
        ],
        difficulty: "advanced",
    },
    {
        instruction: "Rename current branch to 'new-name'",
        correctAnswer: "git branch -m new-name",
        options: [
            "git branch -m new-name",
            "git branch --rename new-name",
            "git rename-branch new-name",
            "git branch -r new-name",
        ],
        difficulty: "advanced",
    },
    {
        instruction: "Set upstream for current branch to origin/main",
        correctAnswer: "git branch --set-upstream-to=origin/main",
        options: [
            "git branch --set-upstream-to=origin/main",
            "git upstream origin/main",
            "git branch -u origin/main",
            "git set-upstream origin/main",
        ],
        difficulty: "advanced",
    },
    {
        instruction: "Show which remote branch current branch tracks",
        correctAnswer: "git branch -vv",
        options: ["git branch -vv", "git branch --track-info", "git remote show origin", "git branch --upstream"],
        difficulty: "advanced",
    },

    // Pro questions
    {
        instruction: "Create an orphan branch (no commit history)",
        correctAnswer: "git checkout --orphan orphan-branch",
        options: [
            "git checkout --orphan orphan-branch",
            "git branch --orphan orphan-branch",
            "git create --orphan orphan-branch",
            "git branch -o orphan-branch",
        ],
        difficulty: "pro",
    },
    {
        instruction: "Copy a branch to a new name without checking it out",
        correctAnswer: "git branch new-copy existing-branch",
        options: [
            "git branch new-copy existing-branch",
            "git copy-branch existing-branch new-copy",
            "git branch -c existing-branch new-copy",
            "git clone-branch existing-branch new-copy",
        ],
        difficulty: "pro",
    },
    {
        instruction: "Delete remote tracking branch reference locally",
        correctAnswer: "git branch -dr origin/deleted-branch",
        options: [
            "git branch -dr origin/deleted-branch",
            "git remote prune origin",
            "git branch --delete-remote origin/deleted-branch",
            "git branch -r -d origin/deleted-branch",
        ],
        difficulty: "pro",
    },
    {
        instruction: "Show branches that contain a specific commit (abc123)",
        correctAnswer: "git branch --contains abc123",
        options: [
            "git branch --contains abc123",
            "git branch --has-commit abc123",
            "git branch -c abc123",
            "git show-branch abc123",
        ],
        difficulty: "pro",
    },
    {
        instruction: "List branches sorted by last commit date",
        correctAnswer: "git branch --sort=-committerdate",
        options: [
            "git branch --sort=-committerdate",
            "git branch --sort-by-date",
            "git branch -s date",
            "git branch --order-by-date",
        ],
        difficulty: "pro",
    },
];

export function BranchMaster({ onComplete, onClose, difficulty = "beginner" }: BranchMasterProps) {
    const [currentChallenge, setCurrentChallenge] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds total
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([]);

    // Filter challenges based on difficulty
    const getFilteredChallenges = (diff: string) => {
        let filteredChallenges: Challenge[] = [];

        switch (diff) {
            case "beginner":
                filteredChallenges = CHALLENGES.filter(c => c.difficulty === "beginner");
                break;
            case "advanced":
                filteredChallenges = [
                    ...CHALLENGES.filter(c => c.difficulty === "beginner"),
                    ...CHALLENGES.filter(c => c.difficulty === "advanced"),
                ];
                break;
            case "pro":
                filteredChallenges = CHALLENGES; // All challenges
                break;
        }

        // Shuffle and take 8 questions
        return filteredChallenges.sort(() => Math.random() - 0.5).slice(0, 8);
    };

    const endGame = useCallback(() => {
        if (!gameEnded) {
            setGameEnded(true);
            const finalScore = Math.max(0, score * 2 + timeLeft); // Bonus points for remaining time
            onComplete(finalScore);
        }
    }, [gameEnded, score, timeLeft, onComplete]);

    const startGame = () => {
        const challenges = getFilteredChallenges(difficulty);
        setSelectedChallenges(challenges);
        setGameStarted(true);
        setCurrentChallenge(0);
        setScore(0);
        setTimeLeft(60);
        setGameEnded(false);
        setSelectedAnswer(null);
        setShowResult(false);
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

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setShowResult(true);

        setTimeout(() => {
            const isCorrect = answer === selectedChallenges[currentChallenge]?.correctAnswer;
            if (isCorrect) {
                setScore(score + 10);
            }

            if (currentChallenge < selectedChallenges.length - 1) {
                setCurrentChallenge(currentChallenge + 1);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                endGame();
            }
        }, 1500);
    };

    const challenge = selectedChallenges[currentChallenge];

    if (!gameStarted) {
        return (
            <Card className="mx-auto max-w-md border-green-600 bg-green-900/20">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center text-xl text-green-400">
                        <GitBranch className="mr-2 h-6 w-6" />
                        Branch Master
                    </CardTitle>
                    <div className="absolute right-2 top-2">
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-purple-200">Answer Git branching questions as fast as possible!</p>
                    <p className="text-sm text-purple-300">
                        • Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </p>
                    <p className="text-sm text-purple-300">• 8 questions • 60 seconds • Bonus points for speed</p>
                    <Button onClick={startGame} className="w-full bg-green-600 text-white hover:bg-green-700">
                        Start Game
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (gameEnded) {
        const finalScore = Math.max(0, score * 2 + timeLeft);
        return (
            <Card className="mx-auto max-w-md border-yellow-600 bg-yellow-900/20">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center text-xl text-yellow-400">
                        <Trophy className="mr-2 h-6 w-6" />
                        Game Complete!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <div className="space-y-2">
                        <p className="text-lg text-white">Final Score: {finalScore}</p>
                        <p className="text-sm text-purple-200">
                            Correct Answers: {score / 10} / {selectedChallenges.length}
                        </p>
                        <p className="text-sm text-purple-200">Time Bonus: {timeLeft} points</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={startGame}
                            variant="outline"
                            className="flex-1 border-green-600 text-green-300 hover:bg-green-900/50">
                            Play Again
                        </Button>
                        <Button onClick={onClose} className="flex-1 bg-purple-600 text-white hover:bg-purple-700">
                            Close
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mx-auto max-w-2xl border-green-600 bg-green-900/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg text-green-400">
                        <GitBranch className="mr-2 h-5 w-5" />
                        Branch Master - Playing
                    </CardTitle>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center text-purple-300">
                            <Timer className="mr-1 h-4 w-4" />
                            {timeLeft}s
                        </div>
                        <div className="text-purple-300">Score: {score}</div>
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="flex text-sm text-purple-400">
                        Question {currentChallenge + 1} of {selectedChallenges.length}
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-purple-900/30">
                        <div
                            className="h-full rounded-full bg-green-600 transition-all duration-300"
                            style={{ width: `${((currentChallenge + 1) / selectedChallenges.length) * 100}%` }}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <h3 className="mb-4 text-lg text-white">{challenge?.instruction}</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {challenge?.options.map((option, index) => (
                        <Button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={showResult}
                            className={`p-4 text-left transition-all duration-200 ${
                                showResult
                                    ? option === challenge.correctAnswer
                                        ? "border-green-500 bg-green-600 text-white"
                                        : option === selectedAnswer
                                          ? "border-red-500 bg-red-600 text-white"
                                          : "border-gray-500 bg-gray-600 text-gray-300"
                                    : "border-purple-700 bg-purple-900/30 text-purple-100 hover:border-purple-600 hover:bg-purple-900/50"
                            }`}
                            variant="outline">
                            <code className="font-mono text-sm">{option}</code>
                        </Button>
                    ))}
                </div>

                {showResult && (
                    <div className="text-center">
                        <p
                            className={`text-lg ${selectedAnswer === challenge?.correctAnswer ? "text-green-400" : "text-red-400"}`}>
                            {selectedAnswer === challenge?.correctAnswer ? "✓ Correct!" : "✗ Wrong!"}
                        </p>
                        {selectedAnswer !== challenge?.correctAnswer && (
                            <p className="mt-1 text-sm text-purple-300">
                                Correct answer:{" "}
                                <code className="rounded bg-purple-900/50 px-2 py-1 font-mono">
                                    {challenge?.correctAnswer}
                                </code>
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
