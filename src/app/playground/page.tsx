"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { TerminalIcon, Search, BookOpen, ChevronUp, ChevronDown, Printer } from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { PageLayout } from "~/components/layout/PageLayout";
import { useLanguage } from "~/contexts/LanguageContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { TerminalSkeleton } from "~/components/ui/TerminalSkeleton";
import { FileEditor } from "~/components/FileEditor";

// Dynamically import Terminal component with SSR disabled
const Terminal = dynamic(() => import("~/components/Terminal").then(mod => ({ default: mod.Terminal })), {
    ssr: false,
    loading: () => <TerminalSkeleton className="h-[580px]" />,
});

export default function Playground() {
    const { resetTerminalForPlayground, isFileEditorOpen, setIsFileEditorOpen, currentFile } = useGameContext();
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [terminalCollapsed, setTerminalCollapsed] = useState(false);
    const [cheatSheetCollapsed, setCheatSheetCollapsed] = useState(true);

    useEffect(() => {
        // Initial reset when component mounts
        resetTerminalForPlayground();

        // On mobile, default to showing terminal first
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCheatSheetCollapsed(true);
                setTerminalCollapsed(false);
            } else {
                setCheatSheetCollapsed(false);
                setTerminalCollapsed(false);
            }
        };

        // Set initial state
        handleResize();

        // Add resize listener
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Toggle sections on mobile
    const toggleTerminal = () => {
        setTerminalCollapsed(!terminalCollapsed);
        if (window.innerWidth <= 768 && !terminalCollapsed) {
            setCheatSheetCollapsed(false);
        }
    };

    const toggleCheatSheet = () => {
        setCheatSheetCollapsed(!cheatSheetCollapsed);
        if (window.innerWidth <= 768 && !cheatSheetCollapsed) {
            setTerminalCollapsed(false);
        }
    };

    // Git commands for the cheat sheet with proper translations
    const gitCommands = [
        {
            category: t("category.basics"),
            commands: [
                {
                    name: "git init",
                    description: t("Initializes a new Git repository"),
                    usage: "git init",
                    example: "git init",
                    explanation: t(
                        "This command creates a new Git repository in your current directory. It creates a hidden .git directory that contains all Git metadata.",
                    ),
                },
                {
                    name: "git status",
                    description: t("Shows the status of the repository"),
                    usage: "git status",
                    example: "git status",
                    explanation: t(
                        "This lets you see the current status of your repository - which files have been changed, which are staged, etc.",
                    ),
                },
                {
                    name: "git add",
                    description: t("Adds file contents to the index"),
                    usage: "git add <file> or git add .",
                    example: "git add index.html",
                    explanation: t(
                        "With this command, you mark changes for the next commit. Use 'git add .' to mark all changes in the current directory.",
                    ),
                },
                {
                    name: "git commit",
                    description: t("Records changes to the repository"),
                    usage: 'git commit -m "<message>"',
                    example: 'git commit -m "Fix bug in login form"',
                    explanation: t(
                        "Creates a new commit with all staged changes. The message should be a short, precise description of what was changed.",
                    ),
                },
                {
                    name: "git config",
                    description: t("Configure Git settings"),
                    usage: "git config [--global] <key> <value>",
                    example: 'git config --global user.name "Your Name"',
                    explanation: t(
                        "Sets configuration values for your user name, email, editor, and other preferences. Use --global to apply settings to all repositories.",
                    ),
                },
                {
                    name: "git help",
                    description: t("Display help information"),
                    usage: "git help <command>",
                    example: "git help commit",
                    explanation: t(
                        "Shows detailed help information for any Git command. You can also use 'git <command> --help' for the same information.",
                    ),
                },
            ],
        },
        {
            category: t("category.branches"),
            commands: [
                {
                    name: "git branch",
                    description: t("Lists, creates, or deletes branches"),
                    usage: "git branch [name] [--delete]",
                    example: "git branch feature-login",
                    explanation: t(
                        "Without parameters, this command lists all existing branches. With a name, it creates a new branch (but doesn't switch to it).",
                    ),
                },
                {
                    name: "git checkout",
                    description: t("Switches branches or restores files"),
                    usage: "git checkout <branch> or git checkout -b <new-branch>",
                    example: "git checkout -b feature-login",
                    explanation: t(
                        "Switches to another branch. With '-b', it creates a new branch and immediately switches to it.",
                    ),
                },
                {
                    name: "git merge",
                    description: t("Joins two or more development histories"),
                    usage: "git merge <branch>",
                    example: "git merge feature-login",
                    explanation: t(
                        "Integrates changes from the specified branch into the current branch. This creates a merge commit if it's not a fast-forward situation.",
                    ),
                },
                {
                    name: "git switch",
                    description: t("Switch to a specified branch"),
                    usage: "git switch <branch> or git switch -c <new-branch>",
                    example: "git switch main",
                    explanation: t(
                        "Modern alternative to 'git checkout' for switching branches. Use '-c' to create and switch to a new branch in one command.",
                    ),
                },
                {
                    name: "git branch -d",
                    description: t("Delete a branch"),
                    usage: "git branch -d <branch>",
                    example: "git branch -d feature-login",
                    explanation: t(
                        "Deletes the specified branch if it has been fully merged. Use '-D' instead of '-d' to force deletion even if not merged.",
                    ),
                },
            ],
        },
        {
            category: t("category.history"),
            commands: [
                {
                    name: "git log",
                    description: t("Shows the commit history"),
                    usage: "git log [options]",
                    example: "git log --oneline --graph",
                    explanation: t(
                        "Shows the commit history with details like author, date, and message. Many options available to customize the output format.",
                    ),
                },
                {
                    name: "git diff",
                    description: t("Show changes between commits"),
                    usage: "git diff [<commit>] [<commit>]",
                    example: "git diff HEAD~1 HEAD",
                    explanation: t(
                        "Shows the differences between two commits, commit and working tree, etc. Without arguments, shows changes in working directory that aren't staged.",
                    ),
                },
                {
                    name: "git show",
                    description: t("Show various Git objects"),
                    usage: "git show [<commit>]",
                    example: "git show HEAD",
                    explanation: t(
                        "Shows information about a git object. For commits, shows the commit message and the differences it introduced.",
                    ),
                },
                {
                    name: "git blame",
                    description: t("Show who changed what in a file"),
                    usage: "git blame <file>",
                    example: "git blame index.html",
                    explanation: t(
                        "Shows who made each change to a file, line by line, and in which commit. Useful for understanding the history of a specific file.",
                    ),
                },
            ],
        },
        {
            category: t("category.remoteRepos"),
            commands: [
                {
                    name: "git clone",
                    description: t("Clones a repository into a new directory"),
                    usage: "git clone <url>",
                    example: "git clone https://github.com/user/repo.git",
                    explanation: t("Creates a local copy of a remote repository, including all branches and history."),
                },
                {
                    name: "git pull",
                    description: t("Fetches and integrates changes from a remote repository"),
                    usage: "git pull [remote] [branch]",
                    example: "git pull origin main",
                    explanation: t(
                        "Combines 'git fetch' and 'git merge' to fetch changes from a remote branch and integrate them into your current branch.",
                    ),
                },
                {
                    name: "git push",
                    description: t("Updates remote references and associated objects"),
                    usage: "git push [remote] [branch]",
                    example: "git push origin main",
                    explanation: t(
                        "Sends your local commits to a remote repository. Others can then see and fetch your changes.",
                    ),
                },
                {
                    name: "git remote",
                    description: t("Manage remote repositories"),
                    usage: "git remote add <name> <url>",
                    example: "git remote add origin https://github.com/user/repo.git",
                    explanation: t(
                        "Lists, adds, or removes remote repositories. Use 'git remote -v' to see the URLs of your remotes.",
                    ),
                },
                {
                    name: "git fetch",
                    description: t("Download objects and refs from remote"),
                    usage: "git fetch [remote]",
                    example: "git fetch origin",
                    explanation: t(
                        "Downloads all branches and commits from a remote repository without merging them into your local branches.",
                    ),
                },
            ],
        },
        {
            category: t("category.undoing"),
            commands: [
                {
                    name: "git restore",
                    description: t("Restore working tree files"),
                    usage: "git restore <file> or git restore --staged <file>",
                    example: "git restore --staged index.html",
                    explanation: t(
                        "Undoes changes to your working tree (with no options) or removes files from the staging area (with --staged).",
                    ),
                },
                {
                    name: "git reset",
                    description: t("Reset current HEAD to a specific state"),
                    usage: "git reset [--soft | --mixed | --hard] [commit]",
                    example: "git reset --hard HEAD~1",
                    explanation: t(
                        "Resets your branch to a specific commit. --soft keeps changes in staging area, --mixed (default) unstages them, --hard discards all changes.",
                    ),
                },
                {
                    name: "git revert",
                    description: t("Create commit that undoes changes"),
                    usage: "git revert <commit>",
                    example: "git revert HEAD",
                    explanation: t(
                        "Creates a new commit that undoes the changes made by an earlier commit. Safer than reset for shared branches.",
                    ),
                },
            ],
        },
        {
            category: t("category.advanced"),
            commands: [
                {
                    name: "git rebase",
                    description: t("Reapplies commits on top of another base"),
                    usage: "git rebase <base>",
                    example: "git rebase main",
                    explanation: t(
                        "Transfers your changes onto the latest version of the base branch. This creates a cleaner history than merges.",
                    ),
                },
                {
                    name: "git stash",
                    description: t("Stashes changes temporarily"),
                    usage: "git stash [pop]",
                    example: "git stash",
                    explanation: t(
                        "Saves your uncommitted changes temporarily, allowing you to return to a clean working directory. Use 'pop' to reapply the stashed changes.",
                    ),
                },
                {
                    name: "git tag",
                    description: t("Create, list, delete tags"),
                    usage: "git tag [name] [commit]",
                    example: "git tag v1.0.0",
                    explanation: t(
                        "Tags are references to specific points in Git history, typically used for marking version releases. Use with -a for annotated tags.",
                    ),
                },
                {
                    name: "git cherry-pick",
                    description: t("Apply changes from specific commits"),
                    usage: "git cherry-pick <commit>",
                    example: "git cherry-pick abc123",
                    explanation: t(
                        "Applies the changes from specific commits to your current branch. Useful for selectively bringing changes from one branch to another.",
                    ),
                },
                {
                    name: "git bisect",
                    description: t("Use binary search to find bugs"),
                    usage: "git bisect <subcommand>",
                    example: "git bisect start",
                    explanation: t(
                        "Helps find which commit introduced a bug using binary search. Mark commits as 'good' or 'bad' to narrow down the problem.",
                    ),
                },
            ],
        },
    ];

    // Filter commands based on search term
    const filteredCommands = !searchTerm
        ? gitCommands
        : gitCommands
              .map(category => ({
                  category: category.category,
                  commands: category.commands.filter(
                      cmd =>
                          cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cmd.description.toLowerCase().includes(searchTerm.toLowerCase()),
                  ),
              }))
              .filter(category => category.commands.length > 0);

    return (
        <PageLayout>
            <div className="container mx-auto px-4 py-6 sm:py-8">
                <h1 className="font-display text-gm-ink text-center text-2xl [text-wrap:balance] [overflow-wrap:anywhere] sm:text-3xl sm:[overflow-wrap:normal]">
                    {t("playground.title")}
                </h1>
                <p className="text-gm-ink-soft mx-auto mt-3 mb-6 max-w-2xl text-center text-base sm:text-lg">
                    {t("playground.subtitle")}
                </p>

                {/* Mobile section toggles */}
                <div className="no-print mb-4 flex flex-col gap-2 md:hidden">
                    <Button
                        variant="outline"
                        onClick={toggleTerminal}
                        aria-expanded={!terminalCollapsed}
                        aria-controls="playground-terminal"
                        className="h-auto min-h-11 w-full justify-between gap-3 py-2 text-start whitespace-normal">
                        <span className="flex min-w-0 items-center gap-2">
                            <TerminalIcon className="text-gm-grape-hi h-5 w-5 shrink-0" aria-hidden="true" />
                            {t("playground.gitTerminal")}
                        </span>
                        {terminalCollapsed ? (
                            <ChevronDown className="h-5 w-5 shrink-0" aria-hidden="true" />
                        ) : (
                            <ChevronUp className="h-5 w-5 shrink-0" aria-hidden="true" />
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={toggleCheatSheet}
                        aria-expanded={!cheatSheetCollapsed}
                        aria-controls="cheat-sheet-print-area"
                        className="h-auto min-h-11 w-full justify-between gap-3 py-2 text-start whitespace-normal">
                        <span className="flex min-w-0 items-center gap-2">
                            <BookOpen className="text-gm-grape-hi h-5 w-5 shrink-0" aria-hidden="true" />
                            {t("playground.gitCheatSheet")}
                        </span>
                        {cheatSheetCollapsed ? (
                            <ChevronDown className="h-5 w-5 shrink-0" aria-hidden="true" />
                        ) : (
                            <ChevronUp className="h-5 w-5 shrink-0" aria-hidden="true" />
                        )}
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Terminal Side */}
                    <div id="playground-terminal" className={`${terminalCollapsed ? "hidden md:block" : ""}`}>
                        <Terminal
                            className="h-[580px]"
                            showHelpButton={true}
                            showResetButton={false}
                            isPlaygroundMode={true}
                        />
                    </div>

                    {/* Cheat Sheet Side. The print stylesheet in globals.css hides everything outside
                        #cheat-sheet-print-area, so this whole card is what lands on paper. */}
                    <Card
                        id="cheat-sheet-print-area"
                        className={`print:border-0 print:bg-transparent print:text-black print:shadow-none ${
                            cheatSheetCollapsed ? "hidden md:block" : ""
                        }`}>
                        <CardHeader className="gap-3 pb-4">
                            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                                <CardTitle className="flex min-w-0 items-center gap-2 text-lg print:text-black">
                                    <BookOpen className="text-gm-grape-hi h-5 w-5 shrink-0" aria-hidden="true" />
                                    <span className="[overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                                        {t("playground.gitCheatSheet")}
                                    </span>
                                </CardTitle>
                                <Button variant="ghost" className="no-print" onClick={() => window.print()}>
                                    <Printer className="h-4 w-4" aria-hidden="true" />
                                    {t("playground.printCheatSheet")}
                                </Button>
                            </div>
                            <div className="no-print relative">
                                <Search
                                    className="text-gm-ink-dim pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2"
                                    aria-hidden="true"
                                />
                                <Input
                                    placeholder={t("playground.searchCommands")}
                                    className="ps-9"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="gm-scroll h-[350px] overflow-y-auto pe-2 md:h-[420px] print:h-auto print:overflow-visible print:pe-0">
                                {filteredCommands.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                                        <Search className="text-gm-ink-dim h-8 w-8" aria-hidden="true" />
                                        <p className="text-gm-ink-soft print:text-black">
                                            {t("playground.noCommands")} &quot;{searchTerm}&quot;
                                        </p>
                                        <Button variant="ghost" className="no-print" onClick={() => setSearchTerm("")}>
                                            {t("playground.resetSearch")}
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Screen: a dense reference list. One row per command, the row itself
                                            expands for usage / example / explanation. */}
                                        <Accordion type="single" collapsible className="no-print space-y-5">
                                            {filteredCommands.map((category, index) => (
                                                <div key={index}>
                                                    <h3 className="text-gm-ink-dim mb-2 text-sm font-semibold">
                                                        {category.category}
                                                    </h3>
                                                    <div className="gm-inset overflow-hidden">
                                                        {category.commands.map((command, cmdIndex) => (
                                                            <AccordionItem
                                                                key={cmdIndex}
                                                                value={`${index}-${cmdIndex}`}>
                                                                <AccordionTrigger className="hover:bg-gm-deep min-h-11 gap-3 px-3 py-2.5 text-sm">
                                                                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                                                        <span className="[font-family:var(--font-code)] text-sm font-semibold [overflow-wrap:anywhere]">
                                                                            {command.name}
                                                                        </span>
                                                                        <span className="text-gm-ink-soft text-xs leading-snug font-normal">
                                                                            {command.description}
                                                                        </span>
                                                                    </span>
                                                                </AccordionTrigger>
                                                                <AccordionContent className="px-3 pb-3">
                                                                    <dl className="space-y-2">
                                                                        <div>
                                                                            <dt className="text-gm-ink-dim text-xs font-semibold">
                                                                                {t("playground.usage")}
                                                                            </dt>
                                                                            <dd className="mt-1">
                                                                                <code className="bg-gm-deep text-gm-ink block rounded-[0.7rem] px-2 py-1.5 [font-family:var(--font-code)] text-xs [overflow-wrap:anywhere] whitespace-pre-wrap">
                                                                                    {command.usage}
                                                                                </code>
                                                                            </dd>
                                                                        </div>
                                                                        <div>
                                                                            <dt className="text-gm-ink-dim text-xs font-semibold">
                                                                                {t("playground.example")}
                                                                            </dt>
                                                                            <dd className="mt-1">
                                                                                <code className="bg-gm-deep text-gm-ink block rounded-[0.7rem] px-2 py-1.5 [font-family:var(--font-code)] text-xs [overflow-wrap:anywhere] whitespace-pre-wrap">
                                                                                    {command.example}
                                                                                </code>
                                                                            </dd>
                                                                        </div>
                                                                        <div>
                                                                            <dt className="text-gm-ink-dim text-xs font-semibold">
                                                                                {t("playground.explanation")}
                                                                            </dt>
                                                                            <dd className="text-gm-ink-soft mt-1 text-xs leading-relaxed">
                                                                                {command.explanation}
                                                                            </dd>
                                                                        </div>
                                                                    </dl>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </Accordion>

                                        {/* Paper: the screen list is collapsed accordions, so printing renders this
                                            flat, always-expanded duplicate. It carries its own ink colours because
                                            the gm-* palette is built for the dark stage and prints invisible. */}
                                        <div className="hidden text-black print:block">
                                            {filteredCommands.map((category, index) => (
                                                <div key={index} className="mb-4">
                                                    <h3 className="mb-1 text-sm font-bold text-black">
                                                        {category.category}
                                                    </h3>
                                                    <div className="border border-black/40">
                                                        {category.commands.map((command, cmdIndex) => (
                                                            <div
                                                                key={cmdIndex}
                                                                className="break-inside-avoid border-b border-black/20 px-2 py-1.5 last:border-b-0">
                                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                                    <span className="[font-family:var(--font-code)] text-sm font-semibold text-black">
                                                                        {command.name}
                                                                    </span>
                                                                    <span className="text-xs text-black/70">
                                                                        {command.description}
                                                                    </span>
                                                                </div>
                                                                <dl className="mt-1 space-y-0.5 text-[11px] leading-snug">
                                                                    <div className="flex flex-wrap items-baseline gap-x-2">
                                                                        <dt className="font-semibold text-black/60">
                                                                            {t("playground.usage")}
                                                                        </dt>
                                                                        <dd className="[font-family:var(--font-code)] text-black">
                                                                            {command.usage}
                                                                        </dd>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-baseline gap-x-2">
                                                                        <dt className="font-semibold text-black/60">
                                                                            {t("playground.example")}
                                                                        </dt>
                                                                        <dd className="[font-family:var(--font-code)] text-black">
                                                                            {command.example}
                                                                        </dd>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-baseline gap-x-2">
                                                                        <dt className="font-semibold text-black/60">
                                                                            {t("playground.explanation")}
                                                                        </dt>
                                                                        <dd className="text-black/80">
                                                                            {command.explanation}
                                                                        </dd>
                                                                    </div>
                                                                </dl>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* File Editor */}
                <FileEditor
                    isOpen={isFileEditorOpen}
                    onClose={() => setIsFileEditorOpen(false)}
                    fileName={currentFile.name}
                    initialContent={currentFile.content}
                />
            </div>
        </PageLayout>
    );
}
