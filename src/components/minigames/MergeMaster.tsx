"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { GitMerge, Timer, Trophy, X, ChevronDown, ChevronRight, Copy, CheckCircle, XCircle } from "lucide-react";

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
        description: "Two developers modified the same line in a config file",
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
        description: "Conflicting version numbers in package.json",
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
        description: "Function implementation conflict with different approaches",
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
        description: "CSS styling conflict between different layout approaches",
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
        description: "Complex merge with multiple conflicting sections",
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

// Git's own conflict markers, called out in coral so the thing the player has to remove is
// the loudest line in the block.
const CONFLICT_MARKER = /^(<<<<<<<|=======|>>>>>>>)/;

function ConflictCode({ content }: { content: string }) {
    return (
        <pre className="gm-inset gm-scroll h-56 overflow-auto p-4 [font-family:var(--font-code)] text-sm leading-relaxed sm:h-64">
            <code className="text-gm-ink-soft">
                {content.split("\n").map((line, i) => (
                    <span key={i} className={`block ${CONFLICT_MARKER.test(line) ? "text-gm-coral font-bold" : ""}`}>
                        {line === "" ? " " : line}
                    </span>
                ))}
            </code>
        </pre>
    );
}

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
            return { isCorrect: false, points: 0, reason: "Conflict markers still present" };
        }

        // Calculate similarity
        const similarity = calculateSimilarity(userNormalized, correctNormalized);

        if (similarity > 0.9) {
            return { isCorrect: true, points: 25, reason: "Perfect resolution!" };
        } else if (similarity > 0.7) {
            return { isCorrect: true, points: 15, reason: "Good resolution with minor differences" };
        } else if (similarity > 0.5) {
            return { isCorrect: true, points: 8, reason: "Reasonable resolution but could be improved" };
        } else {
            return { isCorrect: false, points: 0, reason: "Resolution doesn't match the expected solution" };
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

    const handleCopyConflictedCode = () => {
        const scenario = selectedScenarios[currentScenario];
        if (scenario) {
            setResolution(scenario.conflictContent);
        }
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
    // The clock only turns coral once it is genuinely about to run out.
    const timeCritical = timeLeft <= 15;

    if (!gameStarted) {
        return (
            <div className="mx-auto flex w-full max-w-md flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-gm-ink flex min-w-0 items-center gap-2.5 text-2xl [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                        <GitMerge className="text-gm-coral h-6 w-6 shrink-0" aria-hidden="true" />
                        Merge Master
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
                <p className="text-gm-ink-soft">Resolve merge conflicts like a pro developer!</p>
                <div className="gm-inset flex flex-col gap-1.5 p-4">
                    <p className="text-gm-ink-dim text-sm">
                        • Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </p>
                    <p className="text-gm-ink-dim text-sm">
                        • 3 conflicts • 2 minutes • Remove markers and fix conflicts
                    </p>
                </div>
                <Button onClick={startGame} size="lg" className="w-full">
                    Start Game
                </Button>
            </div>
        );
    }

    if (gameEnded) {
        const finalScore = Math.max(0, score + Math.floor(timeLeft / 2));
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
                    <p className="text-gm-ink-soft text-sm">Resolution Points: {score}</p>
                    <p className="text-gm-ink-soft text-sm">Time Bonus: {Math.floor(timeLeft / 2)} points</p>
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
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
            {/* HUD: name, clock, score — inset so it never reads as a card inside the dialog */}
            <div className="gm-inset flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5">
                <h2 className="text-gm-ink flex min-w-0 items-center gap-2 font-bold">
                    <GitMerge className="text-gm-coral h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">Merge Master - Playing</span>
                </h2>
                <div className="flex items-center gap-3">
                    <span
                        className={`flex items-center gap-1.5 text-sm tabular-nums ${
                            timeCritical ? "text-gm-coral" : "text-gm-ink-soft"
                        }`}>
                        <Timer className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
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
                    Conflict {currentScenario + 1} of {selectedScenarios.length}
                </p>
                <div className="border-gm-line bg-gm-void mt-1.5 h-2.5 w-full overflow-hidden rounded-full border-2">
                    <div
                        className="bg-gm-lime h-full transition-[width] duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none"
                        style={{ width: `${((currentScenario + 1) / selectedScenarios.length) * 100}%` }}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-gm-ink mb-2 text-lg [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                    {scenario?.description}
                </h3>
                <p className="text-gm-ink-dim text-sm">
                    File:{" "}
                    <code className="border-gm-line bg-gm-void text-gm-ink rounded-[0.5rem] border-2 px-2 py-0.5 [font-family:var(--font-code)] [overflow-wrap:anywhere]">
                        {scenario?.conflictedFile}
                    </code>
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="flex min-w-0 flex-col">
                    <div className="mb-2 flex min-h-11 items-center">
                        <h4 className="text-gm-ink-soft text-sm font-semibold">Conflicted Code:</h4>
                    </div>
                    <ConflictCode content={scenario?.conflictContent ?? ""} />
                </div>

                <div className="flex min-w-0 flex-col">
                    <div className="mb-2 flex min-h-11 flex-wrap items-center justify-between gap-2">
                        <h4 id="merge-resolution-label" className="text-gm-ink-soft text-sm font-semibold">
                            Your Resolution:
                        </h4>
                        <Button
                            onClick={handleCopyConflictedCode}
                            variant="outline"
                            size="sm"
                            title="Copy conflicted code to resolution field">
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                            Copy Conflicted Code
                        </Button>
                    </div>
                    <Textarea
                        aria-labelledby="merge-resolution-label"
                        value={resolution}
                        onChange={e => setResolution(e.target.value)}
                        placeholder="Remove conflict markers and resolve the conflict..."
                        className="h-56 resize-none p-4 [font-family:var(--font-code)] text-sm sm:h-64"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button onClick={() => setShowHint(!showHint)} variant="outline" aria-expanded={showHint}>
                    {showHint ? (
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    ) : (
                        <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                    )}
                    {showHint ? "Hide Hint" : "Show Hint"}
                </Button>

                <Button
                    onClick={handleSubmitResolution}
                    disabled={!resolution.trim() || feedback.type !== null}
                    className="flex-1 sm:flex-none">
                    Submit Resolution
                </Button>
            </div>

            {showHint && (
                <div className="border-gm-cyan-edge bg-gm-cyan/12 rounded-[0.85rem] border-2 p-4">
                    <p className="text-gm-ink-soft text-sm">
                        <strong className="text-gm-ink">Hint:</strong> Remove the conflict markers
                        (&lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======, &gt;&gt;&gt;&gt;&gt;&gt;&gt;) and choose the best
                        solution. Consider which version is more complete, follows better practices, or provides
                        enhanced functionality.
                    </p>
                </div>
            )}

            {feedback.type && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`rounded-[0.85rem] border-2 p-4 text-center ${
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
                </div>
            )}
        </div>
    );
}
