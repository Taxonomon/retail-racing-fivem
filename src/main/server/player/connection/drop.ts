import playerState from "../state";
import logger from "../../logging/logger";

on('playerDropped', async (reason: string) => {
  const netId = globalThis.source;
  const playerName = GetPlayerName(netId);
  logger.info(`"${playerName}" disconnected (${reason})`);
  playerState.connected -= 1;
  // TODO notify other players via UI notification about a player leaving
});
