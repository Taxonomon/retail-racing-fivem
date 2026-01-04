import databaseState from "../database/state";
import {Generated, Insertable, Selectable, Updateable} from "kysely";
import {ColumnType} from "kysely/dist/esm";

export interface RockstarJobsTable {
  id: Generated<number>;
  name: string;
  author: string;
  description: string | null;
  job_id: string;
  added_at: ColumnType<Date, Date, never>;
  added_by: ColumnType<number, number, never>;
  enabled: boolean;
  // jsonb in database
  // TODO change type of RockstarJobsTable.data to appropriate jsonb type
  data: string;
  hash_md5: ColumnType<string, string, never>;
}

export type RockstarJob = Selectable<RockstarJobsTable>;
export type NewRockstarJob = Insertable<RockstarJobsTable>;
export type RockstarJobUpdate = Updateable<RockstarJobsTable>;

export async function insertRockstarJob(rockstarJob: NewRockstarJob): Promise<RockstarJob> {
  const result: RockstarJob | undefined = await databaseState.db
    .withSchema('txn')
    .insertInto('rockstar_jobs')
    .values(rockstarJob)
    .returningAll()
    .executeTakeFirst();

  if (undefined === result) {
    throw new Error('no entity returned from insert');
  }

  return result;
}

export async function findRockstarJobByJobId(jobId: string): Promise<RockstarJob | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('rockstar_jobs')
    .selectAll()
    .where('job_id', '=', jobId)
    .executeTakeFirst();
}

export async function findRockstarJobByHashMd5(hashMd5: string): Promise<RockstarJob | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('rockstar_jobs')
    .selectAll()
    .where('hash_md5', '=', hashMd5)
    .executeTakeFirst();
}
