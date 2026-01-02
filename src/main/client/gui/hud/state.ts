import {Tick} from "../../../common/tick";
import logger from "../../logging/logger";
import {METERS_PER_SECOND, Unit} from "../../../common/unit/unit";

class HudState {
  updateHud: Tick = new Tick('update hud', logger);
  unit?: Unit;
  precision: number = 1;
}

const hudState = new HudState();

export default hudState;
