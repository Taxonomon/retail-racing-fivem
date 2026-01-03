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
  SELECT_TIME: 'select-time',
  FREEZE_TIME_OF_DAY: 'freeze-time-of-day',
  SET_CUSTOM_HOUR: 'set-custom-hour'
};

type SelectableHour = {
  label: string;
  hour: number;
};
const SELECTABLE_HOURS: SelectableHour[] = [
  { label: 'Midnight', hour: 0 },
  { label: 'Morning', hour: 6 },
  { label: 'Noon', hour: 12 },
  { label: 'Evening', hour: 18 }
];

export default function initializeTimeMenu() {
  menuService.addItemToMenu(MENU_IDS.SETTINGS.MAIN, {
    id: 'time',
    title: 'Time',
    icon: ItemIconType.SUB_MENU,
    onPressed: pressTimeItem
  });

  menuService.addMenu({
    id: MENU_IDS.SETTINGS.TIME.MAIN,
    title: 'Time',
    items: [
      {
        id: ITEM_IDS.SELECT_TIME,
        title: 'Select Time',
        description: 'Select a specific time of day.',
        icon: ItemIconType.SUB_MENU,
        onPressed: () => menuService.openMenu(MENU_IDS.SETTINGS.TIME.SELECT_TIME.MAIN)
      },
      {
        id: ITEM_IDS.FREEZE_TIME_OF_DAY,
        title: 'Freeze Time',
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

  menuService.addMenu({
    id: MENU_IDS.SETTINGS.TIME.SELECT_TIME.MAIN,
    title: 'Select Time of Day',
    items: SELECTABLE_HOURS.map(selectableHour => ({
      id: selectableHour.hour.toString(),
      title: selectableHour.label,
      description: `Sets the current time of day to "${selectableHour.label}".`,
      icon: ItemIconType.NONE,
      onPressed: () => pressSelectTimeItem(selectableHour)
    }))
  });
}

function pressTimeItem() {
  menuService.openMenu(MENU_IDS.SETTINGS.TIME.MAIN);
}

function pressFreezeTimeOfDayItem() {
  if (timeState.frozen) {
    timeService.unfreezeTime();
    menuService.setItemIcon(
      MENU_IDS.SETTINGS.TIME.MAIN,
      ITEM_IDS.FREEZE_TIME_OF_DAY,
      ItemIconType.TOGGLE_OFF
    );
  } else {
    timeService.freezeTime();
    menuService.setItemIcon(
      MENU_IDS.SETTINGS.TIME.MAIN,
      ITEM_IDS.FREEZE_TIME_OF_DAY,
      ItemIconType.TOGGLE_ON
    );
  }
  menuService.refreshMenu();
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
    const msg = `Could not change time of day to custom hour: ${error.message}`
    logger.warn(msg);
    toast.showError(msg);
    playSound.error();
  }
}

function pressSelectTimeItem(selectableHour: SelectableHour) {
  try {
    timeService.setHour(selectableHour.hour.toString());
    playSound.select();
  } catch (error: any) {
    const msg = `Could not set time of day to "${selectableHour.label}": ${error.message}`;
    logger.warn(msg);
    toast.showError(msg);
    playSound.error();
  }
}
