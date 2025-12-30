import {InputBinding, InputBindingConstructorProps} from "./abstract";
import {ControlAction} from "../control-action";

export type ControlActionInputBindingConstructorProps = InputBindingConstructorProps & {
  controlAction: ControlAction;
};

/**
 * Represents a GTA-specific pre-set input binding.
 *
 * @see <a href="https://docs.fivem.net/docs/game-references/controls/">Controls - FiveM Docs</a>
 */
export class ControlActionInputBinding extends InputBinding {
  controlAction: ControlAction;

  constructor(props: ControlActionInputBindingConstructorProps) {
    super(props);
    this.controlAction = props.controlAction;
  }

  isInputPressed(): boolean {
    return IsControlPressed(this.controlAction.type, this.controlAction.index);
  }

  isInputReleased(): boolean {
    return IsControlReleased(this.controlAction.type, this.controlAction.index);
  }
}
