import { GitRepository } from "./GitRepository";
import type { FileSystem } from "./FileSystem";

/**
 * Manages multiple Git repositories (one per directory)
 * Mimics real Git behavior where each directory can have its own repository
 */
export class GitRepositoryManager {
    private repositories: Map<string, GitRepository> = new Map();
    private fileSystem: FileSystem;

    constructor(fileSystem: FileSystem) {
        this.fileSystem = fileSystem;
    }

    /**
     * Initialize a new repository in the given directory
     */
    public initRepository(directory: string): boolean {
        const normalizedDir = this.normalizePath(directory);

        // Check if already initialized
        if (this.repositories.has(normalizedDir)) {
            return false; // Already initialized
        }

        // Create new repository
        const repo = new GitRepository(this.fileSystem);
        repo.init();
        this.repositories.set(normalizedDir, repo);
        return true;
    }

    /**
     * Get the repository for a given directory
     * Searches up the directory tree like real Git
     */
    public getRepository(directory: string): GitRepository | null {
        const normalizedDir = this.normalizePath(directory);

        // Check current directory
        if (this.repositories.has(normalizedDir)) {
            return this.repositories.get(normalizedDir)!;
        }

        // Search parent directories
        let currentPath = normalizedDir;
        while (currentPath !== '/') {
            if (this.repositories.has(currentPath)) {
                return this.repositories.get(currentPath)!;
            }
            // Go up one level
            currentPath = this.getParentPath(currentPath);
        }

        // Check root
        if (this.repositories.has('/')) {
            return this.repositories.get('/')!;
        }

        return null;
    }

    /**
     * Check if current directory or any parent has a Git repository
     */
    public isInRepository(directory: string): boolean {
        return this.getRepository(directory) !== null;
    }

    /**
     * Get the root directory of the repository for a given path
     */
    public getRepositoryRoot(directory: string): string | null {
        const normalizedDir = this.normalizePath(directory);

        // Check current directory
        if (this.repositories.has(normalizedDir)) {
            return normalizedDir;
        }

        // Search parent directories
        let currentPath = normalizedDir;
        while (currentPath !== '/') {
            if (this.repositories.has(currentPath)) {
                return currentPath;
            }
            currentPath = this.getParentPath(currentPath);
        }

        // Check root
        if (this.repositories.has('/')) {
            return '/';
        }

        return null;
    }

    /**
     * Reset all repositories (used for level reset)
     */
    public resetAll(): void {
        this.repositories.forEach(repo => repo.reset());
        this.repositories.clear();
    }

    /**
     * Reset a specific repository
     */
    public resetRepository(directory: string): boolean {
        const normalizedDir = this.normalizePath(directory);
        const repo = this.repositories.get(normalizedDir);
        if (repo) {
            repo.reset();
            this.repositories.delete(normalizedDir);
            return true;
        }
        return false;
    }

    private normalizePath(path: string): string {
        // Remove trailing slash except for root
        if (path !== '/' && path.endsWith('/')) {
            return path.slice(0, -1);
        }
        return path;
    }

    private getParentPath(path: string): string {
        if (path === '/') return '/';
        const parts = path.split('/').filter(p => p);
        if (parts.length === 0) return '/';
        parts.pop();
        return parts.length === 0 ? '/' : '/' + parts.join('/');
    }
}
