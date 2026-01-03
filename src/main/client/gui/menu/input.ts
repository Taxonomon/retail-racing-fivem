import menuService from "./api/service";
import menuState from "./api/state";
import {CONTROL_ACTIONS, controlActionService} from "../../input/control-action";
import inputState from "../../input/state";
import {ControlActionInputBinding} from "../../input/binding/control-action";
import {InputBinding} from "../../input/binding/abstract";
import logger from "../../logging/logger";

export const MENU_INPUT_BINDINGS = {
  OPEN_MAIN_MENU: new ControlActionInputBinding({
    name: 'MENU_OPEN_MAIN_MENU',
    performActionOn: 'hold',
    action: menuService.openMainMenu,
    disabled: false,
    controlAction: CONTROL_ACTIONS.INPUT_INTERACTION_MENU
  }),
  NAVIGATE_UP: new ControlActionInputBinding({
    name: 'MENU_NAVIGATE_UP',
    performActionOn: 'press',
    repeatActionOnHold: true,
    action: menuService.navigateToPreviousItem,
    disabled: true,
    controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_UP
  }),
  NAVIGATE_DOWN: new ControlActionInputBinding({
    name: 'MENU_NAVIGATE_DOWN',
    performActionOn: 'press',
    repeatActionOnHold: true,
    action: menuService.navigateToNextItem,
    disabled: true,
    controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_DOWN
  }),
  PRESS_ITEM: new ControlActionInputBinding({
    name: 'MENU_PRESS_ITEM',
    performActionOn: 'press',
    action: menuService.pressFocusedItem,
    disabled: true,
    controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_ACCEPT
  }),
  CLOSE_MENU: new ControlActionInputBinding({
    name: 'MENU_CLOSE_MENU',
    performActionOn: 'press',
    action: menuService.closeCurrentMenu,
    disabled: true,
    controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_RRIGHT
  })
};

const MENU_BINDINGS_TO_DISABLE_WHILE_MENU_OPENED: InputBinding[] = [
  MENU_INPUT_BINDINGS.OPEN_MAIN_MENU
];

const MENU_BINDINGS_TO_DISABLE_WHILE_MENU_CLOSED: InputBinding[] = [
  MENU_INPUT_BINDINGS.CLOSE_MENU,
  MENU_INPUT_BINDINGS.PRESS_ITEM,
  MENU_INPUT_BINDINGS.NAVIGATE_UP,
  MENU_INPUT_BINDINGS.NAVIGATE_DOWN
];

function setUp() {
  inputState.bindings.push(
    MENU_INPUT_BINDINGS.OPEN_MAIN_MENU,
    MENU_INPUT_BINDINGS.NAVIGATE_UP,
    MENU_INPUT_BINDINGS.NAVIGATE_DOWN,
    MENU_INPUT_BINDINGS.PRESS_ITEM,
    MENU_INPUT_BINDINGS.CLOSE_MENU
  );

  menuState.blockControlActions.start(() => {
    // control actions need to be disabled every frame
    //
    // these arrays are purposefully not pre-declared somewhere else, because some control actions
    // can't just be re-enabled once the menu closes (e.g. cinematic camera), but need to wait a little
    // before the control action should work again. else you get stuff like switching into cinematic cam
    // the instance you close the main menu.
    if (menuState.isAnyMenuOpen()) {
      controlActionService.disableControlActions(
        CONTROL_ACTIONS.INPUT_INTERACTION_MENU,
        CONTROL_ACTIONS.INPUT_MELEE_ATTACK_LIGHT,
        CONTROL_ACTIONS.INPUT_MELEE_ATTACK_HEAVY,
        CONTROL_ACTIONS.INPUT_VEH_HANDBRAKE,
        CONTROL_ACTIONS.INPUT_VEH_CIN_CAM,
        CONTROL_ACTIONS.INPUT_VEH_DUCK
      );
    } else {
      // some control actions like cinematic cam needs to surpass a certain timeout after
      // the main menu has been closed before being re-enabled again.
      if (GetGameTimer() - menuState.mainMenuLastClosedAt >= 250) {
        controlActionService.enableControlActions(
          CONTROL_ACTIONS.INPUT_VEH_CIN_CAM,
        );
      }
      controlActionService.enableControlActions(
        CONTROL_ACTIONS.INPUT_INTERACTION_MENU,
        CONTROL_ACTIONS.INPUT_MELEE_ATTACK_LIGHT,
        CONTROL_ACTIONS.INPUT_MELEE_ATTACK_HEAVY,
        CONTROL_ACTIONS.INPUT_VEH_HANDBRAKE,
        CONTROL_ACTIONS.INPUT_VEH_DUCK
      );
    }
  });
}


function disableMenuInputsBlockedWhileMenuIsClosed() {
  disableMenuInputBindings(...MENU_BINDINGS_TO_DISABLE_WHILE_MENU_CLOSED);
}

function disableMenuInputsBlockedWhileMenuIsOpened() {
  disableMenuInputBindings(...MENU_BINDINGS_TO_DISABLE_WHILE_MENU_OPENED);
}

function enableMenuInputsNotBlockedWhileMenuIsClosed() {
  enableMenuInputBindings(...MENU_BINDINGS_TO_DISABLE_WHILE_MENU_OPENED);
}

function enableMenuInputsNotBlockedWhileMenuIsOpened() {
  enableMenuInputBindings(...MENU_BINDINGS_TO_DISABLE_WHILE_MENU_CLOSED);
}

function disableMenuInputBindings(...bindings: InputBinding[]) {
  bindings.forEach(b => {
    logger.debug(`disabled menu input binding "${b.name}"`);
    b.disabled = true;
  });
}

function enableMenuInputBindings(...bindings: InputBinding[]) {
  bindings.forEach(b => {
    logger.debug(`enabled menu input binding "${b.name}"`);
    b.disabled = false;
  });
}

const menuInputService = {
  setUp,
  disableMenuInputBindings,
  enableMenuInputBindings,
  disableMenuInputsBlockedWhileMenuIsClosed,
  disableMenuInputsBlockedWhileMenuIsOpened,
  enableMenuInputsNotBlockedWhileMenuIsOpened,
  enableMenuInputsNotBlockedWhileMenuIsClosed
};

export default menuInputService;
