"use client";

import type { CommitGraph, GraphNode } from "~/lib/buildCommitGraph";

const ROW_H = 44;
const COL_W = 28;
const R = 7;
const LEFT_PAD = 12;
const TEXT_LEFT = 16; // gap between last lane and text

// Graph vocabulary, identical to the landing page demo: a node is a night disc with an
// accent ring and a small accent dot, links are round-capped accent strokes.
const GRAPE = "var(--color-gm-grape-hi)";
const CYAN = "var(--color-gm-cyan)";
const CORAL = "var(--color-gm-coral)";
const LIME = "var(--color-gm-lime)";
const NIGHT = "var(--color-gm-night)";
const INK = "var(--color-gm-ink)";
const INK_SOFT = "var(--color-gm-ink-soft)";
const INK_DIM = "var(--color-gm-ink-dim)";
const VOID = "var(--color-gm-void)";

// The Git legend decides a lane's colour: grape is `main`, cyan is a feature branch and
// coral is a fix branch — never the other way round.
const MAIN_BRANCH = /^(main|master|trunk)$/i;
const FIX_BRANCH = /(^|[/_-])(fix|hotfix|bugfix|bug|patch|revert)/i;

function branchColor(branch: string): string {
    if (MAIN_BRANCH.test(branch)) return GRAPE;
    if (FIX_BRANCH.test(branch)) return CORAL;
    return CYAN;
}

// Several branch tips can sit on one lane (a merged fix keeps pointing at the trunk), so a
// lane takes the strongest role it carries: trunk beats fix beats feature. Lanes nobody
// labelled are the trunk on lane 0 and a second line of history everywhere else.
const ROLE_RANK: Record<string, number> = { [GRAPE]: 3, [CORAL]: 2, [CYAN]: 1 };

function buildLaneColors(nodes: GraphNode[], colCount: number): string[] {
    const laneCount = Math.max(colCount, 1);
    const labelled: (string | undefined)[] = Array.from({ length: laneCount }, () => undefined);
    for (const node of nodes) {
        const branch = node.branches[0];
        if (branch === undefined || node.col >= laneCount) continue;
        const color = branchColor(branch);
        const current = labelled[node.col];
        if (current === undefined || (ROLE_RANK[color] ?? 0) > (ROLE_RANK[current] ?? 0)) {
            labelled[node.col] = color;
        }
    }
    return labelled.map((color, col) => color ?? (col === 0 ? GRAPE : CYAN));
}

// Text on a grape pill is ink; on lime, cyan and coral it is void.
function inkOn(color: string): string {
    return color === GRAPE ? INK : VOID;
}

function cx(col: number): number {
    return LEFT_PAD + col * COL_W;
}

function cy(row: number): number {
    return ROW_H / 2 + row * ROW_H;
}

interface Props {
    graph: CommitGraph;
}

const CHAR_W = 7; // monospace char width at font-size 11/12px
const BADGE_PAD = 10; // horizontal padding inside each badge (each side)
const BADGE_GAP = 6; // gap between badges
const HASH_CHARS = 7; // short hash length
const HASH_GAP = 10; // gap between last badge and hash
const MSG_GAP = 12; // gap between hash and message
const MAX_MSG_CHARS = 52;
const AUTHOR_GAP = 16; // gap between message and author
const MAX_AUTHOR_CHARS = 12;
const DATE_GAP = 6; // gap between author and date
const DATE_CHARS = 24; // "Sat Sep 21 19:21:59 2024"

function estimateRowWidth(node: { branches: string[]; message: string; isHead: boolean }, lanesWidth: number): number {
    const badgesWidth = node.branches.reduce((acc: number, b: string, bi: number) => {
        const label = node.isHead && bi === 0 ? `HEAD → ${b}` : b;
        return acc + label.length * CHAR_W + BADGE_PAD * 2 + BADGE_GAP;
    }, 0);
    const hashWidth = HASH_CHARS * CHAR_W + HASH_GAP + MSG_GAP;
    const msgWidth = Math.min(node.message.length, MAX_MSG_CHARS) * CHAR_W;
    const authorWidth = AUTHOR_GAP + MAX_AUTHOR_CHARS * CHAR_W;
    const dateWidth = DATE_GAP + DATE_CHARS * CHAR_W;
    return lanesWidth + badgesWidth + hashWidth + msgWidth + authorWidth + dateWidth + 20;
}

