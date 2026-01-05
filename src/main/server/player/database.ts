import {ColumnType, Generated, Insertable, Selectable, Updateable} from "kysely";
import databaseState from "../database/state";

export interface PlayersTable {
  id: Generated<number>;
  nickname: string;
  license2: string;
  first_joined: ColumnType<Date, Date, never>; // select/insert Date, update never
  last_seen: Date;
}

export interface PastNicknamesTable {
  id: Generated<number>;
  player: number;
  nickname: string;
  active_until: ColumnType<Date, Date, never>
}

export type Player = Selectable<PlayersTable>;
export type NewPlayer = Insertable<PlayersTable>;
export type PlayerUpdate = Updateable<PlayersTable>;

export type PastNickname = Selectable<PastNicknamesTable>;
export type NewPastNickname = Insertable<PastNicknamesTable>;
export type UpdatePastNickname = Updateable<PastNicknamesTable>;

export async function insertPlayer(player: NewPlayer): Promise<Player | undefined> {
  return databaseState.db
    .withSchema('txn')
    .insertInto('players')
    .values(player)
    .returningAll()
    .executeTakeFirst();
}

export async function findPlayerByLicense2(license2: string): Promise<Player | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('players')
    .where('license2', '=', license2)
    .selectAll()
    .executeTakeFirst();
}

export async function findPlayerById(id: number): Promise<Player | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('players')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
}

export async function updatePlayerById(id: number, player: PlayerUpdate): Promise<Player | undefined> {
  return databaseState.db
    .withSchema('txn')
    .updateTable('players')
    .set(player)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
}

export async function insertPastNickname(pastNickname: NewPastNickname): Promise<PastNickname | undefined> {
  return databaseState.db
    .withSchema('txn')
    .insertInto('past_nicknames')
    .values(pastNickname)
    .returningAll()
    .executeTakeFirst();
}

export async function findPastNicknamesByPlayer(player: Player | number): Promise<PastNickname[] | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('past_nicknames')
    .selectAll()
    .where('player', '=', typeof player === 'number' ? player : player.id)
    .execute();
}
