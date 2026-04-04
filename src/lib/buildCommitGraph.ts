export type CommitData = {
    message: string;
    timestamp: Date;
    files: string[];
    parents: string[];
    isMergeCommit?: boolean;
};

export type GraphNode = {
    id: string;
    shortId: string;
    message: string;
    timestamp: Date;
    row: number;
    col: number;
    parents: string[];
    branches: string[];
    isHead: boolean;
    isMergeCommit: boolean;
};

export type GraphEdge = {
    fromId: string;
    toId: string;
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
};

export type CommitGraph = {
    nodes: GraphNode[];
    edges: GraphEdge[];
    colCount: number;
};

export function buildCommitGraph(
    commits: Record<string, CommitData>,
    branchHeads: Record<string, string>,
    currentBranch: string,
): CommitGraph {
    if (Object.keys(commits).length === 0) {
        return { nodes: [], edges: [], colCount: 0 };
    }

    // Build child → parents map and parent → children map
    const parentOf: Record<string, string[]> = {};
    const childrenOf: Record<string, string[]> = {};

    for (const [id, commit] of Object.entries(commits)) {
        parentOf[id] = commit.parents;
        for (const p of commit.parents) {
            if (!childrenOf[p]) childrenOf[p] = [];
            childrenOf[p].push(id);
        }
    }

    // Topological sort: newest commits first (Kahn's algo, by timestamp desc)
    const inDegree: Record<string, number> = {};
    for (const id of Object.keys(commits)) {
        inDegree[id] = (parentOf[id] ?? []).length;
    }

    // Start with nodes that have no parents (root commits)
    const queue: string[] = Object.keys(commits).filter(id => inDegree[id] === 0);

    // Sort queue by timestamp descending so newest appear at top
    const byTime = (a: string, b: string) =>
        (commits[b]?.timestamp.getTime() ?? 0) - (commits[a]?.timestamp.getTime() ?? 0);
    queue.sort(byTime);

    const sorted: string[] = [];
    while (queue.length > 0) {
        const id = queue.shift()!;
        sorted.push(id);
        for (const child of childrenOf[id] ?? []) {
            inDegree[child]!--;
            if (inDegree[child] === 0) {
                queue.push(child);
                queue.sort(byTime);
            }
        }
    }

    // Any commits not reached (cycles / orphans) — append at end
    for (const id of Object.keys(commits)) {
        if (!sorted.includes(id)) sorted.push(id);
    }

    // Reverse so newest is row 0
    sorted.reverse();

    // Assign rows
    const rowOf: Record<string, number> = {};
    sorted.forEach((id, i) => { rowOf[id] = i; });

    // Assign columns (lane allocation)
    // mainBranch always gets col 0
    const colOf: Record<string, number> = {};
    const freeCols: number[] = [];
    let nextCol = 0;

    const allocateCol = (): number => freeCols.length > 0 ? freeCols.shift()! : nextCol++;
    const freeCol = (col: number) => { freeCols.push(col); freeCols.sort((a, b) => a - b); };

    // Track which column each "active lane" is on
    // A lane is active from a commit's row until its parent's row
    // We walk top (newest) to bottom (oldest)
    const laneCol: Record<string, number> = {}; // commitId → col for active lanes

    // Seed: the head of the current branch gets col 0
    const headCommitId = branchHeads[currentBranch];
    if (headCommitId) {
        laneCol[headCommitId] = 0;
        nextCol = 1;
    }

    for (const id of sorted) {
        // If this commit doesn't have a lane yet, allocate one
        if (laneCol[id] === undefined) {
            laneCol[id] = allocateCol();
        }
        colOf[id] = laneCol[id]!;

        const parents = parentOf[id] ?? [];

        if (parents.length === 0) {
            // Root commit — free its lane
            freeCol(laneCol[id]!);
        } else if (parents.length === 1) {
            const p = parents[0]!;
            if (laneCol[p] === undefined) {
                // Parent inherits this commit's lane
                laneCol[p] = laneCol[id]!;
            } else {
                // Parent already has a lane — free this lane
                freeCol(laneCol[id]!);
            }
        } else {
            // Merge commit: first parent inherits lane, rest get new lanes
            const [firstParent, ...otherParents] = parents;
            if (laneCol[firstParent!] === undefined) {
                laneCol[firstParent!] = laneCol[id]!;
            } else {
                freeCol(laneCol[id]!);
            }
            for (const p of otherParents) {
                if (laneCol[p] === undefined) {
                    laneCol[p] = allocateCol();
                }
            }
        }
    }

    // Build branch label map: commitId → branch names
    const branchLabels: Record<string, string[]> = {};
    for (const [branch, headId] of Object.entries(branchHeads)) {
        if (!branchLabels[headId]) branchLabels[headId] = [];
        branchLabels[headId].push(branch);
    }

    // Build nodes
    const nodes: GraphNode[] = sorted.map(id => ({
        id,
        shortId: id.substring(0, 7),
        message: commits[id]?.message ?? "",
        timestamp: commits[id]?.timestamp ?? new Date(),
        row: rowOf[id]!,
        col: colOf[id] ?? 0,
        parents: parentOf[id] ?? [],
        branches: branchLabels[id] ?? [],
        isHead: id === headCommitId,
        isMergeCommit: commits[id]?.isMergeCommit ?? false,
    }));

    // Build edges
    const edges: GraphEdge[] = [];
    for (const node of nodes) {
        for (const parentId of node.parents) {
            if (rowOf[parentId] !== undefined) {
                edges.push({
                    fromId: node.id,
                    toId: parentId,
                    fromRow: node.row,
                    fromCol: node.col,
                    toRow: rowOf[parentId]!,
                    toCol: colOf[parentId] ?? 0,
                });
            }
        }
    }

    return { nodes, edges, colCount: nextCol };
}
