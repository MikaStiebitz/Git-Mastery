import {
    createLevel,
    createRequirement,
    createStory,
    createInitialState,
    createFileStructure,
    createGitState,
} from "../LevelCreator";

const teamworkLevel1 = createLevel({
    id: 1,
    name: "Team Collaboration Basics",
    description: "Learn how to work effectively with a team using Git",
    objectives: [
        "Pull the latest team code from remote",
        "Create a new feature branch for your work",
        "Add your name to the team members list",
        "Stage and commit your changes"
    ],
    hints: [
        "Use 'git pull origin main' to get the latest team code",
        "Create a new branch with 'git switch -c feature/YOUR-NAME'",
        "Edit the team.md file to add your name and role",
        "Stage all changes with 'git add .'",
        "Commit with a clear message: 'git commit -m \"Add my profile\"'"
    ],
    requirements: [
        createRequirement({
            command: "git pull origin main",
            alternativeCommands: ["git pull"],
            description: "Pull the latest changes from the team repository",
            successMessage: "Latest changes pulled successfully!"
        }),
        createRequirement({
            command: "git switch -c",
            alternativeCommands: ["git checkout -b"],
            requiresArgs: ["any"],
            description: "Create your feature branch for team profile",
            successMessage: "Feature branch created!"
        }),
        createRequirement({
            command: "git add .",
            description: "Stage your team profile changes",
            successMessage: "Changes staged!"
        }),
        createRequirement({
            command: "git commit -m",
            description: "Commit your team profile with a descriptive message",
            successMessage: "Team profile committed!"
        })
    ],
    story: createStory({
        title: "Welcome to the Dev Team",
        narrative: `🎉 Congratulations! You've just been hired as a developer at InnovateCorp, a fast-growing tech startup.

Your team lead, Alex, walks you through your first day:

"Welcome to the team! We use Git for everything here. The codebase is our shared workspace, and everyone contributes to it daily. Your first task is simple but important - add your profile to our team page."

"Remember," Alex continues, "we have 12 developers working on this project. Everyone needs to stay synchronized. Always \`git pull\` before you push, and make sure your commit messages are clear so the rest of us know what you're working on."

Your mission:
1. Get the latest code from the team repository with \`git pull origin main\`
2. Create your feature branch: \`git switch -c feature/team-profile\`
3. Add your developer profile to the team page
4. Stage changes: \`git add .\`
5. Commit your changes: \`git commit -m "Add my profile"\`

This is real-world team development. Let's make your first contribution!`,
        realWorldContext: "Team collaboration is the heart of software development. Learning to work with shared repositories is essential for any developer.",
        taskIntroduction: "Learn the fundamentals of team-based Git workflow and make your first collaborative contribution."
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/team.md", "# Development Team\n\n## Team Members\n- Alex Chen - Team Lead\n- Sarah Miller - Senior Developer\n- Mike Johnson - Frontend Developer\n\n## Add your profile here!"),
            createFileStructure("/src/components/TeamPage.jsx", "// Team page component\nexport function TeamPage() {\n  return <div>Team profiles coming soon...</div>;\n}"),
            createFileStructure("/README.md", "# InnovateCorp Project\n\nA collaborative development environment.")
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            branches: ["main"],
            commits: [
                {
                    message: "Initial team structure setup",
                    files: ["/team.md", "/src/components/TeamPage.jsx", "/README.md"]
                }
            ]
        })
    })
});

