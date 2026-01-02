import {Tick} from "../../../common/tick";
import logger from "../../logging/logger";
import {MILES_PER_HOUR, Unit} from "../../../common/unit/unit";

class HudState {
  updateHud: Tick = new Tick('update hud', logger);
  unit: Unit = MILES_PER_HOUR;
  precision: number = 1;
}

const hudState = new HudState();

export default hudState;
