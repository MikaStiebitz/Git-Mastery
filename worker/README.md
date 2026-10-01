# GitMastery accounts

The optional account API. Username and password, no email, no recovery.

The game does not need this. GitMastery is a static export on GitHub Pages and stores progress in
`localStorage`; an account only lets someone pick that progress up on another device. If this
Worker is never deployed, or goes down, or the site is built without `NEXT_PUBLIC_ACCOUNT_API_URL`,
the game behaves exactly as it did before accounts existed.

## Deploying it, first time

```bash
cd worker
npm install
npx wrangler login
```

Generate the password pepper and store it. **Write it down somewhere safe first** — it is not
recoverable and not derivable, and losing it makes every existing password unverifiable:

```bash
openssl rand -base64 32
npx wrangler secret put PASSWORD_PEPPER
```

Paste the value at the prompt. Do not pass it with `--value=`; that puts it in your shell history.

The database already exists (`gitmastery-accounts`, id in `wrangler.jsonc`). Apply the schema and
deploy:

```bash
npx wrangler d1 migrations apply gitmastery-accounts --remote
npx wrangler deploy
```

`wrangler deploy` prints the Worker's URL. Set it as a **repository variable** (not a secret) named
`ACCOUNT_API_URL` under Settings → Secrets and variables → Actions → Variables, next to the
`CLOUDFLARE_ANALYTICS_TOKEN` that is already there. The deploy workflow passes it to the build as
`NEXT_PUBLIC_ACCOUNT_API_URL`.

Then check it answers:

```bash
curl https://<your-worker-url>/v1/health
```

## Everyday commands

```bash
npm run dev             # local Worker at :8787, against a local D1 file
npm run typecheck
npm test                # the anti-cheat and moderation tests
npm run deploy
```

Local development needs its own pepper. Create `worker/.dev.vars` (gitignored):

```
PASSWORD_PEPPER="any-long-random-string-for-local-use"
```

Do not also create a `.env` — if `.dev.vars` exists, `.env` is silently ignored and you will spend
an afternoon wondering why an edit had no effect.

## What is safe to commit

`wrangler.jsonc` is committed, `database_id` and all. That id is not a secret: D1 has no public
endpoint, so it is inert without an account-scoped API token, and `wrangler d1 create` writes it
into your config for you. `account_id` is deliberately absent — `wrangler login` supplies it.

`PASSWORD_PEPPER` is the only real secret, it lives only in Cloudflare's secret store and in
`.dev.vars`, and it has **no fallback default in code**. A deploy that forgets it returns 500 from
every authenticated route, loudly, which is the correct failure: a `?? "dev-secret"` would publish
the production key to a public repository the first time one deploy missed the secret.

Session tokens need no secret at all — they are random values whose SHA-256 is stored — so there is
nothing else here that could leak.

## How the anti-cheat works

The wire protocol has no coins field. Not a validated one, not a signed one — none.

A sync request says what the player _did_ ("cleared intro/3", "bought golden-terminal") and the
server prices it from `src/catalog.ts`. So editing `coins: 999999` in localStorage does not fail
validation; it has nowhere to go. There is no field it could travel in.

The ledger in D1 is append-only with `PRIMARY KEY (user_id, key)`, and **the server builds every
key itself** from a catalog-validated fact. That is what caps the economy: the key space is finite —
one row per level, minigame, shop item and egg — so the most an account can ever mint is 685 coins.
Not "hard to exceed"; arithmetically unable to. The whole shop costs 705, so the ceiling is
load-bearing rather than decorative.

Accepting a client-chosen `key` would void all of this, which is why `ClientEvent` in `types.ts`
does not have one.

What this does **not** stop: the server has no Git simulator, so it cannot tell a real completion
from a forged POST. Someone who reads this repository can unlock the whole game without playing it.
That is deliberate — the design converts unbounded, trivial cheating (edit one number) into
bounded, deliberate cheating (read the source, forge a request, gain at most what an honest player
could have earned), in a game with no prizes.

## Stars, ranks and the leaderboard

None of these touch the ledger, so none of them can move the 685-coin ceiling above.

- **Ranks** and **achievements** are derived on the client from the save. Nothing is stored for them.
- **Stars** (`level_stars`, migration `0002`) rate how cleanly a level was solved. Cosmetic and unpriced,
  so the table holds claims, not ledger rows. Only two- and three-star results are sent, one row per
  level at most, written when first earned or improved. The upsert's `WHERE excluded.stars >
