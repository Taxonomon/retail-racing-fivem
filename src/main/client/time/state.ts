import {Tick} from "../../common/tick";
import logger from "../logging/logger";
import {TimeOfDay} from "./time-of-day";

class TimeState {
  freezeTime: Tick = new Tick('freeze time', logger);
  frozen: boolean = false;
}

const timeState: TimeState = new TimeState();

export default timeState;
