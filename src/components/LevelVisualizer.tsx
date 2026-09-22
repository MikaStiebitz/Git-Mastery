"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGameContext } from "~/contexts/GameContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { buildCommitGraph, type GraphNode } from "~/lib/buildCommitGraph";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { GitBranch, GitCommit, ZoomIn, ZoomOut, Maximize2, X, Sparkles } from "lucide-react";

// ── Layout constants ────────────────────────────────────────────────────────
const ROW_H = 72;
const COL_W = 58;
const R = 14;
const PAD_TOP = 44;
const PAD_LEFT = 40;
const PAD_BOTTOM = 36;
const BADGE_W_CHAR = 7.2;
const BADGE_H = 22;

// Lane palette straight out of the Git legend, so a lane's colour always means the same
// thing: the first lane is `main` (grape), the ones branching off it are feature (cyan),
// fix (coral) and commit (lime). Gold stays reserved for points and never shows up here.
const LANE_COLORS = [
    "var(--color-gm-grape-hi)",
    "var(--color-gm-cyan)",
    "var(--color-gm-coral)",
    "var(--color-gm-lime)",
];

const laneColor = (col: number): string => LANE_COLORS[col % LANE_COLORS.length]!;

const pseudoAuthors = ["Sam", "Alex", "Taylor", "Lee"];
const getPseudoAuthor = (id: string) =>
    pseudoAuthors[Math.abs(id.charCodeAt(0) || 0) % pseudoAuthors.length] ?? "Unknown";

interface LevelVisualizerProps {
    /** Optional height cap for the scrollable graph area */
    className?: string;
}

/**
 * Interactive, animated commit-graph of the player's current repository state.
 * Renders live after every terminal command: new commits pop in, edges draw
 * themselves and HEAD keeps a ring around it. Nodes are tappable for details and
 * branch badges highlight their history — a visual path through the level.
 */
