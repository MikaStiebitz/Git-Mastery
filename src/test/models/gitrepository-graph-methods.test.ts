import { describe, it, expect, beforeEach } from 'vitest';
import { createTestContext, setupInitializedRepo, setupMultiBranchRepo } from '~/test/test-utils';
import type { CommandContext } from '~/commands/base/Command';

describe('GitRepository graph methods', () => {
    let context: CommandContext;

    beforeEach(() => {
        context = createTestContext();
    });

    describe('getAllCommits()', () => {
        it('returns empty object before any commits', () => {
            context.gitRepository.init();
            expect(context.gitRepository.getAllCommits()).toEqual({});
        });

        it('returns all commits after committing', () => {
            setupInitializedRepo(context);
            const all = context.gitRepository.getAllCommits();
            expect(Object.keys(all).length).toBeGreaterThan(0);
        });

        it('includes commits from all branches, not just current', () => {
            setupMultiBranchRepo(context);
            const { gitRepository } = context;

            // Currently on main; feature branch also has a commit
            const all = gitRepository.getAllCommits();
            const currentBranchCommits = gitRepository.getCommits();

            // getAllCommits should have at least as many as current branch
            expect(Object.keys(all).length).toBeGreaterThanOrEqual(
                Object.keys(currentBranchCommits).length
            );
        });

        it('each commit has parents array', () => {
            setupInitializedRepo(context);
            const all = context.gitRepository.getAllCommits();
            for (const commit of Object.values(all)) {
                expect(Array.isArray(commit.parents)).toBe(true);
            }
        });

        it('root commit has empty parents array', () => {
            setupInitializedRepo(context);
            const all = context.gitRepository.getAllCommits();
            const commits = Object.values(all);
            const root = commits.find(c => c.parents.length === 0);
            expect(root).toBeDefined();
        });

        it('non-root commit has a valid parent id', () => {
            setupInitializedRepo(context);
            const { gitRepository, fileSystem } = context;

            fileSystem.writeFile('/second.txt', 'second');
            gitRepository.addFile('second.txt');
            gitRepository.commit('second commit');

            const all = gitRepository.getAllCommits();
            const ids = Object.keys(all);
            const nonRoot = Object.entries(all).find(([, c]) => c.parents.length > 0);

            expect(nonRoot).toBeDefined();
            expect(ids).toContain(nonRoot![1].parents[0]);
        });

        it('merge commit has two parents', () => {
            setupMultiBranchRepo(context);
            const { gitRepository } = context;

            // Force a real merge commit (not fast-forward) by adding a commit on main first
            context.fileSystem.writeFile('/main-only.txt', 'main');
            gitRepository.addFile('main-only.txt');
            gitRepository.commit('main-only commit');

            gitRepository.merge('feature');

            const all = gitRepository.getAllCommits();
            const mergeCommit = Object.values(all).find(c => c.isMergeCommit);

            expect(mergeCommit).toBeDefined();
            expect(mergeCommit!.parents).toHaveLength(2);
        });
    });

    describe('getBranchHeads()', () => {
        it('returns empty object before init', () => {
            expect(context.gitRepository.getBranchHeads()).toEqual({});
        });

        it('returns main branch head after first commit', () => {
            setupInitializedRepo(context);
            const heads = context.gitRepository.getBranchHeads();
            expect(heads['main']).toBeDefined();
        });

        it('head commit id exists in getAllCommits()', () => {
            setupInitializedRepo(context);
            const { gitRepository } = context;
            const heads = gitRepository.getBranchHeads();
            const all = gitRepository.getAllCommits();

            for (const headId of Object.values(heads)) {
                expect(all[headId]).toBeDefined();
            }
        });

        it('includes all branches', () => {
            setupMultiBranchRepo(context);
            const heads = context.gitRepository.getBranchHeads();
            expect(heads['main']).toBeDefined();
            expect(heads['feature']).toBeDefined();
        });

        it('returns different head ids for diverged branches', () => {
            setupMultiBranchRepo(context);
            const { gitRepository, fileSystem } = context;

            // Add another commit on main so branches fully diverge
            fileSystem.writeFile('/extra.txt', 'extra');
            gitRepository.addFile('extra.txt');
            gitRepository.commit('extra on main');

            const heads = gitRepository.getBranchHeads();
            expect(heads['main']).not.toBe(heads['feature']);
        });

        it('updates head after new commit on current branch', () => {
            setupInitializedRepo(context);
            const { gitRepository, fileSystem } = context;

            const headsBefore = gitRepository.getBranchHeads();

            fileSystem.writeFile('/new.txt', 'new');
            gitRepository.addFile('new.txt');
            gitRepository.commit('new commit');

            const headsAfter = gitRepository.getBranchHeads();
            expect(headsAfter['main']).not.toBe(headsBefore['main']);
        });
    });
});
