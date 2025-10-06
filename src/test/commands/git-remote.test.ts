import { describe, it, expect, beforeEach } from 'vitest';
import { RemoteCommand } from '~/commands/git/RemoteCommand';
import { PushCommand } from '~/commands/git/PushCommand';
import { PullCommand } from '~/commands/git/PullCommand';
import { CloneCommand } from '~/commands/git/CloneCommand';
import { createTestContext, setupInitializedRepo } from '~/test/test-utils';
import type { CommandContext } from '~/commands/base/Command';

describe('Git Remote Commands', () => {
  let context: CommandContext;

  beforeEach(() => {
    context = createTestContext();
  });

  describe('RemoteCommand', () => {
    beforeEach(() => {
      setupInitializedRepo(context);
    });

    it('should list remotes', () => {
      const remoteCmd = new RemoteCommand();
      const output = remoteCmd.execute({ args: [], flags: {}, positionalArgs: [] }, context);

      expect(output.join('\n')).toContain('origin');
    });

    it('should add a remote', () => {
      const remoteCmd = new RemoteCommand();
      const output = remoteCmd.execute(
        { args: ['add', 'upstream', 'https://github.com/user/repo.git'], flags: {}, positionalArgs: ['add', 'upstream', 'https://github.com/user/repo.git'] },
        context
      );

      const remotes = context.gitRepository.getRemotes();
      expect(remotes['upstream']).toBe('https://github.com/user/repo.git');
      expect(output[0]).toContain('Added remote');
    });

    it('should show remote URL with -v flag', () => {
      const remoteCmd = new RemoteCommand();
      const output = remoteCmd.execute(
        { args: ['-v'], flags: { v: true }, positionalArgs: [] },
        context
      );

      expect(output.join('\n')).toContain('origin');
      expect(output.join('\n')).toContain('https://github.com/user/repo.git');
    });

    it('should remove a remote', () => {
      context.gitRepository.addRemote('test', 'https://test.com/repo.git');

      const remoteCmd = new RemoteCommand();
      remoteCmd.execute(
        { args: ['remove', 'test'], flags: {}, positionalArgs: ['remove', 'test'] },
        context
      );

      const remotes = context.gitRepository.getRemotes();
      expect(remotes['test']).toBeUndefined();
    });

    it('should not add duplicate remotes', () => {
      const remoteCmd = new RemoteCommand();
      const output = remoteCmd.execute(
        { args: ['add', 'origin', 'https://github.com/other/repo.git'], flags: {}, positionalArgs: ['add', 'origin', 'https://github.com/other/repo.git'] },
        context
      );

      expect(output[0]).toContain('already exists');
    });

    it('should require git initialization', () => {
      const newContext = createTestContext();
      const remoteCmd = new RemoteCommand();
      const output = remoteCmd.execute({ args: [], flags: {}, positionalArgs: [] }, newContext);

      expect(output[0]).toContain("Not a git repository. Run 'git init' first.");
    });
  });

  describe('PushCommand', () => {
    beforeEach(() => {
      setupInitializedRepo(context);
    });

    it('should push to remote', () => {
      const pushCmd = new PushCommand();
      const output = pushCmd.execute(
        { args: ['origin', 'main'], flags: {}, positionalArgs: ['origin', 'main'] },
        context
      );

      expect(output.join('\n')).toContain('Enumerating objects');
      expect(output.join('\n')).toContain('To https://github.com/user/repo.git');
    });

    it('should push with -u to set upstream', () => {
      const pushCmd = new PushCommand();
      const output = pushCmd.execute(
        { args: ['-u', 'origin', 'main'], flags: { u: true }, positionalArgs: ['origin', 'main'] },
        context
      );

      expect(output.join('\n')).toContain('Branch');
      expect(output.join('\n')).toContain('set up to track');
    });

    it('should fail if remote does not exist', () => {
      const pushCmd = new PushCommand();
      const output = pushCmd.execute(
        { args: ['nonexistent', 'main'], flags: {}, positionalArgs: ['nonexistent', 'main'] },
        context
      );

      expect(output[0]).toContain('No such remote');
    });

    it('should fail if branch does not exist', () => {
      const pushCmd = new PushCommand();
      const output = pushCmd.execute(
        { args: ['origin', 'nonexistent'], flags: {}, positionalArgs: ['origin', 'nonexistent'] },
        context
      );

      expect(output[0]).toContain('does not match');
    });

    it('should require git initialization', () => {
      const newContext = createTestContext();
      const pushCmd = new PushCommand();
      const output = pushCmd.execute(
        { args: ['origin', 'main'], flags: {}, positionalArgs: ['origin', 'main'] },
        newContext
      );

      expect(output[0]).toContain("Not a git repository. Run 'git init' first.");
    });
  });

  describe('PullCommand', () => {
    beforeEach(() => {
      setupInitializedRepo(context);
    });

    it('should pull from remote', () => {
      const pullCmd = new PullCommand();
      const output = pullCmd.execute(
        { args: ['origin', 'main'], flags: {}, positionalArgs: ['origin', 'main'] },
        context
      );

      expect(output[0]).toContain('From https://github.com/user/repo.git');
    });

    it('should fail if remote does not exist', () => {
      const pullCmd = new PullCommand();
      const output = pullCmd.execute(
        { args: ['nonexistent', 'main'], flags: {}, positionalArgs: ['nonexistent', 'main'] },
        context
      );

      expect(output[0]).toContain('No such remote');
    });

    it('should fail if branch does not exist', () => {
      const pullCmd = new PullCommand();
      const output = pullCmd.execute(
        { args: ['origin', 'nonexistent'], flags: {}, positionalArgs: ['origin', 'nonexistent'] },
        context
      );

      expect(output[0]).toContain("Couldn't find remote ref");
    });

    it('should require git initialization', () => {
      const newContext = createTestContext();
      const pullCmd = new PullCommand();
      const output = pullCmd.execute(
        { args: ['origin', 'main'], flags: {}, positionalArgs: ['origin', 'main'] },
        newContext
      );

      expect(output[0]).toContain("Not a git repository. Run 'git init' first.");
    });
  });

  describe('CloneCommand', () => {
    it('should clone a repository', () => {
      const cloneCmd = new CloneCommand();
      const output = cloneCmd.execute(
        { args: ['https://github.com/user/repo.git'], flags: {}, positionalArgs: ['https://github.com/user/repo.git'] },
        context
      );

      expect(output.join('\n')).toContain('Cloning into');
      expect(context.fileSystem.getDirectoryContents('/repo')).not.toBeNull();
    });

    it('should create directory with repo name', () => {
      const cloneCmd = new CloneCommand();
      cloneCmd.execute(
        { args: ['https://github.com/user/my-project.git'], flags: {}, positionalArgs: ['https://github.com/user/my-project.git'] },
        context
      );

      expect(context.fileSystem.getDirectoryContents('/my-project')).not.toBeNull();
    });

    it('should create mock files in cloned repo', () => {
      const cloneCmd = new CloneCommand();
      cloneCmd.execute(
        { args: ['https://github.com/user/repo.git'], flags: {}, positionalArgs: ['https://github.com/user/repo.git'] },
        context
      );

      expect(context.fileSystem.getFileContents('/repo/README.md')).not.toBeNull();
      expect(context.fileSystem.getDirectoryContents('/repo/src')).not.toBeNull();
    });

    it('should handle different URL formats', () => {
      const cloneCmd = new CloneCommand();

      // HTTPS
      cloneCmd.execute(
        { args: ['https://github.com/user/repo1.git'], flags: {}, positionalArgs: ['https://github.com/user/repo1.git'] },
        context
      );
      expect(context.fileSystem.getDirectoryContents('/repo1')).not.toBeNull();

      // SSH
      cloneCmd.execute(
        { args: ['git@github.com:user/repo2.git'], flags: {}, positionalArgs: ['git@github.com:user/repo2.git'] },
        context
      );
      expect(context.fileSystem.getDirectoryContents('/repo2')).not.toBeNull();
    });

    it('should require a URL argument', () => {
      const cloneCmd = new CloneCommand();
      const output = cloneCmd.execute(
        { args: [], flags: {}, positionalArgs: [] },
        context
      );

      expect(output[0]).toContain('You must specify a repository to clone');
    });
  });
});
