import {GameMode} from "../../common/game-mode/game-mode";
import {closeAllMenus, setMenuDisabled} from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {playerState} from "./state";
import logger from "../logging/logger";
import {loadHotLapMenu} from "../hot-lap/menu";

export function switchGameModeTo(gameMode: GameMode) {
  closeAllMenus();
  setMenuDisabled(MENU_IDS.MAIN, true);
  updateGameModeMenus(gameMode);
  setMenuDisabled(MENU_IDS.MAIN, false);
  playerState.gameMode = gameMode;
  logger.info(`Set game mode to ${gameMode}`);
}

export function updateGameModeMenus(gameMode: GameMode) {
  loadHotLapMenu(gameMode);
}
