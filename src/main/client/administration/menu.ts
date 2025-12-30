import CALLBACK_NAMES from "../../common/callback/callback-names";
import menuService from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import logger from "../logging/logger";
import triggerServerCallback from "../callback/outbound";

async function initialize() {
  const accessResult = await triggerServerCallback(CALLBACK_NAMES.MENU.ACCESS.ADMINISTRATION);

  if (undefined !== accessResult.error) {
    logger.warn(`error whilst checking access to administration menu: ${accessResult.error.message}`);
    return;
  } else if (!accessResult.data) {
    logger.debug(`client is not permitted access to administration menu`);
    return;
  }

  // if permitted: insert administration item in front of about item
  menuService.addItemToMenu(
    MENU_IDS.MAIN,
    {
      id: 'administration',
      title: 'Administration',
      description: 'Contains various tools for server administrators.',
      onPressed: pressModerationItem,
      icon: ItemIconType.SUB_MENU
    },
    { after: 'moderation' }
  );
}

function pressModerationItem() {
  menuService.openMenu(MENU_IDS.MODERATION.MAIN);
}

const administrationMenu = { initialize };

export default administrationMenu;
