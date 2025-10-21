"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-gray-700 bg-gray-900 [&>button]:text-white [&>button]:hover:text-gray-300">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <Settings className="h-5 w-5 text-purple-400" />
                        Debug Mode - Developer Tools
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="navigation" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 border-gray-600 bg-gray-800">
                        <TabsTrigger
                            value="navigation"
                            className="text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            Navigation
                        </TabsTrigger>
                        <TabsTrigger
                            value="resources"
                            className="text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            Resources
                        </TabsTrigger>
                        <TabsTrigger
                            value="progress"
                            className="text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            Progress
                        </TabsTrigger>
                        <TabsTrigger
                            value="actions"
                            className="text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            Actions
                        </TabsTrigger>
                    </TabsList>

                    {/* Navigation Tab */}
                    <TabsContent value="navigation" className="space-y-4">
                        <Card className="border-gray-600 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Target className="h-4 w-4 text-purple-400" />
                                    Level Navigation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="stage-select" className="text-gray-300">
                                            Stage
                                        </Label>
                                        <select
                                            id="stage-select"
                                            value={selectedStage}
                                            onChange={e => {
                                                setSelectedStage(e.target.value);
                                                setSelectedLevel(1);
                                            }}
                                            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-purple-500 focus:ring-purple-500">
                                            {availableStages.map(stage => (
                                                <option key={stage} value={stage} className="bg-gray-700">
                                                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="level-select" className="text-gray-300">
                                            Level
                                        </Label>
                                        <select
                                            id="level-select"
                                            value={selectedLevel}
                                            onChange={e => setSelectedLevel(parseInt(e.target.value))}
                                            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-purple-500 focus:ring-purple-500">
                                            {availableLevels[selectedStage]?.map(level => (
                                                <option key={level} value={level} className="bg-gray-700">
                                                    Level {level}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleNavigate}
                                    className="w-full bg-purple-600 text-white hover:bg-purple-700">
                                    <Play className="mr-2 h-4 w-4" />
                                    Navigate to Level
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Resources Tab */}
                    <TabsContent value="resources" className="space-y-4">
                        <Card className="border-gray-600 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <DollarSign className="h-4 w-4 text-purple-400" />
                                    Give Resources
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white">
                                <div>
                                    <Label htmlFor="money-amount" className="text-gray-300">
                                        Money Amount
                                    </Label>
                                    <Input
                                        id="money-amount"
                                        type="number"
                                        value={moneyAmount}
                                        onChange={e => setMoneyAmount(parseInt(e.target.value) || 0)}
                                        placeholder="Enter amount"
                                        className="border-gray-600 bg-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setMoneyAmount(100)}
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        100
                                    </Button>
                                    <Button
                                        onClick={() => setMoneyAmount(1000)}
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        1,000
                                    </Button>
                                    <Button
                                        onClick={() => setMoneyAmount(10000)}
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        10,000
                                    </Button>
                                </div>
                                <Button
                                    onClick={handleGiveMoney}
                                    className="w-full bg-purple-600 text-white hover:bg-purple-700">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Give Money
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Progress Tab */}
                    <TabsContent value="progress" className="space-y-4">
                        <Card className="border-gray-600 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Unlock className="h-4 w-4 text-purple-400" />
                                    Level Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white">
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={onUnlockAllLevels}
                                        className="w-full bg-green-600 text-white hover:bg-green-700">
                                        <Unlock className="mr-2 h-4 w-4" />
                                        Unlock All Levels
                                    </Button>
                                    <Button
                                        onClick={onLockAllLevels}
                                        variant="destructive"
                                        className="w-full bg-red-600 text-white hover:bg-red-700">
                                        <Lock className="mr-2 h-4 w-4" />
                                        Lock All Levels
                                    </Button>
                                </div>
                                <div className="text-sm text-gray-300">
                                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                                        Current: {currentStage} Level {currentLevel}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Actions Tab */}
                    <TabsContent value="actions" className="space-y-4">
                        <Card className="border-gray-600 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Zap className="h-4 w-4 text-purple-400" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white">
                                <Button
                                    onClick={onCompleteCurrentLevel}
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700">
                                    <Play className="mr-2 h-4 w-4" />
                                    Complete Current Level
                                </Button>
                                <Button
                                    onClick={onResetProgress}
                                    variant="destructive"
                                    className="w-full bg-red-600 text-white hover:bg-red-700">
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset All Progress
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
