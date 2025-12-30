import {NewPastNickname, PastNickname} from "./schema";
import databaseState from "../../database/state";
import {Player} from "../schema";

async function insert(pastNickname: NewPastNickname): Promise<PastNickname | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .insertInto('past_nicknames')
    .values(pastNickname)
    .returningAll()
    .executeTakeFirst();
}

async function findByPlayer(player: Player | number): Promise<PastNickname[] | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('past_nicknames')
    .selectAll()
    .where('player', '=', typeof player === 'number' ? player : player.id)
    .execute();
}

const pastNicknamesRepo = {
  insert,
  findByPlayer
};

export default pastNicknamesRepo;
