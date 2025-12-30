import CALLBACK_NAMES from "../../common/callback/callback-names";
import menuService from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import logger from "../logging/logger";
import triggerServerCallback from "../callback/outbound";

async function initialize() {
  const accessResult = await triggerServerCallback(CALLBACK_NAMES.MENU.ACCESS.MODERATION);

  if (undefined !== accessResult.error) {
    logger.warn(`error whilst checking access to moderation menu: ${accessResult.error.message}`);
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
}

function pressModerationItem() {
  menuService.openMenu(MENU_IDS.MODERATION.MAIN);
}

const moderationMenu = { initialize };

export default moderationMenu;
