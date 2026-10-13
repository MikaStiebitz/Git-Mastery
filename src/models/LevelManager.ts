import type { FileSystem } from "./FileSystem";
import type { GitRepository } from "./GitRepository";
import type {
    StageType,
    LevelType,
    LevelRequirement,
    FileStructure,
    GitState,
    FileChange,
    MergeConflict,
    DifficultyLevel,
} from "~/types";
import { allStages } from "../levels";
import { getAvailableStagesForDifficulty } from "~/config/difficulties";

/** True if `arg` is a clustered short-flag group (e.g. `-am`) containing the short flag `reqArg` (e.g. `-m`). */
function clusterHasFlag(arg: string, reqArg: string): boolean {
    return /^-[A-Za-z]{2,}$/.test(arg) && arg.includes(reqArg.slice(1));
}

/** Spellings of the same Git option, so a requirement for one accepts the other. */
const FLAG_SYNONYMS: Record<string, string[]> = {
    "-u": ["--set-upstream"],
    "--set-upstream": ["-u"],
    "-i": ["--interactive"],
    "--interactive": ["-i"],
    "--staged": ["--cached"],
    "--cached": ["--staged"],
    "-m": ["--message"],
    "--message": ["-m"],
    "-f": ["--force"],
    "--force": ["-f"],
    "-d": ["--delete"],
    "--delete": ["-d"],
    "-v": ["--verbose"],
    "--verbose": ["-v"],
    "-s": ["--short"],
    "--short": ["-s"],
    "-p": ["--patch"],
    "--patch": ["-p"],
    "-q": ["--quiet"],
    "--quiet": ["-q"],
};
export class LevelManager {
    private stages: Record<string, StageType>;

    constructor() {
        this.stages = allStages;
    }

