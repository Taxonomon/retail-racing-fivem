import {Tick} from "../../common/tick";
import logger from "../logging/logger";

class ClockState {
  rootNode?: JQuery;
  update: Tick = new Tick('update clock', logger);
}

const clockState = new ClockState();

export default clockState;
