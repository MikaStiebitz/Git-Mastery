# Beginner Course Playthrough — Findings

**Method:** Played the entire Beginner difficulty (Intro → Files → Working with Branches → Remote
Repositories, 18 levels total) as a total-beginner persona would: read only the story/task text and
hints shown in the UI, typed the commands it suggested, and used "Show Hints" whenever the task
wasn't self-explanatory. English UI, fresh `localStorage`. Every finding below was reproduced live
in the browser and, where relevant, traced to the exact line of source causing it.

Severity key: 🔴 blocking/incorrect result reaches the player · 🟠 confusing or teaches wrong
mental model · 🟡 cosmetic/minor.

---

## 🔴 1. Level completion checks the *command you typed*, not the *result it produced*

This is the root cause behind most of "commands count as done even though they're wrong." Level
progress is decided by `LevelManager.checkLevelCompletion()` in `src/models/LevelManager.ts`
(~line 618 onward): it pattern-matches the typed command name and flags against
`requirement.command` / `requirement.alternativeCommands` / `requirement.requiresArgs`. It never
re-checks the actual repository state (does the branch exist? did the remote get added? does the
diff show the right file?) after running the command. Two concrete, reproduced consequences:

### 1a. `git branch -c <name>` completes "create a branch" while creating *nothing*
- **Level:** Branches → Level 5, "Create Branch with Switch" (`src/levels/stages/branches.ts`
  line 179-181, `alternativeCommands: ["git checkout", "git branch"]` with `requiresArgs: ["-c"]`).
- **Repro:** typed `git branch -c anothertest`. Terminal output was `* main` (the plain branch
  *list*, i.e. nothing happened) — yet "Level completed! 🎉" fired immediately, and `git branch`
  afterwards still shows only `main`.
- **Why:** `CommandParser.ts` has one global list of "always boolean" single-letter flags —
  `booleanSingleFlags = ["u", "f", "a"]` (line 164). Every other single-letter flag, including
  `-c`, is treated as "takes the next word as its value" (line 189-191), so `anothertest` is
  consumed into `flags.c` and never reaches `positionalArgs`. `BranchCommand.parseBranchArgs()`'s
  delete path (`-d`/`-D`) explicitly re-reads `args.flags.d` / `args.flags.D` as a fallback (lines
  84-87) to work around exactly this — but the **create** path (line 123-131) only reads
  `positionalArgs`, so it silently falls through to the default "list" action instead of creating
  anything or erroring.
- **Compounding factual error:** even if this were fixed to actually create a branch, `git branch
  -c` does not mean "create and switch" in real Git — it means **copy** an existing branch (`git
  branch -c <newname>` copies the current branch, `git branch -c <old> <new>` copies a specific
  one), and it does not switch to it. Listing `git branch` as an "equivalent" to `git switch -c` /
  `git checkout -b` for this objective teaches an incorrect command mapping regardless of the
  parser bug. Recommend removing `"git branch"` from this objective's `alternativeCommands`
  entirely rather than patching the parser gap.

### 1b. `git clone <repository-url>` (the literal placeholder from the story) is accepted
- **Level:** Intro → Level 3, "Cloning Repositories". The story shows `git clone
  <repository-url>` in a code-styled box; nothing tells a beginner this is a placeholder to
  replace, and the hint says "The repository URL can be any valid Git repository URL."
- **Repro:** typed the story text verbatim, including the angle brackets. It succeeded, printing a
  full fake `Cloning into 'repository'...` / `Receiving objects...` transcript and cloning into a
  folder literally named `repository`.
- **Why:** `CloneCommand.ts` line 39-41 only rejects a *missing* argument; any non-empty string
  is accepted as the "URL". Its filename-extraction regex (`/\/([^/]+?)(\.git)?$/`, line 32) finds
  no `/` in `<repository-url>`, so it falls back to the generic name `"repository"` — which is
  exactly the folder name I saw, confirming the placeholder was taken literally.
- **Real Git**, given that exact input, would fail with `fatal: repository '<repository-url>' does
  not exist`. A beginner who later tries this on a real machine will be confused why it worked
  here and not there.

### 1c. `git diff` shown after Intro Level 4 does not diff the file the story is about
- **Level:** Intro → Level 4, "Inspecting Changes" — story: "Sarah changed something in
  `src/config.js`... use `git diff`."
- **Repro:** `git status` correctly reported `modified: src/config.js`. Immediately after, `git
  diff` printed a diff block for `repository/.gitignore` (see finding #2 for why that file exists
  at all) and **never showed `src/config.js`**. Real `git diff` never shows untracked files at all
  (`repository/.gitignore` was untracked per the same `git status` output) — it should show
  tracked-but-unstaged changes, i.e. exactly `src/config.js`, which never appeared.
