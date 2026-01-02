import CALLBACK_NAMES from "../../common/callback/callback-names";
import menuService from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import logger from "../logging/logger";
import triggerServerCallback from "../callback/outbound";
import callbackService from "../callback/outbound";

export default async function initializeModerationMenu() {
  const accessResult = await callbackService.triggerServerCallback(CALLBACK_NAMES.MENU.ACCESS.MODERATION);

  if (undefined !== accessResult.error) {
    logger.warn(`error whilst checking access to moderation menu: ${accessResult.error}`);
    return;
  } else if (!accessResult.data) {
    logger.debug(`client is not permitted access to moderation menu`);
    return;
  }

  // if permitted: insert moderation item in front of about item
  menuService.addItemToMenu(
    MENU_IDS.MAIN,
    {
      id: 'moderation',
      title: 'Moderation',
      description: 'Contains various tools for server moderators.',
      onPressed: pressModerationItem,
      icon: ItemIconType.SUB_MENU
    },
    { before: 'about' }
  );

  menuService.addMenu({
    id: MENU_IDS.MODERATION.MAIN,
    title: 'Moderation',
    items: []
  });
}

function pressModerationItem() {
  menuService.openMenu(MENU_IDS.MODERATION.MAIN);
}
