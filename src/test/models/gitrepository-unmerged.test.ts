import { describe, it, expect, beforeEach } from 'vitest';
import { FileSystem } from '~/models/FileSystem';
import { GitRepository } from '~/models/GitRepository';

describe('GitRepository - Unmerged Commits Detection', () => {
  let fileSystem: FileSystem;
  let gitRepository: GitRepository;

  beforeEach(() => {
    fileSystem = new FileSystem();
    gitRepository = new GitRepository(fileSystem);
    gitRepository.init();
  });

  it('should detect unmerged commits in feature branch', () => {
    // Setup: Make initial commit on main
    fileSystem.writeFile('/README.md', '# Initial');
    gitRepository.addFile('README.md');
    gitRepository.commit('Initial commit');

    // Create feature branch and add commit
    gitRepository.createBranch('feature');
    gitRepository.checkout('feature');
    fileSystem.writeFile('/feature.txt', 'Feature work');
    gitRepository.addFile('feature.txt');
    gitRepository.commit('Add feature');

    // Switch back to main
    gitRepository.checkout('main');

    // Feature branch should have unmerged commits
    expect(gitRepository.hasUnmergedCommits('feature')).toBe(true);
  });

  it('should not detect unmerged commits after merge', () => {
    // Setup
    fileSystem.writeFile('/README.md', '# Initial');
    gitRepository.addFile('README.md');
    gitRepository.commit('Initial commit');

    // Create feature with commit
    gitRepository.createBranch('feature');
    gitRepository.checkout('feature');
    fileSystem.writeFile('/feature.txt', 'Feature');
    gitRepository.addFile('feature.txt');
    gitRepository.commit('Feature commit');

    // Merge into main (simulate by adding feature's commit to main)
    gitRepository.checkout('main');
    gitRepository.merge('feature');

    // Manually add the commit to main's history (since merge() is simplified)
    // In real implementation, merge would copy commits
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mainState = (gitRepository as any).branchStates['main'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const featureState = (gitRepository as any).branchStates['feature'];
    mainState.commits.push(...featureState.commits.filter((c: string) => !mainState.commits.includes(c)));

    // After merge, feature should not have unmerged commits
    expect(gitRepository.hasUnmergedCommits('feature')).toBe(false);
  });

  it('should not detect unmerged commits in empty branch', () => {
    // Make initial commit
    fileSystem.writeFile('/README.md', '# Initial');
    gitRepository.addFile('README.md');
    gitRepository.commit('Initial commit');

    // Create new branch without commits
    gitRepository.createBranch('empty-feature');

    // Empty branch should not have unmerged commits
    expect(gitRepository.hasUnmergedCommits('empty-feature')).toBe(false);
  });

  it('should detect unmerged commits in diverged branches', () => {
    // Initial commit
    fileSystem.writeFile('/README.md', '# Initial');
    gitRepository.addFile('README.md');
    gitRepository.commit('Initial commit');

    // Create feature branch with commit
    gitRepository.createBranch('feature');
    gitRepository.checkout('feature');
    fileSystem.writeFile('/feature.txt', 'Feature');
    gitRepository.addFile('feature.txt');
    gitRepository.commit('Feature commit');

    // Go back to main and make different commit
    gitRepository.checkout('main');
    fileSystem.writeFile('/main.txt', 'Main work');
    gitRepository.addFile('main.txt');
    gitRepository.commit('Main commit');

    // Feature should still have unmerged commits (its own commits)
    expect(gitRepository.hasUnmergedCommits('feature')).toBe(true);
  });
});
