import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import timeState from "./state";
import playSound from "../sound";
import nativeTextInput from "../gui/native/text-input";
import logger from "../logging/logger";
import toast from "../gui/toasts/service";
import {addItemToMenu, addMenu, openMenu, refreshMenu, setMenuItemIcon} from "../gui/menu/api/service";
import Item from "../gui/menu/api/item";
import {setTimeFrozen, setTimeOfDayHour} from "./service";

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

export function initializeTimePlayerSettingsMenu() {
  addItemToMenu(MENU_IDS.SETTINGS.MAIN, {
    id: 'time',
    title: 'Time',
    icon: ItemIconType.SUB_MENU,
    onPressed: (item: Item) => pressTimeSubMenuItem(item)
  }, { first: true});

  addMenu({
    id: MENU_IDS.SETTINGS.TIME.MAIN,
    title: 'Time',
    items: [
      {
        id: ITEM_IDS.SELECT_TIME,
        title: 'Select Time',
        description: 'Select a specific time of day.',
        icon: ItemIconType.SUB_MENU,
        onPressed: (item: Item) => pressSelectTimeSubMenuItem(item)
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

  addMenu({
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

function pressTimeSubMenuItem(item: Item) {
  const subMenuId = MENU_IDS.SETTINGS.TIME.MAIN;
  try {
    openMenu(subMenuId);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to open menu "${item.title}" (id="${subMenuId}": ${error.message}`);
    toast.showError(`Failed to open menu "${item.title}" (see logs for details)`);
    playSound.error();
  }
}

function pressSelectTimeSubMenuItem(item: Item) {
  const subMenuId = MENU_IDS.SETTINGS.TIME.SELECT_TIME.MAIN;
  try {
    openMenu(subMenuId);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to open menu "${item.title}" (id="${subMenuId}": ${error.message}`);
    toast.showError(`Failed to open menu "${item.title}" (see logs for details)`);
    playSound.error();
  }
}

function pressFreezeTimeOfDayItem() {
  const freeze = !timeState.frozen;
  setTimeFrozen(freeze);
  setMenuItemIcon(
    MENU_IDS.SETTINGS.TIME.MAIN,
    ITEM_IDS.FREEZE_TIME_OF_DAY,
    freeze ? ItemIconType.TOGGLE_ON : ItemIconType.TOGGLE_OFF
  );
  refreshMenu();
  playSound.select();
}

async function pressSetCustomHourItem() {
  const hourResult = await nativeTextInput.showAndWait({
    title: 'Change time of day to specific hour (0 - 23)',
    maxLength: 2
  });

  if (!hourResult.success || undefined === hourResult.value) {
    return;
  }

  try {
    setTimeOfDayHour(hourResult.value);
    playSound.select();
  } catch (error: any) {
    logger.error(`Could not change time of day to custom hour: ${error.message}`);
    toast.showError(`Could not change time of day to custom hour (see logs for details)`);
    playSound.error();
  }
}

function pressSelectTimeItem(selectableHour: SelectableHour) {
  try {
    setTimeOfDayHour(selectableHour.hour.toString());
    playSound.select();
  } catch (error: any) {
    logger.error(`Could not set time of day to "${selectableHour.label}": ${error.message}`);
    toast.showError(`Could not set time of day to "${selectableHour.label}" (see logs for details)`);
    playSound.error();
  }
}
