import { execFileSync } from "node:child_process";
import * as nodeFs from "node:fs";
import * as os from "node:os";
import * as nodePath from "node:path";
import { FileSystem } from "~/models/FileSystem";
import { GitRepository } from "~/models/GitRepository";
import { CommandProcessor } from "~/models/CommandProcessor";
import { ProgressManager } from "~/models/ProgressManager";
import { didCommandFail } from "~/models/commandOutcome";

/**
 * Differential testing: play the same random sequence of file edits and Git commands against the
 * simulator and against the real `git` binary, and compare the resulting repository state after
 * every step. Whatever real Git does is, by definition, the right answer.
 */

export type Step =
    | { kind: "write"; path: string; content: string }
    | { kind: "delete"; path: string }
    | { kind: "git"; command: string };

/** Deterministic PRNG (mulberry32), so a failing seed can be replayed. */
export function rng(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const PATHS = ["a.txt", "b.txt", "src/c.txt", "src/d.txt", "docs/e.md"];
const BRANCHES = ["main", "feat", "fix"];
const LINES = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"];

/** A random step. Weighted towards the everyday commands, but covering the advanced ones too. */
export function randomStep(next: () => number, counter: { n: number }): Step {
    const pick = <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)]!;
    const content = () => {
        const count = 1 + Math.floor(next() * 4);
        return Array.from({ length: count }, () => pick(LINES)).join("\n") + (next() < 0.7 ? "\n" : "");
    };
    const roll = next();
    if (roll < 0.22) return { kind: "write", path: pick(PATHS), content: content() };
    if (roll < 0.26) return { kind: "delete", path: pick(PATHS) };

    const branch = pick(BRANCHES);
    const path = pick(PATHS);
    const msg = () => `c${++counter.n}`;
    const commands: (() => string)[] = [
        () => "git add -A",
        () => "git add -A",
        () => `git add ${path}`,
        () => "git add .",
        () => `git commit -m ${msg()}`,
        () => `git commit -m ${msg()}`,
        () => `git commit -am ${msg()}`,
        () => `git commit --amend -m ${msg()}`,
        () => `git branch ${branch}`,
        () => `git switch ${branch}`,
        () => `git switch -c ${branch}`,
        () => `git checkout ${branch}`,
        () => `git checkout -b ${branch}`,
        () => `git merge --no-edit ${branch}`,
        () => `git merge --no-ff --no-edit ${branch}`,
        () => "git merge --abort",
        () => "git reset --soft HEAD~1",
        () => "git reset HEAD~1",
        () => "git reset --hard HEAD~1",
        () => `git reset --hard ${branch}`,
        () => "git reset --hard HEAD@{1}",
        () => `git reset ${path}`,
        () => `git restore ${path}`,
        () => `git restore --staged ${path}`,
        () => `git checkout -- ${path}`,
        () => `git rm ${path}`,
        () => `git rm --cached ${path}`,
        () => `git mv ${path} ${pick(PATHS)}`,
        () => "git stash",
        () => "git stash -u",
        () => "git stash pop",
        () => "git stash apply",
        () => "git stash drop",
        () => `git cherry-pick ${branch}`,
        () => "git cherry-pick --abort",
        () => "git revert --no-edit HEAD",
        () => `git rebase ${branch}`,
        () => "git rebase --continue",
        () => "git rebase --skip",
        () => "git rebase --abort",
        () => "git checkout HEAD~1",
        () => `git tag t${counter.n}`,
        () => `git branch -d ${branch}`,
        () => `git branch -D ${branch}`,
        () => `git branch -m ${branch}`,
        // Less common forms and options.
        () => `git commit ${path} -m ${msg()}`,
        () => `git commit --amend --no-edit`,
        () => `git commit --allow-empty -m ${msg()}`,
        () => "git add -u",
        () => `git rm -r src`,
        () => `git restore --source=HEAD~1 ${path}`,
        () => `git restore -SW ${path}`,
        () => `git checkout ${branch} -- ${path}`,
        () => `git switch --detach ${branch}`,
        () => "git switch -",
        () => "git checkout -",
        () => `git merge --squash ${branch}`,
        () => `git merge --ff-only ${branch}`,
        () => `git reset --merge ${branch}`,
        () => "git reset --keep HEAD~1",
        () => `git reset --mixed ${branch}`,
        () => "git stash pop --index",
        () => "git stash --keep-index",
        () => `git stash push ${path}`,
        () => `git cherry-pick -n ${branch}`,
        () => `git cherry-pick ${branch}~1 ${branch}`,
        () => `git cherry-pick HEAD..${branch}`,
        () => "git cherry-pick --skip",
        () => "git cherry-pick --continue",
        () => "git cherry-pick --quit",
        () => `git revert --no-edit ${branch}`,
        () => "git revert -n HEAD",
        () => "git revert --abort",
        () => "git revert --skip",
        () => `git rebase --onto ${branch} HEAD~1`,
        () => `git rebase --autostash ${branch}`,
        () => "git rebase --quit",
        () => `git branch -f ${branch} HEAD~1`,
    ];
    return { kind: "git", command: pick(commands)() };
}

