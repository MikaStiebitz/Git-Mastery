import {
    createLevel,
    createStory,
    createInitialState,
    createFileStructure,
    createGitState,
} from "../LevelCreator";

const workflowLevel1 = createLevel({
    id: 1,
    name: "Feature Branch Workflow",
    description: "Learn the industry-standard feature branch workflow used by teams worldwide",
    objectives: [
        "Create a feature branch from main",
        "Make commits with descriptive messages",
        "Push your feature branch to remote",
        "Merge your feature branch back to main"
    ],
    hints: [
        "Start by creating a feature branch: 'git switch -c feature/user-auth'",
        "You can also use 'git checkout -b feature/user-auth' - both work!",
        "Modify the auth.js file, then use 'git add' to stage your changes",
        "Commit with: 'git commit'",
        "Push to remote: 'git push origin feature/user-auth'",
        "Switch back to main: 'git switch main'",
        "Finally merge: 'git merge feature/user-auth'"
    ],
    requirementLogic: "all",
    requirements: [
        {
            id: "create-feature-branch",
            command: "git switch -c",
            alternativeCommands: ["git checkout -b"],
            description: "Create a new feature branch (use 'git switch -c <branch>' OR 'git checkout -b <branch>')",
            successMessage: "Feature branch created successfully!"
        },
        {
            id: "stage-changes",
            command: "git add",
            description: "Stage your changes (modify a file first!)",
            successMessage: "Changes staged!"
        },
        {
            id: "commit-changes",
            command: "git commit -m",
            requiresArgs: ["any"],
            description: "Commit your changes with a descriptive message",
            successMessage: "Changes committed!"
        },
        {
            id: "push-feature",
            command: "git push",
            requiresArgs: ["origin"],
            description: "Push your feature branch to remote (git push origin <your-branch>)",
            successMessage: "Feature branch pushed to remote!"
        },
        {
            id: "switch-to-main",
            command: "git switch",
            alternativeCommands: ["git checkout"],
            requiresArgs: ["main"],
            description: "Switch back to main branch (use 'git switch main' OR 'git checkout main')",
            successMessage: "Switched to main branch!"
        },
        {
            id: "merge-feature",
            command: "git merge",
            description: "Merge your feature branch into main",
            successMessage: "Feature successfully merged! This is how real teams integrate new features."
        }
    ],
    story: createStory({
        title: "The Feature Factory",
        narrative: `You're a developer at TechCorp, and the team follows strict Git workflows. Your manager Sarah just assigned you a new feature: implementing user authentication.

"Remember," Sarah says, "we never commit directly to main. Always use feature branches, and make sure your commits tell a story."

**What's a Feature Branch?**
A feature branch is a separate branch where you develop a new feature in isolation. This allows you to:
- Work without affecting the stable main branch
- Get code reviewed before merging
- Easily abandon or modify work without impacting others

**Modern Best Practice:**
You can use either command to create a branch:
- \`git switch -c feature/user-auth\` (modern, recommended)
- \`git checkout -b feature/user-auth\` (traditional, also works)

Both do the exact same thing! We'll accept either command in this level.

**The Complete Workflow:**
1. Create a feature branch from main
2. Make changes to files and stage them with \`git add\`
3. Commit changes with descriptive messages
4. Push your branch to remote: \`git push origin feature/user-auth\`
5. Switch back to main: \`git switch main\` (or \`git checkout main\`)
6. Merge the feature: \`git merge feature/user-auth\`

**What are Pull Requests (PRs)?**
In real teams, after step 4 (pushing your branch), you'd create a **Pull Request** on GitHub/GitLab instead of merging directly:

**Pull Request Workflow:**
1. You push your feature branch to the remote repository
2. On GitHub/GitLab, you open a Pull Request from \`feature/user-auth\` to \`main\`
3. Your teammates receive a notification
4. They review your code, leave comments, and suggest improvements
5. You make changes based on feedback and push again
6. Once approved, someone merges the PR into main
7. Your feature is now part of the main codebase!

**Why Pull Requests Matter:**
- **Code Quality**: Multiple eyes catch bugs and suggest improvements
- **Knowledge Sharing**: Team learns about changes before they go live
- **Documentation**: PR descriptions explain WHY changes were made
- **Discussion**: Complex decisions are discussed and recorded
- **Safety**: Prevents broken code from reaching production

In this level, we're simulating the workflow by having you push and merge directly to learn the Git commands. In real projects, you'd always use Pull Requests for team collaboration!`,
        realWorldContext: "Feature branch workflow is the industry standard. Developers create isolated branches, push them to remote repos (GitHub/GitLab), create Pull Requests for code review, and merge after approval. This collaborative approach prevents unstable code from reaching production and improves code quality through peer review.",
        taskIntroduction: "Master the complete feature branch workflow: create, commit, push, and merge. This is how professional teams ship features every day."
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/README.md", "# TechCorp Project\n\nA cutting-edge web application."),
            createFileStructure("/src/app.js", "// Main application file\nconsole.log('App starting...');"),
            createFileStructure("/src/auth.js", "// TODO: Add user authentication"),
            createFileStructure("/package.json", '{\n  "name": "techcorp-app",\n  "version": "1.0.0"\n}')
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            branches: ["main"],
            commits: [
                {
                    message: "Initial project setup",
                    files: ["/README.md", "/src/app.js", "/src/auth.js", "/package.json"]
                }
            ],
            fileChanges: [
                {
                    path: "/src/auth.js",
                    status: "modified",
                    content: "// User authentication module\nfunction login(username, password) {\n  // Authentication logic here\n  return true;\n}"
                }
            ]
        })
    })
});

