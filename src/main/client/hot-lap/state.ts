import {Tick} from "../../common/tick";
import logger from "../logging/logger";

class HotLapState {
  lapStartedAt: number = Number.NaN;
  updateGui: Tick = new Tick('update hot lap gui', logger);
}

export const hotLapState = new HotLapState();