const teamworkLevel2 = createLevel({
    id: 2,
    name: "Handling Merge Conflicts in Teams",
    description: "Resolve merge conflicts that occur when multiple developers work on the same files",
    objectives: [
        "Stage and commit your local changes",
        "Pull remote changes (triggers conflict)",
        "Resolve merge conflict markers",
        "Stage and commit the merged solution"
    ],
    hints: [
        "Use 'cat /src/auth/login.js' to see your current uncommitted changes",
        "Use 'git status' to confirm the file is modified",
        "Commit with 'git add /src/auth/login.js' then 'git commit -m \"message\"'",
        "Pull with 'git pull origin main' - this will trigger the conflict!",
        "Look for conflict markers: <<<<<<<, =======, >>>>>>>",
        "Edit login.js to combine both your and Sarah's improvements",
        "The best solution keeps BOTH: Sarah's email check AND your stricter lengths",
        "After resolving: 'git add .' then 'git commit -m \"Resolve merge conflict\"'"
    ],
    requirementLogic: "all",
    requirements: [
        {
            id: "stage-initial-changes",
            command: "git add",
            description: "Stage your local changes to login.js",
            successMessage: "Local changes staged!"
        },
        {
            id: "commit-initial-changes",
            command: "git commit",
            description: "Commit your local changes first",
            successMessage: "Local changes committed!"
        },
        {
            id: "pull-remote-changes",
            command: "git pull",
            description: "Pull Sarah's changes to trigger the conflict",
            successMessage: "Conflicting changes pulled! Check login.js for conflict markers."
        },
        {
            id: "stage-resolved-conflict",
            command: "git add",
            description: "Stage the resolved conflict",
            successMessage: "Conflict resolution staged!"
        },
        {
            id: "commit-merge-resolution",
            command: "git commit",
            description: "Commit the merge resolution",
            successMessage: "Merge conflict resolved!"
        }
    ],
    story: createStory({
        title: "The Great Merge Conflict Crisis",
        narrative: `⚠️ Welcome to your first merge conflict!

**The Situation:**
You've been working on \`/src/auth/login.js\` this morning. You've improved the password validation to be stricter (minimum 5 chars for username, 10 for password). Great work!

But while you were coding, your teammate Sarah also pushed changes to the SAME FILE! She added email validation logic. Now you both have different versions of the same lines of code.

**Your Mission:**

**1. Check your local changes:** Run \`cat /src/auth/login.js\` to see YOUR improvements (already done, but not committed yet!)

**2. Commit YOUR changes first:**
\` git add /src/auth/login.js
git commit -m "Improve password validation requirements"
\`

**3. Now try to pull Sarah's changes:**
\` git pull origin main \`

**4. 💥 MERGE CONFLICT!** Git can't automatically merge because you and Sarah both modified the same lines! You'll see conflict markers in the file:
\`<<<<<<< HEAD
(your changes)
=======
(Sarah's changes)
>>>>>>> abc1234\`

**5. Resolve the conflict:**
- Edit \`/src/auth/login.js\` to combine the best of both versions
- Remove the conflict markers (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`)
- Keep both your stricter password length AND Sarah's email validation!

**6. Complete the merge:**
\`git add .
git commit -m "Merge Sarah's email validation with my password improvements"\`

**Pro Tip:** The best resolution often combines both changes! In this case, keep:
- Sarah's email validation logic (\`username.includes('@')\`)
- Your stricter length requirements (\`username.length >= 5\` and \`password.length >= 10\`)

This is completely normal in team development! Merge conflicts happen when multiple developers work on the same code. The key is resolving them thoughtfully.`,
        realWorldContext: "Merge conflicts are inevitable in team development. Learning to resolve them quickly and correctly is a crucial skill.",
        taskIntroduction: "Master merge conflict resolution to become a confident team collaborator."
    }),
    initialState: createInitialState({
        files: [
            // Original committed version (basic validation)
            createFileStructure("/src/auth/login.js", "// Authentication module\nfunction validateLogin(username, password) {\n  // Basic validation\n  return username.length >= 3 && password.length >= 6;\n}"),
            createFileStructure("/src/auth/signup.js", "// User registration\nfunction createUser(userData) {\n  return database.users.create(userData);\n}")
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            branches: ["main"],
            commits: [
                {
                    message: "Add authentication foundation",
                    files: ["/src/auth/login.js", "/src/auth/signup.js"]
                }
            ],
            // Sarah's changes waiting on remote
            remoteCommits: [
                {
                    branch: "main",
                    commits: [
                        {
                            id: "abc1234",
                            message: "Add email validation to login by Sarah",
                            files: {
                                "/src/auth/login.js": "// Authentication module\nfunction validateLogin(username, password) {\n  // Sarah's implementation with email validation\n  if (!username || !password) return false;\n  const isValidEmail = username.includes('@');\n  return isValidEmail && password.length >= 6;\n}"
                            }
                        }
                    ]
                }
            ],
            // Your local uncommitted changes (you've been working on this!)
            fileChanges: [
                {
                    path: "/src/auth/login.js",
                    status: "modified",
                    content: "// Authentication module\nfunction validateLogin(username, password) {\n  // Your improved implementation with stronger requirements\n  if (!username || !password) return false;\n  return username.length >= 5 && password.length >= 10;\n}"
                }
            ]
        })
    })
});