export class RealGit {
    readonly dir: string;
    constructor() {
        this.dir = nodeFs.mkdtempSync(nodePath.join(os.tmpdir(), "gm-diff-"));
        this.git(["init", "-q", "-b", "main"]);
    }

    git(args: string[]): { ok: boolean; out: string } {
        try {
            const out = execFileSync("git", args, {
                cwd: this.dir,
                encoding: "utf8",
                stdio: ["ignore", "pipe", "pipe"],
                env: {
                    ...process.env,
                    GIT_EDITOR: "true",
                    GIT_AUTHOR_NAME: "You",
                    GIT_AUTHOR_EMAIL: "you@example.com",
                    GIT_COMMITTER_NAME: "You",
                    GIT_COMMITTER_EMAIL: "you@example.com",
                    GIT_CONFIG_NOSYSTEM: "1",
                    HOME: this.dir,
                    GIT_CONFIG_COUNT: "5",
                    GIT_CONFIG_KEY_0: "advice.detachedHead",
                    GIT_CONFIG_VALUE_0: "false",
                    GIT_CONFIG_KEY_1: "commit.gpgsign",
                    GIT_CONFIG_VALUE_1: "false",
                    GIT_CONFIG_KEY_2: "core.autocrlf",
                    GIT_CONFIG_VALUE_2: "false",
                    GIT_CONFIG_KEY_3: "merge.conflictStyle",
                    GIT_CONFIG_VALUE_3: "merge",
                    // The game's terminal behaves like a real one, where ref names decorate log output.
                    GIT_CONFIG_KEY_4: "log.decorate",
                    GIT_CONFIG_VALUE_4: "short",
                },
            });
            return { ok: true, out };
        } catch (error) {
            const e = error as { stdout?: string; stderr?: string };
            return { ok: false, out: `${e.stdout ?? ""}${e.stderr ?? ""}` };
        }
    }

    write(path: string, content: string) {
        const full = nodePath.join(this.dir, path);
        if (nodeFs.existsSync(full) && nodeFs.statSync(full).isDirectory()) return;
        nodeFs.mkdirSync(nodePath.dirname(full), { recursive: true });
        nodeFs.writeFileSync(full, content);
    }

    delete(path: string) {
        nodeFs.rmSync(nodePath.join(this.dir, path), { force: true, recursive: true });
    }

    cleanup() {
        nodeFs.rmSync(this.dir, { recursive: true, force: true });
    }
}

export class SimGit {
    readonly fs = new FileSystem();
    readonly repo = new GitRepository(this.fs);
    readonly cp = new CommandProcessor(this.fs, this.repo, new ProgressManager());
    constructor() {
        this.cp.processCommand("git init");
    }
}

/** The state both implementations are compared on. Commit ids differ, so history is compared by content. */
export type State = {
    head: string; // branch name or "(detached)"
    branches: string[];
    status: string[]; // "XY path", unmerged collapsed to "UU"
    headTree: Record<string, string>;
    worktree: Record<string, string>;
    history: string[]; // sorted subjects reachable from HEAD
    stashCount: number;
    operation: string; // merge / rebase / cherry-pick / revert / none
};

function walk(dir: string, prefix = ""): Record<string, string> {
    const out: Record<string, string> = {};
    for (const name of nodeFs.readdirSync(dir)) {
        if (name === ".git") continue;
        const full = nodePath.join(dir, name);
        const rel = prefix ? `${prefix}/${name}` : name;
        if (nodeFs.statSync(full).isDirectory()) Object.assign(out, walk(full, rel));
        else out[rel] = nodeFs.readFileSync(full, "utf8");
    }
    return out;
}

