import menuService from "../../gui/menu/api/service";
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
import {savePlayerSettings} from "./service";

export function initializePlayerSettingsMenu() {
  menuService.addItemToMenu(MENU_IDS.MAIN, {
    id: 'settings',
    title: 'Settings',
    description: 'Customize your server experience by adjusting various settings.',
    icon: ItemIconType.SUB_MENU,
    onPressed: () => menuService.openMenu(MENU_IDS.SETTINGS.MAIN)
  }, { first: true });

  menuService.addMenu({
    id: MENU_IDS.SETTINGS.MAIN,
    title: 'Settings',
    items: [
      {
        id: 'save',
        title: 'Save',
        description: `Persist your settings on the server.`,
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