export function LevelVisualizer({ className = "" }: LevelVisualizerProps) {
    const { gitRepository, terminalOutput, currentStage, currentLevel } = useGameContext();
    const { t } = useLanguage();

    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const detailRef = useRef<HTMLDivElement>(null);
    const prevNodeIdsRef = useRef<Set<string>>(new Set());
    const [selected, setSelected] = useState<GraphNode | null>(null);
    const [highlightBranch, setHighlightBranch] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);

    // Rebuild the graph whenever a command ran or the level changed
    const refreshKey = `${currentStage}-${currentLevel}-${terminalOutput.length}`;
    const { graph, branchHeads, currentBranch, initialized } = useMemo(() => {
        const isInit = gitRepository.isInitialized();
        const allCommits = gitRepository.getAllCommits();
        const heads = gitRepository.getBranchHeads();
        const branch = gitRepository.getCurrentBranch();
        const enriched = Object.fromEntries(
            Object.entries(allCommits).map(([id, c]) => [id, { ...c, author: getPseudoAuthor(id) }]),
        );
        return {
            graph: buildCommitGraph(enriched, heads, branch),
            branchHeads: heads,
            currentBranch: branch,
            initialized: isInit,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gitRepository, refreshKey]);

    const rowCount = graph.nodes.length;
    const maxRow = rowCount - 1;

    // Oldest commit at the top (like a growing tree), newest at the bottom
    const yOf = (node: GraphNode) => PAD_TOP + (maxRow - node.row) * ROW_H;
    const xOf = (node: GraphNode) => PAD_LEFT + node.col * COL_W;

    // Ancestor set for branch highlighting
    const highlightSet = useMemo(() => {
        if (!highlightBranch) return null;
        const headId = branchHeads[highlightBranch];
        if (!headId) return null;
        const byId = new Map(graph.nodes.map(n => [n.id, n]));
        const seen = new Set<string>();
        const queue = [headId];
        while (queue.length > 0) {
            const id = queue.pop()!;
            if (seen.has(id)) continue;
            seen.add(id);
            const node = byId.get(id);
            node?.parents.forEach(p => queue.push(p));
        }
        return seen;
    }, [highlightBranch, branchHeads, graph.nodes]);

    const svgWidth = PAD_LEFT + graph.colCount * COL_W + 230;
    const svgHeight = rowCount > 0 ? PAD_TOP + rowCount * ROW_H + PAD_BOTTOM : 0;

    // Clear selection when the level resets or commits disappear
    useEffect(() => {
        if (selected && !graph.nodes.some(n => n.id === selected.id)) setSelected(null);
        if (highlightBranch && !branchHeads[highlightBranch]) setHighlightBranch(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graph, branchHeads]);

    // ── Enter animations for new nodes / edges / badges ─────────────────────
    useEffect(() => {
        const container = stageRef.current;
        if (!container) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const prevIds = prevNodeIdsRef.current;
        const currentIds = new Set(graph.nodes.map(n => n.id));
        const newIds = graph.nodes.filter(n => !prevIds.has(n.id)).map(n => n.id);
        prevNodeIdsRef.current = currentIds;

        const ctx = gsap.context(() => {
            if (!reduced && newIds.length > 0) {
                const nodeEls = newIds
                    .map(id => container.querySelector(`[data-node-id="${CSS.escape(id)}"]`))
                    .filter(Boolean);
                if (nodeEls.length > 0) {
                    gsap.from(nodeEls, {
                        scale: 0,
                        transformOrigin: "center center",
                        ease: "power3.out",
                        duration: 0.45,
                        stagger: 0.07,
                    });
                }
                const edgeEls = Array.from(container.querySelectorAll<SVGPathElement>("path[data-edge-new='true']"));
                edgeEls.forEach(path => {
                    const len = path.getTotalLength();
                    gsap.fromTo(
                        path,
                        { strokeDasharray: len, strokeDashoffset: len },
                        { strokeDashoffset: 0, duration: 0.6, ease: "power2.out", delay: 0.1 },
                    );
                });
                const badgeEls = container.querySelectorAll("[data-badge]");
                gsap.from(badgeEls, { opacity: 0, x: -8, duration: 0.4, ease: "power2.out", stagger: 0.04 });
            }

            // The HEAD marker is a static ring, not a pulse: it says where the player is,
            // and a permanently throbbing halo is decoration the design system rules out.
            const halo = container.querySelector("[data-head-halo]");
            if (halo && !reduced) {
                gsap.from(halo, { scale: 0.75, opacity: 0, transformOrigin: "center center", duration: 0.4 });
            }
        }, container);

        return () => ctx.revert();
    }, [graph]);

    // Dim non-highlighted commits when a branch is selected
    useEffect(() => {
        const container = stageRef.current;
        if (!container) return;
        const groups = Array.from(container.querySelectorAll<SVGGElement>("[data-node-group]"));
        const edges = Array.from(container.querySelectorAll<SVGPathElement>("[data-edge]"));
        gsap.to(groups, {
            opacity: (i, el) => {
                const id = (el as SVGGElement).dataset.nodeGroup!;
                return !highlightSet || highlightSet.has(id) ? 1 : 0.18;
            },
            duration: 0.35,
        });
        gsap.to(edges, {
            opacity: (i, el) => {
                const from = (el as SVGPathElement).dataset.edgeFrom!;
                const to = (el as SVGPathElement).dataset.edgeTo!;
                return !highlightSet || (highlightSet.has(from) && highlightSet.has(to)) ? 0.8 : 0.1;
            },
            duration: 0.35,
        });
    }, [highlightSet]);

    // Slide-in for the detail panel
    useEffect(() => {
        if (!detailRef.current || !selected) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) return;
        gsap.fromTo(detailRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" });
    }, [selected]);

    const applyZoom = (next: number) => {
        const clamped = Math.min(1.6, Math.max(0.45, next));
        setZoom(clamped);
    };

    // Auto-fit once when the graph outgrows the container
    const autoFittedRef = useRef(false);
    useEffect(() => {
        if (autoFittedRef.current) return;
        const el = containerRef.current;
        if (!el || svgWidth === 0) return;
        if (svgWidth > el.clientWidth) {
            autoFittedRef.current = true;
            setZoom(Math.min(1, Math.max(0.45, (el.clientWidth - 24) / svgWidth)));
        }
    }, [svgWidth]);

    const fitToView = () => {
        const el = containerRef.current;
        if (!el || svgWidth === 0) return;
        applyZoom(Math.min(1, (el.clientWidth - 24) / svgWidth));
    };

    const commitLabel = (node: GraphNode) => `C${maxRow - node.row}`;

    // ── Empty state ─────────────────────────────────────────────────────────
    if (!initialized || rowCount === 0) {
        return (
            <div
                className={`gm-inset flex h-full min-h-[280px] flex-col items-center justify-center p-6 text-center ${className}`}>
                <svg width="120" height="120" viewBox="0 0 120 120" className="mb-4" aria-hidden="true">
                    <path
                        d="M60 96 L60 62 M60 62 C60 40 40 48 40 28 M60 62 C60 40 80 48 80 28"
                        stroke="var(--color-gm-grape-edge)"
                        strokeWidth="2.5"
                        strokeDasharray="5 6"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="60"
                        cy="96"
                        r="9"
                        fill="var(--color-gm-night)"
                        stroke="var(--color-gm-grape-hi)"
                        strokeWidth="2.5"
                    />
                    <circle
                        cx="40"
                        cy="28"
                        r="9"
                        fill="var(--color-gm-night)"
                        stroke="var(--color-gm-grape-edge)"
                        strokeWidth="2.5"
                        strokeDasharray="3 4"
                    />
                    <circle
                        cx="80"
                        cy="28"
                        r="9"
                        fill="var(--color-gm-night)"
                        stroke="var(--color-gm-grape-edge)"
                        strokeWidth="2.5"
                        strokeDasharray="3 4"
                    />
                </svg>
                <h3 className="text-gm-ink mb-1 text-base font-semibold">{t("visualizer.emptyTitle")}</h3>
                <p className="text-gm-ink-soft max-w-xs text-sm">
                    {initialized ? t("visualizer.emptyCommitHint") : t("visualizer.emptyInitHint")}
                </p>
            </div>
        );
    }

    return (
        <div className={`flex h-full flex-col ${className}`}>
            {/* Toolbar: branch chips + zoom controls */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
                <ul className="flex flex-wrap items-center gap-1.5">
                    {Object.keys(branchHeads).map(branch => {
                        const isCurrent = branch === currentBranch;
                        const isHighlighted = branch === highlightBranch;
                        return (
                            <li key={branch}>
                                {/* The branch HEAD sits on is lime, like every other "you are
                                    here" marker in the game; an active filter reads as a
                                    pressed keycap rather than as a second colour. */}
                                <button
                                    type="button"
                                    aria-pressed={isHighlighted}
                                    onClick={() => setHighlightBranch(isHighlighted ? null : branch)}
                                    className={`focus-visible:outline-gm-cyan flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border-2 px-3 [font-family:var(--font-code)] text-[11px] transition-[transform,box-shadow,border-color,color,filter] duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-3 focus-visible:outline-offset-4 motion-reduce:transition-none ${
                                        isCurrent
                                            ? "border-gm-lime-edge bg-gm-lime text-gm-void hover:brightness-105"
                                            : "border-gm-line bg-gm-void text-gm-ink-soft hover:border-gm-grape-hi hover:text-gm-ink"
                                    } ${
                                        isHighlighted
                                            ? isCurrent
                                                ? "translate-y-[3px] shadow-[0_1px_0_var(--color-gm-lime-edge)]"
                                                : "translate-y-[3px] shadow-[0_1px_0_var(--color-gm-line)]"
                                            : isCurrent
                                              ? "shadow-[0_4px_0_var(--color-gm-lime-edge)]"
                                              : "shadow-[0_4px_0_var(--color-gm-line)]"
                                    }`}
                                    title={t("visualizer.branchFilterHint")}>
                                    <GitBranch className="h-3 w-3 shrink-0" aria-hidden="true" />
                                    {branch}
                                    {isCurrent && <Sparkles className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <div className="ms-auto flex items-center gap-1">
                    <span className="text-gm-ink-dim me-1 hidden items-center gap-1 [font-family:var(--font-code)] text-[11px] tabular-nums sm:flex">
                        <GitCommit className="h-3 w-3" aria-hidden="true" />
                        {rowCount}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => applyZoom(zoom - 0.15)}
                        disabled={zoom <= 0.45}
                        aria-label={t("visualizer.zoomOut")}>
                        <ZoomOut className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => applyZoom(zoom + 0.15)}
                        disabled={zoom >= 1.6}
                        aria-label={t("visualizer.zoomIn")}>
                        <ZoomIn className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={fitToView} aria-label={t("visualizer.fit")}>
                        <Maximize2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
            </div>

            {/* Graph canvas */}
            <div
                ref={containerRef}
                className="gm-inset gm-scroll relative flex-1 overflow-auto [background-image:radial-gradient(var(--color-gm-grape-edge)_1px,transparent_1.1px)] [background-size:22px_22px]"
                onClick={() => setSelected(null)}>
                <div
                    ref={stageRef}
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: "top left",
                        width: svgWidth,
                        height: svgHeight,
                    }}
                    className="transition-transform duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none">
                    <svg width={svgWidth} height={svgHeight} className="overflow-visible select-none">
                        <defs>
                            {LANE_COLORS.map((c, i) => (
                                <marker
                                    key={i}
                                    id={`gm-arrow-${i}`}
                                    viewBox="0 0 10 10"
                                    refX="8"
                                    refY="5"
                                    markerWidth="7"
                                    markerHeight="7"
                                    orient="auto-start-reverse">
                                    <path d="M 0 1 L 9 5 L 0 9 z" fill={c} opacity="0.9" />
                                </marker>
                            ))}
                        </defs>

                        {/* Edges: child → parent, arrow pointing at the parent */}
                        {graph.edges.map(edge => {
                            const fromNode = graph.nodes.find(n => n.id === edge.fromId);
                            const toNode = graph.nodes.find(n => n.id === edge.toId);
                            if (!fromNode || !toNode) return null;
                            const x1 = xOf(fromNode);
                            const y1 = yOf(fromNode) - R - 3;
                            const x2 = xOf(toNode);
                            const y2 = yOf(toNode) + R + 5;
                            const colorIdx = fromNode.col % LANE_COLORS.length;
                            const isNew = !prevNodeIdsRef.current.has(edge.fromId);
                            const d =
                                x1 === x2
                                    ? `M ${x1} ${y1} L ${x2} ${y2}`
                                    : `M ${x1} ${y1} C ${x1} ${y1 - ROW_H * 0.45}, ${x2} ${y2 + ROW_H * 0.45}, ${x2} ${y2}`;
                            return (
                                <path
                                    key={`${edge.fromId}-${edge.toId}`}
                                    data-edge
                                    data-edge-from={edge.fromId}
                                    data-edge-to={edge.toId}
                                    data-edge-new={isNew ? "true" : undefined}
                                    d={d}
                                    stroke={laneColor(colorIdx)}
                                    strokeWidth={2.25}
                                    fill="none"
                                    opacity={0.8}
                                    markerEnd={`url(#gm-arrow-${colorIdx})`}
                                />
                            );
                        })}

                        {/* Commit nodes */}
                        {graph.nodes.map(node => {
                            const x = xOf(node);
                            const y = yOf(node);
                            const color = laneColor(node.col);
                            const isSelected = selected?.id === node.id;
                            return (
                                <g key={node.id} data-node-group={node.id}>
                                    {/* HEAD is lime everywhere in the game, so the ring that marks
                                        the player's position is lime rather than lane-coloured. */}
                                    {node.isHead && (
                                        <circle
                                            data-head-halo
                                            cx={x}
                                            cy={y}
                                            r={R + 4}
                                            fill="none"
                                            stroke="var(--color-gm-lime)"
                                            strokeWidth={2}
                                        />
                                    )}
                                    <g
                                        data-node-id={node.id}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`${commitLabel(node)} ${node.shortId}`}
                                        aria-pressed={isSelected}
                                        className="focus-visible:outline-gm-cyan cursor-pointer focus-visible:outline-3 focus-visible:outline-offset-2"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setSelected(isSelected ? null : node);
                                        }}
                                        onKeyDown={e => {
                                            if (e.key !== "Enter" && e.key !== " ") return;
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelected(isSelected ? null : node);
                                        }}>
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={R}
                                            fill={isSelected ? color : "var(--color-gm-night)"}
                                            stroke={color}
                                            strokeWidth={node.isMergeCommit ? 3.5 : 2.5}
                                            strokeDasharray={node.isMergeCommit ? "4 3" : undefined}
                                        />
                                        <text
                                            x={x}
                                            y={y + 3.5}
                                            textAnchor="middle"
                                            fontSize={10}
                                            fontWeight={700}
                                            fill={isSelected ? "var(--color-gm-void)" : "var(--color-gm-ink)"}
                                            className="pointer-events-none [font-family:var(--font-code)]">
                                            {commitLabel(node)}
                                        </text>
                                    </g>

                                    {/* Branch badges to the right of the node */}
                                    {node.branches.map((branch, bi) => {
                                        const isCurrentHead = node.isHead && branch === currentBranch;
                                        const label = isCurrentHead ? `${branch} ★` : branch;
                                        const w = label.length * BADGE_W_CHAR + 18;
                                        const bx = x + R + 12;
                                        const by = y - BADGE_H / 2 + bi * (BADGE_H + 4);
                                        return (
                                            <g
                                                key={branch}
                                                data-badge
                                                role="button"
                                                tabIndex={0}
                                                aria-label={branch}
                                                aria-pressed={highlightBranch === branch}
                                                className="focus-visible:outline-gm-cyan cursor-pointer focus-visible:outline-3 focus-visible:outline-offset-2"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setHighlightBranch(highlightBranch === branch ? null : branch);
                                                }}
                                                onKeyDown={e => {
                                                    if (e.key !== "Enter" && e.key !== " ") return;
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setHighlightBranch(highlightBranch === branch ? null : branch);
                                                }}>
                                                <path
                                                    d={`M ${bx - 7} ${y} L ${bx} ${y - 5} L ${bx} ${y + 5} z`}
                                                    fill={
                                                        isCurrentHead ? "var(--color-gm-lime)" : "var(--color-gm-deep)"
                                                    }
                                                />
                                                <rect
                                                    x={bx}
                                                    y={by}
                                                    width={w}
                                                    height={BADGE_H}
                                                    rx={BADGE_H / 2}
                                                    fill={
                                                        isCurrentHead ? "var(--color-gm-lime)" : "var(--color-gm-deep)"
                                                    }
                                                    stroke={isCurrentHead ? "var(--color-gm-lime-edge)" : color}
                                                    strokeWidth={2}
                                                />
                                                <text
                                                    x={bx + w / 2}
                                                    y={by + BADGE_H / 2 + 3.5}
                                                    textAnchor="middle"
                                                    fontSize={11}
                                                    fontWeight={isCurrentHead ? 700 : 500}
                                                    fill={
                                                        isCurrentHead ? "var(--color-gm-void)" : "var(--color-gm-ink)"
                                                    }
                                                    className="pointer-events-none [font-family:var(--font-code)]">
                                                    {label}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Detail panel for the selected commit */}
                {selected && (
                    <div
                        ref={detailRef}
                        onClick={e => e.stopPropagation()}
                        className="gm-panel sticky start-2 end-2 bottom-2 mx-2 mb-2 p-3 shadow-[0_4px_0_var(--color-gm-line)]">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="border-2 [font-family:var(--font-code)] font-bold"
                                        style={{ borderColor: laneColor(selected.col) }}>
                                        {commitLabel(selected)} · {selected.shortId}
                                    </Badge>
                                    {selected.isHead && (
                                        <Badge className="[font-family:var(--font-code)] font-bold">HEAD</Badge>
                                    )}
                                    {selected.isMergeCommit && (
                                        <Badge variant="info" className="[font-family:var(--font-code)]">
                                            {t("visualizer.mergeCommit")}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-gm-ink mt-1.5 truncate text-sm font-semibold">{selected.message}</p>
                                <p className="text-gm-ink-dim mt-0.5 text-xs">
                                    {selected.author} · {selected.timestamp.toLocaleString()}
                                </p>
                                {selected.branches.length > 0 && (
                                    <ul className="mt-1.5 flex flex-wrap gap-1">
                                        {selected.branches.map(b => (
                                            <li
                                                key={b}
                                                className="border-gm-line bg-gm-void text-gm-ink-soft flex items-center gap-1 rounded-full border-2 px-2 py-0.5 [font-family:var(--font-code)] text-[10px]">
                                                <GitBranch className="h-2.5 w-2.5" aria-hidden="true" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelected(null)}
                                aria-label={t("visualizer.close")}
                                className="shrink-0">
                                <X className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-gm-ink-dim mt-2 text-center text-[11px]">{t("visualizer.interactHint")}</p>
        </div>
    );
}
