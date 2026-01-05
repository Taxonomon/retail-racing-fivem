import databaseState from "../../database/state";
import {Generated, Insertable, Selectable, Updateable} from "kysely";

export interface PlayerSettingsTable {
  id: Generated<number>;
  player: number;
  settings: string;
}

export type PlayerSettings = Selectable<PlayerSettingsTable>;
export type NewPlayerSettings = Insertable<PlayerSettingsTable>;
export type PlayerSettingsUpdate = Updateable<PlayerSettingsTable>;


export async function insertPlayerSettings(
  playerSettings: NewPlayerSettings
): Promise<PlayerSettings | undefined> {
  return databaseState.db
    .withSchema('txn')
    .insertInto('player_settings')
    .values(playerSettings)
    .returningAll()
    .executeTakeFirst();
}

export async function findPlayerSettingsByPlayerId(
  player: number
): Promise<PlayerSettings | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('player_settings')
    .selectAll()
    .where('player', '=', player)
    .executeTakeFirst();
}

export async function updatePlayerSettingsByPlayerId(
  player: number,
  playerSettings: PlayerSettingsUpdate,
): Promise<PlayerSettings | undefined> {
  return databaseState.db
    .withSchema('txn')
    .updateTable('player_settings')
    .set(playerSettings)
    .where('player', '=', player)
    .returningAll()
    .executeTakeFirst();
}
