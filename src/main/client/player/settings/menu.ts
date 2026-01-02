import menuService from "../../gui/menu/api/service";
import MENU_IDS from "../../gui/menu/menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import playerSettingsService from "./service";
import logger from "../../logging/logger";
import toast from "../../gui/toasts/service";
import playSound from "../../sound";

function initializeMenu() {
  menuService.addItemToMenu(MENU_IDS.MAIN, {
    id: 'settings',
    title: 'Settings',
    description: 'Customize your server experience by adjusting various settings.',
    icon: ItemIconType.SUB_MENU,
    onPressed: () => menuService.openMenu(MENU_IDS.SETTINGS.MAIN)
  });

  menuService.addMenu({
    id: MENU_IDS.SETTINGS.MAIN,
    title: 'Settings',
    items: []
  });
}

function initializeSaveItem() {
  menuService.addItemToMenu(MENU_IDS.SETTINGS.MAIN, {
    id: 'save',
    title: 'Save',
    description: `Persist your settings on the server.`,
    icon: ItemIconType.NONE,
    onPressed: pressSaveSettingsItem
  });
}

async function pressSaveSettingsItem() {
  try {
    await playerSettingsService.saveSettings();
    logger.info(`saved player settings`);
    toast.showInfo('Saved player settings');
    playSound.select();
  } catch (error: any) {
    logger.error(`failed to save player settings: ${error.message}`);
    toast.showError(`Failed to save player settings (see logs for details)`);
    playSound.error();
  }
}

const playerSettingsMenu = {
  initializeMenu,
  initializeSaveItem
};

export default playerSettingsMenu;
