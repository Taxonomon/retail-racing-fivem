import {NewPrincipal, Principal} from "./schema";
import databaseState from "../../database/state";

async function insert(principal: NewPrincipal): Promise<Principal | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .insertInto('principals')
    .values(principal)
    .returningAll()
    .executeTakeFirst();
}

async function findByIdentifier(identifier: string): Promise<Principal | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('principals')
    .selectAll()
    .where('identifier', '=', identifier)
    .executeTakeFirst();
}

const principalsRepo = {
  insert,
  findByIdentifier
};

export default principalsRepo;
