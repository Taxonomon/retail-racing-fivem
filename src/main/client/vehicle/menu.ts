import menuService from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";

function initialize() {
  menuService.addItemToMenu(MENU_IDS.MAIN, {
    id: 'vehicle',
    title: 'Vehicle',
    description: 'Browse, spawn or customize vehicles.',
    icon: ItemIconType.SUB_MENU,
    onPressed: () => menuService.openMenu(MENU_IDS.VEHICLE.MAIN)
  });

  menuService.addMenu({
    id: MENU_IDS.VEHICLE.MAIN,
    title: 'Vehicle',
    items: []
  });
}

const vehicleMenu = { initialize };

export default vehicleMenu;
