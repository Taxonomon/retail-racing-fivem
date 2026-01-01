import {Tick} from "../../common/tick";
import logger from "../logging/logger";
import {TimeOfDay} from "./service";

class TimeState {
  freezeTime: Tick = new Tick('freeze time', logger);
  frozenTimeOfDay?: TimeOfDay;
  frozen: boolean = false;
}

const timeState: TimeState = new TimeState();

export default timeState;
