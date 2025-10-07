import {
    createLevel,
    createRequirement,
    createStory,
    createInitialState,
    createFileStructure,
    createGitState,
} from "../LevelCreator";

// Level 1: git reset --soft (zurück zu einem vorherigen Commit, aber Änderungen bleiben staged)
const resetLevel1 = createLevel({
    id: 1,
    name: "reset.level1.name",
    description: "reset.level1.description",
    objectives: ["reset.level1.objective1"],
    hints: ["reset.level1.hint1", "reset.level1.hint2"],
    requirements: [
        createRequirement({
            command: "git reset",
            requiresArgs: ["--soft"],
            description: "reset.level1.requirement1.description",
            successMessage: "reset.level1.requirement1.success",
        }),
    ],
    story: createStory({
        title: "reset.level1.story.title",
        narrative: "reset.level1.story.narrative",
        realWorldContext: "reset.level1.story.realWorldContext",
        taskIntroduction: "reset.level1.story.taskIntroduction",
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/README.md", "# Reset Project\n\nLearning about git reset."),
            createFileStructure("/src/app.js", 'console.log("Version 1");'),
            createFileStructure("/src/config.js", 'module.exports = { version: 1 };'),
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            commits: [
                {
                    message: "Initial commit",
                    files: ["/README.md"],
                },
                {
                    message: "Add app.js",
                    files: ["/src/app.js"],
                },
                {
                    message: "Add config.js - Wrong config!",
                    files: ["/src/config.js"],
                },
            ],
        }),
    }),
});

// Level 2: git reset --hard (alles wird verworfen)
const resetLevel2 = createLevel({
    id: 2,
    name: "reset.level2.name",
    description: "reset.level2.description",
    objectives: ["reset.level2.objective1"],
    hints: ["reset.level2.hint1", "reset.level2.hint2", "reset.level2.hint3"],
    requirements: [
        createRequirement({
            command: "git reset",
            requiresArgs: ["--hard"],
            description: "reset.level2.requirement1.description",
            successMessage: "reset.level2.requirement1.success",
        }),
    ],
    story: createStory({
        title: "reset.level2.story.title",
        narrative: "reset.level2.story.narrative",
        realWorldContext: "reset.level2.story.realWorldContext",
        taskIntroduction: "reset.level2.story.taskIntroduction",
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/README.md", "# Reset Project\n\nLearning about git reset."),
            createFileStructure("/src/app.js", 'console.log("Broken version!");'),
            createFileStructure("/src/buggy.js", 'console.error("This should not exist!");'),
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            commits: [
                {
                    message: "Initial commit",
                    files: ["/README.md"],
                },
                {
                    message: "Working version",
                    files: ["/src/app.js"],
                },
                {
                    message: "Buggy version - contains bugs!",
                    files: ["/src/app.js", "/src/buggy.js"],
                },
            ],
        }),
    }),
});

// Level 3: git reset mit Commit-Hash
const resetLevel3 = createLevel({
    id: 3,
    name: "reset.level3.name",
    description: "reset.level3.description",
    objectives: ["reset.level3.objective1"],
    hints: ["reset.level3.hint1", "reset.level3.hint2"],
    requirements: [
        createRequirement({
            command: "git reset",
            description: "reset.level3.requirement1.description",
            successMessage: "reset.level3.requirement1.success",
        }),
    ],
    story: createStory({
        title: "reset.level3.story.title",
        narrative: "reset.level3.story.narrative",
        realWorldContext: "reset.level3.story.realWorldContext",
        taskIntroduction: "reset.level3.story.taskIntroduction",
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/README.md", "# Reset Project\n\nLearning about git reset."),
            createFileStructure("/src/app.js", 'console.log("Version 3 - Bad");'),
            createFileStructure("/src/feature.js", 'console.log("Incomplete feature");'),
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            commits: [
                {
                    message: "Initial commit",
                    files: ["/README.md"],
                },
                {
                    message: "Version 2 - Good version",
                    files: ["/src/app.js"],
                },
                {
                    message: "Version 3 - Experimental",
                    files: ["/src/app.js", "/src/feature.js"],
                },
            ],
        }),
    }),
});

export const resetLevels = {
    1: resetLevel1,
    2: resetLevel2,
    3: resetLevel3,
};
