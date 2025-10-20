import { FileSystem } from '~/models/FileSystem';
import { GitRepository } from '~/models/GitRepository';
import { ProgressManager } from '~/models/ProgressManager';
import type { CommandContext } from '~/commands/base/Command';

/**
 * Creates a fresh test context with FileSystem and GitRepository
 */
export function createTestContext(): CommandContext {
  const fileSystem = new FileSystem();
  const gitRepository = new GitRepository(fileSystem);
  const progressManager = new ProgressManager();

  const context: CommandContext = {
    fileSystem,
    gitRepository,
    currentDirectory: '/',
    setCurrentDirectory: (dir: string) => {
      context.currentDirectory = dir;
    },
    progressManager,
  };

  return context;
}

/**
 * Initializes a Git repository with some default state
 */
export function setupInitializedRepo(context: CommandContext): void {
  const { gitRepository, fileSystem } = context;

  // Create some initial files
  fileSystem.writeFile('/README.md', '# Test Project');
  fileSystem.writeFile('/src/index.js', 'console.log("test");');

  // Initialize git
  gitRepository.init();

  // Add a default remote
  gitRepository.addRemote('origin', 'https://github.com/user/repo.git');

  // Add and commit initial files (use normalized paths without leading slash)
  gitRepository.addFile('README.md');
  gitRepository.addFile('src/index.js');
  gitRepository.commit('Initial commit');
}

/**
 * Creates a multi-branch repository with commits
 */
export function setupMultiBranchRepo(context: CommandContext): void {
  setupInitializedRepo(context);
  const { gitRepository, fileSystem } = context;

  // Create a feature branch
  gitRepository.createBranch('feature');
  gitRepository.checkout('feature');

  // Make changes on feature branch
  fileSystem.writeFile('/src/feature.js', 'console.log("feature");');
  gitRepository.addFile('src/feature.js');
  gitRepository.commit('Add feature');

  // Switch back to main
  gitRepository.checkout('main');
}

/**
 * Helper to execute a command and return output
 */
export function executeCommand(
  command: { execute: (args: string[], context: CommandContext) => string[] },
  args: string[],
  context: CommandContext
): string[] {
  return command.execute(args, context);
}
