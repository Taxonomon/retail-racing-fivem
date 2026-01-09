import CALLBACK_NAMES from "../../common/callback/callback-names";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import logger from "../logging/logger";
import {addItemToMenu, addMenu, hasMenu, openMenu} from "../gui/menu/api/service";
import playSound from "../sound";
import toast from "../gui/toasts/service";
import Item from "../gui/menu/api/item";
import {triggerServerCallback} from "../callback/service/request";

export async function initializeAdministrationMenu() {
  const accessResult = await triggerServerCallback({
    identifier: CALLBACK_NAMES.MENU.ACCESS.ADMINISTRATION
  });

  if (undefined !== accessResult.error) {
    logger.warn(`Error whilst checking access to administration menu: ${accessResult.error}`);
    return;
  } else if (!accessResult.data) {
    return;
  }

  logger.debug(`Client is permitted access to administration menu`);

  addItemToMenu(
    MENU_IDS.MAIN,
    {
      id: 'administration',
      title: 'Administration',
      description: 'Contains various tools for server administrators.',
      onPressed: (item: Item) => pressAdministrationSubMenuItem(item),
      icon: ItemIconType.SUB_MENU
    },
    { first: true }
  );

  addMenu({
    id: MENU_IDS.ADMINISTRATION.MAIN,
    title: 'Administration',
    items: []
  });
}

function pressAdministrationSubMenuItem(item: Item) {
  const subMenuId = MENU_IDS.ADMINISTRATION.MAIN;
  try {
    openMenu(subMenuId);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to open menu "${item.title}" (id="${subMenuId}"): ${error.message}`);
    toast.showError(`Failed to open menu "${item.title}" (see logs for details)`);
    playSound.error();
  }
}

export function refreshAdministrationMenuTracks() {
  if (!hasMenu(MENU_IDS.ADMINISTRATION.MAIN)) {
    return;
  }
}
