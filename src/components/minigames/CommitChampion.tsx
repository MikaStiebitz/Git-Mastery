"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
        scenario: "یک غلط املایی را در فایل README اصلاح کردی",
        changedFiles: ["README.md"],
        goodExamples: ["Fix typo in README", "Fix README typo", "Correct spelling in README"],
        badExamples: ["fixed stuff", "update", "changes", "asdf"],
        difficulty: "beginner",
    },
    {
        scenario: "یک دکمهٔ ورود جدید به صفحهٔ اصلی اضافه کردی",
        changedFiles: ["homepage.html", "styles.css"],
        goodExamples: ["Add login button to homepage", "Add homepage login button", "Implement login button"],
        badExamples: ["add button", "homepage changes", "stuff", "wip"],
        difficulty: "beginner",
    },
    {
        scenario: "یک کلاس CSS بلااستفاده را حذف کردی",
        changedFiles: ["styles.css"],
        goodExamples: ["Remove unused CSS class", "Clean up unused styles", "Delete obsolete CSS class"],
        badExamples: ["css", "cleanup", "remove stuff", "delete"],
        difficulty: "beginner",
    },

    // Advanced
    {
        scenario: "سامانهٔ احراز هویت کاربر را بازآرایی کردی تا به‌جای سشن از توکن‌های JWT استفاده کند",
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
        scenario: "کوئری‌های پایگاه‌داده در سرویس کاربر را بهینه کردی و زمان بارگذاری را ۴۰٪ کاهش دادی",
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
        scenario: "برای پاسخ‌های API کش پیاده‌سازی کردی و مدیریت خطای تایم‌اوت شبکه را افزودی",
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
            "یک وضعیت رقابتی در پردازشگر پرداخت را رفع کردی که هنگام ترافیک بالا باعث شارژ تکراری می‌شد",
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
        scenario: "یک راهبرد ابطال کش توزیع‌شده در چند میکروسرویس پیاده‌سازی کردی",
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
                message: result.points === 15 ? "پیام کامیت عالی! 🎉" : "پیام کامیت خوب! 👍",
            });
        } else {
            setFeedback({
                type: "bad",
                message: "می‌تواند دقیق‌تر باشد. توضیح بده چه کاری انجام دادی و چرا.",
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
    const difficultyLabel =
        {
            beginner: "مبتدی",
            advanced: "پیشرفته",
            pro: "حرفه‌ای",
        }[difficulty] ?? "مبتدی";

    if (!gameStarted) {
        return (
            <Card className="mx-auto max-w-md border-yellow-600 bg-yellow-900/20">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center text-xl text-yellow-400">
                        <GitCommit className="mr-2 h-6 w-6" />
                        قهرمان کامیت‌ها
                    </CardTitle>
                    <div className="absolute right-2 top-2">
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-purple-200">برای موقعیت‌های مختلف پیام‌های کامیت معنی‌دار بنویس!</p>
                    <p className="text-sm text-purple-300">
                        • سختی: {difficultyLabel}
                    </p>
                    <p className="text-sm text-purple-300">• 5 سناریو • 90 ثانیه • کیفیت مهم‌تر از سرعت!</p>
                    <Button onClick={startGame} className="w-full bg-yellow-600 text-white hover:bg-yellow-700">
                        شروع بازی
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (gameEnded) {
        const finalScore = Math.max(0, score + timeLeft);
        return (
            <Card className="mx-auto max-w-md border-yellow-600 bg-yellow-900/20">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center text-xl text-yellow-400">
                        <Trophy className="mr-2 h-6 w-6" />
                        بازی تمام شد!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <div className="space-y-2">
                        <p className="text-lg text-white">امتیاز نهایی: {finalScore}</p>
                        <p className="text-sm text-purple-200">امتیاز کیفیت: {score}</p>
                        <p className="text-sm text-purple-200">امتیاز زمانی: {timeLeft}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={startGame}
                            variant="outline"
                            className="flex-1 border-yellow-600 text-yellow-300 hover:bg-yellow-900/50">
                            دوباره بازی کن
                        </Button>
                        <Button onClick={onClose} className="flex-1 bg-purple-600 text-white hover:bg-purple-700">
                            بستن
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mx-auto max-w-2xl border-yellow-600 bg-yellow-900/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg text-yellow-400">
                        <GitCommit className="mr-2 h-5 w-5" />
                        قهرمان کامیت‌ها - در حال بازی
                    </CardTitle>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center text-purple-300">
                            <Timer className="mr-1 h-4 w-4" />
                            {timeLeft}s
                        </div>
                        <div className="text-purple-300">امتیاز: {score}</div>
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="flex text-sm text-purple-400">
                        سناریو {currentChallenge + 1} از {selectedChallenges.length}
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-purple-900/30">
                        <div
                            className="h-full rounded-full bg-yellow-600 transition-all duration-300"
                            style={{ width: `${((currentChallenge + 1) / selectedChallenges.length) * 100}%` }}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <h3 className="mb-4 text-lg text-white">{challenge?.scenario}</h3>
                    <div className="mb-4">
                        <p className="mb-2 text-sm text-purple-300">فایل‌های تغییر کرده:</p>
                        <div className="flex flex-wrap justify-center gap-1">
                            {challenge?.changedFiles.map((file, index) => (
                                <span
                                    key={index}
                                    className="rounded bg-purple-900/50 px-2 py-1 font-mono text-xs text-purple-200">
                                    {file}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-purple-300">
                            پیام کامیتت را بنویس:
                        </label>
                        <Input
                            value={commitMessage}
                            onChange={e => setCommitMessage(e.target.value)}
                            placeholder="مثال: رفع خطای اعتبارسنجی ورود کاربر"
                            className="border-purple-700 bg-purple-900/20 text-white placeholder-purple-400"
                            maxLength={72}
                            onKeyPress={e => {
                                if (e.key === "Enter" && commitMessage.trim()) {
                                    handleSubmitCommit();
                                }
                            }}
                        />
                        <p className="mt-1 text-xs text-purple-400">
                            {commitMessage.length}/72 کاراکتر (بهترین تمرین گیت: خلاصه کمتر از &lt;50 کاراکتر باشد)
                        </p>
                    </div>

                    <Button
                        onClick={handleSubmitCommit}
                        disabled={!commitMessage.trim() || feedback.type !== null}
                        className="w-full bg-yellow-600 text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-gray-600">
                        ارسال پیام کامیت
                    </Button>

                    {feedback.type && (
                        <div
                            className={`rounded-md p-3 text-center ${
                                feedback.type === "good"
                                    ? "border border-green-700 bg-green-900/50"
                                    : "border border-red-700 bg-red-900/50"
                            }`}>
                            <div className="mb-2 flex items-center justify-center">
                                {feedback.type === "good" ? (
                                    <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                                ) : (
                                    <XCircle className="mr-2 h-5 w-5 text-red-400" />
                                )}
                                <p
                                    className={`font-medium ${
                                        feedback.type === "good" ? "text-green-300" : "text-red-300"
                                    }`}>
                                    {feedback.message}
                                </p>
                            </div>
                            {feedback.type === "bad" && (
                                <p className="text-xs text-purple-300">
                                    نمونه‌های خوب: {challenge?.goodExamples.slice(0, 2).join(" • ")}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
