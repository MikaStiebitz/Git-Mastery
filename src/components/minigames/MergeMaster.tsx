"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { GitMerge, Timer, Trophy, X, ChevronDown, ChevronRight } from "lucide-react";

interface MergeMasterProps {
    onComplete: (score: number) => void;
    onClose: () => void;
    difficulty?: "beginner" | "advanced" | "pro";
}

interface ConflictScenario {
    description: string;
    conflictedFile: string;
    conflictContent: string;
    correctResolution: string;
    difficulty: "beginner" | "advanced" | "pro";
}

const CONFLICT_SCENARIOS: ConflictScenario[] = [
    // Beginner
    {
        description: "دو توسعه‌دهنده یک خط یکسان را در فایل پیکربندی تغییر داده‌اند",
        conflictedFile: "config.js",
        conflictContent: `module.exports = {
<<<<<<< HEAD
    apiUrl: "https://api.example.com/v1",
=======
    apiUrl: "https://api.newdomain.com/v1",
>>>>>>> feature-branch
    timeout: 5000
};`,
        correctResolution: `module.exports = {
    apiUrl: "https://api.newdomain.com/v1",
    timeout: 5000
};`,
        difficulty: "beginner",
    },
    {
        description: "شماره نسخه‌های متعارض در package.json",
        conflictedFile: "package.json",
        conflictContent: `{
    "name": "my-app",
<<<<<<< HEAD
    "version": "1.2.0",
=======
    "version": "1.3.0",
>>>>>>> feature-branch
    "dependencies": {}
}`,
        correctResolution: `{
    "name": "my-app",
    "version": "1.3.0",
    "dependencies": {}
}`,
        difficulty: "beginner",
    },

    // Advanced
    {
        description: "تعارض در پیاده‌سازی تابع با رویکردهای متفاوت",
        conflictedFile: "userService.js",
        conflictContent: `function getUserData(userId) {
<<<<<<< HEAD
    return database.query('SELECT * FROM users WHERE id = ?', [userId])
        .then(result => result[0]);
=======
    return database.users.findById(userId)
        .populate('profile')
        .lean();
>>>>>>> feature-branch
}`,
        correctResolution: `function getUserData(userId) {
    return database.users.findById(userId)
        .populate('profile')
        .lean();
}`,
        difficulty: "advanced",
    },
    {
        description: "تعارض استایل CSS بین رویکردهای مختلف لایه‌بندی",
        conflictedFile: "styles.css",
        conflictContent: `.header {
<<<<<<< HEAD
    display: flex;
    justify-content: space-between;
    padding: 10px;
=======
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 20px;
>>>>>>> feature-branch
    background: #fff;
}`,
        correctResolution: `.header {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 20px;
    background: #fff;
}`,
        difficulty: "advanced",
    },

    // Pro
    {
        description: "ادغام پیچیده با چندین بخش متعارض",
        conflictedFile: "authController.js",
        conflictContent: `class AuthController {
<<<<<<< HEAD
    async login(username, password) {
        const user = await User.findByCredentials(username, password);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        return { user, token };
    }
=======
    async login(email, password) {
        const user = await User.authenticate(email, password);
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        return { user, accessToken, refreshToken };
    }
>>>>>>> feature-branch

    async logout(token) {
<<<<<<< HEAD
        // Simple logout - no token blacklisting
        return { success: true };
=======
        await TokenBlacklist.add(token);
        return { success: true, message: 'Logged out successfully' };
>>>>>>> feature-branch
    }
}`,
        correctResolution: `class AuthController {
    async login(email, password) {
        const user = await User.authenticate(email, password);
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        return { user, accessToken, refreshToken };
    }

    async logout(token) {
        await TokenBlacklist.add(token);
        return { success: true, message: 'Logged out successfully' };
    }
}`,
        difficulty: "pro",
    },
];

