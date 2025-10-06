import {
    createLevel,
    createRequirement,
    createStory,
    createInitialState,
    createFileStructure,
    createGitState,
} from "../LevelCreator";

const advancedLevel1 = createLevel({
    id: 1,
    name: "Advanced Rebase Strategies",
    description: "Master interactive rebase to rewrite Git history for cleaner commits",
    objectives: [
        "Use interactive rebase to squash commits",
        "Reorder commits for logical flow",
        "Edit commit messages for clarity",
        "Handle rebase conflicts"
    ],
    hints: [
        "Interactive rebase allows you to rewrite history",
        "Use 'squash' to combine commits",
        "Use 'reword' to change commit messages",
        "Never rebase commits that have been pushed to shared branches"
    ],
    requirements: [
        createRequirement({
            command: "git rebase -i HEAD~3",
            description: "Start an interactive rebase of the last 3 commits",
            successMessage: "Interactive rebase initiated!"
        }),
        createRequirement({
            command: "git add .",
            description: "Stage any changes from rebase conflicts",
            successMessage: "Rebase conflicts resolved!"
        }),
        createRequirement({
            command: "git rebase --continue",
            description: "Continue the rebase after resolving conflicts",
            successMessage: "Rebase completed successfully!"
        })
    ],
    story: createStory({
        title: "The History Rewriter",
        narrative: `🎭 Welcome to the dark arts of Git - rewriting history!

You've just finished implementing a complex feature over the past week. Looking back at your commit history, you cringe:

- "WIP: trying to fix login"
- "oops, forgot semicolon"
- "debugging session, lots of console.logs"
- "FINALLY WORKS!!!"
- "removed console.logs"
- "fixed typo in comment"

Your team lead, Sarah, pulls you aside:

"Hey, I see you've been busy with the authentication feature. Before we merge this to main, let's clean up that commit history. Future developers (including yourself in 6 months) will thank you."

"Think of Git commits as chapters in a book. Right now, your story reads like a stream of consciousness. Let's edit it into a clear, logical narrative."

The power of interactive rebase:
- Combine related commits (squash) with \`git rebase -i HEAD~3\`
- Reorder commits for logical flow
- Rewrite commit messages for clarity
- Remove commits that add no value

Remember: This is powerful magic. Only rewrite history on branches that haven't been shared with others!`,
        realWorldContext: "Interactive rebase is a professional skill used to maintain clean, readable commit history in production codebases.",
        taskIntroduction: "Master interactive rebase to create professional, maintainable Git histories."
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/src/auth/login.js", "// Login functionality\nfunction login(username, password) {\n  // Working implementation\n  return authenticate(username, password);\n}"),
            createFileStructure("/src/auth/validation.js", "// Input validation\nfunction validateCredentials(username, password) {\n  return username.length > 0 && password.length >= 8;\n}"),
            createFileStructure("/tests/auth.test.js", "// Authentication tests\ntest('login works correctly', () => {\n  expect(login('user', 'password123')).toBe(true);\n});")
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "feature/auth-cleanup",
            branches: ["main", "feature/auth-cleanup"],
            commits: [
                {
                    message: "WIP: trying to fix login",
                    files: ["/src/auth/login.js"]
                },
                {
                    message: "oops, forgot semicolon",
                    files: ["/src/auth/login.js"]
                },
                {
                    message: "debugging session, lots of console.logs",
                    files: ["/src/auth/login.js", "/src/auth/validation.js"]
                },
                {
                    message: "FINALLY WORKS!!!",
                    files: ["/src/auth/login.js", "/tests/auth.test.js"]
                },
                {
                    message: "removed console.logs",
                    files: ["/src/auth/login.js"]
                }
            ]
        })
    })
});

