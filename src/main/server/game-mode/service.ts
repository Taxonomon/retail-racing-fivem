import playerState from "../player/state";
import logger from "../logging/logger";
import {GameMode} from "../../common/game-mode/game-mode";

export function setPlayerGameMode(netId: number, gameMode: GameMode) {
  const player = playerState.getConnectedPlayer(netId);
  player.gameMode = gameMode;
  logger.info(`Changed game mode of player to "${gameMode}"`)
}
