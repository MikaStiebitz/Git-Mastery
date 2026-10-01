"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
import {
    Activity,
    Archive,
    ArchiveRestore,
    ArrowRightLeft,
    ArrowRightIcon,
    Bug,
    Cherry,
    Copy,
    Download,
    Eraser,
    Eye,
    File,
    FileDiff,
    FilePlus,
    FileSymlink,
    FolderGit2,
    FolderOpen,
    GitBranchPlus,
    GitCommitHorizontal,
    GitCompareArrows,
    GitMerge,
    Globe,
    History,
    Inbox,
    List,
    MousePointerClick,
    OctagonX,
    PenLine,
    Pencil,
    Play,
    RotateCcw,
    ScrollText,
    Search,
    Tag,
    Trash2,
    Undo2,
    Upload,
    UserSearch,
    X,
    type LucideIcon,
} from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { LevelVisualizer, type GraphPickTargets } from "~/components/LevelVisualizer";
import { Button } from "~/components/ui/button";
import { CommandLog } from "~/components/visual/CommandLog";
import {
    CARD_DECK,
    CARD_GROUPS,
    buildCommand,
    getLevelHand,
    getSlotSuggestions,
    isBoardSlot,
    type CardIcon,
    type CardSlotKind,
    type CardTone,
    type GitCard,
} from "~/lib/visualCards";
import type { FileStatus } from "~/types";

const CARD_ICONS: Record<CardIcon, LucideIcon> = {
    init: FolderGit2,
    status: Activity,
    add: FilePlus,
    commit: GitCommitHorizontal,
    amend: PenLine,
    remove: Trash2,
    move: FileSymlink,
    restore: Eraser,
    diff: FileDiff,
    branch: GitBranchPlus,
    switch: ArrowRightLeft,
    merge: GitMerge,
    rebase: GitCompareArrows,
    abort: OctagonX,
    cherry: Cherry,
    reset: RotateCcw,
    revert: Undo2,
    reflog: History,
    stash: Archive,
    stashPop: ArchiveRestore,
    list: List,
    log: ScrollText,
    search: Search,
    show: Eye,
    blame: UserSearch,
    bisect: Bug,
    tag: Tag,
    clone: Copy,
    folder: FolderOpen,
    remote: Globe,
    push: Upload,
    pull: Download,
};

/**
 * A card's suit, from the Git legend: grape is everyday Git, lime a commit, cyan a branch move,
 * coral anything that undoes or throws work away. Written out in full so Tailwind can see them.
 */
const TONE_CLASSES: Record<CardTone, { stripe: string; icon: string; rest: string; armed: string }> = {
    grape: {
        stripe: "bg-gm-grape-hi",
        icon: "text-gm-grape-hi",
        rest: "border-gm-line shadow-[0_4px_0_var(--color-gm-grape-edge)]",
        armed: "border-gm-grape-hi shadow-[0_8px_0_var(--color-gm-grape-edge)]",
    },
    lime: {
        stripe: "bg-gm-lime",
        icon: "text-gm-lime",
        rest: "border-gm-line shadow-[0_4px_0_var(--color-gm-lime-edge)]",
        armed: "border-gm-lime shadow-[0_8px_0_var(--color-gm-lime-edge)]",
    },
    cyan: {
        stripe: "bg-gm-cyan",
        icon: "text-gm-cyan",
        rest: "border-gm-line shadow-[0_4px_0_var(--color-gm-cyan-edge)]",
        armed: "border-gm-cyan shadow-[0_8px_0_var(--color-gm-cyan-edge)]",
    },
    coral: {
        stripe: "bg-gm-coral",
        icon: "text-gm-coral",
        rest: "border-gm-line shadow-[0_4px_0_var(--color-gm-coral-edge)]",
        armed: "border-gm-coral shadow-[0_8px_0_var(--color-gm-coral-edge)]",
    },
};

/** Where a dragged card can land, and what landing there means. */
function dropTarget(enabled: boolean, onDrop: () => void) {
    if (!enabled) return {};
    return {
        onDragOver: (e: DragEvent) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        },
        onDrop: (e: DragEvent) => {
            e.preventDefault();
            onDrop();
        },
    };
}

