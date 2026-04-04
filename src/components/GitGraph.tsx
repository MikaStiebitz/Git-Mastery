"use client";

import type { CommitGraph } from "~/lib/buildCommitGraph";

const ROW_H = 44;
const COL_W = 28;
const R = 7;
const LEFT_PAD = 12;
const TEXT_LEFT = 16; // gap between last lane and text

// One color per lane index — intentionally distinct
const LANE_COLORS = [
    "#a855f7", // purple  (main)
    "#3b82f6", // blue
    "#22c55e", // green
    "#f59e0b", // amber
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
    "#84cc16", // lime
];

function laneColor(col: number): string {
    return LANE_COLORS[col % LANE_COLORS.length]!;
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

const CHAR_W = 7;       // monospace char width at font-size 11/12px
const BADGE_PAD = 10;   // horizontal padding inside each badge (each side)
const BADGE_GAP = 6;    // gap between badges
const HASH_CHARS = 7;   // short hash length
const HASH_GAP = 10;    // gap between last badge and hash
const MSG_GAP = 12;     // gap between hash and message
const MAX_MSG_CHARS = 52;
const AUTHOR_GAP = 16;  // gap between message and author
const MAX_AUTHOR_CHARS = 12;
const DATE_GAP = 6;     // gap between author and date
const DATE_CHARS = 24;  // "Sat Sep 21 19:21:59 2024"

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

    return (
        <svg
            width={svgWidth}
            height={svgHeight}
            className="font-mono select-text overflow-visible"
            style={{ maxWidth: "100%", display: "block" }}
        >
            {/* Edges first (behind circles) */}
            {edges.map((edge, i) => {
                const x1 = cx(edge.fromCol);
                const y1 = cy(edge.fromRow);
                const x2 = cx(edge.toCol);
                const y2 = cy(edge.toRow);
                const color = laneColor(edge.fromCol);

                // Straight line if same column, bezier curve if crossing lanes
                const pathD =
                    edge.fromCol === edge.toCol
                        ? `M ${x1} ${y1} L ${x2} ${y2}`
                        : `M ${x1} ${y1} C ${x1} ${y1 + ROW_H * 0.6}, ${x2} ${y2 - ROW_H * 0.6}, ${x2} ${y2}`;

                return (
                    <path
                        key={i}
                        d={pathD}
                        stroke={color}
                        strokeWidth={2}
                        fill="none"
                        opacity={0.75}
                    />
                );
            })}

            {/* Nodes */}
            {nodes.map(node => {
                const x = cx(node.col);
                const y = cy(node.row);
                const color = laneColor(node.col);
                const textX = LEFT_PAD + colCount * COL_W + TEXT_LEFT;

                return (
                    <g key={node.id}>
                        {/* Commit circle */}
                        <circle
                            cx={x}
                            cy={y}
                            r={R}
                            fill={node.isMergeCommit ? "transparent" : color}
                            stroke={color}
                            strokeWidth={2}
                        />

                        {/* HEAD marker — small arrow above circle */}
                        {node.isHead && (
                            <>
                                <polygon
                                    points={`${x},${y - R - 2} ${x - 5},${y - R - 9} ${x + 5},${y - R - 9}`}
                                    fill={color}
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
                                const el = (
                                    <g key={bi} transform={`translate(${curX}, ${y - 10})`}>
                                        <rect x={0} y={0} width={badgeW} height={18} rx={3}
                                            fill={isHead ? color : "#374151"} opacity={0.9} />
                                        <text x={BADGE_PAD} y={13} fontSize={11}
                                            fill={isHead ? "#ffffff" : color} fontFamily="monospace">
                                            {label}
                                        </text>
                                    </g>
                                );
                                curX += badgeW + BADGE_GAP;
                                return el;
                            });

                            const hashX = curX + (node.branches.length > 0 ? HASH_GAP : 0);
                            const msgX = hashX + HASH_CHARS * CHAR_W + MSG_GAP;
                            const msg = node.message.length > MAX_MSG_CHARS
                                ? node.message.substring(0, MAX_MSG_CHARS - 1) + "…"
                                : node.message;
                            const authorX = msgX + Math.min(node.message.length, MAX_MSG_CHARS) * CHAR_W + AUTHOR_GAP;
                            const author = node.author.length > MAX_AUTHOR_CHARS
                                ? node.author.substring(0, MAX_AUTHOR_CHARS - 1) + "…"
                                : node.author;
                            const dateX = authorX + author.length * CHAR_W + DATE_GAP;
                            const _d = new Date(node.timestamp);
                            const _p = _d.toDateString().split(' '); // ["Sat", "Sep", "21", "2024"]
                            const _t = _d.toTimeString().split(' ')[0]!; // "19:21:59"
                            const date = `${_p[0]} ${_p[1]} ${_p[2]} ${_t} ${_p[3]}`;

                            return (
                                <>
                                    {labels}
                                    <text x={hashX} y={y + 4} fontSize={12} fill="#9ca3af" fontFamily="monospace">
                                        {node.shortId}
                                    </text>
                                    <text x={msgX} y={y + 4} fontSize={12} fill="#e5e4e2" fontFamily="monospace">
                                        {msg}
                                    </text>
                                    <text x={authorX} y={y + 4} fontSize={11} fill="#a78bfa" fontFamily="monospace">
                                        {author}
                                    </text>
                                    <text x={dateX} y={y + 4} fontSize={11} fill="#94a3b8" fontFamily="monospace">
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