const workflowLevel2 = createLevel({
    id: 2,
    name: "Hotfix Workflow",
    description: "Handle urgent production fixes with the hotfix workflow",
    objectives: [
        "Create a hotfix branch from main",
        "Fix a critical bug",
        "Merge hotfix back to main and develop",
        "Tag the hotfix release"
    ],
    hints: [
        "Hotfixes branch directly from main/master",
        "Use descriptive hotfix names like 'hotfix/critical-security-patch'",
        "Hotfixes should be merged back to both main and develop branches",
        "Always tag hotfix releases for tracking"
    ],
    requirementLogic: "all",
    requirements: [
        {
            id: "create-hotfix-branch",
            command: "git checkout -b",
            requiresArgs: ["hotfix/security-patch"],
            description: "Create a hotfix branch for the security issue",
            successMessage: "Hotfix branch created!"
        },
        {
            id: "stage-fixes",
            command: "git add",
            description: "Stage your security fixes",
            successMessage: "Security fixes staged!"
        },
        {
            id: "commit-fixes",
            command: "git commit -m",
            requiresArgs: ["any"],
            description: "Commit the critical security patch",
            successMessage: "Security patch committed!"
        },
        {
            id: "switch-to-main",
            command: "git switch",
            requiresArgs: ["main"],
            description: "Switch back to main branch",
            successMessage: "Switched to main branch!"
        },
        {
            id: "merge-hotfix",
            command: "git merge",
            requiresArgs: ["hotfix/security-patch"],
            description: "Merge the hotfix into main",
            successMessage: "Hotfix merged successfully!"
        }
    ],
    story: createStory({
        title: "Code Red: Production Emergency",
        narrative: `🚨 URGENT: Production is down! 🚨

At 2:47 AM, your phone buzzes with alerts. The payment system is failing, and customers can't complete purchases. The bug tracker shows a critical security vulnerability was introduced in the latest release.

As the on-call developer, you need to:
1. Immediately create a hotfix branch with \`git checkout -b hotfix/security-patch\`
2. Fix the critical security issue
3. Deploy the fix ASAP
4. Merge back to both main and develop using \`git merge hotfix/security-patch\`
5. Tag the emergency release with \`git tag v1.0.1\`

Every minute costs the company thousands. This is what separates junior developers from senior ones - grace under pressure and knowing the right Git workflows.

Time is money. Let's fix this!`,
        realWorldContext: "Production hotfixes are critical for maintaining system stability and require immediate, focused workflow execution.",
        taskIntroduction: "Master the hotfix workflow for emergency production fixes."
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/src/payment.js", "// Payment processing\nfunction processPayment(data) {\n  // SECURITY BUG: No input validation!\n  return database.insert(data);\n}"),
            createFileStructure("/src/security.js", "// Security utilities\nfunction validateInput(input) {\n  // TODO: Implement validation\n  return true;\n}")
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            branches: ["main", "develop"],
            commits: [
                {
                    message: "Add payment system",
                    files: ["/src/payment.js", "/src/security.js"]
                }
            ]
        })
    })
});

