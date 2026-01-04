import MENU_IDS from "../menu/menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import {HUD_SPEED_PRECISION, SELECTABLE_HUD_SPEED_UNITS, setHudSpeedPrecision, setHudSpeedUnit} from "./service";
import nativeTextInput from "../native/text-input";
import logger from "../../logging/logger";
import playSound from "../../sound";
import toast from "../toasts/service";
import Item from "../menu/api/item";
import {addItemToMenu, addMenu, openMenu, refreshMenu, setMenuItemIcon} from "../menu/api/service";

export function initializeHudPlayerSettingsMenu() {
  addItemToMenu(
    MENU_IDS.SETTINGS.MAIN,
    {
      id: 'hud',
      title: 'HUD',
      description: 'Adjust the Heads-Up-Display on the bottom right of the screen.',
      icon: ItemIconType.SUB_MENU,
      onPressed: (item: Item) => pressHudSubMenuItem(item),
    },
    { first: true }
  );

  addMenu({
    id: MENU_IDS.SETTINGS.HUD.MAIN,
    title: 'HUD',
    items: [
      {
        id: 'speed-unit',
        title: 'Select Speed Unit',
        description: 'Select the unit in which your speed should be displayed.',
        icon: ItemIconType.SUB_MENU,
        onPressed: (item: Item) => pressHudSpeedUnitSubMenuItem(item)
      },
      {
        id: 'speed-precision',
        title: 'Set Speed Precision',
        description:
          `Adjust the amount of decimals after the comma shown in your speed `
          + `(${HUD_SPEED_PRECISION.MIN} - ${HUD_SPEED_PRECISION.MAX}).`,
        icon: ItemIconType.INPUT,
        onPressed: pressSpeedPrecisionItem
      }
    ]
  });

  addMenu({
    id: MENU_IDS.SETTINGS.HUD.SPEED_UNIT.MAIN,
    title: 'Select HUD Speed Unit',
    items: SELECTABLE_HUD_SPEED_UNITS.map(unit => ({
      id: unit.identifier,
      title: unit.label,
      description: `Sets the HUD speed unit to ${unit.label}.`,
      onPressed: async (item) => pressSelectHudSpeedUnitItem(item),
      icon: ItemIconType.NONE
    }))
  });
}

async function pressSpeedPrecisionItem() {
  try {
    const inputResult = await nativeTextInput.showAndWait({
      title: `Set HUD speed precision (${HUD_SPEED_PRECISION.MIN} - ${HUD_SPEED_PRECISION.MAX})`,
      maxLength: 1
    });

    if (!inputResult.success) {
      return;
    }

    setHudSpeedPrecision(inputResult.value);
    logger.info(`set HUD speed precision to ${inputResult.value}`);
    toast.showInfo(`Set HUD speed precision to ${inputResult.value}`);
    playSound.select();
  } catch (error: any) {
    logger.error(`failed to set HUD speed precision: ${error.message}`);
    toast.showError(`Failed to set HUD speed precision: ${error.message}`);
    playSound.error();
  }
}

function pressHudSubMenuItem(item: Item) {
  const subMenuId = MENU_IDS.SETTINGS.HUD.MAIN;
  try {
    openMenu(subMenuId);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to open menu "${item.title}" (id="${subMenuId}"): ${error.message}`);
    toast.showError(`Failed to open menu "${item.title}" (see logs for details)`);
    playSound.error();
  }
}

function pressHudSpeedUnitSubMenuItem(item: Item) {
  const subMenuId = MENU_IDS.SETTINGS.HUD.SPEED_UNIT.MAIN;
  try {
    openMenu(subMenuId);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to open menu "${item.title}" (id="${subMenuId}"): ${error.message}`);
    toast.showError(`Failed to open menu "${item.title}" (see logs for details)`);
    playSound.error();
  }
}

function pressSelectHudSpeedUnitItem(item: Item) {
  try {
    setHudSpeedUnit(item.id);
    updateHudSpeedUnitMenuItemIcons(item.id);
    refreshMenu();
    playSound.select();
    toast.showInfo(`Set HUD speed unit to "${item.title}"`);
  } catch (error: any) {
    logger.error(`Failed to set HUD speed unit to "${item.title}": ${error.message}`);
    toast.showError(`Failed to set HUD speed unit to "${item.title}" (see logs for details)`);
    playSound.error();
  }
}

export function updateHudSpeedUnitMenuItemIcons(unitToSelect: string) {
  SELECTABLE_HUD_SPEED_UNITS.forEach(unit => {
    setMenuItemIcon(
      MENU_IDS.SETTINGS.HUD.SPEED_UNIT.MAIN,
      unit.identifier,
      unitToSelect === unit.identifier ? ItemIconType.SELECTED : ItemIconType.NONE
    )
  });
}