level_stars.stars` makes a non-improving write a no-op, so a replay costs no written rows. Claims for
  levels the catalog does not know are dropped.
- **The leaderboard** (`GET /v1/leaderboard`) writes nothing. It has an overall board (XP), an arcade board
  per minigame and an all-games arcade total. Each listed player carries their unlocked achievements, and
  the response has a small profile per listed player (since, XP, levels, achievements, arcade bests), so
  opening a profile in the UI needs no second request. Everything is built from tables that already exist:
  `SUM(score_delta)` over the ledger for the overall board (one scan), `minigame_best` for the arcade
  boards (a small table), and the listed players' own rows for their achievements. Achievements are
  computed in `src/achievements.ts`, and `src/test/worker/achievements-parity.test.ts` runs the game's and
  the Worker's rules over the same generated saves so a badge cannot differ between your screen and the
  board. The snapshot is kept in memory for an hour. The only write the board ever causes is a player
  flipping the opt-out switch (`POST /v1/account/leaderboard`, column `users.leaderboard_hidden`). Accounts
  are visible by default, with the notice shown at registration. Hiding takes effect at once: each response
  re-checks the (at most ~100) listed accounts by primary key, so a stale snapshot never shows someone who
  has opted out or still shows an old name.
- **Arcade scores are clamped.** `minigame_best` is reported by the client, so `MINIGAME_SCORE_CEILING` in
  `src/catalog.ts` holds the highest score each game can produce (derivations in the comment), and a
  `bests` value above it is clamped. Unknown game ids are dropped. Ties on a board go to whoever set the
  score first (`achieved_at`, migration `0003`). A best is only written when it improves, so resending all
  of them on every sync no longer rewrites every row.

What the board costs: one scan of `events` per refresh per Worker isolate, i.e. roughly (ledger rows) x
(refreshes per day). The refresh interval is `LEADERBOARD_TTL_SECONDS` (default 3600, minimum 60) and is
stretched automatically so one isolate stays under `LEADERBOARD_DAILY_READ_BUDGET` (default 1,000,000 rows
a day) as the table grows: the board gets staler instead of the site getting slower. Isolates do not share
the cache, so this is a per-isolate bound, not a global one. D1's free read quota is a hard stop that
takes logins down with it, so watch `rows_read` after launch.

What it is not: **refereed**. The Worker cannot replay a level or a minigame run, so both are claims, and
a forged request can reach the top of a board. The design caps how far: one score per level and a finite
set of levels, and a ceiling per minigame, so forging reaches the best an honest run could score and no
higher, with ties ordered by who got there first. Treat the boards as friendly competition, which is also
what the page says. Stars are left off the boards for the same reason.

Deploying it: apply the migrations (`0002` and `0003`) first (`npx wrangler d1 migrations apply gitmastery-accounts --remote`),
then deploy. The new rate-limit binding `RL_LEADERBOARD_IP` is optional and fails open like the others.

## Things that will cost you an afternoon if you do not know them

- **PBKDF2 is capped at 100,000 iterations in production, and the cap is not enforced locally.**
  `wrangler dev`, Miniflare and vitest all happily run 600,000; production throws
  `DOMNotSupportedError` on the first registration. `src/crypto.ts` uses 50,000 and a test asserts
  it stays under the cap. `node:crypto.pbkdf2` is not a way around it — same check.
- **`crypto.subtle.timingSafeEqual` throws on a length mismatch** rather than returning false, so a
  truncated stored hash would 500 the login endpoint. `verifyPassword` checks lengths first.
- **D1's free daily limits became hard failures on 2026-09-01** (5M rows read, 100k written, per
  account, resetting at 00:00 UTC). The Worker returns `storage_quota_exhausted` and the client
  keeps its queue rather than discarding progress. Every index costs an extra written row on every
  insert, which is why `events` has none beyond its primary key.
- **`COLLATE NOCASE` and SQLite's `lower()` are ASCII-only**, so neither can make usernames unique
  case-insensitively for non-ASCII input. Folding happens in JS, into `username_key`.
- **`PRAGMA foreign_keys = OFF` silently does nothing** in D1 — it returns success and changes
  nothing. Cascades always apply.

## Moderation word lists

`src/moderation/wordlists.ts` is generated. Edit `scripts/gen-wordlists.mjs` — which holds the
curated additions, the reserved names and the false-positive exclusions — and regenerate:

```bash
node scripts/gen-wordlists.mjs
```

Source data is [LDNOOBW](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words),
CC-BY-4.0, kept as a devDependency so its licence stays out of the runtime tree.

The filter will occasionally reject a real name. `test/username.test.ts` has a list of surnames it
must not reject — add to it when someone reports one, then add the fragment to `NAME_WHITELIST`.
Renaming someone by hand is one query:

```sql
UPDATE users SET username = 'NewName', username_key = 'newname' WHERE username_key = 'oldname';
```
