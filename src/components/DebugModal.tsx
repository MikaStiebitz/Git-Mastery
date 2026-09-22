"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Settings, Play, DollarSign, Unlock, Lock, RotateCcw, Zap, Target } from "lucide-react";

interface DebugModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigateToLevel: (stage: string, level: number) => void;
    onGiveMoney: (amount: number) => void;
    onUnlockAllLevels: () => void;
    onLockAllLevels: () => void;
    onResetProgress: () => void;
    onCompleteCurrentLevel: () => void;
    currentStage?: string;
    currentLevel?: number;
    availableStages: string[];
    availableLevels: { [stage: string]: number[] };
}

export function DebugModal({
    isOpen,
    onClose,
    onNavigateToLevel,
    onGiveMoney,
    onUnlockAllLevels,
    onLockAllLevels,
    onResetProgress,
    onCompleteCurrentLevel,
    currentStage,
    currentLevel,
    availableStages,
    availableLevels,
}: DebugModalProps) {
    const [selectedStage, setSelectedStage] = useState(currentStage || "intro");
    const [selectedLevel, setSelectedLevel] = useState(currentLevel || 1);
    const [moneyAmount, setMoneyAmount] = useState(1000);

    const handleNavigate = () => {
        onNavigateToLevel(selectedStage, selectedLevel);
        onClose();
    };

    const handleGiveMoney = () => {
        onGiveMoney(moneyAmount);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="text-gm-grape-hi h-5 w-5 shrink-0" aria-hidden="true" />
                        Debug Mode - Developer Tools
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="navigation" className="mt-5 w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                        <TabsTrigger value="navigation">Navigation</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>

                    {/* Navigation Tab */}
                    <TabsContent value="navigation">
                        <section className="gm-inset space-y-4 p-4">
                            <h3 className="text-gm-ink flex items-center gap-2 font-bold">
                                <Target className="text-gm-grape-hi h-4 w-4 shrink-0" aria-hidden="true" />
                                Level Navigation
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="stage-select">Stage</Label>
                                    <select
                                        id="stage-select"
                                        value={selectedStage}
                                        onChange={e => {
                                            setSelectedStage(e.target.value);
                                            setSelectedLevel(1);
                                        }}
                                        className="gm-field h-11">
                                        {availableStages.map(stage => (
                                            <option key={stage} value={stage}>
                                                {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="level-select">Level</Label>
                                    <select
                                        id="level-select"
                                        value={selectedLevel}
                                        onChange={e => setSelectedLevel(parseInt(e.target.value))}
                                        className="gm-field h-11">
                                        {availableLevels[selectedStage]?.map(level => (
                                            <option key={level} value={level}>
                                                Level {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <Button onClick={handleNavigate} className="w-full">
                                <Play className="h-4 w-4" aria-hidden="true" />
                                Navigate to Level
                            </Button>
                        </section>
                    </TabsContent>

                    {/* Resources Tab */}
                    <TabsContent value="resources">
                        <section className="gm-inset space-y-4 p-4">
                            <h3 className="text-gm-ink flex items-center gap-2 font-bold">
                                <DollarSign className="text-gm-gold h-4 w-4 shrink-0" aria-hidden="true" />
                                Give Resources
                            </h3>
                            <div className="space-y-1.5">
                                <Label htmlFor="money-amount">Money Amount</Label>
                                <Input
                                    id="money-amount"
                                    type="number"
                                    value={moneyAmount}
                                    onChange={e => setMoneyAmount(parseInt(e.target.value) || 0)}
                                    placeholder="Enter amount"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={() => setMoneyAmount(100)} variant="outline" size="sm">
                                    100
                                </Button>
                                <Button onClick={() => setMoneyAmount(1000)} variant="outline" size="sm">
                                    1,000
                                </Button>
                                <Button onClick={() => setMoneyAmount(10000)} variant="outline" size="sm">
                                    10,000
                                </Button>
                            </div>
                            <Button onClick={handleGiveMoney} variant="secondary" className="w-full">
                                <DollarSign className="h-4 w-4" aria-hidden="true" />
                                Give Money
                            </Button>
                        </section>
                    </TabsContent>

                    {/* Progress Tab */}
                    <TabsContent value="progress">
                        <section className="gm-inset space-y-4 p-4">
                            <h3 className="text-gm-ink flex items-center gap-2 font-bold">
                                <Unlock className="text-gm-grape-hi h-4 w-4 shrink-0" aria-hidden="true" />
                                Level Management
                            </h3>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Button onClick={onUnlockAllLevels} className="w-full">
                                    <Unlock className="h-4 w-4" aria-hidden="true" />
                                    Unlock All Levels
                                </Button>
                                <Button onClick={onLockAllLevels} variant="destructive" className="w-full">
                                    <Lock className="h-4 w-4" aria-hidden="true" />
                                    Lock All Levels
                                </Button>
                            </div>
                            <Badge variant="outline">
                                Current: {currentStage} Level {currentLevel}
                            </Badge>
                        </section>
                    </TabsContent>

                    {/* Actions Tab */}
                    <TabsContent value="actions">
                        <section className="gm-inset space-y-4 p-4">
                            <h3 className="text-gm-ink flex items-center gap-2 font-bold">
                                <Zap className="text-gm-grape-hi h-4 w-4 shrink-0" aria-hidden="true" />
                                Quick Actions
                            </h3>
                            <Button onClick={onCompleteCurrentLevel} className="w-full">
                                <Play className="h-4 w-4" aria-hidden="true" />
                                Complete Current Level
                            </Button>
                            <Button onClick={onResetProgress} variant="destructive" className="w-full">
                                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                                Reset All Progress
                            </Button>
                        </section>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
