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

const tracksRepo = {
  insert,
  findByRockstarJobId
};

export default tracksRepo;
