import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import toast from "../gui/toasts/service";
import {
  deleteCurrentClientVehicle,
  getAllSpawnableVehicles,
  getVehicleLabelFromModelId,
  keepCurrentVehicleClean,
  repairCurrentVehicle,
  SpawnableVehicle,
  spawnVehicleByModelId
} from "./service";
import logger from "../logging/logger";
import playSound from "../sound";
import nativeTextInput from "../gui/native/text-input";
import {FRONT_DRIVER} from "../../common/rockstar-constants/vehicle/seats";
import vehicleState from "./state";
import {getStringArrayPlayerSetting} from "../player/settings/service";
import PLAYER_SETTING_NAMES from "../../common/player/setting-names";
import {addItemToMenu, addMenu, openMenu, refreshMenu, setMenuItemIcon} from "../gui/menu/api/service";

const VEHICLE_MENU_ITEM_IDS = {
  MAIN: {
    SPAWN: 'spawn',
    REPAIR: 'repair',
    DELETE: 'delete'
  },
  SPAWN: {
    ALL: 'all',
    BY_MODEL_ID: 'by-model-id',
    BY_BEGINNING_LETTER: 'by-beginning-letter',
    BY_BRAND: 'by-brand',
    BY_CLASS: 'by-class',
    RECENTLY_SPAWNED: 'recently-spawned',
    NO_RECENTLY_SPAWNED_VEHICLES: 'no-recently-spawned-vehicles'
  },
  SETTINGS: {
    KEEP_VEHICLE_CLEAN: 'keep-vehicle-clean'
  }
};

export async function initializeVehicleMenu() {
  addItemToMenu(MENU_IDS.MAIN, {
    id: 'vehicle',
    title: 'Vehicle',
    description: 'Browse, spawn or customize vehicles.',
    icon: ItemIconType.SUB_MENU,
    onPressed: () => openMenu(MENU_IDS.VEHICLE.MAIN)
  }, { first: true });

  addMenu({
    id: MENU_IDS.VEHICLE.MAIN,
    title: 'Vehicle',
    items: [
      {
        id: VEHICLE_MENU_ITEM_IDS.MAIN.SPAWN,
        title: 'Spawn',
        description: 'Browse and spawn any of the available vehicles on the server.',
        icon: ItemIconType.SUB_MENU,
        onPressed: () => openMenu(MENU_IDS.VEHICLE.SPAWN.MAIN)
      },
      {
        id: VEHICLE_MENU_ITEM_IDS.MAIN.REPAIR,
        title: 'Repair',
        description: 'Repair your current vehicle.',
        icon: ItemIconType.NONE,
        onPressed: pressRepairVehicleItem
      },
      {
        id: VEHICLE_MENU_ITEM_IDS.MAIN.DELETE,
        title: 'Delete',
        description: 'Delete your current vehicle.',
        icon: ItemIconType.NONE,
        onPressed: pressDeleteVehicleItem
      }
    ]
  });

  await initializeVehicleSpawnMenu();
}

