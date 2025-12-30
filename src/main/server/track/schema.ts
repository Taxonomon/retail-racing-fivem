import {ColumnType, Generated, Insertable, Selectable, Updateable} from "kysely";

export interface TracksTable {
  id: Generated<number>;
  name: string;
  author: string;
  description: string | null;
  rockstar_job_id: ColumnType<string,  string, never>;
  added_at: ColumnType<Date, Date, never>;
  added_by: ColumnType<number, number, never>;
  enabled: boolean;
  data: string; // jsonb in database // TODO change type of TracksTable.data to appropriate jsonb type
  hash: ColumnType<string, string, never>;
}

export type Track = Selectable<TracksTable>;
export type NewTrack = Insertable<TracksTable>;
export type TrackUpdate = Updateable<TracksTable>;
