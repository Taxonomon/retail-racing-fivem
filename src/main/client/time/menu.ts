import menuService from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import timeState from "./state";
import timeService from "./service";
import playSound from "../sound";
import nativeTextInput from "../gui/native/text-input";
import logger from "../logging/logger";
import toast from "../gui/toasts/service";

const ITEM_IDS = {
  FREEZE_TIME_OF_DAY: 'freeze-time-of-day',
  SET_CUSTOM_HOUR: 'set-custom-hour'
};

export default function initializeTimeMenu() {
  menuService.addItemToMenu(MENU_IDS.MAIN, {
    id: 'time',
    title: 'Time',
    icon: ItemIconType.SUB_MENU,
    onPressed: pressTimeItem
  });

  menuService.addMenu({
    id: MENU_IDS.TIME.MAIN,
    title: 'Time',
    items: [
      {
        id: ITEM_IDS.FREEZE_TIME_OF_DAY,
        title: 'Freeze Time of Day',
        description: 'Freezes the current time of day.',
        icon: ItemIconType.TOGGLE_OFF,
        onPressed: pressFreezeTimeOfDayItem
      },
      {
        id: ITEM_IDS.SET_CUSTOM_HOUR,
        title: 'Set Custom Hour',
        description: 'Change the time of day to a specific hour.',
        icon: ItemIconType.INPUT,
        onPressed: pressSetCustomHourItem
      }
    ]
  });
}

function pressTimeItem() {
  menuService.openMenu(MENU_IDS.TIME.MAIN);
}

function pressFreezeTimeOfDayItem() {
  if (timeState.frozen) {
    timeService.unfreezeTime();
    menuService.setItemIcon(MENU_IDS.TIME.MAIN, ITEM_IDS.FREEZE_TIME_OF_DAY, ItemIconType.TOGGLE_OFF);
  } else {
    timeService.freezeTime();
    menuService.setItemIcon(MENU_IDS.TIME.MAIN, ITEM_IDS.FREEZE_TIME_OF_DAY, ItemIconType.TOGGLE_ON);
  }
  playSound.select();
}

async function pressSetCustomHourItem() {
  const hourResult = await nativeTextInput.showAndWait({
    title: 'Change time of day to specific hour (0 - 23)',
    maxLength: 2
  });

  if (!hourResult.success) {
    return;
  }

  try {
    timeService.setHour(hourResult.value ?? '');
    playSound.select();
  } catch (error: any) {
    logger.warn(`could not change time of day to custom hour: ${error.message}`);
    toast.showError(`Could not change time of day to custom hour: ${error.message}`);
    playSound.error();
  }
}
