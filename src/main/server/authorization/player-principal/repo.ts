import {NewPlayerPrincipal, PlayerPrincipal} from "./schema";
import databaseState from "../../database/state";
import {Player} from "../../player/schema";
import {Permission} from "../permission/schema";
import {Principal} from "../principal/schema";

async function insert(playerPrincipal: NewPlayerPrincipal): Promise<PlayerPrincipal | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .insertInto('player_principals')
    .values(playerPrincipal)
    .returningAll()
    .executeTakeFirst();
}

async function findByPlayer(player: Player | number): Promise<PlayerPrincipal[] | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('player_principals')
    .selectAll()
    .where('player', '=', typeof player === 'number' ? player : player.id)
    .execute();
}

async function existsByPlayer(player: Player | number): Promise<boolean> {
  const result = await findByPlayer(player);
  return undefined !== result && result.length > 0;
}

async function findByPlayerAndPrincipal(
  player: Player | number,
  principal: Principal | number
): Promise<PlayerPrincipal | undefined> {
  return await databaseState.db
    .withSchema('txn')
    .selectFrom('player_principals')
    .selectAll()
    .where('player', '=', typeof player === 'number' ? player : player.id)
    .where('principal', '=', typeof principal === 'number' ? principal : principal.id)
    .executeTakeFirst();
}

async function findByPlayerAndPrincipalIds(
  player: Player | number,
  principalIds: number[]
): Promise<PlayerPrincipal[] | undefined> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('player_principals')
    .selectAll()
    .where('player', '=', typeof player === 'number' ? player : player.id)
    .where('principal', 'in', principalIds)
    .execute();
}

async function findByPlayerAndPermissionIdentifier(
  player: Player | number,
  permissionIdentifier: string
): Promise<PlayerPrincipal[]> {
  return databaseState.db
    .withSchema('txn')
    .selectFrom('player_principals')
    .selectAll()
    .leftJoin('principal_permissions', 'player_principals.principal', 'principal_permissions.principal')
    .leftJoin('permissions', 'principal_permissions.permission', 'permissions.id')
    .where('player_principals.player', '=', typeof player === 'number' ? player : player.id)
    .where('permissions.identifier', '=', permissionIdentifier)
    .execute();
}

const playerPrincipalsRepo = {
  insert,
  findByPlayer,
  findByPlayerAndPrincipal,
  findByPlayerAndPrincipalIds,
  findByPlayerAndPermissionIdentifier,
  existsByPlayer
};

export default playerPrincipalsRepo;
