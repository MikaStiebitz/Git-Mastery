"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { GitGraph as GitGraphIcon, Timer, Trophy, X, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";

interface GraphPuzzleProps {
    onComplete: (score: number) => void;
    onClose: () => void;
    difficulty?: "beginner" | "advanced" | "pro";
}

interface Puzzle {
    goal: string;
    // Target history rendered like `git log --oneline --graph` (newest first)
    diagram: string[];
    // The correct command order (top = first command to run)
    steps: string[];
    difficulty: "beginner" | "advanced" | "pro";
}

const PUZZLES: Puzzle[] = [
    {
        goal: "Create a feature branch, commit on it, then merge it back into main.",
        diagram: ["*   c3 (main) Merge feature", "|\\", "| * c2 (feature) Add feature", "|/", "* c1 Initial commit"],
        steps: [
            "git switch -c feature",
            "git add .",
            'git commit -m "Add feature"',
            "git switch main",
            "git merge feature",
        ],
        difficulty: "beginner",
    },
    {
        goal: "Stage a file, commit it, and tag that commit as v1.0.0.",
        diagram: ["* c2 (HEAD -> main, tag: v1.0.0) Add readme", "* c1 Initial commit"],
        steps: ["git add README.md", 'git commit -m "Add readme"', "git tag v1.0.0"],
        difficulty: "beginner",
    },
    {
        goal: "Create a branch from main, but leave main checked out afterwards.",
        diagram: ["* c1 (HEAD -> main, dev) Initial commit"],
        steps: ["git branch dev", "git switch main"],
        difficulty: "beginner",
    },
    {
        goal: "Rebase your feature branch onto main, then fast-forward main to it.",
        diagram: ["* c3 (HEAD -> main, feature) Feature work", "* c2 Update main", "* c1 Initial commit"],
        steps: ["git switch feature", "git rebase main", "git switch main", "git merge feature"],
        difficulty: "advanced",
    },
    {
        goal: "Stash your work, switch to main to hotfix, commit, then restore your work.",
        diagram: ["* c2 (main) Hotfix", "* c1 Initial commit", "", "stash@{0}: WIP on feature"],
        steps: ["git stash", "git switch main", "git add .", 'git commit -m "Hotfix"', "git stash pop"],
        difficulty: "advanced",
    },
    {
        goal: "Cherry-pick commit abc123 onto main and tag the result as v2.0.0.",
        diagram: ["* d9 (HEAD -> main, tag: v2.0.0) Cherry-picked change", "* c1 Initial commit"],
        steps: ["git switch main", "git cherry-pick abc123", "git tag v2.0.0"],
        difficulty: "pro",
    },
    {
        goal: "Undo the last commit but keep the changes staged, then re-commit with a new message.",
        diagram: ["* e1 (HEAD -> main) Reworded commit", "* c1 Initial commit"],
        steps: ["git reset --soft HEAD~1", 'git commit -m "Reworded commit"'],
        difficulty: "pro",
    },
    {
        goal: "Interactively rebase the last 3 commits, then force-update the remote.",
        diagram: ["* f3 (HEAD -> main) Squashed work", "* c1 Initial commit"],
        steps: ["git rebase -i HEAD~3", "git push --force-with-lease"],
        difficulty: "pro",
    },
];

const ROUNDS = 5;
const TIME_LIMIT = 90;

// Fisher–Yates shuffle (non-mutating)
function shuffle<T>(input: T[]): T[] {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
}

