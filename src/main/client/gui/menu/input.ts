import menuService from "./api/service";
import menuState from "./api/state";
import {CONTROL_ACTIONS, ControlAction} from "../../input/control-action";
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
    controlAction: CONTROL_ACTIONS.INPUT_FRONTEND_CANCEL
  })
};

const CONTROL_ACTIONS_TO_DISABLE_WHILE_MENU_OPENED: ControlAction[] = [
  CONTROL_ACTIONS.INPUT_INTERACTION_MENU,
  CONTROL_ACTIONS.INPUT_MELEE_ATTACK_LIGHT,
  CONTROL_ACTIONS.INPUT_MELEE_ATTACK_HEAVY
];

const CONTROL_ACTIONS_TO_DISABLE_WHILE_MENU_CLOSED: ControlAction[] = [
  CONTROL_ACTIONS.INPUT_FRONTEND_ACCEPT,
  CONTROL_ACTIONS.INPUT_FRONTEND_CANCEL,
  CONTROL_ACTIONS.INPUT_FRONTEND_UP,
  CONTROL_ACTIONS.INPUT_FRONTEND_DOWN
];

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
    if (menuState.isAnyMenuOpen()) {
      CONTROL_ACTIONS_TO_DISABLE_WHILE_MENU_OPENED.forEach((controlAction) =>
        DisableControlAction(controlAction.type, controlAction.type, true)
      );
      CONTROL_ACTIONS_TO_DISABLE_WHILE_MENU_CLOSED.forEach((controlAction) =>
        EnableControlAction(controlAction.type, controlAction.type, true)
      );
    } else {
      CONTROL_ACTIONS_TO_DISABLE_WHILE_MENU_CLOSED.forEach((controlAction) =>
        DisableControlAction(controlAction.type, controlAction.type, true)
      );
      CONTROL_ACTIONS_TO_DISABLE_WHILE_MENU_OPENED.forEach((controlAction) =>
        EnableControlAction(controlAction.type, controlAction.type, true)
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