const advancedLevel2 = createLevel({
    id: 2,
    name: "Git Bisect - The Bug Hunter",
    description: "Use Git bisect to efficiently find the commit that introduced a bug",
    objectives: [
        "Identify a regression in the codebase",
        "Start a bisect session",
        "Test commits systematically",
        "Find the exact commit that broke functionality"
    ],
    hints: [
        "Bisect uses binary search to find bugs efficiently",
        "Mark commits as 'good' or 'bad' as you test",
        "Automate bisect with test scripts when possible",
        "Always verify your findings"
    ],
    requirements: [
        createRequirement({
            command: "git bisect start",
            description: "Start a bisect session to hunt for the bug",
            successMessage: "Bisect session started!"
        }),
        createRequirement({
            command: "git bisect bad",
            description: "Mark the current commit as bad (contains the bug)",
            successMessage: "Current commit marked as bad!"
        }),
        createRequirement({
            command: "git bisect good HEAD~5",
            description: "Mark a commit from 5 commits ago as good",
            successMessage: "Reference commit marked as good!"
        })
    ],
    story: createStory({
        title: "The Great Bug Hunt of 2024",
        narrative: `🐛 Crisis mode activated! The payment system that was working perfectly yesterday is now failing, and customers are reporting errors.

You're the detective on duty, and the pressure is mounting. The CEO is asking questions, the customer support team is overwhelmed, and somewhere in the 47 commits pushed since Friday, there's a bug hiding.

Your senior developer Alex walks over with a concerned look:

"We need to find this bug fast. The payment system was definitely working on Friday before the weekend deployments. Now it's broken. That's probably... what, 50 commits to check?"

"Normally, you'd have to check each commit manually - that could take hours. But Git has a secret weapon: bisect. It's like a binary search for bugs."

Here's how Git bisect works:
1. You tell Git a 'good' commit (payment worked)
2. You tell Git a 'bad' commit (payment broken)
3. Git checks out the middle commit
4. You test and mark it good or bad
5. Git repeats until it finds the exact culprit

Instead of checking 50 commits, you'll only need to check about 6. That's the power of binary search!

Time to become a Git detective. Let's hunt down this bug!`,
        realWorldContext: "Git bisect is an essential debugging tool for finding regressions in large codebases with many contributors.",
        taskIntroduction: "Learn to use Git bisect to efficiently locate bugs in complex commit histories."
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/src/payment/processor.js", "// Payment processing - BROKEN\nfunction processPayment(amount, card) {\n  // Bug introduced: missing validation\n  return charge(amount, card);\n}"),
            createFileStructure("/src/payment/validation.js", "// Payment validation\nfunction validateCard(card) {\n  return card && card.number && card.expiry;\n}"),
            createFileStructure("/tests/payment.test.js", "// Payment tests\ntest('processes valid payment', () => {\n  expect(processPayment(100, validCard)).toBe(true);\n});")
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            branches: ["main"],
            commits: [
                {
                    message: "Add initial payment system (WORKING)",
                    files: ["/src/payment/processor.js", "/src/payment/validation.js"]
                },
                {
                    message: "Update UI components",
                    files: ["/src/components/PaymentForm.js"]
                },
                {
                    message: "Refactor payment logic (BUG INTRODUCED)",
                    files: ["/src/payment/processor.js"]
                },
                {
                    message: "Add more tests",
                    files: ["/tests/payment.test.js"]
                },
                {
                    message: "Update documentation",
                    files: ["/docs/payment.md"]
                }
            ]
        })
    })
});

