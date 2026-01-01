import CALLBACK_NAMES from "../../common/callback/callback-names";
import menuService from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import logger from "../logging/logger";
import callbackService from "../callback/outbound";

export default async function initializeAdministrationMenu() {
  const accessResult = await callbackService.triggerServerCallback(CALLBACK_NAMES.MENU.ACCESS.ADMINISTRATION);

  if (undefined !== accessResult.error) {
    logger.warn(`error whilst checking access to administration menu: ${accessResult.error}`);
    return;
  } else if (!accessResult.data) {
    logger.debug(`client is not permitted access to administration menu`);
    return;
  }

  menuService.addItemToMenu(
    MENU_IDS.MAIN,
    {
      id: 'administration',
      title: 'Administration',
      description: 'Contains various tools for server administrators.',
      onPressed: pressAdministrationItem,
      icon: ItemIconType.SUB_MENU
    },
    { after: 'moderation' }
  );

  menuService.addMenu({
    id: MENU_IDS.ADMINISTRATION.MAIN,
    title: 'Administration',
    items: []
  });
}

function pressAdministrationItem() {
  menuService.openMenu(MENU_IDS.ADMINISTRATION.MAIN);
}
