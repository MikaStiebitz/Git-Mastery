---
name: GitMastery
description: An arcade cabinet for Git — chunky, pressable, unmistakably a game.
colors:
  gm-void: "oklch(0.16 0.045 287)"
  gm-night: "oklch(0.205 0.06 289)"
  gm-deep: "oklch(0.26 0.08 291)"
  gm-line: "oklch(0.38 0.08 292)"
  gm-grape: "oklch(0.44 0.21 296)"
  gm-grape-hi: "oklch(0.6 0.22 298)"
  gm-grape-edge: "oklch(0.3 0.15 294)"
  gm-lime: "oklch(0.9 0.2 128)"
  gm-lime-edge: "oklch(0.64 0.17 136)"
  gm-coral: "oklch(0.74 0.17 22)"
  gm-coral-edge: "oklch(0.52 0.16 22)"
  gm-cyan: "oklch(0.83 0.13 214)"
  gm-cyan-edge: "oklch(0.58 0.12 220)"
  gm-gold: "oklch(0.86 0.15 86)"
  gm-gold-edge: "oklch(0.62 0.13 70)"
  gm-ink: "oklch(0.97 0.012 292)"
  gm-ink-soft: "oklch(0.85 0.04 292)"
  gm-ink-dim: "oklch(0.72 0.05 292)"
typography:
  display:
    fontFamily: "Bungee, var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Bungee, var(--font-geist-sans), sans-serif"
    fontSize: "clamp(1.8rem, 4.6vw, 3.6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "normal"
  title:
    fontFamily: "Bungee, var(--font-geist-sans), sans-serif"
    fontSize: "clamp(1.3rem, 5.4vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  code:
    fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  chip: "0.5rem"
  control: "0.85rem"
  button: "1rem"
  tile: "1rem"
  panel: "1.4rem"
  cartridge: "1.6rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
  section: "6rem"
  section-lg: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.gm-lime}"
    textColor: "{colors.gm-void}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-secondary:
    backgroundColor: "{colors.gm-grape}"
    textColor: "{colors.gm-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-quiet:
    backgroundColor: "{colors.gm-night}"
    textColor: "{colors.gm-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.75rem"
  level-tile-locked:
    backgroundColor: "{colors.gm-grape-edge}"
    textColor: "{colors.gm-ink-soft}"
    rounded: "{rounded.tile}"
    size: "3.5rem"
  level-tile-open:
    backgroundColor: "{colors.gm-ink}"
    textColor: "{colors.gm-grape-edge}"
    typography: "{typography.title}"
    rounded: "{rounded.tile}"
    size: "3.5rem"
  level-tile-done:
    backgroundColor: "{colors.gm-lime}"
    textColor: "{colors.gm-void}"
    typography: "{typography.title}"
    rounded: "{rounded.tile}"
    size: "3.5rem"
  panel:
    backgroundColor: "{colors.gm-night}"
    textColor: "{colors.gm-ink}"
    rounded: "{rounded.panel}"
    padding: "1.25rem"
  inset:
    backgroundColor: "{colors.gm-void}"
    textColor: "{colors.gm-ink}"
    rounded: "{rounded.button}"
    padding: "1rem"
  field:
    backgroundColor: "{colors.gm-void}"
    textColor: "{colors.gm-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0.625rem 0.875rem"
    height: "2.75rem"
  chip:
    backgroundColor: "{colors.gm-lime}"
    textColor: "{colors.gm-void}"
    rounded: "{rounded.full}"
    padding: "0.125rem 0.625rem"
  terminal:
    backgroundColor: "{colors.gm-night}"
    textColor: "{colors.gm-ink}"
    typography: "{typography.code}"
    rounded: "{rounded.panel}"
    padding: "0.75rem 1rem"
---

# Design System: GitMastery

## 1. Overview

**Creative North Star: "The Git Arcade"**

Git is the game world, and the interface is the cabinet it runs on. Branches are rails, commits are stations, HEAD is the player's token, and a merge is a level cleared. Every visual decision answers to that world: colour carries Git meaning, the display face is signage, and controls are physical buttons that sink when pressed. The surface is a dark violet night (`gm-void`) because the product is played, often in the evening, on a laptop next to an editor — not read like documentation under office light.

