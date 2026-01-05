import {findPlayerByLicense2, Player} from "./database";
import logger from "../logging/logger";
import playerState from "./state";
import EVENT_NAMES from "../../common/event-names";

const UPDATE_PLAYER_PINGS_INTERVAL_MS = 10000;

export async function getPlayerFromNetId(netId: number): Promise<Player | undefined> {
  const license2 = getPlayerLicense2ByNetId(netId);
  if (undefined === license2) {
    throw new Error(`no license2 identifier found for net id ${netId}`);
  }
  return findPlayerByLicense2(license2);
}

export function getPlayerNameFromNetId(netId: number): string {
  return GetPlayerName(netId);
}

export function getPlayerLicense2ByNetId(netId: number): string | undefined {
  const license2 = GetPlayerIdentifierByType(netId.toString(), 'license2');

  if (undefined === license2 || null === license2) {
    logger.warn(`Did not find a license2 identifier for net id ${netId}`);
    return undefined;
  }

  // raw result looks like this: "license2:dflgjhdflghjdfsgjlhdfs", so we split the prefix
  return license2.split(':')[1];
}

export function startUpdatingPlayerPings() {
  playerState.updatePings.start(
    updatePlayerPings,
    UPDATE_PLAYER_PINGS_INTERVAL_MS
  );
}

function updatePlayerPings() {
  const netIds: string[] = getPlayers();

  // update pings
  netIds.forEach(netId => {
    const ping = GetPlayerPing(netId);
    playerState.pings.set(netId, ping);
    emitNet(EVENT_NAMES.PLAYER.PING, netId, ping);
  });

  // remove entries of disconnected players
  playerState.pings.keys().forEach(netId => {
    if (!netIds.includes(netId)) {
      playerState.pings.delete(netId);
    }
  });
}


