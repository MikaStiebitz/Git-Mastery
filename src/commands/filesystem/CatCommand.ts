import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { resolvePath } from "~/lib/utils";
import { missingOperand, pathKind } from "./shell";

export class CatCommand implements Command {
    name = "cat";
    description = "Display the contents of a file";
    usage = "cat <file>...";
    examples = ["cat README.md"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["n", "number", "b", "number-nonblank", "E", "show-ends", "s", "squeeze-blank"],
        value: [],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { fileSystem } = context;
        // Real cat would wait for standard input, which this terminal does not have.
        if (args.positionalArgs.length === 0) return missingOperand("cat", "file operand");
        const number = args.flags.n !== undefined || args.flags.number !== undefined;

        const lines: string[] = [];
        let text = "";
        for (const file of args.positionalArgs) {
            const path = resolvePath(file, context.currentDirectory);
            const kind = pathKind(fileSystem, path);
            if (kind === "file") {
                text += fileSystem.getFileContents(path) ?? "";
            } else {
                if (text) lines.push(...this.splitLines(text));
                text = "";
                lines.push(`cat: ${file}: ${kind === "directory" ? "Is a directory" : "No such file or directory"}`);
            }
        }
        if (text) lines.push(...this.splitLines(text));
        return number
            ? lines.map((line, i) => (line.startsWith("cat: ") ? line : `${String(i + 1).padStart(6)}\t${line}`))
            : lines;
    }

    /** A final newline ends the last line; it does not start an empty one. */
    private splitLines(text: string): string[] {
        return (text.endsWith("\n") ? text.slice(0, -1) : text).split("\n");
    }
}