Loudness is earned, not sprayed. The hero, the stage select and the reward moments shout in saturated lime and grape; the surfaces people actually read (descriptions, terminal output, feature copy) stay calm and high-contrast. Chroma is carried by accents and typography, never by a gradient wash.

This system explicitly rejects what PRODUCT.md names: **generic SaaS landing** (purple gradients, glassmorphism cards, gradient headline text, three identical icon-feature tiles, hero-metric stat rows), the **dry tutorial/docs look**, kiddy edutainment, and the green-Matrix hacker cliché. The previous version of the home page drifted into the first one; the tokens here exist to make that drift hard to repeat.

**Key Characteristics:**
- Dark violet base, four saturated accents, each with a fixed Git meaning.
- One display face (Bungee) for signage, Geist Sans for reading, Geist Mono for anything Git actually prints.
- Hard, offset, zero-blur shadows. No glass, no soft glow, no gradient fills behind text.
- Controls that visibly depress: a solid colour edge below the face that collapses on `:active`.
- Motion is choreography on the landing page and pure state feedback (150–250ms) inside the app.
  Both always ship a static, complete `prefers-reduced-motion` fallback.
- One vocabulary, two volumes: the landing page shouts, the app is calm. They share tokens,
  component shapes, motion curves and the Git legend; only the density and the size of the
  type change.

**The semantic layer.** `globals.css` maps the shadcn names (`background`, `card`, `primary`,
`muted-foreground`, `border`, `ring`, …) onto the `gm-*` tokens, so the shared primitives are
styled once and every screen inherits them. A screen that colours a `<Button>` or a `<Card>` by
hand is drifting: fix the variant, not the call site. Stacking order is a token scale too
(`--z-sticky` 30 → `--z-dropdown` 40 → `--z-overlay` 50 → `--z-modal` 60 → `--z-toast` 70 →
`--z-tooltip` 80); bare `z-50` or `z-[999]` is prohibited.

## 2. Colors

A dark violet stage with four loud accents, where every accent is a Git role — the palette is a legend, not decoration.

### Primary
- **Arcade Grape** (`oklch(0.44 0.21 296)`, `gm-grape`): the brand colour and the `main` branch. Drenches the entire stage-map section, fills secondary buttons and branch pills. This is the only colour allowed to own a whole section.
- **Grape Glow** (`oklch(0.6 0.22 298)`, `gm-grape-hi`): lifted grape for icons, graph strokes and inline marks on dark surfaces. **Never body text** — it lands at 4.15:1 on `gm-night`, which clears large/graphic use only.
- **Grape Shadow** (`oklch(0.3 0.15 294)`, `gm-grape-edge`): the pressed edge under grape controls, locked-tile fills, and the dot texture on the drenched section.

### Secondary
- **Commit Lime** (`oklch(0.9 0.2 128)`, `gm-lime`): success, completion and every primary call to action. A cleared level, a filled progress lane, the caret in a terminal, the `+50 XP` reward. Lime means *it worked*.
- **Lime Shadow** (`oklch(0.64 0.17 136)`, `gm-lime-edge`): the pressed edge under lime controls.

### Tertiary
- **Feature Cyan** (`oklch(0.83 0.13 214)`, `gm-cyan`): the feature branch in any commit graph, and the global focus ring. Cyan means *a second line of history*.
- **Fix Coral** (`oklch(0.74 0.17 22)`, `gm-coral`): fix branches, destructive or scary Git output, error states.
- **Points Gold** (`oklch(0.86 0.15 86)`, `gm-gold`): score, coins, rewards, the shop — and the one surface where currency is real rather than in-game, the sponsor dialog. Gold is value exchanged and nothing else.
- Each accent has a matching `-edge` token (`gm-cyan-edge`, `gm-coral-edge`, `gm-gold-edge`) for pressed edges and dark-on-light pairings.

