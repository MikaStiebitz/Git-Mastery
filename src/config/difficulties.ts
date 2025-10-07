import type { DifficultyConfig } from "~/types";

export const difficulties: DifficultyConfig[] = [
  {
    id: "beginner",
    name: "Beginner",
    description: "Learn Git basics",
    icon: "🌱",
    color: "green",
    stages: ["Intro", "Files", "Branches", "Remote"],
    maxPoints: 140,
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Master advanced Git workflows",
    icon: "⚡",
    color: "yellow",
    stages: ["Merge", "Workflow", "TeamWork", "Reset", "Stash"],
    maxPoints: 150,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Expert Git techniques",
    icon: "🚀",
    color: "blue",
    stages: ["Rebase", "Advanced", "Archaeology", "Mastery"],
    maxPoints: 140,
  },
];

export const getAvailableStagesForDifficulty = (difficulty: DifficultyConfig["id"]): string[] => {
    const config = difficulties.find(d => d.id === difficulty);
    return config?.stages || [];
};

export const getDifficultyConfig = (difficulty: DifficultyConfig["id"]): DifficultyConfig | null => {
    return difficulties.find(d => d.id === difficulty) || null;
};
