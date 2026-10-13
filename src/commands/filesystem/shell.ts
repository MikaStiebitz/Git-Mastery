import type { FileSystem } from "~/models/FileSystem";

/**
 * Small pieces shared by the shell commands, so they answer the way coreutils and bash do:
 * silent on success, "<program>: <operand>: <reason>" on failure, and every operand handled.
 */

/** "touch: missing file operand" + the hint line coreutils prints after usage mistakes. */
export function missingOperand(program: string, what = "operand"): string[] {
    return [`${program}: missing ${what}`, `Try '${program} --help' for more information.`];
}

export function parentPath(path: string): string {
    const index = path.lastIndexOf("/");
    return index <= 0 ? "/" : path.substring(0, index);
}

export function pathKind(fileSystem: FileSystem, path: string): "file" | "directory" | null {
    if (fileSystem.getFileContents(path) !== null) return "file";
    if (fileSystem.getDirectoryContents(path) !== null) return "directory";
    return null;
}
