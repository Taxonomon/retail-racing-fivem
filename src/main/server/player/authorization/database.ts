import databaseState from "../../database/state";

import {Generated, Insertable, Selectable, Updateable} from "kysely";

export interface PrincipalsTable {
  id: Generated<number>;
  identifier: string;
  description: string | null;
}

export interface PermissionsTable {
  id: Generated<number>;
  identifier: string;
  description: string | null;
}

export interface PrincipalPermissionsTable {
  id: Generated<number>;
  principal: number;
  permission: number;
}

export interface PlayerPrincipalsTable {
  id: Generated<number>;
  player: number;
  principal: number;
  reason: string | null;
}

export type Principal = Selectable<PrincipalsTable>;
export type NewPrincipal = Insertable<PrincipalsTable>;
export type PrincipalUpdate = Updateable<PrincipalsTable>;

export type Permission = Selectable<PermissionsTable>;
export type NewPermission = Insertable<PermissionsTable>;
export type PermissionUpdate = Updateable<PermissionsTable>;

export type PrincipalPermission = Selectable<PrincipalPermissionsTable>;
export type NewPrincipalPermission = Insertable<PrincipalPermissionsTable>;
export type PrincipalPermissionUpdate = Updateable<PrincipalPermissionsTable>;

export type PlayerPrincipal = Selectable<PlayerPrincipalsTable>;
export type NewPlayerPrincipal = Insertable<PlayerPrincipalsTable>;
export type PlayerPrincipalUpdate = Updateable<PlayerPrincipalsTable>;

export async function insertPermission(
  permission: NewPermission
): Promise<Permission | undefined> {
  return databaseState.db
    .withSchema('txn')
    .insertInto('permissions')
    .values(permission)
    .returningAll()
    .executeTakeFirst();
}

export async function findPermissionByIdentifier(
  identifier: string
): Promise<Permission | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('permissions')
    .selectAll()
    .where('identifier', '=', identifier)
    .executeTakeFirst();
}

export async function insertPrincipalPermission(
  principalPermission: NewPrincipalPermission
): Promise<PrincipalPermission | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .insertInto('principal_permissions')
    .values(principalPermission)
    .returningAll()
    .executeTakeFirst();
}

export async function findPrincipalPermissionsByPrincipalIds(
  principalIds: number[]
): Promise<Permission[]> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('permissions')
    .selectAll('permissions')
    .leftJoin('principal_permissions', 'principal_permissions.permission', 'permissions.id')
    .where('principal_permissions.principal', 'in', principalIds)
    .execute();
}

export async function insertPlayerPrincipal(
  playerPrincipal: NewPlayerPrincipal
): Promise<PlayerPrincipal | undefined> {
  return databaseState.db
    .withSchema('txn')
    .insertInto('player_principals')
    .values(playerPrincipal)
    .returningAll()
    .executeTakeFirst();
}

export async function findPlayerPrincipalsByPlayerId(player: number): Promise<PlayerPrincipal[] | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('player_principals')
    .selectAll()
    .where('player', '=', player)
    .execute();
}

export async function existsPlayerPrincipalsByPlayerId(player: number): Promise<boolean> {
  const result = await findPlayerPrincipalsByPlayerId(player);
  return undefined !== result && result.length > 0;
}

export async function findPlayerPrincipalByPlayerIdAndPrincipalId(
  player: number,
  principal: number
): Promise<PlayerPrincipal | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('player_principals')
    .selectAll()
    .where('player', '=', player)
    .where('principal', '=', principal)
    .executeTakeFirst();
}

export async function findPlayerPrincipalsByPlayerIdAndPrincipalIds(
  player: number,
  principalIds: number[]
): Promise<PlayerPrincipal[] | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('player_principals')
    .selectAll()
    .where('player', '=', player)
    .where('principal', 'in', principalIds)
    .execute();
}

export async function findPlayerPrincipalsByPlayerIdAndPermissionIdentifier(
  player: number,
  permissionIdentifier: string
): Promise<PlayerPrincipal[]> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('player_principals')
    .selectAll()
    .leftJoin(
      'principal_permissions',
      'player_principals.principal',
      'principal_permissions.principal'
    )
    .leftJoin(
      'permissions',
      'principal_permissions.permission',
      'permissions.id'
    )
    .where('player_principals.player', '=', player)
    .where('permissions.identifier', '=', permissionIdentifier)
    .execute();
}

export async function insertPrincipal(principal: NewPrincipal): Promise<Principal | undefined> {
  return databaseState.db
    .withSchema('txn')
    .insertInto('principals')
    .values(principal)
    .returningAll()
    .executeTakeFirst();
}

export async function findPrincipalsByIds(ids: number[]): Promise<Principal[]> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('principals')
    .selectAll()
    .where('id', 'in', ids)
    .execute();
}

export async function findPrincipalByIdentifier(identifier: string): Promise<Principal | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('principals')
    .selectAll()
    .where('identifier', '=', identifier)
    .executeTakeFirst();
}
