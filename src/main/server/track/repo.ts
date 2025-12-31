import {NewTrack, Track} from "./schema";
import databaseState from "../database/state";

async function insert(track: NewTrack): Promise<Track | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .insertInto('tracks')
    .values(track)
    .returningAll()
    .executeTakeFirst();
}

async function findByRockstarJobId(rockstarJobId: string): Promise<Track | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('tracks')
    .selectAll()
    .where('rockstar_job_id', '=', rockstarJobId)
    .executeTakeFirst();
}

async function findByHashMd5(hashMd5: string): Promise<Track | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('tracks')
    .selectAll()
    .where('hash_md5', '=', hashMd5)
    .executeTakeFirst();
}

const tracksRepo = {
  insert,
  findByRockstarJobId,
  findByHashMd5
};

export default tracksRepo;