export function MergeMaster({ onComplete, onClose, difficulty = "beginner" }: MergeMasterProps) {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes for more complex tasks
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [resolution, setResolution] = useState("");
    const [feedback, setFeedback] = useState<{ type: "good" | "bad" | null; message: string }>({
        type: null,
        message: "",
    });
    const [selectedScenarios, setSelectedScenarios] = useState<ConflictScenario[]>([]);
    const [showHint, setShowHint] = useState(false);

    const getFilteredScenarios = (diff: string) => {
        let filteredScenarios: ConflictScenario[] = [];

        switch (diff) {
            case "beginner":
                filteredScenarios = CONFLICT_SCENARIOS.filter(c => c.difficulty === "beginner");
                break;
            case "advanced":
                filteredScenarios = [
                    ...CONFLICT_SCENARIOS.filter(c => c.difficulty === "beginner"),
                    ...CONFLICT_SCENARIOS.filter(c => c.difficulty === "advanced"),
                ];
                break;
            case "pro":
                filteredScenarios = CONFLICT_SCENARIOS; // All scenarios
                break;
        }

        return filteredScenarios.sort(() => Math.random() - 0.5).slice(0, 3);
    };

    const endGame = useCallback(() => {
        if (!gameEnded) {
            setGameEnded(true);
            const finalScore = Math.max(0, score + Math.floor(timeLeft / 2)); // Smaller time bonus
            onComplete(finalScore);
        }
    }, [gameEnded, score, timeLeft, onComplete]);

    const startGame = () => {
        const scenarios = getFilteredScenarios(difficulty);
        setSelectedScenarios(scenarios);
        setGameStarted(true);
        setCurrentScenario(0);
        setScore(0);
        setTimeLeft(120);
        setGameEnded(false);
        setResolution("");
        setFeedback({ type: null, message: "" });
        setShowHint(false);
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

    const normalizeCode = (code: string) => {
        return code
            .replace(/\s+/g, " ")
            .replace(/;\s*/g, ";")
            .replace(/{\s*/g, "{")
            .replace(/}\s*/g, "}")
            .trim()
            .toLowerCase();
    };

    const evaluateResolution = (userResolution: string, correctResolution: string) => {
        const userNormalized = normalizeCode(userResolution);
        const correctNormalized = normalizeCode(correctResolution);

        // Check if user removed conflict markers
        const hasConflictMarkers =
            userResolution.includes("<<<<<<<") ||
            userResolution.includes("=======") ||
            userResolution.includes(">>>>>>>");

        if (hasConflictMarkers) {
            return { isCorrect: false, points: 0, reason: "نشانه‌های تعارض هنوز حذف نشده‌اند" };
        }

        // Calculate similarity
        const similarity = calculateSimilarity(userNormalized, correctNormalized);

        if (similarity > 0.9) {
            return { isCorrect: true, points: 25, reason: "حل تعارض بی‌نقص!" };
        } else if (similarity > 0.7) {
            return { isCorrect: true, points: 15, reason: "حل تعارض خوب با تفاوت‌های جزئی" };
        } else if (similarity > 0.5) {
            return { isCorrect: true, points: 8, reason: "حل تعارض قابل قبول اما قابل بهبود" };
        } else {
            return { isCorrect: false, points: 0, reason: "حل تعارض با راه‌حل مورد انتظار یکی نیست" };
        }
    };

    const calculateSimilarity = (str1: string, str2: string) => {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const editDistance = levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    };

    const levenshteinDistance = (str1: string, str2: string): number => {
        const matrix: number[][] = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0]![j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i]![j] = matrix[i - 1]![j - 1]!;
                } else {
                    matrix[i]![j] = Math.min(
                        matrix[i - 1]![j - 1]! + 1,
                        matrix[i]![j - 1]! + 1,
                        matrix[i - 1]![j]! + 1,
                    );
                }
            }
        }

        return matrix[str2.length]![str1.length]!;
    };

    const handleSubmitResolution = () => {
        if (!resolution.trim()) return;

        const scenario = selectedScenarios[currentScenario];
        if (!scenario) return;

        const result = evaluateResolution(resolution, scenario.correctResolution);

        setScore(score + result.points);
        setFeedback({
            type: result.isCorrect ? "good" : "bad",
            message: result.reason,
        });

        setTimeout(() => {
            if (currentScenario < selectedScenarios.length - 1) {
                setCurrentScenario(currentScenario + 1);
                setResolution("");
                setFeedback({ type: null, message: "" });
                setShowHint(false);
            } else {
                endGame();
            }
        }, 3000);
    };

    const scenario = selectedScenarios[currentScenario];
    const difficultyLabel =
        {
            beginner: "مبتدی",
            advanced: "پیشرفته",
            pro: "حرفه‌ای",
        }[difficulty] ?? "مبتدی";

    if (!gameStarted) {
        return (
            <Card className="mx-auto max-w-md border-red-600 bg-red-900/20">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center text-xl text-red-400">
                        <GitMerge className="mr-2 h-6 w-6" />
                        استاد ادغام
                    </CardTitle>
                    <div className="absolute right-2 top-2">
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-purple-200">تعارض‌های ادغام را مثل یک توسعه‌دهنده حرفه‌ای حل کن!</p>
                    <p className="text-sm text-purple-300">
                        • سختی: {difficultyLabel}
                    </p>
                    <p className="text-sm text-purple-300">
                        • 3 تعارض • 2 دقیقه • نشانه‌ها را حذف کن و تعارض را رفع کن
                    </p>
                    <Button onClick={startGame} className="w-full bg-red-600 text-white hover:bg-red-700">
                        شروع بازی
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (gameEnded) {
        const finalScore = Math.max(0, score + Math.floor(timeLeft / 2));
        return (
            <Card className="mx-auto max-w-md border-red-600 bg-red-900/20">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center text-xl text-red-400">
                        <Trophy className="mr-2 h-6 w-6" />
                        بازی تمام شد!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <div className="space-y-2">
                        <p className="text-lg text-white">امتیاز نهایی: {finalScore}</p>
                        <p className="text-sm text-purple-200">امتیاز حل تعارض: {score}</p>
                        <p className="text-sm text-purple-200">امتیاز زمانی: {Math.floor(timeLeft / 2)}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={startGame}
                            variant="outline"
                            className="flex-1 border-red-600 text-red-300 hover:bg-red-900/50">
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
        <Card className="mx-auto max-w-4xl border-red-600 bg-red-900/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg text-red-400">
                        <GitMerge className="mr-2 h-5 w-5" />
                        استاد ادغام - در حال بازی
                    </CardTitle>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center text-purple-300">
                            <Timer className="mr-1 h-4 w-4" />
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                        </div>
                        <div className="text-purple-300">امتیاز: {score}</div>
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="mt-2">
                        <div className="flex text-sm text-purple-400">
                            تعارض {currentScenario + 1} از {selectedScenarios.length}
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-purple-900/30">
                        <div
                            className="h-full rounded-full bg-red-600 transition-all duration-300"
                            style={{ width: `${((currentScenario + 1) / selectedScenarios.length) * 100}%` }}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="mb-2 text-lg text-white">{scenario?.description}</h3>
                    <p className="mb-4 text-sm text-purple-300">
                        فایل:{" "}
                        <code className="rounded bg-purple-900/50 px-2 py-1 font-mono">{scenario?.conflictedFile}</code>
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                        <h4 className="text-md mb-2 text-purple-300">کد دارای تعارض:</h4>
                        <pre className="overflow-x-auto rounded-md border border-gray-700 bg-gray-900 p-4 text-sm text-gray-100">
                            <code>{scenario?.conflictContent}</code>
                        </pre>
                    </div>

                    <div>
                        <h4 className="text-md mb-2 text-purple-300">راه‌حل تو:</h4>
                        <textarea
                            value={resolution}
                            onChange={e => setResolution(e.target.value)}
                            placeholder="نشانه‌های تعارض را حذف کن و تعارض را حل کن..."
                            className="h-48 w-full resize-none rounded-md border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-gray-100"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={() => setShowHint(!showHint)}
                        variant="outline"
                        className="border-purple-700 text-purple-300 hover:bg-purple-900/50">
                        {showHint ? (
                            <ChevronDown className="mr-2 h-4 w-4" />
                        ) : (
                            <ChevronRight className="mr-2 h-4 w-4" />
                        )}
                        {showHint ? "پنهان کردن راهنما" : "نمایش راهنما"}
                    </Button>

                    <Button
                        onClick={handleSubmitResolution}
                        disabled={!resolution.trim() || feedback.type !== null}
                        className="bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-600">
                        ثبت راه‌حل
                    </Button>
                </div>

                {showHint && (
                    <div className="rounded-md border border-blue-700 bg-blue-900/30 p-4">
                        <p className="text-sm text-blue-300">
                            <strong>راهنما:</strong> نشانه‌های تعارض (&lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======,
                            &gt;&gt;&gt;&gt;&gt;&gt;&gt;) را حذف کن و بهترین راه‌حل را انتخاب کن. ببین کدام نسخه کامل‌تر
                            است، استانداردهای بهتری دارد یا قابلیت بیشتری اضافه می‌کند.
                        </p>
                    </div>
                )}

                {feedback.type && (
                    <div
                        className={`rounded-md p-4 text-center ${
                            feedback.type === "good"
                                ? "border border-green-700 bg-green-900/50"
                                : "border border-red-700 bg-red-900/50"
                        }`}>
                        <p className={`font-medium ${feedback.type === "good" ? "text-green-300" : "text-red-300"}`}>
                            {feedback.message}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
