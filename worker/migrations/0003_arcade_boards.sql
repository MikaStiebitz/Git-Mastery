-- When a minigame best was set, so ties on the arcade boards go to whoever got there first.
--
-- 0 means "before this column existed", and the boards order those after any dated result, so an
-- old score never beats a new one it ties with just for being old. Written only on an improvement
-- (db.ts upserts with a WHERE), which is also what stops every sync rewriting every best.
ALTER TABLE minigame_best ADD COLUMN achieved_at INTEGER NOT NULL DEFAULT 0;
