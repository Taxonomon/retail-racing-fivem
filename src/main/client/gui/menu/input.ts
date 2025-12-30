import menuService from "./api/service";
import menuState from "./api/state";
import {CONTROL_ACTIONS, controlActionService} from "../../input/control-action";
import inputState from "../../input/state";
import {ControlActionInputBinding} from "../../input/binding/control-action";
import {InputBinding} from "../../input/binding/abstract";

const MENU_INPUTS = {
  OPEN_MAIN_MENU: new ControlActionInputBinding({
    name: 'MENU_OPEN_MAIN_MENU',
    performActionOn: 'hold',
    action: menuService.openMainMenu,
    controlAction: CONTROL_ACTIONS.INPUT_INTERACTION_MENU
  }),
  NAVIGATE_UP: new ControlActionInputBinding({
    name: 'MENU_NAVIGATE_UP',
    performActionOn: 'press',
    repeatActionOnHold: true,
    action: menuService.navigateToPreviousItem,
    controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_UP
  }),
  NAVIGATE_DOWN: new ControlActionInputBinding({
    name: 'MENU_NAVIGATE_DOWN',
    performActionOn: 'press',
    repeatActionOnHold: true,
    action: menuService.navigateToNextItem,
    controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_DOWN
  }),
  PRESS_ITEM: new ControlActionInputBinding({
    name: 'MENU_PRESS_ITEM',
    performActionOn: 'press',
    action: menuService.pressFocusedItem,
    controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_ACCEPT
  }),
  CLOSE_MENU: new ControlActionInputBinding({
    name: 'MENU_CLOSE_MENU',
    performActionOn: 'press',
    action: menuService.closeCurrentMenu,
    controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_RRIGHT
  })
};

const MENU_BINDINGS_TO_DISABLE_WHILE_MENU_OPENED: InputBinding[] = [
  MENU_INPUTS.OPEN_MAIN_MENU
];

const MENU_BINDINGS_TO_DISABLE_WHILE_MENU_CLOSED: InputBinding[] = [
  MENU_INPUTS.CLOSE_MENU,
  MENU_INPUTS.PRESS_ITEM,
  MENU_INPUTS.NAVIGATE_UP,
  MENU_INPUTS.NAVIGATE_DOWN
];

function setUp() {
  inputState.bindings.push(
    MENU_INPUTS.OPEN_MAIN_MENU,
    MENU_INPUTS.NAVIGATE_UP,
    MENU_INPUTS.NAVIGATE_DOWN,
    MENU_INPUTS.PRESS_ITEM,
    MENU_INPUTS.CLOSE_MENU
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
      controlActionService.enableControlActions(
        CONTROL_ACTIONS.INPUT_FRONTEND_ACCEPT,
        CONTROL_ACTIONS.INPUT_FRONTEND_CANCEL,
        CONTROL_ACTIONS.INPUT_FRONTEND_UP,
        CONTROL_ACTIONS.INPUT_FRONTEND_DOWN
      );
    } else {
      controlActionService.disableControlActions(
        CONTROL_ACTIONS.INPUT_FRONTEND_ACCEPT,
        CONTROL_ACTIONS.INPUT_FRONTEND_CANCEL,
        CONTROL_ACTIONS.INPUT_FRONTEND_UP,
        CONTROL_ACTIONS.INPUT_FRONTEND_DOWN
      );
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

  menuState.blockInputBindings.start(() => {
    // menu bindings can be toggled on demand and don't need to be disabled every frame
    MENU_BINDINGS_TO_DISABLE_WHILE_MENU_OPENED.forEach(b => b.disabled = menuState.isAnyMenuOpen());
    MENU_BINDINGS_TO_DISABLE_WHILE_MENU_CLOSED.forEach(b => b.disabled = !menuState.isAnyMenuOpen());
  }, 50);
}

const menuInput = {
  setUp
};

export default menuInput;
