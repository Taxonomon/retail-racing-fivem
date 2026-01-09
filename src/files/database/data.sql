--
-- static data
--

DELETE FROM txn.principals
WHERE identifier IN (
  'moderator',
  'administrator'
);

DELETE FROM txn.permissions
WHERE identifier IN (
  'menu:moderation:open',
  'menu:administration:open',
  'command:track:import',
  'track:list:refresh'
);

INSERT INTO txn.permissions (identifier, description) VALUES
  (
    'menu:moderation:open',
    NULL
  ),
  (
    'menu:administration:open',
    NULL
  ),
  (
    'command:track:import',
    'Allows execution of the importtrack command.'
  ),
  (
    'track:list:refresh',
    'Refreshes the list of available tracks for all connected clients'
  )
;

INSERT INTO txn.principals (identifier, description) VALUES
  (
    'administrator',
    NULL
  ),
  (
    'moderator',
    NULL
  )
;

INSERT INTO txn.principal_permissions (principal, permission)
SELECT principals.id, permissions.id
FROM txn.principals, txn.permissions
WHERE principals.identifier = 'moderator'
AND permissions.identifier IN (
  'menu:moderation:open'
);

INSERT INTO txn.principal_permissions (principal, permission)
SELECT principals.id, permissions.id
FROM txn.principals, txn.permissions
WHERE principals.identifier = 'administrator'
AND permissions.identifier IN (
  'menu:administration:open',
  'command:track:import',
  'track:list:refresh'
);
