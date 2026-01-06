SELECT * FROM txn.players;

SELECT * FROM txn.player_principals;

SELECT * FROM txn.principals;

SELECT principals.identifier, permissions.identifier
FROM txn.principal_permissions
LEFT JOIN txn.principals ON principal_permissions.principal = principals.id
LEFT JOIN txn.permissions ON principal_permissions.permission = permissions.id;

INSERT INTO txn.player_principals
(player, principal, reason)
SELECT players.id, principals.id, NULL
FROM txn.players, txn.principals
WHERE players.license2 = 'dcbde3d37760e875cbcba3caaaff0c068b81fee0'
AND principals.identifier IN ('administrator', 'moderator');

SELECT *
FROM txn.rockstar_jobs;
