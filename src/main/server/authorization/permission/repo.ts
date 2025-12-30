import {NewPermission, Permission} from "./schema";
import databaseState from "../../database/state";

async function insert(permission: NewPermission): Promise<Permission | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .insertInto('permissions')
    .values(permission)
    .returningAll()
    .executeTakeFirst();
}

async function findByIdentifier(identifier: string): Promise<Permission | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('permissions')
    .selectAll()
    .where('identifier', '=', identifier)
    .executeTakeFirst();
}

const permissionsRepo = {
  insert,
  findByIdentifier
};

export default permissionsRepo;
