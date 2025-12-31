import {NewPrincipalPermission, PrincipalPermission} from "./schema";
import databaseState from "../../database/state";
import {Permission} from "../permission/schema";
import {Principal} from "../principal/schema";
import principalsRepo from "../principal/repo";
import logger from "../../logging/logger";

async function insert(principalPermission: NewPrincipalPermission): Promise<PrincipalPermission | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .insertInto('principal_permissions')
    .values(principalPermission)
    .returningAll()
    .executeTakeFirst();
}

async function findByPermission(permission: Permission | number): Promise<PrincipalPermission[] | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('principal_permissions')
    .selectAll()
    .where('permission', '=', typeof permission === 'number' ? permission : permission.id)
    .execute()
}

async function findPermissionsByPrincipalIds(principalIds: number[]): Promise<Permission[]> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('permissions')
    .selectAll('permissions')
    .leftJoin('principal_permissions', 'principal_permissions.permission', 'permissions.id')
    .where('principal_permissions.principal', 'in', principalIds)
    .execute();
}

const principalPermissionsRepo = {
  insert,
  findByPermission,
  findPermissionsByPrincipalIds
};

export default principalPermissionsRepo;