### Neutral
- **Void** (`oklch(0.16 0.045 287)`, `gm-void`): the page background, and the ink colour on lime, gold or cyan fills.
- **Night** (`oklch(0.205 0.06 289)`, `gm-night`): panels, terminals, HUD, cartridges — the one raised surface.
- **Deep** (`oklch(0.26 0.08 291)`, `gm-deep`): title bars, inset strips, and the oversized decorative ticker type.
- **Line** (`oklch(0.38 0.08 292)`, `gm-line`): the 2px border on every panel, and its resting shadow.
- **Ink** (`oklch(0.97 0.012 292)`, `gm-ink`): headings and primary text. 17.9:1 on void.
- **Ink Soft** (`oklch(0.85 0.04 292)`, `gm-ink-soft`): body copy. 12.2:1 on void, 5.5:1 on grape — the lowest text colour that is safe on the drenched section.
- **Ink Dim** (`oklch(0.72 0.05 292)`, `gm-ink-dim`): labels, terminal output, metadata. 7.8:1 on void.

### Named Rules

**The Git Legend Rule.** Colour always means the same thing: grape = `main`, cyan = feature branch, coral = fix or danger, lime = commit succeeded, gold = points. A cyan button that isn't about branching, or a lime badge that isn't success, breaks the legend and is forbidden.

**The Grape Floor Rule.** On the grape surface, `gm-ink-dim` is prohibited (3.5:1). Text on grape is `gm-ink` or `gm-ink-soft` — nothing else. `gm-ink-dim` is for void and night only.

**The No Wash Rule.** Gradients never carry brand colour behind or inside text. The only permitted gradients are single-hue scrims over photography or video (`void → transparent`), whose job is contrast, not decoration. `background-clip: text` is banned outright.

## 3. Typography

**Display Font:** Bungee 400 (fallback Geist Sans, system sans) — loaded via `next/font/google` as `--font-bungee`
**Body Font:** Geist Sans (`--font-geist-sans`)
**Label/Mono Font:** Geist Mono (`--font-code`)

**Character:** Bungee is street and transit signage: heavy, upright, all-caps by design. Against Geist's neutral, engineered sans it reads as the marquee above the cabinet with plain instructions printed below — maximum contrast on the axis that matters, and no risk of two similar sans faces fighting. Geist Mono only appears where Git itself would print: commands, hashes, branch names, stage numbers.

### Hierarchy
- **Display** (Bungee 400, `clamp(2.5rem, 6vw, 5.25rem)`, line-height 0.98, tracking 0.01em): the hero headline only, one per page. Positive tracking, never negative — Bungee's counters close up when squeezed.
- **Headline** (Bungee 400, `clamp(1.8rem, 4.6vw, 3.6rem)`, line-height 1.02): section titles and the closing call to action.
- **Title** (Bungee 400, `clamp(1.3rem, 5.4vw, 2.5rem)`, line-height 1.05): stage names, feature titles, and the numerals on level tiles.
- **Body** (Geist Sans 400, 1rem–1.25rem, line-height 1.625): all prose. Measure capped at `34rem` / `52ch`; `text-wrap: pretty`.
- **Label** (Geist Sans 600, 0.9375rem): button text on quiet controls, HUD labels, badges. Sentence case.
- **Code** (Geist Mono 400, 0.8125rem–0.875rem, line-height 1.6): terminal lines, commit hashes, branch pills, stage numbers, the `HEAD` badge.

### Named Rules

**The Marquee-Only Rule.** Bungee is for headings, level numerals and the ticker. It never sets a sentence, never sets body copy, and never appears below 1.3rem except inside a button.

**The No Tracked Eyebrow Rule.** Small uppercase letter-spaced kickers above section headings are prohibited. A section earns its identity from the heading itself. Where a marker is genuinely ordinal — the stage sequence — it is a plain two-digit mono number (`01`), not a styled label.

**The Overflow Test Rule.** Every display and headline string must be checked in German, Turkish and Hindi at 375px. If a word overflows, lower the `clamp()` minimum; don't let it bleed. Headings carry `overflow-wrap: anywhere` below `sm` and `text-wrap: balance` throughout.

## 4. Elevation

The system is a stack of flat planes lit by nothing. Depth comes from two devices only: **tonal layering** (`void` → `night` → `deep`, each with a 2px `gm-line` border) and **hard offset shadows with zero blur**, which read as printed stickers and arcade keycaps rather than as light. There is no ambient shadow, no blur, no `backdrop-filter`, and no translucent glass anywhere in the system. If a surface looks like it is floating in soft light, the shadow is wrong.

