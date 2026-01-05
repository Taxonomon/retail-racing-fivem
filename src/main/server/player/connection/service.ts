import {waitOneFrame} from "../../../common/wait";
import playerState from "../state";
import logger from "../../logging/logger";
import {findPlayerByLicense2, insertPastNickname, insertPlayer, Player, updatePlayerById} from "../database";
import {
  findPlayerPrincipalsByPlayerId,
  findPrincipalPermissionsByPrincipalIds,
  findPrincipalsByIds
} from "../authorization/database";
import {getOrCreatePlayerSettingsByPlayerId} from "../settings/service";
import {LOG_LEVELS} from "../../../common/logging/level";
import {getPlayerLicense2ByNetId, getPlayerNameFromNetId} from "../service";
import EVENT_NAMES from "../../../common/event-names";
import {GameMode} from "../../../common/game-mode/game-mode";

/**
 * <a href="https://docs.fivem.net/docs/scripting-reference/events/list/playerConnecting/">
 *   onPlayerConnecting - Deferrals - FiveM Docs
 * </a>
 */
type ConnectionDeferralProps = {
  defer: () => void,
  handover: any, // no idea tbh
  presentCard: (card: object | string, callback?: (data: object, rawData: string) => void) => void,
  update: (message: string) => void,
  done: (failureReason?: string) => void
};

class ConnectionDeferrals {
  props: ConnectionDeferralProps

  constructor(props: ConnectionDeferralProps) {
    this.props = props;
  }

  async defer() {
    this.props.defer();
    await waitOneFrame();
  }

  async updateMessage(message: string) {
    this.props.update(message);
    await waitOneFrame();
  }

  async endAsSuccess() {
    this.props.done();
    await waitOneFrame();
  }

  async endAsFailure(message: string) {
    this.props.done(message);
    await waitOneFrame();
  }
}

export type ConnectedPlayer = Player & {
  netId: number;
  principals: string[];
  permissions: string[];
  gameMode: GameMode;
};

export function registerPlayerConnectionEventListeners() {
  on('playerConnecting', async (
    playerName: string,
    setKickReason: (reason: string) => void,
    deferrals: ConnectionDeferralProps
  ) => {
    // this is a temporary net id, assigned during the connection process.
    // will be switched with a final net id on playerJoining.
    const netId = globalThis.source;
    await handleConnectingPlayer(netId, playerName, new ConnectionDeferrals(deferrals));
  });

  on('playerJoining', async (oldNetId: string) => {
    const newNetId = globalThis.source;
    handleJoiningPlayer(Number(oldNetId), Number(newNetId));
  });

  on('playerDropped', (reason: string) => {
    const netId = globalThis.source;
    handleDroppedPlayer(netId, reason);
  });

  onNet(EVENT_NAMES.PLAYER.KICK.SELF, (reason: string) => {
    kickPlayerByNetId(globalThis.source.toString(), reason);
  });
}

async function handleConnectingPlayer(
  netId: number,
  playerName: string,
  deferrals: ConnectionDeferrals
): Promise<void> {
  try {
    await deferrals.defer();

    await deferrals.updateMessage('Checking if server is full...');
    const numberOfSlots = GetConvarInt('sv_maxclients', 48);

    if (playerState.connectedPlayers.length >= numberOfSlots) {
      logger.info(`Rejecting connecting player "${playerName}": server is full`);
      await deferrals.endAsFailure('Server is full');
      return;
    }

    await deferrals.updateMessage('Fetching player information...');

    const license2 = getPlayerLicense2ByNetId(netId);

    if (undefined === license2) {
      logger.info(`Rejecting connecting player "${playerName}": missing license2 identifier`);
      await deferrals.endAsFailure('Missing license2 identifier');
      return;
    }

    let player: Player | undefined = await findPlayerByLicense2(license2);
    const now = new Date();

    await deferrals.updateMessage('Persisting player information...');

    let persistedPlayer = undefined === player
      // player is joining for the first time
      ? await insertPlayer({
        license2,
        first_joined: now,
        last_seen: now,
        nickname: playerName
      })
      // player is rejoining
      : await updatePlayerById(player.id, {
        nickname: playerName,
        last_seen: now
      });

    if (undefined === persistedPlayer) {
      await deferrals.endAsFailure('Failed to handle player connection (internal server error)');
      return;
    }

    await updatePlayerNicknameHistory(persistedPlayer, persistedPlayer.nickname, playerName, now);

    // This will either create new player settings for the connecting player,
    // or, if settings already exist, do nothing.
    await getOrCreatePlayerSettingsByPlayerId(persistedPlayer.id);

    playerState.connectedPlayers.push(await toConnectedPlayer(persistedPlayer, netId));

    await deferrals.endAsSuccess();
  } catch (error: any) {
    const errorMsg = 0 === error.message?.toString().trim().length ? error.stack : error.message;
    logger.error(`Failed to handle connecting player "${playerName}": ${errorMsg}`);
    await deferrals.endAsFailure('Failed to handle player connection (internal server error)');
  }
}

