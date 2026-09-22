"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { CheckCircle, GitBranch, Timer, Trophy, X, XCircle } from "lucide-react";

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
    {
        instruction: "Check the status of your repository",
        correctAnswer: "git status",
        options: ["git status", "git check", "git info", "git state"],
        difficulty: "beginner",
    },
    {
        instruction: "Add all current changes to the staging area",
        correctAnswer: "git add .",
        options: ["git add .", "git stage all", "git put .", "git add --all"],
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
    {
        instruction: "Prune stale remote-tracking branches",
        correctAnswer: "git remote prune origin",
        options: ["git remote prune origin", "git branch -p", "git fetch --clear", "git remote clean"],
        difficulty: "advanced",
    },
    {
        instruction: "View a summary of the commit log (one line per commit)",
        correctAnswer: "git log --oneline",
        options: ["git log --oneline", "git show --summary", "git list --short", "git commit --list"],
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

    {
        instruction: "Search for the string 'bug' in the commit history",
        correctAnswer: "git log -S 'bug'",
        options: ["git log -S 'bug'", "git grep 'bug'", "git find 'bug'", "git commit --search='bug'"],
        difficulty: "pro",
    },
    {
        instruction: "Apply a specific commit (abc123) to the current branch",
        correctAnswer: "git cherry-pick abc123",
        options: ["git cherry-pick abc123", "git apply abc123", "git merge-commit abc123", "git include abc123"],
        difficulty: "pro",
    },
    {
        instruction: "Temporarily store uncommitted changes",
        correctAnswer: "git stash",
        options: ["git stash", "git save", "git pause", "git hold"],
        difficulty: "pro",
    },
];

/**
 * Returns a new array with elements shuffled using the Fisher–Yates algorithm.
 *
 * - Produces an unbiased random permutation (uniform distribution).
 * - Does NOT mutate the original array (creates a shallow copy).
 * - Runs in O(n) time.
 *
 * Implementation details:
 * - Iterates from the end of the array and swaps each element
 *   with a randomly selected earlier index (including itself).
 * - Uses a temporary variable for swapping to avoid destructuring issues
 *   with strict TypeScript settings.
 *
 * ⚠️ Note:
 * - Non-null assertions (`!`) are used because TypeScript cannot infer
 *   that indices are always within bounds, though they are guaranteed
 *   by the algorithm.
 *
 */
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        const temp = shuffled[i]!;
        shuffled[i] = shuffled[j]!;
        shuffled[j] = temp;
    }
    return shuffled;
};

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

        /**
         * Selects 8 random challenges and shuffles their options.
         *
         * Uses the Fisher–Yates algorithm to ensure an unbiased shuffle.
         * Does not mutate the original array.
         *
         * Steps:
         * 1. Shuffle all challenges.
         * 2. Take the first 8.
         * 3. Shuffle options within each challenge.
         *
         */
        const selected = shuffleArray(filteredChallenges).slice(0, 8);

        return selected.map(challenge => ({
            ...challenge,
            options: shuffleArray(challenge.options),
        }));
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
    // The clock only turns coral once it is genuinely about to run out.
    const timeCritical = timeLeft <= 10;
    const answeredCorrectly = selectedAnswer === challenge?.correctAnswer;

    if (!gameStarted) {
        return (
            <div className="mx-auto flex w-full max-w-md flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-gm-ink flex min-w-0 items-center gap-2.5 text-2xl [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                        <GitBranch className="text-gm-cyan h-6 w-6 shrink-0" aria-hidden="true" />
                        Branch Master
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
                <p className="text-gm-ink-soft">Answer Git branching questions as fast as possible!</p>
                <div className="gm-inset flex flex-col gap-1.5 p-4">
                    <p className="text-gm-ink-dim text-sm">
                        • Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </p>
                    <p className="text-gm-ink-dim text-sm">• 8 questions • 60 seconds • Bonus points for speed</p>
                </div>
                <Button onClick={startGame} size="lg" className="w-full">
                    Start Game
                </Button>
            </div>
        );
    }

    if (gameEnded) {
        const finalScore = Math.max(0, score * 2 + timeLeft);
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
                    <p className="text-gm-ink-soft text-sm">
                        Correct Answers: {score / 10} / {selectedChallenges.length}
                    </p>
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
                    <GitBranch className="text-gm-cyan h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">Branch Master - Playing</span>
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
                    Question {currentChallenge + 1} of {selectedChallenges.length}
                </p>
                <div className="border-gm-line bg-gm-void mt-1.5 h-2.5 w-full overflow-hidden rounded-full border-2">
                    <div
                        className="bg-gm-lime h-full transition-[width] duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none"
                        style={{ width: `${((currentChallenge + 1) / selectedChallenges.length) * 100}%` }}
                    />
                </div>
            </div>

            <h3 className="text-gm-ink text-lg [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                {challenge?.instruction}
            </h3>

            {/* Answer keycaps: real buttons that sink onto their edge when pressed. */}
            <div className="grid grid-cols-1 gap-3">
                {challenge?.options.map((option, index) => {
                    const isAnswer = showResult && option === challenge.correctAnswer;
                    const isWrongPick = showResult && !isAnswer && option === selectedAnswer;

                    return (
                        <Button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={showResult}
                            variant={isAnswer ? "default" : isWrongPick ? "destructive" : "outline"}
                            className={`h-auto min-h-[3.25rem] w-full justify-start gap-3 rounded-2xl px-4 py-3 text-start whitespace-normal ${
                                isAnswer
                                    ? "disabled:border-gm-lime-edge disabled:bg-gm-lime disabled:text-gm-void"
                                    : isWrongPick
                                      ? "disabled:border-gm-coral-edge disabled:bg-gm-coral disabled:text-gm-void"
                                      : ""
                            }`}>
                            {isAnswer && <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />}
                            {isWrongPick && <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" />}
                            <code className="[font-family:var(--font-code)] text-sm [overflow-wrap:anywhere]">
                                {option}
                            </code>
                        </Button>
                    );
                })}
            </div>

            {showResult && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`flex flex-col items-center gap-1.5 rounded-[0.85rem] border-2 p-3 text-center ${
                        answeredCorrectly ? "border-gm-lime-edge bg-gm-lime/12" : "border-gm-coral-edge bg-gm-coral/12"
                    }`}>
                    <p
                        className={`flex items-center gap-2 text-lg font-semibold ${
                            answeredCorrectly ? "text-gm-lime" : "text-gm-coral"
                        }`}>
                        {answeredCorrectly ? (
                            <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                        ) : (
                            <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                        )}
                        {answeredCorrectly ? "Correct!" : "Wrong!"}
                    </p>
                    {!answeredCorrectly && (
                        <p className="text-gm-ink-soft text-sm">
                            Correct answer:{" "}
                            <code className="border-gm-line bg-gm-void text-gm-ink rounded-[0.5rem] border-2 px-2 py-0.5 [font-family:var(--font-code)] [overflow-wrap:anywhere]">
                                {challenge?.correctAnswer}
                            </code>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