const teamworkLevel3 = createLevel({
    id: 3,
    name: "Code Review Workflow",
    description: "Learn to participate in code reviews and collaborate through pull requests",
    objectives: [
        "Create a new feature branch",
        "Stage your completed work",
        "Commit with a clear message",
        "Push your branch for team review"
    ],
    hints: [
        "Create a feature branch: git switch -c feature/password-reset",
        "You can also use: git checkout -b feature/password-reset",
        "Stage all changes: git add .",
        "Commit with a descriptive message: git commit -m \"Add password reset functionality\"",
        "Push to remote: git push origin feature/password-reset",
        "Alternative with shorthand: git push -u origin feature/password-reset",
        "Note: Use the branch name you created (not 'feature/password-reset' if you chose a different name)"
    ],
    requirementLogic: "all",
    requirements: [
        {
            id: "create-review-branch",
            command: "git switch",
            alternativeCommands: ["git checkout", "git branch"],
            requiresArgs: ["any"],
            description: "Create a branch for code review demonstration",
            successMessage: "Feature branch created! ✨"
        },
        {
            id: "stage-code-for-review",
            command: "git add",
            description: "Stage your code for review",
            successMessage: "Code staged for review! 📦"
        },
        {
            id: "commit-for-review",
            command: "git commit",
            description: "Commit with a clear, reviewable message",
            successMessage: "Code committed with clear message! 💬"
        },
        {
            id: "push-for-review",
            command: "git push",
            requiresArgs: ["any"],
            description: "Push your branch for code review",
            successMessage: "Code pushed for team review! 🚀 In real teams, you'd now create a Pull Request!"
        }
    ],
    story: createStory({
        title: "The Code Review Culture",
        narrative: `📝 Welcome to InnovateCorp's Code Review Process!

**The Situation:**
You've just finished implementing the password reset feature. The code works perfectly in your local tests! 🎉

But wait - at InnovateCorp, no code goes to production without a code review. It's not about trust - it's about quality, knowledge sharing, and catching bugs before customers see them.

**Why Code Reviews Matter:**
- **Quality:** Sarah might catch a security issue you missed
- **Knowledge Sharing:** Mike learns from your clever solution
- **Better Code:** Multiple perspectives make better software
- **Team Growth:** Everyone becomes a better developer

**Your Task:**
You need to prepare your password reset feature for team review. Follow the professional workflow:

**Step 1: Create a Feature Branch**
Never work directly on \`main\`! Create a dedicated branch for your feature.

**Step 2: Stage Your Work**
Add your completed files to the staging area.

**Step 3: Commit with a Clear Message**
Write a commit message that explains what you built. Your teammates should understand your changes without reading every line of code.

**Step 4: Push to Remote**
Upload your feature branch so your team can review it. In real teams, you'd then create a Pull Request on GitHub/GitLab.

**Remember:** The key to great code reviews is clear communication. Your branch name, commit messages, and code should tell a story!

Let's get your code ready for the team! 🚀`,
        realWorldContext: "Code reviews are standard practice in professional development. They improve code quality, catch bugs early, and help teams learn from each other. Most companies use Pull Requests (GitHub) or Merge Requests (GitLab) for this process.",
        taskIntroduction: "Learn the professional workflow for preparing code for team review through branches, commits, and push operations."
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/src/auth/password-reset.js", "// Password reset functionality\nfunction initiatePasswordReset(email) {\n  // TODO: Implement password reset logic\n  console.log('Password reset requested for:', email);\n}"),
            createFileStructure("/src/auth/email-service.js", "// Email service integration\nfunction sendResetEmail(email, token) {\n  // Email sending logic here\n  return true;\n}"),
            createFileStructure("/tests/password-reset.test.js", "// Tests for password reset\ntest('password reset sends email', () => {\n  // Test implementation\n});")
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            branches: ["main"],
            commits: [
                {
                    message: "Add authentication system foundation",
                    files: ["/src/auth/password-reset.js", "/src/auth/email-service.js"]
                }
            ]
        })
    })
});

export const teamworkLevels = {
    1: teamworkLevel1,
    2: teamworkLevel2,
    3: teamworkLevel3,
};
