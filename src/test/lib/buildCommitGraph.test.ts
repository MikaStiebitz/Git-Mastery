import { describe, it, expect } from 'vitest';
import { buildCommitGraph, type CommitData } from '~/lib/buildCommitGraph';

function makeCommit(message: string, parents: string[] = [], isMergeCommit = false): CommitData {
    return { message, timestamp: new Date(), files: [], parents, isMergeCommit };
}

describe('buildCommitGraph', () => {
    it('returns empty graph for empty commits', () => {
        const result = buildCommitGraph({}, {}, 'main');
        expect(result.nodes).toHaveLength(0);
        expect(result.edges).toHaveLength(0);
        expect(result.colCount).toBe(0);
    });

    it('handles single commit with no parents', () => {
        const commits = { abc1234: makeCommit('initial commit') };
        const branchHeads = { main: 'abc1234' };

        const { nodes, edges } = buildCommitGraph(commits, branchHeads, 'main');

        expect(nodes).toHaveLength(1);
        expect(nodes[0]!.id).toBe('abc1234');
        expect(nodes[0]!.shortId).toBe('abc1234');
        expect(nodes[0]!.message).toBe('initial commit');
        expect(nodes[0]!.parents).toEqual([]);
        expect(nodes[0]!.isHead).toBe(true);
        expect(nodes[0]!.col).toBe(0);
        expect(nodes[0]!.row).toBe(0);
        expect(edges).toHaveLength(0);
    });

    it('assigns branch labels to the correct commit', () => {
        const commits = {
            aaa: makeCommit('first'),
            bbb: makeCommit('second', ['aaa']),
        };
        const branchHeads = { main: 'bbb' };

        const { nodes } = buildCommitGraph(commits, branchHeads, 'main');

        const head = nodes.find(n => n.id === 'bbb')!;
        expect(head.branches).toContain('main');
        expect(head.isHead).toBe(true);

        const first = nodes.find(n => n.id === 'aaa')!;
        expect(first.branches).toHaveLength(0);
        expect(first.isHead).toBe(false);
    });

    it('generates edges between parent and child', () => {
        const commits = {
            aaa: makeCommit('first'),
            bbb: makeCommit('second', ['aaa']),
        };
        const { edges } = buildCommitGraph(commits, { main: 'bbb' }, 'main');

        expect(edges).toHaveLength(1);
        expect(edges[0]!.fromId).toBe('bbb');
        expect(edges[0]!.toId).toBe('aaa');
    });

    it('places main branch head at column 0', () => {
        const commits = {
            aaa: makeCommit('first'),
            bbb: makeCommit('second', ['aaa']),
        };
        const { nodes } = buildCommitGraph(commits, { main: 'bbb' }, 'main');

        const headNode = nodes.find(n => n.id === 'bbb')!;
        expect(headNode.col).toBe(0);
    });

    it('assigns a different column to a diverging branch', () => {
        // main: aaa -> bbb
        // feature: aaa -> ccc  (diverges from aaa)
        const commits = {
            aaa: makeCommit('initial'),
            bbb: makeCommit('main work', ['aaa']),
            ccc: makeCommit('feature work', ['aaa']),
        };
        const branchHeads = { main: 'bbb', feature: 'ccc' };

        const { nodes } = buildCommitGraph(commits, branchHeads, 'main');

        const mainHead = nodes.find(n => n.id === 'bbb')!;
        const featureHead = nodes.find(n => n.id === 'ccc')!;

        expect(mainHead.col).toBe(0);
        expect(featureHead.col).not.toBe(mainHead.col);
    });

    it('creates two edges for a merge commit', () => {
        // aaa -> bbb (main)
        // aaa -> ccc (feature)
        // merge commit ddd has parents [bbb, ccc]
        const commits = {
            aaa: makeCommit('initial'),
            bbb: makeCommit('main work', ['aaa']),
            ccc: makeCommit('feature work', ['aaa']),
            ddd: makeCommit("Merge branch 'feature' into main", ['bbb', 'ccc'], true),
        };
        const branchHeads = { main: 'ddd' };

        const { nodes, edges } = buildCommitGraph(commits, branchHeads, 'main');

        const mergeNode = nodes.find(n => n.id === 'ddd')!;
        expect(mergeNode.isMergeCommit).toBe(true);

        const mergeEdges = edges.filter(e => e.fromId === 'ddd');
        expect(mergeEdges).toHaveLength(2);
        expect(mergeEdges.map(e => e.toId).sort()).toEqual(['bbb', 'ccc'].sort());
    });

    it('newest commit is at row 0', () => {
        const t1 = new Date('2024-01-01');
        const t2 = new Date('2024-01-02');
        const commits = {
            aaa: { ...makeCommit('older'), timestamp: t1 },
            bbb: { ...makeCommit('newer', ['aaa']), timestamp: t2 },
        };
        const { nodes } = buildCommitGraph(commits, { main: 'bbb' }, 'main');

        const newer = nodes.find(n => n.id === 'bbb')!;
        const older = nodes.find(n => n.id === 'aaa')!;

        expect(newer.row).toBeLessThan(older.row);
    });

    it('colCount reflects number of active lanes', () => {
        const commits = { aaa: makeCommit('single') };
        const { colCount } = buildCommitGraph(commits, { main: 'aaa' }, 'main');
        expect(colCount).toBeGreaterThanOrEqual(1);
    });
});
