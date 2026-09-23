-- GitMastery accounts and progress ledger.
--
-- No secrets here, and nothing identifying: there is no email column because the game never
-- asks for one. A row is a username, a password hash, and a list of things the player did.
--
-- Every table is STRICT so a type mismatch raises SQLITE_CONSTRAINT_DATATYPE instead of being
-- silently coerced. Indexes are kept deliberately sparse: D1's free plan allows 100,000 written
-- rows per day and each index adds a written row to every insert that touches its column, so an
-- index has to earn its place.

CREATE TABLE users (
    -- An integer surrogate key rather than a UUID: it is never exposed to a client (the API hands
    -- out a session token and nothing else), and an INTEGER foreign key costs a fraction of a
    -- 36-character one in a database billed by written rows.
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    username          TEXT    NOT NULL,           -- as typed, for display
    username_key      TEXT    NOT NULL,           -- NFKD-folded, lowercased, separators removed
    password_hash     TEXT    NOT NULL,           -- $pbkdf2-sha256$i=<n>$<salt>$<hash>
    created_at        INTEGER NOT NULL DEFAULT (unixepoch()),
    username_changed_at INTEGER NOT NULL DEFAULT 0,
    -- Once-ever guard for the `git gud` easter egg. Survives a cloud reset, so replaying the
    -- game re-earns level coins (correct) but cannot re-earn the egg bonus (also correct).
    egg_awarded_at    INTEGER NOT NULL DEFAULT 0,
    reset_count       INTEGER NOT NULL DEFAULT 0,
    -- Counts malformed and unrecognised submissions. Observed, never enforced: a heuristic that
    -- refuses to save a beginner's real progress is worse than a cheater in a game with no prizes.
    suspicion         INTEGER NOT NULL DEFAULT 0
) STRICT;

-- Case- and separator-insensitive uniqueness. A UNIQUE index on lower(username) would not do:
-- SQLite's lower() and COLLATE NOCASE are both ASCII-only, so 'Grün' and 'GRÜN' would index as
-- two different accounts. The folding happens in the Worker, in JS, where it is Unicode-correct.
CREATE UNIQUE INDEX users_username_key_uq ON users (username_key);

CREATE TABLE sessions (
    token_hash   TEXT    PRIMARY KEY,             -- SHA-256 of the bearer token. Never the token.
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
    expires_at   INTEGER NOT NULL
) STRICT;

-- Earns its write cost: it is what makes "revoke every session" possible on a password change.
CREATE INDEX sessions_user_id_idx ON sessions (user_id);

-- THE LEDGER. Append-only, server-priced, immutable.
--
-- `PRIMARY KEY (user_id, key)` is the whole anti-cheat design in one line. The key is built by
-- the server from a catalog-validated fact, never accepted from the client, so the set of keys an
-- account can ever hold is finite: one per level, minigame, shop item and egg. The maximum coins
-- an account can mint is therefore not a limit anyone enforces — it is arithmetic.
--
-- There is deliberately no materialised balance. State is recomputed from these rows on every
-- read, which is affordable only because the row count per user is bounded (69 at today's
-- content) and would be the wrong choice for an unbounded event stream.
CREATE TABLE events (
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key         TEXT    NOT NULL,                 -- 'level:intro:3', 'purchase:golden-terminal'
    seq         INTEGER NOT NULL,
    kind        TEXT    NOT NULL,
    subject     TEXT    NOT NULL,                 -- 'intro/3', 'merge-master', 'gitgud'
    score_delta INTEGER NOT NULL,
    coins_delta INTEGER NOT NULL,                 -- negative for purchases
    multiplier  INTEGER NOT NULL DEFAULT 1,
    -- 1 when the row came from the one-time import of pre-account local progress. Imported rows
    -- are always priced at multiplier 1, because the import path is the one place a client
    -- asserts history against an account that has none to clamp it against.
    imported    INTEGER NOT NULL DEFAULT 0,
    occurred_at INTEGER NOT NULL,                 -- clamped client claim
    accepted_at INTEGER NOT NULL DEFAULT (unixepoch()),
    PRIMARY KEY (user_id, key)
) STRICT;

-- No index on (user_id, seq). The primary key already leads with user_id, so every read here
-- filters on it for free, and ordering 69 rows in the Worker costs microseconds. An index would
-- add a written row to every single event insert — a third of the write budget for nothing.

-- Where the player last was. A bookmark, not progress: unpriced, last-write-wins.
CREATE TABLE cursor (
    user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    stage      TEXT    NOT NULL DEFAULT 'intro',  -- always lowercase
    level      INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
) STRICT;

-- Minigame high scores. Cosmetic and unpriced, so a forged value buys nothing.
-- If a leaderboard is ever built on this table it needs a real refereeing story first —
-- server-replayable seeds, or drop the numbers.
CREATE TABLE minigame_best (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id TEXT    NOT NULL,
    best    INTEGER NOT NULL,
    PRIMARY KEY (user_id, game_id)
) STRICT;

-- Login throttling, global and exact, unlike the per-location rate limit binding.
-- Written only on a FAILED attempt, so the write cost is paid by attackers, not by players.
-- Keyed on the folded username so 'MIKA' and 'mika' share one bucket, and rows are created for
-- usernames that do not exist too — a bucket that never locks out would itself reveal that an
-- account is absent.
CREATE TABLE login_attempts (
    username_key TEXT    PRIMARY KEY,
    fails        INTEGER NOT NULL DEFAULT 0,
    window_start INTEGER NOT NULL DEFAULT 0,
    locked_until INTEGER NOT NULL DEFAULT 0
) STRICT;
