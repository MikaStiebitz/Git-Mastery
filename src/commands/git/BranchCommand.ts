import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import type { GitRepository } from "~/models/GitRepository";
import { hint, refSuggestionHints, unknownFlagError } from "../base/GitErrors";

export class BranchCommand implements Command {
    name = "git branch";
    description = "List, create, or delete branches";
    usage = "git branch [<options>] [<branch>] [<start-point>]";
    examples = [
        "git branch",
        "git branch feature",
        "git branch -d old-branch",
        "git branch -D force-delete-branch",
        "git branch feature main",
        "git branch -m old-name new-name",
        "git branch -c source copy",
        "git branch -r",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "d",
            "D",
            "m",
            "M",
            "c",
            "C",
            "r",
            "a",
            "v",
            "f",
            "q",
            "delete",
            "force",
            "move",
            "copy",
            "remotes",
            "all",
            "list",
            "verbose",
            "quiet",
            "merged",
            "no-merged",
            "show-current",
        ],
        value: ["u", "set-upstream-to", "contains", "sort"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, currentDirectory } = context;

        if (!gitRepository.isInitialized()) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }
        if (!gitRepository.isInRepository(currentDirectory)) {
            return ["fatal: not a git repository (or any of the parent directories): .git"];
        }

        // A mistyped flag is an error, not something to ignore: `git branch -x feature` must not
        // quietly create a branch as though -x had never been typed.
        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) {
            return unknownFlagError(unknownFlag, this.usage);
        }

        const parseResult = this.parseBranchArgs(args);

        if (parseResult.error) {
            return parseResult.error;
        }

        const { action, branchName, startPoint, newName, isForce } = parseResult;

        switch (action) {
            case "list":
                return this.listBranches(gitRepository);

            case "create":
                return this.createBranch(gitRepository, branchName!, startPoint);

            case "delete":
                return this.deleteBranch(gitRepository, branchName!, isForce);

            case "rename":
                return this.renameBranch(gitRepository, branchName!, newName!);

            case "copy":
                return this.copyBranch(gitRepository, branchName!, newName!);

            default:
                return ["fatal: unknown branch command"];
        }
    }

    /**
     * Work out what the user asked for.
     *
     * Flag positions do not matter (the parser handles that), so `git branch Feature -D` and
     * `git branch -D Feature` both arrive here as a delete of "Feature".
     */
    private parseBranchArgs(args: CommandArgs): {
        action: "list" | "create" | "delete" | "rename" | "copy";
        branchName?: string;
        startPoint?: string;
        newName?: string;
        isForce: boolean;
        error?: string[];
    } {
        const isDelete = args.flags.d !== undefined || args.flags.delete !== undefined;
        const isForceDelete = args.flags.D !== undefined;
        const isMove = args.flags.m !== undefined || args.flags.move !== undefined;
        const isForceMove = args.flags.M !== undefined;
        const isCopy = args.flags.c !== undefined || args.flags.copy !== undefined;
        const isForceCopy = args.flags.C !== undefined;
        const isRemote = args.flags.r !== undefined || args.flags.remotes !== undefined;

        const isForce = isForceDelete || isForceMove || isForceCopy;
        const positionalArgs = args.positionalArgs;

        // Handle remote branch listing
        if (isRemote) {
            return {
                action: "list",
                isForce: false,
            };
        }

        // Handle deletion
        if (isDelete || isForceDelete) {
            const branchName = positionalArgs[0];

            if (!branchName) {
                const flag = isForceDelete ? "-D" : "-d";
                return {
                    action: "delete",
                    isForce,
                    error: [`fatal: branch name required`, `usage: git branch ${flag} <branchname>`],
                };
            }

            return {
                action: "delete",
                branchName,
                isForce,
            };
        }

        // Handle rename. `git branch -m new` renames the current branch; two names rename explicitly.
        if (isMove || isForceMove) {
            if (positionalArgs.length === 0) {
                return {
                    action: "rename",
                    isForce,
                    error: [`fatal: branch name required`, `usage: git branch -m [<oldbranch>] <newbranch>`],
                };
            }

            if (positionalArgs.length === 1) {
                return {
                    action: "rename",
                    branchName: undefined, // filled in by renameBranch as the current branch
                    newName: positionalArgs[0],
                    isForce,
                };
            }

            return {
                action: "rename",
                branchName: positionalArgs[0],
                newName: positionalArgs[1],
                isForce,
            };
        }

        // Handle copy. Real Git's -c copies a branch, it does not create-and-switch; one name copies
        // the current branch, two names copy the first into the second.
        if (isCopy || isForceCopy) {
            if (positionalArgs.length === 0) {
                return {
                    action: "copy",
                    isForce,
                    error: [`fatal: branch name required`, `usage: git branch -c [<oldbranch>] <newbranch>`],
                };
            }

            if (positionalArgs.length === 1) {
                return {
                    action: "copy",
                    branchName: undefined, // filled in by copyBranch as the current branch
                    newName: positionalArgs[0],
                    isForce,
                };
            }

            return {
                action: "copy",
                branchName: positionalArgs[0],
                newName: positionalArgs[1],
                isForce,
            };
        }

        // Handle creation
        if (positionalArgs.length > 0) {
            return {
                action: "create",
                branchName: positionalArgs[0],
                startPoint: positionalArgs[1], // optional
                isForce: false,
            };
        }

        // Default to list
        return {
            action: "list",
            isForce: false,
        };
    }

    private listBranches(gitRepository: GitRepository): string[] {
        const branches = gitRepository.getBranches();
        const currentBranch = gitRepository.getCurrentBranch();

        return branches.map(branch => (branch === currentBranch ? `* ${branch}` : `  ${branch}`));
    }

    private createBranch(gitRepository: GitRepository, branchName: string, startPoint?: string): string[] {
        // Validate branch name before attempting to create
        const invalidReason = this.branchNameProblem(branchName);
        if (invalidReason) {
            return [`fatal: '${branchName}' is not a valid branch name.`, hint(invalidReason)];
        }

        const allBranches = gitRepository.getBranches();

        // Check if branch already exists
        if (allBranches.includes(branchName)) {
            return [
                `fatal: a branch named '${branchName}' already exists`,
                hint(`To move onto it instead of creating it, use: git switch ${branchName}`),
            ];
        }

        // Validate start point if provided
        if (startPoint && !allBranches.includes(startPoint)) {
            return [`fatal: not a valid object name: '${startPoint}'`, ...refSuggestionHints(startPoint, allBranches)];
        }

        const created = gitRepository.createBranch(branchName);

        if (created) {
            return [
                `Created branch '${branchName}'${startPoint ? ` from '${startPoint}'` : ""}.`,
                hint(
                    `You are still on '${gitRepository.getCurrentBranch()}'. Use 'git switch ${branchName}' to move onto it.`,
                ),
            ];
        }

        return [`fatal: Failed to create branch '${branchName}'.`];
    }

    /**
     * Why this branch name is invalid, phrased as advice, or undefined when it is fine.
     *
     * Git's own refname rules; the returned string becomes the hint line under the fatal error so a
     * beginner learns which character was the problem rather than only that something was wrong.
     */
    private branchNameProblem(name: string): string | undefined {
        if (!name || name.length === 0) return "A branch name cannot be empty.";
        if (name.includes(" ")) return "Branch names cannot contain spaces. Try dashes instead: my-branch";
        if (/[~^:?*[\\]/.test(name)) return "Branch names cannot contain any of: ~ ^ : ? * [ \\";
        if (name.startsWith("/") || name.endsWith("/")) return "Branch names cannot start or end with '/'.";
        if (name.includes("..")) return "Branch names cannot contain '..'.";
        if (name.startsWith(".") || name.endsWith(".")) return "Branch names cannot start or end with '.'.";
        if (name.endsWith(".lock")) return "Branch names cannot end with '.lock'.";
        if (name === "@") return "'@' alone is not a valid branch name.";
        return undefined;
    }

    private deleteBranch(gitRepository: GitRepository, branchName: string, isForce: boolean): string[] {
        const currentBranch = gitRepository.getCurrentBranch();
        const allBranches = gitRepository.getBranches();

        // Check if branch exists. Branch names are case-sensitive in Git, so `git branch -D Feature`
        // against a "feature" branch lands here — the hint says why instead of leaving a dead end.
        if (!allBranches.includes(branchName)) {
            return [`error: branch '${branchName}' not found.`, ...refSuggestionHints(branchName, allBranches)];
        }

        // Cannot delete current branch
        if (branchName === currentBranch) {
            return [
                `error: cannot delete branch '${branchName}' used by worktree at '/'`,
                hint(`Move to another branch first, for example: git switch main`),
            ];
        }

        // Check for unmerged commits (only if not force)
        if (!isForce && gitRepository.hasUnmergedCommits(branchName)) {
            return [
                `error: the branch '${branchName}' is not fully merged.`,
                hint(`If you are sure you want to delete it, run 'git branch -D ${branchName}'.`),
                hint(`-d refuses to throw work away; -D deletes anyway.`),
            ];
        }

        const deleted = gitRepository.deleteBranch(branchName);

        if (deleted) {
            return [`Deleted branch ${branchName} (was ${this.getMockCommitHash()}).`];
        }

        return [`error: Failed to delete branch '${branchName}'.`];
    }

    private renameBranch(gitRepository: GitRepository, oldName: string | undefined, newName: string): string[] {
        const allBranches = gitRepository.getBranches();
        const currentBranch = gitRepository.getCurrentBranch();
        const source = oldName ?? currentBranch;

        // Check if old branch exists
        if (!allBranches.includes(source)) {
            return [`error: refname refs/heads/${source} not found`, ...refSuggestionHints(source, allBranches)];
        }

        const invalidReason = this.branchNameProblem(newName);
        if (invalidReason) {
            return [`fatal: '${newName}' is not a valid branch name.`, hint(invalidReason)];
        }

        // Check if new branch already exists
        if (allBranches.includes(newName)) {
            return [`fatal: a branch named '${newName}' already exists`];
        }

        const renamed = gitRepository.renameBranch(source, newName);
        if (!renamed) {
            return [`fatal: Branch rename failed`];
        }

        return [`Branch '${source}' renamed to '${newName}'.`];
    }

    /** Real Git's -c: copy a branch. The copy is not checked out. */
    private copyBranch(gitRepository: GitRepository, oldName: string | undefined, newName: string): string[] {
        const allBranches = gitRepository.getBranches();
        const currentBranch = gitRepository.getCurrentBranch();
        const source = oldName ?? currentBranch;

        if (!allBranches.includes(source)) {
            return [`error: refname refs/heads/${source} not found`, ...refSuggestionHints(source, allBranches)];
        }

        const invalidReason = this.branchNameProblem(newName);
        if (invalidReason) {
            return [`fatal: '${newName}' is not a valid branch name.`, hint(invalidReason)];
        }

        if (allBranches.includes(newName)) {
            return [`fatal: a branch named '${newName}' already exists`];
        }

        const created = gitRepository.createBranch(newName);
        if (!created) {
            return [`fatal: Failed to create branch '${newName}'.`];
        }

        return [
            `Copied branch '${source}' to '${newName}'.`,
            hint(`-c copies a branch. To create one and move onto it, use: git switch -c ${newName}`),
        ];
    }

    private getMockCommitHash(): string {
        return Math.random().toString(16).substring(2, 9);
    }
}
