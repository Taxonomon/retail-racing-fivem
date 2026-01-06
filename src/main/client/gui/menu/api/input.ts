import {ControlActionInputBinding} from "../../../input/binding/control-action";
import {CONTROL_ACTIONS, ControlAction, setControlActionsEnabled} from "../../../input/control-action";
import {InputBinding} from "../../../input/binding/abstract";
import inputState from "../../../input/state";
import menuApiState from "./state";
import {
  closeCurrentMenu, isAnyMenuOpen, navigateToNextItem, navigateToPreviousItem, openMainMenu,
  pressCurrentlyFocusedMenuItem
} from "./service";
import logger from "../../../logging/logger";
import playSound from "../../../sound";
import toast from "../../toasts/service";

const ENABLE_CINEMATIC_CAM_AFTER_MENU_CLOSED_FOR_MS = 500;

export const OPEN_MAIN_MENU: InputBinding = new ControlActionInputBinding({
  name: 'MENU_OPEN_MAIN_MENU',
  performActionOn: 'hold',
  action: performOpenMainMenuAction,
  disabled: false,
  controlAction: CONTROL_ACTIONS.INPUT_INTERACTION_MENU
});

export const CLOSE_MENU: InputBinding = new ControlActionInputBinding({
  name: 'MENU_CLOSE_MENU',
  performActionOn: 'press',
  action: performCloseMenuAction,
  disabled: true,
  controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_RRIGHT
});

export const NAVIGATE_UP: InputBinding = new ControlActionInputBinding({
  name: 'MENU_NAVIGATE_UP',
  performActionOn: 'press',
  repeatActionOnHold: true,
  action: performNavigateUpMenuAction,
  disabled: true,
  controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_UP
});

export const NAVIGATE_DOWN: InputBinding = new ControlActionInputBinding({
  name: 'MENU_NAVIGATE_DOWN',
  performActionOn: 'press',
  repeatActionOnHold: true,
  action: performNavigateDownMenuAction,
  disabled: true,
  controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_DOWN
});

export const PRESS_ITEM: InputBinding = new ControlActionInputBinding({
  name: 'MENU_PRESS_ITEM',
  performActionOn: 'press',
  action: performPressItemMenuAction,
  disabled: true,
  controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_ACCEPT
});

const MENU_INPUT_BINDINGS = {
  ACTIVE_WHILE_MENU_OPENED: [
    CLOSE_MENU,
    NAVIGATE_UP,
    NAVIGATE_DOWN,
    PRESS_ITEM
  ],
  ACTIVE_WHILE_MENU_CLOSED: [
    OPEN_MAIN_MENU
  ],
  ALL: [
    OPEN_MAIN_MENU,
    CLOSE_MENU,
    NAVIGATE_UP,
    NAVIGATE_DOWN,
    PRESS_ITEM
  ]
};

export const MENU_IMPEDING_CONTROL_ACTIONS: ControlAction[] = [
  CONTROL_ACTIONS.INPUT_INTERACTION_MENU,
  CONTROL_ACTIONS.INPUT_MELEE_ATTACK_LIGHT,
  CONTROL_ACTIONS.INPUT_MELEE_ATTACK_HEAVY,
  CONTROL_ACTIONS.INPUT_VEH_HANDBRAKE,
  CONTROL_ACTIONS.INPUT_VEH_CIN_CAM,
  CONTROL_ACTIONS.INPUT_VEH_DUCK
];

export function initializeMenuInputBindings() {
  inputState.bindings.push(...MENU_INPUT_BINDINGS.ALL);

  menuApiState.blockImpedingControlActions.start(() => {
    // control actions need to be toggled every frame
    MENU_IMPEDING_CONTROL_ACTIONS.forEach(controlAction => {
      if (CONTROL_ACTIONS.INPUT_VEH_CIN_CAM.index === controlAction.index) {
        // cinematic vehicle cam can be disabled whenever, but should only be re-enabled again after a certain
        // amount of time has passed since the menu was completely closed. else the client activates the cinematic
        // cam the moment they close the menu because both underlying control actions are bound to the same button
        // on gamepad, and because that button activates on insta-hold as well as press.
        const disabled = isAnyMenuOpen()
          || (GetGameTimer() - menuApiState.mainMenuLastClosedAt) < ENABLE_CINEMATIC_CAM_AFTER_MENU_CLOSED_FOR_MS;
        setControlActionsEnabled(!disabled, controlAction);
      } else {
        // for all other control actions: disable while menu is opened
        setControlActionsEnabled(!isAnyMenuOpen(), controlAction);
      }
    });
  });
}

export function toggleMenuInputBindings() {
  setMenuInputBindingsEnabled(isAnyMenuOpen(), ...MENU_INPUT_BINDINGS.ACTIVE_WHILE_MENU_OPENED);
  setMenuInputBindingsEnabled(!isAnyMenuOpen(), ...MENU_INPUT_BINDINGS.ACTIVE_WHILE_MENU_CLOSED);
}

export function setMenuInputBindingsEnabled(enabled: boolean, ...bindings: InputBinding[]) {
  bindings.forEach(b => {
    b.disabled = !enabled;
    logger.debug(`${enabled ? 'Enabled' : 'Disabled'} menu input binding "${b.name}"`);
  });
}

function performOpenMainMenuAction() {
  try {
    openMainMenu();
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to open main menu: ${error.message}`);
    toast.showError(`Failed to open main menu (see logs for details)`);
    playSound.error();
  }
}

function performCloseMenuAction() {
  try {
    closeCurrentMenu();
    playSound.back();
  } catch (error: any) {
    logger.error(`Failed to close main menu: ${error.message}`);
    toast.showError(`Failed to close main menu (see logs for details)`);
    playSound.error();
  }
}

function performNavigateUpMenuAction() {
  try {
    navigateToPreviousItem();
    playSound.navigate();
  } catch (error: any) {
    logger.error(`Failed to navigate to previous menu item: ${error.message}`);
    toast.showError(`Failed to navigate to previous menu item (see logs for details)`);
    playSound.error();
  }
}

function performNavigateDownMenuAction() {
  try {
    navigateToNextItem();
    playSound.navigate();
  } catch (error: any) {
    logger.error(`Failed to navigate to next menu item: ${error.message}`);
    toast.showError(`Failed to navigate to next menu item (see logs for details)`);
    playSound.error();
  }
}

async function performPressItemMenuAction() {
  // sounds are managed by the item's onPressed handler for more flexibility
  try {
    await pressCurrentlyFocusedMenuItem();
  } catch (error: any) {
    logger.error(`Failed to press currently focused menu item: ${error.message}`);
    toast.showError(`Failed to press currently focused menu item (see logs for details)`);
  }
}
