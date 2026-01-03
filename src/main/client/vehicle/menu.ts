import menuService from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import vehicleDeleteService from "./delete/service";
import toast from "../gui/toasts/service";

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
    items: [
      {
        id: 'repair',
        title: 'Repair',
        description: 'Repair your current vehicle.',
        icon: ItemIconType.NONE,
        onPressed: pressRepairVehicleItem
      },
      {
        id: 'delete',
        title: 'Delete',
        description: 'Delete your current vehicle.',
        icon: ItemIconType.NONE,
        onPressed: pressDeleteVehicleItem
      }
    ]
  });
}

function pressRepairVehicleItem() {}

function pressDeleteVehicleItem() {
  const deleted = vehicleDeleteService.deleteCurrentVehicle();
  if (deleted) {
    toast.showInfo('Deleted vehicle');
  } else {
    toast.showWarning('Could not delete vehicle (see logs for details)');
  }
}

const vehicleMenu = { initialize };

export default vehicleMenu;
