import {ActiveHotLapTrack} from "./schemas";
import {Tick} from "../../common/tick";
import logger from "../logging/logger";

class HotLapState {
  track?: ActiveHotLapTrack;
  lap: number = 0;
  lapStartedAt: number = -1;
  checkpoint?: number;
  spawnCheckpointIndex?: number;
  updateCheckpoints: Tick = new Tick('update hot lap checkpoints', logger);
}

export const hotLapState = new HotLapState();
