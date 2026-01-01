import {Tick} from "../../../common/tick";
import logger from "../../logging/logger";

class NativeGuiState {
  hideUnwantedHudElements: Tick = new Tick('hide unwanted native gui hud elements', logger);
}

const nativeGuiState = new NativeGuiState();

export default nativeGuiState;
