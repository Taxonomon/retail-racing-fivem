import logger from "../logging/logger";
import gameModeState from "./state";
import MENU_IDS from "../gui/menu/menu-ids";
import {closeAllMenus, setMenuDisabled} from "../gui/menu/api/service";
import {loadHotLapMenu} from "./hot-lap/menu";
import menuState from "../gui/menu/state";

export function updateGameModeMenus() {
  if (!menuState.initialized) {
    logger.debug(`Will not update menus (menu isn't initialized)`);
    return;
  }

  const gameMode = gameModeState.gameMode;
  logger.debug(
    `Temporarily disabling main menu to update game mode menus `
    + `(with current game mode "${gameMode}")`
  );

  closeAllMenus();
  setMenuDisabled(MENU_IDS.MAIN, true);

  loadHotLapMenu(gameMode);

  setMenuDisabled(MENU_IDS.MAIN, false);
  logger.debug(`Updated game mode menus (with current game mode "${gameMode}")`);
}
