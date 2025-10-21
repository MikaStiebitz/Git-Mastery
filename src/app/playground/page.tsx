"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { TerminalIcon, Search, BookOpen, Command, ChevronUp, ChevronDown } from "lucide-react";
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

    const commandGroups = [
        {
            categoryKey: "category.basics",
            commands: [
                {
                    name: "git init",
                    descriptionKey: "playground.commands.gitInit.description",
                    explanationKey: "playground.commands.gitInit.explanation",
                    usage: "git init",
                    example: "git init",
                },
                {
                    name: "git status",
                    descriptionKey: "playground.commands.gitStatus.description",
                    explanationKey: "playground.commands.gitStatus.explanation",
                    usage: "git status",
                    example: "git status",
                },
                {
                    name: "git add",
                    descriptionKey: "playground.commands.gitAdd.description",
                    explanationKey: "playground.commands.gitAdd.explanation",
                    usage: "git add <file> or git add .",
                    example: "git add index.html",
                },
                {
                    name: "git commit",
                    descriptionKey: "playground.commands.gitCommit.description",
                    explanationKey: "playground.commands.gitCommit.explanation",
                    usage: 'git commit -m "<message>"',
                    example: 'git commit -m "Fix bug in login form"',
                },
                {
                    name: "git config",
                    descriptionKey: "playground.commands.gitConfig.description",
                    explanationKey: "playground.commands.gitConfig.explanation",
                    usage: "git config [--global] <key> <value>",
                    example: 'git config --global user.name "Your Name"',
                },
                {
                    name: "git help",
                    descriptionKey: "playground.commands.gitHelp.description",
                    explanationKey: "playground.commands.gitHelp.explanation",
                    usage: "git help <command>",
                    example: "git help commit",
                },
            ],
        },
        {
            categoryKey: "category.branches",
            commands: [
                {
                    name: "git branch",
                    descriptionKey: "playground.commands.gitBranch.description",
                    explanationKey: "playground.commands.gitBranch.explanation",
                    usage: "git branch [name] [--delete]",
                    example: "git branch feature-login",
                },
                {
                    name: "git checkout",
                    descriptionKey: "playground.commands.gitCheckout.description",
                    explanationKey: "playground.commands.gitCheckout.explanation",
                    usage: "git checkout <branch> or git checkout -b <new-branch>",
                    example: "git checkout -b feature-login",
                },
                {
                    name: "git merge",
                    descriptionKey: "playground.commands.gitMerge.description",
                    explanationKey: "playground.commands.gitMerge.explanation",
                    usage: "git merge <branch>",
                    example: "git merge feature-login",
                },
                {
                    name: "git switch",
                    descriptionKey: "playground.commands.gitSwitch.description",
                    explanationKey: "playground.commands.gitSwitch.explanation",
                    usage: "git switch <branch> or git switch -c <new-branch>",
                    example: "git switch main",
                },
                {
                    name: "git branch -d",
                    descriptionKey: "playground.commands.gitBranchDelete.description",
                    explanationKey: "playground.commands.gitBranchDelete.explanation",
                    usage: "git branch -d <branch>",
                    example: "git branch -d feature-login",
                },
            ],
        },
        {
            categoryKey: "category.history",
            commands: [
                {
                    name: "git log",
                    descriptionKey: "playground.commands.gitLog.description",
                    explanationKey: "playground.commands.gitLog.explanation",
                    usage: "git log [options]",
                    example: "git log --oneline --graph",
                },
                {
                    name: "git diff",
                    descriptionKey: "playground.commands.gitDiff.description",
                    explanationKey: "playground.commands.gitDiff.explanation",
                    usage: "git diff [<commit>] [<commit>]",
                    example: "git diff HEAD~1 HEAD",
                },
                {
                    name: "git show",
                    descriptionKey: "playground.commands.gitShow.description",
                    explanationKey: "playground.commands.gitShow.explanation",
                    usage: "git show [<commit>]",
                    example: "git show HEAD",
                },
                {
                    name: "git blame",
                    descriptionKey: "playground.commands.gitBlame.description",
                    explanationKey: "playground.commands.gitBlame.explanation",
                    usage: "git blame <file>",
                    example: "git blame index.html",
                },
            ],
        },
        {
            categoryKey: "category.remoteRepos",
            commands: [
                {
                    name: "git clone",
                    descriptionKey: "playground.commands.gitClone.description",
                    explanationKey: "playground.commands.gitClone.explanation",
                    usage: "git clone <url>",
                    example: "git clone https://github.com/user/repo.git",
                },
                {
                    name: "git pull",
                    descriptionKey: "playground.commands.gitPull.description",
                    explanationKey: "playground.commands.gitPull.explanation",
                    usage: "git pull [remote] [branch]",
                    example: "git pull origin main",
                },
                {
                    name: "git push",
                    descriptionKey: "playground.commands.gitPush.description",
                    explanationKey: "playground.commands.gitPush.explanation",
                    usage: "git push [remote] [branch]",
                    example: "git push origin main",
                },
                {
                    name: "git remote",
                    descriptionKey: "playground.commands.gitRemote.description",
                    explanationKey: "playground.commands.gitRemote.explanation",
                    usage: "git remote add <name> <url>",
                    example: "git remote add origin https://github.com/user/repo.git",
                },
                {
                    name: "git fetch",
                    descriptionKey: "playground.commands.gitFetch.description",
                    explanationKey: "playground.commands.gitFetch.explanation",
                    usage: "git fetch [remote]",
                    example: "git fetch origin",
                },
            ],
        },
        {
            categoryKey: "category.undoing",
            commands: [
                {
                    name: "git restore",
                    descriptionKey: "playground.commands.gitRestore.description",
                    explanationKey: "playground.commands.gitRestore.explanation",
                    usage: "git restore <file> or git restore --staged <file>",
                    example: "git restore --staged index.html",
                },
                {
                    name: "git reset",
                    descriptionKey: "playground.commands.gitReset.description",
                    explanationKey: "playground.commands.gitReset.explanation",
                    usage: "git reset [--soft | --mixed | --hard] [commit]",
                    example: "git reset --hard HEAD~1",
                },
                {
                    name: "git revert",
                    descriptionKey: "playground.commands.gitRevert.description",
                    explanationKey: "playground.commands.gitRevert.explanation",
                    usage: "git revert <commit>",
                    example: "git revert HEAD",
                },
            ],
        },
        {
            categoryKey: "category.advanced",
            commands: [
                {
                    name: "git rebase",
                    descriptionKey: "playground.commands.gitRebase.description",
                    explanationKey: "playground.commands.gitRebase.explanation",
                    usage: "git rebase <base>",
                    example: "git rebase main",
                },
                {
                    name: "git stash",
                    descriptionKey: "playground.commands.gitStash.description",
                    explanationKey: "playground.commands.gitStash.explanation",
                    usage: "git stash [pop]",
                    example: "git stash",
                },
                {
                    name: "git tag",
                    descriptionKey: "playground.commands.gitTag.description",
                    explanationKey: "playground.commands.gitTag.explanation",
                    usage: "git tag [name] [commit]",
                    example: "git tag v1.0.0",
                },
                {
                    name: "git cherry-pick",
                    descriptionKey: "playground.commands.gitCherryPick.description",
                    explanationKey: "playground.commands.gitCherryPick.explanation",
                    usage: "git cherry-pick <commit>",
                    example: "git cherry-pick abc123",
                },
                {
                    name: "git bisect",
                    descriptionKey: "playground.commands.gitBisect.description",
                    explanationKey: "playground.commands.gitBisect.explanation",
                    usage: "git bisect <subcommand>",
                    example: "git bisect start",
                },
            ],
        },
    ];

    const gitCommands = commandGroups.map(group => ({
        category: t(group.categoryKey),
        commands: group.commands.map(({ descriptionKey, explanationKey, ...command }) => ({
            ...command,
            description: t(descriptionKey),
            explanation: t(explanationKey),
        })),
    }));

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
            <div className="bg-[#1a1625] text-purple-100">
                <div className="container mx-auto p-4">
                    <h1 className="mb-4 text-center text-2xl font-bold text-white sm:text-3xl">
                        {t("playground.title")}
                    </h1>
                    <p className="mb-6 text-center text-base text-purple-300 sm:text-lg">{t("playground.subtitle")}</p>

                    {/* Mobile section toggles */}
                    <div className="mb-4 flex flex-col gap-2 md:hidden">
                        <Button
                            variant="outline"
                            onClick={toggleTerminal}
                            className="flex w-full items-center justify-between border-purple-700 text-purple-200">
                            <span className="flex items-center">
                                <TerminalIcon className="mr-2 h-5 w-5 text-purple-400" />
                                {t("playground.gitTerminal")}
                            </span>
                            {terminalCollapsed ? (
                                <ChevronDown className="h-5 w-5" />
                            ) : (
                                <ChevronUp className="h-5 w-5" />
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={toggleCheatSheet}
                            className="flex w-full items-center justify-between border-purple-700 text-purple-200">
                            <span className="flex items-center">
                                <BookOpen className="mr-2 h-5 w-5 text-purple-400" />
                                {t("playground.gitCheatSheet")}
                            </span>
                            {cheatSheetCollapsed ? (
                                <ChevronDown className="h-5 w-5" />
                            ) : (
                                <ChevronUp className="h-5 w-5" />
                            )}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Terminal Side */}
                        <div className={`${terminalCollapsed ? "hidden md:block" : ""}`}>
                            <Terminal
                                className="h-[580px] rounded-md"
                                showHelpButton={true}
                                showResetButton={false}
                                isPlaygroundMode={true}
                            />
                        </div>

                        {/* Cheat Sheet Side */}
                        <Card
                            className={`border-purple-900/20 bg-purple-900/10 ${cheatSheetCollapsed ? "hidden md:block" : ""}`}>
                            <CardHeader>
                                <CardTitle className="mb-2 flex items-center text-white">
                                    <BookOpen className="mr-2 h-5 w-5 text-purple-400" />
                                    {t("playground.gitCheatSheet")}
                                </CardTitle>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-purple-400" />
                                    <Input
                                        placeholder={t("playground.searchCommands")}
                                        className="border-purple-800 bg-purple-900/30 pl-8 text-purple-200 placeholder:text-purple-500"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px] overflow-y-auto pr-2 md:h-[420px]">
                                    {filteredCommands.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Search className="mb-2 h-8 w-8 text-purple-500" />
                                            <p className="text-purple-400">
                                                {t("playground.noCommands")} &quot;{searchTerm}&quot;
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2 text-purple-400"
                                                onClick={() => setSearchTerm("")}>
                                                {t("playground.resetSearch")}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Accordion type="single" collapsible className="space-y-4">
                                            {filteredCommands.map((category, index) => (
                                                <div key={index} className="mb-6">
                                                    <h3 className="mb-2 font-medium text-purple-300">
                                                        {category.category}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {category.commands.map((command, cmdIndex) => (
                                                            <AccordionItem
                                                                key={cmdIndex}
                                                                value={`${index}-${cmdIndex}`}
                                                                className="overflow-hidden rounded-md border border-purple-800/40">
                                                                <AccordionTrigger className="px-3 py-2 hover:bg-purple-800/20 hover:no-underline">
                                                                    <div>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="flex items-center font-mono text-sm font-semibold text-white">
                                                                                <Command className="mr-1.5 h-3.5 w-3.5 text-purple-400" />
                                                                                {command.name}
                                                                            </span>
                                                                        </div>
                                                                        <div className="mt-1 text-sm text-purple-300">
                                                                            {command.description}
                                                                        </div>
                                                                    </div>
                                                                </AccordionTrigger>
                                                                <AccordionContent className="border-t border-purple-800/30 bg-purple-900/20 px-3 py-3">
                                                                    <div className="mb-2">
                                                                        <span className="text-xs font-medium text-purple-400">
                                                                            {t("playground.usage")}
                                                                        </span>
                                                                        <pre className="mt-1 overflow-x-auto rounded bg-black/20 p-1.5 font-mono text-xs text-green-400">
                                                                            {command.usage}
                                                                        </pre>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                        <span className="text-xs font-medium text-purple-400">
                                                                            {t("playground.example")}
                                                                        </span>
                                                                        <pre className="mt-1 overflow-x-auto rounded bg-black/20 p-1.5 font-mono text-xs text-green-400">
                                                                            {command.example}
                                                                        </pre>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs font-medium text-purple-400">
                                                                            {t("playground.explanation")}
                                                                        </span>
                                                                        <p className="mt-1 text-xs text-purple-200">
                                                                            {command.explanation}
                                                                        </p>
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </Accordion>
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
            </div>
        </PageLayout>
    );
}
