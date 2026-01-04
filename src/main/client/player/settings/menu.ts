import MENU_IDS from "../../gui/menu/menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import logger from "../../logging/logger";
import toast from "../../gui/toasts/service";
import playSound from "../../sound";
import {initializeTimePlayerSettingsMenu} from "../../time/menu";
import {initializeTrafficPlayerSettingsMenu} from "../../traffic/menu";
import {initializeWeatherPlayerSettingsMenu} from "../../weather/menu";
import {initializeHudPlayerSettingsMenu} from "../../gui/hud/menu";
import {initializeVehiclePlayerSettingsMenu} from "../../vehicle/menu";
import {SAVE_PLAYER_SETTINGS_INTERVAL_MS, savePlayerSettings} from "./service";
import {addItemToMenu, addMenu, openMenu} from "../../gui/menu/api/service";
import Item from "../../gui/menu/api/item";

export function initializePlayerSettingsMenu() {
  addItemToMenu(MENU_IDS.MAIN, {
    id: 'settings',
    title: 'Settings',
    description: 'Customize your server experience by adjusting various settings.',
    icon: ItemIconType.SUB_MENU,
    onPressed: (item: Item) => pressSettingsSubMenuItem(item)
  }, { first: true });

  addMenu({
    id: MENU_IDS.SETTINGS.MAIN,
    title: 'Settings',
    items: [
      {
        id: 'save',
        title: 'Save',
        description:
          `Persist your settings on the server.<br><br>`
          + `(Unsaved settings will be saved to the server automatically every `
          + `${SAVE_PLAYER_SETTINGS_INTERVAL_MS / 1000} seconds.)`,
        icon: ItemIconType.NONE,
        onPressed: pressSaveSettingsItem
      }
    ]
  });

  // all below menus will add their items at the top of the menu successively,
  // on top of the above default items.
  initializeHudPlayerSettingsMenu();
  initializeTrafficPlayerSettingsMenu();
  initializeTimePlayerSettingsMenu();
  initializeWeatherPlayerSettingsMenu();
  initializeVehiclePlayerSettingsMenu();
}

function pressSettingsSubMenuItem(item: Item) {
  const subMenuId = MENU_IDS.SETTINGS.MAIN;
  try {
    openMenu(subMenuId);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to open menu "${item.title}" (id="${subMenuId}": ${error.message}`);
    toast.showError(`Failed to open menu "${item.title}" (see logs for details)`);
    playSound.error();
  }
}

async function pressSaveSettingsItem() {
  try {
    await savePlayerSettings();
    logger.info(`saved player settings`);
    toast.showInfo('Saved player settings');
    playSound.select();
  } catch (error: any) {
    logger.error(`failed to save player settings: ${error.message}`);
    toast.showError(`Failed to save player settings (see logs for details)`);
    playSound.error();
  }
}
