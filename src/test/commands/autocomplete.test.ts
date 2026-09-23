import { describe, it, expect, beforeEach } from "vitest";
import { AutocompleteService } from "~/components/Terminal/services/Autocomplete";
import { CommandProcessor } from "~/models/CommandProcessor";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { ProgressManager } from "~/models/ProgressManager";

describe("tab completion", () => {
    let fileSystem: FileSystem;
    let gitRepository: GitRepository;
    let service: AutocompleteService;

    beforeEach(() => {
        fileSystem = new FileSystem();
        gitRepository = new GitRepository(fileSystem);
        const processor = new CommandProcessor(fileSystem, gitRepository, new ProgressManager());
        processor.setCurrentDirectory("/");

        fileSystem.writeFile("/README.md", "# readme");
        fileSystem.writeFile("/app.js", "app");
        fileSystem.writeFile("/app.css", "css");
        fileSystem.mkdir("/src");
        fileSystem.writeFile("/src/index.js", "index");
        gitRepository.init();

        service = new AutocompleteService(processor, fileSystem, gitRepository);
    });

    describe("candidates carry what they are", () => {
        it("marks a directory as a directory", () => {
            const result = service.processTabAutocomplete("git add s");

            expect(result.fileMatches).toEqual([{ value: "src", kind: "directory" }]);
        });

        it("marks files as files", () => {
            const result = service.processTabAutocomplete("git add README");

            expect(result.fileMatches).toEqual([{ value: "README.md", kind: "file" }]);
        });

        it("marks branches as branches", () => {
            gitRepository.createBranch("feature/login");

            const result = service.processTabAutocomplete("git switch feat");

            expect(result.fileMatches).toEqual([{ value: "feature/login", kind: "branch" }]);
        });

        it("never offers the .git directory", () => {
            fileSystem.mkdir("/.git");

            const result = service.processTabAutocomplete("git add ");

            expect(result.fileMatches.map(f => f.value)).not.toContain(".git");
        });
    });

    describe("what was typed is reported back", () => {
        // The menu dims the part already on screen, so it has to know exactly what that is.
        it("reports the typed prefix for files", () => {
            expect(service.processTabAutocomplete("git add app").typedPrefix).toBe("app");
        });

        it("reports an empty prefix when nothing has been typed yet", () => {
            expect(service.processTabAutocomplete("git add ").typedPrefix).toBe("");
        });

        it("reports the typed prefix for branches", () => {
            gitRepository.createBranch("feature/login");

            expect(service.processTabAutocomplete("git switch feat").typedPrefix).toBe("feat");
        });
    });

    describe("the menu opens on the first Tab", () => {
        it("offers every candidate when several match", () => {
            const result = service.processTabAutocomplete("git add app");

            expect(result.fileMatches.map(f => f.value)).toEqual(["app.css", "app.js"]);
            expect(result.showMenu).toBe(true);
        });

        it("does not open a menu for a single match", () => {
            const result = service.processTabAutocomplete("git add READ");

            expect(result.fileMatches).toHaveLength(1);
            expect(result.showMenu).toBe(false);
        });

        it("offers nothing when nothing matches", () => {
            const result = service.processTabAutocomplete("git add zzz");

            expect(result.fileMatches).toEqual([]);
            expect(result.showMenu).toBe(false);
        });
    });

    describe("a command suggestion has to add something", () => {
        // Reported: `cd ` + Tab put the line back to `cd`, eating the space just typed.
        it("offers nothing once the command is complete and a space follows", () => {
            expect(service.getCommandSuggestion("cd ")).toBeUndefined();
        });

        it("offers nothing for a command that is already fully typed", () => {
            expect(service.getCommandSuggestion("cd")).toBeUndefined();
        });

        it("still completes a partially typed command", () => {
            expect(service.getCommandSuggestion("git ini")).toBe("git init");
        });

        it("offers nothing for an empty line", () => {
            expect(service.getCommandSuggestion("")).toBeUndefined();
            expect(service.getCommandSuggestion("   ")).toBeUndefined();
        });

        // With the command suggestion out of the way, Tab reaches the directory list.
        it("lets `cd ` fall through to path completion", () => {
            const result = service.processTabAutocomplete("cd ");

            expect(result.fileMatches.map(f => f.value)).toContain("src");
        });
    });

    describe("completing a choice", () => {
        it("keeps the command and its subcommand", () => {
            expect(service.generateCompletedCommand("git add app", "app.js")).toBe("git add app.js");
        });

        it("replaces a partially typed argument rather than appending to it", () => {
            expect(service.generateCompletedCommand("git switch feat", "feature/login")).toBe(
                "git switch feature/login",
            );
        });

        it("keeps flags that were already typed", () => {
            expect(service.generateCompletedCommand("git checkout -b feat", "feature/login")).toBe(
                "git checkout -b feature/login",
            );
        });

        it("handles a plain shell command", () => {
            expect(service.generateCompletedCommand("cat READ", "README.md")).toBe("cat README.md");
        });
    });

    describe("nothing is offered until the command name is finished", () => {
        // Reported: `git checkout` with no space yet listed README.md and src/.
        it("offers no arguments while the command itself is still being typed", () => {
            const result = service.processTabAutocomplete("git checkout");

            expect(result.fileMatches).toEqual([]);
            expect(result.showMenu).toBe(false);
        });

        it("offers arguments once a space follows the command", () => {
            gitRepository.createBranch("feature/login");

            const result = service.processTabAutocomplete("git checkout ");

            expect(result.fileMatches.map(f => f.value)).toContain("feature/login");
        });

        it("offers no arguments for a one-word command with no space", () => {
            expect(service.processTabAutocomplete("cd").fileMatches).toEqual([]);
        });
    });

    describe("a command that takes a branch never offers files", () => {
        // Reported alongside the above: outside a repository, git checkout fell through to file
        // completion and answered a question nobody asked.
        it("offers nothing outside a repository", () => {
            const bareFs = new FileSystem();
            const bareGit = new GitRepository(bareFs);
            bareFs.writeFile("/README.md", "x");
            const bareProcessor = new CommandProcessor(bareFs, bareGit, new ProgressManager());
            bareProcessor.setCurrentDirectory("/");
            const bareService = new AutocompleteService(bareProcessor, bareFs, bareGit);

            const result = bareService.processTabAutocomplete("git checkout ");

            expect(result.fileMatches).toEqual([]);
        });

        it("offers branches, not files, inside a repository", () => {
            gitRepository.createBranch("feature/login");

            const values = service.processTabAutocomplete("git checkout ").fileMatches.map(f => f.value);

            expect(values).toContain("feature/login");
            expect(values).not.toContain("README.md");
        });
    });

    describe("branch completion knows when not to help", () => {
        // After `git switch -c` you are naming a NEW branch, so offering the existing ones is noise.
        it("offers nothing after -c", () => {
            gitRepository.createBranch("feature/login");

            const result = service.processTabAutocomplete("git switch -c fea");

            expect(result.fileMatches).toEqual([]);
        });
    });
});
