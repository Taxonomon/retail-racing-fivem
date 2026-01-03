import logger from "../../logging/logger";
import playerState from "../state";
import playerUtils from "../utils";
import {ConnectedPlayer} from "./connected-player";

export default function registerOnPlayerJoinListener() {
  on('playerJoining', async (oldNetId: string) => {
    const newNetId = globalThis.source;
    handleJoiningPlayer(Number(oldNetId), Number(newNetId));
  });
}

function handleJoiningPlayer(oldNetId: number, newNetId: number) {
  // update connected player net id
  const connectedPlayer = playerState.getConnectedPlayer(oldNetId);
  const playerName = connectedPlayer?.nickname ?? playerUtils.getPlayerNameFromNetId(newNetId);

  if (undefined === connectedPlayer) {
    logger.warn(
      `cannot handle joining player "${playerName}": `
      + `no connected player found for net id ${oldNetId}`
    );
    return;
  }

  finalizeNetId(connectedPlayer, newNetId);

  if (connectedPlayer.first_joined.getTime() === connectedPlayer.last_seen.getTime()) {
    logger.info(`player "${connectedPlayer.nickname}" joined for the first time`);
  } else {
    logger.info(
      `player "${connectedPlayer.nickname}" joined `
      + `(last seen on ${connectedPlayer.last_seen.toISOString()})`
    );
  }
}

function finalizeNetId(connectedPlayer: ConnectedPlayer, newNetId: number) {
  const oldNetId = connectedPlayer.netId;
  connectedPlayer.netId = newNetId;
  logger.debug(`finalized net id of joined player "${connectedPlayer.nickname}" (${oldNetId} to ${newNetId})`);
}