async function initializeVehicleSpawnMenu() {
  addMenu({
    id: MENU_IDS.VEHICLE.SPAWN.MAIN,
    title: 'Spawn Vehicle',
    items: [
      {
        id: VEHICLE_MENU_ITEM_IDS.SPAWN.ALL,
        title: 'All',
        description: 'Browse all available vehicles, sorted by name alphabetically.',
        icon: ItemIconType.SUB_MENU,
        onPressed: () => openMenu(MENU_IDS.VEHICLE.SPAWN.ALL)
      },
      {
        id: VEHICLE_MENU_ITEM_IDS.SPAWN.BY_MODEL_ID,
        title: 'By Model Id',
        description: 'Spawn a specific vehicle from a given model id.',
        icon: ItemIconType.INPUT,
        onPressed: pressSpawnVehicleByModelIdItem
      },
      {
        id: VEHICLE_MENU_ITEM_IDS.SPAWN.BY_BEGINNING_LETTER,
        title: 'By Beginning Letter',
        description: `Browse all available vehicles, categorized by their name's beginning letter.`,
        icon: ItemIconType.SUB_MENU,
        onPressed: () => openMenu(MENU_IDS.VEHICLE.SPAWN.BY_BEGINNING_LETTER)
      },
      {
        id: VEHICLE_MENU_ITEM_IDS.SPAWN.BY_BRAND,
        title: 'By Brand',
        description: `Browse all available vehicles, categorized by their brand.`,
        icon: ItemIconType.SUB_MENU,
        onPressed: () => openMenu(MENU_IDS.VEHICLE.SPAWN.BY_BRAND)
      },
      {
        id: VEHICLE_MENU_ITEM_IDS.SPAWN.BY_CLASS,
        title: 'By Class',
        description: `Browse all available vehicles, categorized by their vehicle class.`,
        icon: ItemIconType.SUB_MENU,
        onPressed: () => openMenu(MENU_IDS.VEHICLE.SPAWN.BY_CLASS)
      },
      {
        id: VEHICLE_MENU_ITEM_IDS.SPAWN.RECENTLY_SPAWNED,
        title: 'Recently Spawned',
        description: 'A history of all recently spawned vehicles (max. 10 vehicles).',
        icon: ItemIconType.SUB_MENU,
        onPressed: () => openMenu(MENU_IDS.VEHICLE.SPAWN.RECENTLY_SPAWNED),
        disabled: true // will be enabled if recently spawned vehicles exist
      }
    ]
  });

  try {
    const spawnableVehicles: SpawnableVehicle[] = await getAllSpawnableVehicles();
    const sortedByLabel = SpawnableVehicle.sortByLabel(spawnableVehicles);

    addMenu({
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

    const groupedByBeginningLetter = SpawnableVehicle.groupByBeginningLetter(sortedByLabel);

    addMenu({
      id: MENU_IDS.VEHICLE.SPAWN.BY_BEGINNING_LETTER,
      title: 'Grouped by beginning letter',
      items: []
    });

    groupedByBeginningLetter.forEach((vehicles, beginningLetter) => {
      const letterMenuId = MENU_IDS.VEHICLE.SPAWN.BY_BEGINNING_LETTER + beginningLetter.trim().toLowerCase();

      addItemToMenu(MENU_IDS.VEHICLE.SPAWN.BY_BEGINNING_LETTER, {
        id: beginningLetter.trim().toLowerCase(),
        title: beginningLetter,
        description: `All vehicles starting with the letter "${beginningLetter}".`,
        icon: ItemIconType.SUB_MENU,
        onPressed: () => openMenu(letterMenuId)
      });

      addMenu({
        id: letterMenuId,
        title: beginningLetter,
        items: vehicles.map(vehicle => ({
          id: vehicle.model,
          title: vehicle.label,
          description: `${vehicle.brand} ${vehicle.label} (${vehicle.model})`,
          icon: ItemIconType.NONE,
          onPressed: () => pressSpawnVehicleItem(vehicle)
        }))
      });
    });

    const groupedByBrand = SpawnableVehicle.groupByBrand(SpawnableVehicle.sortByBrand(spawnableVehicles));

    addMenu({
      id: MENU_IDS.VEHICLE.SPAWN.BY_BRAND,
      title: 'All Vehicles',
      items: []
    });

    groupedByBrand.forEach((vehicles, brand) => {
      const brandMenuId = MENU_IDS.VEHICLE.SPAWN.BY_BRAND + brand.trim().toLowerCase();

      addItemToMenu(MENU_IDS.VEHICLE.SPAWN.BY_BRAND, {
        id: brand.trim().toLowerCase(),
        title: brand,
        description: `All vehicles of the brand "${brand}".`,
        icon: ItemIconType.SUB_MENU,
        onPressed: () => openMenu(brandMenuId)
      });

      addMenu({
        id: brandMenuId,
        title: brand,
        items: SpawnableVehicle.sortByLabel(vehicles).map(vehicle => ({
          id: vehicle.model,
          title: vehicle.label,
          description: `${vehicle.brand} ${vehicle.label} (${vehicle.model})`,
          icon: ItemIconType.NONE,
          onPressed: () => pressSpawnVehicleItem(vehicle)
        }))
      });
    });

    const groupedByClass = SpawnableVehicle.groupByClass(sortedByLabel);

    addMenu({
      id: MENU_IDS.VEHICLE.SPAWN.BY_CLASS,
      title: 'All Vehicles',
      items: []
    });

    groupedByClass.forEach((vehicles, clazz) => {
      const classMenuId = MENU_IDS.VEHICLE.SPAWN.BY_CLASS + clazz.trim().toLowerCase();

      addItemToMenu(MENU_IDS.VEHICLE.SPAWN.BY_CLASS, {
        id: clazz.trim().toLowerCase(),
        title: clazz,
        description: `All vehicles of the "${clazz}" class.`,
        icon: ItemIconType.SUB_MENU,
        onPressed: () => openMenu(classMenuId)
      });

      addMenu({
        id: classMenuId,
        title: clazz,
        items: vehicles.map(vehicle => ({
          id: vehicle.model,
          title: vehicle.label,
          description: `${vehicle.brand} ${vehicle.label} (${vehicle.model})`,
          icon: ItemIconType.NONE,
          onPressed: () => pressSpawnVehicleItem(vehicle)
        }))
      });
    });
  } catch (error: any) {
    logger.error(`Failed to initialize vehicle spawn menu: ${error.message}`);
  }
}

export function initializeVehiclePlayerSettingsMenu() {
  addItemToMenu(MENU_IDS.SETTINGS.MAIN, {
    id: VEHICLE_MENU_ITEM_IDS.SETTINGS.KEEP_VEHICLE_CLEAN,
    title: 'Keep Vehicle Clean',
    description:
      'Prevents the vehicle from becoming dirty while driving.<br><br>'
      + '(This setting will persist across all game modes.)',
    icon: ItemIconType.NONE,
    onPressed: pressKeepVehicleCleanItem
  }, { first: true });
}

export function updateRecentlySpawnedVehiclesMenu() {
  const modelIds = getStringArrayPlayerSetting(PLAYER_SETTING_NAMES.VEHICLE.RECENTLY_SPAWNED, []);

  if (0 === modelIds.length) {

  }
}

function pressRepairVehicleItem() {
  try {
    repairCurrentVehicle();
    toast.showInfo(`Repaired vehicle`);
    playSound.select();
  } catch (error: any) {
    logger.error(`Could not repair vehicle: ${error.message}`);
    toast.showError(`Could not repair vehicle (see logs for details)`);
    playSound.error();
  }
}

function pressDeleteVehicleItem() {
  try {
    deleteCurrentClientVehicle();
    toast.showInfo(`Deleted vehicle`);
    playSound.select();
  } catch (error: any) {
    logger.error(`Could not delete vehicle: ${error.message}`);
    toast.showError(`Could not delete vehicle (see logs for details)`);
    playSound.error();
  }
}

async function pressSpawnVehicleByModelIdItem() {
  const inputResult = await nativeTextInput.showAndWait({
    title: 'Enter a vehicle model id to spawn (max. 32 characters)',
    maxLength: 32
  });

  if (inputResult.success && undefined !== inputResult.value) {
    playSound.select(); // to show that process was started

    const modelId = inputResult.value;
    const label = getVehicleLabelFromModelId(modelId);

    try {
      await spawnVehicleByModelId(modelId, {
        engineTurnedOnInstantly: true,
        placeClientInSeat: FRONT_DRIVER,
        preserveSpeed: true
      });
      toast.showInfo(`Spawned "${label}"`);
      playSound.select();
    } catch (error: any) {
      logger.error(`Failed to spawn vehicle "${modelId}": ${error.message}`);
      toast.showError(`Failed to spawn vehicle "${modelId}" (see logs for details)`);
      playSound.error();
    }
  }
}

async function pressSpawnVehicleItem(vehicle: SpawnableVehicle) {
  playSound.select(); // to show that process was started

  try {
    await spawnVehicleByModelId(vehicle.model, {
      engineTurnedOnInstantly: true,
      placeClientInSeat: FRONT_DRIVER,
      preserveSpeed: true
    });
    toast.showInfo(`Spawned "${vehicle.label}"`);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to spawn vehicle "${vehicle.model}": ${error.message}`);
    toast.showError(`Failed to spawn vehicle "${vehicle.model}" (see logs for details)`);
    playSound.error();
  }
}

function pressKeepVehicleCleanItem() {
  const toggled = !vehicleState.keepVehicleClean;
  keepCurrentVehicleClean(toggled);

  toast.showInfo(toggled
    ? 'Will keep current vehicle clean'
    : 'Stopped keeping current vehicle clean'
  );

  playSound.select();
  updateKeepVehicleCleanItemIcon(toggled);
  refreshMenu();
}

export function updateKeepVehicleCleanItemIcon(toggled: boolean) {
  setMenuItemIcon(
    MENU_IDS.SETTINGS.MAIN,
    VEHICLE_MENU_ITEM_IDS.SETTINGS.KEEP_VEHICLE_CLEAN,
    toggled ? ItemIconType.TOGGLE_ON : ItemIconType.TOGGLE_OFF
  );
}
