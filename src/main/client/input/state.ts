import {Tick} from "../../common/tick";
import {ControlAction} from "./control-action";
import {InputBinding} from "./binding/abstract";
import logger from "../logging/logger";

class InputState {
  disabledControlActions: Set<ControlAction> = new Set();
  blockDisabledControlActions: Tick = new Tick('block disabled control actions', logger);
  bindings: InputBinding[] = [];
  bindingListener: Tick = new Tick('input binding listener', logger);
}

const inputState = new InputState();

export default inputState;
