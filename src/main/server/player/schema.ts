import {ColumnType, Generated, Insertable, Selectable, Updateable} from "kysely";

export interface PlayersTable {
  id: Generated<number>;
  nickname: string;
  license2: string;
  first_joined: ColumnType<Date, Date, never>; // select/insert Date, update never
  last_seen: Date;
}

export type Player = Selectable<PlayersTable>;
export type NewPlayer = Insertable<PlayersTable>;
export type PlayerUpdate = Updateable<PlayersTable>;
