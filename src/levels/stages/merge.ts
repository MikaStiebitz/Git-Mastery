import {
    createLevel,
    createRequirement,
    createStory,
    createInitialState,
    createFileStructure,
    createGitState,
    createMergeConflictContent,
} from "../LevelCreator";

const mergeLevel1 = createLevel({
    id: 1,
    name: "merge.level1.name",
    description: "merge.level1.description",
    objectives: ["merge.level1.objective1"],
    hints: ["merge.level1.hint1", "merge.level1.hint2"],
    requirements: [
        createRequirement({
            command: "git merge",
            requiresArgs: ["any"],
            description: "merge.level1.requirement1.description",
            successMessage: "merge.level1.requirement1.success",
        }),
    ],
    story: createStory({
        title: "merge.level1.story.title",
        narrative: "merge.level1.story.narrative",
        realWorldContext: "merge.level1.story.realWorldContext",
        taskIntroduction: "merge.level1.story.taskIntroduction",
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/README.md", "# Team Project\n\nA collaborative project with proper Git workflow."),
            createFileStructure("/src/app.js", 'console.log("App running");'),
            createFileStructure("/src/feature.js", 'console.log("New feature");'),
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "develop",
            branches: ["main", "develop", "feature/user-auth"],
            commits: [
                // Initial commit on main
                {
                    message: "Initial project setup",
                    files: ["/README.md", "/src/app.js"],
                    branch: "main",
                },
                // Create develop branch
                {
                    message: "Create develop branch",
                    files: [],
                    branch: "develop",
                },
                // Feature branch with new feature
                {
                    message: "Add user authentication feature",
                    files: ["/src/feature.js"],
                    branch: "feature/user-auth",
                },
                // Switch back to develop for merge
                {
                    message: "",
                    files: [],
                    branch: "develop",
                },
            ],
        }),
    }),
});

const mergeLevel2 = createLevel({
    id: 2,
    name: "merge.level2.name",
    description: "merge.level2.description",
    objectives: ["merge.level2.objective1"],
    hints: ["merge.level2.hint1", "merge.level2.hint2"],
    requirements: [
        createRequirement({
            command: "git merge",
            requiresArgs: ["any"],
            description: "merge.level2.requirement1.description",
            successMessage: "merge.level2.requirement1.success",
        }),
    ],
    story: createStory({
        title: "merge.level2.story.title",
        narrative: "merge.level2.story.narrative",
        realWorldContext: "merge.level2.story.realWorldContext",
        taskIntroduction: "merge.level2.story.taskIntroduction",
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/README.md", "# Team Project\n\nA collaborative project with proper Git workflow."),
            createFileStructure("/src/app.js", 'console.log("App running");'),
            createFileStructure("/src/feature.js", 'console.log("New feature");'),
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            branches: ["main", "develop"],
            commits: [
                // Initial commit on main
                {
                    message: "Initial project setup",
                    files: ["/README.md", "/src/app.js"],
                    branch: "main",
                },
                // Develop branch with tested feature
                {
                    message: "Add tested user authentication",
                    files: ["/src/feature.js"],
                    branch: "develop",
                },
                // Back to main for production merge
                {
                    message: "",
                    files: [],
                    branch: "main",
                },
            ],
        }),
    }),
});

const mergeLevel3 = createLevel({
    id: 3,
    name: "merge.level3.name",
    description: "merge.level3.description",
    objectives: ["merge.level3.objective1"],
    hints: ["merge.level3.hint1", "merge.level3.hint2"],
    requirements: [
        createRequirement({
            command: "git merge",
            requiresArgs: ["--abort"],
            description: "merge.level3.requirement1.description",
            successMessage: "merge.level3.requirement1.success",
        }),
    ],
    story: createStory({
        title: "merge.level3.story.title",
        narrative: "merge.level3.story.narrative",
        realWorldContext: "merge.level2.story.realWorldContext",
        taskIntroduction: "merge.level2.story.taskIntroduction",
    }),
    initialState: createInitialState({
        files: [
            createFileStructure(
                "/README.md",
                "# Merge Conflict Project\n\nA project for learning about merge conflicts.",
            ),
            createFileStructure("/src/main.js", 'console.log("Main branch");'),
            // This file will be different in both branches
            createFileStructure(
                "/src/config.js",
                '// Configuration file\nconst config = {\n  port: 3000,\n  host: "localhost",\n  debug: true\n};\n\nmodule.exports = config;',
            ),
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            branches: ["main", "feature"],
            commits: [
                // Initial commit on main
                {
                    message: "Initial commit",
                    files: ["/README.md", "/src/main.js", "/src/config.js"],
                },
                // Change to config.js on the feature branch
                {
                    message: "Update config for production",
                    files: ["/src/config.js"],
                    branch: "feature",
                },
                // Change to config.js on the main branch
                {
                    message: "Update config for debugging",
                    files: ["/src/config.js"],
                    branch: "main",
                },
            ],
            // Simulate merge conflict
            mergeConflicts: [
                {
                    file: "/src/config.js",
                    content: createMergeConflictContent(
                        '// Configuration file\nconst config = {\n  port: 3000,\n  host: "localhost",\n  debug: true\n};\n\nmodule.exports = config;',
                        '// Configuration file\nconst config = {\n  port: 8080,\n  host: "example.com",\n  debug: false\n};\n\nmodule.exports = config;',
                    ),
                    branch1: "main",
                    branch2: "feature",
                },
            ],
        }),
    }),
});

export const mergeLevels = {
    1: mergeLevel1,
    2: mergeLevel2,
    3: mergeLevel3,
};
