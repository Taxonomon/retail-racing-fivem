import CALLBACK_NAMES from "../../common/callback/callback-names";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import logger from "../logging/logger";
import {addItemToMenu, addMenu, openMenu} from "../gui/menu/api/service";
import Item from "../gui/menu/api/item";
import playSound from "../sound";
import toast from "../gui/toasts/service";
import {triggerServerCallback} from "../callback/service/request";

export async function initializeModerationMenu() {
  const accessResult = await triggerServerCallback({
    identifier: CALLBACK_NAMES.MENU.ACCESS.MODERATION
  });

  if (undefined !== accessResult.error) {
    logger.warn(`error whilst checking access to moderation menu: ${accessResult.error}`);
    return;
  } else if (!accessResult.data) {
    return;
  }

  logger.debug(`Client is permitted access to moderation menu`);

  // if permitted: insert moderation item in front of about item
  addItemToMenu(
    MENU_IDS.MAIN,
    {
      id: 'moderation',
      title: 'Moderation',
      description: 'Contains various tools for server moderators.',
      onPressed: (item: Item) => pressModerationSubMenuItem(item),
      icon: ItemIconType.SUB_MENU
    },
    { first: true }
  );

  addMenu({
    id: MENU_IDS.MODERATION.MAIN,
    title: 'Moderation',
    items: []
  });
}

function pressModerationSubMenuItem(item: Item) {
  const subMenuId = MENU_IDS.MODERATION.MAIN;
  try {
    openMenu(subMenuId);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to open menu "${item.title}" (id="${subMenuId}"): ${error.message}`);
    toast.showError(`Failed to open menu "${item.title}" (see logs for details)`);
    playSound.error();
  }
}
