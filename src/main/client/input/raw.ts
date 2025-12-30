/**
 * An enum of associations between a hexadecimal value and an input.
 *
 * Only keyboard inputs seem to work with raw inputs as of now. Gamepad inputs have been tested, but do not get
 * picked up by the natives.
 *
 * Expand the enum with additional inputs as needed.
 *
 * @see
 * <a href="https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes">
 *   Virtual-Key Codes - Microsoft
 * </a>
 */
export enum VirtualKeyCode {
  KEYBOARD_ENTER = 0x0D,
  KEYBOARD_SPACE_BAR = 0x20,
  KEYBOARD_ARROW_LEFT = 0x25,
  KEYBOARD_ARROW_UP = 0x26,
  KEYBOARD_ARROW_RIGHT = 0x27,
  KEYBOARD_ARROW_DOWN = 0x28,
  KEYBOARD_DELETE = 0x2E,
  KEYBOARD_M = 0x4D,
  KEYBOARD_BACK = 0x08
}
