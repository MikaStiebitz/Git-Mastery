"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PageLayout } from "~/components/layout/PageLayout";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useLanguage } from "~/contexts/LanguageContext";
import {
    Grid2X2,
    Apple,
    Terminal,
    Download,
    ExternalLink,
    Key,
    Github,
    GitlabIcon as Gitlab,
    AlertTriangle,
    Folder,
    HelpCircle,
    Check,
    Copy,
} from "lucide-react";

type Platform = "windows" | "linux" | "mac";

/** Prose measure + colour, shared by every paragraph and list on the page. */
const PROSE = "max-w-[70ch] leading-relaxed text-gm-ink-soft";

/** The only part of the SSH walk-through that differs per platform. */
const COPY_KEY_COMMANDS: Record<Platform, string[]> = {
    windows: ["clip < ~/.ssh/id_ed25519.pub", "# oder:", "Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard"],
    linux: [
        "cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard",
        "# oder bei Ubuntu/Debian:",
        "cat ~/.ssh/id_ed25519.pub | wl-copy",
        "# oder einfach anzeigen und manuell kopieren:",
        "cat ~/.ssh/id_ed25519.pub",
    ],
    mac: ["pbcopy < ~/.ssh/id_ed25519.pub", "# oder anzeigen und manuell kopieren:", "cat ~/.ssh/id_ed25519.pub"],
};

const COPY_KEY_LABEL_KEYS: Record<Platform, string> = {
    windows: "installation.ssh.windows.copyKey",
    linux: "installation.ssh.linux.copyKey",
    mac: "installation.ssh.mac.copyKey",
};

/**
 * A terminal snippet: an inset inside the surrounding panel, set in the code face, with a
 * copy button that reports success by swapping its icon and turning lime. Comment lines are
 * dimmed like terminal output so the commands stay the loudest thing in the box.
 */
function CodeBlock({ lines }: { lines: string[] }) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);
    const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (resetTimeout.current) clearTimeout(resetTimeout.current);
        },
        [],
    );

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(lines.join("\n"));
            setCopied(true);
            if (resetTimeout.current) clearTimeout(resetTimeout.current);
            resetTimeout.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard unavailable (insecure origin or denied permission): leave the block as is.
        }
    };

    return (
        <div className="gm-inset relative">
            <pre className="gm-scroll overflow-x-auto p-3 pe-14 [font-family:var(--font-code)] text-sm leading-relaxed">
                <code>
                    {lines.map((line, index) => (
                        <span
                            key={index}
                            className={`block ${line.trimStart().startsWith("#") ? "text-gm-ink-dim" : "text-gm-ink"}`}>
                            {line === "" ? " " : line}
                        </span>
                    ))}
                </code>
            </pre>
            <button
                type="button"
                onClick={() => void handleCopy()}
                aria-label={copied ? t("common.copied") : t("common.copy")}
                className={`focus-visible:outline-gm-cyan absolute end-1.5 top-1.5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[0.7rem] border-2 transition-colors duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-3 focus-visible:outline-offset-2 ${
                    copied
                        ? "border-gm-lime-edge bg-gm-night text-gm-lime"
                        : "border-gm-line bg-gm-night text-gm-ink-dim hover:border-gm-grape-hi hover:text-gm-ink"
                }`}>
                {copied ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                )}
            </button>
        </div>
    );
}

/** A numbered walk-through inside a panel. */
function Steps({ items }: { items: string[] }) {
    return (
        <ol className={`marker:text-gm-ink-dim list-decimal space-y-2 ps-6 marker:font-semibold ${PROSE}`}>
            {items.map((step, index) => (
                <li key={index}>{step}</li>
            ))}
        </ol>
    );
}

