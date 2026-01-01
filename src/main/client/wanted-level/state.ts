import {Tick} from "../../common/tick";
import logger from "../logging/logger";

class WantedLevelState {
  disableWantedLevel: Tick = new Tick('disable wanted level', logger);
  disabled: boolean = false;
}

const wantedLevelState = new WantedLevelState();

export default wantedLevelState;
