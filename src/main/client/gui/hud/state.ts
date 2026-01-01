import {Tick} from "../../../common/tick";
import logger from "../../logging/logger";

class HudState {
  updateHud: Tick = new Tick('update hud', logger);
}

const hudState = new HudState();

export default hudState;
