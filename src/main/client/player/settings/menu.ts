import menuService from "../../gui/menu/api/service";
import MENU_IDS from "../../gui/menu/menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";

export default function initializePlayerSettingsMenu() {
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
