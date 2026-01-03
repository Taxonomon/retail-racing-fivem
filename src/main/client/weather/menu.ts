import menuService from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import {SELECTABLE_WEATHER_TYPES} from "./weather-type";
import Item, {ItemConstructorProps} from "../gui/menu/api/item";
import weatherService from "./service";
import playSound from "../sound";
import logger from "../logging/logger";
import toast from "../gui/toasts/service";

export default function initializeWeatherMenu() {
  menuService.addItemToMenu(MENU_IDS.SETTINGS.MAIN, {
    id: 'select-weather',
    title: 'Weather',
    description: 'Permanently change the current weather.',
    icon: ItemIconType.SUB_MENU,
    onPressed: pressSelectWeatherSubMenuItem
  });

  menuService.addMenu({
    id: MENU_IDS.SETTINGS.WEATHER.MAIN,
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

function pressSelectWeatherSubMenuItem() {
  menuService.openMenu(MENU_IDS.SETTINGS.WEATHER.MAIN);
}

async function pressSetWeatherItem(item: Item) {
  const weatherTypeId = item.id;
  const weatherName = item.title;

  try {
    await weatherService.setPermanentWeather(weatherTypeId);
    toast.showInfo(`Changed weather to "${weatherName}"`);
    SELECTABLE_WEATHER_TYPES.forEach(weatherType => {
      const icon = weatherTypeId === weatherType.id ? ItemIconType.SELECTED : ItemIconType.NONE;
      menuService.setItemIcon(MENU_IDS.SETTINGS.WEATHER.MAIN, weatherType.id, icon);
    });
    menuService.refreshMenu();
    playSound.select();
  } catch (error: any) {
    logger.warn(`cannot set weather to "${weatherName}": ${error.message}`);
    toast.showError(`Cannot set weather: ${error.message}`);
  }
}
