import menuService from "../../gui/menu/api/service";
import MENU_IDS from "../../gui/menu/menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";

function initialize() {
  menuService.addItemToMenu(MENU_IDS.VEHICLE.MAIN, {
    id: 'spawn',
    title: 'Spawn Vehicle',
    description: 'Select a vehicle to spawn.',
    icon: ItemIconType.SUB_MENU,
    onPressed: () => menuService.openMenu(MENU_IDS.VEHICLE.SPAWN.MAIN)
  });

  menuService.addMenu({
    id: MENU_IDS.VEHICLE.SPAWN.MAIN,
    title: 'Spawn Vehicle',
    items: [
      {
        id: 'all',
        title: 'All',
        description: 'Browse all available vehicles, sorted by name alphabetically.',
        icon: ItemIconType.SUB_MENU,
        onPressed: () => menuService.openMenu(MENU_IDS.VEHICLE.SPAWN.ALL)
      },
      {
        id: 'by-model-id',
        title: 'By Model Id',
        description: 'Spawn a specific vehicle from a given model id.',
        icon: ItemIconType.INPUT,
        onPressed: pressSpawnVehicleByModelIdItem
      },
      {
        id: 'by-beginning-letter',
        title: 'By Beginning Letter',
        description: `Browse all available vehicles, categorized by their name's beginning letter.`,
        icon: ItemIconType.SUB_MENU,
        onPressed: () => menuService.openMenu(MENU_IDS.VEHICLE.SPAWN.BY_BEGINNING_LETTER)
      },
      {
        id: 'by-brand',
        title: 'By Brand',
        description: `Browse all available vehicles, categorized by their brand.`,
        icon: ItemIconType.SUB_MENU,
        onPressed: () => menuService.openMenu(MENU_IDS.VEHICLE.SPAWN.BY_BRAND)
      },
      {
        id: 'by-class',
        title: 'By Class',
        description: `Browse all available vehicles, categorized by their vehicle class.`,
        icon: ItemIconType.SUB_MENU,
        onPressed: () => menuService.openMenu(MENU_IDS.VEHICLE.SPAWN.BY_CLASS)
      }
    ]
  });

  // now onto registering all those "by-X" sub menus...
  // TODO implement "spawn vehicle by X" sub menus
}

function pressSpawnVehicleByModelIdItem() {
  // TODO implement "spawn vehicle by mode id"
}

const vehicleSpawnMenu = { initialize };

export default vehicleSpawnMenu;
