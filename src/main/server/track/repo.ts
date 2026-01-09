import databaseState from "../database/state";

import {ColumnType, Generated, Insertable, Selectable, Updateable} from "kysely/dist/esm";

export interface TracksTable {
  id: Generated<number>;
  name: string;
  author: string;
  description: string | null;
  rockstar_job_id: string;
  added_at: ColumnType<Date, Date, never>;
  added_by: ColumnType<number, number, never>;
  enabled: boolean;
  // jsonb in database
  // TODO change type of RockstarJobsTable.data to appropriate jsonb type
  original_data: ColumnType<string, string, never>;
  current_data: string;
  hash_md5: ColumnType<string, string, never>;
}

export type Track = Selectable<TracksTable>;
export type NewTrack = Insertable<TracksTable>;
export type TrackUpdate = Updateable<TracksTable>;

export async function insert(
  track: NewTrack
): Promise<Track> {
  const result: Track | undefined = await databaseState.db
    .withSchema('txn')
    .insertInto('tracks')
    .values(track)
    .returningAll()
    .executeTakeFirst();

  if (undefined === result) {
    throw new Error('no entity returned from insert');
  }

  return result;
}

export async function findAll(): Promise<Track[]> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('tracks')
    .selectAll()
    .execute();
}

export async function findByRockstarJobId(
  rockstarJobId: string
): Promise<Track | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('tracks')
    .selectAll()
    .where('rockstar_job_id', '=', rockstarJobId)
    .executeTakeFirst();
}

export async function findByHashMd5(
  hashMd5: string
): Promise<Track | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('tracks')
    .selectAll()
    .where('hash_md5', '=', hashMd5)
    .executeTakeFirst();
}

export async function findByEnabled(
  enabled: boolean
): Promise<Track[]> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('tracks')
    .selectAll()
    .where('enabled', '=', enabled)
    .execute();
}
