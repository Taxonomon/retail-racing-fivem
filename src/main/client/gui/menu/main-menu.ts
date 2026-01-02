import menuService from "./api/service";
import MENU_IDS from "./menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import EVENT_NAMES from "../../../common/event-names";
import wait from "../../../common/wait";
import playSound from "../../sound";
import toast from "../toasts/service";

export default function initializeMainMenu() {
  menuService.addMenu({
    id: MENU_IDS.MAIN,
    title: 'Main Menu',
    // other features will add their items separately
    // the ones below are common default items
    items: []
  });
  menuService.setMainMenu(MENU_IDS.MAIN);
}
