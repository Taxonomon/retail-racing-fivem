--
-- static data
--

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
    'command:job:import',
    'Allows execution of the importjob command.'
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

INSERT INTO txn.principal_permissions (principal, permission) VALUES
  (
    (SELECT id FROM txn.principals WHERE identifier = 'moderator'),
    (SELECT id FROM txn.permissions WHERE identifier = 'menu:moderation:open')
  ),
  (
    (SELECT id FROM txn.principals WHERE identifier = 'administrator'),
    (SELECT id FROM txn.permissions WHERE identifier = 'menu:administration:open')
  ),
  (
    (SELECT id FROM txn.principals WHERE identifier = 'administrator'),
    (SELECT id FROM txn.permissions WHERE identifier = 'command:job:import')
  )
;