### Shadow Vocabulary
- **Control rest** (`box-shadow: 0 5px 0 var(--btn-edge)`): the solid edge below every arcade button. 4px on the small variant.
- **Control hover** (`box-shadow: 0 7px 0 var(--btn-edge)` with `translateY(-2px)`): the button rises off its edge.
- **Control pressed** (`box-shadow: 0 1px 0 var(--btn-edge)` with `translateY(4px)`): the face sinks into the edge. This pairing is the signature of the system.
- **Panel rest** (`box-shadow: 0 6px 0 var(--color-gm-line)`): the HUD bar sitting on its own border colour.
- **Sticker** (`box-shadow: 10px 10px 0 0 var(--color-gm-grape)` / `12px 12px 0 0 <accent>`): the diagonal offset behind the hero terminal and the feature cartridges, in an accent colour, never in black.

### Named Rules

**The Zero-Blur Rule.** Every shadow in this system has a blur radius of 0 and an accent or line colour. `rgba(0,0,0,…)` soft shadows are permitted only inside an illustrative mock (e.g. the fanned theme previews), never on real UI.

**The One Raised Plane Rule.** Content sits on `void`, and raised elements sit on `night` with a `gm-line` border. Never nest a raised surface inside another raised surface; if it looks like a card inside a card, restructure it.

## 5. Components

Controls are physical: chunky, pressable, confident. Everything a player can press has mass and visibly reacts. Everything they read is flat and quiet.

### Buttons
- **Shape:** generously rounded rectangles (`1rem` / `rounded.button`; `0.85rem` on the small variant) with a 2px border in the edge colour.
- **Primary** (`btn-arcade btn-arcade-lime`): lime face, void text, Bungee label, `3.25rem` tall, `0 1.5rem` padding, `0 5px 0` lime edge. Reserved for the single most important action in a view — start, continue, advance.
- **Secondary** (`btn-arcade btn-arcade-grape`): grape face, ink text. The alternate route (cheat sheet, difficulty).
- **Quiet** (`btn-arcade btn-arcade-sm btn-arcade-night`): night face, `gm-line` border, Geist Sans 600 label, `2.75rem` tall, with a single accent-coloured icon that names its domain (gold cart = shop, lime pad = mini games, grape sliders = difficulty).
- **Hover / Focus / Active:** hover brightens 6% and lifts 2px on a 160ms `--ease-out-expo`; `:focus-visible` draws a 3px `gm-cyan` outline at 4px offset (never removed, never replaced by a colour shift); `:active` drops the face 4px onto a 1px edge. Under `prefers-reduced-motion` the lift is dropped and only brightness changes.
- **Disabled:** `saturate(0.3) brightness(0.8)`, no transform, `cursor: not-allowed`.

### Chips & Badges
- **Difficulty chip:** grape pill (`rounded.full`), ink text, 0.75rem, sitting inside a quiet button.
- **Branch pill:** mono 11px on a solid branch-colour pill — grape for `main`, cyan for a feature. Ink on grape, void on cyan.
- **HEAD badge:** lime block, void mono text, `rounded.chip`, marking the player's current stage. The word stays `HEAD` in every language; it is Git vocabulary, not UI copy.

### Cards / Containers
Cards are used only where something is genuinely a discrete object — a panel, a terminal, a cartridge — never as a default wrapper for text.
- **Corner Style:** `1.4rem` for panels and the HUD, `1.6rem` for feature cartridges.
- **Background:** `gm-night`, with `gm-deep` for the title strip.
- **Shadow Strategy:** panel rest or sticker (see Elevation); accent colour, zero blur.
- **Border:** 2px `gm-line`, or the accent's edge colour when the card is itself an accent object.
- **Internal Padding:** `1.25rem` (mobile) to `1.75rem`.
- **Cartridge tilt:** feature visuals rest at ±1–2° and straighten to 0° on hover over 500ms. Decorative only, always `aria-hidden`.

### Level Tiles
A `3.5rem` square button (`rounded.tile`, 2px border, `0 4px 0` edge) in one of three states, each carrying a shape as well as a colour so state never depends on hue alone:
- **Done:** lime face, void numeral, plus a small lime check badge on the top-outer corner.
- **Open:** ink face, grape numeral — the brightest tile on a grape surface, so the next move is obvious.
- **Locked:** translucent grape-edge face, `gm-ink-soft` padlock, `disabled`, no hover.
Tiles are real `<button>` elements inside a list, each with an `aria-label` naming the level and its state.