const workflowLevel3 = createLevel({
    id: 3,
    name: "Git Flow Mastery",
    description: "Master the complete Git Flow workflow with release branches",
    objectives: [
        "Create and manage release branches",
        "Handle multiple feature branches",
        "Perform release preparation",
        "Master the complete Git Flow cycle"
    ],
    hints: [
        "Release branches are created from develop",
        "Only bug fixes go into release branches",
        "Release branches merge to both main and develop",
        "Use semantic versioning for releases"
    ],
    requirementLogic: "all",
    requirements: [
        {
            id: "create-release-branch",
            command: "git checkout -b",
            requiresArgs: ["release/2.0.0"],
            description: "Create a release branch for version 2.0.0",
            successMessage: "Release branch created!"
        },
        {
            id: "stage-release-changes",
            command: "git add",
            description: "Stage release preparation changes",
            successMessage: "Release changes staged!"
        },
        {
            id: "commit-release",
            command: "git commit -m",
            requiresArgs: ["any"],
            description: "Commit release preparation",
            successMessage: "Release preparation committed!"
        },
        {
            id: "switch-to-main-for-release",
            command: "git checkout",
            requiresArgs: ["main"],
            description: "Switch to main branch for release",
            successMessage: "Switched to main!"
        },
        {
            id: "merge-release",
            command: "git merge",
            requiresArgs: ["release/2.0.0"],
            description: "Merge release into main",
            successMessage: "Release merged to main!"
        }
    ],
    story: createStory({
        title: "The Release Manager",
        narrative: `Congratulations! You've been promoted to Release Manager at GitFlow Inc., a company that ships software every two weeks like clockwork.

Your job is to orchestrate the release of version 2.0, which includes:
- Three new features from different teams
- Two critical bug fixes
- Performance improvements
- Updated documentation

You must:
1. Create a release branch from develop with \`git checkout -b release/2.0.0\`
2. Perform final testing and bug fixes
3. Prepare release notes
4. Merge to main with \`git merge release/2.0.0\` and tag the release with \`git tag v2.0.0\`
5. Merge back to develop

This is enterprise-level Git management. Welcome to the big leagues!`,
        realWorldContext: "Release management is crucial for coordinating team efforts and ensuring stable software deployments.",
        taskIntroduction: "Learn to manage complex release workflows with multiple teams and features."
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/CHANGELOG.md", "# Changelog\n\n## v1.9.0\n- Initial release"),
            createFileStructure("/src/features/feature1.js", "// New feature 1"),
            createFileStructure("/src/features/feature2.js", "// New feature 2")
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "develop",
            branches: ["main", "develop", "feature/new-ui", "feature/api-integration"],
            commits: [
                {
                    message: "Prepare for v2.0 release",
                    files: ["/CHANGELOG.md", "/src/features/feature1.js"]
                }
            ]
        })
    })
});

export const workflowLevels = {
    1: workflowLevel1,
    2: workflowLevel2,
    3: workflowLevel3,
};
