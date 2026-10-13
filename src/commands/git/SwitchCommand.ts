import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { GitRepository } from "~/models/GitRepository";
import { hint, unknownFlagError } from "../base/GitErrors";
import { requireRepository } from "../helpers/gitFormat";
import { createAndSwitch, detachAt, guessRemoteBranch, switchToBranch, unknownBranchHints } from "../helpers/switching";

export class SwitchCommand implements Command {
    name = "git switch";
    description = "Switch branches";
    usage = "git switch [<options>] [<branch>]";
    examples = [
        "git switch main",
        "git switch -",
        "git switch -c feature",
        "git switch -c feature origin/feature",
        "git switch --detach HEAD~2",
        "git switch -C force-create",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "d",
            "f",
            "m",
            "q",
            "t",
            "detach",
            "force",
            "discard-changes",
            "merge",
            "quiet",
            "track",
            "no-track",
            "guess",
            "no-guess",
            // -c/-C take the new branch name; declared boolean so the name stays positional and
            // `git switch -c name start-point` reads naturally.
            "c",
            "C",
            "create",
            "force-create",
        ],
        value: ["orphan"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const flags = args.flags;
        const force = flags.f !== undefined || flags.force !== undefined || flags["discard-changes"] !== undefined;
        const quiet = flags.q !== undefined || flags.quiet !== undefined;
        const output = (lines: string[]) => (quiet ? lines.filter(l => /^(error|fatal|hint)/.test(l)) : lines);

        // Unlike checkout, switch refuses to leave an operation half done.
        const busy = this.operationInProgress(context);
        if (busy) return busy;

        // -c/-C <new-branch> [<start-point>]
        const createFlag = (["c", "create", "C", "force-create"] as const).find(f => flags[f] !== undefined);
        if (createFlag) {
            const value = flags[createFlag];
            // Normally the parser hands over the name as the flag's value; a caller that built the
            // arguments itself may pass it positionally instead.
            const positional = [...args.positionalArgs];
            const name = typeof value === "string" && value !== "" ? value : positional.shift();
            if (!name) return [`error: switch \`${createFlag}' requires a value`];
            const problem = GitRepository.branchNameProblem(name);
            if (problem) return [`fatal: '${name}' is not a valid branch name`, hint(problem)];
            const reset = createFlag === "C" || createFlag === "force-create";
            if (repo.getBornBranches().includes(name) && !reset) {
                return [
                    `fatal: a branch named '${name}' already exists`,
                    hint(`To move onto it, use: git switch ${name}`),
                ];
            }
            const startSpec = positional[0];
            let startId: string | null = null;
            if (startSpec !== undefined) {
                const id = repo.resolveCommit(startSpec);
                if (!id) return [`fatal: invalid reference: ${startSpec}`];
                startId = id;
            }
            const trackFrom =
                startSpec && startSpec in repo.getRemoteTrackingRefs() && flags["no-track"] === undefined
                    ? startSpec
                    : undefined;
            return output(createAndSwitch(context, name, startId, { reset, trackFrom, force }));
        }

        // --orphan <new-branch>: a branch with no history and an empty tree.
        if (typeof flags.orphan === "string") {
            const name = flags.orphan;
            if (repo.getBornBranches().includes(name)) return [`fatal: a branch named '${name}' already exists`];
            for (const path of Object.keys(repo.getIndex())) repo.removePath(path, false);
            repo.setUnbornBranch(name);
            return output([`Switched to a new branch '${name}'`]);
        }

        let target = args.positionalArgs[0];
        if (target === undefined) {
            if (flags.detach !== undefined || flags.d !== undefined) target = "HEAD";
            else return ["fatal: missing branch or commit argument", `usage: ${this.usage}`];
        }

        // "-" is the previous branch, like `cd -`.
        if (target === "-") {
            const previous = repo.previousCheckout(1);
            if (!previous) return ["fatal: invalid reference: @{-1}"];
            target = previous;
        }

        if (flags.detach !== undefined || flags.d !== undefined) {
            const id = repo.resolveCommit(target);
            if (!id) return [`fatal: invalid reference: ${target}`];
            return output(detachAt(context, id, target, { force, advice: false }));
        }

        if (repo.getBornBranches().includes(target)) {
            return output(switchToBranch(context, target, { force }));
        }

        // Not a local branch: maybe a remote one to start tracking (git switch feature → origin/feature).
        const guessed = flags["no-guess"] === undefined ? guessRemoteBranch(repo, target) : null;
        if (guessed) {
            return output(
                createAndSwitch(context, target, repo.getRemoteTrackingRefs()[guessed]!, { trackFrom: guessed, force }),
            );
        }

        // A commit, not a branch: switch insists on --detach.
        if (repo.resolveCommit(target)) {
            return [
                `fatal: a branch is expected, got ${target in repo.getRemoteTrackingRefs() ? "remote branch" : repo.getTagsList().includes(target) ? "tag" : "commit"} '${target}'`,
                "hint: If you want to detach HEAD at the commit, try again with the --detach option.",
            ];
        }

        return [`fatal: invalid reference: ${target}`, ...unknownBranchHints(repo, target, "-c")];
    }

    /** Git's die_if_some_operation_in_progress(): the lines to refuse with, or null. */
    private operationInProgress(context: CommandContext): string[] | null {
        const repo = context.gitRepository;
        const refuse = (what: string, command: string) => [
            `fatal: cannot switch branch while ${what}`,
            `Consider "git ${command} --quit" or "git worktree add".`,
        ];
        if (repo.isMerging()) return refuse("merging", "merge");
        if (repo.getRebaseState()) return refuse("rebasing", "rebase");
        const sequencer = repo.getSequencer();
        if (sequencer?.kind === "cherry-pick") return refuse("cherry-picking", "cherry-pick");
        if (sequencer?.kind === "revert") return refuse("reverting", "revert");
        return null;
    }
}