    // Setup the environment for a specific level
    public setupLevel(stageId: string, levelId: number, fileSystem: FileSystem, gitRepository: GitRepository): boolean {
        try {
            const level = this.getLevel(stageId, levelId);
            if (!level) return false;

            // Reset the file system to a clean state
            this.resetFileSystem(fileSystem);
            this.resetGitRepository(gitRepository);
            this.resetLevelState(level);

            // Set up initial file structure based on the level configuration
            if (level.initialState?.files !== undefined) {
                // If files array is provided (even if empty)
                if (level.initialState.files.length > 0) {
                    // Set up the specified files
                    this.setupFileStructure(fileSystem, level.initialState.files);
                }
                // If files is an empty array, don't create any files
            } else {
                // Default file structure if files property is not specified
                this.setupDefaultFileStructure(fileSystem);
            }

            // Set up git state if provided - check for success
            if (level.initialState?.git) {
                const gitSetupSuccess = this.setupGitState(gitRepository, fileSystem, level.initialState.git);
                if (!gitSetupSuccess) {
                    console.error(`Failed to setup git state for level ${stageId}-${levelId}`);
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error(`Error setting up level ${stageId}-${levelId}:`, error);
            return false;
        }
    }

    /**
     * Reset the file system to a clean state.
     *
     * This has to actually clear the tree, not just ensure "/" exists. Anything a previous level
     * created dynamically — a directory from `git clone`, a file from `touch` — otherwise survives
     * into every later level, where it shows up as untracked noise in `git status`, inflates
     * `git add .`, and can make `git diff` report a file the current level has never mentioned.
     */
    private resetFileSystem(fileSystem: FileSystem): void {
        fileSystem.reset();
        fileSystem.mkdir("/");
    }

    private resetGitRepository(gitRepository: GitRepository): void {
        gitRepository.reset();
    }

    private resetLevelState(level: LevelType): void {
        level.completedRequirements = [];
    }

    // Set up the file structure based on configuration
    private setupFileStructure(fileSystem: FileSystem, files: FileStructure[]): void {
        for (const file of files) {
            // Create parent directories if they don't exist
            const dirPath = this.getDirectoryPath(file.path);
            if (dirPath && dirPath !== "/") {
                fileSystem.mkdir(dirPath);
            }

            // Create the file with content
            fileSystem.writeFile(file.path, file.content);
        }
    }

    // Set up default file structure
    private setupDefaultFileStructure(fileSystem: FileSystem): void {
        fileSystem.writeFile("/README.md", "# Git Learning Game\n\nWelcome to the Git learning game!");
        fileSystem.mkdir("/src");
        fileSystem.writeFile("/src/index.js", 'console.log("Hello, Git!");');
    }

    // Set up git state based on configuration
    private setupGitState(gitRepository: GitRepository, fileSystem: FileSystem, gitState: GitState): boolean {
        try {
            if (!gitState.initialized) return true;

            gitRepository.init();
            // Commits a level sets up are by "the team", not by the player.
            gitRepository.setSetupMode(true);

            // Set up remotes. A level that declares them gets exactly those — including none at
            // all, which is what a level teaching `git remote add origin` needs, since an origin
            // that already exists makes the command the level asks for fail as "already exists".
            if (gitState.remotes) {
                for (const [name, url] of Object.entries(gitState.remotes)) {
                    gitRepository.addRemote(name, url);
                }
            } else if (Object.keys(gitRepository.getRemotes()).length === 0) {
                gitRepository.addRemote("origin", "https://github.com/user/repo.git");
            }
            if ("origin" in gitRepository.getRemotes()) {
                gitRepository.setUpstream("main", "origin", "main");
            }

            // A conflict the level wants to start in: each side's commits carry that side's version
            // of the file, so the merge (or rebase) below conflicts for real.
            const conflictSides = this.conflictSides(gitState.mergeConflicts ?? []);

            // In real Git a branch cannot exist before there is a commit for it to point at, so the
            // branches a level lists are created lazily: the first commit that names a branch forks
            // it from wherever HEAD is at that moment; the rest are created once history exists.
            const pending = new Set(gitState.branches ?? []);

            // Spread the history over the past days, one day per commit, like a real project's.
            const setupCommits = gitState.commits ?? [];
            const realCommits = setupCommits.filter(c => c.message).length;
            let commitIndex = 0;

            for (const commit of setupCommits) {
                if (commit.branch && commit.branch !== gitRepository.getCurrentBranch()) {
                    if (!gitRepository.getBornBranches().includes(commit.branch)) {
                        if (gitRepository.getHeadCommitId() === null) {
                            // Nothing to fork from yet: just start history on this branch.
                            gitRepository.setUnbornBranch(commit.branch);
                        } else {
                            gitRepository.createBranch(commit.branch);
                        }
                    }
                    pending.delete(commit.branch);
                    const checkoutResult = gitRepository.checkout(commit.branch);
                    if (!checkoutResult.success) {
                        console.warn(`Failed to checkout branch: ${commit.branch}`);
                        return false;
                    }
                }

                // Only commit if there's a message (empty message = just switch branch)
                if (!commit.message) continue;

                for (const [filePath, content] of Object.entries(commit.contents ?? {})) {
                    fileSystem.writeFile(filePath.startsWith("/") ? filePath : `/${filePath}`, content);
                }
                for (const filePath of commit.files) {
                    const side = conflictSides.get(this.normalizeLevelPath(filePath));
                    if (side && commit.branch) {
                        const version =
                            commit.branch === side.theirsBranch
                                ? side.theirs
                                : commit.branch === side.oursBranch
                                  ? side.ours
                                  : undefined;
                        if (version !== undefined) fileSystem.writeFile(filePath, version);
                    }
                    gitRepository.addFile(filePath);
                }

                // Setup history may record a commit whose files did not change (or none at all, as
                // a branch marker); real Git would need --allow-empty for that, so allow it here.
                commitIndex++;
                const commitId = gitRepository.commit(commit.message, true, {
                    author: commit.author ? this.parseAuthor(commit.author) : undefined,
                    date: new Date(Date.now() - (realCommits - commitIndex + 1) * 86_400_000),
                });
                if (!commitId) {
                    console.warn(`Failed to create commit: ${commit.message}`);
                    return false;
                }
            }

            // Remaining branches point at the branch the level starts on (or HEAD), so a branch that
            // "was merged" really is merged into it.
            const base =
                (gitState.currentBranch ? gitRepository.getBranchTip(gitState.currentBranch) : null) ??
                gitRepository.getHeadCommitId();
            if (base !== null) {
                for (const branch of pending) {
                    if (!gitRepository.getBornBranches().includes(branch) && branch !== gitRepository.getBranchName()) {
                        gitRepository.createBranch(branch, base);
                    }
                }
            }

            // Switch to the specified branch if provided
            if (gitState.currentBranch && gitState.currentBranch !== gitRepository.getCurrentBranch()) {
                const checkoutResult = gitRepository.checkout(gitState.currentBranch);
                if (!checkoutResult.success) {
                    console.warn(`Failed to checkout final branch: ${gitState.currentBranch}`);
                    return false;
                }
            }

            // "Someone" threw the last commits away with `git reset --hard` — they now live only in
            // the reflog, which is exactly what a recovery level needs.
            if (gitState.lostCommits) {
                const target = gitRepository.resolveCommit(`HEAD~${gitState.lostCommits}`);
                if (target) gitRepository.resetTo(target, "hard", `HEAD~${gitState.lostCommits}`);
            }

            // Leave the repository in the middle of a conflicted merge or rebase
            if (gitState.mergeConflicts && gitState.mergeConflicts.length > 0) {
                this.setupMergeConflicts(
                    gitRepository,
                    fileSystem,
                    gitState.mergeConflicts,
                    gitState.inProgress ?? "merge",
                );
            }

            // Stashes saved earlier, oldest first.
            for (const stash of gitState.stashes ?? []) {
                this.applyFileChanges(gitRepository, fileSystem, stash.changes);
                gitRepository.stashSave(stash.message);
            }

            // Apply file changes to create modified/untracked/deleted files
            if (gitState.fileChanges) {
                this.applyFileChanges(gitRepository, fileSystem, gitState.fileChanges);
            }

            // Set up remote commits if specified
            if (gitState.remoteCommits) {
                for (const remoteCommitSet of gitState.remoteCommits) {
                    gitRepository.setRemoteCommits(remoteCommitSet.branch, remoteCommitSet.commits);
                }
            }

            gitRepository.setSetupMode(false);
            return true;
        } catch (error) {
            console.error("Error during git state setup:", error);
            gitRepository.setSetupMode(false);
            return false;
        }
    }

    /** "Sarah Chen <sarah@x.org>" or "Sarah Chen" → name and email. */
    private parseAuthor(author: string): { name: string; email: string } {
        const match = /^(.*?)\s*<([^>]+)>$/.exec(author.trim());
        if (match) return { name: match[1]!, email: match[2]! };
        const name = author.trim();
        return { name, email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com` };
    }

    private normalizeLevelPath(path: string): string {
        return path.replace(/^\/+/, "");
    }

    /**
     * Split a level's conflict text into the two full file versions it describes: everything outside
     * the markers plus the "ours" (or "theirs") half of each conflict block.
     */
    private conflictSides(
        conflicts: MergeConflict[],
    ): Map<string, { ours: string; theirs: string; oursBranch?: string; theirsBranch?: string }> {
        const sides = new Map<string, { ours: string; theirs: string; oursBranch?: string; theirsBranch?: string }>();
        for (const conflict of conflicts) {
            if (!conflict.branch1 || !conflict.branch2) continue;
            const ours: string[] = [];
            const theirs: string[] = [];
            let section: "both" | "ours" | "theirs" = "both";
            for (const line of conflict.content.split("\n")) {
                if (line.startsWith("<<<<<<<")) section = "ours";
                else if (line.startsWith("=======") && section === "ours") section = "theirs";
                else if (line.startsWith(">>>>>>>") && section === "theirs") section = "both";
                else {
                    if (section !== "theirs") ours.push(line);
                    if (section !== "ours") theirs.push(line);
                }
            }
            const trim = (lines: string[]) => lines.join("\n").replace(/^\n+/, "").replace(/\n+$/, "");
            sides.set(this.normalizeLevelPath(conflict.file), {
                ours: trim(ours),
                theirs: trim(theirs),
                oursBranch: conflict.branch1,
                theirsBranch: conflict.branch2,
            });
        }
        return sides;
    }

    /**
     * Leave the level in the middle of a conflicted merge (or rebase), the state a real `git merge`
     * stops in: MERGE_HEAD set, the file unmerged and carrying conflict markers. `git merge --abort`,
     * `git status`, `git add` and the concluding `git commit` then all behave as they would for real.
     */
    private setupMergeConflicts(
        gitRepository: GitRepository,
        fileSystem: FileSystem,
        conflicts: MergeConflict[],
        operation: "merge" | "rebase",
    ): void {
        const withBranches = conflicts.find(c => c.branch1 && c.branch2);

        if (withBranches?.branch1 && withBranches.branch2) {
            const ours = withBranches.branch1;
            const theirs = withBranches.branch2;
            const oursId = gitRepository.getBranchTip(ours);
            const theirsId = gitRepository.getBranchTip(theirs);

            if (oursId && theirsId) {
                if (operation === "rebase") {
                    // Rebase `theirs` onto `ours` and stop at the first conflict.
                    gitRepository.checkout(theirs);
                    const commits = gitRepository.rebaseCommits(oursId, theirsId);
                    gitRepository.beginRebaseConflict({ onto: oursId, ontoLabel: ours, commits });
                    if (gitRepository.getRebaseState()) return;
                } else {
                    if (gitRepository.getCurrentBranch() !== ours) gitRepository.checkout(ours);
                    const outcome = gitRepository.mergeCommit(theirsId, { label: theirs, ff: "no-ff", noCommit: true });
                    if (outcome.kind === "conflict") return;
                    // The two versions merged cleanly after all; fall through to writing the
                    // level's conflict text by hand so the level still starts where it says.
                    gitRepository.abortMerge();
                    gitRepository.beginMergeState(
                        theirsId,
                        theirs,
                        conflicts.map(c => this.normalizeLevelPath(c.file)),
                    );
                    for (const conflict of conflicts) {
                        fileSystem.writeFile(
                            conflict.file,
                            conflict.content.replace(/>>>>>>> branch-name/g, `>>>>>>> ${theirs}`),
                        );
                    }
                    return;
                }
            }
        }

        // No branch information: just leave the conflicted text in the working tree.
        for (const conflict of conflicts) {
            if (conflict.file && conflict.content) {
                fileSystem.writeFile(conflict.file, conflict.content);
            }
        }
    }

    // Apply file changes to create modified/untracked/deleted files
    private applyFileChanges(gitRepository: GitRepository, fileSystem: FileSystem, changes: FileChange[]): void {
        for (const change of changes) {
            switch (change.status) {
                case "modified":
                    if (change.path && change.content) {
                        fileSystem.writeFile(change.path, change.content);
                    }
                    break;
                case "untracked":
                    // Create new untracked file (only if content is provided)
                    if (change.path && change.content) {
                        fileSystem.writeFile(change.path, change.content);
                    }
                    gitRepository.updateFileStatus(change.path, "untracked");
                    break;
                case "deleted":
                    if (change.path) {
                        fileSystem.delete(change.path);
                    }
                    break;
                case "staged":
                    // Stage file (create it first if content is provided)
                    if (change.path) {
                        if (change.content) {
                            fileSystem.writeFile(change.path, change.content);
                        }
                        gitRepository.addFile(change.path);
                    }
                    break;
                case "committed":
                    // Make sure the file is part of history: commit it if it is not tracked yet.
                    if (change.path) {
                        if (change.content) fileSystem.writeFile(change.path, change.content);
                        if (!gitRepository.isFileTracked(change.path)) {
                            gitRepository.addFile(change.path);
                            gitRepository.commit(`Add ${this.normalizeLevelPath(change.path)}`);
                        }
                    }
                    break;
            }
        }
    }

    // Helper to extract directory path from a file path
    private getDirectoryPath(filePath: string): string {
        const lastSlashIndex = filePath.lastIndexOf("/");
        if (lastSlashIndex === -1) return "/";
        return filePath.substring(0, lastSlashIndex) || "/";
    }

    // Evaluate repository-state guards for a requirement.
    // Returns true if every guard that is defined passes (and true when none are defined),
    // so it can be AND-combined with command/argument matching.
    public passesStateGuards(requirement: LevelRequirement, gitRepository: GitRepository): boolean {
        // Tag must exist (specific name, or "*" for any tag)
        if (requirement.checkTagExists !== undefined) {
            const tags = gitRepository.getTags();
            if (requirement.checkTagExists === "*") {
                if (tags.size === 0) return false;
            } else if (!tags.has(requirement.checkTagExists)) {
                return false;
            }
        }

        // A merge commit must exist in the current branch's history
        if (requirement.checkMergeExists) {
            const history = new Set(gitRepository.getCommitHistory());
            const allCommits = gitRepository.getAllCommits();
            const hasMerge = Object.entries(allCommits).some(
                ([id, commit]) => history.has(id) && (commit.isMergeCommit || (commit.parents?.length ?? 0) > 1),
            );
            if (!hasMerge) return false;
        }

        // Current branch must have at least N commits
        if (requirement.checkCommitCountAtLeast !== undefined) {
            if (gitRepository.getCommitHistory().length < requirement.checkCommitCountAtLeast) {
                return false;
            }
        }

        // Some commit on the current branch must contain this substring
        if (requirement.checkCommitMessageContains !== undefined) {
            const needle = requirement.checkCommitMessageContains.toLowerCase();
            const history = gitRepository.getCommitHistory();
            const commits = gitRepository.getCommits();
            const found = history.some(id => commits[id]?.message.toLowerCase().includes(needle));
            if (!found) return false;
        }

        return true;
    }

    /**
     * Verify what a command actually did, after it matched a requirement textually.
     *
     * Matching the typed command is not enough on its own: `git branch -c feature` and
     * `git switch -c feature` both look like "create a branch", but only one of them puts you on it,
     * and `git remote add` only counts if a remote exists afterwards. These guards close that gap, so
     * a command that ran but achieved nothing no longer completes an objective.
     *
     * Returns true when the requirement declares no result guards, so existing levels are unaffected.
     */
    private passesResultGuards(requirement: LevelRequirement, gitRepository: GitRepository): boolean {
        if (requirement.checkRemoteExists !== undefined) {
            const remotes = Object.keys(gitRepository.getRemotes());
            if (requirement.checkRemoteExists === "*") {
                if (remotes.length === 0) return false;
            } else if (!remotes.includes(requirement.checkRemoteExists)) {
                return false;
            }
        }

        if (requirement.checkCurrentBranch !== undefined) {
            if (gitRepository.getCurrentBranch() !== requirement.checkCurrentBranch) return false;
        }

        if (requirement.checkCurrentBranchNot !== undefined) {
            if (gitRepository.getCurrentBranch() === requirement.checkCurrentBranchNot) return false;
        }

        if (requirement.checkAllFilesStaged) {
            if (!this.areAllFilesStaged(gitRepository)) return false;
        }

        if (requirement.checkDiffHasContent) {
            // Real `git diff` shows tracked-but-unstaged changes; `--staged` shows staged ones.
            // Neither ever shows an untracked file, which is exactly the state a stale or leaked
            // repository can be in — every file untracked, nothing to compare against. Without this,
            // "inspect the diff" was satisfied by typing the command over an empty result.
            const wantsStaged = requirement.requiresArgs?.includes("--staged") ?? false;
            const relevant = wantsStaged ? "staged" : "modified";
            const secondary = wantsStaged ? undefined : "deleted";
            const hasContent = Object.values(gitRepository.getWorkingTreeStatus()).some(
                state => state === relevant || (secondary !== undefined && state === secondary),
            );
            if (!hasContent) return false;
        }

        return true;
    }

    // True if this requirement defines any repository-state guard
    private hasStateGuards(requirement: LevelRequirement): boolean {
        return (
            requirement.checkTagExists !== undefined ||
            requirement.checkMergeExists !== undefined ||
            requirement.checkCommitCountAtLeast !== undefined ||
            requirement.checkCommitMessageContains !== undefined
        );
    }

    // Check if all changed files are staged (for git add level)
    private areAllFilesStaged(gitRepository: GitRepository): boolean {
        // The working tree, not the status map: a file Git has never been told about has no status
        // entry, so reading the map directly made untracked files invisible and let "add all files"
        // pass on the first `git add <one-file>`.
        const status = gitRepository.getWorkingTreeStatus();

        let hasStaged = false;
        let hasUnstaged = false;

        for (const [file, fileStatus] of Object.entries(status)) {
            // Skip .git files
            if (file.startsWith("/.git") || file.includes("/.git/") || file.startsWith(".git")) {
                continue;
            }

            if (fileStatus === "staged") {
                hasStaged = true;
            } else if (fileStatus === "modified" || fileStatus === "untracked" || fileStatus === "deleted") {
                hasUnstaged = true;
            }
            // "committed" files are ignored - they don't need to be staged
        }

        // Return true if there's at least one staged file and no unstaged changes
        return hasStaged && !hasUnstaged;
    }

    // Check state-based requirements (file changes, file existence, branch existence)
    public checkStateBasedRequirements(
        stageId: string,
        levelId: number,
        gitRepository: GitRepository,
        fileSystem: FileSystem,
    ): boolean {
        const level = this.getLevel(stageId, levelId);
        if (!level) return false;

        // Initialize completed requirements array if not present
        if (!level.completedRequirements) {
            level.completedRequirements = [];
        }

        // Initialize completed objectives array if not present
        if (!level.completedObjectives) {
            level.completedObjectives = [];
        }

        let anyRequirementCompleted = false;

        // For 'all' logic (sequential), only check the NEXT uncompleted requirement
        let requirementsToCheck;
        if (level.requirementLogic === "all") {
            const nextRequirementIndex = level.requirements.findIndex(
                req => !req.id || !(level.completedRequirements || []).includes(req.id),
            );
            requirementsToCheck = nextRequirementIndex >= 0 ? [level.requirements[nextRequirementIndex]] : [];
        } else {
            requirementsToCheck = level.requirements.filter(
                req => !req.id || !(level.completedRequirements || []).includes(req.id),
            );
        }

        for (const requirement of requirementsToCheck) {
            if (!requirement) continue;

            let stateCheckPassed = false;

            // Check if file has been changed/modified
            if (requirement.checkFileChanged) {
                const filePath = requirement.checkFileChanged;
                const normalizedPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
                const status = gitRepository.getStatus();
                const fileStatus = status[normalizedPath];
                // File is considered changed if it's modified, staged, or untracked (new)
                if (fileStatus === "modified" || fileStatus === "staged" || fileStatus === "untracked") {
                    stateCheckPassed = true;
                }
            }

            // Check if file exists
            if (requirement.checkFileExists) {
                const filePath = requirement.checkFileExists;
                const content = fileSystem.getFileContents(filePath);
                if (content !== null) {
                    stateCheckPassed = true;
                }
            }

            // Check if branch exists
            if (requirement.checkBranchExists) {
                const branches = gitRepository.getBranches();
                if (branches.includes(requirement.checkBranchExists)) {
                    stateCheckPassed = true;
                }
            }

            // Repository-state guards (tags, merges, commit counts, commit messages)
            if (this.hasStateGuards(requirement) && this.passesStateGuards(requirement, gitRepository)) {
                stateCheckPassed = true;
            }

            // If any state check passed, mark requirement as completed
            if (stateCheckPassed && requirement.id && !level.completedRequirements.includes(requirement.id)) {
                level.completedRequirements.push(requirement.id);
                anyRequirementCompleted = true;

                // Check if this completes an objective
                if (requirement.objectiveId !== undefined) {
                    const objectiveRequirements = level.requirements.filter(
                        req => req.objectiveId === requirement.objectiveId,
                    );
                    const allObjectiveRequirementsCompleted = objectiveRequirements.every(
                        req => !req.id || level.completedRequirements?.includes(req.id),
                    );
                    if (
                        allObjectiveRequirementsCompleted &&
                        !level.completedObjectives?.includes(requirement.objectiveId)
                    ) {
                        level.completedObjectives?.push(requirement.objectiveId);
                    }
                }
            }
        }

        // For 'all' logic, check if all requirements have been completed
        if (level.requirementLogic === "all") {
            return level.requirements.every(req => !req.id || level.completedRequirements?.includes(req.id));
        }

        return anyRequirementCompleted;
    }

    // Get all stages with translated content
    public getAllStages(translateFunc?: (key: string) => string): Record<string, StageType> {
        if (!translateFunc) {
            return { ...this.stages };
        }

        // Create a deep copy with translated content
        const translatedStages: Record<string, StageType> = {};

        for (const [stageId, stage] of Object.entries(this.stages)) {
            translatedStages[stageId] = {
                ...stage,
                name: translateFunc(stage.name),
                description: translateFunc(stage.description),
                levels: this.getTranslatedLevels(stage.levels, translateFunc),
            };
        }

        return translatedStages;
    }

    // Get a specific stage with translated content
    public getStage(stageId: string, translateFunc?: (key: string) => string): StageType | null {
        const stage = this.stages[stageId];
        if (!stage) return null;

        if (!translateFunc) {
            return stage;
        }

        return {
            ...stage,
            name: translateFunc(stage.name),
            description: translateFunc(stage.description),
            levels: this.getTranslatedLevels(stage.levels, translateFunc),
        };
    }

    // Get a specific level with translated content
    public getLevel(stageId: string, levelId: number, translateFunc?: (key: string) => string): LevelType | null {
        // Find stage by ID (need to search through stages object)
        // Support both lowercase ID (e.g., "intro") and capitalized key (e.g., "Intro")
        const stageEntry = Object.values(this.stages).find(
            stage => stage.id === stageId || stage.id === stageId.toLowerCase(),
        );
        if (!stageEntry) return null;

        const level = stageEntry.levels[levelId];
        if (!level) return null;

        if (!translateFunc) {
            return level;
        }

        return this.translateLevel(level, translateFunc);
    }

    // Helper to translate level content
    private translateLevel(level: LevelType, translateFunc: (key: string) => string): LevelType {
        return {
            ...level,
            name: translateFunc(level.name),
            description: translateFunc(level.description),
            objectives: level.objectives.map(obj => translateFunc(obj)),
            hints: level.hints.map(hint => translateFunc(hint)),
            requirements: level.requirements.map(req => ({
                ...req,
                description: translateFunc(req.description),
                successMessage: req.successMessage ? translateFunc(req.successMessage) : undefined,
            })),
            story: level.story
                ? {
                      title: translateFunc(level.story.title),
                      narrative: translateFunc(level.story.narrative),
                      realWorldContext: translateFunc(level.story.realWorldContext),
                      taskIntroduction: translateFunc(level.story.taskIntroduction),
                  }
                : undefined,
        };
    }

    // Helper to translate all levels in a stage
    private getTranslatedLevels(
        levels: Record<number, LevelType>,
        translateFunc: (key: string) => string,
    ): Record<number, LevelType> {
        const translatedLevels: Record<number, LevelType> = {};

        for (const [levelId, level] of Object.entries(levels)) {
            translatedLevels[parseInt(levelId)] = this.translateLevel(level, translateFunc);
        }

        return translatedLevels;
    }

    // Check if a command completes a level requirement
    public checkLevelCompletion(
        stageId: string,
        levelId: number,
        command: string,
        args: string[],
        gitRepository: GitRepository,
    ): boolean {
        console.log(`Checking level completion for stage: ${stageId}, level: ${levelId}`);
        console.log(`Command: ${command}, args:`, args);

        const level = this.getLevel(stageId, levelId);
        if (!level) {
            console.log("Level not found");
            return false;
        }

        // Initialize completed requirements array if not present
        if (!level.completedRequirements) {
            level.completedRequirements = [];
        }

        // Initialize completed objectives array if not present
        if (!level.completedObjectives) {
            level.completedObjectives = [];
        }

        // Track if the current command satisfies any requirement
        let requirementSatisfied = false;

        // Special case for Git commands
        if (command === "git") {
            const gitCommand = args[0]; // e.g., "init", "status", etc.
            const gitArgs = args.slice(1); // The remaining parameters

            console.log(`Git command: ${gitCommand}, Git args:`, gitArgs);

            // For 'all' logic (sequential), only check the NEXT uncompleted requirement
            let requirementsToCheck;
            if (level.requirementLogic === "all") {
                // Find the first uncompleted requirement (sequential mode)
                const nextRequirementIndex = level.requirements.findIndex(
                    req => !req.id || !(level.completedRequirements || []).includes(req.id),
                );
                requirementsToCheck = nextRequirementIndex >= 0 ? [level.requirements[nextRequirementIndex]] : [];
            } else {
                // For 'any' logic, check all uncompleted requirements
                requirementsToCheck = level.requirements.filter(
                    req => !req.id || !(level.completedRequirements || []).includes(req.id),
                );
            }

            for (const requirement of requirementsToCheck) {
                if (!requirement) continue; // Safety check

                // Repository-state guards must hold for this requirement to count.
                // A command may match textually, but the guard verifies the actual result.
                if (this.hasStateGuards(requirement) && !this.passesStateGuards(requirement, gitRepository)) {
                    continue;
                }

                // Result guards verify what the command actually did to the repository.
                if (!this.passesResultGuards(requirement, gitRepository)) {
                    continue;
                }

                // An alternative with its own arguments ("git merge --continue" for a requirement that
                // asks for "git commit -m") is complete in itself: its arguments replace requiresArgs.
                const fullAlternative = requirement.alternativeCommands?.some(altCmd => {
                    const altParts = altCmd.split(" ");
                    return (
                        altParts[0] === "git" &&
                        altParts.length > 2 &&
                        altParts[1] === gitCommand &&
                        // "*" stands for "with some argument" (git reset * = git reset <file>).
                        altParts.slice(2).every(part => (part === "*" ? gitArgs.length > 0 : gitArgs.includes(part)))
                    );
                });

                // Check if command matches (including alternative commands)
                const commandMatches =
                    requirement.command === `git ${gitCommand}` ||
                    requirement.command === command ||
                    requirement.command === gitCommand ||
                    (requirement.alternativeCommands &&
                        requirement.alternativeCommands.some(altCmd => {
                            // Handle different formats of alternative commands
                            const altParts = altCmd.split(" ");

                            // Case 1: "git checkout" matches gitCommand "checkout" (with arguments,
                            // only as a full alternative, see above)
                            if (altParts[0] === "git" && altParts.length >= 2) {
                                return altParts[1] === gitCommand && altParts.length === 2;
                            }

                            // Case 2: "checkout" matches gitCommand "checkout"
                            if (altParts.length === 1) {
                                return altParts[0] === gitCommand;
                            }

                            // Case 3: Full command match "git checkout" === "git checkout"
                            return altCmd === `git ${gitCommand}`;
                        }));

                if (commandMatches || fullAlternative) {
                    console.log("Command matches!");

                    // Check arguments if required
                    if (requirement.requiresArgs && !fullAlternative) {
                        const allArgsMatch = requirement.requiresArgs.every(reqArg => {
                            if (reqArg === "any") {
                                return gitArgs.length > 0;
                            }

                            // Special case: -c and -b are equivalent for branch creation
                            // git switch -c === git checkout -b
                            if (reqArg === "-c" && gitCommand === "checkout") {
                                return gitArgs.includes("-b");
                            }
                            if (reqArg === "-b" && gitCommand === "switch") {
                                return gitArgs.includes("-c");
                            }

                            // Special placeholder: require a commit hash (prevents HEAD~n shortcuts)
                            if (reqArg === "<hash>") {
                                const hexLike = /^(?:[0-9a-f]{7,})$/i;
                                // Accept if any arg is a real commit id or a short hex-ish prefix
                                const commitIds = Object.keys(gitRepository.getCommits());
                                return gitArgs.some(a => hexLike.test(a) || commitIds.some(id => id.startsWith(a)));
                            }

                            // Check for exact match first
                            if (gitArgs.includes(reqArg)) {
                                return true;
                            }

                            // The same option spelled the other way (-u / --set-upstream, ...).
                            for (const synonym of FLAG_SYNONYMS[reqArg] ?? []) {
                                if (gitArgs.some(arg => arg === synonym || arg.startsWith(synonym + "="))) return true;
                                if (synonym.length === 2 && gitArgs.some(arg => clusterHasFlag(arg, synonym)))
                                    return true;
                            }

                            // For long flags that take values (like --author="sam" or --author=sam or --grep=text)
                            if (reqArg.startsWith("--")) {
                                return gitArgs.some(arg => arg === reqArg || arg.startsWith(reqArg + "="));
                            }

                            // For short flags like -S that take values (like -S "value" or -Svalue)
                            if (reqArg.startsWith("-") && reqArg.length === 2) {
                                return gitArgs.some(
                                    arg => arg === reqArg || arg.startsWith(reqArg) || clusterHasFlag(arg, reqArg),
                                );
                            }

                            // General flag matching (fallback)
                            return false;
                        });

                        console.log("Args required:", requirement.requiresArgs);
                        console.log("Args match:", allArgsMatch);

                        if (!allArgsMatch) continue;
                    }

                    // Mark this requirement as completed
                    if (requirement.id) {
                        level.completedRequirements.push(requirement.id);
                    }

                    // Check if this completes an objective
                    if (requirement.objectiveId !== undefined) {
                        // Get all requirements with the same objectiveId
                        const objectiveRequirements = level.requirements.filter(
                            req => req.objectiveId === requirement.objectiveId,
                        );

                        // Check if all requirements for this objective are completed
                        const allObjectiveRequirementsCompleted = objectiveRequirements.every(
                            req => !req.id || level.completedRequirements?.includes(req.id),
                        );

                        // If all requirements for this objective are completed, mark objective as complete
                        if (
                            allObjectiveRequirementsCompleted &&
                            !level.completedObjectives?.includes(requirement.objectiveId)
                        ) {
                            level.completedObjectives?.push(requirement.objectiveId);
                        }
                    }

                    requirementSatisfied = true;
                    break; // Only one requirement per command
                }
            }
        } else if (command === "next") {
            // Special case for the "next" command
            return false; // The "next" command does not complete any level
        } else {
            // Non-Git commands
            // For 'all' logic (sequential), only check the NEXT uncompleted requirement
            let requirementsToCheck;
            if (level.requirementLogic === "all") {
                // Find the first uncompleted requirement (sequential mode)
                const nextRequirementIndex = level.requirements.findIndex(
                    req => !req.id || !(level.completedRequirements || []).includes(req.id),
                );
                requirementsToCheck = nextRequirementIndex >= 0 ? [level.requirements[nextRequirementIndex]] : [];
            } else {
                // For 'any' logic, check all uncompleted requirements
                requirementsToCheck = level.requirements.filter(
                    req => !req.id || !(level.completedRequirements || []).includes(req.id),
                );
            }

            for (const requirement of requirementsToCheck) {
                if (!requirement) continue; // Safety check

                // Repository-state guards must hold for this requirement to count.
                // A command may match textually, but the guard verifies the actual result.
                if (this.hasStateGuards(requirement) && !this.passesStateGuards(requirement, gitRepository)) {
                    continue;
                }

                // Result guards verify what the command actually did to the repository.
                if (!this.passesResultGuards(requirement, gitRepository)) {
                    continue;
                }

                if (requirement.command === command) {
                    if (requirement.requiresArgs) {
                        const allArgsMatch = requirement.requiresArgs.every(reqArg => {
                            if (reqArg === "any") {
                                return args.length > 0;
                            }
                            // Check for exact match
                            if (args.includes(reqArg)) {
                                return true;
                            }
                            // For flags that take values (like --author="sam" or --author=sam),
                            // check if any arg starts with the required flag
                            if (reqArg.startsWith("--")) {
                                return args.some(arg => arg === reqArg || arg.startsWith(reqArg + "="));
                            }
                            // For short flags like -S that take values (like -S "value" or -Svalue)
                            if (reqArg.startsWith("-") && reqArg.length === 2) {
                                return args.some(
                                    arg => arg === reqArg || arg.startsWith(reqArg) || clusterHasFlag(arg, reqArg),
                                );
                            }
                            return false;
                        });

                        if (!allArgsMatch) continue;
                    }

                    // Mark this requirement as completed
                    if (requirement.id) {
                        level.completedRequirements.push(requirement.id);
                    }

                    // Check if this completes an objective
                    if (requirement.objectiveId !== undefined) {
                        // Get all requirements with the same objectiveId
                        const objectiveRequirements = level.requirements.filter(
                            req => req.objectiveId === requirement.objectiveId,
                        );

                        // Check if all requirements for this objective are completed
                        const allObjectiveRequirementsCompleted = objectiveRequirements.every(
                            req => !req.id || level.completedRequirements?.includes(req.id),
                        );

                        // If all requirements for this objective are completed, mark objective as complete
                        if (
                            allObjectiveRequirementsCompleted &&
                            !level.completedObjectives?.includes(requirement.objectiveId)
                        ) {
                            level.completedObjectives?.push(requirement.objectiveId);
                        }
                    }

                    requirementSatisfied = true;
                    break; // Only one requirement per command
                }
            }
        }

        // For single requirement or 'any' logic, return true if any requirement is satisfied
        if (level.requirementLogic !== "all" || level.requirements.length === 1) {
            return requirementSatisfied;
        }

        // For 'all' logic, check if all requirements have been completed
        const allRequirementsCompleted = level.requirements.every(
            req => !req.id || level.completedRequirements?.includes(req.id),
        );

        return allRequirementsCompleted;
    }

    // Get next level information
    public getNextLevel(
        stageId: string,
        levelId: number,
        difficulty?: DifficultyLevel,
    ): { stageId: string | undefined; levelId: number } {
        const stage = this.getStage(stageId);
        if (!stage) return { stageId, levelId };

        const levelIds = Object.keys(stage.levels).map(id => parseInt(id));
        const maxLevelId = Math.max(...levelIds);

        if (levelId < maxLevelId) {
            // Move to the next level in the same stage
            return { stageId, levelId: levelId + 1 };
        } else {
            // Move to the first level of the next stage
            if (difficulty) {
                // Use difficulty-specific stages
                const availableStageIds = getAvailableStagesForDifficulty(difficulty);

                const currentStageIndex = availableStageIds.indexOf(stageId);

                if (currentStageIndex < availableStageIds.length - 1) {
                    const nextStageId = availableStageIds[currentStageIndex + 1];
                    return { stageId: nextStageId, levelId: 1 };
                }
            } else {
                // Fallback to all stages if no difficulty specified
                const stageIds = Object.keys(this.stages);
                const currentStageIndex = stageIds.indexOf(stageId);

                if (currentStageIndex < stageIds.length - 1) {
                    const nextStageId = stageIds[currentStageIndex + 1];
                    return { stageId: nextStageId, levelId: 1 };
                }
            }
        }

        // No next level - difficulty/game completed
        return { stageId: undefined, levelId };
    }

    // Add a custom level (for extensibility)
    public addCustomLevel(stageId: string, level: LevelType): boolean {
        const stage = this.getStage(stageId);
        if (!stage) return false;

        stage.levels[level.id] = level;
        return true;
    }
}
