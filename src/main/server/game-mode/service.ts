import playerState from "../player/state";
import logger from "../logging/logger";

export type GameMode = 'FREE_MODE' | 'HOT_LAP' | 'RACE';

export function setPlayerGameMode(netId: number, gameMode: GameMode) {
  const player = playerState.getConnectedPlayer(netId);
  player.gameMode = gameMode;
  logger.info(`Changed game mode of player to "${gameMode}"`)
}