/** A sub-step of an installation panel: bold Geist Sans heading plus its content. */
function Section({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
    return (
        <section className="space-y-3">
            <h3 className="text-gm-ink flex items-center gap-2 text-base font-bold [overflow-wrap:anywhere] sm:text-lg sm:[overflow-wrap:normal]">
                {icon}
                {title}
            </h3>
            {children}
        </section>
    );
}

/** The one outbound download per platform panel: the primary action, so lime. */
function DownloadLink({ href, label }: { href: string; label: string }) {
    return (
        <div className="flex justify-center pt-1">
            <Button asChild size="lg" className="h-auto min-h-13 w-full py-3 whitespace-normal sm:w-auto">
                <a href={href} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {label}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
            </Button>
        </div>
    );
}

/** An outbound link in the resources list. */
function ResourceLink({ href, label, className = "" }: { href: string; label: string; className?: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gm-lime inline-flex items-center gap-1 underline-offset-4 hover:underline ${className}`}>
            {label}
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
        </a>
    );
}

/**
 * SSH keys, the GitHub/GitLab hook-up and the first repository. Identical on all three
 * platforms apart from the clipboard command, so the platform comes in as a prop instead of
 * the block being repeated per tab.
 */
function SshSection({ platform }: { platform: Platform }) {
    const { t } = useLanguage();

    return (
        <section className="border-gm-line space-y-4 border-t-2 pt-6">
            <h3 className="text-gm-ink flex items-center gap-2 text-lg font-bold">
                <Key className="text-gm-grape-hi h-5 w-5 shrink-0" aria-hidden="true" />
                {t("installation.ssh.title")}
            </h3>
            <p className={PROSE}>{t("installation.ssh.intro")}</p>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ssh-generate">
                    <AccordionTrigger>
                        <span className="min-w-0 text-start">{t("installation.ssh.generate")}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <p className={PROSE}>{t("installation.ssh.generateDesc")}</p>
                        <CodeBlock lines={['ssh-keygen -t ed25519 -C "your.email@example.com"']} />
                        <p className={PROSE}>{t("installation.ssh.saveLocationDesc")}</p>
                        <p className={PROSE}>{t("installation.ssh.passphraseDesc")}</p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ssh-copy">
                    <AccordionTrigger>
                        <span className="min-w-0 text-start">{t("installation.ssh.copyKey")}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <p className={PROSE}>{t("installation.ssh.copyKeyDesc")}</p>
                        <p className="text-gm-ink font-semibold">{t(COPY_KEY_LABEL_KEYS[platform])}</p>
                        <CodeBlock lines={COPY_KEY_COMMANDS[platform]} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="github-setup">
                    <AccordionTrigger>
                        <span className="flex min-w-0 items-center gap-2 text-start">
                            <Github className="text-gm-grape-hi h-4 w-4 shrink-0" aria-hidden="true" />
                            {t("installation.github.title")}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <p className={PROSE}>{t("installation.github.intro")}</p>
                        <Steps
                            items={[
                                t("installation.github.step1"),
                                t("installation.github.step2"),
                                t("installation.github.step3"),
                                t("installation.github.step4"),
                                t("installation.github.step5"),
                                t("installation.github.step6"),
                                t("installation.github.step7"),
                            ]}
                        />
                        <p className="text-gm-ink font-semibold">{t("installation.github.test")}</p>
                        <p className={PROSE}>{t("installation.github.testDesc")}</p>
                        <CodeBlock lines={["ssh -T git@github.com"]} />
                        <p className={`text-sm ${PROSE}`}>{t("installation.github.testSuccess")}</p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="gitlab-setup">
                    <AccordionTrigger>
                        <span className="flex min-w-0 items-center gap-2 text-start">
                            <Gitlab className="text-gm-grape-hi h-4 w-4 shrink-0" aria-hidden="true" />
                            {t("installation.gitlab.title")}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <p className={PROSE}>{t("installation.gitlab.intro")}</p>
                        <Steps
                            items={[
                                t("installation.gitlab.step1"),
                                t("installation.gitlab.step2"),
                                t("installation.gitlab.step3"),
                                t("installation.gitlab.step4"),
                                t("installation.gitlab.step5"),
                                t("installation.gitlab.step6"),
                                t("installation.gitlab.step7"),
                            ]}
                        />
                        <p className="text-gm-ink font-semibold">{t("installation.gitlab.test")}</p>
                        <p className={PROSE}>{t("installation.gitlab.testDesc")}</p>
                        <CodeBlock lines={["ssh -T git@gitlab.com"]} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="first-repo">
                    <AccordionTrigger>
                        <span className="flex min-w-0 items-center gap-2 text-start">
                            <Folder className="text-gm-grape-hi h-4 w-4 shrink-0" aria-hidden="true" />
                            {t("installation.firstRepo.title")}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-5">
                        <p className={PROSE}>{t("installation.firstRepo.intro")}</p>

                        <div className="space-y-3">
                            <h4 className="text-gm-ink font-bold">{t("installation.firstRepo.clone")}</h4>
                            <p className={PROSE}>{t("installation.firstRepo.cloneDesc")}</p>
                            <CodeBlock lines={["git clone git@github.com:username/repository.git", "cd repository"]} />
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-gm-ink font-bold">{t("installation.firstRepo.create")}</h4>
                            <p className={PROSE}>{t("installation.firstRepo.createDesc")}</p>
                            <CodeBlock
                                lines={[
                                    "mkdir mein-projekt",
                                    "cd mein-projekt",
                                    "git init",
                                    'echo "# Mein Projekt" > README.md',
                                    "git add README.md",
                                    'git commit -m "Initial commit"',
                                ]}
                            />
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-gm-ink font-bold">{t("installation.firstRepo.connect")}</h4>
                            <p className={PROSE}>{t("installation.firstRepo.connectDesc")}</p>
                            <CodeBlock
                                lines={[
                                    "git remote add origin git@github.com:username/repository.git",
                                    "git branch -M main",
                                    "git push -u origin main",
                                ]}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    );
}

export default function InstallationPage() {
    const { t } = useLanguage();

    /** Name and email are configured the same way on every platform. */
    const configCommands = [
        'git config --global user.name "Your Name"',
        'git config --global user.email "your.email@example.com"',
    ];

    /** Configure + verify close every platform panel. */
    const renderSharedSetup = () => (
        <>
            <Section title={t("installation.config")}>
                <p className={PROSE}>{t("installation.configDesc")}</p>
                <CodeBlock lines={configCommands} />
            </Section>

            <Section title={t("installation.verification")}>
                <p className={PROSE}>{t("installation.verificationDesc")}</p>
                <CodeBlock lines={["git --version"]} />
            </Section>
        </>
    );

    return (
        <PageLayout>
            <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
                <h1 className="font-display text-gm-ink text-3xl leading-[1.05] [text-wrap:balance] [overflow-wrap:anywhere] sm:text-4xl sm:[overflow-wrap:normal]">
                    {t("installation.title")}
                </h1>
                <h2 className="text-gm-ink mt-5 text-lg font-bold sm:text-xl">{t("installation.subtitle")}</h2>
                <p className={`mt-3 text-lg text-pretty ${PROSE}`}>{t("installation.intro")}</p>

                {/* OS selection: one panel of instructions at a time. */}
                <Tabs defaultValue="windows" className="mt-8">
                    <TabsList className="flex w-full justify-start gap-1">
                        <TabsTrigger value="windows" className="min-h-11 flex-1 px-2 sm:flex-none sm:px-3.5">
                            <Grid2X2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Windows
                        </TabsTrigger>
                        <TabsTrigger value="linux" className="min-h-11 flex-1 px-2 sm:flex-none sm:px-3.5">
                            <Terminal className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Linux
                        </TabsTrigger>
                        <TabsTrigger value="mac" className="min-h-11 flex-1 px-2 sm:flex-none sm:px-3.5">
                            <Apple className="h-4 w-4 shrink-0" aria-hidden="true" />
                            macOS
                        </TabsTrigger>
                    </TabsList>

                    {/* Windows Installation Instructions */}
                    <TabsContent value="windows">
                        <Card className="space-y-6 p-5 sm:p-7">
                            <h2 className="text-gm-ink text-xl font-bold [overflow-wrap:anywhere] sm:text-2xl sm:[overflow-wrap:normal]">
                                {t("installation.windows.title")}
                            </h2>

                            <Section
                                title={t("installation.windows.download")}
                                icon={<Download className="text-gm-grape-hi h-5 w-5 shrink-0" aria-hidden="true" />}>
                                <Steps
                                    items={[
                                        t("installation.windows.step1"),
                                        t("installation.windows.step2"),
                                        t("installation.windows.step3"),
                                    ]}
                                />
                                <DownloadLink
                                    href="https://git-scm.com/download/win"
                                    label={t("installation.download")}
                                />
                            </Section>

                            <Section title={t("installation.windows.install")}>
                                <Steps
                                    items={[
                                        t("installation.windows.step4"),
                                        t("installation.windows.step5"),
                                        t("installation.windows.step6"),
                                        t("installation.windows.step7"),
                                    ]}
                                />
                            </Section>

                            {renderSharedSetup()}

                            <SshSection platform="windows" />
                        </Card>
                    </TabsContent>

                    {/* Linux Installation Instructions */}
                    <TabsContent value="linux">
                        <Card className="space-y-6 p-5 sm:p-7">
                            <h2 className="text-gm-ink text-xl font-bold [overflow-wrap:anywhere] sm:text-2xl sm:[overflow-wrap:normal]">
                                {t("installation.linux.title")}
                            </h2>

                            <Section title={t("installation.linux.debian")}>
                                <CodeBlock lines={["sudo apt update", "sudo apt install git"]} />
                            </Section>

                            <Section title={t("installation.linux.fedora")}>
                                <CodeBlock lines={["sudo dnf install git"]} />
                            </Section>

                            <Section title={t("installation.linux.arch")}>
                                <CodeBlock lines={["sudo pacman -S git"]} />
                                <DownloadLink
                                    href="https://git-scm.com/download/linux"
                                    label={t("installation.moreDistros")}
                                />
                            </Section>

                            {renderSharedSetup()}

                            <SshSection platform="linux" />
                        </Card>
                    </TabsContent>

                    {/* macOS Installation Instructions */}
                    <TabsContent value="mac">
                        <Card className="space-y-6 p-5 sm:p-7">
                            <h2 className="text-gm-ink text-xl font-bold [overflow-wrap:anywhere] sm:text-2xl sm:[overflow-wrap:normal]">
                                {t("installation.mac.title")}
                            </h2>

                            <Section title={t("installation.mac.option1")}>
                                <p className={PROSE}>{t("installation.mac.option1Desc")}</p>
                                <CodeBlock lines={["git --version"]} />
                            </Section>

                            <Section title={t("installation.mac.option2")}>
                                <Steps
                                    items={[
                                        t("installation.mac.step1"),
                                        t("installation.mac.step2"),
                                        t("installation.mac.step3"),
                                    ]}
                                />
                                <DownloadLink
                                    href="https://git-scm.com/download/mac"
                                    label={t("installation.download")}
                                />
                            </Section>

                            <Section title={t("installation.mac.brew")}>
                                <p className={PROSE}>{t("installation.mac.brewDesc")}</p>
                                <CodeBlock
                                    lines={[
                                        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
                                        "brew install git",
                                    ]}
                                />
                            </Section>

                            {renderSharedSetup()}

                            <SshSection platform="mac" />
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Additional Tips and Resources */}
                <Card className="mt-8 space-y-6 p-5 sm:p-7">
                    <h2 className="text-gm-ink text-xl font-bold [overflow-wrap:anywhere] sm:text-2xl sm:[overflow-wrap:normal]">
                        {t("installation.additionalSettings.title")}
                    </h2>
                    <p className={PROSE}>{t("installation.additionalSettings.intro")}</p>

                    <Section title={t("installation.additionalSettings.lineEndings")}>
                        <p className={PROSE}>{t("installation.additionalSettings.lineEndingsDesc")}</p>
                        <CodeBlock
                            lines={[
                                "# Windows",
                                "git config --global core.autocrlf true",
                                "",
                                "# macOS/Linux",
                                "git config --global core.autocrlf input",
                            ]}
                        />
                    </Section>

                    <Section title={t("installation.additionalSettings.defaultBranch")}>
                        <p className={PROSE}>{t("installation.additionalSettings.defaultBranchDesc")}</p>
                        <CodeBlock lines={["git config --global init.defaultBranch main"]} />
                    </Section>

                    <Section title={t("installation.additionalSettings.editor")}>
                        <p className={PROSE}>{t("installation.additionalSettings.editorDesc")}</p>
                        <CodeBlock
                            lines={[
                                "# For VSCode",
                                'git config --global core.editor "code --wait"',
                                "",
                                "# For Vim",
                                "git config --global core.editor vim",
                            ]}
                        />
                    </Section>
                </Card>

                {/* Troubleshooting Section */}
                <Card className="mt-8 space-y-4 p-5 sm:p-7">
                    <h2 className="text-gm-ink flex items-center gap-2 text-xl font-bold [overflow-wrap:anywhere] sm:text-2xl sm:[overflow-wrap:normal]">
                        <HelpCircle className="text-gm-grape-hi h-5 w-5 shrink-0" aria-hidden="true" />
                        {t("installation.troubleshooting.title")}
                    </h2>
                    <p className={PROSE}>{t("installation.troubleshooting.intro")}</p>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="command-not-found">
                            <AccordionTrigger>
                                <span className="flex min-w-0 items-center gap-2 text-start">
                                    <AlertTriangle className="text-gm-coral h-4 w-4 shrink-0" aria-hidden="true" />
                                    {t("installation.troubleshooting.commandNotFound")}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className={`whitespace-pre-line ${PROSE}`}>
                                    {t("installation.troubleshooting.commandNotFoundSolution")}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="permission-denied">
                            <AccordionTrigger>
                                <span className="flex min-w-0 items-center gap-2 text-start">
                                    <AlertTriangle className="text-gm-coral h-4 w-4 shrink-0" aria-hidden="true" />
                                    {t("installation.troubleshooting.permissionDenied")}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className={`whitespace-pre-line ${PROSE}`}>
                                    {t("installation.troubleshooting.permissionDeniedSolution")}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="https-to-ssh">
                            <AccordionTrigger>
                                <span className="min-w-0 text-start">
                                    {t("installation.troubleshooting.httpsToSsh")}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3">
                                <p className={PROSE}>{t("installation.troubleshooting.httpsToSshSolution")}</p>
                                <CodeBlock
                                    lines={["git remote set-url origin git@github.com:username/repository.git"]}
                                />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="ssl-error">
                            <AccordionTrigger>
                                <span className="flex min-w-0 items-center gap-2 text-start">
                                    <AlertTriangle className="text-gm-coral h-4 w-4 shrink-0" aria-hidden="true" />
                                    {t("installation.troubleshooting.sslError")}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className={`whitespace-pre-line ${PROSE}`}>
                                    {t("installation.troubleshooting.sslErrorSolution")}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="line-endings">
                            <AccordionTrigger>
                                <span className="min-w-0 text-start">
                                    {t("installation.troubleshooting.lineEndingIssues")}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className={`whitespace-pre-line ${PROSE}`}>
                                    {t("installation.troubleshooting.lineEndingIssuesSolution")}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="merge-conflicts">
                            <AccordionTrigger>
                                <span className="min-w-0 text-start">
                                    {t("installation.troubleshooting.mergeConflicts")}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className={`whitespace-pre-line ${PROSE}`}>
                                    {t("installation.troubleshooting.mergeConflictsSolution")}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Card>

                {/* Resources */}
                <Card className="mt-8 space-y-6 p-5 sm:p-7">
                    <h2 className="text-gm-ink text-xl font-bold [overflow-wrap:anywhere] sm:text-2xl sm:[overflow-wrap:normal]">
                        {t("installation.resources.title")}
                    </h2>

                    <Section title={t("installation.resources.gui")}>
                        <ul className={`marker:text-gm-ink-dim list-disc space-y-2 ps-6 ${PROSE}`}>
                            <li>
                                <strong className="text-gm-ink font-semibold">GitHub Desktop</strong> -{" "}
                                {t("installation.resources.githubDesktop")}
                                <ResourceLink
                                    href="https://desktop.github.com/"
                                    label={t("installation.resources.download")}
                                    className="ms-2"
                                />
                            </li>
                            <li>
                                <strong className="text-gm-ink font-semibold">GitKraken</strong> -{" "}
                                {t("installation.resources.gitkraken")}
                                <ResourceLink
                                    href="https://www.gitkraken.com/download"
                                    label={t("installation.resources.download")}
                                    className="ms-2"
                                />
                            </li>
                            <li>
                                <strong className="text-gm-ink font-semibold">Sourcetree</strong> -{" "}
                                {t("installation.resources.sourcetree")}
                                <ResourceLink
                                    href="https://www.sourcetreeapp.com/"
                                    label={t("installation.resources.download")}
                                    className="ms-2"
                                />
                            </li>
                        </ul>
                    </Section>

                    <Section title={t("installation.resources.editors")}>
                        <ul className={`marker:text-gm-ink-dim list-disc space-y-2 ps-6 ${PROSE}`}>
                            <li>
                                <strong className="text-gm-ink font-semibold">Visual Studio Code</strong> -{" "}
                                {t("installation.resources.vscode")}
                                <ResourceLink
                                    href="https://code.visualstudio.com/"
                                    label={t("installation.resources.download")}
                                    className="ms-2"
                                />
                            </li>
                            <li>
                                <strong className="text-gm-ink font-semibold">Atom</strong> -{" "}
                                {t("installation.resources.atom")}
                                <ResourceLink
                                    href="https://atom.io/"
                                    label={t("installation.resources.download")}
                                    className="ms-2"
                                />
                            </li>
                            <li>
                                <strong className="text-gm-ink font-semibold">Sublime Text</strong> -{" "}
                                {t("installation.resources.sublime")}
                                <ResourceLink
                                    href="https://www.sublimetext.com/"
                                    label={t("installation.resources.download")}
                                    className="ms-2"
                                />
                            </li>
                        </ul>
                    </Section>

                    <Section title={t("installation.resources.docs")}>
                        <ul className={`marker:text-gm-ink-dim list-disc space-y-2 ps-6 ${PROSE}`}>
                            <li>
                                <ResourceLink
                                    href="https://git-scm.com/doc"
                                    label={t("installation.resources.officialDocs")}
                                />
                            </li>
                            <li>
                                <ResourceLink
                                    href="https://git-scm.com/book/en/v2"
                                    label={t("installation.resources.proGitBook")}
                                />
                            </li>
                            <li>
                                <ResourceLink
                                    href="https://docs.github.com/en/get-started/quickstart/set-up-git"
                                    label={t("installation.resources.githubGuide")}
                                />
                            </li>
                        </ul>
                    </Section>
                </Card>
            </div>
        </PageLayout>
    );
}
