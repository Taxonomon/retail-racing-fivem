import {GameMode} from "../../server/game-mode/service";
import gameModeState from "./state";
import {updateGameModeMenus} from "./menu";
import logger from "../logging/logger";

export function switchGameModeTo(gameMode: GameMode) {
  gameModeState.gameMode = gameMode;
  updateGameModeMenus();
  logger.info(`Switched game mode to "${gameMode}"`);
}
