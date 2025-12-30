import {NewPrincipalPermission, PrincipalPermission} from "./schema";
import databaseState from "../../database/state";
import {Permission} from "../permission/schema";

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

const principalPermissionsRepo = {
  insert,
  findByPermission
};

export default principalPermissionsRepo;
