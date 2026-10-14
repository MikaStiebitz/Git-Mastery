import type { Command, CommandArgs, FlagSpec } from "../base/Command";

/** The overview real `git help` (and a bare `git`) prints. */
export const GIT_OVERVIEW: string[] = [
    "usage: git [-v | --version] [-h | --help] [-C <path>] [-c <name>=<value>]",
    "           <command> [<args>]",
    "",
    "These are common Git commands used in various situations:",
    "",
    "start a working area (see also: git help tutorial)",
    "   clone     Clone a repository into a new directory",
    "   init      Create an empty Git repository or reinitialize an existing one",
    "",
    "work on the current change (see also: git help everyday)",
    "   add       Add file contents to the index",
    "   mv        Move or rename a file, a directory, or a symlink",
    "   restore   Restore working tree files",
    "   rm        Remove files from the working tree and from the index",
    "",
    "examine the history and state (see also: git help revisions)",
    "   bisect    Use binary search to find the commit that introduced a bug",
    "   diff      Show changes between commits, commit and working tree, etc",
    "   log       Show commit logs",
    "   show      Show various types of objects",
    "   status    Show the working tree status",
    "",
    "grow, mark and tweak your common history",
    "   branch    List, create, or delete branches",
    "   commit    Record changes to the repository",
    "   merge     Join two or more development histories together",
    "   rebase    Reapply commits on top of another base tip",
    "   reset     Reset current HEAD to the specified state",
    "   switch    Switch branches",
    "   tag       Create, list, delete or verify a tag object",
    "",
    "collaborate (see also: git help workflows)",
    "   fetch     Download objects and refs from another repository",
    "   pull      Fetch from and integrate with another repository or a local branch",
    "   push      Update remote refs along with associated objects",
    "",
    "'git help -a' and 'git help -g' list available subcommands and some",
    "concept guides. See 'git help <command>' or 'git help <concept>'",
    "to read about a specific subcommand or concept.",
];

/** What `git help` needs to know about the other commands; supplied by the registry. */
export type CommandLookup = {
    get(name: string): Command | undefined;
    gitSubcommands(): string[];
};

export class GitHelpCommand implements Command {
    name = "git help";
    description = "Display help information about Git";
    usage = "git help [-a | --all] [<command> | <guide>]";
    examples = ["git help", "git help commit", "git help -a", "git help revisions"];
    includeInTabCompletion = true;
    supportsFileCompletion = false;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["a", "all", "g", "guides", "i", "info", "m", "man", "w", "web", "c", "config"],
        value: [],
    };

    constructor(private lookup?: CommandLookup) {}

    execute(args: CommandArgs): string[] {
        if (args.flags.a !== undefined || args.flags.all !== undefined) {
            const names = this.lookup?.gitSubcommands() ?? [];
            const width = Math.max(...names.map(n => n.length), 0);
            return [
                "See 'git help <command>' to read about a specific subcommand",
                "",
                "Main Porcelain Commands",
                ...names.map(n => `   ${n.padEnd(width)}   ${this.lookup?.get(`git ${n}`)?.description ?? ""}`),
            ];
        }
        if (args.flags.g !== undefined || args.flags.guides !== undefined) {
            return [
                "The Git concept guides are:",
                "   everyday     A useful minimum set of commands for Everyday Git",
                "   revisions    Specifying revisions and ranges for Git",
                "   workflows    An overview of recommended workflows with Git",
            ];
        }

        const topic = args.positionalArgs[0];
        if (!topic) return GIT_OVERVIEW;
        if (topic === "revisions") return REVISIONS_GUIDE;

        const command = this.lookup?.get(`git ${topic}`);
        if (!command) {
            return [`git: '${topic}' is not a git command. See 'git --help'.`];
        }
        return [
            "NAME",
            `       git-${topic} - ${command.description}`,
            "",
            "SYNOPSIS",
            `       ${command.usage}`,
            "",
            "EXAMPLES",
            ...command.examples.map(e => `       ${e}`),
        ];
    }
}

const REVISIONS_GUIDE = [
    "NAME",
    "       gitrevisions - Specifying revisions and ranges for Git",
    "",
    "SPECIFYING REVISIONS",
    "       <sha1>            e.g. dae86e1950b1277e545cee180551750029cfe735, dae86e",
    "       <refname>         e.g. main, origin/main, v1.0, HEAD, ORIG_HEAD",
    "       @                 alone is a shortcut for HEAD",
    "       <refname>@{<n>}   e.g. main@{1}, HEAD@{2}: the n-th prior value of that ref (see git reflog)",
    "       @{<n>}            the n-th prior value of the current branch",
    "       @{-<n>}           the n-th branch/commit checked out before the current one",
    "       <branch>@{upstream}, @{u}   the branch it is set to build on top of",
    "       <rev>^<n>         the n-th parent (HEAD^ = HEAD^1, HEAD^2 = second parent of a merge)",
    "       <rev>~<n>         the n-th generation ancestor, following first parents (HEAD~3)",
    "       <rev>:<path>      the file at <path> in <rev>, e.g. HEAD:README.md",
    "",
    "SPECIFYING RANGES",
    "       <rev1>..<rev2>    commits reachable from rev2 but not from rev1",
    "       <rev1>...<rev2>   commits reachable from either one but not both",
    "       ^<rev>            exclude commits reachable from rev",
];
