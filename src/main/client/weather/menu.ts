import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import {SELECTABLE_WEATHER_TYPES} from "./weather-type";
import Item, {ItemConstructorProps} from "../gui/menu/api/item";
import playSound from "../sound";
import logger from "../logging/logger";
import toast from "../gui/toasts/service";
import {setPermanentWeatherByWeatherTypeId} from "./service";
import {addItemToMenu, addMenu, openMenu, refreshMenu, setMenuItemIcon} from "../gui/menu/api/service";

export function initializeWeatherMenu() {
  addItemToMenu(MENU_IDS.MAIN, {
    id: 'select-weather',
    title: 'Weather',
    description: 'Permanently change the current weather.',
    icon: ItemIconType.SUB_MENU,
    onPressed: (item: Item) => pressSelectWeatherSubMenuItem(item)
  }, { first: true});

  addMenu({
    id: MENU_IDS.WEATHER.MAIN,
    title: 'Select Weather',
    items: SELECTABLE_WEATHER_TYPES.map(weatherType => {
      return {
        id: weatherType.id,
        title: weatherType.label,
        description: `Permanently change the weather to "${weatherType.label}".`,
        icon: ItemIconType.NONE,
        onPressed: async (item: Item) => await pressSetWeatherItem(item)
      } satisfies ItemConstructorProps;
    })
  });
}

function pressSelectWeatherSubMenuItem(item: Item) {
  const subMenuId = MENU_IDS.WEATHER.MAIN;
  try {
    openMenu(subMenuId);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to open menu "${item.title}" (id="${subMenuId}"): ${error.message}`);
    toast.showError(`Failed to open menu "${item.title}" (see logs for details)`);
    playSound.error();
  }
}

async function pressSetWeatherItem(item: Item) {
  const weatherTypeId = item.id;
  const weatherName = item.title;

  try {
    await setPermanentWeatherByWeatherTypeId(weatherTypeId);
    toast.showInfo(`Changed weather to "${weatherName}"`);
    updateWeatherSelectionMenuItemIcons(weatherTypeId);
    refreshMenu();
    playSound.select();
  } catch (error: any) {
    logger.warn(`Failed to set weather to "${weatherName}" (id="${weatherTypeId}"): ${error.message}`);
    toast.showError(`Failed to set weather to "${weatherName}" (see logs for details)`);
  }
}

export function updateWeatherSelectionMenuItemIcons(selectedWeatherTypeId: string) {
  SELECTABLE_WEATHER_TYPES.forEach(weatherType => {
    const icon = selectedWeatherTypeId === weatherType.id ? ItemIconType.SELECTED : ItemIconType.NONE;
    setMenuItemIcon(MENU_IDS.WEATHER.MAIN, weatherType.id, icon);
  });
}
