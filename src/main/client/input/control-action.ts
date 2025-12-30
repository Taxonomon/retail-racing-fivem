import inputState from "./state";

/**
 * Control actions represent bindings for pre-defined inputs by GTA. Unlike raw inputs, these are bound to inputs
 * for specific scenarios, and often include both a keyboard and a gamepad binding.
 *
 * Right now, this seems to be the only way to get access to gamepad bindings.
 *
 * @see <a href="https://docs.fivem.net/docs/game-references/controls/">Controls - FiveM Docs</a>
 */
export type ControlAction = {
  type: ControlActionType;
  index: number;
};

/**
 * Seems like control actions are categorized additionally.
 *
 * @see <a href="https://docs.fivem.net/docs/game-references/controls/">Controls - FiveM Docs</a>
 */
export enum ControlActionType {
  PLAYER_CONTROL = 0,
  FRONTEND_CONTROL = 2
}

export const CONTROL_ACTIONS = {
  INPUT_FRONTEND_ACCEPT: {
    type: ControlActionType.FRONTEND_CONTROL,
    index: 201
  } satisfies ControlAction,

  INPUT_FRONTEND_CANCEL: {
    type: ControlActionType.FRONTEND_CONTROL,
    index: 202
  } satisfies ControlAction,

  INPUT_FRONTEND_UP: {
    type: ControlActionType.FRONTEND_CONTROL,
    index: 188
  } satisfies ControlAction,

  INPUT_FRONTEND_DOWN: {
    type: ControlActionType.FRONTEND_CONTROL,
    index: 187
  } satisfies ControlAction,

  INPUT_INTERACTION_MENU: {
    type: ControlActionType.FRONTEND_CONTROL,
    index: 244
  } satisfies ControlAction,

  INPUT_JUMP: {
    type: ControlActionType.PLAYER_CONTROL,
    index: 22
  } satisfies ControlAction,

  INPUT_MELEE_ATTACK_LIGHT: {
    type: ControlActionType.PLAYER_CONTROL,
    index: 140
  } satisfies ControlAction,

  INPUT_MELEE_ATTACK_HEAVY: {
    type: ControlActionType.PLAYER_CONTROL,
    index: 141
  } satisfies ControlAction,
};

function disableControlActions(...controlAction: ControlAction[]) {
  inputState.disabledControlActions.push(...controlAction);
}

function enableControlActions(...controlActions: ControlAction[]) {
  const filtered = inputState.disabledControlActions.filter((disabledControlAction) => {
    for (const controlActionToEnable of controlActions) {
      if (disabledControlAction.index === controlActionToEnable.index) {
        return true;
      }
    }
    return false;
  });
  inputState.disabledControlActions = filtered;
}

function startBlockingDisabledControlActions() {
  inputState.blockDisabledControlActions.start(() =>
    inputState.disabledControlActions.forEach((controlAction) =>
      DisableControlAction(controlAction.type, controlAction.index, true)
    )
  );
}

export const controlActionService = {
  disableControlActions,
  enableControlActions,
  startBlockingDisabledControlActions,
}