### Form fields
One field vocabulary for inputs, textareas and selects (`gm-field`): void background inside a
panel, 2px `gm-line` border, `0.85rem` radius, `2.75rem` tall. Hover shifts the border to
`gm-grape-hi`, focus draws the 3px cyan ring and recolours the border, disabled drops to 55%
opacity. Placeholders are `gm-ink-dim` (7.8:1) — never a lighter grey. Labels are Geist Sans
600 in `gm-ink-soft`, above the field, never floating inside it.

### Chips
`gm-chip`: a pill with a 2px border slot, `0.75rem` semibold text and an optional leading icon,
filled with the accent whose meaning it carries. Chips state facts (difficulty, reward, branch,
status); they are never buttons. A chip that needs a click is a `Button size="sm"`.

### Sponsor dialog
The only place the project asks for money, and it asks quietly: a gold heart keycap, one
sentence of fact (no ads, no account, no paywall), three `gm-inset` rows naming exactly what a
sponsorship pays for — hosting, development, staying open source — then the two destinations as
arcade buttons (GitHub Sponsors in gold, Buy Me a Coffee quiet) and a closing line stating that
playing stays free. Three entry points share one instance: a gold heart icon in the navbar, a
link in the footer's project column, and a single line under the landing page's closing call to
action. Its entrance only *moves* elements that are already painted, never fades them in from
zero, so a stalled ticker can never leave the ask blank.

### Terminal
The product's own voice, and the one place mono is not costume.

The frame is a `gm-panel` with its own **title bar**: a pulsing prompt-coloured LED and the
real session path in mono (`~/intro/level-1`, `~/playground`) — not three mac window dots —
with the theme, help and reset actions as ghost icon buttons on the trailing end.

Below the output sits the **statusline**, the component that makes the terminal feel like a
shell: working directory, the branch as a filled pill, and what is pending (`+` staged in
success, `~` modified in warning, `?` untracked dimmed, `↑`/`↓` for commits to push and pull),
or a single `clean` when there is nothing to report. It is 11px mono, it never wraps off a
phone, and every counter carries a screen-reader label. The input row below it is only the
prompt character, the field and send.

**The Theme Exception.** The terminal's purchasable themes (Dark Blue, Matrix, Golden) are the
one place literal hex colours are allowed. They are sold goods with their own identity — a
player buys "Matrix green on black", not a tokenised approximation — so they live in
`TerminalThemeContext` and override the panel's own colours at runtime. The *default* theme is
tokens only, and no other surface may follow their example.

Inside the terminal the theme owns the palette all the way down: the frame publishes it as
`--term-bg / --term-text / --term-accent / --term-prompt / --term-success / --term-error /
--term-warning`, and every printed line picks a **role**, never a token — prompts and commands
on `prompt`, a created repository or a staged file on `success`, modified and untracked on
`warning`, `error:` / `fatal:` on `error`, branches and paths on `accent`. A bought theme
therefore repaints what the terminal says, not just its border. The only token that survives
inside the frame is the branch pill on the default theme, which keeps the Git legend.
- Night body, `gm-deep` title bar with coral/gold/lime dots and a mono `~/path` label.
- Lime `$` prompt, `gm-ink` commands, `gm-ink-dim` output, lime for success lines, coral for destructive results.
- A lime block caret blinking on a 1.05s step animation.
- Bottom-anchored (`justify-end`) so new lines push old ones up, with non-shrinking rows.

### Stage Map (signature component)
The learning path is a rail line, not a list of cards. A `0.5rem` grape-edge lane runs down the start edge of the drenched section and fills with lime as the page scrolls (scroll-scrubbed `scaleY`). Each stage is a station: a `3.5rem`–`4.5rem` circular node with a 4px border, filled lime when the stage is complete, night when it is open, grape with a padlock when it is locked, and ringed in lime for the current stage. Content sits beside the lane — ordinal number, optional `HEAD` badge, completion count, Bungee stage name, description, progress bar, level tiles.

