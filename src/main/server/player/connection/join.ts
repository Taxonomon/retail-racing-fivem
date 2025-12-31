import logger from "../../logging/logger";
import playerState from "../state";
import playerUtils from "../utils";

export default function registerOnPlayerJoinListener() {
  on('playerJoining', async (oldNetId: string) => {
    const newNetId = globalThis.source;
    handleJoiningPlayer(Number(oldNetId), Number(newNetId));
  });
}

function handleJoiningPlayer(oldNetId: number, newNetId: number) {
  // update connected player net id
  logger.trace(`playerState.connectedPlayers: ${JSON.stringify(playerState.connectedPlayers)}`);
  const connectedPlayer = playerState.getConnectedPlayer(oldNetId);
  const playerName = connectedPlayer?.nickname ?? playerUtils.getPlayerNameFromNetId(newNetId);

  if (undefined === connectedPlayer) {
    logger.warn(
      `cannot handle joining player "${playerName}": `
      + `no connected player found for net id ${oldNetId}`
    );
    return;
  }

  connectedPlayer.netId = newNetId;
  logger.debug(`finalized net id of joined player "${playerName}" (${oldNetId} to ${newNetId})`);

  const newPlayer = connectedPlayer.first_joined.getTime() === connectedPlayer.last_seen.getTime();
  if (newPlayer) {
    logger.info(`player "${connectedPlayer.nickname}" joined for the first time`);
  } else {
    logger.info(
      `player "${connectedPlayer.nickname}" joined `
      + `(last seen on ${connectedPlayer.last_seen.toISOString()})`
    );
  }
}


