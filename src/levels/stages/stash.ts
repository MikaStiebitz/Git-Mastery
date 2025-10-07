import {
    createLevel,
    createRequirement,
    createStory,
    createInitialState,
    createFileStructure,
    createGitState,
} from "../LevelCreator";

const stashLevel1 = createLevel({
    id: 1,
    name: "stash.level1.name",
    description: "stash.level1.description",
    objectives: ["stash.level1.objective1"],
    hints: ["stash.level1.hint1", "stash.level1.hint2"],
    requirements: [
        createRequirement({
            command: "git stash",
            description: "stash.level1.requirement1.description",
            successMessage: "stash.level1.requirement1.success",
        }),
        createRequirement({
            command: "git checkout",
            requiresArgs: ["hotfix"],
            description: "stash.level1.requirement2.description",
            successMessage: "stash.level1.requirement2.success",
        }),
        createRequirement({
            command: "git checkout",
            requiresArgs: ["feature"],
            description: "stash.level1.requirement3.description",
            successMessage: "stash.level1.requirement3.success",
        }),
        createRequirement({
            command: "git stash",
            requiresArgs: ["pop"],
            description: "stash.level1.requirement4.description",
            successMessage: "stash.level1.requirement4.success",
        }),
    ],
    story: createStory({
        title: "stash.level1.story.title",
        narrative: "stash.level1.story.narrative",
        realWorldContext: "stash.level1.story.realWorldContext",
        taskIntroduction: "stash.level1.story.taskIntroduction",
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/README.md", "# Project\n\nA web application."),
            createFileStructure("/src/app.js", "// Main application\nconsole.log('App running');"),
            createFileStructure("/src/feature.js", "// Feature in progress\n// TODO: Complete implementation"),
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "feature",
            branches: ["main", "feature", "hotfix"],
            commits: [
                {
                    message: "Initial commit",
                    files: ["/README.md", "/src/app.js"],
                    branch: "main",
                },
                {
                    message: "Start feature work",
                    files: ["/src/feature.js"],
                    branch: "feature",
                },
                {
                    message: "Hotfix branch created",
                    files: [],
                    branch: "hotfix",
                },
                {
                    message: "",
                    files: [],
                    branch: "feature",
                },
            ],
            fileChanges: [
                {
                    path: "/src/feature.js",
                    status: "modified",
                    content: "// Feature in progress\nfunction newFeature() {\n  // Work in progress\n  return 'incomplete';\n}",
                },
            ],
        }),
    }),
});

const stashLevel2 = createLevel({
    id: 2,
    name: "stash.level2.name",
    description: "stash.level2.description",
    objectives: ["stash.level2.objective1"],
    hints: ["stash.level2.hint1", "stash.level2.hint2", "stash.level2.hint3"],
    requirements: [
        createRequirement({
            command: "git stash",
            description: "stash.level2.requirement1.description",
            successMessage: "stash.level2.requirement1.success",
        }),
        createRequirement({
            command: "git checkout",
            requiresArgs: ["main"],
            description: "stash.level2.requirement2.description",
            successMessage: "stash.level2.requirement2.success",
        }),
        createRequirement({
            command: "git checkout",
            requiresArgs: ["-b", "feature/new-task"],
            description: "stash.level2.requirement3.description",
            successMessage: "stash.level2.requirement3.success",
        }),
        createRequirement({
            command: "git checkout",
            requiresArgs: ["feature/old-task"],
            description: "stash.level2.requirement4.description",
            successMessage: "stash.level2.requirement4.success",
        }),
        createRequirement({
            command: "git stash",
            requiresArgs: ["pop"],
            description: "stash.level2.requirement5.description",
            successMessage: "stash.level2.requirement5.success",
        }),
    ],
    story: createStory({
        title: "stash.level2.story.title",
        narrative: "stash.level2.story.narrative",
        realWorldContext: "stash.level2.story.realWorldContext",
        taskIntroduction: "stash.level2.story.taskIntroduction",
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/README.md", "# Multi-Task Project\n\nJuggling multiple features."),
            createFileStructure("/src/app.js", "// Main application\nconsole.log('App');"),
            createFileStructure("/src/task.js", "// Current task\nfunction task() { return 'working'; }"),
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "feature/old-task",
            branches: ["main", "feature/old-task"],
            commits: [
                {
                    message: "Initial setup",
                    files: ["/README.md", "/src/app.js"],
                    branch: "main",
                },
                {
                    message: "Start old task",
                    files: ["/src/task.js"],
                    branch: "feature/old-task",
                },
            ],
            fileChanges: [
                {
                    path: "/src/task.js",
                    status: "modified",
                    content: "// Current task\nfunction task() {\n  // Half-done work\n  return 'incomplete';\n}",
                },
            ],
        }),
    }),
});

const stashLevel3 = createLevel({
    id: 3,
    name: "stash.level3.name",
    description: "stash.level3.description",
    objectives: ["stash.level3.objective1"],
    hints: ["stash.level3.hint1", "stash.level3.hint2"],
    requirements: [
        createRequirement({
            command: "git stash",
            requiresArgs: ["list"],
            description: "stash.level3.requirement1.description",
            successMessage: "stash.level3.requirement1.success",
        }),
        createRequirement({
            command: "git stash",
            requiresArgs: ["pop"],
            description: "stash.level3.requirement2.description",
            successMessage: "stash.level3.requirement2.success",
        }),
    ],
    story: createStory({
        title: "stash.level3.story.title",
        narrative: "stash.level3.story.narrative",
        realWorldContext: "stash.level3.story.realWorldContext",
        taskIntroduction: "stash.level3.story.taskIntroduction",
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/README.md", "# Stash Management\n\nLearning stash commands."),
            createFileStructure("/src/code.js", "// Code file\nfunction code() { return 'clean'; }"),
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            branches: ["main"],
            commits: [
                {
                    message: "Initial commit",
                    files: ["/README.md", "/src/code.js"],
                },
            ],
            fileChanges: [
                {
                    path: "/src/code.js",
                    status: "modified",
                    content: "// Code file\nfunction code() {\n  // Modified\n  return 'changed';\n}",
                },
            ],
        }),
    }),
});

export const stashLevels = {
    1: stashLevel1,
    2: stashLevel2,
    3: stashLevel3,
};
