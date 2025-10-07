const levels = {
    // Level Page
    "level.gitTerminal": "Git Terminal",
    "level.currentChallenge": "Current Challenge",
    "level.objectives": "Objectives:",
    "level.showHints": "Show Hints",
    "level.hideHints": "Hide Hints",
    "level.nextLevel": "Next Level",
    "level.filesToEdit": "Files to Edit:",
    "level.workingTreeClean": "Working tree clean",
    "level.staged": "staged",
    "level.modified": "modified",
    "level.untracked": "untracked",
    "level.gitNotInitialized": "Git is not initialized yet",
    "level.branch": "Branch:",
    "level.gitStatus": "Git Status",
    "level.advancedOptions": "Advanced Options",
    "level.hideAdvancedOptions": "Hide Advanced Options",
    "level.resetLevel": "Reset Level",
    "level.resetAllProgress": "Reset All Progress",
    "level.resetConfirm": "Are you sure you want to reset all your progress?",
    "level.level": "Level",
    "level.levelCompleted": "Level completed!",
    "level.realWorldContext": "Real-World Context",
    "level.task": "Your Task",
    "level.startCoding": "Start Coding",
    "level.storyButton": "Show Story",
    "level.advancedModeOn": "Advanced Mode (On)",
    "level.advancedModeOff": "Advanced Mode (Off)",
    "level.notFound": "Level not found",
    "level.techModeOn": "Focus on Commands (Tech Mode)",
    "level.storyModeOn": "Show Story Context (Story Mode)",
    "level.techModeDescription":
        "Technical mode focuses on Git commands without stories or context for a faster, more direct experience.",
    "level.storyModeDescription":
        "Story mode provides real-world context and explanations to help understand why and how Git commands are used.",
    "level.editFile": "Edit file",
    "level.deleteFile": "Delete file",
    "level.confirmDelete": "Are you sure you want to delete {file}?",
    "level.hints": "Hints",

    // Level Content - Intro Stage
    "intro.name": "Introduction to Git",
    "intro.description": "Learn the basics of Git",

    "intro.level1.name": "Initialize Git",
    "intro.level1.description": "Create a new Git repository",
    "intro.level1.objective1": "Initialize a new Git repository",
    "intro.level1.hint1": "Use the `git init` command",
    "intro.level1.hint2": "This creates a hidden .git directory",
    "intro.level1.requirement1.description": "Initialize a Git repository",
    "intro.level1.requirement1.success": "Well done! You've created a Git repository.",
    "intro.level1.story.title": "Welcome to the Team",
    "intro.level1.story.narrative":
        "Welcome to your new job as a developer at TechStart! I'm Alex, your team lead.\n\nIt's your first day and we want to help you become productive quickly. We use Git for our version control - it helps us track changes in code and work together as a team.\n\nThe first thing you need to do is create a new repository for your onboarding project. We use the `git init` command for this.",
    "intro.level1.story.realWorldContext":
        "In real development teams, Git is essential. It's the first tool you set up for a new project.",
    "intro.level1.story.taskIntroduction": "Let's create a new repository for your project.",

    "intro.level2.name": "Repository Status",
    "intro.level2.description": "Check the status of your repository",
    "intro.level2.objective1": "Display the status of your Git repository",
    "intro.level2.hint1": "Use the `git status` command",
    "intro.level2.hint2": "This command shows the current status of your repository",
    "intro.level2.requirement1.description": "Show the repository status",
    "intro.level2.requirement1.success": "Perfect! Now you can see the status of your repository.",
    "intro.level2.story.title": "What's Happening in Your Repo?",
    "intro.level2.story.narrative":
        "Great! You've created your first Git repository. The hidden .git directory now contains all the information Git needs.\n\nAlex stops by: \"Great job! Next you should look at what's happening in your repository. With `git status` you can check the current state at any time.\"",
    "intro.level2.story.realWorldContext":
        "Developers run `git status` multiple times a day to see which files have been changed and which are ready for the next commit.",
    "intro.level2.story.taskIntroduction": "Check the status of your repository with `git status`.",

    "intro.level3.name": "Cloning Repositories",
    "intro.level3.description": "Learn to clone existing repositories",
    "intro.level3.objective1": "Clone a remote repository",
    "intro.level3.objective2": "Navigate into the cloned repository",
    "intro.level3.hint1": "Use the `git clone <url>` command",
    "intro.level3.hint2": "After cloning, use `cd` to navigate into the repository folder",
    "intro.level3.hint3": "The repository URL can be any valid Git repository URL",
    "intro.level3.requirement1.description": "Clone a remote repository",
    "intro.level3.requirement1.success": "Great! You've cloned the repository.",
    "intro.level3.requirement2.description": "Navigate into the cloned repository using cd",
    "intro.level3.requirement2.success": "Perfect! You're now inside the cloned repository.",
    "intro.level3.story.title": "Joining an Existing Project",
    "intro.level3.story.narrative":
        "Your first week at TechStart is going great! Alex calls you over with exciting news.\n\n\"We have a team project that needs your help,\" he says. \"The codebase is already on our Git server. You'll need to clone it to your local machine to start working on it.\"\n\nHe explains: \"When you join an existing project, you don't start from scratch. Instead, you clone the remote repository, which creates a complete copy on your machine—including all the code, history, and branches.\"\n\n\"Think of it like checking out a book from the library, except you get the entire library's records too! Use `git clone <repository-url>` to get started.\"\n\n\"Once cloned, you can navigate into the project folder with `cd <folder-name>` and start working immediately. All the project's history and changes are available to you.\"",
    "intro.level3.story.realWorldContext":
        "Cloning is how developers join existing projects. Whether contributing to open source or joining a new team, git clone is typically the first command you run.",
    "intro.level3.story.taskIntroduction": "Clone a repository and navigate into it to start working on the project.",

    // Level Content - Files Stage
    "files.name": "File Operations",
    "files.description": "Learn how to manage files with Git",

    "files.level1.name": "Staging Changes",
    "files.level1.description": "Add files to the staging area",
    "files.level1.objective1": "Add all files to the staging area",
    "files.level1.hint1": "Use the `git add .` command",
    "files.level1.hint2": "The dot represents 'all files in the current directory'",
    "files.level1.requirement1.description": "Add all files to the staging area",
    "files.level1.requirement1.success": "Great! You've added all files to the staging area.",
    "files.level1.story.title": "Preparing Code Changes",
    "files.level1.story.narrative":
        '"Hey!" calls Sarah, your colleague, "I see you\'ve already started with Git. Next you should learn how to stage changes."\n\nShe explains: "When you modify files, you need to explicitly tell Git which changes should be included in the next commit. This is called \'staging\' and works with `git add`."',
    "files.level1.story.realWorldContext":
        "The staging concept is a powerful feature of Git. It allows you to commit only selected changes while others can remain in progress.",
    "files.level1.story.taskIntroduction": "Add all files to the staging area with `git add .`.",

    "files.level2.name": "Committing Changes",
    "files.level2.description": "Create a commit with your changes",
    "files.level2.objective1": "Create a commit with a message",
    "files.level2.hint1": "Use the `git commit -m 'Your message'` command",
    "files.level2.hint2": "The message should describe your changes",
    "files.level2.requirement1.description": "Create a commit with a message",
    "files.level2.requirement1.success": "Excellent! You've successfully created a commit.",
    "files.level2.story.title": "Your First Commit",
    "files.level2.story.narrative":
        '"Great job!" says Alex when he sees your progress. "You\'ve added changes to the staging area. Now it\'s time for your first commit."\n\nHe explains: "A commit is like a snapshot of your project at a specific point in time. Each commit needs a message that describes what was changed. This is important for traceability."',
    "files.level2.story.realWorldContext":
        "Good commit messages are extremely important in development teams. They help everyone understand why a change was made, not just what was changed.",
    "files.level2.story.taskIntroduction": "Create your first commit with a meaningful message.",

    "files.level3.name": "Removing Files",
    "files.level3.description": "Learn how to remove files from Git",
    "files.level3.objective1": "Remove a file from both the working directory and the index",
    "files.level3.hint1": "Use the `git rm <file>` command",
    "files.level3.hint2": "This removes the file from Git and also deletes it from your working directory",
    "files.level3.requirement1.description": "Remove a file using Git",
    "files.level3.requirement1.success": "Well done! You've removed the file from Git and your working directory.",
    "files.level3.story.title": "Cleaning Up",
    "files.level3.story.narrative":
        '"I see you\'ve been making good progress," says Alex as he reviews your work. "But I notice there are some temporary files or drafts we don\'t need anymore. We should clean up the repository."\n\nHe explains: "When you want to remove files that are tracked by Git, you should use `git rm` rather than just deleting them manually. This ensures Git properly tracks the deletion."',
    "files.level3.story.realWorldContext":
        "Keeping repositories clean by removing unnecessary files is a best practice. The `git rm` command ensures Git tracks the file deletion.",
    "files.level3.story.taskIntroduction": "Remove the unnecessary file from the repository using `git rm`.",

    // Level Content - Branches Stage
    "branches.name": "Working with Branches",
    "branches.description": "Learn how to work with branches",

    "branches.level1.name": "View Branches",
    "branches.level1.description": "Display all branches in your repository",
    "branches.level1.objective1": "Display all existing branches",
    "branches.level1.hint1": "Use the `git branch` command",
    "branches.level1.hint2": "This shows all local branches",
    "branches.level1.requirement1.description": "Show all branches",
    "branches.level1.requirement1.success": "Very good! Now you can see all branches in your repository.",
    "branches.level1.story.title": "Code Branches",
    "branches.level1.story.narrative":
        '"Time for something more advanced," says Alex and draws a tree with branches on a whiteboard. "These branches are like Git branches. They allow you to work on different versions of your code simultaneously."\n\nHe continues: "Currently you\'re working on the \'main\' branch. Let\'s first check which branches we have."',
    "branches.level1.story.realWorldContext":
        "Branches are a fundamental concept in Git. They enable parallel development, feature isolation, and experimental work without affecting the main code.",
    "branches.level1.story.taskIntroduction": "Display all existing branches with git branch.",

    "branches.level2.name": "Create and Switch to Branch",
    "branches.level2.description": "Create a new branch and switch to it using the modern git switch command",
    "branches.level2.objective1": "Create a new branch named 'feature' and switch to it",
    "branches.level2.hint1": "Use the `git switch -c feature` command",
    "branches.level2.hint2": "The -c flag creates a new branch and switches to it in one step",
    "branches.level2.requirement1.description": "Create a new branch and switch to it using git switch -c",
    "branches.level2.requirement1.success":
        "Excellent! You've created a new branch and switched to it using the modern git switch command.",
    "branches.level2.story.title": "Modern Branch Creation",
    "branches.level2.story.narrative":
        "\"Perfect! Now we want to implement a new feature,\" says Alex. \"For this, we'll create a new branch called 'feature' so our changes don't affect the main code.\"\n\nHe shows you the modern approach: \"Git introduced the `git switch` command to make branch operations clearer. Use `git switch -c feature` to create and switch to the new branch in one step. This is the preferred modern way instead of the older `git checkout -b`.\"",
    "branches.level2.story.realWorldContext":
        "In professional development teams, you almost never work directly on the main branch. The `git switch` command, introduced in Git 2.23, provides a cleaner, more intuitive way to work with branches compared to the older checkout command.",
    "branches.level2.story.taskIntroduction":
        "Create a new branch named 'feature' and switch to it using `git switch -c`.",

    "branches.level3.name": "Switch Between Branches",
    "branches.level3.description": "Switch between existing branches",
    "branches.level3.objective1": "Switch between branches using git switch",
    "branches.level3.hint1": "Use the `git switch <branch>` command",
    "branches.level3.hint2": "This switches to an existing branch",
    "branches.level3.requirement1.description": "Switch to another branch using git switch",
    "branches.level3.requirement1.success": "Great job! You've switched between branches using git switch.",
    "branches.level3.story.title": "Branch Navigation",
    "branches.level3.story.narrative":
        "\"Now that you know how to create branches, let's practice moving between them,\" says Sarah. \"This is something you'll do constantly in real development work.\"\n\nShe explains: \"You can switch to any existing branch using `git switch <branch-name>`. This is much clearer than the old `git checkout` which could be confusing because it did many different things.\"",
    "branches.level3.story.realWorldContext":
        "Switching between branches is one of the most common Git operations. The dedicated `git switch` command makes the intent clear and reduces confusion compared to the multipurpose checkout command.",
    "branches.level3.story.taskIntroduction": "Practice switching to another branch using `git switch`.",

    "branches.level4.name": "Switch Branches with Checkout",
    "branches.level4.description": "Learn the classic git checkout command for switching branches",
    "branches.level4.objective1": "Switch to another branch using git checkout",
    "branches.level4.hint1": "Use the command `git checkout <branch-name>`",
    "branches.level4.hint2": "checkout is the older command for switching branches",
    "branches.level4.requirement1.description": "Switch to another branch using git checkout",
    "branches.level4.requirement1.success": "Great! You now know both ways to switch branches.",
    "branches.level4.story.title": "The Classic Approach",
    "branches.level4.story.narrative":
        '"It\'s important to know git checkout too," Alex explains. "While git switch is the modern way, you\'ll see checkout in older projects, tutorials, and documentation all the time."\n\nHe adds: "checkout can do many things - switch branches, restore files, and more. That\'s why Git introduced switch and restore - to make intentions clearer."',
    "branches.level4.story.realWorldContext":
        "git checkout was THE command for branch operations for years. Many developers and tools still use it. Knowing both makes you more versatile across different projects and teams.",
    "branches.level4.story.taskIntroduction": "Switch to another branch using the classic git checkout command.",

    "branches.level5.name": "Create Branch with Checkout",
    "branches.level5.description": "Create and switch to a new branch using git checkout -b",
    "branches.level5.objective1": "Create a new branch using git checkout -b",
    "branches.level5.hint1": "Use the command `git checkout -b <new-branch-name>`",
    "branches.level5.hint2": "The -b flag tells checkout to create a new branch",
    "branches.level5.requirement1.description": "Create and switch to a new branch using git checkout -b",
    "branches.level5.requirement1.success": "Perfect! You now master both methods of creating branches.",
    "branches.level5.story.title": "Quick Branch Creation",
    "branches.level5.story.narrative":
        '"One last trick with checkout," Sarah says. "You can use \'git checkout -b\' to create a new branch and switch to it at the same time - just like switch -c."\n\nShe explains: "In many older Git tutorials and projects, you\'ll see this pattern. It\'s the same concept as switch -c, just with the older syntax."',
    "branches.level5.story.realWorldContext":
        "The checkout -b pattern is very widespread in the Git community. Many developers have built muscle memory for it and continue using it even after switch was introduced.",
    "branches.level5.story.taskIntroduction": "Create a new branch using git checkout -b and automatically switch to it.",

    // Level Content - Merge Stage
    "merge.name": "Merging Branches",
    "merge.description": "Learn how to merge branches",

    "merge.level1.name": "Merging Feature Branch",
    "merge.level1.description": "Merge a feature branch into the development branch",
    "merge.level1.objective1": "Merge the 'feature/user-auth' branch into the 'develop' branch",
    "merge.level1.hint1": "You're already on the develop branch",
    "merge.level1.hint2": "Use `git merge feature/user-auth` to integrate the feature branch",
    "merge.level1.requirement1.description": "Merge the feature branch",
    "merge.level1.requirement1.success": "Excellent! The feature has been integrated into develop.",
    "merge.level1.story.title": "Code Review and Integration",
    "merge.level1.story.narrative":
        '"Your feature is done!", says Sarah, the team lead. "But before we push it to main, we need to merge it into the develop branch and test it."\n\nShe explains: "In professional teams, we never merge directly into main. First feature → develop for testing, then develop → main for production."',
    "merge.level1.story.realWorldContext":
        "🔍 Best Practice: Pull Requests\n\nIn real projects, you would now create a Pull Request (PR) or Merge Request (MR) on GitHub/GitLab:\n\n1️⃣ You push your feature branch\n\n2️⃣ You open a PR: feature/user-auth → develop\n\n3️⃣ Team members review your code\n\n4️⃣ After approval, the PR gets merged\n\nThis enables code reviews, discussions, and automatic tests before merging! 🚀",
    "merge.level1.story.taskIntroduction":
        "Merge the 'feature/user-auth' branch into the 'develop' branch (you're already on develop).",

    "merge.level2.name": "Production Deploy",
    "merge.level2.description": "Merge tested code into the main branch",
    "merge.level2.objective1": "Merge the 'develop' branch into the 'main' branch",
    "merge.level2.hint1": "You're already on the main branch",
    "merge.level2.hint2": "Use `git merge develop` to integrate the tested code",
    "merge.level2.requirement1.description": "Merge develop into main",
    "merge.level2.requirement1.success": "Perfect! The code is now in production.",
    "merge.level2.story.title": "Production Release",
    "merge.level2.story.narrative":
        '"Awesome! The feature runs perfectly on develop and all tests are green," says Sarah. "Now we can merge it into main and deploy."\n\nShe emphasizes: "main is our production branch. Only tested, stable code goes in here. That\'s why we tested on develop first!"',
    "merge.level2.story.realWorldContext":
        "Git Flow Workflow 🌊\n\n📦 main: Production-ready code\n\n🔧 develop: Integration and testing\n\n✨ feature/*: New features\n\nThis workflow prevents untested code from reaching production. Many teams also use release branches!",
    "merge.level2.story.taskIntroduction": "Merge the 'develop' branch into the 'main' branch.",

    "merge.level3.name": "Handling Merge Conflicts",
    "merge.level3.description": "Learn how to handle or abort merges with conflicts",
    "merge.level3.objective1": "Abort a merge with conflicts",
    "merge.level3.hint1": "Use the `git merge --abort` command",
    "merge.level3.hint2": "This will stop the merge process and return to the state before the merge began",
    "merge.level3.requirement1.description": "Abort a merge with conflicts",
    "merge.level3.requirement1.success": "Good job! You've successfully aborted the merge operation.",
    "merge.level3.story.title": "When Merges Go Wrong",
    "merge.level3.story.narrative":
        '"Sometimes merges don\'t go as planned," warns Sarah. "When the same part of a file has been changed differently in both branches, a merge conflict occurs."\n\nShe explains: "You have two options: Either you resolve the conflict manually, or you abort the merge with `git merge --abort` and prepare better."',
    "merge.level3.story.realWorldContext":
        "Merge conflicts are a common part of collaborative development. Knowing how to handle them—whether by resolving or temporarily aborting—is an essential skill.",
    "merge.level3.story.taskIntroduction": "Practice aborting a merge operation using git merge --abort.",

    // Stash Stage
    "stash.name": "Git Stash",
    "stash.description": "Learn to temporarily save your changes",

    "stash.level1.name": "Stashing Changes",
    "stash.level1.description": "Save your work temporarily and retrieve it later",
    "stash.level1.objective1": "Stash changes, switch branches, and retrieve them",
    "stash.level1.hint1": "Use `git stash` to save your changes",
    "stash.level1.hint2": "Use `git stash pop` to retrieve your changes",
    "stash.level1.requirement1.description": "Stash your current changes",
    "stash.level1.requirement1.success": "Changes stashed successfully!",
    "stash.level1.requirement2.description": "Switch to hotfix branch",
    "stash.level1.requirement2.success": "Switched to hotfix!",
    "stash.level1.requirement3.description": "Switch back to feature branch",
    "stash.level1.requirement3.success": "Back to feature!",
    "stash.level1.requirement4.description": "Retrieve your stashed changes",
    "stash.level1.requirement4.success": "Changes restored!",
    "stash.level1.story.title": "Interrupted by Hotfix",
    "stash.level1.story.narrative":
        '"Code Red!", your manager shouts. "Critical bug in production. You need to switch to the hotfix branch NOW!"\n\nYou look at your code - halfway through, incomplete. You can\'t commit now, it would break the build.\n\n"Use `git stash`," your colleague Lisa suggests. "It temporarily saves your changes without committing. After the hotfix, retrieve them with `git stash pop`."',
    "stash.level1.story.realWorldContext":
        "Git Stash is a lifesaver in daily development!\n\n**When do you need Stash?**\n\n🚨 Urgent hotfix interrupts your work\n\n🔄 You want to switch branches without committing\n\n🧪 You want to experiment without losing changes\n\n💾 Your work isn't commit-ready yet\n\n**Stash is like a clipboard** for your changes - they disappear from the working directory but stay safely stored!",
    "stash.level1.story.taskIntroduction":
        "Stash your changes, switch to hotfix branch, then back to feature, and retrieve your work with stash pop.",

    "stash.level2.name": "Switching Between Tasks",
    "stash.level2.description": "Juggle multiple tasks with git stash",
    "stash.level2.objective1": "Stash old work, create new branch, return",
    "stash.level2.hint1": "Start with `git stash` to secure current work",
    "stash.level2.hint2": "Create new branch with `git checkout -b feature/new-task`",
    "stash.level2.hint3": "Switch back and retrieve with `git stash pop`",
    "stash.level2.requirement1.description": "Stash current work",
    "stash.level2.requirement1.success": "Work secured!",
    "stash.level2.requirement2.description": "Switch to main",
    "stash.level2.requirement2.success": "On main branch!",
    "stash.level2.requirement3.description": "Create feature/new-task branch",
    "stash.level2.requirement3.success": "New branch created!",
    "stash.level2.requirement4.description": "Switch back to feature/old-task",
    "stash.level2.requirement4.success": "Back to old task!",
    "stash.level2.requirement5.description": "Retrieve stashed work",
    "stash.level2.requirement5.success": "Work restored!",
    "stash.level2.story.title": "Multi-Tasking Master",
    "stash.level2.story.narrative":
        '"Hey, can you quickly work on this new feature request?", your Product Owner asks.\n\nYou\'re in the middle of another task. Previously you\'d have to commit everything or lose changes.\n\n"Stash is perfect for this," explains your Senior Developer Marc. "Save your current work, create a new branch for the new task, and later just retrieve the old work."',
    "stash.level2.story.realWorldContext":
        "**Stash in Team Life**\n\nDevelopers often juggle multiple tasks:\n\n- Sprint Planning changes priorities\n- Urgent bugs interrupt features\n- Code reviews require context switches\n- Meetings interrupt flow\n\n**Git Stash makes context-switching painless!**\n\nWithout Stash you'd have to either:\n- Commit unfinished code (bad for history)\n- Discard changes (work lost)\n- Stay in dirty state (can't switch)\n\nWith Stash: Save, switch, work, return - all clean! ✨",
    "stash.level2.story.taskIntroduction":
        "Stash your work, switch to main, create new branch, return to old task and retrieve your work.",

    "stash.level3.name": "Managing Stashes",
    "stash.level3.description": "Learn to list and manage stash entries",
    "stash.level3.objective1": "List stashes and apply them",
    "stash.level3.hint1": "Use `git stash list` to see all stashes",
    "stash.level3.hint2": "Retrieve stash with `git stash pop`",
    "stash.level3.requirement1.description": "List all stash entries",
    "stash.level3.requirement1.success": "Stashes displayed!",
    "stash.level3.requirement2.description": "Retrieve latest stash",
    "stash.level3.requirement2.success": "Stash restored!",
    "stash.level3.story.title": "Stash Organization",
    "stash.level3.story.narrative":
        '"Wait, where did I stash those changes again?", you wonder.\n\n"Use `git stash list`," says Lisa. "It shows all saved stashes. With `git stash pop` you retrieve the latest and remove it from the stash."\n\nShe continues: "There\'s also `git stash apply` - it applies the stash but keeps it. Useful when you need the same changes multiple times!"',
    "stash.level3.story.realWorldContext":
        "**Stash Management Commands**\n\n`git stash list` - Shows all stashes\n\n`git stash pop` - Applies and deletes stash\n\n`git stash apply` - Applies stash, keeps it\n\n`git stash drop` - Deletes a stash\n\n`git stash clear` - Deletes all stashes\n\n**Pro Tip**: Name your stashes with `git stash push -m \"WIP: Feature X\"` - makes the list more organized!",
    "stash.level3.story.taskIntroduction": "List your stashes and retrieve the latest one.",

    // Remote Stage
    "remote.name": "Remote Repositories",
    "remote.description": "Learn to work with remote repositories",

    // Remote Level 1
    "remote.level1.name": "Adding Remotes",
    "remote.level1.description": "Connect to a remote repository",
    "remote.level1.objective1": "Add a remote repository",
    "remote.level1.hint1": "Use the `git remote add <name> <url>` command",
    "remote.level1.hint2": "The convention is to name your main remote 'origin'",
    "remote.level1.requirement1.description": "Add a remote repository",
    "remote.level1.requirement1.success": "Excellent! You've added a remote repository.",
    "remote.level1.story.title": "Connecting Repositories",
    "remote.level1.story.narrative":
        '"Great progress so far! Now it\'s time to connect your local repository to a remote one," says Alex. "This will allow you to share your code with the team and collaborate effectively."\n\nHe explains: "The first step is to add a connection to the remote repository using `git remote add`. This doesn\'t transfer any code yet—it just creates the connection."',
    "remote.level1.story.realWorldContext":
        "Remote repositories are central to collaborative development workflows. Most Git-based systems like GitHub, GitLab, and Bitbucket work by hosting remote repositories that team members connect to.",
    "remote.level1.story.taskIntroduction": "Add a remote named 'origin' to your repository.",

    // Remote Level 2
    "remote.level2.name": "Pushing Commits to Remote",
    "remote.level2.description": "Learn when and how to upload your commits",
    "remote.level2.objective1": "Push your local commits to the remote repository",
    "remote.level2.objective2": "Understand the difference between local commit and remote push",
    "remote.level2.hint1": "Use `git push origin main` to push to the main branch",
    "remote.level2.hint2":
        "IMPORTANT: Push AFTER you've made a commit! Push uploads your commits, not individual files.",
    "remote.level2.hint3": "Tip: Use `git log` to see what commits you have",
    "remote.level2.requirement1.description": "Push your commits to the remote",
    "remote.level2.requirement1.success": "Perfect! Your commits are now available in the remote repository.",
    "remote.level2.story.title": "From Local to Remote Repository",
    "remote.level2.story.narrative":
        '"Let me show you how the Git workflow works," Alex says, drawing a diagram:\n\n1️⃣ You change files (Working Directory)\n2️⃣ You stage them with `git add` (Staging Area)\n3️⃣ You commit them with `git commit` (Local Repository)\n4️⃣ You push with `git push` (Remote Repository)\n\n"Important to understand: git push uploads your COMMITS, not individual files! You must make a commit before you can push. Your local commits only exist on your computer until you push them."',
    "remote.level2.story.realWorldContext":
        "The difference between local and remote repository is fundamental: Local commits only exist on your machine. Only through git push do they become visible to your team. This means: You can make as many local commits as you want and then push them all at once!",
    "remote.level2.story.taskIntroduction":
        "You've already made a commit. Now push this commit to the remote repository using `git push origin main`.",

    "remote.level3.name": "Push Feature Branch",
    "remote.level3.description": "Push a feature branch to the remote repository",
    "remote.level3.objective1": "Push your feature branch with all its commits",
    "remote.level3.hint1": "Use `git push origin <branch-name>`",
    "remote.level3.hint2": "You can also use `git push -u origin <branch-name>` to set the upstream",
    "remote.level3.requirement1.description": "Push a feature branch to the remote",
    "remote.level3.requirement1.success": "Excellent! Your feature branch is now available in the remote repository.",
    "remote.level3.story.title": "Sharing Features",
    "remote.level3.story.narrative":
        '"You\'ve been working on a great new feature on a separate branch," Sarah says. "Now it\'s time to push this branch to the remote repository so other team members can see and review your work."\n\nShe explains: "When pushing a branch for the first time, you should use the -u (or --set-upstream) option. This links your local branch with the remote branch, making future pushes and pulls easier."',
    "remote.level3.story.realWorldContext":
        "In professional teams, new features are typically developed on separate branches and then pushed for review before being merged into the main codebase. This is a central part of the pull request workflow.",
    "remote.level3.story.taskIntroduction": "Push your feature branch to the remote repository so others can see it.",

    // Reset Stage
    "reset.name": "Undoing Commits",
    "reset.description": "Learn how to undo commits using git reset",

    "reset.level1.name": "Soft Reset - Keep Changes",
    "reset.level1.description": "Go back to a previous commit but keep your changes",
    "reset.level1.objective1": "Use git reset --soft to undo a commit",
    "reset.level1.hint1": "Use `git reset --soft HEAD~1`",
    "reset.level1.hint2": "HEAD~1 means 'one commit before the current one'",
    "reset.level1.requirement1.description": "Undo a commit using --soft",
    "reset.level1.requirement1.success": "Great! The changes are still staged, but the commit has been undone.",
    "reset.level1.story.title": "Fixing a Mistake",
    "reset.level1.story.narrative":
        '"Oh no!", Alex exclaims. "I just noticed the last commit has an error in the commit message and the config file is wrong. Fortunately, there\'s git reset --soft!"\n\nHe explains: "With --soft, you can go back to a previous commit, but all your changes stay in the staging area. This is perfect when you just want to change the commit message or add/remove files from the commit."',
    "reset.level1.story.realWorldContext":
        "git reset --soft is super useful when you want to fix your last commit without losing the work. You can edit the changes and then commit again.",
    "reset.level1.story.taskIntroduction": "Use git reset --soft HEAD~1 to undo the last commit but keep the changes.",

    "reset.level2.name": "Hard Reset - Discard Everything",
    "reset.level2.description": "Go back to a previous commit and discard all changes",
    "reset.level2.objective1": "Use git reset --hard to discard commits and changes",
    "reset.level2.hint1": "Use `git reset --hard HEAD~1`",
    "reset.level2.hint2": "WARNING: All changes since that commit will be lost!",
    "reset.level2.hint3": "In real life: Be careful with --hard, it can destroy work!",
    "reset.level2.requirement1.description": "Discard commits using --hard",
    "reset.level2.requirement1.success": "The commit and all changes have been completely removed!",
    "reset.level2.story.title": "Making a Fresh Start",
    "reset.level2.story.narrative":
        '"Sometimes experimental code goes completely wrong," Alex says seriously. "The last commit introduced bugs and the codebase is now unstable. We need to completely go back to the last working version."\n\nHe warns: "git reset --hard is like rewinding time. It removes commits AND discards all changes in the working directory. Use it with caution!"',
    "reset.level2.story.realWorldContext":
        "--hard reset is a powerful but dangerous tool. It\'s used when you really need a clean slate. In teams, be careful with reset on pushed commits - it can confuse others.",
    "reset.level2.story.taskIntroduction": "Use git reset --hard HEAD~1 to return to the previous commit and discard everything.",

    "reset.level3.name": "Reset to Specific Commit",
    "reset.level3.description": "Go back to a specific commit in history",
    "reset.level3.objective1": "Use git reset with a commit hash or HEAD~n",
    "reset.level3.hint1": "Use `git log` to see commits and their hashes",
    "reset.level3.hint2": "Then use `git reset --soft HEAD~2` to go back two commits",
    "reset.level3.requirement1.description": "Reset to an earlier commit",
    "reset.level3.requirement1.success": "Perfect! You can now return to any point in history.",
    "reset.level3.story.title": "Time Travel in Git",
    "reset.level3.story.narrative":
        '"Sometimes you need to go back multiple commits," Sarah explains. "You can use HEAD~2 for two commits back, HEAD~3 for three, and so on. Or you can use the specific commit hash."\n\nShe shows you: "git log shows you all commits with their hashes. You can then use git reset <hash> to go back to that exact point."',
    "reset.level3.story.realWorldContext":
        "The ability to return to any point in history is one of Git\'s most powerful features. It gives you safety when experimenting - you can always go back.",
    "reset.level3.story.taskIntroduction": "Use git reset to go back to an earlier commit in history.",

    // Rebase Stage
    "rebase.name": "Rebasing",
    "rebase.description": "Learn how to rebase branches",

    // Rebase Level 1
    "rebase.level1.name": "Basic Rebasing",
    "rebase.level1.description": "Apply commits from one branch onto another",
    "rebase.level1.objective1": "Rebase the current branch onto another branch",
    "rebase.level1.hint1": "Use the `git rebase <branch>` command",
    "rebase.level1.hint2": "This rewrites history by applying your commits on top of the target branch",
    "rebase.level1.requirement1.description": "Rebase onto another branch",
    "rebase.level1.requirement1.success": "Great job! You've successfully rebased the branch.",
    "rebase.level1.story.title": "Creating a Clean History",
    "rebase.level1.story.narrative":
        '"I see you\'re getting comfortable with merging," says Sarah. "Now let\'s explore a different approach to integrating changes: rebasing."\n\nShe explains: "While merging combines histories, rebasing rewrites it by moving your commits to appear after the commits from another branch. This creates a more linear, cleaner history."',
    "rebase.level1.story.realWorldContext":
        "Rebasing is often preferred when you want to maintain a clean, linear project history. Many teams use it to integrate feature branches before merging them to the main branch.",
    "rebase.level1.story.taskIntroduction": "Try rebasing your current branch onto another branch.",

    // Rebase Level 2
    "rebase.level2.name": "Handling Rebase Conflicts",
    "rebase.level2.description": "Learn how to handle or abort rebases with conflicts",
    "rebase.level2.objective1": "Abort a rebase with conflicts",
    "rebase.level2.hint1": "Use the `git rebase --abort` command",
    "rebase.level2.hint2": "This will stop the rebase process and return to the state before the rebase began",
    "rebase.level2.requirement1.description": "Abort a rebase with conflicts",
    "rebase.level2.requirement1.success": "Excellent! You've successfully aborted the rebase operation.",
    "rebase.level2.story.title": "When Rebases Get Complicated",
    "rebase.level2.story.narrative":
        '"Just like merging, rebasing can lead to conflicts," Alex points out. "But resolving conflicts during a rebase can be more complex because Git applies each of your commits one by one."\n\nHe continues: "If you\'re in the middle of a rebase and decide it\'s too complex or you need to rethink your approach, you can always abort the process."',
    "rebase.level2.story.realWorldContext":
        "Knowing when and how to abort a rebase is important in real-world development. Sometimes the conflicts are too complex to resolve immediately, or you realize a different strategy would be better.",
    "rebase.level2.story.taskIntroduction": "Practice aborting a rebase operation using git rebase --abort.",

    // Rebase Level 3
    "rebase.level3.name": "Interactive Rebasing",
    "rebase.level3.description": "Learn how to use interactive rebasing to modify commit history",
    "rebase.level3.objective1": "Start an interactive rebase session",
    "rebase.level3.hint1": "Use the `git rebase -i` command",
    "rebase.level3.hint2": "Interactive rebasing allows you to reorder, edit, squash, or delete commits",
    "rebase.level3.requirement1.description": "Start an interactive rebase",
    "rebase.level3.requirement1.success": "Perfect! You've started an interactive rebase session.",
    "rebase.level3.story.title": "Cleaning Up History",
    "rebase.level3.story.narrative":
        '"Your feature is looking good," says Alex, reviewing your code. "But I notice you have several small commits with typo fixes and minor changes. Before we merge this to main, let\'s clean up the commit history."\n\nHe explains, "Git offers a powerful tool called interactive rebasing that lets you modify your commit history. You can combine small commits, reword commit messages, or even delete commits entirely."',
    "rebase.level3.story.realWorldContext":
        "Interactive rebasing is commonly used to create a clean, coherent commit history before merging feature branches. This makes the codebase history more readable and meaningful.",
    "rebase.level3.story.taskIntroduction": "Start an interactive rebase session to modify your commit history.",

    // Rebase Level 4
    "rebase.level4.name": "Rebasing onto Main",
    "rebase.level4.description": "Learn the workflow of rebasing feature branches onto updated main branches",
    "rebase.level4.objective1": "Rebase your feature branch onto the updated main branch",
    "rebase.level4.hint1": "Use `git rebase main` while on your feature branch",
    "rebase.level4.hint2": "This will apply your feature changes on top of the latest main branch changes",
    "rebase.level4.requirement1.description": "Rebase feature onto main",
    "rebase.level4.requirement1.success": "Excellent! You've rebased your feature branch onto the latest main branch.",
    "rebase.level4.story.title": "Staying Up to Date",
    "rebase.level4.story.narrative":
        '"I see that while you\'ve been working on your feature, someone else has pushed changes to the main branch," Sarah points out. "Before we merge your work, you should incorporate these latest changes."\n\nShe continues, "Instead of merging main into your branch, which creates a merge commit, I recommend rebasing your branch onto main. This keeps the history cleaner."',
    "rebase.level4.story.realWorldContext":
        "In collaborative environments, main branches are frequently updated. Rebasing feature branches onto main is a common workflow that helps avoid merge conflicts and keeps feature branches up to date.",
    "rebase.level4.story.taskIntroduction":
        "Rebase your feature branch onto the updated main branch to incorporate the latest changes.",

    // Advanced Stage - Note: Advanced levels use direct text instead of translation keys
    // The content is already in English in the level definitions

};

export default levels;
