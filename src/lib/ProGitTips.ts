// Pro Git Tips - Useful Git commands and tricks
export const PRO_GIT_TIPS = [
    "💡 Use 'git commit --amend' to modify your last commit message or add forgotten files.",
    "🔍 'git log --oneline --graph' shows a beautiful visual commit history.",
    "⚡ 'git stash' temporarily saves your uncommitted changes without committing.",
    "🌿 'git switch -c <branch>' is the modern way to create and switch to a new branch.",
    "📝 'git diff --staged' shows changes you've staged for commit.",
    "🔄 'git reflog' can help you recover 'lost' commits - Git never truly deletes them!",
    "🎯 'git blame <file>' shows who last modified each line of a file.",
    "🧹 'git clean -n' previews which untracked files would be deleted (use -f to actually delete).",
    "📊 'git shortlog -sn' shows commit counts by author.",
    "🔖 Use semantic commit messages: feat:, fix:, docs:, style:, refactor:, test:, chore:",
    "⏱️ 'git commit --amend --no-edit' amends the last commit without changing the message.",
    "🌳 'git branch --merged' lists branches that have been merged into current branch.",
    "🔍 'git log -S \"text\"' searches for commits that added or removed specific text.",
    "📦 'git stash pop' applies and removes the most recent stash.",
    "🎨 'git log --pretty=format:\"%h %an %ar - %s\"' creates custom formatted logs.",
    "🔄 'git reset --soft HEAD~1' undoes the last commit but keeps changes staged.",
    "🌟 'git cherry-pick <commit>' applies a specific commit from another branch.",
    "📝 'git config --global alias.<alias> <command>' creates custom Git shortcuts.",
    "🔍 'git bisect' uses binary search to find the commit that introduced a bug.",
    "💾 'git stash save \"description\"' creates a named stash for better organization.",
    "🎯 'git rebase -i HEAD~3' interactively rebases the last 3 commits (squash, reorder, edit).",
    "🔧 'git restore --staged <file>' unstages a file without losing changes.",
    "📊 'git log --author=\"<name>\" --oneline' filters commits by author.",
    "🌈 'git diff --color-words' shows word-level differences instead of line-level.",
    "⚡ 'git add -p' lets you stage parts of files interactively (patch mode).",
];

export function getRandomGitTip(): string {
    const randomIndex = Math.floor(Math.random() * PRO_GIT_TIPS.length);
    return PRO_GIT_TIPS[randomIndex] || PRO_GIT_TIPS[0]!;
}

export function getRandomGitTips(count: number): string[] {
    const shuffled = [...PRO_GIT_TIPS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, PRO_GIT_TIPS.length));
}
