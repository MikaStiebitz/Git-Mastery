import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { unknownFlagError } from "../base/GitErrors";
import {
    formatGitDate,
    matchPathspec,
    requireRepository,
    revisionError,
    splitRevisionsAndPaths,
    toRepoPath,
} from "../helpers/gitFormat";
import { defaultLogOptions, formatCommit, type DateMode } from "../helpers/logFormat";

export class ShowCommand implements Command {
    name = "git show";
    description = "Show various types of objects";
    usage = "git show [<options>] [<object>...]";
    examples = [
        "git show",
        "git show HEAD~1",
        "git show a1b2c3d",
        "git show v1.0.0",
        "git show HEAD:README.md",
        "git show --stat",
    ];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: [
            "stat",
            "name-only",
            "name-status",
            "oneline",
            "p",
            "patch",
            "no-patch",
            "s",
            "q",
            "quiet",
            "abbrev-commit",
            "no-decorate",
        ],
        value: ["format", "pretty", "date"],
    };

    execute(args: CommandArgs, context: CommandContext): string[] {
        const notRepo = requireRepository(context);
        if (notRepo) return notRepo;
        const repo = context.gitRepository;

        const unknownFlag = args.unknownFlags?.[0];
        if (unknownFlag !== undefined) return unknownFlagError(unknownFlag, this.usage);

        const split = splitRevisionsAndPaths(context, args, "show", { allowObjectPaths: true });
        if (!split.ok) return split.error;
        const objects = split.revs.length > 0 ? split.revs : ["HEAD"];
        const allPaths = new Set([...Object.keys(repo.readWorkingTree()), ...Object.keys(repo.getIndex())]);
        for (const commit of Object.values(repo.getAllCommits()))
            Object.keys(commit.tree).forEach(p => allPaths.add(p));
        const pathFilter = split.paths.flatMap(p => {
            const matched = matchPathspec(context, p, allPaths);
            return matched.length > 0 ? matched : [toRepoPath(context, p) ?? p];
        });
        const output: string[] = [];

        const options = defaultLogOptions();
        const flags = args.flags;
        const noPatch = flags.s !== undefined || flags["no-patch"] !== undefined;
        options.patch =
            !noPatch &&
            flags.stat === undefined &&
            flags["name-only"] === undefined &&
            flags["name-status"] === undefined;
        if (flags.p !== undefined || flags.patch !== undefined) options.patch = true;
        options.stat = flags.stat !== undefined;
        options.nameOnly = flags["name-only"] !== undefined;
        options.nameStatus = flags["name-status"] !== undefined;
        if (flags.oneline !== undefined) {
            options.pretty = "oneline";
            options.abbrev = true;
        }
        const pretty =
            typeof flags.pretty === "string"
                ? flags.pretty
                : typeof flags.format === "string"
                  ? `tformat:${flags.format}`
                  : undefined;
        if (pretty) options.pretty = pretty;
        if (flags["abbrev-commit"] !== undefined) options.abbrev = true;
        if (flags["no-decorate"] !== undefined) options.decorate = false;
        if (typeof flags.date === "string" && ["relative", "iso", "short", "unix"].includes(flags.date))
            options.date = flags.date as DateMode;

        for (const spec of objects) {
            if (output.length > 0) output.push("");

            // <rev>:<path> shows a file as it was in that commit (":<path>" means the index).
            const colon = spec.indexOf(":");
            if (colon !== -1 && !/^[a-z]+:\/\//.test(spec)) {
                const revPart = spec.substring(0, colon);
                const pathPart = spec.substring(colon + 1);
                const path = pathPart.startsWith("./") ? toRepoPath(context, pathPart) : pathPart.replace(/^\//, "");
                let tree: Record<string, string>;
                let where: string;
                if (revPart === "") {
                    tree = repo.getIndex();
                    where = "the index";
                } else {
                    const id = repo.resolveCommit(revPart);
                    if (!id) return revisionError(repo, revPart, "show");
                    tree = repo.treeOf(id);
                    where = `'${revPart}'`;
                }
                if (path === null) return [`fatal: '${pathPart}' is outside repository`];
                if (path in tree) {
                    output.push(...tree[path]!.replace(/\n$/, "").split("\n"));
                    continue;
                }
                // A directory lists its entries like `git show HEAD:src` does.
                const children = Object.keys(tree).filter(p => path === "" || p.startsWith(path + "/"));
                if (children.length > 0) {
                    const prefix = path === "" ? "" : path + "/";
                    const names = [
                        ...new Set(
                            children.map(
                                p =>
                                    p.substring(prefix.length).split("/")[0]! +
                                    (p.substring(prefix.length).includes("/") ? "/" : ""),
                            ),
                        ),
                    ];
                    output.push(`tree ${spec}`, "", ...names.sort());
                    continue;
                }
                return [`fatal: path '${path}' does not exist in ${where}`];
            }

            // An annotated tag shows the tag itself first.
            const tag = repo.getTagObject(spec);
            if (tag?.annotation) {
                output.push(
                    `tag ${spec}`,
                    `Tagger: ${tag.annotation.tagger}`,
                    `Date:   ${formatGitDate(tag.annotation.date)}`,
                    "",
                    ...tag.annotation.message.split("\n"),
                    "",
                );
            }

            const id = repo.resolveCommit(spec);
            if (!id) {
                if (spec === "HEAD" && repo.getHeadCommitId() === null) {
                    return [`fatal: your current branch '${repo.getCurrentBranch()}' does not have any commits yet`];
                }
                return revisionError(repo, spec, "show");
            }
            output.push(...formatCommit(repo, id, pathFilter.length > 0 ? { ...options, paths: pathFilter } : options));
        }

        return output;
    }
}
