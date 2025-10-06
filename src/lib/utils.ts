import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { type FileSystemItem } from "~/types";
import { type FileSystem } from "~/models/FileSystem";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Get all files in a directory recursively
 * @param fileSystem The file system instance
 * @param directory The starting directory path
 * @param prefix Optional prefix for path generation
 * @returns Array of file paths
 */
export function getAllFiles(fileSystem: FileSystem, directory: string, prefix = ""): string[] {
    const files: string[] = [];
    const contents = fileSystem.getDirectoryContents(directory);

    if (!contents) return files;

    Object.entries(contents).forEach(([name, item]: [string, FileSystemItem]) => {
        // Skip .git directory and its contents
        if (name === ".git" || name.startsWith(".git/")) {
            return;
        }

        const path = prefix ? `${prefix}/${name}` : name;

        if (item.type === "file") {
            files.push(path);
        } else if (item.type === "directory") {
            const subDir = directory === "/" ? `/${name}` : `${directory}/${name}`;
            files.push(...getAllFiles(fileSystem, subDir, path));
        }
    });

    return files;
}

/**
 * Resolve a path (handle relative paths like .. and .)
 * @param path The path to resolve
 * @param currentDirectory The current directory
 * @returns The resolved absolute path
 */
export function resolvePath(path: string, currentDirectory: string): string {
    // Handle absolute paths
    if (path.startsWith("/")) {
        return normalizePath(path);
    }

    // Start with current directory
    let result = currentDirectory;

    // Split path and process each segment
    const segments = path.split("/").filter(s => s);

    for (const segment of segments) {
        if (segment === "..") {
            // Go up one directory
            const parts = result.split("/").filter(p => p);
            parts.pop();
            result = "/" + parts.join("/");
        } else if (segment === ".") {
            // Stay in current directory
            continue;
        } else {
            // Go into subdirectory
            result = result === "/" ? `/${segment}` : `${result}/${segment}`;
        }
    }

    return normalizePath(result);
}

/**
 * Normalize a path by removing double slashes and ensuring it starts with /
 */
function normalizePath(path: string): string {
    // Replace multiple slashes with single slash
    let normalized = path.replace(/\/+/g, "/");
    // Ensure it starts with /
    if (!normalized.startsWith("/")) {
        normalized = "/" + normalized;
    }
    // Remove trailing slash unless it's root
    if (normalized.length > 1 && normalized.endsWith("/")) {
        normalized = normalized.slice(0, -1);
    }
    return normalized;
}
