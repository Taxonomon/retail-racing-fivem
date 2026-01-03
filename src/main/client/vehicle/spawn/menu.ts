import menuService from "../../gui/menu/api/service";
import MENU_IDS from "../../gui/menu/menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import vehicleSpawnService from "./service";
import nativeTextInput from "../../gui/native/text-input";
import toast from "../../gui/toasts/service";
import logger from "../../logging/logger";
import playSound from "../../sound";
import {SpawnableVehicle} from "./types";
import vehicleUtilService from "../util/service";
import vehicleState from "../state";

async function initialize() {
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

  const spawnableVehicles: SpawnableVehicle[] = await vehicleSpawnService.getAllSpawnableVehicles();
  const sortedByLabel = SpawnableVehicle.sortByLabel(spawnableVehicles);

  menuService.addMenu({
    id: MENU_IDS.VEHICLE.SPAWN.ALL,
    title: 'All Vehicles',
    items: sortedByLabel.map(vehicle => ({
      id: vehicle.model,
      title: vehicle.label,
      description: `${vehicle.brand} ${vehicle.label} (${vehicle.model})`,
      icon: ItemIconType.NONE,
      onPressed: () => pressSpawnVehicleItem(vehicle)
    }))
  });

  // TODO implement "spawn vehicle by X" sub menus
}

async function pressSpawnVehicleByModelIdItem() {
  const inputResult = await nativeTextInput.showAndWait({
    title: 'Spawn vehicle by model id (max 32 characters)',
    maxLength: 32
  });

  if (!inputResult.success) {
    return;
  }

  const modelId = inputResult.value;

  vehicleState.spawnInProgress = true;

  try {
    await vehicleSpawnService.spawnByModelId(modelId);
    const vehicleName = vehicleUtilService.getLabelFromHash(GetHashKey(modelId!));
    toast.showInfo(`Spawned vehicle "${vehicleName}" (${modelId})`);
    playSound.select();
  } catch (error: any) {
    const msg = `Failed to spawn vehicle "${modelId}": ${error.message}`;
    logger.error(msg);
    toast.showError(msg);
    playSound.error();
  }
}

async function pressSpawnVehicleItem(vehicle: SpawnableVehicle) {
  try {
    await vehicleSpawnService.spawnByModelId(vehicle.model);
    toast.showInfo(`Spawned vehicle "${vehicle.label}" (${vehicle.model})`);
    playSound.select();
  } catch (error: any) {
    const msg = `Failed to spawn vehicle "${vehicle.model}": ${error.message}`;
    logger.error(msg);
    toast.showError(msg);
    playSound.error();
  }
}

const vehicleSpawnMenu = { initialize };

export default vehicleSpawnMenu;
