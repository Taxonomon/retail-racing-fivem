import {setHotLapMenuBasedOnGameMode} from "./hot-lap/menu";
import logger from "../logging/logger";
import gameModeState from "./state";

export function updateGameModeMenus() {
  setHotLapMenuBasedOnGameMode();
  logger.info(`Configured game mode menus for game mode "${gameModeState.gameMode}"`);
}
