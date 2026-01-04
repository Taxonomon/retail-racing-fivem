import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import trafficState from "./state";
import playSound from "../sound";
import {addItemToMenu, refreshMenu, setMenuItemIcon} from "../gui/menu/api/service";
import {disableTraffic, enableTraffic} from "./service";

export const DISABLE_TRAFFIC_ITEM_ID = 'disable-traffic'

export function initializeTrafficPlayerSettingsMenu() {
  addItemToMenu(MENU_IDS.SETTINGS.MAIN, {
    id: DISABLE_TRAFFIC_ITEM_ID,
    title: 'Disable Traffic',
    description: 'Disables all traffic and pedestrians.',
    icon: ItemIconType.TOGGLE_OFF,
    onPressed: pressToggleTrafficItem
  }, { first: true });
}

export function updateDisableTrafficItemIcon(toggled: boolean) {
  setMenuItemIcon(
    MENU_IDS.SETTINGS.MAIN,
    DISABLE_TRAFFIC_ITEM_ID,
    toggled ? ItemIconType.TOGGLE_ON : ItemIconType.TOGGLE_OFF
  );
}

function pressToggleTrafficItem() {
  if (trafficState.disabled) {
    enableTraffic();
  } else {
    disableTraffic();
  }
  updateDisableTrafficItemIcon(trafficState.disabled);
  refreshMenu();
  playSound.select();
}