async function toConnectedPlayer (player: Player, netId: number): Promise<ConnectedPlayer> {
  const principalIdentifiers: Set<string> = new Set();
  const permissionIdentifiers: Set<string> = new Set();
  const playerPrincipals = await findPlayerPrincipalsByPlayerId(player.id);

  if (undefined !== playerPrincipals && playerPrincipals.length > 0) {
    const principalIds = playerPrincipals.map(pp => pp.principal);
    const principals = await findPrincipalsByIds(principalIds);
    const permissions = await findPrincipalPermissionsByPrincipalIds(principalIds);
    principals.forEach(principal => principalIdentifiers.add(principal.identifier));
    permissions.forEach(permission => permissionIdentifiers.add(permission.identifier));
  }

  return {
    ...player,
    netId,
    gameMode: 'FREE_MODE',
    principals: Array.from(principalIdentifiers),
    permissions: Array.from(permissionIdentifiers),
  };
}

async function updatePlayerNicknameHistory(
  player: Player,
  oldNickname: string,
  newNickname: string,
  oldNicknameActiveUntil: Date
) {
  if (newNickname !== oldNickname) {
    logger.debug(`Persisting old nickname "${oldNickname}" of player "${newNickname}" in nickname history`);
    await insertPastNickname({
      player: player.id,
      nickname: oldNickname,
      active_until: oldNicknameActiveUntil
    });
  }
}

function handleJoiningPlayer(oldNetId: number, newNetId: number) {
  const player = playerState.getConnectedPlayer(oldNetId);
  player.netId = newNetId;

  logger.debug(
    `Finalized net id of joining player "${player.nickname}" `
    + `(${oldNetId} to ${newNetId})`
  );

  if (player.first_joined.getTime() === player.last_seen.getTime()) {
    logger.info(`Player "${player.nickname}" joined for the first time`);
  } else {
    // TODO consider adding "seen 123 minutes/hours/days/weeks/months ago" to player join message
    logger.info(
      `Player "${player.nickname}" joined `
      + `(last seen on ${player.last_seen.toISOString()})`
    );
  }
}

function handleDroppedPlayer(netId: number, reason: string) {
  const connectedPlayer = playerState.getConnectedPlayer(netId);
  const playerName = connectedPlayer?.nickname ?? getPlayerNameFromNetId(netId);

  if (undefined === connectedPlayer) {
    logger.warn(
      `Failed to handle dropped player "${playerName}" (net id ${netId}): `
      + `no player of given net id found in state`
    );
  } else {
    playerState.removeConnectedPlayer(netId);
  }

  logger.logClientMessage(-1, LOG_LEVELS.INFO, `"${playerName}" disconnected`);
  logger.info(`"${playerName}" disconnected (${reason})`);
}

export function kickAllPlayers(reason: string) {
  getPlayers().forEach(netId => kickPlayerByNetId(netId, reason));
}

export function kickPlayerByNetId(netId: string, reason: string) {
  DropPlayer(netId, reason);
  logger.info(
    `Kicked player "${getPlayerNameFromNetId(Number(netId))}" `
    + `(net id ${netId}): ${reason}`
  );
}
