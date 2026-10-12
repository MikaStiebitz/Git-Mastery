import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { unknownFlagError } from "../base/GitErrors";
import { requireRepository } from "../helpers/gitFormat";

export class TagCommand implements Command {
    name = "git tag";
    description = "Create, list, delete or verify a tag object";
    usage =
        "git tag [-a | -s] [-f] [-m <msg>] <tagname> [<commit>]  |  git tag -d <tagname>...  |  git tag [-l [<pattern>...]] [-n[<num>]]";
    examples = [
        "git tag",
        "git tag v1.0.0",
        "git tag -a v1.0.0 -m 'Release version 1.0.0'",
        "git tag v0.9.0 abc1234",
        "git tag -l 'v1.*'",
        "git tag -n",
        "git tag -d v1.0.0",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "a",
            "annotate",
            "d",
            "delete",
            "l",
            "list",
            "f",
            "force",
            "n",
            "s",
            "sign",
            "v",
            "verify",
            "i",
            "ignore-case",
        ],
        value: ["m", "message", "F", "file", "contains", "no-contains", "points-at", "sort", "merged", "no-merged"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        // -n1, -n5: show annotation lines; the parser sees "-n" plus digits.
        const unknownFlag = args.unknownFlags?.find(f => !/^-\d$/.test(f));
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const flags = args.flags;
        const names = args.positionalArgs;

        if (flags.d !== undefined || flags.delete !== undefined) {
            if (names.length === 0) return [];
            const output: string[] = [];
            for (const name of names) {
                const result = repo.deleteTag(name);
                output.push(result.message);
            }
            return output;
        }

        if (flags.v !== undefined || flags.verify !== undefined) {
            return names.map(name =>
                repo.hasTag(name)
                    ? `error: ${name}: cannot verify a non-signed tag`
                    : `error: tag '${name}' not found.`,
            );
        }

        const listing =
            names.length === 0 || flags.l !== undefined || flags.list !== undefined || flags.n !== undefined;
        if (listing && (names.length === 0 || flags.l !== undefined || flags.list !== undefined)) {
            return this.list(context, names, args);
        }

        const name = names[0]!;
        const target = names[1];
        if (names.length > 2) return ["fatal: too many arguments"];

        const message =
            typeof flags.m === "string" ? flags.m : typeof flags.message === "string" ? flags.message : undefined;
        const annotate =
            flags.a !== undefined || flags.annotate !== undefined || flags.s !== undefined || message !== undefined;
        const force = flags.f !== undefined || flags.force !== undefined;

        if (target !== undefined && !repo.resolveCommit(target)) {
            return [`fatal: Failed to resolve '${target}' as a valid ref.`];
        }
        if (repo.getHeadCommitId() === null && target === undefined) {
            return ["fatal: Failed to resolve 'HEAD' as a valid ref."];
        }
        if (annotate && message === undefined) {
            // Real Git opens the editor for the tag message here.
            return [
                "fatal: no tag message given",
                "hint: Give the message on the command line: git tag -a " + name + ' -m "Release ' + name + '"',
            ];
        }

        const previous = repo.getTags().get(name);
        const result = repo.createTag(name, target, { message: annotate ? message : undefined, force });
        if (!result.success) return [result.message];
        if (previous && force && previous !== result.commitHash)
            return [`Updated tag '${name}' (was ${previous.substring(0, 7)})`];
        return [];
    }

    private list(context: CommandContext, patterns: string[], args: CommandArgs): string[] {
        const repo = context.gitRepository;
        const flags = args.flags;
        const ignoreCase = flags.i !== undefined || flags["ignore-case"] !== undefined;
        const toRegex = (glob: string) =>
            new RegExp(
                "^" +
                    glob
                        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
                        .replace(/\*/g, ".*")
                        .replace(/\?/g, ".") +
                    "$",
                ignoreCase ? "i" : "",
            );
        const regexes = patterns.map(toRegex);
        const contains = typeof flags.contains === "string" ? repo.resolveCommit(flags.contains) : undefined;
        const pointsAt = typeof flags["points-at"] === "string" ? repo.resolveCommit(flags["points-at"]) : undefined;
        if (typeof flags.contains === "string" && !contains) return [`error: malformed object name ${flags.contains}`];

        // -n<num>: number of annotation lines to print (default 1).
        let annotationLines = 0;
        if (flags.n !== undefined) annotationLines = 1;
        for (const token of args.args) {
            const match = /^-n(\d+)$/.exec(token);
            if (match) annotationLines = parseInt(match[1]!, 10);
        }

        const tags = repo.getTags();
        const names = repo.getTagsList().filter(name => {
            const target = tags.get(name)!;
            if (regexes.length > 0 && !regexes.some(r => r.test(name))) return false;
            if (contains && !repo.isAncestor(contains, target)) return false;
            if (pointsAt && target !== pointsAt) return false;
            return true;
        });

        if (annotationLines === 0) return names;
        const width = Math.max(15, ...names.map(n => n.length));
        return names.map(name => {
            const tag = repo.getTagObject(name)!;
            const text = tag.annotation?.message ?? repo.getCommit(tag.target)!.message;
            const lines = text.split("\n").slice(0, annotationLines);
            return `${name.padEnd(width)} ${lines.join("\n" + " ".repeat(width + 1))}`;
        });
    }
}