export function GitGraph({ graph }: Props) {
    const { nodes, edges, colCount } = graph;

    if (nodes.length === 0) return null;

    const lanesWidth = LEFT_PAD + colCount * COL_W + TEXT_LEFT;
    const svgWidth = Math.max(...nodes.map(n => estimateRowWidth(n, lanesWidth)));
    const svgHeight = nodes.length * ROW_H;

    const laneColors = buildLaneColors(nodes, colCount);
    const laneColor = (col: number): string => laneColors[col % laneColors.length]!;

    return (
        // The viewBox lets a wide history scale down to a phone instead of pushing the
        // terminal sideways; it never grows past its natural size on a desktop.
        <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            width={svgWidth}
            height={svgHeight}
            preserveAspectRatio="xMinYMin meet"
            className="block h-auto w-full max-w-full overflow-visible [font-family:var(--font-code)] select-text"
            style={{ maxWidth: svgWidth }}>
            {/* Edges first (behind circles) */}
            {edges.map((edge, i) => {
                const x1 = cx(edge.fromCol);
                const y1 = cy(edge.fromRow);
                const x2 = cx(edge.toCol);
                const y2 = cy(edge.toRow);
                // A crossing link belongs to the side branch it leaves or rejoins, so it
                // takes the outer lane's colour rather than the trunk's.
                const color = laneColor(Math.max(edge.fromCol, edge.toCol));

                // Straight line if same column, bezier curve if crossing lanes
                const pathD =
                    edge.fromCol === edge.toCol
                        ? `M ${x1} ${y1} L ${x2} ${y2}`
                        : `M ${x1} ${y1} C ${x1} ${y1 + ROW_H * 0.6}, ${x2} ${y2 - ROW_H * 0.6}, ${x2} ${y2}`;

                return <path key={i} d={pathD} stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />;
            })}

            {/* Nodes */}
            {nodes.map(node => {
                const x = cx(node.col);
                const y = cy(node.row);
                const color = laneColor(node.col);
                const textX = LEFT_PAD + colCount * COL_W + TEXT_LEFT;

                return (
                    <g key={node.id}>
                        {/* Commit node: night disc, accent ring, accent dot. A merge commit
                            keeps the ring but drops the dot, so the two never differ by
                            colour alone. */}
                        <circle cx={x} cy={y} r={R} fill={NIGHT} stroke={color} strokeWidth={2} />
                        {!node.isMergeCommit && <circle cx={x} cy={y} r={2.5} fill={color} />}

                        {/* HEAD marker — small arrow above circle */}
                        {node.isHead && (
                            <>
                                <polygon
                                    points={`${x},${y - R - 2} ${x - 5},${y - R - 9} ${x + 5},${y - R - 9}`}
                                    fill={LIME}
                                />
                            </>
                        )}

                        {/* Branch labels + hash + message — single running x so positions never diverge */}
                        {(() => {
                            let curX = textX;

                            const labels = node.branches.map((branch, bi) => {
                                const isHead = node.isHead && bi === 0;
                                const label = isHead ? `HEAD → ${branch}` : branch;
                                const badgeW = label.length * CHAR_W + BADGE_PAD * 2;
                                // HEAD is the player's token and always rides a lime badge;
                                // every other pill wears its own branch's colour, which can
                                // differ from the lane it currently points at.
                                const pillFill = isHead ? LIME : branchColor(branch);
                                const el = (
                                    <g key={bi} transform={`translate(${curX}, ${y - 10})`}>
                                        <rect x={0} y={0} width={badgeW} height={18} rx={9} fill={pillFill} />
                                        <text
                                            x={BADGE_PAD}
                                            y={13}
                                            fontSize={11}
                                            fontWeight={700}
                                            fill={inkOn(pillFill)}>
                                            {label}
                                        </text>
                                    </g>
                                );
                                curX += badgeW + BADGE_GAP;
                                return el;
                            });

                            const hashX = curX + (node.branches.length > 0 ? HASH_GAP : 0);
                            const msgX = hashX + HASH_CHARS * CHAR_W + MSG_GAP;
                            const msg =
                                node.message.length > MAX_MSG_CHARS
                                    ? node.message.substring(0, MAX_MSG_CHARS - 1) + "…"
                                    : node.message;
                            const authorX = msgX + Math.min(node.message.length, MAX_MSG_CHARS) * CHAR_W + AUTHOR_GAP;
                            const author =
                                node.author.length > MAX_AUTHOR_CHARS
                                    ? node.author.substring(0, MAX_AUTHOR_CHARS - 1) + "…"
                                    : node.author;
                            const dateX = authorX + author.length * CHAR_W + DATE_GAP;
                            const _d = new Date(node.timestamp);
                            const _p = _d.toDateString().split(" "); // ["Sat", "Sep", "21", "2024"]
                            const _t = _d.toTimeString().split(" ")[0]!; // "19:21:59"
                            const date = `${_p[0]} ${_p[1]} ${_p[2]} ${_t} ${_p[3]}`;

                            return (
                                <>
                                    {labels}
                                    <text x={hashX} y={y + 4} fontSize={12} fill={INK_DIM}>
                                        {node.shortId}
                                    </text>
                                    <text x={msgX} y={y + 4} fontSize={12} fill={INK}>
                                        {msg}
                                    </text>
                                    <text x={authorX} y={y + 4} fontSize={11} fill={INK_SOFT}>
                                        {author}
                                    </text>
                                    <text x={dateX} y={y + 4} fontSize={11} fill={INK_DIM}>
                                        {date}
                                    </text>
                                </>
                            );
                        })()}
                    </g>
                );
            })}
        </svg>
    );
}
