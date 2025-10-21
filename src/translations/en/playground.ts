const playground = {
    // Playground
    "playground.title": "Git Playground",
    "playground.subtitle": "Freely experiment with Git commands and learn from the cheat sheet",
    "playground.gitTerminal": "Git Terminal (Free Mode)",
    "playground.gitCheatSheet": "Git Cheat Sheet",
    "playground.searchCommands": "Search Git commands...",
    "playground.usage": "Usage:",
    "playground.example": "Example:",
    "playground.explanation": "Explanation:",
    "playground.noCommands": "No commands found for",
    "playground.resetSearch": "Reset Search",

    // Command Descriptions
    "playground.commands.gitInit.description": "Initializes a new Git repository",
    "playground.commands.gitInit.explanation":
        "This command creates a new Git repository in your current directory. It creates a hidden .git directory that contains all Git metadata.",
    "playground.commands.gitStatus.description": "Shows the status of the repository",
    "playground.commands.gitStatus.explanation":
        "This lets you see the current status of your repository – which files have been changed, which are staged, etc.",
    "playground.commands.gitAdd.description": "Adds file contents to the index",
    "playground.commands.gitAdd.explanation":
        "With this command, you mark changes for the next commit. Use 'git add .' to mark all changes in the current directory.",
    "playground.commands.gitCommit.description": "Records changes to the repository",
    "playground.commands.gitCommit.explanation":
        "Creates a new commit with all staged changes. The message should be a short, precise description of what was changed.",
    "playground.commands.gitConfig.description": "Configure Git settings",
    "playground.commands.gitConfig.explanation":
        "Sets configuration values for your user name, email, editor, and other preferences. Use --global to apply settings to all repositories.",
    "playground.commands.gitHelp.description": "Display help information",
    "playground.commands.gitHelp.explanation":
        "Shows detailed help information for any Git command. You can also use 'git <command> --help' for the same information.",
    "playground.commands.gitBranch.description": "Lists, creates, or deletes branches",
    "playground.commands.gitBranch.explanation":
        "Without parameters, this command lists all existing branches. With a name, it creates a new branch (but doesn't switch to it).",
    "playground.commands.gitCheckout.description": "Switches branches or restores files",
    "playground.commands.gitCheckout.explanation":
        "Switches to another branch. With '-b', it creates a new branch and immediately switches to it.",
    "playground.commands.gitMerge.description": "Joins two or more development histories",
    "playground.commands.gitMerge.explanation":
        "Integrates changes from the specified branch into the current branch. This creates a merge commit if it's not a fast-forward situation.",
    "playground.commands.gitSwitch.description": "Switch to a specified branch",
    "playground.commands.gitSwitch.explanation":
        "Modern alternative to 'git checkout' for switching branches. Use '-c' to create and switch to a new branch in one command.",
    "playground.commands.gitBranchDelete.description": "Delete a branch",
    "playground.commands.gitBranchDelete.explanation":
        "Deletes the specified branch if it has been fully merged. Use '-D' instead of '-d' to force deletion even if not merged.",
    "playground.commands.gitLog.description": "Shows the commit history",
    "playground.commands.gitLog.explanation":
        "Shows the commit history with details like author, date, and message. Many options are available to customize the output format.",
    "playground.commands.gitDiff.description": "Show changes between commits",
    "playground.commands.gitDiff.explanation":
        "Shows the differences between two commits, commit and working tree, etc. Without arguments, shows changes in the working directory that aren't staged.",
    "playground.commands.gitShow.description": "Show various Git objects",
    "playground.commands.gitShow.explanation":
        "Shows information about a git object. For commits, shows the commit message and the differences it introduced.",
    "playground.commands.gitBlame.description": "Show who changed what in a file",
    "playground.commands.gitBlame.explanation":
        "Shows who made each change to a file, line by line, and in which commit. Useful for understanding the history of a specific file.",
    "playground.commands.gitClone.description": "Clones a repository into a new directory",
    "playground.commands.gitClone.explanation":
        "Creates a local copy of a remote repository, including all branches and history.",
    "playground.commands.gitPull.description": "Fetches and integrates changes from a remote repository",
    "playground.commands.gitPull.explanation":
        "Combines 'git fetch' and 'git merge' to fetch changes from a remote branch and integrate them into your current branch.",
    "playground.commands.gitPush.description": "Updates remote references and associated objects",
    "playground.commands.gitPush.explanation":
        "Sends your local commits to a remote repository. Others can then see and fetch your changes.",
    "playground.commands.gitRemote.description": "Manage remote repositories",
    "playground.commands.gitRemote.explanation":
        "Lists, adds, or removes remote repositories. Use 'git remote -v' to see the URLs of your remotes.",
    "playground.commands.gitFetch.description": "Download objects and refs from remote",
    "playground.commands.gitFetch.explanation":
        "Downloads all branches and commits from a remote repository without merging them into your local branches.",
    "playground.commands.gitRestore.description": "Restore working tree files",
    "playground.commands.gitRestore.explanation":
        "Undoes changes to your working tree (with no options) or removes files from the staging area (with --staged).",
    "playground.commands.gitReset.description": "Reset current HEAD to a specific state",
    "playground.commands.gitReset.explanation":
        "Resets your branch to a specific commit. --soft keeps changes in staging area, --mixed (default) unstages them, --hard discards all changes.",
    "playground.commands.gitRevert.description": "Create commit that undoes changes",
    "playground.commands.gitRevert.explanation":
        "Creates a new commit that undoes the changes made by an earlier commit. Safer than reset for shared branches.",
    "playground.commands.gitRebase.description": "Reapplies commits on top of another base",
    "playground.commands.gitRebase.explanation":
        "Transfers your changes onto the latest version of the base branch. This creates a cleaner history than merges.",
    "playground.commands.gitStash.description": "Stashes changes temporarily",
    "playground.commands.gitStash.explanation":
        "Saves your uncommitted changes temporarily, allowing you to return to a clean working directory. Use 'pop' to reapply the stashed changes.",
    "playground.commands.gitTag.description": "Create, list, delete tags",
    "playground.commands.gitTag.explanation":
        "Tags are references to specific points in Git history, typically used for marking version releases. Use with -a for annotated tags.",
    "playground.commands.gitCherryPick.description": "Apply changes from specific commits",
    "playground.commands.gitCherryPick.explanation":
        "Applies the changes from specific commits to your current branch. Useful for selectively bringing changes from one branch to another.",
    "playground.commands.gitBisect.description": "Use binary search to find bugs",
    "playground.commands.gitBisect.explanation":
        "Helps find which commit introduced a bug using binary search. Mark commits as 'good' or 'bad' to narrow down the problem.",
};

export default playground;