### Navigation
A sticky bar on `gm-void` with a 2px `gm-line` bottom border and `--z-sticky`. The mark is a
grape keycap that turns lime on hover; the wordmark is Bungee at `1.125rem`. Links are `ghost`
buttons; the single lime `default` button is always the action that puts the player back into a
level. Below the breakpoint the links collapse into a drawer that lists every destination,
marks the current one with `aria-current` and a `gm-deep` fill, closes on Escape and on route
change, and keeps 44px touch targets. The GitHub star count is a bordered pill, never a button.

From `lg` the destinations stay in the bar as icons and regain their labels at `2xl`; the page
you are on is never removed from the navigation, it becomes a grape pressed key with
`aria-current="page"`. Beside them sits the **cabinet readout**: coins in gold with the coin
glyph (the spendable currency, always visible, even on a phone) and the running XP total in
`gm-ink-soft` behind a hairline divider. It states facts, so it is not a control, and it
updates the moment `ProgressManager` writes — clearing a level or buying in the shop changes
the number without a reload.

### Footer
The second door into the app, not a legal afterthought: the mark with the `git gud` prompt
chip, every destination the top bar collapses on a phone, then the repository and the legal
notice. Rows are 36px links with the icon in `gm-ink-dim` and the label in `gm-ink-soft`
turning lime on hover; a closing line carries the author credit above a 2px rule.

## 6. Do's and Don'ts

### Do:
- **Do** give every pressable control the edge treatment (`0 5px 0 <edge>` at rest, `0 1px 0` with a 4px translate on `:active`). Pressability is the system's signature.
- **Do** keep the Git legend intact: grape `main`, cyan feature, coral fix/danger, lime success, gold points.
- **Do** use `gm-ink-soft` for body copy on the grape section and `gm-ink-dim` only on void or night.
- **Do** pair every state colour with an icon or text — check, padlock, `HEAD` — so colour is never the only signal.
- **Do** ship every animation with a `prefers-reduced-motion` path that renders the finished state: no autoplaying video (poster only), no scroll-scrubbed lanes, no parallax.
- **Do** render reveal animations on top of markup that is already complete in the HTML, so a headless renderer or a paused tab never ships a blank section.
- **Do** use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) and `rtl:rotate-180` on directional arrows; the product ships Persian.
- **Do** test every heading in German, Turkish and Hindi at 375px before calling it done.
- **Do** keep `<video>` backdrops muted, looping, `playsInline`, with `preload="none"` until playback is decided, and a poster that is the clip's own first frame.
- **Do** style shared primitives once in `src/components/ui/*` and let screens inherit them; a screen only passes layout classes.
- **Do** keep app UI calm: the landing page's display sizes and drenched sections stay on the landing page, while buttons, panels, fields and motion curves stay identical across both.

### Don't:
- **Don't** build a "generic SaaS landing": purple gradients, glassmorphism cards, gradient headline text, hero-metric stat rows, or three identical icon+heading+text tiles. PRODUCT.md names this as the anti-reference the old page drifted into.
- **Don't** let the page slide into the "dry tutorial / docs" look — grey, text-heavy, man-page flavoured — or into kiddy edutainment that talks down to developers, or the green-Matrix hacker cliché.
- **Don't** use `background-clip: text`, soft blurred shadows, `backdrop-filter`, or translucent glass on real UI.
- **Don't** put a small uppercase letter-spaced eyebrow above a section heading, and don't number sections that aren't a real sequence.
- **Don't** set body text in Bungee, and don't give it negative letter-spacing.
- **Don't** put `gm-ink-dim` (3.5:1) or `gm-grape-hi` (4.2:1 on night) on body text.
- **Don't** nest a `gm-night` surface inside another `gm-night` surface; if it reads as a card in a card, restructure it.
- **Don't** wrap a `<button>` in a `<Link>` or hang `onClick` on a `<div>`; level tiles and CTAs are real buttons and links with real disabled states.
- **Don't** remove a focus outline without replacing it with something at least as visible as the 3px cyan ring.
- **Don't** colour a shared primitive at the call site (`<Button className="bg-purple-600 …">`); pick the variant, or add one.
- **Don't** reach for a raw Tailwind palette utility (`purple-*`, `gray-*`, `emerald-*`); every colour in the app comes from a `gm-*` token or a semantic alias.
- **Don't** write a bare `z-50` or `z-[999]`; use the `--z-*` scale.