export function realState(real: RealGit): State {
    const symbolic = real.git(["symbolic-ref", "-q", "--short", "HEAD"]);
    const hasHead = real.git(["rev-parse", "-q", "--verify", "HEAD"]).ok;
    const status = real
        .git(["status", "--porcelain=v1", "-uall", "--no-renames"])
        .out.split("\n")
        .filter(Boolean)
        .map(line => {
            const xy = line.substring(0, 2);
            const path = line.substring(3);
            return /^(DD|AU|UD|UA|DU|AA|UU)$/.test(xy) ? `UU ${path}` : `${xy} ${path}`;
        })
        .sort();
    const headTree: Record<string, string> = {};
    if (hasHead) {
        for (const path of real.git(["ls-tree", "-r", "--name-only", "HEAD"]).out.split("\n").filter(Boolean)) {
            headTree[path] = real.git(["show", `HEAD:${path}`]).out;
        }
    }
    const gitDir = nodePath.join(real.dir, ".git");
    const operation =
        nodeFs.existsSync(nodePath.join(gitDir, "rebase-merge")) ||
        nodeFs.existsSync(nodePath.join(gitDir, "rebase-apply"))
            ? "rebase"
            : nodeFs.existsSync(nodePath.join(gitDir, "MERGE_HEAD"))
              ? "merge"
              : nodeFs.existsSync(nodePath.join(gitDir, "CHERRY_PICK_HEAD"))
                ? "cherry-pick"
                : nodeFs.existsSync(nodePath.join(gitDir, "REVERT_HEAD"))
                  ? "revert"
                  : nodeFs.existsSync(nodePath.join(gitDir, "sequencer"))
                    ? "sequencer"
                    : "none";
    return {
        head: symbolic.ok ? symbolic.out.trim() : hasHead ? "(detached)" : "?",
        branches: real
            .git(["for-each-ref", "--format=%(refname:short)", "refs/heads"])
            .out.split("\n")
            .filter(Boolean)
            .sort(),
        status,
        headTree,
        worktree: walk(real.dir),
        history: hasHead ? real.git(["log", "--format=%s", "HEAD"]).out.split("\n").filter(Boolean).sort() : [],
        stashCount: real.git(["stash", "list"]).out.split("\n").filter(Boolean).length,
        operation,
    };
}

export function simState(sim: SimGit): State {
    const repo = sim.repo;
    const status = repo
        .statusEntries({ includeIgnored: true })
        .map(e =>
            e.index === "U"
                ? `UU ${e.path}`
                : e.worktree === "?"
                  ? `?? ${e.path}`
                  : `${e.index}${e.worktree} ${e.path}`,
        )
        .sort();
    const headId = repo.getHeadCommitId();
    const rebase = repo.getRebaseState();
    const seq = repo.getSequencer();
    return {
        head: repo.getBranchName() ?? (headId ? "(detached)" : "?"),
        branches: repo.getBornBranches().sort(),
        status,
        headTree: repo.getHeadTree(),
        worktree: repo.readWorkingTree(),
        history: headId
            ? repo
                  .revList([headId])
                  .map(id => repo.getCommit(id)!.message.split("\n")[0]!)
                  .sort()
            : [],
        stashCount: repo.getStashEntries().length,
        operation: rebase
            ? "rebase"
            : repo.isMerging()
              ? "merge"
              : seq?.concluded
                ? "sequencer"
                : seq
                  ? seq.kind
                  : "none",
    };
}

/** JSON with object keys sorted, so key order never counts as a difference. */
function stable(value: unknown): string {
    return JSON.stringify(value, (_key, v: unknown) =>
        v && typeof v === "object" && !Array.isArray(v)
            ? Object.fromEntries(Object.entries(v as Record<string, unknown>).sort(([x], [y]) => (x < y ? -1 : 1)))
            : v,
    );
}

export type Divergence = {
    step: number;
    command: string;
    field: string;
    real: unknown;
    sim: unknown;
    realOut: string;
    simOut: string;
};

