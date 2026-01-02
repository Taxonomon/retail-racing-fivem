import menuService from "../menu/api/service";
import MENU_IDS from "../menu/menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import hudService, {SELECTABLE_HUD_SPEED_UNITS} from "./service";
import nativeTextInput from "../native/text-input";
import logger from "../../logging/logger";
import playSound from "../../sound";
import toast from "../toasts/service";
import Item from "../menu/api/item";

export default function initializeHudMenu() {
  menuService.addItemToMenu(
    MENU_IDS.SETTINGS.MAIN,
    {
      id: 'hud',
      title: 'HUD',
      description: 'Adjust the Heads-Up-Display on the bottom right of the screen.',
      icon: ItemIconType.SUB_MENU,
      onPressed: () => menuService.openMenu(MENU_IDS.SETTINGS.HUD.MAIN),
    },
    { first: true }
  );

  menuService.addMenu({
    id: MENU_IDS.SETTINGS.HUD.MAIN,
    title: 'HUD',
    items: [
      {
        id: 'speed-unit',
        title: 'Select Speed Unit',
        description: 'Select the unit in which your speed should be displayed.',
        icon: ItemIconType.SUB_MENU,
        onPressed: () => menuService.openMenu(MENU_IDS.SETTINGS.HUD.SPEED_UNIT.MAIN)
      },
      {
        id: 'speed-precision',
        title: 'Set Speed Precision',
        description: 'Adjust the amount of decimals after the comma shown in your speed (0 - 3).',
        icon: ItemIconType.INPUT,
        onPressed: pressSpeedPrecisionItem
      }
    ]
  });

  menuService.addMenu({
    id: MENU_IDS.SETTINGS.HUD.SPEED_UNIT.MAIN,
    title: 'Select HUD Speed Unit',
    items: SELECTABLE_HUD_SPEED_UNITS.map(unit => ({
      id: unit.identifier,
      title: unit.label,
      description: `Sets the HUD speed unit to ${unit.label}.`,
      onPressed: async (item) => await pressSelectHudSpeedUnitItem(item),
      icon: ItemIconType.NONE
    }))
  });
}

async function pressSpeedPrecisionItem() {
  try {
    const inputResult = await nativeTextInput.showAndWait({
      title: 'Set HUD speed precision (0 - 3)',
      maxLength: 1
    });

    if (!inputResult.success) {
      return;
    }

    await hudService.setSpeedPrecision(inputResult.value);

    logger.info(`set HUD speed precision to ${inputResult.value}`);
    toast.showInfo(`Set HUD speed precision to ${inputResult.value}`);
    playSound.select();
  } catch (error: any) {
    logger.error(`failed to set HUD speed precision: ${error.message}`);
    toast.showError(`Failed to set HUD speed precision: ${error.message}`);
    playSound.error();
  }
}

async function pressSelectHudSpeedUnitItem(item: Item) {
  try {
    await hudService.setSpeedUnit(item.id);
    logger.info(`set HUD speed unit to "${item.title}"`);
    toast.showInfo(`Set HUD speed unit to ${item.title}`);
    SELECTABLE_HUD_SPEED_UNITS.forEach(unit => {
      menuService.setItemIcon(
        MENU_IDS.SETTINGS.HUD.SPEED_UNIT.MAIN,
        unit.identifier,
        item.id === unit.identifier ? ItemIconType.SELECTED : ItemIconType.NONE
      );
    });
    menuService.refreshMenu();
    playSound.select();
  } catch (error: any) {
    logger.error(`failed to set HUD speed unit: ${error.message}`);
    toast.showError(`Failed to set HUD speed unit: ${error.message}`);
    playSound.error();
  }
}