const advancedLevel3 = createLevel({
    id: 3,
    name: "Advanced Branch Management",
    description: "Master complex branching strategies and cleanup techniques",
    objectives: [
        "Clean up merged branches",
        "Handle orphaned branches",
        "Use advanced branch filtering",
        "Optimize repository structure"
    ],
    hints: [
        "Use git branch --merged to find safe-to-delete branches",
        "git branch -d deletes only merged branches safely",
        "git branch -D force deletes any branch (dangerous)",
        "Regular cleanup prevents branch proliferation"
    ],
    requirements: [
        createRequirement({
            command: "git branch --merged",
            description: "List all branches that have been merged",
            successMessage: "Merged branches identified!"
        }),
        createRequirement({
            command: "git branch -d feature/old-feature",
            description: "Delete the old merged feature branch",
            successMessage: "Old branch cleaned up!"
        }),
        createRequirement({
            command: "git remote prune origin",
            description: "Clean up remote tracking branches",
            successMessage: "Remote branches pruned!"
        })
    ],
    story: createStory({
        title: "The Great Repository Cleanup",
        narrative: `🧹 Your repository is a mess, and it's time for spring cleaning!

After 6 months of intense development, your team's Git repository looks like a digital hoarder's paradise. There are branches everywhere:

- feature/login-system (merged 3 months ago)
- hotfix/urgent-bug-fix (merged last week)
- experiment/new-ui (abandoned)
- feature/payment-gateway (merged)
- bugfix/typo-in-header (merged)
- draft/crazy-idea (never finished)

Your new team member, Jordan, is completely overwhelmed:

"How do I know which branches are safe to work with? There are 47 branches here, and I have no idea what's current!"

Your team lead nods knowingly: "Time for a repository cleanup. In a healthy Git workflow, we should regularly prune old branches. Think of it like cleaning your desk - it helps everyone focus on what matters."

The cleanup process:
1. Identify branches that have been merged
2. Safely delete merged branches
3. Remove remote tracking branches for deleted branches
4. Archive or delete abandoned experiments
5. Document the current active branches

This isn't just about tidiness - it's about team productivity. A clean repository is easier to navigate, reduces confusion, and prevents mistakes.

Let's turn this branch chaos into an organized, professional repository!`,
        realWorldContext: "Repository maintenance is crucial for team productivity and preventing confusion in collaborative environments.",
        taskIntroduction: "Learn advanced branch management techniques to maintain clean, professional repositories."
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/README.md", "# Project Repository\n\nActive development branches:\n- main (production)\n- develop (integration)\n\nCleaned up branches: TBD"),
            createFileStructure("/docs/branching-strategy.md", "# Branching Strategy\n\n## Branch Types\n- feature/* - New features\n- hotfix/* - Production fixes\n- bugfix/* - Bug fixes")
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "main",
            branches: [
                "main",
                "develop",
                "feature/login-system",
                "feature/old-feature",
                "hotfix/urgent-fix",
                "experiment/abandoned",
                "feature/payment-gateway"
            ],
            commits: [
                {
                    message: "Repository setup and branching strategy",
                    files: ["/README.md", "/docs/branching-strategy.md"]
                }
            ]
        })
    })
});

