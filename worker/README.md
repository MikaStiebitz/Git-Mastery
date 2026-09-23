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

A sync request says what the player *did* ("cleared intro/3", "bought golden-terminal") and the
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
could have earned), in a game with no leaderboard and no prizes.

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
