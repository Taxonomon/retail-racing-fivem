import {Tick} from "../../common/tick";
import logger from "../logging/logger";

class TrafficState {
  disableTraffic: Tick = new Tick('disable traffic', logger);
  disabled: boolean = false;
}

const trafficState = new TrafficState();

export default trafficState;
