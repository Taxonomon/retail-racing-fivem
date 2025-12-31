INSERT INTO txn.permissions (identifier, description) VALUES
  ('menu:moderation:open', NULL),
  ('menu:administration:open', NULL),
  ('track:import', NULL);

INSERT INTO txn.principals (identifier, description) VALUES
  ('moderator', NULL),
  ('administrator', NULL);

INSERT INTO txn.principal_permissions (principal, permission) VALUES
  (
    (
      SELECT id
      FROM txn.principals
      WHERE identifier = 'moderator'
    ),
    (
      SELECT id
      FROM txn.permissions
      WHERE identifier = 'menu:moderation:open'
    )
  ),
  (
    (
      SELECT id
      FROM txn.principals
      WHERE identifier = 'administrator'
    ),
    (
      SELECT id
      FROM txn.permissions
      WHERE identifier = 'menu:administration:open'
    )
  ),
  (
    (
      SELECT id
      FROM txn.principals
      WHERE identifier = 'administrator'
    ),
    (
      SELECT id
      FROM txn.permissions
      WHERE identifier = 'track:import'
    )
  );

SELECT permissions.*
FROM txn.permissions
LEFT JOIN txn.principal_permissions ON permissions.id = principal_permissions.permission
WHERE principal_permissions.principal IN (1);
