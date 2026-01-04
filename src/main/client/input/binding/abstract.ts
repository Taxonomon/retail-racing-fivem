import logger from "../../logging/logger";

export type InputBindingConstructorProps = {
  name: string;
  action: InputBindingAction;
  performActionOn: PressOrHold;
  repeatActionOnHold?: boolean;
  disabled?: boolean;
}

export type InputBindingAction = (() => void) | (() => Promise<void>);

export type PressOrHold = 'press' | 'hold';

/**
 * Defines an input binding, implicitly starts listening to said binding and performs the given action if possible.
 */
export abstract class InputBinding {
  static readonly HELD_AFTER_MS = 500;
  static readonly ACTION_TIMEOUT_MS = 50;

  name: string;
  action: InputBindingAction;
  performActionOn: PressOrHold;
  repeatActionOnHold: boolean;
  disabled: boolean;

  locked: boolean;
  pressed: boolean;
  pressedSince?: number;
  held: boolean;
  lastActionAt: number;

  protected constructor(props: InputBindingConstructorProps) {
    this.name = props.name;
    this.action = props.action;
    this.performActionOn = props.performActionOn;
    this.repeatActionOnHold = props.repeatActionOnHold ?? false;
    this.disabled = props.disabled ?? false;
    this.locked = false;
    this.pressed = false;
    this.held = false;
    this.lastActionAt = -1;
  }

  updateInputState() {
    if (this.disabled) {
      return;
    }

    if (this.isInputPressed()) {
      if (!this.pressed) {
        logger.debug(`pressed input "${this.name}"`);
        this.pressed = true;
        this.pressedSince = GetGameTimer();
      }

      const hasBeenPressedLongEnoughToCountAsHeld = undefined !== this.pressedSince
        && GetGameTimer() - this.pressedSince >= InputBinding.HELD_AFTER_MS;

      if (this.pressed && !this.held && hasBeenPressedLongEnoughToCountAsHeld) {
        logger.debug(`holding input "${this.name}"`);
        this.held = true;
      }
    } else if (this.isInputReleased() && this.pressed) {
      logger.debug(`released input "${this.name}"`);
      this.held = false;
      this.pressed = false;
      this.pressedSince = undefined;
    }
  }

  async performActionIfPossible() {
    if (this.actionCanBePerformed()) {
      this.locked = true;
      this.lastActionAt = GetGameTimer();
      this.action();
    } else if (this.actionCanBeRepeated()) {
      this.lastActionAt = GetGameTimer();
      this.action();
    } else if (!this.pressed) {
      this.locked = false;
      this.lastActionAt = GetGameTimer();
    }
  }

  private actionCanBePerformed() {
    if (this.disabled || this.locked) {
      return false;
    } else if ('press' === this.performActionOn) {
      return this.pressed;
    } else if ('hold' === this.performActionOn) {
      return this.held;
    }
  }

  private actionCanBeRepeated() {
    return this.held
    && this.repeatActionOnHold
    && GetGameTimer() - this.lastActionAt >= InputBinding.ACTION_TIMEOUT_MS;
  }

  abstract isInputPressed(): boolean;

  abstract isInputReleased(): boolean;
}
