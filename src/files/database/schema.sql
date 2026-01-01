DROP SCHEMA IF EXISTS txn CASCADE;

CREATE SCHEMA txn;

CREATE TABLE txn.players (
  id bigint GENERATED ALWAYS AS IDENTITY,
  nickname text NOT NULL,
  license2 text NOT NULL,
  first_joined timestamptz NOT NULL,
  last_seen timestamptz NOT NULL,
  CONSTRAINT players_pk_id
    PRIMARY KEY (id),
  CONSTRAINT players_uk_license2
    UNIQUE (license2)
);

CREATE TABLE txn.past_nicknames (
  id bigint GENERATED ALWAYS AS IDENTITY,
  player bigint NOT NULL,
  nickname text NOT NULL,
  active_until timestamptz NOT NULL,
  CONSTRAINT past_nicknames_pk_id
    PRIMARY KEY (id),
  CONSTRAINT past_nicknames_fk_player
    FOREIGN KEY (player)
    REFERENCES txn.players (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE txn.principals (
  id bigint GENERATED ALWAYS AS IDENTITY,
  identifier text NOT NULL,
  description text,
  CONSTRAINT principals_pk_id
    PRIMARY KEY (id),
  CONSTRAINT principals_uk_identifier
    UNIQUE (identifier)
);

CREATE TABLE txn.permissions (
  id bigint GENERATED ALWAYS AS IDENTITY,
  identifier text NOT NULL,
  description text,
  CONSTRAINT permissions_pk_id
    PRIMARY KEY (id),
  CONSTRAINT permissions_uk_identifier
    UNIQUE (identifier)
);

CREATE TABLE txn.principal_permissions (
  id bigint GENERATED ALWAYS AS IDENTITY,
  principal bigint NOT NULL,
  permission bigint NOT NULL,
  CONSTRAINT principal_permissions_pk_id
    PRIMARY KEY (id),
  CONSTRAINT principal_permissions_fk_principal
    FOREIGN KEY (principal)
    REFERENCES txn.principals (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT principal_permissions_fk_permission
    FOREIGN KEY (permission)
    REFERENCES txn.permissions (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT principal_permissions_uk_principal_permission
    UNIQUE (principal, permission)
);

CREATE TABLE txn.player_principals (
  id bigint GENERATED ALWAYS AS IDENTITY,
  player bigint NOT NULL,
  principal bigint NOT NULL,
  reason text,
  CONSTRAINT player_principals_pk_id
    PRIMARY KEY (id),
  CONSTRAINT player_principals_fk_player
    FOREIGN KEY (player)
    REFERENCES txn.players (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT player_principals_fk_principal
    FOREIGN KEY (principal)
    REFERENCES txn.principals (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT player_principals_uk_player_principal
    UNIQUE (player, principal)
);

CREATE TABLE txn.tracks (
  id bigint GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  author text NOT NULL,
  description text,
  rockstar_job_id text NOT NULL,
  added_at timestamptz NOT NULL,
  added_by bigint,
  enabled bool NOT NULL,
  data jsonb NOT NULL,
  hash_md5 text NOT NULL,
  CONSTRAINT tracks_pk_id
    PRIMARY KEY (id),
  CONSTRAINT tracks_fk_added_by
    FOREIGN KEY (added_by)
    REFERENCES txn.players (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT tracks_uk_hash_md5
    UNIQUE (hash_md5)
);

CREATE TABLE txn.player_settings (
  id bigint GENERATED ALWAYS AS IDENTITY,
  player bigint NOT NULL,
  settings jsonb NOT NULL,
  CONSTRAINT player_settings_pk_id
    PRIMARY KEY (id),
  CONSTRAINT player_settings_fk_player
    FOREIGN KEY (player)
    REFERENCES txn.players (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
