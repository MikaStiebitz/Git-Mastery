import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { GitRepository } from "~/models/GitRepository";
import { unknownFlagError } from "../base/GitErrors";

export class InitCommand implements Command {
    name = "git init";
    description = "Create an empty Git repository or reinitialize an existing one";
    usage = "git init [-q | --quiet] [-b <branch-name> | --initial-branch=<branch-name>] [<directory>]";
    examples = ["git init", "git init -b main", "git init my-project"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["bare", "q", "quiet"],
        value: ["b", "initial-branch", "template", "separate-git-dir"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const { gitRepository, fileSystem, currentDirectory } = context;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        // `git init <dir>` creates the directory if needed and initializes it.
        let target = currentDirectory;
        const dirArg = args.positionalArgs[0];
        if (dirArg) {
            target = dirArg.startsWith("/")
                ? dirArg
                : currentDirectory === "/"
                  ? `/${dirArg}`
                  : `${currentDirectory}/${dirArg}`;
            target = target.replace(/\/+$/, "") || "/";
            if (fileSystem.getFileContents(target) !== null) {
                return [`fatal: cannot mkdir ${dirArg}: File exists`];
            }
            fileSystem.mkdir(target);
        }

        const initialBranch =
            typeof args.flags.b === "string"
                ? args.flags.b
                : typeof args.flags["initial-branch"] === "string"
                  ? args.flags["initial-branch"]
                  : undefined;
        if (initialBranch !== undefined && GitRepository.branchNameProblem(initialBranch) !== null) {
            return [`fatal: invalid initial branch name: '${initialBranch}'`];
        }

        const quiet = args.flags.q !== undefined || args.flags.quiet !== undefined;
        const gitDir = target === "/" ? ".git/" : `${target}/.git/`;
        const reinit = gitRepository.isInitialized() && gitRepository.getRepositoryRoot() === target;

        if (gitRepository.isInitialized() && !reinit) {
            return [
                "Repository already initialized elsewhere. Only one repository is supported.",
                `hint: This terminal tracks one repository at a time; it lives in ${gitRepository.getRepositoryRoot()}.`,
            ];
        }

        if (!gitRepository.init(target)) {
            return ["Repository already initialized elsewhere. Only one repository is supported."];
        }

        if (reinit) {
            const lines: string[] = [];
            if (initialBranch !== undefined) {
                lines.push(`warning: re-init: ignored --initial-branch=${initialBranch}`);
            }
            return quiet ? lines : [...lines, `Reinitialized existing Git repository in ${gitDir}`];
        }

        if (initialBranch !== undefined) gitRepository.setUnbornBranch(initialBranch);
        return quiet ? [] : [`Initialized empty Git repository in ${gitDir}`];
    }
}
