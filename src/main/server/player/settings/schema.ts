import {Generated, Insertable, Selectable, Updateable} from "kysely";

export interface PlayerSettingsTable {
  id: Generated<number>;
  player: number;
  settings: string;
}

export type PlayerSettings = Selectable<PlayerSettingsTable>;
export type NewPlayerSettings = Insertable<PlayerSettingsTable>;
export type PlayerSettingsUpdate = Updateable<PlayerSettingsTable>;
