import type { FileStatus, GitStatus } from "../types";
import { type FileSystem } from "~/models/FileSystem";
import { sha1 } from "./git/sha1";
import { diffLines, diffStat, mergeFile, toLines } from "./git/diff";
import { resolveRevision, type ReflogEntry, type RevisionContext, type RevisionResult } from "./git/revision";

/**
 * The simulated Git repository.
 *
 * It follows Git's own object model rather than approximating it, because every approximation leaked
 * into the commands built on top of it (issue #109: `git reset --hard HEAD@{1}` could not work when
 * branches were plain lists of commits and the reflog was numbered oldest-first):
 *
 *  - every commit stores a full snapshot (`tree`) and its parents, so any commit — including one that
 *    is no longer on a branch — can be checked out, reset to, diffed, cherry-picked or reverted;
 *  - branches, tags and remote-tracking branches are just names pointing at commits;
 *  - HEAD points at a branch, or directly at a commit ("detached HEAD");
 *  - the index (staging area) is its own snapshot, so `git status` is derived by comparing
 *    HEAD ↔ index ↔ working tree instead of being remembered and kept in sync by hand;
 *  - every ref has a reflog, newest entry first, which is what `HEAD@{n}` reads.
 */

export type Tree = Record<string, string>;

export type CommitObject = {
    id: string;
    message: string;
    timestamp: Date;
    author: string;
    email: string;
    parents: string[];
    tree: Tree;
    /** Paths this commit changed relative to its first parent. */
    files: string[];
    isMergeCommit?: boolean;
    /** Creation order; children always have a higher seq than their parents. */
    seq: number;
};

export type HeadState = { kind: "branch"; name: string } | { kind: "detached"; id: string };

/** One path in `git status --porcelain` terms: X = index vs HEAD, Y = working tree vs index. */
export type StatusEntry = {
    path: string;
    index: " " | "A" | "M" | "D" | "U";
    worktree: " " | "M" | "D" | "?" | "U";
};

export type TagObject = {
    target: string;
    annotation?: { message: string; tagger: string; date: Date };
};

export type StashEntry = {
    message: string;
    timestamp: Date;
    /** The commit HEAD pointed at when the stash was made. */
    base: string;
    index: Tree;
    worktree: Tree;
    /** Untracked files saved with -u. */
    untracked: Tree;
    /** Kept for the legacy accessor: path → content of every changed file. */
    changes: Record<string, string>;
};

type UnmergedEntry = { base?: string; ours?: string; theirs?: string };

export type MergeOutcome =
    | { kind: "up-to-date" }
    | { kind: "fast-forward"; from: string; to: string; stat: TreeStat }
    | { kind: "merged"; commitId: string | null; stat: TreeStat; autoMerged: string[] }
    | { kind: "conflict"; conflicts: ConflictReport[]; autoMerged: string[] }
    | { kind: "error"; lines: string[] };

export type ConflictReport = {
    path: string;
    type: "content" | "add/add" | "modify/delete";
    deletedIn?: string;
    modifiedIn?: string;
};

export type TreeStat = { files: { path: string; insertions: number; deletions: number; status: "A" | "M" | "D" }[] };

type MergeState = {
    theirs: string;
    /** Further heads of an octopus merge (recorded as additional parents). */
    extraParents?: string[];
    label: string;
    message: string;
    touched: string[];
    squash?: boolean;
};

export type SequencerState = {
    kind: "cherry-pick" | "revert";
    current: string;
    /** The current pick was concluded by hand (`git commit`); --continue goes on with the rest. */
    concluded?: boolean;
    remaining: string[];
    /** HEAD before the whole run, where --abort returns to. */
    start: string | null;
    /** A run of several commits: Git keeps a sequencer directory, and refuses to start another run. */
    multi?: boolean;
    message: string;
    author: { name: string; email: string; date: Date };
};

export type RebaseTodo = { action: "pick" | "reword" | "edit" | "squash" | "fixup" | "drop"; id: string };

export type RebaseState = {
    branch: string | null;
    origHead: string;
    onto: string;
    ontoLabel: string;
    todo: RebaseTodo[];
    done: RebaseTodo[];
    /** The pick that stopped (conflict or "edit"), still to be committed by --continue. */
    stopped: { todo: RebaseTodo; conflict: boolean } | null;
    interactive: boolean;
    /** Waiting for the player to save the todo list in the editor. */
    awaitingTodo: boolean;
    /** Message accumulated by a run of squash/fixup lines. */
    pendingSquashMessage: string | null;
    /** Local changes put aside by --autostash, re-applied when the rebase ends. */
    autostash?: StashEntry;
};

export type BisectState = {
    start: string;
    startBranch: string | null;
    good: string[];
    bad: string | null;
    skipped: string[];
    log: string[];
};

type RemoteServer = { branches: Record<string, string>; tags: Record<string, string> };

const ZERO_ID = "0000000000000000000000000000000000000000";

/** The subject Git gives a revert: reverting a revert reapplies the original (Git 2.43+). */
function revertSubject(subject: string): string {
    if (subject.startsWith('Revert "') && !subject.startsWith('Revert "Revert "') && subject.endsWith('"')) {
        return `Reapply "${subject.substring('Revert "'.length)}`;
    }
    return `Revert "${subject}"`;
}
const DEFAULT_BRANCH = "main";
const DEFAULT_REMOTE_URL = "https://github.com/user/repo.git";

/** Authors used for commits a level sets up, so `git log` shows a team rather than one person. */
const SETUP_AUTHORS = [
    { name: "Sam Taylor", email: "sam@example.com" },
    { name: "Alex Kim", email: "alex@example.com" },
    { name: "Lee Morgan", email: "lee@example.com" },
    { name: "Taylor Brooks", email: "taylor@example.com" },
];

export class GitRepository {
    private fileSystem: FileSystem;
    private initialized = false;
    private repositoryRoot: string | null = null;

    private objects: Record<string, CommitObject> = {};
    private branches: Record<string, string> = {};
    private head: HeadState = { kind: "branch", name: DEFAULT_BRANCH };
    private index: Tree = {};
    private unmerged: Record<string, UnmergedEntry> = {};
    private tags: Map<string, TagObject> = new Map();
    private remotes: Record<string, string> = {};
    private remoteServers: Record<string, RemoteServer> = {};
    private trackingRefs: Record<string, string> = {};
    private upstreams: Record<string, { remote: string; branch: string }> = {};
    private reflogs: Record<string, ReflogEntry[]> = {};
    private specialRefs: Record<string, string> = {};
    private mergeState: MergeState | null = null;
    private sequencer: SequencerState | null = null;
    private rebaseState: RebaseState | null = null;
    private bisectState: BisectState | null = null;
    private stash: StashEntry[] = [];
    private seq = 0;
    private setupAuthorCursor = 0;
    private user = { name: "You", email: "you@example.com" };
    /** When set, new commits are attributed to a rotating cast (level setup), not to the player. */
    private setupMode = false;
    /** A file the UI should open in the editor, and the command to run once it is saved. */
    private editorRequest: { path: string; followUp: string } | null = null;

    constructor(fileSystem: FileSystem) {
        this.fileSystem = fileSystem;
    }

    // =================================================================================================
    // Lifecycle
    // =================================================================================================

