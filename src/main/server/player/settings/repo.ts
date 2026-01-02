import {NewPlayerSettings, PlayerSettings, PlayerSettingsUpdate} from "./schema";
import databaseState from "../../database/state";
import {Player} from "../schema";

async function insert(playerSettings: NewPlayerSettings): Promise<PlayerSettings | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .insertInto('player_settings')
    .values(playerSettings)
    .returningAll()
    .executeTakeFirst();
}

async function findByPlayer(player: Player | number): Promise<PlayerSettings | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('player_settings')
    .selectAll()
    .where('player', '=', typeof player === 'number' ? player : player.id)
    .executeTakeFirst();
}

async function updateByPlayer(
  playerSettings: PlayerSettingsUpdate,
  player: Player | number
): Promise<PlayerSettings | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .updateTable('player_settings')
    .set(playerSettings)
    .where('player', '=', typeof player === 'number' ? player : player.id)
    .returningAll()
    .executeTakeFirst();
}

const playerSettingsRepo = {
  insert,
  findByPlayer,
  updateByPlayer
};

export default playerSettingsRepo;