/** The card face splits into the command (`git reset`) and what follows it (`--hard <commit>`). */
function cardFace(card: GitCard): { base: string; rest: string } {
    const baseWords = card.base.split(" ").length;
    const rest = card.tokens
        .slice(baseWords)
        .map(parts =>
            parts.map(part => (typeof part === "string" ? part : card.slots[part.slot]!.placeholder)).join(""),
        )
        .join(" ");
    return { base: card.base, rest };
}

interface PlayCardProps {
    card: GitCard;
    armed: boolean;
    onPlay: (card: GitCard) => void;
    onDragStart: (card: GitCard) => void;
    description: string;
}

function PlayCard({ card, armed, onPlay, onDragStart, description }: PlayCardProps) {
    const Icon = CARD_ICONS[card.icon];
    const tone = TONE_CLASSES[card.tone];
    const { base, rest } = cardFace(card);
    // Only a card whose first hole is a thing on the board has somewhere to be dropped.
    const draggable = card.slots[0] !== undefined && isBoardSlot(card.slots[0].kind);

    return (
        <button
            type="button"
            aria-pressed={armed}
            draggable={draggable}
            onDragStart={e => {
                e.dataTransfer.setData("text/plain", card.template);
                e.dataTransfer.effectAllowed = "copy";
                onDragStart(card);
            }}
            onClick={() => onPlay(card)}
            className={`group bg-gm-night focus-visible:outline-gm-cyan relative flex w-[8.75rem] shrink-0 cursor-pointer flex-col items-start gap-1 overflow-hidden rounded-[1rem] border-2 px-2.5 pt-3 pb-2 text-start transition-[transform,box-shadow,border-color] duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-3 focus-visible:outline-offset-4 motion-reduce:transition-none ${
                armed
                    ? `-translate-y-1.5 ${tone.armed} motion-reduce:translate-y-0`
                    : `${tone.rest} hover:-translate-y-0.5 active:translate-y-[3px] motion-reduce:hover:translate-y-0`
            } ${draggable ? "active:cursor-grabbing" : ""}`}>
            <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 ${tone.stripe}`} />
            <span className="flex w-full min-w-0 items-center gap-1.5">
                <Icon className={`h-3.5 w-3.5 shrink-0 ${tone.icon}`} aria-hidden="true" />
                <span className="text-gm-ink truncate [font-family:var(--font-code)] text-[12px] font-bold">
                    {base}
                </span>
            </span>
            <span className="text-gm-ink-soft w-full truncate [font-family:var(--font-code)] text-[11px]">
                {rest || " "}
            </span>
            <span className="text-gm-ink-dim line-clamp-2 text-[11px] leading-snug">{description}</span>
        </button>
    );
}

interface BoardFile {
    /** Path as Git names it: relative to the repository root, no leading slash. */
    path: string;
    status?: FileStatus;
}

interface VisualBoardProps {
    className?: string;
    onResetClick: () => void;
    onNextLevel: () => void;
}

/**
 * Visual mode's playing field, modelled on Oh My Git!: the working directory, the staging area
 * and the commit graph laid out side by side, with Git commands as a hand of cards underneath.
 *
 * Playing a card means pointing at what it should act on: tap (or drag the card onto) a file, a
 * branch or a commit. Where Git wants something typed — a branch name, a commit message — the
 * card asks for it right here. Every finished card runs as the real command through the same
 * handler the terminal uses, and the command is printed underneath, so the player learns the
 * syntax by watching rather than by reading.
 */
export function VisualBoard({ className = "", onResetClick, onNextLevel }: VisualBoardProps) {
    const {
        currentStage,
        currentLevel,
        levelManager,
        gitRepository,
        fileSystem,
        commandProcessor,
        terminalOutput,
        handleCommand,
        getEditableFiles,
        openFileEditor,
        isLevelCompleted,
    } = useGameContext();
    const { t } = useLanguage();

    const [armed, setArmed] = useState<{ card: GitCard; values: string[] } | null>(null);
    const [draft, setDraft] = useState("");
    const [showDeck, setShowDeck] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // The translated level: hints are where a level spells its commands out, in any language.
    const level = useMemo(
        () => levelManager.getLevel(currentStage, currentLevel, t),
        [levelManager, currentStage, currentLevel, t],
    );
    const hand = useMemo(() => (level ? getLevelHand(level) : []), [level]);
    const slot = armed ? armed.card.slots[armed.values.length] : undefined;
    const slotKind: CardSlotKind | undefined = slot?.kind;

    // A new level deals a new hand; a card held over from the last one would be a lie.
    useEffect(() => {
        setArmed(null);
        setDraft("");
    }, [currentStage, currentLevel]);

    // Escape puts the card back, wherever focus happens to be.
    useEffect(() => {
        if (!armed) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setArmed(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [armed]);

    // A typed slot takes the keyboard straight away.
    useEffect(() => {
        if (slotKind && !isBoardSlot(slotKind)) inputRef.current?.focus();
    }, [slotKind, armed?.values.length]);

    const run = (card: GitCard, values: string[]) => {
        setArmed(null);
        setDraft("");
        handleCommand(buildCommand(card, values));
    };

    const playCard = (card: GitCard) => {
        // Tapping the held card again puts it back.
        if (armed?.card.id === card.id) {
            setArmed(null);
            return;
        }
        if (card.slots.length === 0) {
            run(card, []);
            return;
        }
        setArmed({ card, values: [] });
        setDraft("");
    };

    const fill = (value: string) => {
        if (!armed) return;
        const values = [...armed.values, value];
        if (values.length < armed.card.slots.length) {
            setArmed({ card: armed.card, values });
            setDraft("");
            return;
        }
        run(armed.card, values);
    };

    const submitDraft = (e: FormEvent) => {
        e.preventDefault();
        const value = draft.trim();
        if (value) fill(value);
    };

    // ── What is on the board ─────────────────────────────────────────────────────────────────
    // Read straight from the models on every render: every command and every file save appends
    // to the terminal output held in context, which is what re-renders the board.
    const cwd = commandProcessor.getCurrentDirectory();
    const initialized = gitRepository.isInitialized();
    const tree = gitRepository.getWorkingTreeStatus();

    const fileMap = new Map<string, BoardFile>();
    for (const file of getEditableFiles()) {
        const path = file.path.replace(/^\//, "");
        fileMap.set(path, { path, status: tree[path] });
    }
    // A deleted file is gone from disk but very much still Git's business.
    for (const [path, status] of Object.entries(tree)) {
        if (status === "deleted" && !fileMap.has(path)) fileMap.set(path, { path, status });
    }
    const workingFiles = [...fileMap.values()].sort((a, b) => a.path.localeCompare(b.path));

    const stagedFiles = workingFiles.filter(f => f.status === "staged" || f.status === "staged+modified");

    /** A file as the command line names it, relative to where the player currently is. */
    const fileArg = (path: string): string => {
        if (cwd === "/" || cwd === "") return path;
        const dir = cwd.replace(/^\//, "");
        return path.startsWith(`${dir}/`) ? path.slice(dir.length + 1) : `/${path}`;
    };

    const pickingFile = slotKind === "file" || slotKind === "files";

    const graphPick: GraphPickTargets | null =
        slotKind === "commit" || slotKind === "branch" || slotKind === "ref"
            ? {
                  commits: slotKind !== "branch",
                  branches: slotKind !== "commit",
                  onPick: target => fill(target.type === "commit" ? target.id : target.name),
              }
            : null;

    // The last command and what it printed, typed or played: that is what the player looks for
    // after playing a card.
    const lastBlock = useMemo(() => {
        let start = terminalOutput.length - 1;
        while (start >= 0 && !terminalOutput[start]!.startsWith("$ ")) start--;
        return { start, lines: start >= 0 ? terminalOutput.slice(start) : [] };
    }, [terminalOutput]);

    // Suggestions for a typed slot: values the level itself uses, and folders for `cd`.
    const suggestions = (() => {
        if (!armed || !slot || isBoardSlot(slot.kind)) return [];
        if (slot.kind === "dir") {
            const entries = fileSystem.getDirectoryContents(cwd) ?? {};
            const dirs = Object.entries(entries)
                .filter(([name, item]) => item.type === "directory" && !name.startsWith("."))
                .map(([name]) => name);
            return cwd === "/" ? dirs : [...dirs, ".."];
        }
        return getSlotSuggestions(level, armed.card, armed.values.length);
    })();

    // ── Pieces ───────────────────────────────────────────────────────────────────────────────
    const statusChip = (status: FileStatus | undefined, where: "working" | "staging") => {
        let label: string | null = null;
        let tone = "border-gm-line text-gm-ink-dim";
        if (where === "staging") {
            label = t("level.staged");
            tone = "border-gm-lime-edge text-gm-lime";
        } else if (status === "untracked") {
            label = t("level.untracked");
        } else if (status === "modified" || status === "staged+modified") {
            label = t("level.modified");
            tone = "border-gm-coral-edge text-gm-coral";
        } else if (status === "deleted") {
            label = t("level.deleted");
            tone = "border-gm-coral-edge text-gm-coral";
        }
        if (!label) return null;
        return <span className={`gm-chip shrink-0 text-[10px] ${tone}`}>{label}</span>;
    };

    const fileRow = (file: BoardFile, where: "working" | "staging") => {
        const name = (
            <span
                className={`flex min-w-0 items-center gap-1.5 [font-family:var(--font-code)] text-[12px] ${
                    file.status === "deleted" && where === "working"
                        ? "text-gm-ink-dim line-through"
                        : "text-gm-ink-soft"
                }`}
                title={file.path}>
                <File className="text-gm-ink-dim h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{file.path}</span>
            </span>
        );

        if (pickingFile) {
            return (
                <button
                    type="button"
                    onClick={() => fill(fileArg(file.path))}
                    {...dropTarget(true, () => fill(fileArg(file.path)))}
                    aria-label={`${t("visual.pickThis")}: ${file.path}`}
                    className="outline-gm-cyan hover:bg-gm-deep focus-visible:outline-gm-cyan flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-[0.7rem] px-2 text-start outline-2 -outline-offset-2 transition-colors duration-150 outline-dashed focus-visible:outline-3 focus-visible:outline-solid">
                    {name}
                    {statusChip(file.status, where)}
                </button>
            );
        }

        return (
            <div className="hover:bg-gm-deep/60 flex min-h-11 items-center justify-between gap-2 rounded-[0.7rem] ps-2 transition-colors duration-150">
                {name}
                <span className="flex shrink-0 items-center gap-1">
                    {statusChip(file.status, where)}
                    {where === "working" && file.status !== "deleted" && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openFileEditor(`/${file.path}`)}
                            title={t("level.editFile")}
                            aria-label={`${t("level.editFile")}: ${file.path}`}>
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    )}
                </span>
            </div>
        );
    };

    const renderPreview = () => {
        if (!armed) return null;
        const { card, values } = armed;
        return (
            <code className="flex flex-wrap items-center gap-x-1.5 gap-y-1 [font-family:var(--font-code)] text-[13px]">
                {card.tokens.map((parts, i) => (
                    <span key={i} className="flex items-center">
                        {parts.map((part, j) => {
                            if (typeof part === "string") {
                                return (
                                    <span key={j} className="text-gm-ink">
                                        {part}
                                    </span>
                                );
                            }
                            const value = values[part.slot];
                            if (value !== undefined) {
                                return (
                                    <span key={j} className="text-gm-lime font-semibold">
                                        {value}
                                    </span>
                                );
                            }
                            const isCurrent = part.slot === values.length;
                            return (
                                <span
                                    key={j}
                                    className={
                                        isCurrent
                                            ? "border-gm-cyan text-gm-cyan rounded-[0.4rem] border-2 border-dashed px-1"
                                            : "text-gm-ink-dim"
                                    }>
                                    {card.slots[part.slot]!.placeholder}
                                </span>
                            );
                        })}
                    </span>
                ))}
            </code>
        );
    };

    const renderBanner = () => {
        if (!armed || !slot) {
            return (
                <div className="flex min-h-11 items-center justify-between gap-3">
                    {isLevelCompleted ? (
                        <p className="text-gm-lime flex items-center gap-2 text-sm font-semibold">
                            {t("level.levelCompleted")}
                        </p>
                    ) : (
                        <p className="text-gm-ink-soft flex items-center gap-2 text-sm">
                            <MousePointerClick className="text-gm-grape-hi h-4 w-4 shrink-0" aria-hidden="true" />
                            <span>{t("visual.idleHint")}</span>
                        </p>
                    )}
                    <span className="flex shrink-0 items-center gap-2">
                        {isLevelCompleted && (
                            <Button onClick={onNextLevel} size="sm">
                                <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                                <span className="truncate">{t("level.nextLevel")}</span>
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onResetClick}
                            title={t("level.resetOptions")}
                            aria-label={t("level.resetOptions")}>
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </span>
                </div>
            );
        }

        const quickPicks =
            slot.kind === "files"
                ? [{ value: ".", label: t("visual.allFiles") }]
                : slot.kind === "commit" || slot.kind === "ref"
                  ? [{ value: "HEAD", label: "HEAD" }]
                  : [];

        return (
            <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                        {renderPreview()}
                        <p className="text-gm-cyan text-sm font-semibold">{t(`visual.slot.${slot.kind}`)}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setArmed(null)}
                        title={t("visual.cancel")}
                        aria-label={t("visual.cancel")}>
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>

                {isBoardSlot(slot.kind) ? (
                    quickPicks.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {quickPicks.map(pick => (
                                <Button
                                    key={pick.value}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fill(pick.value)}
                                    className="[font-family:var(--font-code)]">
                                    {pick.label}
                                </Button>
                            ))}
                        </div>
                    )
                ) : (
                    <form onSubmit={submitDraft} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <label htmlFor="visual-slot-input" className="sr-only">
                                {t(`visual.slot.${slot.kind}`)}
                            </label>
                            <input
                                id="visual-slot-input"
                                ref={inputRef}
                                value={draft}
                                onChange={e => setDraft(e.target.value)}
                                autoComplete="off"
                                spellCheck={slot.kind === "message"}
                                className="gm-field h-11 min-w-0 flex-1 [font-family:var(--font-code)] text-sm"
                                placeholder={slot.placeholder}
                            />
                            <Button type="submit" disabled={!draft.trim()}>
                                <Play className="h-4 w-4" aria-hidden="true" />
                                <span>{t("visual.play")}</span>
                            </Button>
                        </div>
                        {suggestions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-gm-ink-dim text-xs">{t("visual.suggestions")}</span>
                                {suggestions.map(value => (
                                    <Button
                                        key={value}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fill(value)}
                                        className="max-w-full [font-family:var(--font-code)]">
                                        <span className="truncate">{value}</span>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </form>
                )}
            </div>
        );
    };

    const renderCards = (cards: GitCard[]) => (
        <ul className="flex flex-wrap gap-2 pt-2 pb-1.5">
            {cards.map(card => (
                <li key={card.id}>
                    <PlayCard
                        card={card}
                        armed={armed?.card.id === card.id}
                        onPlay={playCard}
                        onDragStart={c => {
                            setArmed({ card: c, values: [] });
                            setDraft("");
                        }}
                        description={t(`visual.card.${card.id}`)}
                    />
                </li>
            ))}
        </ul>
    );

    return (
        <section
            aria-label={t("visual.boardLabel")}
            className={`gm-panel flex min-w-0 flex-col gap-3 p-3 shadow-[0_6px_0_var(--color-gm-line)] sm:p-4 ${className}`}>
            {/* What to do next: the idle hint, or the card in hand and the hole it waits for. */}
            <div aria-live="polite" className="shrink-0">
                {renderBanner()}
            </div>

            {/* The three places a change lives, left to right: folder, staging area, history. */}
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <div className="flex min-h-0 flex-col gap-3">
                    <section
                        aria-labelledby="visual-working-dir"
                        className="gm-inset flex max-h-64 min-h-0 flex-1 flex-col p-2 md:max-h-none">
                        <h3
                            id="visual-working-dir"
                            className="text-gm-ink flex items-center gap-1.5 px-1 pb-1 text-xs font-semibold">
                            <FolderOpen className="text-gm-grape-hi h-3.5 w-3.5" aria-hidden="true" />
                            {t("visual.workingDir")}
                            {cwd !== "/" && (
                                <span className="text-gm-ink-dim truncate [font-family:var(--font-code)] font-normal">
                                    {cwd}
                                </span>
                            )}
                        </h3>
                        <ul className="gm-scroll min-h-0 flex-1 space-y-1 overflow-auto">
                            {workingFiles.length === 0 ? (
                                <li className="text-gm-ink-dim px-1 py-2 text-xs">{t("visual.noFiles")}</li>
                            ) : (
                                workingFiles.map(file => <li key={file.path}>{fileRow(file, "working")}</li>)
                            )}
                        </ul>
                    </section>

                    <section
                        aria-labelledby="visual-staging"
                        className={`gm-inset flex max-h-64 flex-col p-2 md:max-h-none ${
                            // Empty, it only needs its one line; filled, it shares the column evenly
                            // with the working directory instead of squeezing it.
                            stagedFiles.length > 0 ? "min-h-0 flex-1" : "shrink-0"
                        }`}>
                        <h3
                            id="visual-staging"
                            className="text-gm-ink flex items-center gap-1.5 px-1 pb-1 text-xs font-semibold">
                            <Inbox className="text-gm-lime h-3.5 w-3.5" aria-hidden="true" />
                            {t("visual.staging")}
                        </h3>
                        <ul className="gm-scroll min-h-0 flex-1 space-y-1 overflow-auto">
                            {!initialized ? (
                                <li className="text-gm-ink-dim px-1 py-2 text-xs">{t("level.gitNotInitialized")}</li>
                            ) : stagedFiles.length === 0 ? (
                                <li className="text-gm-ink-dim px-1 py-2 text-xs">{t("visual.nothingStaged")}</li>
                            ) : (
                                stagedFiles.map(file => <li key={file.path}>{fileRow(file, "staging")}</li>)
                            )}
                        </ul>
                    </section>
                </div>

                <div className="flex min-h-[300px] min-w-0 flex-col md:min-h-0">
                    <LevelVisualizer className="min-h-0 flex-1" pickTargets={graphPick} hideHint />
                </div>
            </div>

            <CommandLog
                key={lastBlock.start}
                lines={lastBlock.lines}
                emptyText={t("visual.logEmpty")}
                aria-label={t("visual.lastCommand")}
                className="max-h-24 min-h-12 shrink-0"
            />

            {/* The hand. Level cards by default; the whole deck for anyone who wants to explore. */}
            <div className="shrink-0">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-gm-ink text-sm font-semibold">
                        {showDeck ? t("visual.deckTitle") : t("visual.handTitle")}
                    </h3>
                    <Button variant="ghost" size="sm" aria-pressed={showDeck} onClick={() => setShowDeck(v => !v)}>
                        {showDeck ? t("visual.showHand") : t("visual.showDeck")}
                    </Button>
                </div>
                <div className="gm-inset gm-scroll mt-1 max-h-[12.5rem] overflow-y-auto px-2 pb-1">
                    {showDeck
                        ? CARD_GROUPS.map(group => (
                              <div key={group} className="pt-2">
                                  <h4 className="text-gm-ink-dim px-0.5 text-xs font-semibold">
                                      {t(`visual.group.${group}`)}
                                  </h4>
                                  {renderCards(CARD_DECK.filter(card => card.group === group))}
                              </div>
                          ))
                        : renderCards(hand)}
                </div>
            </div>
        </section>
    );
}
