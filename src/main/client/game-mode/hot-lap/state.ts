import {Tick} from "../../../common/tick";
import logger from "../../logging/logger";

class HotLapState {
  updateCheckpoints: Tick = new Tick('update hot lap checkpoints', logger);
  currentCheckpoint: number = -1;
}

const hotLapState = new HotLapState();

export default hotLapState;
