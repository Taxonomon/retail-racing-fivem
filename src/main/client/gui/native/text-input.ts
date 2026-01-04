import logger from "../../logging/logger";
import guiState from "../state";
import playSound from "../../sound";
import {waitOneFrame} from "../../../common/wait";
import {PRESS_ITEM, setMenuInputBindingsEnabled} from "../menu/api/input";

export type NativeTextInputProps = {
  title: string;
  maxLength?: number;
};

export type NativeTextInputResult = {
  success: boolean;
  value?: string;
};

const MAX_LENGTH = 255;
const TEXT_ENTRY = 'FMMC_KEY_TIP1';
const INPUT_TYPE_LOCALIZED = 1;

enum InputState {
  PENDING = 0,
  SUCCESS = 1,
  CANCELED = 2
}

// this might break if trying to an input while another is still open, idk just putting this here

async function showAndWait(props: NativeTextInputProps) {
  if (guiState.isNativeTextInputShown) {
    throw new Error('native text input already shown');
  }

  guiState.isNativeTextInputShown = true;
  setMenuInputBindingsEnabled(false, PRESS_ITEM);

  let length = props.maxLength ?? MAX_LENGTH;
  let result: NativeTextInputResult;

  if (length < 0) {
    length = 0;
  } else if (length > MAX_LENGTH) {
    length = MAX_LENGTH;
  }

  AddTextEntry(TEXT_ENTRY, props.title);
  DisplayOnscreenKeyboard(
    INPUT_TYPE_LOCALIZED,
    TEXT_ENTRY,
    '', // p2/description, no use on PC
    '', // default text
    '', // defaultConcat1, not documented
    '', // defaultConcat2, not documented
    '', // defaultConcat3, not documented
    length
  );

  while(InputState.PENDING === UpdateOnscreenKeyboard()) {
    await waitOneFrame();
  }

  const inputState = UpdateOnscreenKeyboard();

  switch (inputState) {
    case InputState.SUCCESS: {
      const value: string = GetOnscreenKeyboardResult();
      logger.debug(`native text input "${props.title}" succeeded with result: "${value}"`);
      await waitOneFrame();
      result = { success: true, value: value };
      break;
    }
    case InputState.CANCELED: {
      logger.debug(`native text input "${props.title}" got canceled`);
      await waitOneFrame();
      result = { success: false };
      break;
    }
    default: {
      logger.debug(
        `native text input "${props.title}" got interrupted `
        + `(unknown input state "${inputState}")`
      );
      result = { success: false };
      break;
    }
  }

  if (result.success) {
    playSound.select();
  } else {
    playSound.error();
  }

  guiState.isNativeTextInputShown = false;
  await waitOneFrame();
  setMenuInputBindingsEnabled(true, PRESS_ITEM);
  return result;
}

const nativeTextInput = { showAndWait };

export default nativeTextInput;
