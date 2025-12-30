SELECT *
FROM txn.players;

SELECT *
FROM txn.permissions;

SELECT *
FROM txn.principal_permissions;

SELECT *
FROM txn.players;

INSERT INTO txn.player_principals (player, principal)
SELECT players.id, principals.id
FROM txn.players, txn.principals
WHERE players.license2 = 'dcbde3d37760e875cbcba3caaaff0c068b81fee0'
AND principals.identifier IN ('moderator', 'administrator');

SELECT *
FROM txn.player_principals;

INSERT INTO txn.permissions (identifier) VALUES ('track:import');

INSERT INTO txn.principal_permissions (principal, permission) VALUES
  (
    (SELECT id FROM txn.principals WHERE identifier = 'administrator'),
    (SELECT id FROM txn.permissions WHERE identifier = 'track:import')
  );
