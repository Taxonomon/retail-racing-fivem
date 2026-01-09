-- make myself mod and admin
INSERT INTO txn.player_principals
(player, principal, reason)
SELECT players.id, principals.id, NULL
FROM txn.players, txn.principals
WHERE players.license2 = 'dcbde3d37760e875cbcba3caaaff0c068b81fee0'
AND principals.identifier IN ('administrator', 'moderator');


UPDATE txn.tracks
SET enabled = true
WHERE enabled = false;
