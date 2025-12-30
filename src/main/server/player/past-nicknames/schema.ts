import {ColumnType, Generated, Insertable, Selectable, Updateable} from "kysely";

export interface PastNicknamesTable {
  id: Generated<number>;
  player: number;
  nickname: string;
  active_until: ColumnType<Date, Date, never>
}

export type PastNickname = Selectable<PastNicknamesTable>;
export type NewPastNickname = Insertable<PastNicknamesTable>;
export type UpdatePastNickname = Updateable<PastNicknamesTable>;
