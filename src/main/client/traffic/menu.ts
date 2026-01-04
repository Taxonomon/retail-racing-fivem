import menuService from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import trafficState from "./state";
import trafficService from "./service";
import playSound from "../sound";

export const DISABLE_TRAFFIC_ITEM_ID = 'disable-traffic'

export function initializeTrafficPlayerSettingsMenu() {
  menuService.addItemToMenu(MENU_IDS.SETTINGS.MAIN, {
    id: DISABLE_TRAFFIC_ITEM_ID,
    title: 'Disable Traffic',
    description: 'Disables all traffic and pedestrians.',
    icon: ItemIconType.TOGGLE_OFF,
    onPressed: pressToggleTrafficItem
  }, { first: true });
}

function pressToggleTrafficItem() {
  if (trafficState.disabled) {
    trafficService.enableTraffic();
    menuService.setItemIcon(MENU_IDS.SETTINGS.MAIN, DISABLE_TRAFFIC_ITEM_ID, ItemIconType.TOGGLE_OFF);
  } else {
    trafficService.disableTraffic();
    menuService.setItemIcon(MENU_IDS.SETTINGS.MAIN, DISABLE_TRAFFIC_ITEM_ID, ItemIconType.TOGGLE_ON);
  }
  menuService.refreshMenu();
  playSound.select();
}
