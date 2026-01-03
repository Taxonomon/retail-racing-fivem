import wait from "../../../common/wait";
import {Player} from "../schema";
import playersRepo from "../repo";
import pastNicknamesRepo from "../past-nicknames/repo";
import {PastNickname} from "../past-nicknames/schema";
import playerState from "../state";
import logger from "../../logging/logger";
import playerIdentifiers from "../identifiers";
import playerPrincipalsRepo from "../../authorization/player-principal/repo";
import {ConnectedPlayer} from "./connected-player";
import principalsRepo from "../../authorization/principal/repo";
import principalPermissionsRepo from "../../authorization/principal-permission/repo";
import {GameMode} from "../../game-mode/game-mode";
import playerSettingsRepo from "../settings/repo";

/**
 * <a href="https://docs.fivem.net/docs/scripting-reference/events/list/playerConnecting/">
 *   onPlayerConnecting - Deferrals - FiveM Docs
 * </a>
 */
type ConnectionDeferrals = {
  defer: () => void,
  handover: any, // no idea tbh
  presentCard: (card: object | string, callback?: (data: object, rawData: string) => void) => void,
  update: (message: string) => void,
  done: (failureReason?: string) => void
};

const deferralUtils = {
  defer: async (deferrals: ConnectionDeferrals) => {
    deferrals.defer();
    await wait.oneFrame();
  },
  updateMessage: async (deferrals: ConnectionDeferrals, msg: string) => {
    deferrals.update(msg);
    await wait.oneFrame();
  },
  endAsSuccess: async (deferrals: ConnectionDeferrals) => {
    deferrals.done();
    await wait.oneFrame();
  },
  endAsFailure: async (deferrals: ConnectionDeferrals, msg: string) => {
    deferrals.done(msg)
    await wait.oneFrame();
  }
};

export default function registerOnPlayerConnectingListener() {
  on('playerConnecting', async (
    playerName: string,
    setKickReason: (reason: string) => void,
    deferrals: ConnectionDeferrals
  ) => {
    // this is a temporary net id, assigned during the connection process.
    // will be switched with a final net id on playerJoining.
    const netId = globalThis.source;
    await handleConnectingPlayer(netId, playerName, setKickReason, deferrals);
  });
}

async function handleConnectingPlayer(
  netId: number,
  playerName: string,
  setKickReason: (reason: string) => void,
  deferrals: ConnectionDeferrals
) {
  try {
    // TODO refactor: split handleConnectingPlayer into multiple smaller, more readable functions
    await deferralUtils.defer(deferrals);

    await deferralUtils.updateMessage(deferrals, 'Checking if server is full...');
    const numberOfSlots = GetConvarInt('sv_maxclients', 48);

    if (playerState.connectedPlayers.length >= numberOfSlots) {
      logger.info(`Rejecting connecting player "${playerName}": server is full`);
      await deferralUtils.endAsFailure(deferrals, 'Server is full');
      return;
    }

    await deferralUtils.updateMessage(deferrals, 'Fetching player information...');

    const license2 = playerIdentifiers.getLicense2(netId);

    if (undefined === license2) {
      logger.info(`Rejecting connecting player "${playerName}": missing license2 identifier`);
      await deferralUtils.endAsFailure(deferrals, 'Missing license2 identifier');
      return;
    }

    let player: Player | undefined = await playersRepo.findByLicense2(license2);
    const now = new Date();

    await deferralUtils.updateMessage(deferrals, 'Persisting player information...');

    let persistedPlayer = undefined === player
      ? await handleNewPlayer(license2, playerName, now)
      : await handleReturningPlayer(player, playerName, now);

    if (undefined === persistedPlayer) {
      await deferralUtils.endAsFailure(
        deferrals,
        'Failed to handle player connection (internal server error)'
      );
      return;
    }

    await createPlayerSettingsEntryIfNeeded(persistedPlayer);

    await deferralUtils.updateMessage(deferrals, 'Finalizing connection...');

    const connectedPlayer = await toConnectedPlayer(netId, persistedPlayer);
    playerState.connectedPlayers.push(connectedPlayer);

    await deferralUtils.endAsSuccess(deferrals);
  } catch (error: any) {
    const errorMsg = 0 === error.message?.toString().trim().length ? error.stack : error.message;
    logger.error(`Failed to handle connecting player "${playerName}": ${errorMsg}`);
    await deferralUtils.endAsFailure(
      deferrals,
      'Failed to handle player connection (internal server error)'
    );
  }
}

async function handleNewPlayer(license2: string, playerName: string, now: Date) {
  return await playersRepo.insert({
    license2,
    first_joined: now,
    last_seen: now,
    nickname: playerName
  });
}

async function handleReturningPlayer(player: Player, playerName: string, now: Date) {
  const updatedPlayer = await playersRepo.updateById(player.id, {
    nickname: playerName,
    last_seen: now
  });

  if (undefined !== updatedPlayer) {
    await updatePlayerNicknameHistory(player, player.nickname, playerName, now);
  }

  return updatedPlayer;
}

async function updatePlayerNicknameHistory(player: Player, oldNickname: string, newNickname: string, now: Date) {
  if (newNickname !== oldNickname) {
    const newPastNickname: PastNickname | undefined = await pastNicknamesRepo.insert({
      player: player.id,
      nickname: oldNickname,
      active_until: now
    });

    if (undefined === newPastNickname) {
      throw new Error(
        'failed to update player nickname history (PastNickname db query returned undefined)'
      );
    }
  }
}

async function createPlayerSettingsEntryIfNeeded(player: Player) {
  const existingPlayerSettings = await playerSettingsRepo.findByPlayer(player.id);
  if (undefined === existingPlayerSettings) {
    await playerSettingsRepo.insert({
      player: player.id,
      settings: JSON.stringify(Object.fromEntries(new Map()))
    });
    logger.debug(`created new player settings entry for connecting player "${player.nickname}"`);
  }
}

async function toConnectedPlayer(netId: number, player: Player): Promise<ConnectedPlayer> {
  // fetch permissions and principal identifiers from db for player, and persist all as one object in state
  const principalIdentifiers: Set<string> = new Set();
  const permissionIdentifiers: Set<string> = new Set();
  const playerPrincipals = await playerPrincipalsRepo.findByPlayer(player);

  if (undefined !== playerPrincipals) {
    const principalIds = playerPrincipals.map(pp => pp.principal);
    const principals = await principalsRepo.findByIds(principalIds);
    const permissions = await principalPermissionsRepo.findPermissionsByPrincipalIds(principalIds);
    principals.forEach(principal => principalIdentifiers.add(principal.identifier));
    permissions.forEach(permission => permissionIdentifiers.add(permission.identifier));
  }

  return {
    ...player,
    netId,
    principals: Array.from(principalIdentifiers),
    permissions: Array.from(permissionIdentifiers),
    gameMode: GameMode.FREEMODE
  };
}
