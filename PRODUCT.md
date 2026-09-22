# Product

## Register

brand

## Users

Two audiences, one front door:

- **Git beginners**: students, bootcamp grads, junior devs and designers who have been avoiding Git or only know `add / commit / push` by rote. They arrive nervous that Git is scary and that they will break something.
- **Devs with some mileage**: people who use Git daily but freeze at rebase, reset, reflog, bisect or a merge conflict. They want to close specific gaps fast, without sitting through basics.

Both land on the home page, pick a difficulty, and should be typing their first command within seconds. No account, no install.

## Product Purpose

GitMastery is a browser game that teaches real Git by simulating a repository: players type real commands into a terminal, watch the commit graph react live, and clear structured levels grouped into stages. Points, a shop, a mascot, terminal themes and mini games make it feel like a game rather than a course.

Success for the landing page: a visitor understands in one glance that this is *playing* Git (not reading about it), and starts Level 1 or jumps to their difficulty. Returning players see their progress and continue where they left off.

## Brand Personality

**Playful, cheeky, competent.** Duolingo energy crossed with an arcade cabinet: bold color, character, rewards, a little bit of attitude (the hidden `git gud` command is the voice). Underneath the play, it is technically correct and respects developers; the jokes never come at the cost of accuracy.

Emotional goals: relief ("Git is not scary here"), curiosity ("what happens if I type this?"), and the small hit of reward from clearing a level.

## Anti-references

- **Generic SaaS landing**: purple gradients, glassmorphism cards, three icon-feature tiles, gradient headline text, hero-metric stat rows. The previous version of this page drifted exactly here.
- **Dry tutorial / docs**: grey, text-heavy, Udemy-course or man-page feel.
- Also avoid: kiddy edutainment that talks down to developers, and the green-Matrix hacker cliché.

## Design Principles

1. **Play, don't tell.** Show the terminal and the graph doing things; every claim on the page should be demonstrable in motion.
2. **Git is the art direction.** Branches, commits, merges, HEAD and the terminal are the visual vocabulary, not decoration pulled from generic tech imagery.
3. **Arcade confidence.** Loud where it earns it (hero, stage select, rewards), quiet and legible where people read or decide.
4. **Progress is the reward loop.** A returning player's stats, stage progress and next level are first-class, not an afterthought below the fold.
5. **One door, two speeds.** Beginners and experienced devs both find their start point immediately; difficulty is a choice, not a hurdle.

## Accessibility & Inclusion

- WCAG 2.2 AA: text contrast ≥ 4.5:1 (large ≥ 3:1), visible focus, full keyboard operation of every control including the level grid.
- `prefers-reduced-motion`: no autoplaying background video (poster frame instead), no scroll-scrubbed or parallax effects; crossfades only.
- Color is never the only signal for completed / locked / current state (icons + text accompany it).
- UI is translated into multiple languages (en, de, es, fa [RTL], hi, tr…); layouts must tolerate longer strings and RTL.
