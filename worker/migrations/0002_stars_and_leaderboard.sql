-- Level stars, and the opt-out for the public leaderboard.
--
-- Both are cosmetic and unpriced. Neither touches the ledger, so the economy cap and the
-- arithmetic that makes it a cap are exactly what they were.

-- How cleanly a level was solved. Cosmetic: a forged value buys nothing, which is why this is a
-- table of claims rather than ledger rows.
--
-- Only two- and three-star results are ever sent, because one star is implied by the level being
-- in the ledger at all. At most one row per level (55 at today's content), written when a result
-- is first earned or improved and never otherwise: the upsert in db.ts has a WHERE that makes a
-- non-improving write a no-op, so replaying a level costs no written rows.
CREATE TABLE level_stars (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT    NOT NULL,                     -- 'intro/3', the same spelling as events.subject
    stars   INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 3),
    PRIMARY KEY (user_id, subject)
) STRICT;

-- 1 hides the account from the public leaderboard. The default is visible: a username is already
-- the only identifier the game holds, it passes the same moderation as any public handle, and a
-- board that starts empty because nobody opted in is not a board. Written only when toggled.
ALTER TABLE users ADD COLUMN leaderboard_hidden INTEGER NOT NULL DEFAULT 0;
