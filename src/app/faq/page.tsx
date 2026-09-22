"use client";

import { PageLayout } from "~/components/layout/PageLayout";
import { Card } from "~/components/ui/card";
import { useLanguage } from "~/contexts/LanguageContext";
import {
    HelpCircle,
    GitBranch,
    GitCommit,
    GitMerge,
    History,
    Users,
    Github,
    Code,
    Workflow,
    Search,
    Terminal,
    ServerCrash,
    CheckCircle,
    Folder,
    Download,
} from "lucide-react";
import Link from "next/link";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";

interface FAQItem {
    id: string;
    icon: React.ReactNode;
    question: string;
    answer: string;
}

interface FAQSection {
    category: string;
    items: FAQItem[];
}

/** Question icons are graphics, so they carry the lifted grape and never a text colour. */
const iconClass = "h-5 w-5 shrink-0 text-gm-grape-hi";

export default function FAQPage() {
    const { t } = useLanguage();

    // FAQ items with their icons and categories
    const faqItems: FAQSection[] = [
        // Basics
        {
            category: "basics",
            items: [
                {
                    id: "what-is-git",
                    icon: <GitBranch className={iconClass} aria-hidden="true" />,
                    question: t("faq.whatIsGit.question"),
                    answer: t("faq.whatIsGit.answer"),
                },
                {
                    id: "why-created",
                    icon: <History className={iconClass} aria-hidden="true" />,
                    question: t("faq.whyCreated.question"),
                    answer: t("faq.whyCreated.answer"),
                },
                {
                    id: "vs-other-vcs",
                    icon: <Search className={iconClass} aria-hidden="true" />,
                    question: t("faq.vsOtherVcs.question"),
                    answer: t("faq.vsOtherVcs.answer"),
                },
                {
                    id: "benefits",
                    icon: <CheckCircle className={iconClass} aria-hidden="true" />,
                    question: t("faq.benefits.question"),
                    answer: t("faq.benefits.answer"),
                },
                {
                    id: "git-vs-github",
                    icon: <Github className={iconClass} aria-hidden="true" />,
                    question: t("faq.gitVsGithub.question"),
                    answer: t("faq.gitVsGithub.answer"),
                },
            ],
        },
        // Concepts
        {
            category: "concepts",
            items: [
                {
                    id: "repositories",
                    icon: <Folder className={iconClass} aria-hidden="true" />,
                    question: t("faq.repositories.question"),
                    answer: t("faq.repositories.answer"),
                },
                {
                    id: "commits",
                    icon: <GitCommit className={iconClass} aria-hidden="true" />,
                    question: t("faq.commits.question"),
                    answer: t("faq.commits.answer"),
                },
                {
                    id: "branches",
                    icon: <GitBranch className={iconClass} aria-hidden="true" />,
                    question: t("faq.branches.question"),
                    answer: t("faq.branches.answer"),
                },
                {
                    id: "merge",
                    icon: <GitMerge className={iconClass} aria-hidden="true" />,
                    question: t("faq.merge.question"),
                    answer: t("faq.merge.answer"),
                },
                {
                    id: "workflow",
                    icon: <Workflow className={iconClass} aria-hidden="true" />,
                    question: t("faq.workflow.question"),
                    answer: t("faq.workflow.answer"),
                },
            ],
        },
        // Usage
        {
            category: "usage",
            items: [
                {
                    id: "when-use",
                    icon: <HelpCircle className={iconClass} aria-hidden="true" />,
                    question: t("faq.whenUse.question"),
                    answer: t("faq.whenUse.answer"),
                },
                {
                    id: "small-projects",
                    icon: <Code className={iconClass} aria-hidden="true" />,
                    question: t("faq.smallProjects.question"),
                    answer: t("faq.smallProjects.answer"),
                },
                {
                    id: "team-collaboration",
                    icon: <Users className={iconClass} aria-hidden="true" />,
                    question: t("faq.teamCollaboration.question"),
                    answer: t("faq.teamCollaboration.answer"),
                },
                {
                    id: "command-line",
                    icon: <Terminal className={iconClass} aria-hidden="true" />,
                    question: t("faq.commandLine.question"),
                    answer: t("faq.commandLine.answer"),
                },
                {
                    id: "hosting",
                    icon: <ServerCrash className={iconClass} aria-hidden="true" />,
                    question: t("faq.hosting.question"),
                    answer: t("faq.hosting.answer"),
                },
            ],
        },
    ];

    // Helper function to render a FAQ section: one panel per category, questions as rows
    // inside it, so nothing turns into a card inside a card.
    const renderFAQSection = (category: string, items: FAQItem[]) => (
        <section key={category} className="mt-10">
            <h2 className="text-gm-ink text-xl font-bold [overflow-wrap:anywhere] sm:text-2xl sm:[overflow-wrap:normal]">
                {t(`faq.categories.${category}`)}
            </h2>
            <Card className="mt-4 px-5 py-1 sm:px-6 sm:py-2">
                <Accordion type="single" collapsible>
                    {items.map(item => (
                        <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger>
                                <span className="flex min-w-0 items-center gap-3 text-start">
                                    {item.icon}
                                    {item.question}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="max-w-[70ch] ps-8 whitespace-pre-line">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Card>
        </section>
    );

    return (
        <PageLayout>
            <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
                <h1 className="font-display text-gm-ink text-3xl leading-[1.05] [text-wrap:balance] [overflow-wrap:anywhere] sm:text-4xl sm:[overflow-wrap:normal]">
                    {t("faq.title")}
                </h1>

                <div className="mt-5 flex items-center gap-3">
                    <HelpCircle className="text-gm-grape-hi h-6 w-6 shrink-0" aria-hidden="true" />
                    <h2 className="text-gm-ink text-lg font-bold sm:text-xl">{t("faq.subtitle")}</h2>
                </div>
                <p className="text-gm-ink-soft mt-3 max-w-[70ch] text-lg leading-relaxed text-pretty">
                    {t("faq.intro")}
                </p>

                {/* Render each FAQ section */}
                {faqItems.map(section => renderFAQSection(section.category, section.items))}

                {/* Final encouragement section */}
                <Card className="mt-12 p-6 text-center sm:p-8">
                    <h2 className="text-gm-ink text-xl font-bold [overflow-wrap:anywhere] sm:text-2xl sm:[overflow-wrap:normal]">
                        {t("faq.readyToStart.title")}
                    </h2>
                    <p className="text-gm-ink-soft mx-auto mt-3 max-w-[60ch] leading-relaxed text-pretty">
                        {t("faq.readyToStart.text")}
                    </p>
                    <div className="mt-6 flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="h-auto min-h-13 py-3 whitespace-normal">
                            <Link href="/installation">
                                <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                                {t("faq.readyToStart.installButton")}
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="h-auto min-h-13 py-3 whitespace-normal">
                            <Link href="/level">
                                <Code className="h-4 w-4 shrink-0" aria-hidden="true" />
                                {t("faq.readyToStart.practiceButton")}
                            </Link>
                        </Button>
                    </div>
                </Card>
            </div>
        </PageLayout>
    );
}