/** Run one seed; return the first divergence, or null if the two agree throughout. */
export function runSeed(
    seed: number,
    steps: number,
    options: { outputs?: boolean } = {},
): { divergence: Divergence | null; trace: string[] } {
    const next = rng(seed);
    const counter = { n: 0 };
    const real = new RealGit();
    const sim = new SimGit();
    const trace: string[] = [];
    try {
        for (let i = 0; i < steps; i++) {
            const step = randomStep(next, counter);
            let realOut = "";
            let simOut = "";
            let realOk = true;
            let simOk = true;
            if (step.kind === "write") {
                trace.push(`write ${step.path} ${JSON.stringify(step.content)}`);
                // A path whose parent is a file (or that is a directory) cannot be written in either.
                if (sim.fs.getDirectoryContents("/" + step.path) !== null) continue;
                const parentIsFile = step.path
                    .split("/")
                    .slice(0, -1)
                    .some((_, k, parts) => sim.fs.getFileContents("/" + parts.slice(0, k + 1).join("/")) !== null);
                if (parentIsFile) continue;
                real.write(step.path, step.content);
                sim.fs.writeFile("/" + step.path, step.content);
            } else if (step.kind === "delete") {
                trace.push(`delete ${step.path}`);
                real.delete(step.path);
                sim.fs.delete("/" + step.path);
            } else {
                trace.push(step.command);
                const args = step.command.split(" ").slice(1);
                const r = real.git(args);
                realOk = r.ok;
                realOut = r.out;
                const s = sim.cp.processCommand(step.command);
                simOut = s.join("\n");
                simOk = !didCommandFail(s, step.command);
            }

            const a = realState(real);
            const b = simState(sim);
            for (const field of Object.keys(a) as (keyof State)[]) {
                if (stable(a[field]) !== stable(b[field])) {
                    return {
                        divergence: {
                            step: i,
                            command: trace[trace.length - 1]!,
                            field,
                            real: a[field],
                            sim: b[field],
                            realOut,
                            simOut,
                        },
                        trace,
                    };
                }
            }
            // Git exits non-zero on a merge conflict; the game counts a conflict as a state to work
            // in, not as a failed command, so conflicts are only compared through the state.
            const conflicted = /^CONFLICT \(/m.test(realOut) && !/^error: could not apply/m.test(realOut);
            if (step.kind === "git" && realOk !== simOk && !conflicted) {
                return {
                    divergence: {
                        step: i,
                        command: step.command,
                        field: "success",
                        real: realOk,
                        sim: simOk,
                        realOut,
                        simOut,
                    },
                    trace,
                };
            }
            if (options.outputs && step.kind === "git") {
                for (const observer of OBSERVERS) {
                    const r = real.git(observer.split(" ").slice(1));
                    const simLines = sim.cp.processCommand(observer);
                    const realText = normaliseOutput(r.out);
                    const simText = normaliseOutput(simLines.length > 0 ? simLines.join("\n") + "\n" : "");
                    if (realText !== simText) {
                        return {
                            divergence: {
                                step: i,
                                command: step.command,
                                field: `output of ${observer}`,
                                real: realText,
                                sim: simText,
                                realOut,
                                simOut,
                            },
                            trace,
                        };
                    }
                }
            }
        }
        return { divergence: null, trace };
    } finally {
        real.cleanup();
    }
}

/** Read-only commands whose output is compared after every step in output mode. */
const OBSERVERS = [
    "git status",
    "git status -s",
    "git branch -vv",
    "git log --oneline",
    "git diff",
    "git diff --staged",
    "git stash list",
    "git show --stat --format=%s",
];

/**
 * Commit ids differ between the two (different object formats and dates), so ids are replaced by
 * H1, H2… in order of appearance; dates are masked.
 */
export function normaliseOutput(text: string): string {
    const ids = new Map<string, string>();
    return (
        text
            .replace(/\b[0-9a-f]{7,40}\b/g, id => {
                const key = id.substring(0, 7);
                if (!ids.has(key)) ids.set(key, `H${ids.size + 1}`);
                return ids.get(key)!;
            })
            .replace(/^(\s*Date:).*$/gm, "$1 <date>")
            // The game adds teaching hints where Git stays silent; those are not compared.
            .replace(/^hint: .*\n?/gm, "")
            .replace(/[ \t]+$/gm, "")
    );
}