- Both objectives ("find modified files" / "inspect the diff") were still marked complete, again
  because completion is keyed on "did you type `git status`" / "did you type `git diff`", not on
  whether the diff you were shown was the right one.

**Suggested fix direction for all three:** for objectives that are about *state* ("a branch named
X exists", "the diff for file Y was shown", "commit is on remote"), verify that state via
`gitRepository` getters after the command runs, in addition to (or instead of) matching the typed
command string. The command-string match is a reasonable *fast path* but shouldn't be the only
gate when a wrong or vacuous result is easy to distinguish from a correct one.

---

## 🔴 2. Filesystem *and* Git state leak between levels (and between stages)

- **Repro:** Intro Level 3 clones into `repository/`. From Intro Level 4 onward — through the
  *entire rest of the playthrough*, including after moving into the Files and Branches stages —
  `git status` / the file tree kept listing `repository/README.md`, `repository/src/main.js`,
  `repository/.gitignore` as untracked files that have nothing to do with the current level.
  `git add .` on Files Level 1 reported "Added 7 files" where the level's own content only
  accounts for a couple.
- **Worse, it isn't just cosmetic:** Remote Level 1 ("Adding Remotes") asks the player to "Add a
  remote named 'origin'." Doing exactly that — `git remote add origin <url>` — fails with `error:
  remote 'origin' already exists`. Confirmed via `git remote -v` that an `origin` remote pointing
  at `https://github.com/user/repo.git` already existed before I typed anything. This is **not**
  state leakage this time, but a distinct, unconditional bug: `LevelManager.setupGitState()`
  (`src/models/LevelManager.ts` lines 96-100) *always* auto-adds an `origin` remote whenever
  `gitState.initialized` is true and no remote exists yet:
  ```ts
  const remotes = gitRepository.getRemotes();
  if (Object.keys(remotes).length === 0) {
      gitRepository.addRemote("origin", "https://github.com/user/repo.git");
  }
  ```
  This runs for **every** initialized level, including one whose entire task is "add a remote
  named origin" — so the correct command is guaranteed to fail with "already exists" for every
  single player, every time. The only way through is to name the remote something else (e.g.
  `upstream`), which directly contradicts the level's own hint ("The convention is to name your
  main remote 'origin'"). A total beginner following the instructions exactly gets stuck here with
  no in-game explanation of why "the thing you told me to do" doesn't work.
- **Root cause of the file-system leak:** `setupLevel()` does call `gitRepository.reset()` (line
  61), which clears git-level state — but I never got a repository with a *clean git state and no
  leftover files* after the clone in practice, suggesting the `FileSystem` instance isn't being
  reset the same way `GitRepository` is (or a persisted `fileSystem` object across levels retains
  directories created by `clone`). Worth auditing `setupLevel`'s handling of `fileSystem` for a
  parallel `.reset()`/re-instantiation the way `gitRepository.reset()` works.

**Fix priority:** high. #2's remote-collision is a guaranteed, 100%-reproducible dead end on the
very level whose entire point is "learn to add a remote."

---

## 🔴 3. Real users don't follow the story verbatim — typos and free-form input get no feedback at all

Everything above was found typing *exactly* what the story/hints suggested. A real beginner also
types their own branch names, their own commit messages, and makes typos — and the simulator's
error handling for that path is currently much weaker than its happy path. Three concrete,
code-confirmed gaps, directly matching the report that triggered this playthrough
("git commit „test" oder so", "Befehle zählen manchmal als erledigt obwohl sie falsch sind"):

### 3a. `git commit "test"` (a quoted message with no `-m`) does *nothing* — no error, no dialog, no commit
- **Repro (traced in code, matches the exact example given):** the terminal's special-case check
  for opening the commit-message dialog is an **exact string comparison**:
  ```ts
  // src/contexts/GameContext.tsx, line 294
  if (command.trim() === "git commit") {
  ```
  Typing anything other than the bare literal `git commit` — `git commit "test"`, `git commit
  test`, `git commit -m` with nothing after it that survives trimming, etc. — skips this branch
  entirely and falls through to the generic command path (line ~308: `commandProcessor
  .processCommand(command)`).
- That generic path calls straight into `CommitCommand.execute()` (`src/commands/git/
  CommitCommand.ts`, lines 44-52), which only ever reads `args.flags.m` / `args.flags.message` for
  the commit message — it never looks at `positionalArgs` at all. Since neither flag is set,
  `message` stays `""`, `messageFlagProvided` is `false`, so none of the early-return branches
  fire and execution reaches the final line:
  ```ts
  // src/commands/git/CommitCommand.ts, line ~80
  return [];
  ```
- **Result:** the player presses Enter, and literally nothing happens — no new terminal line, no
  error, no dialog, no commit, no hint that `-m` was required. Real Git, given the same input,
  would print `error: pathspec 'test' did not match any files` (since a bare argument to `git
  commit` is treated as a pathspec). Either behavior (real Git's error, or opening the message
  dialog anyway with "test" pre-filled) would be a fix; silence is the one option that teaches
  nothing and looks broken.

### 3b. Mistyped git subcommands give a flat, unhelpful error with no correction or hint pointer
- **Repro:** typed `git stauts`, `git swithc main`, `git comit -m "x"`. All three returned exactly:
  `Command not found: git stauts` (`src/commands/base/CommandRegistry.ts` line 37) — the raw
  string the user typed, no correction, no "did you mean", and no pointer to the level's hints
  panel even though the hints panel exists and is used elsewhere in the app for exactly this
  purpose.
- **This is inconsistent within the codebase itself**, not just against real Git: `SwitchCommand.ts`
  (lines 68-80) already implements a good pattern for a related situation — switching to a
  non-existent branch prints `fatal: invalid reference: <name>` *plus* a fuzzy "Did you mean one of
  these?" list of existing branches, or a suggestion to use `-c` if it looks like the player meant
  to create one. `CommandRegistry.execute()`'s top-level "command not found" path has no equivalent
  — it should at minimum Levenshtein-match the typo against the registry's known command names
  (`git status`, `git switch`, `git commit`, …) the same way `SwitchCommand` already matches
  against known branch names, and ideally suggest "Type `hint` / open the Hints panel" when nothing
  matches closely.
- A real beginner's most common mistake is exactly this class of typo (wrong verb, wrong flag
  case, autocorrect-mangled branch name) — right now the simulator's response to all of them is
  the least informative message in the whole app.

### 3c. Custom branch/file names that don't match the level's expected value fail silently against progress, not against Git
- Because level completion is keyed on the **command typed**, not on **state achieved** (see
  finding #1), a player who invents their own branch name (e.g. `git switch -c my-fix` instead of
  the story's `feature/login`) gets a perfectly valid, perfectly real Git result — the branch is
  created and switched to — but the objective can silently stay incomplete with no explanation of
  *why*, since nothing in the UI states "the objective expects a specific name." This isn't a
  crash or a wrong Git result; it's a dead end for the "explores instead of copy-pasting" beginner
  the user described, and it compounds finding #1's architecture problem: the same
  command-string-matching that lets a *wrong* command pass can also fail a *correct* command that
  simply used different, still-valid values. Recommend either (a) objectives that only need to
  check for "any branch created" doing exactly that (as Files/Branches Level 2 already does
  correctly in some cases), or (b) an inline note under the task text whenever an objective
  requires an exact name/value, e.g. "must be named exactly `feature/login`."

**Fix priority:** high, and arguably the most user-impacting group here — findings #1-2 need a
level author or a curious player to trigger; these three are hit by completely ordinary use of the
terminal (typing your own commit message, making a typo, naming your own branch), which is exactly
the scenario the person testing this course ran into first.

---

## 🟠 4. Git itself is never actually explained

Level 1 ("Initialize Git") opens with: *"We use Git for our version control - it helps us track
changes in code and work together as a team."* — one sentence — then immediately gives the exact
command to type (`git init`). There is no:
- explanation of what a "repository" *is* before asking the player to create one,
- concrete before/after scenario (e.g. "imagine you and a teammate are editing the same file and
  emailing zip files back and forth — here's what goes wrong, here's what Git does instead"),
- mention that this is a *simulated* Git running in the browser vs. the real CLI they'll use later
  (the note "This is a simplified Git simulation for learning purposes" only appears as a small
  terminal boot message, easy to miss, not in the story/onboarding).

A true beginner (the persona I played as) is told *what to type* well before *why*. Recommend a
short "Level 0" / intro screen before Level 1 that explains version control conceptually (with a
concrete example of the problem it solves) before the first command is introduced. The existing
per-level "Real-World Context" boxes are good and should be the model — the course is just missing
one for the concept of Git itself.

---

## 🟠 5. Placeholder syntax in story text reads as a literal, copyable command

Both Intro Level 3 (`git clone <repository-url>`) and Remote Level 1 (mentions "origin" without
ever showing `git remote add origin <url>` with an obviously-fake example URL) show angle-bracket
placeholders in the same green code-styled box used elsewhere for exact, correct commands. Nothing
visually distinguishes "type this exactly" from "replace this part." Compare with Remote Level 2's
task text, which does this well: `git push origin main` is shown as a literal, complete, correct
command with no placeholder — that level had zero ambiguity. Recommend either using a distinct
placeholder style (e.g. italic, or `‹url›` with a leading comment "replace with any URL") or, for
the simulator specifically, always giving a concrete example URL in the task text the way the
hints already do ("The repository URL can be any valid Git repository URL" is good — put a real
example next to it: `git clone https://github.com/example/demo.git`).

---

## 🟡 6. Objectives that don't correspond to a distinct action

Remote Level 2 ("Pushing Commits to Remote") lists two objectives: "Push your local commits to the
remote repository" and "Understand the difference between local commit and remote push." Both are
satisfied by the same single `git push origin main`. This isn't broken (both got a green
checkmark, the level completed correctly), but a second objective with no independent action reads
as if two things are required when only one command is. Purely cosmetic; consider merging into one
objective or making the second objective genuinely check something (e.g. that the player ran `git
log` first to see local-only commits before pushing).

---

## 🟡 7. Purchased terminal themes (Shop) are aesthetically flat

Bought and applied the two cheaper themes to compare against the default:
- **Matrix Green** (50 coins): the *entire* terminal — background, borders, the branch badge, the
  status LED, file icons, warning icons — turns one flat green. In the redesigned "arcade" visual
  language elsewhere in the app, color has meaning (grape = main, cyan = feature branch, coral =
  danger/fix, lime = success/points). Inside this theme every one of those distinctions disappears
  — a feature-branch badge and a "clean" status indicator render in the identical green. It reads
  as a one-note "hacker movie" cliché rather than a premium purchase.
- **Golden Luxury** (100 coins, "Legendary" rarity — the single most expensive item in the shop):
  same pattern in amber/gold. For the highest-priced item in the store, it looks like a plain
  color-filter over the default UI rather than a distinct, premium treatment.

Both are functionally fine (text stays readable, contrast is acceptable), but for paid cosmetic
items advertised as "Rare" / "Legendary," the actual in-terminal result is less distinctive than
the small preview swatches in the shop dialog suggest — the swatches only show 3 lines of `git
status` output, which hides the monochrome effect on badges/icons that becomes obvious once
applied to the full terminal.

---

## Notes on things that worked well (so the fix effort isn't misdirected)

- Branch deletion — `git branch -d feature/search-filters` and `git branch -D
  experiment/new-ui` (Branches Level 6) — worked perfectly, including with slash-containing branch
  names. The delete path's flag-value fallback (see #1a) is the right pattern; the create path just
  needs the same treatment.
- `git commit` with no `-m` opens a proper commit-message modal (mirroring a real editor), which is
  a nice, realistic touch most learners won't expect from a simulator.
- The Remote stage's level 2 and level 4 story text ("Set It Once, Push Forever" — explaining `-u` /
  upstream tracking) is the clearest writing in the whole course and a good model for the rest.
- Tab-completion suggestion ("Press Tab to complete: git init") is legible and unobtrusive; no
  issue found there in this pass.
- `git push` / `git clone` output (Enumerating objects, Counting objects, delta compression,
  `a1b2c3d..e4f5g6h main -> main`) is a convincingly realistic simulation of real Git CLI output.

---

## Summary table

| # | Finding | Severity | File(s) |
|---|---|---|---|
| 1a | `git branch -c <name>` completes objective, creates nothing | 🔴 | `CommandParser.ts`, `BranchCommand.ts`, `branches.ts` |
| 1b | `git clone <repository-url>` (literal placeholder) silently "succeeds" | 🔴 | `CloneCommand.ts` |
| 1c | `git diff` shows wrong file's diff, objective still completes | 🔴 | `LevelManager.ts` (command-only matching) |
| 2 | Remote Level 1 unwinnable as instructed — `origin` pre-exists | 🔴 | `LevelManager.ts` lines 96-100 |
| 2 | Filesystem state (leftover `repository/` folder) leaks across levels/stages | 🔴 | `LevelManager.setupLevel` / `FileSystem` reset |
| 3a | `git commit "test"` (no `-m`) does nothing — no error, no dialog, no commit | 🔴 | `GameContext.tsx` line 294, `CommitCommand.ts` |
| 3b | Mistyped commands (`git stauts`) get a flat "not found", no fuzzy match/hint pointer | 🔴 | `CommandRegistry.ts` line 37 |
| 3c | Valid but non-story branch/file names can silently fail objectives with no explanation | 🔴 | `LevelManager.checkLevelCompletion` |
| 4 | Git/version-control never conceptually explained before first command | 🟠 | `intro.ts` level 1 story |
| 5 | Placeholder syntax (`<repository-url>`) indistinguishable from real commands | 🟠 | `intro.ts`, story copy generally |
| 6 | Some objectives don't map to an independent action | 🟡 | `remote.ts` level 2 |
| 7 | Paid terminal themes look flat/monochrome once fully applied | 🟡 | `TerminalThemeContext.tsx` |
