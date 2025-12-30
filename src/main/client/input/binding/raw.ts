import {InputBinding, InputBindingConstructorProps} from "./abstract";

export type RawInputBindingConstructorProps = InputBindingConstructorProps & {
  /**
   * @see https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
   */
  virtualKeyCode: number;
};

/**
 * Represents a raw keyboard or gamepad input binding.
 */
export class RawInputBinding extends InputBinding {
  virtualKeyCode: number;

  constructor(props: RawInputBindingConstructorProps) {
    super(props);
    this.virtualKeyCode = props.virtualKeyCode;
  }

  isInputPressed(): boolean {
    return IsRawKeyDown(this.virtualKeyCode);
  }

  isInputReleased(): boolean {
    return IsRawKeyUp(this.virtualKeyCode);
  }
}
