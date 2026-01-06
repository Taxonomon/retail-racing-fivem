import logger from "../logging/logger";
import gameModeState from "./state";
import {updateGameModeMenus} from "./menu";
import {GameMode} from "../../common/game-mode/game-mode";

export function switchGameModeTo(gameMode: GameMode) {
  gameModeState.gameMode = gameMode;
  updateGameModeMenus();
  logger.info(`Switched game mode to "${gameMode}"`);
}