export function GraphPuzzle({ onComplete, onClose, difficulty = "beginner" }: GraphPuzzleProps) {
    const { t } = useLanguage();

    const pool = PUZZLES.filter(p => p.difficulty === difficulty);
    const puzzles = (pool.length > 0 ? pool : PUZZLES).slice(0, ROUNDS);

    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [gameOver, setGameOver] = useState(false);
    const [placed, setPlaced] = useState<string[]>([]);
    const [remaining, setRemaining] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

    const current = puzzles[round];

    const loadRound = useCallback(
        (index: number) => {
            const puzzle = puzzles[index];
            if (!puzzle) return;
            setPlaced([]);
            setRemaining(shuffle(puzzle.steps));
            setFeedback(null);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [round],
    );

    // Initialise the first round on mount
    useEffect(() => {
        setRemaining(shuffle(puzzles[0]?.steps ?? []));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Countdown timer
    useEffect(() => {
        if (gameOver || feedback === "correct") return;
        if (timeLeft <= 0) {
            setGameOver(true);
            return;
        }
        const id = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(id);
    }, [timeLeft, gameOver, feedback]);

    const pickChip = (chip: string, index: number) => {
        if (feedback) return;
        setPlaced(prev => [...prev, chip]);
        setRemaining(prev => prev.filter((_, i) => i !== index));
    };

    const removeChip = (index: number) => {
        if (feedback) return;
        const chip = placed[index];
        if (chip === undefined) return;
        setPlaced(prev => prev.filter((_, i) => i !== index));
        setRemaining(prev => [...prev, chip]);
    };

    const resetRound = () => {
        if (!current) return;
        setPlaced([]);
        setRemaining(shuffle(current.steps));
        setFeedback(null);
    };

    const checkOrder = () => {
        if (!current) return;
        const correct = placed.length === current.steps.length && placed.every((cmd, i) => cmd === current.steps[i]);

        if (correct) {
            setFeedback("correct");
            // More time left = more points; base 20 per puzzle
            const bonus = Math.round((timeLeft / TIME_LIMIT) * 10);
            const gained = 20 + bonus;
            const newScore = score + gained;
            setScore(newScore);

            setTimeout(() => {
                if (round + 1 >= puzzles.length) {
                    setGameOver(true);
                } else {
                    const next = round + 1;
                    setRound(next);
                    loadRound(next);
                }
            }, 1400);
        } else {
            setFeedback("wrong");
            setTimeout(() => setFeedback(null), 1200);
        }
    };

    // The clock only turns coral once it is genuinely about to run out.
    const timeCritical = timeLeft <= 10;

    if (gameOver) {
        return (
            <div className="flex flex-col gap-6">
                <h2 className="font-display text-gm-ink flex items-center justify-center gap-2.5 text-center text-2xl [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                    <Trophy className="text-gm-gold h-6 w-6 shrink-0" aria-hidden="true" />
                    {t("minigame.graphPuzzle.name")}
                </h2>
                <div className="gm-inset flex flex-col items-center gap-1 p-5 text-center">
                    <p className="text-gm-ink-dim text-sm">{t("minigame.finalScore")}</p>
                    <p className="font-display text-gm-gold text-4xl tabular-nums">{score}</p>
                </div>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    {/* Gold is currency: claiming the reward is the one gold control here. */}
                    <button type="button" onClick={() => onComplete(score)} className="btn-arcade btn-arcade-gold">
                        <Trophy className="h-4 w-4" aria-hidden="true" />
                        {t("minigame.claimReward")}
                    </button>
                    <Button onClick={onClose} variant="outline" size="lg">
                        <X className="h-4 w-4" aria-hidden="true" />
                        {t("minigame.close")}
                    </Button>
                </div>
            </div>
        );
    }

    if (!current) return null;

    return (
        <div className="flex flex-col gap-5">
            {/* HUD: name, clock, round, score — inset so it never reads as a card in a card */}
            <div className="gm-inset flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5">
                <h2 className="text-gm-ink flex min-w-0 items-center gap-2 font-bold">
                    <GitGraphIcon className="text-gm-grape-hi h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{t("minigame.graphPuzzle.name")}</span>
                </h2>
                <div className="flex items-center gap-3 text-sm">
                    <span
                        className={`flex items-center gap-1.5 tabular-nums ${
                            timeCritical ? "text-gm-coral" : "text-gm-ink-soft"
                        }`}>
                        <Timer className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {timeLeft}s
                    </span>
                    <span className="text-gm-ink-dim tabular-nums">
                        {round + 1}/{puzzles.length}
                    </span>
                    <span className="text-gm-gold flex items-center gap-1.5 font-semibold tabular-nums">
                        <Trophy className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {score}
                    </span>
                </div>
            </div>

            <div>
                <p className="text-gm-ink-dim mb-1 text-sm">{t("minigame.graphPuzzle.goal")}</p>
                <p className="text-gm-ink text-base [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                    {current.goal}
                </p>
            </div>

            {/* Target graph — what Git itself would print, so it stays mono */}
            <div className="gm-inset gm-scroll overflow-x-auto p-3">
                <pre className="text-gm-ink-soft [font-family:var(--font-code)] text-xs leading-relaxed">
                    {current.diagram.join("\n")}
                </pre>
            </div>

            {/* Ordered sequence */}
            <div>
                <p className="text-gm-ink-dim mb-2 text-sm">{t("minigame.graphPuzzle.yourOrder")}</p>
                <div className="border-gm-line flex min-h-[3.5rem] flex-col gap-2 rounded-[1rem] border-2 border-dashed p-2">
                    {placed.length === 0 && (
                        <p className="text-gm-ink-dim py-3 text-center text-xs">{t("minigame.graphPuzzle.tapHint")}</p>
                    )}
                    {placed.map((chip, i) => (
                        <Button
                            key={`${chip}-${i}`}
                            onClick={() => removeChip(i)}
                            disabled={feedback === "correct"}
                            variant="outline"
                            className="hover:border-gm-coral hover:text-gm-coral h-auto min-h-11 w-full justify-between gap-3 rounded-2xl px-3 py-2 text-start whitespace-normal">
                            <span className="[font-family:var(--font-code)] text-xs [overflow-wrap:anywhere]">
                                <span className="text-gm-ink-dim me-2">{i + 1}.</span>
                                {chip}
                            </span>
                            <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </Button>
                    ))}
                </div>
            </div>

            {/* Command pool — arcade keycaps that sink onto their edge when pressed */}
            {remaining.length > 0 && (
                <div>
                    <p className="text-gm-ink-dim mb-2 text-sm">{t("minigame.graphPuzzle.commands")}</p>
                    <div className="flex flex-wrap gap-2">
                        {remaining.map((chip, i) => (
                            <Button
                                key={`${chip}-${i}`}
                                onClick={() => pickChip(chip, i)}
                                disabled={feedback === "correct"}
                                variant="outline"
                                className="h-auto min-h-11 max-w-full rounded-2xl px-3 py-2 [font-family:var(--font-code)] text-xs whitespace-normal">
                                <span className="[overflow-wrap:anywhere]">{chip}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {feedback && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`flex items-center justify-center gap-2 rounded-[0.85rem] border-2 p-2.5 text-center text-sm font-semibold ${
                        feedback === "correct"
                            ? "border-gm-lime-edge bg-gm-lime/12 text-gm-lime"
                            : "border-gm-coral-edge bg-gm-coral/12 text-gm-coral"
                    }`}>
                    {feedback === "correct" ? (
                        <>
                            <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            {t("minigame.graphPuzzle.correct")}
                        </>
                    ) : (
                        <>
                            <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            {t("minigame.graphPuzzle.wrong")}
                        </>
                    )}
                </div>
            )}

            <div className="flex gap-3">
                <Button
                    onClick={checkOrder}
                    disabled={remaining.length > 0 || feedback === "correct"}
                    className="flex-1">
                    {t("minigame.graphPuzzle.check")}
                </Button>
                <Button
                    onClick={resetRound}
                    variant="outline"
                    size="icon"
                    disabled={feedback === "correct" || placed.length === 0}
                    aria-label={t("minigame.playAgain")}>
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button onClick={onClose} variant="outline" size="icon" aria-label={t("minigame.close")}>
                    <X className="h-4 w-4" aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}
