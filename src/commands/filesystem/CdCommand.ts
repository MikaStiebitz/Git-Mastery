import type { Command, CommandArgs, CommandContext, FlagSpec } from "../base/Command";
import { resolvePath } from "~/lib/utils";
import { pathKind } from "./shell";

export class CdCommand implements Command {
    name = "cd";
    description = "Change the current directory";
    usage = "cd [directory]";
    examples = ["cd src", "cd ..", "cd /"];
    includeInTabCompletion = true;
    supportsFileCompletion = true;

    /** Flag semantics for this command (see FlagSpec). */
    flagSpec: FlagSpec = {
        boolean: ["L", "P"],
        value: [],
    };
    execute(args: CommandArgs, context: CommandContext): string[] {
        const { fileSystem, currentDirectory, setCurrentDirectory } = context;
        if (args.positionalArgs.length > 1) return ["cd: too many arguments"];

        // Without an argument the shell goes home; the top of this little file system is home.
        const dir = args.positionalArgs[0] ?? "~";
        const target = dir === "~" || dir.startsWith("~/") ? "/" + dir.substring(2) : dir;
        const newPath = resolvePath(target, currentDirectory);
        const kind = pathKind(fileSystem, newPath);

        if (kind === "directory") {
            setCurrentDirectory(newPath);
            return [];
        }
        return [`cd: ${dir}: ${kind === "file" ? "Not a directory" : "No such file or directory"}`];
    }
}