const advancedLevel4 = createLevel({
    id: 4,
    name: "Conventional Commits Mastery",
    description: "Master professional commit message conventions used in the industry",
    objectives: [
        "Understand conventional commit types (feat, fix, chore, etc.)",
        "Write semantic commit messages",
        "Include proper scope and breaking changes",
        "Follow industry-standard commit guidelines"
    ],
    hints: [
        "Conventional commits follow the pattern: <type>(<scope>): <description>",
        "Common types: feat, fix, docs, style, refactor, test, chore",
        "feat: introduces a new feature",
        "fix: fixes a bug",
        "Use ! or BREAKING CHANGE for breaking changes",
        "Keep the subject line under 50 characters"
    ],
    requirementLogic: "all",
    requirements: [
        {
            id: "feature-commit",
            command: "git commit -m",
            requiresArgs: ["feat"],
            description: "Create a commit with type 'feat' for a new feature",
            successMessage: "Feature commit created with proper convention!"
        },
        {
            id: "bugfix-commit",
            command: "git commit -m",
            requiresArgs: ["fix"],
            description: "Create a commit with type 'fix' for a bug fix",
            successMessage: "Bug fix commit created correctly!"
        },
        {
            id: "chore-commit",
            command: "git commit -m",
            requiresArgs: ["chore"],
            description: "Create a commit with type 'chore' for maintenance",
            successMessage: "Chore commit created successfully!"
        }
    ],
    story: createStory({
        title: "The Commit Message Convention",
        narrative: `📝 Welcome to the world of professional commit messages!

You've just joined a team at TechGiant Inc., a company that maintains dozens of open-source projects used by millions of developers. Your first code review is... interesting.

Your team lead, Marcus, returns your PR with a comment:

"Great code! But we need to talk about your commit messages. Here's what I see:

❌ 'fixed stuff'
❌ 'Updated file'
❌ 'asdf'
❌ 'FINALLY WORKS!!!'

These might make sense to you right now, but imagine trying to understand them in 6 months, or trying to generate a changelog, or trying to understand what broke when bisecting through 1,000 commits."

Marcus continues: "We use Conventional Commits - an industry standard that makes commits semantic and machine-readable. Let me show you..."

**Conventional Commit Format:**
\`\`\`
<type>(<scope>): <description>

[optional body]

[optional footer]
\`\`\`

**Common Types:**
- **feat**: A new feature
  - Example: \`feat(auth): add OAuth2 login support\`
- **fix**: A bug fix
  - Example: \`fix(payment): correct currency calculation for EUR\`
- **docs**: Documentation changes
  - Example: \`docs(readme): update installation instructions\`
- **style**: Code style changes (formatting, semicolons, etc.)
  - Example: \`style(components): format code with prettier\`
- **refactor**: Code refactoring without feature changes
  - Example: \`refactor(api): simplify error handling logic\`
- **test**: Adding or updating tests
  - Example: \`test(auth): add unit tests for login validation\`
- **chore**: Build process, dependencies, tooling
  - Example: \`chore(deps): update lodash to 4.17.21\`
- **perf**: Performance improvements
  - Example: \`perf(database): optimize query for user lookup\`

**Breaking Changes:**
Use ! after type or add BREAKING CHANGE in footer
- Example: \`feat(api)!: remove deprecated endpoints\`

**Real Benefits:**
- Automated changelog generation
- Semantic versioning automation
- Better git bisect context
- Clearer code review process
- Team communication
- Open source contribution standards

"Now," Marcus says, "let's rewrite those commits properly!"`,
        realWorldContext: "Conventional Commits are used by major projects like Angular, Electron, and React. They enable automation, clear communication, and professional development practices.",
        taskIntroduction: "Learn to write professional, semantic commit messages following the Conventional Commits specification."
    }),
    initialState: createInitialState({
        files: [
            createFileStructure("/src/features/authentication.js", "// OAuth2 authentication feature\nfunction authenticateWithOAuth2(provider) {\n  return provider.authenticate();\n}"),
            createFileStructure("/src/bugfixes/payment.js", "// Fixed currency calculation bug\nfunction calculateTotal(amount, currency) {\n  return convertCurrency(amount, currency);\n}"),
            createFileStructure("/package.json", '{\n  "name": "techgiant-app",\n  "version": "2.1.0",\n  "dependencies": {\n    "lodash": "4.17.21"\n  }\n}'),
            createFileStructure("/docs/CHANGELOG.md", "# Changelog\n\nAll notable changes will be documented here following Conventional Commits.\n"),
        ],
        git: createGitState({
            initialized: true,
            currentBranch: "feature/conventional-commits",
            branches: ["main", "feature/conventional-commits"],
            commits: [
                {
                    message: "Initial project setup",
                    files: ["/package.json", "/docs/CHANGELOG.md"]
                }
            ],
            fileChanges: [
                {
                    path: "/src/features/authentication.js",
                    content: "// OAuth2 authentication feature\nfunction authenticateWithOAuth2(provider) {\n  return provider.authenticate();\n}",
                    status: "untracked"
                },
                {
                    path: "/src/bugfixes/payment.js",
                    content: "// Fixed currency calculation bug\nfunction calculateTotal(amount, currency) {\n  return convertCurrency(amount, currency);\n}",
                    status: "untracked"
                }
            ]
        })
    })
});

export const advancedLevels = {
    1: advancedLevel1,
    2: advancedLevel2,
    3: advancedLevel3,
    4: advancedLevel4,
};