    public init(currentDirectory: string = "/"): boolean {
        const normalizedDir = this.normalizeDir(currentDirectory);

        if (this.initialized && this.repositoryRoot !== normalizedDir) {
            return false; // single repository per session
        }

        const reinit = this.initialized;
        this.repositoryRoot = normalizedDir;
        this.initialized = true;
        this.writeGitDirectory(!reinit);
        return true;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public getRepositoryRoot(): string | null {
        return this.repositoryRoot;
    }

    /** True if `currentDirectory` is this repository's root or somewhere below it. */
    public isInRepository(currentDirectory: string): boolean {
        if (!this.initialized || this.repositoryRoot === null) return false;

        let checkDir = this.normalizeDir(currentDirectory);
        while (true) {
            const gitPath = checkDir === "/" ? "/.git" : `${checkDir}/.git`;
            if (this.fileSystem.getDirectoryContents(gitPath) !== null) {
                return this.repositoryRoot === checkDir;
            }
            if (checkDir === "/") return false;
            checkDir = this.parentDir(checkDir);
        }
    }

    /** Forget everything, as if the repository had never been created. */
    public reset(): void {
        this.initialized = false;
        this.repositoryRoot = null;
        this.objects = {};
        this.branches = {};
        this.head = { kind: "branch", name: DEFAULT_BRANCH };
        this.index = {};
        this.unmerged = {};
        this.tags = new Map();
        this.remotes = {};
        this.remoteServers = {};
        this.trackingRefs = {};
        this.upstreams = {};
        this.reflogs = {};
        this.specialRefs = {};
        this.mergeState = null;
        this.sequencer = null;
        this.rebaseState = null;
        this.bisectState = null;
        this.stash = [];
        this.seq = 0;
        this.setupAuthorCursor = 0;
        this.setupMode = false;
        this.editorRequest = null;
    }

    /** Clear history but stay initialized in place. */
    public partialReset(): void {
        const root = this.repositoryRoot;
        this.reset();
        this.initialized = true;
        this.repositoryRoot = root;
    }

    /** While on, commits are authored by a rotating cast of teammates (used by level setup). */
    public setSetupMode(on: boolean): void {
        this.setupMode = on;
    }

    public getUser(): { name: string; email: string } {
        return { ...this.user };
    }

    public setUser(name?: string, email?: string): void {
        if (name) this.user.name = name;
        if (email) this.user.email = email;
    }

    // =================================================================================================
    // Paths and the working tree
    // =================================================================================================

    private normalizeDir(path: string): string {
        if (!path) return "/";
        const collapsed = path.replace(/\/+/g, "/");
        return collapsed !== "/" && collapsed.endsWith("/") ? collapsed.slice(0, -1) : collapsed;
    }

    private parentDir(path: string): string {
        const parts = path.split("/").filter(p => p);
        parts.pop();
        return parts.length === 0 ? "/" : "/" + parts.join("/");
    }

    /** The repository-relative path ("src/a.js") for an absolute path, or null if it lies outside. */
    public toRepoPath(absolutePath: string): string | null {
        const root = this.repositoryRoot ?? "/";
        const path = this.normalizeDir(absolutePath.startsWith("/") ? absolutePath : `/${absolutePath}`);
        if (root === "/") return path === "/" ? "" : path.substring(1);
        if (path === root) return "";
        if (path.startsWith(root + "/")) return path.substring(root.length + 1);
        return null;
    }

    /** Absolute file-system path for a repository-relative path. */
    public toFsPath(repoPath: string): string {
        const root = this.repositoryRoot ?? "/";
        const clean = repoPath.replace(/^\/+/, "");
        if (clean === "") return root;
        return root === "/" ? `/${clean}` : `${root}/${clean}`;
    }

    /**
     * Legacy callers pass paths relative to "/" (with or without a leading slash). For a repository at
     * the root those already are repository paths; for one in a subdirectory, strip that prefix.
     */
    private normalizeInputPath(path: string): string {
        if (path.startsWith("/")) return this.toRepoPath(path) ?? path.substring(1);
        const root = this.repositoryRoot ?? "/";
        if (root !== "/") {
            const prefix = root.substring(1) + "/";
            if (path.startsWith(prefix)) return path.substring(prefix.length);
        }
        return path;
    }

    /** Every file under the repository root except `.git`, as path → content. */
    public readWorkingTree(): Tree {
        const tree: Tree = {};
        const root = this.repositoryRoot ?? "/";
        const walk = (dir: string, prefix: string) => {
            const contents = this.fileSystem.getDirectoryContents(dir);
            if (!contents) return;
            for (const [name, item] of Object.entries(contents)) {
                if (name === ".git") continue;
                const childPath = dir === "/" ? `/${name}` : `${dir}/${name}`;
                const rel = prefix ? `${prefix}/${name}` : name;
                if (item.type === "file") {
                    tree[rel] = item.content ?? "";
                } else {
                    walk(childPath, rel);
                }
            }
        };
        walk(root, "");
        return tree;
    }

    private readWorkingFile(path: string): string | undefined {
        const content = this.fileSystem.getFileContents(this.toFsPath(path));
        return content ?? undefined;
    }

    private writeWorkingFile(path: string, content: string): void {
        this.fileSystem.writeFile(this.toFsPath(path), content);
    }

    private deleteWorkingFile(path: string): void {
        const fsPath = this.toFsPath(path);
        this.fileSystem.delete(fsPath);
        // Git removes directories a deletion leaves empty.
        let dir = this.parentDir(fsPath);
        const root = this.repositoryRoot ?? "/";
        while (dir !== root && dir !== "/" && dir.startsWith(root === "/" ? "/" : root + "/")) {
            const contents = this.fileSystem.getDirectoryContents(dir);
            if (!contents || Object.keys(contents).length > 0) break;
            this.fileSystem.delete(dir);
            dir = this.parentDir(dir);
        }
    }

    // ---------------------------------------------------------------------------------------- .gitignore

    private ignorePatterns(): { pattern: RegExp; negate: boolean; dirOnly: boolean }[] {
        const content = this.readWorkingFile(".gitignore");
        if (!content) return [];
        const rules: { pattern: RegExp; negate: boolean; dirOnly: boolean }[] = [];
        for (const raw of content.split("\n")) {
            let line = raw.trim();
            if (!line || line.startsWith("#")) continue;
            const negate = line.startsWith("!");
            if (negate) line = line.substring(1);
            const dirOnly = line.endsWith("/");
            if (dirOnly) line = line.slice(0, -1);
            const anchored = line.startsWith("/") || line.slice(0, -1).includes("/");
            line = line.replace(/^\//, "");
            const body = line
                .split("**")
                .map(part =>
                    part
                        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
                        .replace(/\*/g, "[^/]*")
                        .replace(/\?/g, "[^/]"),
                )
                .join(".*");
            const source = anchored ? `^${body}(/.*)?$` : `(^|/)${body}(/.*)?$`;
            rules.push({ pattern: new RegExp(source), negate, dirOnly });
        }
        return rules;
    }

    /** Whether `.gitignore` excludes this path (only consulted for untracked files, as in Git). */
    public isIgnored(path: string): boolean {
        const rules = this.ignorePatterns();
        let ignored = false;
        for (const rule of rules) {
            if (rule.dirOnly && !path.includes("/")) continue;
            if (rule.pattern.test(path)) ignored = !rule.negate;
        }
        return ignored;
    }

    // =================================================================================================
    // Objects and refs
    // =================================================================================================

    public getCommit(id: string): CommitObject | undefined {
        return this.objects[id];
    }

    public hasCommit(id: string): boolean {
        return id in this.objects;
    }

    public getHead(): HeadState {
        return this.head.kind === "branch" ? { ...this.head } : { ...this.head };
    }

    /** The commit HEAD points at, or null on an unborn branch. */
    public getHeadCommitId(): string | null {
        if (this.head.kind === "detached") return this.head.id;
        return this.branches[this.head.name] ?? null;
    }

    public isDetached(): boolean {
        return this.head.kind === "detached";
    }

    /** The checked-out branch, or null when HEAD is detached. */
    public getBranchName(): string | null {
        return this.head.kind === "branch" ? this.head.name : null;
    }

    /** The checked-out branch name; "HEAD" when detached (that is what Git prints in its place). */
    public getCurrentBranch(): string {
        return this.head.kind === "branch" ? this.head.name : "HEAD";
    }

    public getCurrentCommitHash(): string {
        return this.getHeadCommitId() ?? "0000000";
    }

    /** Local branches. The checked-out branch is included even before its first commit. */
    public getBranches(): string[] {
        const names = Object.keys(this.branches);
        if (this.head.kind === "branch" && !names.includes(this.head.name)) {
            return [this.head.name, ...names];
        }
        return names;
    }

    /** Branches that point at a commit (what `git branch` lists). */
    public getBornBranches(): string[] {
        return Object.keys(this.branches);
    }

    public getBranchTip(name: string): string | null {
        return this.branches[name] ?? null;
    }

    public getBranchHeads(): Record<string, string> {
        return { ...this.branches };
    }

    public getRemoteTrackingRefs(): Record<string, string> {
        return { ...this.trackingRefs };
    }

    public getHeadTree(): Tree {
        const id = this.getHeadCommitId();
        return id ? { ...this.objects[id]!.tree } : {};
    }

    public getIndex(): Tree {
        return { ...this.index };
    }

    public treeOf(id: string): Tree {
        return this.objects[id]?.tree ?? {};
    }

    /** Short id that is unique among all commits (at least 7 characters, like Git's default). */
    public abbrev(id: string): string {
        let length = 7;
        const ids = Object.keys(this.objects);
        while (length < 40 && ids.some(other => other !== id && other.startsWith(id.substring(0, length)))) {
            length++;
        }
        return id.substring(0, length);
    }

    private writeGitDirectory(fresh: boolean): void {
        const root = this.repositoryRoot ?? "/";
        const gitDir = root === "/" ? "/.git" : `${root}/.git`;
        this.fileSystem.mkdir(gitDir);
        this.fileSystem.mkdir(`${gitDir}/objects`);
        this.fileSystem.mkdir(`${gitDir}/refs/heads`);
        this.fileSystem.mkdir(`${gitDir}/refs/tags`);
        if (fresh || this.fileSystem.getFileContents(`${gitDir}/HEAD`) === null) {
            this.fileSystem.writeFile(`${gitDir}/HEAD`, `ref: refs/heads/${this.getCurrentBranch()}\n`);
        }
        this.fileSystem.writeFile(
            `${gitDir}/config`,
            "[core]\n\trepositoryformatversion = 0\n\tfilemode = true\n\tbare = false\n\tlogallrefupdates = true\n",
        );
        this.fileSystem.writeFile(
            `${gitDir}/description`,
            "Unnamed repository; edit this file 'description' to name the repository.\n",
        );
        this.syncGitDirectory();
    }

    /** Mirror HEAD and refs into `.git/`, so `cat .git/HEAD` shows what real Git would. */
    private syncGitDirectory(): void {
        if (!this.initialized) return;
        const root = this.repositoryRoot ?? "/";
        const gitDir = root === "/" ? "/.git" : `${root}/.git`;
        if (this.fileSystem.getDirectoryContents(gitDir) === null) return;

        this.fileSystem.writeFile(
            `${gitDir}/HEAD`,
            this.head.kind === "branch" ? `ref: refs/heads/${this.head.name}\n` : `${this.head.id}\n`,
        );

        this.fileSystem.delete(`${gitDir}/refs/heads`);
        this.fileSystem.mkdir(`${gitDir}/refs/heads`);
        for (const [name, id] of Object.entries(this.branches)) {
            this.fileSystem.writeFile(`${gitDir}/refs/heads/${name}`, `${id}\n`);
        }
        this.fileSystem.delete(`${gitDir}/refs/tags`);
        this.fileSystem.mkdir(`${gitDir}/refs/tags`);
        for (const [name, tag] of this.tags) {
            this.fileSystem.writeFile(`${gitDir}/refs/tags/${name}`, `${tag.target}\n`);
        }
        for (const name of ["ORIG_HEAD", "MERGE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD", "FETCH_HEAD"]) {
            const value = this.specialRefs[name];
            if (value) this.fileSystem.writeFile(`${gitDir}/${name}`, `${value}\n`);
            else this.fileSystem.delete(`${gitDir}/${name}`);
        }
    }

    // ---------------------------------------------------------------------------------------- reflogs

    private logRef(fullRef: string, oldId: string | null, newId: string, message: string): void {
        const log = (this.reflogs[fullRef] ??= []);
        log.unshift({ oldId: oldId ?? ZERO_ID, newId, message, timestamp: new Date() });
    }

    /**
     * Move a ref and record it, the way every Git command that moves HEAD does. When HEAD is on a
     * branch, both the branch and HEAD get the entry.
     */
    private updateHead(newId: string, message: string): void {
        const oldId = this.getHeadCommitId();
        if (this.head.kind === "branch") {
            this.branches[this.head.name] = newId;
            // A branch that does not move gets no entry; HEAD's reflog records every update.
            if (oldId !== newId) this.logRef(`refs/heads/${this.head.name}`, oldId, newId, message);
        } else {
            this.head = { kind: "detached", id: newId };
        }
        this.logRef("HEAD", oldId, newId, message);
        this.syncGitDirectory();
    }

    /** Reflog for a ref, newest first. Accepts "HEAD", a branch name, "stash" or a full ref name. */
    public getRefLog(ref = "HEAD"): ReflogEntry[] {
        if (ref === "stash" || ref === "refs/stash") return this.stashReflog();
        const full = ref === "HEAD" ? "HEAD" : ref.startsWith("refs/") ? ref : (this.fullRefName(ref) ?? ref);
        return [...(this.reflogs[full] ?? [])];
    }

    private stashReflog(): ReflogEntry[] {
        return this.stash.map(entry => ({
            oldId: ZERO_ID,
            newId: this.stashCommitId(entry),
            message: entry.message,
            timestamp: entry.timestamp,
        }));
    }

    private stashCommitId(entry: StashEntry): string {
        return sha1(`stash ${entry.base} ${entry.timestamp.getTime()} ${entry.message}`);
    }

    /** Legacy reflog view: HEAD's reflog with Git's action split out, index 0 = newest. */
    public getReflog(): Array<{ commitHash: string; action: string; message: string; timestamp: Date; index: number }> {
        return this.getRefLog("HEAD")
            .map((entry, index) => {
                const colon = entry.message.indexOf(": ");
                return {
                    commitHash: entry.newId,
                    action: colon === -1 ? entry.message : entry.message.substring(0, colon),
                    message: colon === -1 ? "" : entry.message.substring(colon + 2),
                    timestamp: entry.timestamp,
                    index,
                };
            })
            .filter(entry => entry.commitHash !== ZERO_ID);
    }

    /** Legacy: append a HEAD reflog entry. */
    public addReflogEntry(commitHash: string, action: string, message: string): void {
        this.logRef("HEAD", this.getHeadCommitId(), commitHash, `${action}: ${message}`);
    }

    public clearReflog(): void {
        this.reflogs = {};
    }

    // ---------------------------------------------------------------------------------------- revisions

    /**
     * How Git names a detached HEAD ("HEAD detached at/from …"), from the last checkout in the
     * reflog: the ref that was checked out if it still points there (refs/heads/ kept, refs/tags/ and
     * refs/remotes/ shortened), otherwise the abbreviated commit.
     */
    public detachedLabel(): { at: boolean; name: string } | null {
        const id = this.getHeadCommitId();
        if (this.head.kind !== "detached" || !id) return null;
        const entry = this.getRefLog("HEAD").find(e => e.message.startsWith("checkout: moving from "));
        if (!entry) return { at: true, name: this.abbrev(id) };
        const to = entry.message.substring(entry.message.lastIndexOf(" to ") + 4);
        const full = to === "HEAD" ? null : this.fullRefName(to);
        const resolved = full ? this.resolveRefName(full.replace(/^refs\/(heads|tags|remotes)\//, "")) : null;
        const name =
            full && resolved === entry.newId ? full.replace(/^refs\/(tags|remotes)\//, "") : this.abbrev(entry.newId);
        return { at: entry.newId === id, name };
    }

    public fullRefName(name: string): string | null {
        if (name === "HEAD") return "HEAD";
        if (name.startsWith("refs/")) return name;
        if (name in this.branches || (this.head.kind === "branch" && this.head.name === name)) {
            return `refs/heads/${name}`;
        }
        if (this.tags.has(name)) return `refs/tags/${name}`;
        if (name in this.trackingRefs) return `refs/remotes/${name}`;
        if (name === "stash") return "refs/stash";
        return null;
    }

    private revisionContext(): RevisionContext {
        return {
            resolveRefName: name => this.resolveRefName(name),
            getReflog: full => (full === "refs/stash" ? this.stashReflog() : [...(this.reflogs[full] ?? [])]),
            fullRefName: name => this.fullRefName(name),
            currentBranch: () => this.getBranchName(),
            previousCheckout: n => this.previousCheckout(n),
            upstreamOf: branch => {
                const upstream = this.upstreams[branch];
                return upstream ? GitRepository.upstreamRefName(upstream) : null;
            },
            commitIdsWithPrefix: prefix => Object.keys(this.objects).filter(id => id.startsWith(prefix)),
            parentsOf: id => this.objects[id]?.parents ?? null,
        };
    }

    private resolveRefName(name: string): string | "unborn" | null {
        if (name === "HEAD") return this.getHeadCommitId() ?? "unborn";
        if (["ORIG_HEAD", "MERGE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD", "FETCH_HEAD"].includes(name)) {
            return this.specialRefs[name] ?? null;
        }
        if (name === "stash" || name === "refs/stash") {
            const top = this.stash[0];
            return top ? this.stashCommitId(top) : null;
        }

        const strip = (prefix: string) => (name.startsWith(prefix) ? name.substring(prefix.length) : null);
        const head = strip("refs/heads/");
        if (head !== null) return this.branches[head] ?? null;
        const tag = strip("refs/tags/");
        if (tag !== null) return this.tags.get(tag)?.target ?? null;
        const remote = strip("refs/remotes/");
        if (remote !== null) return this.trackingRefs[remote] ?? null;

        if (name in this.branches) return this.branches[name]!;
        if (this.head.kind === "branch" && this.head.name === name) return "unborn";
        const tagObject = this.tags.get(name);
        if (tagObject) return tagObject.target;
        if (name in this.trackingRefs) return this.trackingRefs[name]!;
        // A bare remote name means that remote's default branch ("origin" → "origin/main").
        if (name in this.remotes) {
            return this.trackingRefs[`${name}/${DEFAULT_BRANCH}`] ?? this.trackingRefs[`${name}/master`] ?? null;
        }
        return null;
    }

    /** The n-th branch (or commit) checked out before the current one, from HEAD's reflog. */
    public previousCheckout(n: number): string | null {
        let seen = 0;
        for (const entry of this.reflogs.HEAD ?? []) {
            const match = /^checkout: moving from (\S+) to (\S+)$/.exec(entry.message);
            if (match) {
                seen++;
                if (seen === n) return match[1]!;
            }
        }
        return null;
    }

    /** Resolve any revision expression to a commit id. */
    public resolveRevision(spec: string): RevisionResult {
        return resolveRevision(spec, this.revisionContext());
    }

    /** Resolve a revision, or undefined if it does not name a commit. */
    public resolveCommit(spec: string): string | undefined {
        const result = this.resolveRevision(spec);
        return result.ok ? result.id : undefined;
    }

    // ---------------------------------------------------------------------------------------- history

    /** All commits reachable from `starts`, excluding those reachable from `excludes`, newest first. */
    public revList(starts: string[], excludes: string[] = [], options: { firstParent?: boolean } = {}): string[] {
        const excluded = new Set<string>();
        const stack = [...excludes];
        while (stack.length > 0) {
            const id = stack.pop()!;
            if (excluded.has(id) || !this.objects[id]) continue;
            excluded.add(id);
            stack.push(...this.objects[id]!.parents);
        }

        const seen = new Set<string>();
        const result: string[] = [];
        const queue = [...starts];
        while (queue.length > 0) {
            const id = queue.pop()!;
            if (seen.has(id) || excluded.has(id) || !this.objects[id]) continue;
            seen.add(id);
            result.push(id);
            const parents = this.objects[id]!.parents;
            queue.push(...(options.firstParent ? parents.slice(0, 1) : parents));
        }

        return result.sort((a, b) => this.objects[b]!.seq - this.objects[a]!.seq);
    }

    public isAncestor(ancestor: string, descendant: string): boolean {
        if (ancestor === descendant) return true;
        const stack = [descendant];
        const seen = new Set<string>();
        while (stack.length > 0) {
            const id = stack.pop()!;
            if (id === ancestor) return true;
            if (seen.has(id)) continue;
            seen.add(id);
            stack.push(...(this.objects[id]?.parents ?? []));
        }
        return false;
    }

    /** The best common ancestor of two commits (the newest one shared by both histories). */
    public mergeBase(a: string, b: string): string | null {
        const fromA = new Set(this.revList([a]));
        const common = this.revList([b]).filter(id => fromA.has(id));
        // revList is newest-first; the first common commit that is not an ancestor of another is it.
        return common[0] ?? null;
    }

    /** Every commit reachable from any ref — what `git log --all` walks. */
    public getAllCommits(): Record<string, CommitObject> {
        const starts = [
            ...Object.values(this.branches),
            ...Object.values(this.trackingRefs),
            ...[...this.tags.values()].map(t => t.target),
        ];
        const headId = this.getHeadCommitId();
        if (headId) starts.push(headId);
        const result: Record<string, CommitObject> = {};
        for (const id of this.revList(starts).reverse()) result[id] = this.objects[id]!;
        return result;
    }

    /** Commits reachable from HEAD, oldest first. */
    public getCommits(): Record<string, CommitObject> {
        const result: Record<string, CommitObject> = {};
        for (const id of this.getCommitHistory()) result[id] = this.objects[id]!;
        return result;
    }

    /** Ids of commits reachable from HEAD, oldest first. */
    public getCommitHistory(): string[] {
        const headId = this.getHeadCommitId();
        return headId ? this.revList([headId]).reverse() : [];
    }

    public getLastCommit(): (CommitObject & { id: string }) | null {
        const id = this.getHeadCommitId();
        return id ? { ...this.objects[id]! } : null;
    }

    // =================================================================================================
    // Index and status
    // =================================================================================================

    /** Porcelain-style status: every path that differs between HEAD, the index and the working tree. */
    public statusEntries(options: { includeIgnored?: boolean } = {}): StatusEntry[] {
        if (!this.initialized) return [];
        const headTree = this.getHeadTree();
        const work = this.readWorkingTree();
        const paths = new Set([...Object.keys(headTree), ...Object.keys(this.index), ...Object.keys(work)]);
        const entries: StatusEntry[] = [];

        for (const path of paths) {
            if (path in this.unmerged) {
                entries.push({ path, index: "U", worktree: "U" });
                continue;
            }

            const inHead = path in headTree;
            const inIndex = path in this.index;
            const inWork = path in work;

            if (!inIndex) {
                if (inHead) {
                    entries.push({ path, index: "D", worktree: " " });
                }
                if (inWork && (options.includeIgnored || !this.isIgnored(path))) {
                    entries.push({ path, index: " ", worktree: "?" });
                }
                continue;
            }

            const x: StatusEntry["index"] = !inHead ? "A" : headTree[path] !== this.index[path] ? "M" : " ";
            const y: StatusEntry["worktree"] = !inWork ? "D" : work[path] !== this.index[path] ? "M" : " ";
            if (x !== " " || y !== " ") entries.push({ path, index: x, worktree: y });
        }

        return entries.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
    }

    /**
     * Legacy one-word status per path, derived from the three trees. Clean tracked files are
     * "committed"; ignored untracked files are left out, as `git status` leaves them out.
     */
    public getStatus(): GitStatus {
        if (!this.initialized) return {};
        const status: GitStatus = {};
        for (const path of Object.keys(this.index)) status[path] = "committed";
        for (const entry of this.statusEntries()) {
            status[entry.path] = this.legacyState(entry);
        }
        return status;
    }

    private legacyState(entry: StatusEntry): FileStatus {
        if (entry.index === "U") return "modified";
        if (entry.worktree === "?") return "untracked";
        if (entry.index !== " " && entry.worktree !== " ") return "staged+modified";
        if (entry.index !== " ") return "staged";
        if (entry.worktree === "D") return "deleted";
        return "modified";
    }

    /** The working tree as Git sees it right now (same as getStatus; kept for existing callers). */
    public getWorkingTreeStatus(): GitStatus {
        return this.getStatus();
    }

    public isFileTracked(path: string): boolean {
        return this.normalizeInputPath(path) in this.index;
    }

    public getCommittedFileContent(path: string): string | null {
        return this.getHeadTree()[this.normalizeInputPath(path)] ?? null;
    }

    /** Stage a path: copy its working-tree content into the index, or record its deletion. */
    public stagePath(path: string): void {
        // Nothing inside .git is ever part of the repository's content ("invalid path" in Git).
        if (path === ".git" || path.startsWith(".git/")) return;
        const content = this.readWorkingFile(path);
        if (content === undefined) {
            delete this.index[path];
        } else {
            this.index[path] = content;
        }
        delete this.unmerged[path];
    }

    /** Make the index entry for a path match a commit's (default HEAD) — `git restore --staged`. */
    public unstagePath(path: string, sourceId: string | null = this.getHeadCommitId()): void {
        const source = sourceId ? this.objects[sourceId]!.tree : {};
        if (path in source) this.index[path] = source[path]!;
        else delete this.index[path];
        delete this.unmerged[path];
    }

    /** Overwrite a working-tree file from a tree (or delete it if absent there). */
    public restoreWorkingPath(path: string, source: Tree): void {
        if (path in source) this.writeWorkingFile(path, source[path]!);
        else this.deleteWorkingFile(path);
    }

    /** Remove a path from the index (and optionally the working tree) — `git rm`. */
    public removePath(path: string, keepWorkingCopy: boolean): void {
        delete this.index[path];
        delete this.unmerged[path];
        if (!keepWorkingCopy) this.deleteWorkingFile(path);
    }

    /** Rename a tracked path in the index and the working tree — `git mv`. */
    public movePath(source: string, destination: string): void {
        const staged = this.index[source];
        const content = this.readWorkingFile(source);
        if (staged !== undefined) this.index[destination] = staged;
        delete this.index[source];
        if (content !== undefined) {
            this.writeWorkingFile(destination, content);
            // A rename leaves the source directory behind, even when it is now empty.
            this.fileSystem.delete(this.toFsPath(source));
        }
    }

    /** A copy of the index (and its unmerged entries), to put back if an operation is abandoned. */
    public snapshotIndex(): { index: Tree; unmerged: Record<string, UnmergedEntry> } {
        return { index: { ...this.index }, unmerged: { ...this.unmerged } };
    }

    public restoreIndex(snapshot: { index: Tree; unmerged: Record<string, UnmergedEntry> }): void {
        this.index = { ...snapshot.index };
        this.unmerged = { ...snapshot.unmerged };
    }

    /** Legacy: stage one file. */
    public addFile(path: string): boolean {
        if (!this.initialized) return false;
        const repoPath = this.normalizeInputPath(path);
        if (this.readWorkingFile(repoPath) === undefined && this.setupMode) {
            // Level setup may commit a file it never wrote; give it plausible content.
            this.writeWorkingFile(repoPath, `// ${repoPath}\n`);
        }
        this.stagePath(repoPath);
        return true;
    }

    /** Legacy: stage many files. */
    public addAll(files: string[]): string[] {
        if (!this.initialized) return [];
        return files.map(file => {
            const repoPath = this.normalizeInputPath(file);
            this.stagePath(repoPath);
            return repoPath;
        });
    }

    /**
     * Legacy status setter. Status is derived now, so most values need no action: a file is
     * "modified" because its content differs, not because something said so. The two that describe
     * an action still perform it: "staged" stages, "committed" discards the path's changes.
     */
    public updateFileStatus(path: string, status: FileStatus): void {
        if (!this.initialized) return;
        const repoPath = this.normalizeInputPath(path);
        if (repoPath.startsWith(".git/") || repoPath === ".git") return;

        if (status === "staged") {
            this.stagePath(repoPath);
        } else if (status === "committed") {
            const headTree = this.getHeadTree();
            this.unstagePath(repoPath);
            if (repoPath in headTree) this.writeWorkingFile(repoPath, headTree[repoPath]!);
        } else if (status === "untracked" && repoPath in this.index && !(repoPath in this.getHeadTree())) {
            delete this.index[repoPath];
        }
    }

    public getUnmergedPaths(): string[] {
        return Object.keys(this.unmerged).sort();
    }

    public getUnmergedEntry(path: string): UnmergedEntry | undefined {
        return this.unmerged[path];
    }

    /** True while unresolved conflicts exist (from a merge, pull, cherry-pick, revert, rebase, stash). */
    public hasMergeConflicts(): boolean {
        return Object.keys(this.unmerged).length > 0;
    }

    /** Legacy view of the merge in progress. */
    public getMergeConflictState(): { sourceBranch: string; conflictFiles: string[] } | null {
        if (!this.mergeState && !this.hasMergeConflicts()) return null;
        return { sourceBranch: this.mergeState?.label ?? "", conflictFiles: this.getUnmergedPaths() };
    }

    public clearMergeConflicts(): void {
        this.unmerged = {};
    }

    // =================================================================================================
    // Committing
    // =================================================================================================

    private nextAuthor(): { name: string; email: string } {
        if (!this.setupMode) return this.user;
        const author = SETUP_AUTHORS[this.setupAuthorCursor % SETUP_AUTHORS.length]!;
        this.setupAuthorCursor++;
        return author;
    }

    private changedPaths(parentTree: Tree, tree: Tree): string[] {
        const paths = new Set([...Object.keys(parentTree), ...Object.keys(tree)]);
        return [...paths].filter(p => parentTree[p] !== tree[p]).sort();
    }

    /** Create a commit object (does not move any ref). */
    public writeCommit(params: {
        tree: Tree;
        parents: string[];
        message: string;
        author?: { name: string; email: string };
        date?: Date;
        files?: string[];
    }): string {
        this.seq++;
        const author = params.author ?? this.nextAuthor();
        const date = params.date ?? new Date();
        const parentTree = params.parents[0] ? this.objects[params.parents[0]]!.tree : {};
        const treeHash = GitRepository.treeId(params.tree);
        const id = sha1(
            `tree ${treeHash}\n${params.parents.map(p => `parent ${p}\n`).join("")}` +
                `author ${author.name} <${author.email}> ${date.getTime()}\n\n${params.message}\n#${this.seq}`,
        );
        this.objects[id] = {
            id,
            message: params.message,
            timestamp: date,
            author: author.name,
            email: author.email,
            parents: [...params.parents],
            tree: { ...params.tree },
            files: params.files ?? this.changedPaths(parentTree, params.tree),
            isMergeCommit: params.parents.length > 1 ? true : undefined,
            seq: this.seq,
        };
        return id;
    }

    /** True if committing the index now would record no change. */
    public indexMatchesHead(): boolean {
        const headTree = this.getHeadTree();
        return this.changedPaths(headTree, this.index).length === 0;
    }

    /**
     * Commit the index, the way `git commit` does: on top of HEAD, plus MERGE_HEAD while a merge is
     * being concluded. Returns the new commit id, or null if there was nothing to commit.
     */
    public commit(
        message: string,
        allowEmpty = false,
        options: { author?: { name: string; email: string }; date?: Date } = {},
    ): string | null {
        if (!this.initialized) return null;
        if (this.hasMergeConflicts()) return null;

        const headId = this.getHeadCommitId();
        const parents = headId ? [headId] : [];
        const merging = this.mergeState && !this.mergeState.squash ? this.mergeState : null;
        if (merging) parents.push(...(merging.extraParents ?? []), merging.theirs);

        if (!merging && !allowEmpty && this.indexMatchesHead()) return null;

        const id = this.writeCommit({
            tree: this.index,
            parents,
            message,
            author: options.author,
            date: options.date,
        });

        const subject = message.split("\n")[0] ?? "";
        const kind = !headId ? "commit (initial)" : merging ? "commit (merge)" : "commit";
        this.updateHead(id, `${kind}: ${subject}`);

        if (this.mergeState) this.finishMergeState();
        if (this.sequencer) {
            delete this.specialRefs.CHERRY_PICK_HEAD;
            delete this.specialRefs.REVERT_HEAD;
            if (this.sequencer.remaining.length === 0) this.sequencer = null;
            else this.sequencer.concluded = true;
            this.syncGitDirectory();
        }
        return id;
    }

    /** Replace the last commit with one built from the current index — `git commit --amend`. */
    public amendLastCommit(
        newMessage?: string,
        options: { author?: { name: string; email: string } } = {},
    ): string | null {
        const headId = this.getHeadCommitId();
        if (!headId) return null;
        const old = this.objects[headId]!;
        const message = newMessage && newMessage.length > 0 ? newMessage : old.message;
        const id = this.writeCommit({
            tree: this.index,
            parents: old.parents,
            message,
            author: options.author ?? { name: old.author, email: old.email },
            date: old.timestamp,
        });
        this.updateHead(id, `commit (amend): ${message.split("\n")[0] ?? ""}`);
        // Committing concludes a cherry-pick or revert, amend or not.
        if (this.sequencer) {
            delete this.specialRefs.CHERRY_PICK_HEAD;
            delete this.specialRefs.REVERT_HEAD;
            if (this.sequencer.remaining.length === 0) this.sequencer = null;
            else this.sequencer.concluded = true;
            this.syncGitDirectory();
        }
        return id;
    }

    // =================================================================================================
    // Branches
    // =================================================================================================

    /** Git's ref-name rules; null when valid, else the reason. */
    public static branchNameProblem(name: string): string | null {
        if (!name) return "A branch name cannot be empty.";
        if (/\s/.test(name)) return "Branch names cannot contain spaces. Try dashes instead: my-branch";
        if (/[~^:?*[\\]/.test(name)) return "Branch names cannot contain any of: ~ ^ : ? * [ \\";
        if (name.startsWith("-")) return "Branch names cannot start with '-'.";
        if (name.startsWith("/") || name.endsWith("/") || name.includes("//")) {
            return "Branch names cannot start or end with '/', or contain '//'.";
        }
        if (name.includes("..")) return "Branch names cannot contain '..'.";
        if (name.includes("@{")) return "Branch names cannot contain '@{'.";
        if (name.startsWith(".") || name.endsWith(".") || name.includes("/.")) {
            return "Branch names (and each part between slashes) cannot start or end with '.'.";
        }
        if (name.endsWith(".lock")) return "Branch names cannot end with '.lock'.";
        if (name === "@" || name === "HEAD") return `'${name}' is not a valid branch name.`;
        return null;
    }

    /**
     * Create a branch at a commit (default HEAD). Legacy signature: returns false if the name is
     * invalid or taken, or there is no commit to point it at.
     */
    public createBranch(name: string, startId?: string, force = false): boolean {
        if (!this.initialized || GitRepository.branchNameProblem(name) !== null) return false;
        if (name in this.branches && !force) return false;
        const target = startId ?? this.getHeadCommitId();
        if (!target) return false;

        const existed = name in this.branches;
        const old = this.branches[name] ?? null;
        this.branches[name] = target;
        const from = startId ? this.describeForReflog(startId) : this.getCurrentBranch();
        this.logRef(
            `refs/heads/${name}`,
            old,
            target,
            existed ? `branch: Reset to ${from}` : `branch: Created from ${from}`,
        );
        this.syncGitDirectory();
        return true;
    }

    private describeForReflog(id: string): string {
        const branch = Object.entries(this.branches).find(([, tip]) => tip === id)?.[0];
        return branch ?? id;
    }

    public deleteBranch(name: string): boolean {
        if (!this.initialized || !(name in this.branches)) return false;
        if (this.head.kind === "branch" && this.head.name === name) return false;
        delete this.branches[name];
        delete this.reflogs[`refs/heads/${name}`];
        delete this.upstreams[name];
        this.syncGitDirectory();
        return true;
    }

    public renameBranch(oldName: string, newName: string, force = false): boolean {
        if (!this.initialized) return false;
        const isCurrent = this.head.kind === "branch" && this.head.name === oldName;
        if (!(oldName in this.branches) && !isCurrent) return false;
        if (newName in this.branches && !force) return false;
        if (GitRepository.branchNameProblem(newName) !== null) return false;

        const tip = this.branches[oldName];
        delete this.branches[oldName];
        if (tip) {
            this.branches[newName] = tip;
            const log = this.reflogs[`refs/heads/${oldName}`] ?? [];
            delete this.reflogs[`refs/heads/${oldName}`];
            this.reflogs[`refs/heads/${newName}`] = log;
            this.logRef(
                `refs/heads/${newName}`,
                tip,
                tip,
                `Branch: renamed refs/heads/${oldName} to refs/heads/${newName}`,
            );
        }
        const upstream = this.upstreams[oldName];
        if (upstream) {
            this.upstreams[newName] = upstream;
            delete this.upstreams[oldName];
        }
        if (isCurrent) {
            this.head = { kind: "branch", name: newName };
            // Git renames by deleting and re-creating the ref; HEAD's reflog sees both halves.
            if (tip) {
                const message = `Branch: renamed refs/heads/${oldName} to refs/heads/${newName}`;
                this.logRef("HEAD", tip, ZERO_ID, message);
                this.logRef("HEAD", ZERO_ID, tip, message);
            }
        }
        this.syncGitDirectory();
        return true;
    }

    public copyBranch(oldName: string, newName: string, force = false): boolean {
        const tip = this.branches[oldName];
        if (!tip) return false;
        return this.createBranch(newName, tip, force);
    }

    /** True if `branchName` has commits that `baseBranch` (default HEAD) does not contain. */
    public hasUnmergedCommits(branchName: string, baseBranch?: string): boolean {
        const tip = this.branches[branchName];
        if (!tip) return false;
        const base = baseBranch ? this.branches[baseBranch] : this.getHeadCommitId();
        if (!base) return true;
        return !this.isAncestor(tip, base);
    }

    // =================================================================================================
    // Checkout / switch
    // =================================================================================================

    /** Paths whose index or working-tree content differs from HEAD (i.e. have local changes). */
    private locallyChangedPaths(): Set<string> {
        return new Set(
            this.statusEntries()
                .filter(e => e.worktree !== "?")
                .map(e => e.path),
        );
    }

    /** `git switch <current branch>` changes nothing, but Git still records it in HEAD's reflog. */
    public noteCheckoutOfCurrentBranch(): void {
        const branch = this.getBranchName();
        const id = this.getHeadCommitId();
        if (!branch || !id) return;
        this.logRef("HEAD", id, id, `checkout: moving from ${branch} to ${branch}`);
        this.syncGitDirectory();
    }

    /**
     * Move HEAD to another commit, carrying local changes along when they do not collide — the
     * two-tree merge Git performs for `git checkout`/`git switch`.
     */
    public moveHead(
        target: { branch: string } | { detach: string },
        options: { force?: boolean; reflogFrom?: string; reflogTo?: string; reflogMessage?: string } = {},
    ): { ok: true } | { ok: false; error: string[] } {
        const targetId = "branch" in target ? (this.branches[target.branch] ?? null) : target.detach;
        const currentId = this.getHeadCommitId();
        const fromTree = this.getHeadTree();
        const toTree = targetId ? this.objects[targetId]!.tree : {};
        const work = this.readWorkingTree();

        if (!options.force) {
            const local = this.locallyChangedPaths();
            const overwritten: string[] = [];
            const untrackedOverwritten: string[] = [];
            const paths = new Set([...Object.keys(fromTree), ...Object.keys(toTree)]);
            for (const path of paths) {
                if (fromTree[path] === toTree[path]) continue;
                if (local.has(path)) {
                    // A file deleted by hand loses nothing when it is rewritten (Git's verify_uptodate).
                    if (!(path in work) && this.index[path] === fromTree[path]) continue;
                    // A local change that already equals the target is no conflict.
                    if (this.index[path] === toTree[path] && work[path] === toTree[path]) continue;
                    overwritten.push(path);
                }
            }
            for (const path of Object.keys(toTree)) {
                if (!(path in fromTree) && !(path in this.index) && path in work && work[path] !== toTree[path]) {
                    untrackedOverwritten.push(path);
                }
            }
            if (overwritten.length > 0) {
                return {
                    ok: false,
                    error: [
                        "error: Your local changes to the following files would be overwritten by checkout:",
                        ...overwritten.sort().map(p => `\t${p}`),
                        "Please commit your changes or stash them before you switch branches.",
                        "Aborting",
                    ],
                };
            }
            if (untrackedOverwritten.length > 0) {
                return {
                    ok: false,
                    error: [
                        "error: The following untracked working tree files would be overwritten by checkout:",
                        ...untrackedOverwritten.sort().map(p => `\t${p}`),
                        "Please move or remove them before you switch branches.",
                        "Aborting",
                    ],
                };
            }
        }

        // Apply the tree change, keeping local modifications to paths the switch does not touch.
        const paths = new Set([...Object.keys(fromTree), ...Object.keys(toTree)]);
        for (const path of paths) {
            if (!options.force && fromTree[path] === toTree[path]) continue;
            if (path in toTree) {
                this.index[path] = toTree[path]!;
                this.writeWorkingFile(path, toTree[path]!);
            } else {
                delete this.index[path];
                if (path in work) this.deleteWorkingFile(path);
            }
        }
        if (options.force) {
            // A forced checkout also throws away staged additions that are not in the target.
            for (const path of Object.keys(this.index)) {
                if (!(path in toTree)) {
                    delete this.index[path];
                    this.deleteWorkingFile(path);
                }
            }
            this.unmerged = {};
        }

        const fromLabel = options.reflogFrom ?? (this.head.kind === "branch" ? this.head.name : (currentId ?? "HEAD"));
        const toLabel = options.reflogTo ?? ("branch" in target ? target.branch : target.detach);
        this.head =
            "branch" in target ? { kind: "branch", name: target.branch } : { kind: "detached", id: target.detach };

        const newId = targetId ?? currentId;
        if (newId) {
            this.logRef(
                "HEAD",
                currentId,
                newId,
                options.reflogMessage ?? `checkout: moving from ${fromLabel} to ${toLabel}`,
            );
        }
        this.syncGitDirectory();
        return { ok: true };
    }

    /** Legacy checkout of an existing branch. */
    public checkout(branch: string, _createNew = false): { success: boolean; warnings?: string[] } {
        if (!this.initialized) return { success: false };
        const name = branch.replace(/^["'](.*)["']$/, "$1");
        const isCurrent = this.head.kind === "branch" && this.head.name === name;
        if (isCurrent) return { success: true };
        if (!(name in this.branches)) {
            if (this.getHeadCommitId() === null && this.head.kind === "branch") {
                // An unborn branch can simply be renamed by switching (`git switch -c` before a commit).
                this.head = { kind: "branch", name };
                this.syncGitDirectory();
                return { success: true };
            }
            return { success: false };
        }
        const result = this.moveHead({ branch: name });
        return result.ok ? { success: true } : { success: false, warnings: result.error };
    }

    /** Make HEAD point at a branch that does not exist yet (`git switch --orphan`, unborn HEAD). */
    public setUnbornBranch(name: string): void {
        this.head = { kind: "branch", name };
        this.syncGitDirectory();
    }

    // =================================================================================================
    // Reset
    // =================================================================================================

    /**
     * `git reset [--soft|--mixed|--hard|--keep] <commit>`: move the current branch (or detached HEAD) to
     * a commit, then reset the index and/or working tree. Works for any commit — including ones only
     * reachable through the reflog, which is how lost work is recovered.
     */
    public resetTo(
        targetId: string,
        mode: "soft" | "mixed" | "hard" | "keep" | "merge",
        reflogTarget: string,
        options: { keepSequencer?: boolean } = {},
    ): { ok: true } | { ok: false; error: string[] } {
        const target = this.objects[targetId];
        if (!target) return { ok: false, error: [`fatal: Could not parse object '${reflogTarget}'.`] };
        const oldId = this.getHeadCommitId();
        const oldTree = this.getHeadTree();

        if (mode === "soft" && (this.isMerging() || this.hasMergeConflicts())) {
            return { ok: false, error: ["fatal: Cannot do a soft reset in the middle of a merge."] };
        }

        if (mode === "merge") {
            // Reset the index; rewrite only files the reset changes and that hold no unstaged edits.
            const work = this.readWorkingTree();
            const paths = new Set([
                ...Object.keys(this.index),
                ...Object.keys(target.tree),
                ...Object.keys(this.unmerged),
            ]);
            const blocked = [...paths].filter(
                p =>
                    !(p in this.unmerged) && target.tree[p] !== this.index[p] && p in work && work[p] !== this.index[p],
            );
            if (blocked.length > 0) {
                return {
                    ok: false,
                    error: [
                        `error: Entry '${blocked.sort()[0]}' not uptodate. Cannot merge.`,
                        `fatal: Could not reset index file to revision '${reflogTarget}'.`,
                    ],
                };
            }
            for (const path of paths) {
                if (!(path in this.unmerged) && target.tree[path] === this.index[path]) continue;
                if (path in target.tree) this.writeWorkingFile(path, target.tree[path]!);
                else if (path in work) this.deleteWorkingFile(path);
            }
            this.index = { ...target.tree };
        }

        if (mode === "keep") {
            const work = this.readWorkingTree();
            const untracked = Object.keys(target.tree).filter(
                p => !(p in oldTree) && !(p in this.index) && p in work && work[p] !== target.tree[p],
            );
            if (untracked.length > 0) {
                return {
                    ok: false,
                    error: [
                        `error: Untracked working tree file '${untracked.sort()[0]}' would be overwritten by merge.`,
                        `fatal: Could not reset index file to revision '${reflogTarget}'.`,
                    ],
                };
            }
            const local = this.locallyChangedPaths();
            const blocked = [...local].filter(p => oldTree[p] !== target.tree[p]);
            if (blocked.length > 0) {
                return {
                    ok: false,
                    error: [
                        "error: Entry '" + blocked[0] + "' not uptodate. Cannot merge.",
                        `fatal: Could not reset index file to revision '${reflogTarget}'.`,
                    ],
                };
            }
        }

        if (mode === "hard") {
            const work = this.readWorkingTree();
            const tracked = new Set([
                ...Object.keys(this.index),
                ...Object.keys(oldTree),
                ...Object.keys(this.unmerged),
            ]);
            for (const path of tracked) {
                if (!(path in target.tree) && path in work) this.deleteWorkingFile(path);
            }
            for (const [path, content] of Object.entries(target.tree)) {
                this.writeWorkingFile(path, content);
            }
            this.index = { ...target.tree };
        } else if (mode === "mixed") {
            this.index = { ...target.tree };
        } else if (mode === "keep") {
            // The index is reset like --mixed; only files that differ between HEAD and the target
            // are rewritten (local changes to those were refused above).
            for (const path of new Set([...Object.keys(oldTree), ...Object.keys(target.tree)])) {
                if (oldTree[path] === target.tree[path]) continue;
                if (path in target.tree) this.writeWorkingFile(path, target.tree[path]!);
                else this.deleteWorkingFile(path);
            }
            this.index = { ...target.tree };
        }

        if (mode !== "soft") this.unmerged = {};
        if (!options.keepSequencer) this.removeBranchState();

        if (oldId) this.specialRefs.ORIG_HEAD = oldId;
        this.updateHead(targetId, `reset: moving to ${reflogTarget}`);
        return { ok: true };
    }

    /** Legacy reset by id. */
    public resetToCommit(commitId: string, mode: "soft" | "mixed" | "hard"): boolean {
        return this.resetTo(commitId, mode, commitId).ok;
    }

    // =================================================================================================
    // Three-way merging (merge, pull, cherry-pick, revert, rebase, stash apply)
    // =================================================================================================

    /**
     * Merge `theirs` into `ours` relative to `base`, path by path. Returns the result tree, the
     * conflicting paths with their three versions and the merged (marker) content, and which paths
     * were merged textually ("Auto-merging").
     */
    private mergeTrees(
        base: Tree,
        ours: Tree,
        theirs: Tree,
        labels: { ours: string; theirs: string },
    ): {
        tree: Tree;
        conflicts: { path: string; report: ConflictReport; entry: UnmergedEntry; worktree?: string }[];
        autoMerged: string[];
    } {
        const tree: Tree = { ...ours };
        const conflicts: { path: string; report: ConflictReport; entry: UnmergedEntry; worktree?: string }[] = [];
        const autoMerged: string[] = [];
        const paths = new Set([...Object.keys(base), ...Object.keys(ours), ...Object.keys(theirs)]);

        for (const path of [...paths].sort()) {
            const b = base[path];
            const o = ours[path];
            const t = theirs[path];

            if (o === t) continue;
            if (o === b) {
                if (t === undefined) delete tree[path];
                else tree[path] = t;
                continue;
            }
            if (t === b) continue;

            // Changed on both sides.
            if (o !== undefined && t !== undefined) {
                const merged = mergeFile(b ?? "", o, t, labels);
                autoMerged.push(path);
                if (merged.conflicts === 0) {
                    tree[path] = merged.content;
                } else {
                    conflicts.push({
                        path,
                        report: { path, type: b === undefined ? "add/add" : "content" },
                        entry: { base: b, ours: o, theirs: t },
                        worktree: merged.content,
                    });
                }
                continue;
            }

            // Deleted on one side, modified on the other.
            conflicts.push({
                path,
                report: {
                    path,
                    type: "modify/delete",
                    deletedIn: o === undefined ? labels.ours : labels.theirs,
                    modifiedIn: o === undefined ? labels.theirs : labels.ours,
                },
                entry: { base: b, ours: o, theirs: t },
                worktree: o ?? t,
            });
        }

        return { tree, conflicts, autoMerged };
    }

    /**
     * The tree an operation will leave in the working tree, for the "would be overwritten" checks:
     * a conflicting path gets markers written into it, so it counts as rewritten whatever it held.
     */
    private resultWithConflicts(result: ReturnType<GitRepository["mergeTrees"]>): Tree {
        return {
            ...result.tree,
            ...Object.fromEntries(result.conflicts.map(c => [c.path, `\0conflict\0${c.worktree ?? ""}`])),
        };
    }

    /** Paths an operation is about to rewrite that have uncommitted changes — Git refuses those. */
    private dirtyPathsBlocking(fromTree: Tree, toTree: Tree): string[] {
        const local = this.locallyChangedPaths();
        const work = this.readWorkingTree();
        const blocked: string[] = [];
        for (const path of local) {
            if (fromTree[path] === toTree[path]) continue;
            // A file deleted by hand loses nothing when it is rewritten (Git's verify_uptodate).
            if (!(path in work) && this.index[path] === fromTree[path]) continue;
            // A local change that already is the result (e.g. a file deleted by hand that the
            // operation deletes too) is not overwritten, so Git lets it through.
            const index = this.index[path];
            if (work[path] === toTree[path] && (index === fromTree[path] || index === toTree[path])) continue;
            blocked.push(path);
        }
        return blocked.sort();
    }

    /** Also refuse to clobber untracked files the result would create. */
    private untrackedPathsBlocking(fromTree: Tree, toTree: Tree): string[] {
        const work = this.readWorkingTree();
        return Object.keys(toTree)
            .filter(p => !(p in fromTree) && !(p in this.index) && p in work && work[p] !== toTree[p])
            .sort();
    }

    /** Write a merge result into the index and working tree; conflicts become unmerged entries. */
    private applyMergeResult(fromTree: Tree, result: ReturnType<GitRepository["mergeTrees"]>): string[] {
        const touched: string[] = [];
        const paths = new Set([...Object.keys(fromTree), ...Object.keys(result.tree)]);
        for (const path of paths) {
            if (fromTree[path] === result.tree[path]) continue;
            touched.push(path);
            if (path in result.tree) {
                this.index[path] = result.tree[path]!;
                this.writeWorkingFile(path, result.tree[path]!);
            } else {
                delete this.index[path];
                this.deleteWorkingFile(path);
            }
        }
        for (const conflict of result.conflicts) {
            touched.push(conflict.path);
            this.unmerged[conflict.path] = conflict.entry;
            if (conflict.entry.ours !== undefined) this.index[conflict.path] = conflict.entry.ours;
            else delete this.index[conflict.path];
            if (conflict.worktree !== undefined) this.writeWorkingFile(conflict.path, conflict.worktree);
        }
        return touched;
    }

    public treeStat(fromTree: Tree, toTree: Tree): TreeStat {
        const files = this.changedPaths(fromTree, toTree).map(path => {
            const stat = diffStat(fromTree[path], toTree[path]);
            const status: "A" | "M" | "D" = !(path in fromTree) ? "A" : !(path in toTree) ? "D" : "M";
            return { path, ...stat, status };
        });
        return { files };
    }

    private blockedError(paths: string[], operation: string, untracked = false): string[] {
        if (untracked) {
            return [
                `error: The following untracked working tree files would be overwritten by ${operation}:`,
                ...paths.map(p => `\t${p}`),
                `Please move or remove them before you ${operation}.`,
                "Aborting",
            ];
        }
        return [
            `error: Your local changes to the following files would be overwritten by ${operation}:`,
            ...paths.map(p => `\t${p}`),
            `Please commit your changes or stash them before you ${operation}.`,
            "Aborting",
        ];
    }

    /**
     * `git merge <commit>`. `label` is how the other side is named in messages and markers (the branch
     * name as typed).
     */
    public mergeCommit(
        theirsId: string,
        options: {
            label: string;
            ff?: "auto" | "no-ff" | "ff-only";
            squash?: boolean;
            noCommit?: boolean;
            message?: string;
            allowUnrelated?: boolean;
            reflogPrefix?: string;
        },
    ): MergeOutcome {
        const oursId = this.getHeadCommitId();
        const ff = options.ff ?? "auto";
        const prefix = options.reflogPrefix ?? `merge ${options.label}`;

        if (!oursId) {
            // Merging into an unborn branch just points it at theirs.
            const tree = this.objects[theirsId]!.tree;
            for (const [p, c] of Object.entries(tree)) {
                this.index[p] = c;
                this.writeWorkingFile(p, c);
            }
            this.updateHead(theirsId, `${prefix}: Fast-forward`);
            return { kind: "fast-forward", from: ZERO_ID, to: theirsId, stat: this.treeStat({}, tree) };
        }

        if (this.isAncestor(theirsId, oursId)) return { kind: "up-to-date" };

        const oursTree = this.objects[oursId]!.tree;
        const theirsTree = this.objects[theirsId]!.tree;
        const canFastForward = this.isAncestor(oursId, theirsId);

        if (!canFastForward && ff === "ff-only") {
            return {
                kind: "error",
                lines: [
                    "hint: Diverging branches can't be fast-forwarded, you need to either:",
                    "hint:",
                    "hint: \tgit merge --no-ff",
                    "hint:",
                    "hint: or:",
                    "hint:",
                    "hint: \tgit rebase",
                    "hint:",
                    "fatal: Not possible to fast-forward, aborting.",
                ],
            };
        }

        if (canFastForward && ff !== "no-ff" && !options.squash) {
            const blocked = this.dirtyPathsBlocking(oursTree, theirsTree);
            if (blocked.length > 0) return { kind: "error", lines: this.blockedError(blocked, "merge") };
            const untracked = this.untrackedPathsBlocking(oursTree, theirsTree);
            if (untracked.length > 0) return { kind: "error", lines: this.blockedError(untracked, "merge", true) };

            this.applyMergeResult(oursTree, { tree: theirsTree, conflicts: [], autoMerged: [] });
            this.specialRefs.ORIG_HEAD = oursId;
            this.updateHead(theirsId, `${prefix}: Fast-forward`);
            return { kind: "fast-forward", from: oursId, to: theirsId, stat: this.treeStat(oursTree, theirsTree) };
        }

        const baseId = this.mergeBase(oursId, theirsId);
        if (!baseId && !options.allowUnrelated) {
            return { kind: "error", lines: ["fatal: refusing to merge unrelated histories"] };
        }
        const baseTree = baseId ? this.objects[baseId]!.tree : {};
        const result = this.mergeTrees(baseTree, oursTree, theirsTree, { ours: "HEAD", theirs: options.label });

        // A real merge (not a fast-forward) starts from a clean index, like merge-ort insists.
        const staged = this.changedPaths(oursTree, this.index);
        if (staged.length > 0) {
            return {
                kind: "error",
                lines: [
                    "error: Your local changes to the following files would be overwritten by merge:",
                    `  ${staged.join(" ")}`,
                    "Merge with strategy ort failed.",
                ],
            };
        }
        const blocked = this.dirtyPathsBlocking(oursTree, this.resultWithConflicts(result));
        if (blocked.length > 0) return { kind: "error", lines: this.blockedError(blocked, "merge") };
        const untracked = this.untrackedPathsBlocking(oursTree, this.resultWithConflicts(result));
        if (untracked.length > 0) return { kind: "error", lines: this.blockedError(untracked, "merge", true) };

        const message = options.message ?? this.defaultMergeMessage(options.label);
        const touched = this.applyMergeResult(oursTree, result);
        this.specialRefs.ORIG_HEAD = oursId;

        if (result.conflicts.length > 0 || options.noCommit || options.squash) {
            this.mergeState = { theirs: theirsId, label: options.label, message, touched, squash: options.squash };
            if (!options.squash) this.specialRefs.MERGE_HEAD = theirsId;
            this.syncGitDirectory();
            if (result.conflicts.length > 0) {
                return {
                    kind: "conflict",
                    conflicts: result.conflicts.map(c => c.report),
                    autoMerged: result.autoMerged,
                };
            }
            if (options.squash) this.mergeState = null;
            return {
                kind: "merged",
                commitId: null,
                stat: this.treeStat(oursTree, result.tree),
                autoMerged: result.autoMerged,
            };
        }

        const commitId = this.writeCommit({ tree: this.index, parents: [oursId, theirsId], message });
        this.updateHead(commitId, `${prefix}: Merge made by the 'ort' strategy.`);
        return { kind: "merged", commitId, stat: this.treeStat(oursTree, result.tree), autoMerged: result.autoMerged };
    }

    /**
     * `git merge a b c` — the octopus strategy (git-merge-octopus): merge the heads one after the
     * other into one commit with a parent per head. It is meant for clean merges: a conflict is only
     * left to resolve when it comes from the last head; anywhere earlier, the whole merge is given
     * up ("Should not be doing an octopus.") and nothing changes. `progress` is what Git prints.
     */
    public mergeOctopus(
        heads: { id: string; label: string }[],
        options: { message?: string; noCommit?: boolean } = {},
    ):
        | { kind: "up-to-date" }
        | { kind: "merged"; commitId: string | null; stat: TreeStat; progress: string[] }
        | { kind: "conflict"; progress: string[]; conflicts: ConflictReport[] }
        | { kind: "error"; lines: string[] } {
        const oursId = this.getHeadCommitId();
        if (!oursId) return { kind: "error", lines: ["fatal: Can merge only exactly one commit into empty head"] };

        const pending = heads.filter(h => !this.isAncestor(h.id, oursId));
        if (pending.length === 0) return { kind: "up-to-date" };

        const oursTree = this.objects[oursId]!.tree;
        const staged = this.changedPaths(oursTree, this.index);
        if (staged.length > 0) {
            return {
                kind: "error",
                lines: [
                    "error: Your local changes to the following files would be overwritten by merge:",
                    `  ${staged.join(" ")}`,
                    "Merge with strategy octopus failed.",
                ],
            };
        }

        const progress: string[] = [];
        let tree: Tree = { ...oursTree };
        let ffCommit: string | null = oursId;
        let conflictResult: ReturnType<GitRepository["mergeTrees"]> | null = null;

        for (let i = 0; i < pending.length; i++) {
            const head = pending[i]!;
            const theirsTree = this.objects[head.id]!.tree;
            // As long as nothing was merged for real, a head ahead of the result is a fast-forward.
            if (ffCommit !== null && this.isAncestor(ffCommit, head.id)) {
                progress.push(`Fast-forwarding to: ${head.label}`);
                tree = { ...theirsTree };
                ffCommit = head.id;
                continue;
            }
            const baseId = this.mergeBase(ffCommit ?? oursId, head.id) ?? this.mergeBase(oursId, head.id);
            ffCommit = null;
            progress.push(`Trying simple merge with ${head.label}`);
            const result = this.mergeTrees(baseId ? this.objects[baseId]!.tree : {}, tree, theirsTree, {
                ours: "HEAD",
                theirs: head.label,
            });
            if (result.autoMerged.length > 0 || result.conflicts.length > 0) {
                progress.push("Simple merge did not work, trying automatic merge.");
                const conflicted = new Set(result.conflicts.map(c => c.path));
                for (const path of [...new Set([...result.autoMerged, ...conflicted])].sort()) {
                    progress.push(`Auto-merging ${path}`);
                    if (conflicted.has(path)) progress.push(`ERROR: content conflict in ${path}`);
                }
            }
            if (result.conflicts.length > 0) {
                progress.push("fatal: merge program failed");
                if (i < pending.length - 1) {
                    return {
                        kind: "error",
                        lines: [
                            ...progress,
                            "Automated merge did not work.",
                            "Should not be doing an octopus.",
                            "Merge with strategy octopus failed.",
                        ],
                    };
                }
                conflictResult = result;
                break;
            }
            tree = result.tree;
        }

        const finalResult = conflictResult ?? { tree, conflicts: [], autoMerged: [] };
        const blocked = this.dirtyPathsBlocking(oursTree, this.resultWithConflicts(finalResult));
        if (blocked.length > 0) return { kind: "error", lines: this.blockedError(blocked, "merge") };
        const untrackedBlocked = this.untrackedPathsBlocking(oursTree, this.resultWithConflicts(finalResult));
        if (untrackedBlocked.length > 0) {
            return { kind: "error", lines: this.blockedError(untrackedBlocked, "merge", true) };
        }

        const message =
            options.message ??
            `Merge branches ${pending
                .slice(0, -1)
                .map(h => `'${h.label}'`)
                .join(", ")} and '${pending[pending.length - 1]!.label}'`;
        const touched = this.applyMergeResult(oursTree, finalResult);
        this.specialRefs.ORIG_HEAD = oursId;
        const allHeads = pending.map(h => h.id);

        if (conflictResult || options.noCommit) {
            this.mergeState = {
                theirs: allHeads[allHeads.length - 1]!,
                extraParents: allHeads.slice(0, -1),
                label: pending.map(h => h.label).join(" "),
                message,
                touched,
            };
            this.specialRefs.MERGE_HEAD = allHeads.join(" ");
            this.syncGitDirectory();
            if (conflictResult) {
                return { kind: "conflict", progress, conflicts: conflictResult.conflicts.map(c => c.report) };
            }
            return { kind: "merged", commitId: null, stat: this.treeStat(oursTree, finalResult.tree), progress };
        }

        const commitId = this.writeCommit({ tree: this.index, parents: [oursId, ...allHeads], message });
        this.updateHead(
            commitId,
            `merge ${pending.map(h => h.label).join(" ")}: Merge made by the 'octopus' strategy.`,
        );
        return { kind: "merged", commitId, stat: this.treeStat(oursTree, this.index), progress };
    }

    private defaultMergeMessage(label: string): string {
        const isRemote = label.includes("/") && label.split("/")[0]! in this.remotes;
        const into = this.head.kind === "branch" && this.head.name !== DEFAULT_BRANCH ? ` into ${this.head.name}` : "";
        return isRemote ? `Merge remote-tracking branch '${label}'${into}` : `Merge branch '${label}'${into}`;
    }

    public getMergeState(): MergeState | null {
        return this.mergeState ? { ...this.mergeState } : null;
    }

    public isMerging(): boolean {
        return this.mergeState !== null && !this.mergeState.squash;
    }

    private finishMergeState(): void {
        this.mergeState = null;
        delete this.specialRefs.MERGE_HEAD;
        this.syncGitDirectory();
    }

    /** `git merge --abort`: put back every path the merge touched. */
    public abortMerge(): boolean {
        if (!this.mergeState) return false;
        // `git merge --abort` is a `git reset --merge`.
        const head = this.getHeadCommitId();
        if (head) this.logRef("HEAD", head, head, "reset: moving to HEAD");
        const headTree = this.getHeadTree();
        for (const path of this.mergeState.touched) {
            this.unstagePath(path);
            this.restoreWorkingPath(path, headTree);
        }
        this.unmerged = {};
        this.finishMergeState();
        return true;
    }

    /** Legacy merge by branch name. */
    public merge(branch: string): {
        success: boolean;
        isFastForward: boolean;
        filesChanged: string[];
        conflictFiles?: string[];
        mergeCommitId?: string;
    } {
        const theirs = this.branches[branch];
        if (!this.initialized || !theirs || branch === this.getBranchName()) {
            return { success: false, isFastForward: false, filesChanged: [] };
        }
        const outcome = this.mergeCommit(theirs, { label: branch });
        switch (outcome.kind) {
            case "up-to-date":
                return { success: true, isFastForward: false, filesChanged: [] };
            case "fast-forward":
                return { success: true, isFastForward: true, filesChanged: outcome.stat.files.map(f => f.path) };
            case "merged":
                return {
                    success: true,
                    isFastForward: false,
                    filesChanged: outcome.stat.files.map(f => f.path),
                    mergeCommitId: outcome.commitId ?? undefined,
                };
            case "conflict":
                return {
                    success: false,
                    isFastForward: false,
                    filesChanged: outcome.conflicts.map(c => c.path),
                    conflictFiles: outcome.conflicts.map(c => c.path),
                };
            default:
                return { success: false, isFastForward: false, filesChanged: [] };
        }
    }

    /** Record an in-progress merge without performing one (level setup for a conflicted state). */
    public beginMergeState(theirsId: string, label: string, conflictPaths: string[]): void {
        const headTree = this.getHeadTree();
        const theirsTree = this.objects[theirsId]?.tree ?? {};
        const headId = this.getHeadCommitId();
        const baseId = headId ? this.mergeBase(headId, theirsId) : null;
        const baseTree = baseId ? this.objects[baseId]!.tree : {};
        for (const path of conflictPaths) {
            this.unmerged[path] = { base: baseTree[path], ours: headTree[path], theirs: theirsTree[path] };
            if (path in headTree) this.index[path] = headTree[path]!;
        }
        this.mergeState = {
            theirs: theirsId,
            label,
            message: this.defaultMergeMessage(label),
            touched: [...new Set([...conflictPaths, ...this.changedPaths(headTree, theirsTree)])],
        };
        this.specialRefs.MERGE_HEAD = theirsId;
        const head = this.getHeadCommitId();
        if (head) this.specialRefs.ORIG_HEAD = head;
        this.syncGitDirectory();
    }

    // ---------------------------------------------------------------------------------------- cherry-pick / revert

    /**
     * Apply one commit's change (cherry-pick) or its inverse (revert) on top of HEAD.
     * On success a commit is created unless `noCommit`; on conflict the sequencer state is kept so
     * `--continue`, `--skip` and `--abort` work.
     */
    public applyCommit(
        commitId: string,
        mode: "cherry-pick" | "revert",
        options: {
            noCommit?: boolean;
            mainline?: number;
            remaining?: string[];
            recordOrigin?: boolean;
            /** HEAD before the whole cherry-pick/revert run (for --abort); defaults to HEAD now. */
            start?: string | null;
            /** Part of a run of several commits (Git keeps a sequencer directory for those). */
            multi?: boolean;
        } = {},
    ):
        | { kind: "committed"; id: string; stat: TreeStat; autoMerged: string[] }
        | { kind: "applied"; autoMerged: string[] }
        | { kind: "empty" }
        | { kind: "conflict"; conflicts: ConflictReport[]; autoMerged: string[] }
        | { kind: "error"; lines: string[] } {
        const commit = this.objects[commitId]!;
        const headId = this.getHeadCommitId();
        // With --no-commit the change is merged into whatever is staged; otherwise the index must be clean.
        const oursTree = options.noCommit ? { ...this.index } : this.getHeadTree();
        const start = options.start === undefined ? headId : options.start;

        if (!options.noCommit && this.changedPaths(oursTree, this.index).length > 0) {
            return {
                kind: "error",
                lines: [
                    `error: your local changes would be overwritten by ${mode}.`,
                    "hint: commit your changes or stash them to proceed.",
                    `fatal: ${mode} failed`,
                ],
            };
        }

        if (commit.parents.length > 1 && !options.mainline) {
            return {
                kind: "error",
                lines: [`error: commit ${commitId} is a merge but no -m option was given.`, `fatal: ${mode} failed`],
            };
        }
        const parentId = commit.parents[(options.mainline ?? 1) - 1];
        const parentTree = parentId ? this.objects[parentId]!.tree : {};

        const base = mode === "cherry-pick" ? parentTree : commit.tree;
        const theirs = mode === "cherry-pick" ? commit.tree : parentTree;
        const short = this.abbrev(commitId);
        const subject = commit.message.split("\n")[0] ?? "";
        const theirsLabel = mode === "cherry-pick" ? `${short} (${subject})` : `parent of ${short} (${subject})`;
        const result = this.mergeTrees(base, oursTree, theirs, { ours: "HEAD", theirs: theirsLabel });

        const resultTree = this.resultWithConflicts(result);
        const work = this.readWorkingTree();
        const blocked = this.changedPaths(oursTree, resultTree).filter(
            p =>
                p in work &&
                work[p] !== this.index[p] &&
                work[p] !== resultTree[p] &&
                (p in this.index || p in oursTree),
        );
        if (blocked.length > 0) {
            return { kind: "error", lines: [...this.blockedError(blocked, "merge"), `fatal: ${mode} failed`] };
        }
        const untracked = this.untrackedPathsBlocking(oursTree, resultTree);
        if (untracked.length > 0) {
            return { kind: "error", lines: [...this.blockedError(untracked, "merge", true), `fatal: ${mode} failed`] };
        }

        const message =
            mode === "cherry-pick"
                ? commit.message + (options.recordOrigin ? `\n\n(cherry picked from commit ${commitId})` : "")
                : `${revertSubject(subject)}\n\nThis reverts commit ${commitId}.`;

        this.applyMergeResult(oursTree, result);
        if (headId) this.specialRefs.ORIG_HEAD = headId;

        const author =
            mode === "cherry-pick"
                ? { name: commit.author, email: commit.email, date: commit.timestamp }
                : { name: this.user.name, email: this.user.email, date: new Date() };

        if (result.conflicts.length > 0) {
            this.sequencer = {
                kind: mode,
                current: commitId,
                remaining: options.remaining ?? [],
                start,
                multi: options.multi,
                message,
                author,
            };
            this.specialRefs[mode === "cherry-pick" ? "CHERRY_PICK_HEAD" : "REVERT_HEAD"] = commitId;
            this.syncGitDirectory();
            return { kind: "conflict", conflicts: result.conflicts.map(c => c.report), autoMerged: result.autoMerged };
        }

        if (options.noCommit) {
            // `git revert -n` leaves REVERT_HEAD behind, so the next `git commit` concludes the revert.
            if (mode === "revert" && this.sequencer?.kind !== "cherry-pick") {
                this.sequencer = { kind: mode, current: commitId, remaining: [], start, message, author };
                this.specialRefs.REVERT_HEAD = commitId;
                this.syncGitDirectory();
            }
            return { kind: "applied", autoMerged: result.autoMerged };
        }

        if (this.changedPaths(oursTree, this.index).length === 0) {
            // A clean revert that comes out empty leaves no REVERT_HEAD behind (Git only writes it on
            // a conflict); a cherry-pick keeps CHERRY_PICK_HEAD for `git commit --allow-empty`.
            if (mode === "revert" && !options.multi) return { kind: "empty" };
            this.sequencer = {
                kind: mode,
                current: commitId,
                remaining: options.remaining ?? [],
                start,
                multi: options.multi,
                message,
                author,
            };
            this.specialRefs[mode === "cherry-pick" ? "CHERRY_PICK_HEAD" : "REVERT_HEAD"] = commitId;
            this.syncGitDirectory();
            return { kind: "empty" };
        }

        const id = this.writeCommit({
            tree: this.index,
            parents: headId ? [headId] : [],
            message,
            author: { name: author.name, email: author.email },
            date: author.date,
        });
        this.updateHead(id, `${mode}: ${mode === "revert" ? revertSubject(subject) : subject}`);
        return { kind: "committed", id, stat: this.treeStat(oursTree, this.index), autoMerged: result.autoMerged };
    }

    public getSequencer(): SequencerState | null {
        return this.sequencer ? { ...this.sequencer, remaining: [...this.sequencer.remaining] } : null;
    }

    /** Conclude a stopped cherry-pick/revert with the resolved index. */
    public continueSequencer(): { ok: true; id: string } | { ok: false; error: string[] } {
        const seq = this.sequencer;
        if (!seq)
            return { ok: false, error: [`error: no cherry-pick or revert in progress`, "fatal: cherry-pick failed"] };
        if (this.hasMergeConflicts()) {
            return {
                ok: false,
                error: [
                    "error: Committing is not possible because you have unmerged files.",
                    "hint: Fix them up in the work tree, and then use 'git add/rm <file>'",
                    "hint: as appropriate to mark resolution and make a commit.",
                    "fatal: Exiting because of an unresolved conflict.",
                ],
            };
        }
        const headId = this.getHeadCommitId();
        const id = this.writeCommit({
            tree: this.index,
            parents: headId ? [headId] : [],
            message: seq.message,
            author: { name: seq.author.name, email: seq.author.email },
            date: seq.author.date,
        });
        this.updateHead(id, `${seq.kind}: ${seq.message.split("\n")[0] ?? ""}`);
        delete this.specialRefs.CHERRY_PICK_HEAD;
        delete this.specialRefs.REVERT_HEAD;
        this.syncGitDirectory();
        return { ok: true, id };
    }

    /**
     * Git's remove_branch_state(), run by `git reset` and `git stash`: it ends a merge and the
     * cherry-pick/revert in progress. A multi-commit run keeps its list, to go on with --continue.
     */
    private removeBranchState(): void {
        if (this.mergeState) this.finishMergeState();
        if (!this.sequencer) return;
        if (this.sequencer.remaining.length === 0) {
            this.clearSequencer();
        } else {
            this.sequencer.concluded = true;
            delete this.specialRefs.CHERRY_PICK_HEAD;
            delete this.specialRefs.REVERT_HEAD;
            this.syncGitDirectory();
        }
    }

    public clearSequencer(): void {
        this.sequencer = null;
        delete this.specialRefs.CHERRY_PICK_HEAD;
        delete this.specialRefs.REVERT_HEAD;
        this.syncGitDirectory();
    }

    /** `--abort`: go back to where the cherry-pick/revert started, keeping unrelated local edits. */
    public abortSequencer(): { ok: true } | { ok: false; error: string[] } {
        if (!this.sequencer) return { ok: true };
        // A run of several commits goes back to where it started; a single pick just drops its change.
        const multi = this.sequencer.multi;
        const target = multi ? (this.sequencer.start ?? this.getHeadCommitId()) : this.getHeadCommitId();
        if (target) {
            const result = this.resetTo(target, "merge", multi ? target : "HEAD");
            if (!result.ok) return result;
        }
        this.clearSequencer();
        return { ok: true };
    }

    /** Keep a cherry-pick/revert run that could not start, as Git keeps its sequencer directory. */
    public holdSequencer(state: SequencerState): void {
        this.sequencer = { ...state, remaining: [...state.remaining] };
        this.syncGitDirectory();
    }

    /** Git's remove_branch_state() for commands that switch branches (`git checkout`). */
    public endOperationsOnSwitch(): void {
        this.removeBranchState();
    }

    /** `--skip`: drop the stopped pick (a `git reset --merge HEAD`), keeping the sequencer's start. */
    public skipSequencerPick(): { ok: true } | { ok: false; error: string[] } {
        const head = this.getHeadCommitId();
        if (!head) return { ok: true };
        const seq = this.sequencer;
        const result = this.resetTo(head, "merge", "HEAD", { keepSequencer: true });
        if (!result.ok) return result;
        if (seq) this.sequencer = seq;
        delete this.specialRefs.CHERRY_PICK_HEAD;
        delete this.specialRefs.REVERT_HEAD;
        this.syncGitDirectory();
        return { ok: true };
    }

    // ---------------------------------------------------------------------------------------- rebase

    public getRebaseState(): RebaseState | null {
        return this.rebaseState;
    }

    /** Git's patch-id, simplified: what a commit changes, independent of where it sits. */
    public patchId(id: string): string {
        const commit = this.objects[id]!;
        const parentTree = commit.parents[0] ? this.objects[commit.parents[0]]!.tree : {};
        return this.changedPaths(parentTree, commit.tree)
            .map(path => {
                const before = parentTree[path];
                const after = commit.tree[path];
                const ops = diffLines(
                    before === undefined ? [] : toLines(before).lines,
                    after === undefined ? [] : toLines(after).lines,
                );
                const changes = ops
                    .filter(op => op.type !== "equal")
                    .map(op => (op.type === "insert" ? "+" : "-") + op.line);
                return `${path}\0${before === undefined ? "new" : after === undefined ? "gone" : ""}\0${changes.join("\n")}`;
            })
            .join("\0\0");
    }

    /** Of `commits`, those whose change `upstream` already has (the cherry-picks rebase skips). */
    public alreadyUpstream(commits: string[], upstreamId: string, headId: string): Set<string> {
        const upstreamPatches = new Set(
            this.revList([upstreamId], [headId])
                .filter(id => this.objects[id]!.parents.length <= 1)
                .map(id => this.patchId(id)),
        );
        return new Set(commits.filter(id => upstreamPatches.has(this.patchId(id))));
    }

    /** The commits a rebase would replay: on `branchTip`, not on `upstream`, oldest first, no merges. */
    public rebaseCommits(upstreamId: string, branchTip: string): string[] {
        return this.revList([branchTip], [upstreamId])
            .filter(id => this.objects[id]!.parents.length <= 1)
            .reverse();
    }

    public startRebase(params: {
        onto: string;
        ontoLabel: string;
        commits: string[];
        interactive: boolean;
        autostash?: StashEntry;
    }): void {
        const origHead = this.getHeadCommitId()!;
        const branch = this.getBranchName();
        this.specialRefs.ORIG_HEAD = origHead;
        this.rebaseState = {
            branch,
            origHead,
            onto: params.onto,
            ontoLabel: params.ontoLabel,
            todo: params.commits.map(id => ({ action: "pick", id })),
            done: [],
            stopped: null,
            interactive: params.interactive,
            awaitingTodo: params.interactive,
            pendingSquashMessage: null,
            autostash: params.autostash,
        };
        this.syncGitDirectory();
    }

    /** The todo list as `git rebase -i` shows it in the editor. */
    public rebaseTodoText(): string {
        const state = this.rebaseState;
        if (!state) return "";
        const lines = state.todo.map(
            t => `${t.action} ${this.abbrev(t.id)} ${this.objects[t.id]!.message.split("\n")[0]}`,
        );
        const count = state.todo.length;
        return [
            ...lines,
            "",
            `# Rebase ${this.abbrev(state.onto)}..${this.abbrev(state.origHead)} onto ${this.abbrev(state.onto)} (${count} command${count === 1 ? "" : "s"})`,
            "#",
            "# Commands:",
            "# p, pick <commit> = use commit",
            "# r, reword <commit> = use commit, but edit the commit message",
            "# e, edit <commit> = use commit, but stop for amending",
            "# s, squash <commit> = use commit, but meld into previous commit",
            '# f, fixup <commit> = like "squash" but keep only the previous commit\'s log message',
            "# d, drop <commit> = remove commit",
            "#",
            "# These lines can be re-ordered; they are executed from top to bottom.",
            "#",
            "# If you remove a line here THAT COMMIT WILL BE LOST.",
            "#",
            "# However, if you remove everything, the rebase will be aborted.",
            "#",
            "",
        ].join("\n");
    }

    /** Parse an edited todo list. Returns an error line on a bad command. */
    public setRebaseTodo(text: string): string | null {
        const state = this.rebaseState;
        if (!state) return "error: no rebase in progress";
        const actions: Record<string, RebaseTodo["action"]> = {
            p: "pick",
            pick: "pick",
            r: "reword",
            reword: "reword",
            e: "edit",
            edit: "edit",
            s: "squash",
            squash: "squash",
            f: "fixup",
            fixup: "fixup",
            d: "drop",
            drop: "drop",
        };
        const todo: RebaseTodo[] = [];
        for (const raw of text.split("\n")) {
            const line = raw.trim();
            if (!line || line.startsWith("#")) continue;
            const [verb, ref] = line.split(/\s+/);
            const action = actions[(verb ?? "").toLowerCase()];
            if (!action) return `error: invalid command '${verb}'`;
            const id = ref ? this.resolveCommit(ref) : undefined;
            if (!id) return `error: could not parse '${ref ?? ""}'`;
            todo.push({ action, id });
        }
        if (todo.length > 0 && (todo[0]!.action === "squash" || todo[0]!.action === "fixup")) {
            return `error: cannot '${todo[0]!.action}' without a previous commit`;
        }
        state.todo = todo;
        state.awaitingTodo = false;
        return null;
    }

    /**
     * Run the rebase todo list until it finishes or stops (conflict, edit, reword).
     * Returns the lines Git prints.
     */
    public runRebase(): { lines: string[]; status: "done" | "stopped" | "conflict" | "error" } {
        const state = this.rebaseState;
        if (!state) return { lines: [], status: "done" };
        const lines: string[] = [];

        // First step: detach HEAD at onto (unless resuming).
        if (state.done.length === 0 && state.stopped === null && this.getHeadCommitId() !== state.onto) {
            const moved = this.moveHead(
                { detach: state.onto },
                { force: false, reflogMessage: `rebase (start): checkout ${state.ontoLabel}` },
            );
            if (!moved.ok) {
                // Nothing has happened yet: give up the rebase and leave everything as it was.
                this.rebaseState = null;
                const restored = state.autostash ? this.applyAutostash(state.autostash) : [];
                this.syncGitDirectory();
                return { lines: [...moved.error, "error: could not detach HEAD", ...restored], status: "error" };
            }
        }

        while (state.todo.length > 0) {
            const step = state.todo.shift()!;
            const commit = this.objects[step.id]!;
            const subject = commit.message.split("\n")[0] ?? "";

            if (step.action === "drop") {
                state.done.push(step);
                continue;
            }

            const headId = this.getHeadCommitId()!;
            const isSquash = step.action === "squash" || step.action === "fixup";

            // The commit already is HEAD (the root commit of `rebase --root`): nothing to replay.
            if (step.id === headId && !isSquash) {
                state.done.push(step);
                if (step.action === "edit" || step.action === "reword") return this.stopForEdit(state, step, lines);
                continue;
            }

            // Fast path: the commit already sits on top of HEAD — reuse it as is, like Git does.
            if (
                !isSquash &&
                commit.parents[0] === headId &&
                state.pendingSquashMessage === null &&
                step.action !== "reword"
            ) {
                this.moveHead({ detach: step.id }, { reflogMessage: `rebase (pick): ${subject}` });
                state.done.push(step);
                if (step.action === "edit") return this.stopForEdit(state, step, lines);
                continue;
            }

            const parentTree = commit.parents[0] ? this.objects[commit.parents[0]]!.tree : {};
            const oursTree = this.getHeadTree();
            const result = this.mergeTrees(parentTree, oursTree, commit.tree, {
                ours: "HEAD",
                theirs: `${this.abbrev(step.id)} (${subject})`,
            });
            const untracked = this.untrackedPathsBlocking(oursTree, this.resultWithConflicts(result));
            if (untracked.length > 0) {
                // Git refuses the pick and puts it back on the list for --continue.
                state.todo.unshift(step);
                this.syncGitDirectory();
                return {
                    lines: [
                        ...lines,
                        ...this.blockedError(untracked, "merge", true),
                        "hint: Could not execute the todo command",
                        "hint:",
                        `hint:     ${step.action} ${this.abbrev(step.id)} # ${subject}`,
                        "hint:",
                        "hint: It has been rescheduled; To edit the command before continuing, please",
                        "hint: edit the todo list first:",
                        "hint:",
                        "hint:     git rebase --edit-todo",
                        "hint:     git rebase --continue",
                    ],
                    status: "conflict",
                };
            }
            // A pick whose change is already there would be empty: Git drops it.
            if (result.conflicts.length === 0 && !isSquash && this.changedPaths(oursTree, result.tree).length === 0) {
                state.done.push(step);
                continue;
            }
            this.applyMergeResult(oursTree, result);
            lines.push(
                ...this.mergeReport(
                    result.autoMerged,
                    result.conflicts.map(c => c.report),
                ),
            );

            if (result.conflicts.length > 0) {
                state.stopped = { todo: step, conflict: true };
                this.specialRefs.REBASE_HEAD = step.id;
                lines.push(
                    `error: could not apply ${this.abbrev(step.id)}... ${subject}`,
                    "hint: Resolve all conflicts manually, mark them as resolved with",
                    'hint: "git add/rm <conflicted_files>", then run "git rebase --continue".',
                    'hint: You can instead skip this commit: run "git rebase --skip".',
                    'hint: To abort and get back to the state before "git rebase", run "git rebase --abort".',
                    `Could not apply ${this.abbrev(step.id)}... ${subject}`,
                );
                return { lines, status: "conflict" };
            }

            this.commitRebaseStep(state, step);
            if (step.action === "edit" || step.action === "reword") return this.stopForEdit(state, step, lines);
        }

        return { lines: [...lines, ...this.finishRebase()], status: "done" };
    }

    private stopForEdit(state: RebaseState, step: RebaseTodo, lines: string[]): { lines: string[]; status: "stopped" } {
        state.stopped = { todo: step, conflict: false };
        const subject = this.objects[step.id]!.message.split("\n")[0] ?? "";
        lines.push(
            `Stopped at ${this.abbrev(step.id)}...  ${subject}`,
            "You can amend the commit now, with",
            "",
            step.action === "reword" ? '  git commit --amend -m "<new message>"' : "  git commit --amend ",
            "",
            "Once you are satisfied with your changes, run",
            "",
            "  git rebase --continue",
        );
        return { lines, status: "stopped" };
    }

    /** Commit the current index for one todo step (pick/reword/edit/squash/fixup). */
    private commitRebaseStep(state: RebaseState, step: RebaseTodo): void {
        const commit = this.objects[step.id]!;
        const headId = this.getHeadCommitId()!;
        const subject = commit.message.split("\n")[0] ?? "";
        const next = state.todo[0];
        const nextIsSquash = next && (next.action === "squash" || next.action === "fixup");

        if (step.action === "squash" || step.action === "fixup") {
            // Meld into the previous commit: replace HEAD with a commit that has both changes.
            const previous = this.objects[headId]!;
            const message =
                step.action === "squash"
                    ? `${state.pendingSquashMessage ?? previous.message}\n\n${commit.message}`
                    : (state.pendingSquashMessage ?? previous.message);
            const id = this.writeCommit({
                tree: this.index,
                parents: previous.parents,
                message,
                author: { name: previous.author, email: previous.email },
                date: previous.timestamp,
            });
            this.moveHeadSilently(id, `rebase (${step.action}): ${message.split("\n")[0]}`);
            state.pendingSquashMessage = nextIsSquash ? message : null;
        } else {
            const id = this.writeCommit({
                tree: this.index,
                parents: [headId],
                message: commit.message,
                author: { name: commit.author, email: commit.email },
                date: commit.timestamp,
            });
            this.moveHeadSilently(id, `rebase (${step.action}): ${subject}`);
            state.pendingSquashMessage = null;
        }
        state.done.push(step);
        state.stopped = null;
        delete this.specialRefs.REBASE_HEAD;
    }

    /** Point detached HEAD at a commit whose tree already matches the index/worktree. */
    private moveHeadSilently(id: string, message: string): void {
        const oldId = this.getHeadCommitId();
        this.head = { kind: "detached", id };
        this.logRef("HEAD", oldId, id, message);
        this.syncGitDirectory();
    }

    /** `git rebase --continue`. */
    public continueRebase(): { lines: string[]; status: "done" | "stopped" | "conflict" | "error" } {
        const state = this.rebaseState;
        if (!state) return { lines: ["fatal: No rebase in progress?"], status: "error" };
        if (state.awaitingTodo) state.awaitingTodo = false;

        if (state.stopped) {
            const unstaged = this.statusEntries().some(e => e.worktree === "M" || e.worktree === "D");
            if (this.hasMergeConflicts() || unstaged) {
                return {
                    lines: [
                        ...this.getUnmergedPaths().map(p => `${p}: needs merge`),
                        "You must edit all merge conflicts and then",
                        "mark them as resolved using git add",
                    ],
                    status: "error",
                };
            }
            if (state.stopped.conflict) {
                const step = state.stopped.todo;
                if (
                    this.changedPaths(this.getHeadTree(), this.index).length === 0 &&
                    step.action !== "squash" &&
                    step.action !== "fixup"
                ) {
                    // Resolved to nothing: Git drops the commit.
                    state.done.push(step);
                    state.stopped = null;
                } else {
                    this.commitRebaseStep(state, step);
                }
            } else {
                // Stopped for edit/reword: the player may have amended; anything newly staged is
                // folded in the way Git would ask them to.
                if (!this.indexMatchesHead()) {
                    this.amendLastCommit();
                }
                state.stopped = null;
            }
        }
        return this.runRebase();
    }

    /** `git rebase --skip`. */
    public skipRebaseStep(): { lines: string[]; status: "done" | "stopped" | "conflict" | "error" } {
        const state = this.rebaseState;
        if (!state) return { lines: ["fatal: No rebase in progress?"], status: "error" };
        const headTree = this.getHeadTree();
        for (const path of new Set([
            ...Object.keys(this.index),
            ...Object.keys(headTree),
            ...Object.keys(this.unmerged),
        ])) {
            if (this.index[path] !== headTree[path] || path in this.unmerged) {
                this.unstagePath(path);
                this.restoreWorkingPath(path, headTree);
            }
        }
        this.unmerged = {};
        if (state.stopped) state.done.push(state.stopped.todo);
        state.stopped = null;
        delete this.specialRefs.REBASE_HEAD;
        return this.runRebase();
    }

    /** `git rebase --quit`: forget the rebase, leaving HEAD and the files where they are. */
    public quitRebase(): void {
        const state = this.rebaseState;
        if (!state) return;
        this.rebaseState = null;
        delete this.specialRefs.REBASE_HEAD;
        if (state.autostash) this.stash.unshift(state.autostash);
        this.syncGitDirectory();
    }

    /** `git rebase --abort`. Returns what Git prints (only about the autostash, if any). */
    public abortRebase(): string[] {
        const state = this.rebaseState;
        if (!state) return [];
        this.unmerged = {};
        const target = state.origHead;
        const work = this.readWorkingTree();
        const targetTree = this.objects[target]!.tree;
        for (const path of new Set([...Object.keys(this.index), ...Object.keys(targetTree)])) {
            if (path in targetTree) this.writeWorkingFile(path, targetTree[path]!);
            else if (path in work) this.deleteWorkingFile(path);
        }
        this.index = { ...targetTree };
        const oldId = this.getHeadCommitId();
        if (state.branch) {
            this.head = { kind: "branch", name: state.branch };
            this.logRef("HEAD", oldId, target, `rebase (abort): returning to refs/heads/${state.branch}`);
        } else {
            this.head = { kind: "detached", id: target };
            this.logRef("HEAD", oldId, target, "rebase (abort): returning to " + target);
        }
        this.rebaseState = null;
        delete this.specialRefs.REBASE_HEAD;
        this.syncGitDirectory();
        return state.autostash ? this.applyAutostash(state.autostash) : [];
    }

    private finishRebase(): string[] {
        const state = this.rebaseState!;
        const newTip = this.getHeadCommitId()!;
        this.rebaseState = null;
        const autostash = state.autostash ? this.applyAutostash(state.autostash) : [];
        if (state.branch) {
            const oldTip = this.branches[state.branch] ?? null;
            this.branches[state.branch] = newTip;
            this.logRef(
                `refs/heads/${state.branch}`,
                oldTip,
                newTip,
                `rebase (finish): refs/heads/${state.branch} onto ${state.onto}`,
            );
            this.head = { kind: "branch", name: state.branch };
            this.logRef("HEAD", newTip, newTip, `rebase (finish): returning to refs/heads/${state.branch}`);
            this.syncGitDirectory();
            return [...autostash, `Successfully rebased and updated refs/heads/${state.branch}.`];
        }
        this.syncGitDirectory();
        return [...autostash, "Successfully rebased and updated detached HEAD."];
    }

    /** Begin a rebase that is already stopped on a conflict (level setup). */
    public beginRebaseConflict(params: { onto: string; ontoLabel: string; commits: string[] }): void {
        this.startRebase({ ...params, interactive: false });
        this.runRebase();
    }

    // ---------------------------------------------------------------------------------------- conflict output

    /** The CONFLICT lines Git prints for one conflicting path. */
    /** What merge-ort prints path by path: "Auto-merging x" and the CONFLICT line(s), in path order. */
    public mergeReport(autoMerged: string[], conflicts: ConflictReport[]): string[] {
        const lines: string[] = [];
        const byPath = new Map(conflicts.map(c => [c.path, c]));
        for (const path of [...new Set([...autoMerged, ...byPath.keys()])].sort()) {
            const conflict = byPath.get(path);
            if (conflict?.type === "add/add") {
                lines.push(...this.conflictLines(conflict));
                continue;
            }
            if (autoMerged.includes(path)) lines.push(`Auto-merging ${path}`);
            if (conflict) lines.push(...this.conflictLines(conflict));
        }
        return lines;
    }

    public conflictLines(report: ConflictReport): string[] {
        if (report.type === "modify/delete") {
            const other = report.modifiedIn ?? (report.deletedIn === "HEAD" ? "the other side" : "HEAD");
            return [
                `CONFLICT (modify/delete): ${report.path} deleted in ${report.deletedIn} and modified in ${other}.  Version ${other} of ${report.path} left in tree.`,
            ];
        }
        if (report.type === "add/add") {
            return [`Auto-merging ${report.path}`, `CONFLICT (add/add): Merge conflict in ${report.path}`];
        }
        return [`CONFLICT (content): Merge conflict in ${report.path}`];
    }

    // =================================================================================================
    // Stash
    // =================================================================================================

    /**
     * `git stash push`: save tracked changes (index and working tree; untracked files too with -u)
     * and return the working tree to HEAD. Returns false if there was nothing to save.
     */
    public stashSave(
        message?: string,
        options: { includeUntracked?: boolean; keepIndex?: boolean; paths?: string[]; autostash?: boolean } = {},
    ): boolean {
        if (!this.initialized) return false;
        const headId = this.getHeadCommitId();
        if (!headId) return false;
        const headTree = this.getHeadTree();
        const work = this.readWorkingTree();
        const inScope = (p: string) =>
            !options.paths || options.paths.some(s => p === s || p.startsWith(s.replace(/\/$/, "") + "/"));

        const entries = this.statusEntries().filter(e => inScope(e.path));
        const trackedChanges = entries.filter(e => e.worktree !== "?");
        const untracked = options.includeUntracked ? entries.filter(e => e.worktree === "?").map(e => e.path) : [];
        if (trackedChanges.length === 0 && untracked.length === 0) return false;

        const stashIndex: Tree = { ...headTree };
        const stashWork: Tree = { ...headTree };
        for (const entry of trackedChanges) {
            const p = entry.path;
            if (p in this.index) stashIndex[p] = this.index[p]!;
            else delete stashIndex[p];
            if (p in work) stashWork[p] = work[p]!;
            else delete stashWork[p];
        }
        const untrackedTree: Tree = {};
        for (const p of untracked) untrackedTree[p] = work[p]!;

        const changes: Record<string, string> = {};
        for (const entry of trackedChanges) changes[entry.path] = work[entry.path] ?? "";
        for (const p of untracked) changes[p] = work[p]!;

        const branchLabel = this.head.kind === "branch" ? this.head.name : "(no branch)";
        const headCommit = this.objects[headId]!;
        const subject = `${this.abbrev(headId)} ${headCommit.message.split("\n")[0]}`;
        const stashMessage = message ? `On ${branchLabel}: ${message}` : `WIP on ${branchLabel}: ${subject}`;

        this.stash.unshift({
            message: stashMessage,
            timestamp: new Date(),
            base: headId,
            index: stashIndex,
            worktree: stashWork,
            untracked: untrackedTree,
            changes,
        });

        // Untracked files go first: a path deleted in the index can be untracked and tracked in HEAD.
        for (const p of untracked) this.deleteWorkingFile(p);
        // Return the stashed paths to HEAD (with --keep-index: to what is staged).
        for (const entry of trackedChanges) {
            const p = entry.path;
            if (options.keepIndex) {
                if (p in this.index) this.writeWorkingFile(p, this.index[p]!);
                else if (p in work) this.deleteWorkingFile(p);
            } else {
                this.unstagePath(p);
                this.restoreWorkingPath(p, headTree);
            }
        }
        // A full `git stash` runs `git reset --hard`: HEAD's reflog says so, and it ends a merge or
        // cherry-pick in progress. (rebase --autostash resets internally and does neither.)
        if (!options.paths && !options.autostash) {
            this.logRef("HEAD", headId, headId, "reset: moving to HEAD");
            this.removeBranchState();
        }
        return true;
    }

    /** Take the newest stash entry out of the list (rebase --autostash keeps it to itself). */
    public takeStash(): StashEntry | null {
        return this.stash.shift() ?? null;
    }

    /** Re-apply an autostash: "Applied autostash." or, if it does not apply cleanly, keep it stashed. */
    public applyAutostash(entry: StashEntry): string[] {
        this.stash.unshift(entry);
        const applied = this.applyStash(0);
        if (applied.ok && applied.conflicts.length === 0 && applied.untrackedErrors.length === 0) {
            this.stash.shift();
            return ["Applied autostash."];
        }
        if (applied.ok) this.unmerged = {};
        return [
            "Applying autostash resulted in conflicts.",
            "Your changes are safe in the stash.",
            'You can run "git stash pop" or "git stash drop" at any time.',
        ];
    }

    /** Stash entries, newest first (stash@{0} first). */
    public getStashEntries(): StashEntry[] {
        return this.stash.map(entry => ({ ...entry }));
    }

    /** Legacy accessor. */
    public getStash(): Array<{ message: string; timestamp: Date }> {
        return this.stash.map(s => ({ message: s.message, timestamp: s.timestamp }));
    }

    public dropStash(n = 0): StashEntry | null {
        const [removed] = this.stash.splice(n, 1);
        return removed ?? null;
    }

    public clearStash(): void {
        this.stash = [];
    }

    /**
     * Apply stash@{n} on top of the current working tree (three-way, so it also works on another
     * branch). Restores the index too with `restoreIndex` (--index).
     */
    public applyStash(
        n = 0,
        options: { restoreIndex?: boolean } = {},
    ):
        | {
              ok: true;
              conflicts: ConflictReport[];
              autoMerged: string[];
              /** The stash had no tracked changes: merge-ort says "Already up to date." */
              upToDate: boolean;
              /** Untracked files that could not be restored (Git restores the others and fails). */
              untrackedErrors: string[];
          }
        | { ok: false; error: string[] } {
        const entry = this.stash[n];
        if (!entry)
            return {
                ok: false,
                error: [n === 0 ? "No stash entries found." : `error: stash@{${n}} is not a valid reference`],
            };

        const baseTree = this.objects[entry.base]!.tree;
        // Git merges the stash into the current index: staged changes are part of "ours".
        const oursTree: Tree = { ...this.index };
        const work = this.readWorkingTree();
        const result = this.mergeTrees(baseTree, oursTree, entry.worktree, {
            ours: "Updated upstream",
            theirs: "Stashed changes",
        });

        // Refuse to overwrite unstaged changes or untracked files the stash would write.
        const resultTree = this.resultWithConflicts(result);
        const blocked = this.changedPaths(oursTree, resultTree).filter(
            p => p in oursTree && p in work && work[p] !== oursTree[p] && work[p] !== resultTree[p],
        );
        if (blocked.length > 0) return { ok: false, error: this.blockedError(blocked, "merge") };
        const addedPaths = this.untrackedPathsBlocking(oursTree, resultTree);
        if (addedPaths.length > 0) return { ok: false, error: this.blockedError(addedPaths, "merge", true) };

        const addedInStash = Object.keys(entry.index).filter(p => !(p in baseTree));

        for (const path of this.changedPaths(oursTree, result.tree)) {
            if (path in result.tree) this.writeWorkingFile(path, result.tree[path]!);
            else if (path in work) this.deleteWorkingFile(path);
        }
        for (const conflict of result.conflicts) {
            this.unmerged[conflict.path] = conflict.entry;
            if (conflict.worktree !== undefined) this.writeWorkingFile(conflict.path, conflict.worktree);
        }

        if (options.restoreIndex) {
            for (const path of this.changedPaths(baseTree, entry.index)) {
                if (path in entry.index) this.index[path] = entry.index[path]!;
                else delete this.index[path];
            }
        } else {
            // Files the stash had added come back added; everything else comes back unstaged.
            for (const path of addedInStash) {
                if (path in result.tree && !(path in this.unmerged)) this.index[path] = result.tree[path]!;
            }
        }
        // Untracked files come back last; one that exists again is left alone and makes the apply fail.
        const untrackedErrors: string[] = [];
        const workNow = this.readWorkingTree();
        for (const [path, content] of Object.entries(entry.untracked)) {
            if (path in workNow) untrackedErrors.push(`${path} already exists, no checkout`);
            else this.writeWorkingFile(path, content);
        }
        if (untrackedErrors.length > 0) untrackedErrors.push("error: could not restore untracked files from stash");

        return {
            ok: true,
            conflicts: result.conflicts.map(c => c.report),
            autoMerged: result.autoMerged,
            upToDate: this.changedPaths(baseTree, entry.worktree).length === 0,
            untrackedErrors,
        };
    }

    /** Legacy stash apply/pop of the newest entry. */
    public stashApply(pop = false): { success: boolean; files: string[] } {
        const entry = this.stash[0];
        if (!this.initialized || !entry) return { success: false, files: [] };
        const result = this.applyStash(0);
        if (!result.ok) return { success: false, files: [] };
        if (pop && result.conflicts.length === 0) this.stash.shift();
        return { success: true, files: Object.keys(entry.changes) };
    }

    // =================================================================================================
    // Tags
    // =================================================================================================

    public createTag(
        tagName: string,
        commitHash?: string,
        options: { message?: string; force?: boolean } = {},
    ): { success: boolean; message: string; commitHash?: string } {
        if (!this.initialized) return { success: false, message: "fatal: not a git repository" };
        if (this.tags.has(tagName) && !options.force) {
            return { success: false, message: `fatal: tag '${tagName}' already exists` };
        }
        if (GitRepository.branchNameProblem(tagName) !== null) {
            return { success: false, message: `fatal: '${tagName}' is not a valid tag name.` };
        }
        const target = commitHash ? this.resolveCommit(commitHash) : this.getHeadCommitId();
        if (!target) {
            return {
                success: false,
                message: commitHash
                    ? `fatal: Failed to resolve '${commitHash}' as a valid ref.`
                    : "fatal: Failed to resolve 'HEAD' as a valid ref.",
            };
        }
        this.tags.set(tagName, {
            target,
            annotation:
                options.message !== undefined
                    ? { message: options.message, tagger: `${this.user.name} <${this.user.email}>`, date: new Date() }
                    : undefined,
        });
        this.syncGitDirectory();
        return { success: true, message: `Created tag '${tagName}'`, commitHash: target };
    }

    public deleteTag(tagName: string): { success: boolean; message: string } {
        const tag = this.tags.get(tagName);
        if (!tag) return { success: false, message: `error: tag '${tagName}' not found.` };
        this.tags.delete(tagName);
        this.syncGitDirectory();
        return { success: true, message: `Deleted tag '${tagName}' (was ${tag.target.substring(0, 7)})` };
    }

    /** tag name → commit id. */
    public getTags(): Map<string, string> {
        return new Map([...this.tags].map(([name, tag]) => [name, tag.target]));
    }

    public getTagObject(name: string): TagObject | undefined {
        return this.tags.get(name);
    }

    public getTagsList(): string[] {
        return [...this.tags.keys()].sort();
    }

    public hasTag(tagName: string): boolean {
        return this.tags.has(tagName);
    }

    // =================================================================================================
    // Remotes
    // =================================================================================================

    public addRemote(name: string, url: string): boolean {
        if (!this.initialized || this.remotes[name] || !name) return false;
        this.remotes[name] = url;
        this.remoteServers[name] ??= { branches: {}, tags: {} };
        return true;
    }

    public removeRemote(name: string): boolean {
        if (!this.initialized || !this.remotes[name]) return false;
        delete this.remotes[name];
        delete this.remoteServers[name];
        for (const ref of Object.keys(this.trackingRefs)) {
            if (ref.startsWith(`${name}/`)) delete this.trackingRefs[ref];
        }
        for (const [branch, upstream] of Object.entries(this.upstreams)) {
            if (upstream.remote === name) delete this.upstreams[branch];
        }
        return true;
    }

    public renameRemote(oldName: string, newName: string): boolean {
        if (!this.remotes[oldName] || this.remotes[newName]) return false;
        this.remotes[newName] = this.remotes[oldName]!;
        this.remoteServers[newName] = this.remoteServers[oldName] ?? { branches: {}, tags: {} };
        delete this.remotes[oldName];
        delete this.remoteServers[oldName];
        for (const [ref, id] of Object.entries(this.trackingRefs)) {
            if (ref.startsWith(`${oldName}/`)) {
                delete this.trackingRefs[ref];
                this.trackingRefs[`${newName}/${ref.substring(oldName.length + 1)}`] = id;
            }
        }
        for (const upstream of Object.values(this.upstreams)) {
            if (upstream.remote === oldName) upstream.remote = newName;
        }
        return true;
    }

    public setRemoteUrl(name: string, url: string): boolean {
        if (!this.remotes[name]) return false;
        this.remotes[name] = url;
        return true;
    }

    public getRemotes(): Record<string, string> {
        return { ...this.remotes };
    }

    /** What the remote repository itself has (branch → commit). */
    public getRemoteBranches(remote: string): Record<string, string> {
        return { ...(this.remoteServers[remote]?.branches ?? {}) };
    }

    public getUpstream(branch: string): { remote: string; branch: string } | null {
        return this.upstreams[branch] ? { ...this.upstreams[branch]! } : null;
    }

    public setUpstream(branch: string, remote: string, remoteBranch: string): void {
        this.upstreams[branch] = { remote, branch: remoteBranch };
    }

    public unsetUpstream(branch: string): boolean {
        if (!this.upstreams[branch]) return false;
        delete this.upstreams[branch];
        return true;
    }

    public hasUpstreamBranch(branch: string): boolean {
        return !!this.upstreams[branch];
    }

    /** Ahead/behind counts of a branch against its upstream's tracking ref. */
    /** A stable id for a tree's content (what Git would call the tree object's id). */
    public static treeId(tree: Tree): string {
        return sha1(JSON.stringify(Object.entries(tree).sort()));
    }

    /** How an upstream is named in revisions and messages: "origin/main", or "main" for a local one. */
    public static upstreamRefName(upstream: { remote: string; branch: string }): string {
        return upstream.remote === "." ? upstream.branch : `${upstream.remote}/${upstream.branch}`;
    }

    public aheadBehind(branch: string): { ahead: number; behind: number; upstream: string; gone: boolean } | null {
        const upstream = this.upstreams[branch];
        if (!upstream) return null;
        // remote "." means a local branch is the upstream (`git branch -u main feature`).
        const isLocal = upstream.remote === ".";
        const name = isLocal ? upstream.branch : `${upstream.remote}/${upstream.branch}`;
        const tracking = isLocal ? this.branches[upstream.branch] : this.trackingRefs[name];
        const local = this.branches[branch];
        if (!tracking || !local) return { ahead: 0, behind: 0, upstream: name, gone: !tracking };
        return {
            ahead: this.revList([local], [tracking]).length,
            behind: this.revList([tracking], [local]).length,
            upstream: name,
            gone: false,
        };
    }

    /**
     * Push a local commit to a remote branch. Rejects non-fast-forward updates unless forced, exactly
     * like a real server.
     */
    public pushRef(
        remote: string,
        localId: string | null,
        remoteBranch: string,
        options: { force?: boolean; forceWithLease?: boolean } = {},
    ):
        | { kind: "up-to-date" }
        | { kind: "new"; to: string; objects: number }
        | { kind: "updated"; from: string; to: string; forced: boolean; objects: number }
        | { kind: "deleted"; from: string }
        | { kind: "rejected"; reason: "fetch first" | "non-fast-forward" | "stale info" }
        | { kind: "error"; lines: string[] } {
        const server = this.remoteServers[remote];
        if (!server) return { kind: "error", lines: [`fatal: '${remote}' does not appear to be a git repository`] };
        const current = server.branches[remoteBranch];

        if (localId === null) {
            if (!current)
                return {
                    kind: "error",
                    lines: [`error: unable to delete '${remoteBranch}': remote ref does not exist`],
                };
            delete server.branches[remoteBranch];
            delete this.trackingRefs[`${remote}/${remoteBranch}`];
            return { kind: "deleted", from: current };
        }

        if (current === localId) {
            this.trackingRefs[`${remote}/${remoteBranch}`] = localId;
            return { kind: "up-to-date" };
        }

        // Only commits the remote does not have yet travel over the wire.
        const objects = this.revList([localId], Object.values(server.branches)).length;
        if (current && !this.isAncestor(current, localId)) {
            const tracking = this.trackingRefs[`${remote}/${remoteBranch}`];
            if (options.forceWithLease && tracking !== current) return { kind: "rejected", reason: "stale info" };
            if (!options.force && !options.forceWithLease) {
                const knowsRemote = !!tracking && this.isAncestor(current, tracking);
                return { kind: "rejected", reason: knowsRemote ? "non-fast-forward" : "fetch first" };
            }
            server.branches[remoteBranch] = localId;
            this.trackingRefs[`${remote}/${remoteBranch}`] = localId;
            return { kind: "updated", from: current, to: localId, forced: true, objects };
        }

        server.branches[remoteBranch] = localId;
        this.trackingRefs[`${remote}/${remoteBranch}`] = localId;
        this.logRef(`refs/remotes/${remote}/${remoteBranch}`, current ?? null, localId, "update by push");
        return current
            ? { kind: "updated", from: current, to: localId, forced: false, objects }
            : { kind: "new", to: localId, objects };
    }

    /** Legacy push: push the current branch's commits to remote/branch. */
    public push(remote: string, branch: string, setUpstream = false): boolean {
        if (!this.initialized) return false;
        if (!this.remotes[remote]) {
            if (remote === "origin" && Object.keys(this.remotes).length === 0)
                this.addRemote(remote, DEFAULT_REMOTE_URL);
            else return false;
        }
        const id = this.branches[branch];
        if (!id) return false;
        const result = this.pushRef(remote, id, branch);
        if (result.kind === "rejected" || result.kind === "error") return false;
        if (setUpstream) this.setUpstream(branch, remote, branch);
        return true;
    }

    public pushTag(remote: string, tag: string, force = false): "new" | "up-to-date" | "rejected" | "missing" {
        const server = this.remoteServers[remote];
        const local = this.tags.get(tag);
        if (!server || !local) return "missing";
        const current = server.tags[tag];
        if (current === local.target) return "up-to-date";
        if (current && !force) return "rejected";
        server.tags[tag] = local.target;
        return "new";
    }

    public deleteRemoteTag(remote: string, tag: string): boolean {
        const server = this.remoteServers[remote];
        if (!server?.tags[tag]) return false;
        delete server.tags[tag];
        return true;
    }

    /** Legacy: push one tag or all tags, returning Git-style lines. */
    public pushTags(remote: string, specificTag?: string): { success: boolean; messages: string[] } {
        if (!this.remotes[remote]) {
            return {
                success: false,
                messages: [
                    `fatal: '${remote}' does not appear to be a git repository`,
                    "fatal: Could not read from remote repository.",
                ],
            };
        }
        const names = specificTag ? [specificTag] : this.getTagsList();
        if (specificTag && !this.tags.has(specificTag)) {
            return {
                success: false,
                messages: [
                    `error: src refspec ${specificTag} does not match any`,
                    `error: failed to push some refs to '${this.remotes[remote]}'`,
                ],
            };
        }
        const lines: string[] = [];
        for (const name of names) {
            const result = this.pushTag(remote, name);
            if (result === "new") lines.push(` * [new tag]         ${name} -> ${name}`);
            if (result === "rejected") lines.push(` ! [rejected]        ${name} -> ${name} (already exists)`);
        }
        if (lines.length === 0) return { success: true, messages: ["Everything up-to-date"] };
        return { success: true, messages: [`To ${this.remotes[remote]}`, ...lines] };
    }

    /**
     * `git fetch <remote>`: copy the remote's branches into remote-tracking refs. Returns one entry per
     * updated ref.
     */
    public fetch(
        remote: string,
        onlyBranch?: string,
    ): { ref: string; from: string | null; to: string; forced: boolean }[] {
        const server = this.remoteServers[remote];
        if (!server) return [];
        const updates: { ref: string; from: string | null; to: string; forced: boolean }[] = [];
        for (const [branch, id] of Object.entries(server.branches)) {
            if (onlyBranch && branch !== onlyBranch) continue;
            const ref = `${remote}/${branch}`;
            const from = this.trackingRefs[ref] ?? null;
            if (from === id) continue;
            this.trackingRefs[ref] = id;
            this.logRef(`refs/remotes/${ref}`, from, id, `fetch: ${from ? "fast-forward" : "storing head"}`);
            updates.push({ ref, from, to: id, forced: !!from && !this.isAncestor(from, id) });
        }
        if (onlyBranch && server.branches[onlyBranch]) this.specialRefs.FETCH_HEAD = server.branches[onlyBranch]!;
        else if (updates[0]) this.specialRefs.FETCH_HEAD = updates[0].to;
        for (const [tag, id] of Object.entries(server.tags)) {
            if (!this.tags.has(tag) && this.objects[id]) this.tags.set(tag, { target: id });
        }
        this.syncGitDirectory();
        return updates;
    }

    /** Forget a remote-tracking branch locally (`git branch -dr origin/x`). */
    public deleteTrackingRef(name: string): boolean {
        if (!(name in this.trackingRefs)) return false;
        delete this.trackingRefs[name];
        return true;
    }

    /**
     * Turn freshly built local history into a clone of `url`: the remote gets every branch, the
     * local branch tracks it, and the reflogs start with the clone, as they do after `git clone`.
     */
    public finishClone(remote: string, url: string): void {
        this.addRemote(remote, url);
        for (const [branch, id] of Object.entries(this.branches)) {
            this.remoteServers[remote]!.branches[branch] = id;
            this.trackingRefs[`${remote}/${branch}`] = id;
            this.upstreams[branch] = { remote, branch };
        }
        const head = this.getHeadCommitId();
        this.reflogs = {};
        if (head) {
            this.logRef("HEAD", null, head, `clone: from ${url}`);
            const branch = this.getBranchName();
            if (branch) this.logRef(`refs/heads/${branch}`, null, head, `clone: from ${url}`);
        }
        this.specialRefs = {};
        this.syncGitDirectory();
    }

    /** Remove tracking refs whose remote branch no longer exists (fetch --prune). */
    public pruneTrackingRefs(remote: string): string[] {
        const server = this.remoteServers[remote];
        const pruned: string[] = [];
        for (const ref of Object.keys(this.trackingRefs)) {
            if (ref.startsWith(`${remote}/`) && !server?.branches[ref.substring(remote.length + 1)]) {
                delete this.trackingRefs[ref];
                pruned.push(ref);
            }
        }
        return pruned;
    }

    /**
     * Teammates' work that exists on the remote but has not been pulled: the remote branch becomes the
     * current local tip plus these commits, as if someone else had pushed them.
     */
    public setRemoteCommits(
        branch: string,
        commits: Array<{ id: string; message: string; files: Record<string, string> }>,
    ): void {
        const remote = Object.keys(this.remotes)[0];
        if (!remote) return;
        const server = this.remoteServers[remote]!;
        const localTip = this.branches[branch] ?? null;
        let parent = server.branches[branch] ?? localTip;
        if (localTip && !server.branches[branch]) {
            // The remote already has everything the level set up locally.
            server.branches[branch] = localTip;
            this.trackingRefs[`${remote}/${branch}`] = localTip;
            this.upstreams[branch] ??= { remote, branch };
        }

        for (const commit of commits) {
            const tree: Tree = parent ? { ...this.objects[parent]!.tree } : {};
            for (const [path, content] of Object.entries(commit.files)) {
                tree[path.replace(/^\//, "")] = content;
            }
            const id = this.writeCommit({
                tree,
                parents: parent ? [parent] : [],
                message: commit.message,
                author: SETUP_AUTHORS[this.setupAuthorCursor++ % SETUP_AUTHORS.length],
            });
            parent = id;
        }
        if (parent) server.branches[branch] = parent;
    }

    /** Commits on the remote branch that the local branch does not have yet (legacy shape). */
    public getRemoteCommits(
        branch: string,
    ): Array<{ id: string; message: string; timestamp: Date; files: string[]; fileContents: Record<string, string> }> {
        const remote = this.upstreams[branch]?.remote ?? Object.keys(this.remotes)[0];
        const remoteTip = remote
            ? this.remoteServers[remote]?.branches[this.upstreams[branch]?.branch ?? branch]
            : undefined;
        if (!remoteTip) return [];
        const local = this.branches[branch];
        return this.revList([remoteTip], local ? [local] : [])
            .reverse()
            .map(id => {
                const c = this.objects[id]!;
                return {
                    id,
                    message: c.message,
                    timestamp: c.timestamp,
                    files: c.files,
                    fileContents: Object.fromEntries(c.files.filter(f => f in c.tree).map(f => [f, c.tree[f]!])),
                };
            });
    }

    public getUnpulledCommitCount(): number {
        const branch = this.getBranchName();
        return branch ? this.getRemoteCommits(branch).length : 0;
    }

    /** Commits on the current branch that its remote counterpart does not have. */
    public getUnpushedCommitCount(): number {
        const branch = this.getBranchName();
        const local = branch ? this.branches[branch] : null;
        if (!branch || !local) return 0;
        const upstream = this.upstreams[branch];
        const remote = upstream?.remote ?? Object.keys(this.remotes)[0];
        if (!remote) return 0;
        const remoteTip = this.remoteServers[remote]?.branches[upstream?.branch ?? branch];
        return this.revList([local], remoteTip ? [remoteTip] : []).length;
    }

    public hasUnpushedCommits(): boolean {
        return this.getUnpushedCommitCount() > 0;
    }

    /** Legacy: does the remote exist and the branch exist locally. */
    public pull(remote: string, branch: string): boolean {
        return this.initialized && !!this.remotes[remote] && branch in this.branches;
    }

    // =================================================================================================
    // Bisect
    // =================================================================================================

    public getBisectState(): BisectState | null {
        return this.bisectState;
    }

    public startBisect(): void {
        const headId = this.getHeadCommitId()!;
        this.bisectState = {
            start: this.getBranchName() ?? headId,
            startBranch: this.getBranchName(),
            good: [],
            bad: null,
            skipped: [],
            log: [],
        };
    }

    public markBisect(kind: "good" | "bad" | "skip", id: string): void {
        const state = this.bisectState;
        if (!state) return;
        if (kind === "bad") state.bad = id;
        else if (kind === "good") state.good.push(id);
        else state.skipped.push(id);
        state.log.push(`git bisect ${kind} ${id}`);
    }

    /** The commits still in question: reachable from bad, not from any good, minus bad itself. */
    public bisectCandidates(): string[] {
        const state = this.bisectState;
        if (!state?.bad) return [];
        return this.revList([state.bad], state.good);
    }

    public endBisect(): void {
        this.bisectState = null;
    }

    // =================================================================================================
    // Editor hand-off (interactive rebase)
    // =================================================================================================

    /** Ask the UI to open a file in the editor and run `followUp` once it is saved. */
    public requestEditor(path: string, followUp: string): void {
        this.editorRequest = { path, followUp };
    }

    /** The pending editor request for this absolute path, consumed. */
    public takeEditorFollowUp(absolutePath: string): string | null {
        if (!this.editorRequest) return null;
        if (this.toFsPath(this.editorRequest.path) !== absolutePath && this.editorRequest.path !== absolutePath)
            return null;
        const followUp = this.editorRequest.followUp;
        this.editorRequest = null;
        return followUp;
    }

    public getEditorRequest(): { path: string; followUp: string } | null {
        return this.editorRequest;
    }

    public clearEditorRequest(): void {
        this.editorRequest = null;
    }
}
