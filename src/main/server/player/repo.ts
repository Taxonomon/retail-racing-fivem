import databaseState from "../database/state";
import {NewPlayer, Player, PlayerUpdate} from "./schema";

async function insert(player: NewPlayer): Promise<Player | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .insertInto('players')
    .values(player)
    .returningAll()
    .executeTakeFirst();
}

async function findByLicense2(license2: string): Promise<Player | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('players')
    .where('license2', '=', license2)
    .selectAll()
    .executeTakeFirst();
}

async function findById(id: number): Promise<Player | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('players')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
}

async function updateById(id: number, player: PlayerUpdate): Promise<Player | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .updateTable('players')
    .set(player)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
}

const playersRepo = {
  insert,
  findById,
  findByLicense2,
  updateById
};

export default playersRepo;
