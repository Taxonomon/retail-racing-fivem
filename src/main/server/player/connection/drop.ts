import playerState from "../state";
import logger from "../../logging/logger";
import {LOG_LEVELS} from "../../../common/logging/level";
import playerUtils from "../utils";

on('playerDropped', async (reason: string) => {
  const netId = globalThis.source;
  const connectedPlayer = playerState.getConnectedPlayer(netId);
  const playerName = connectedPlayer?.nickname ?? playerUtils.getPlayerNameFromNetId(netId);

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
});
