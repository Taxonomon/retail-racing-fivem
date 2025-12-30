import {Tick} from "../../common/tick";
import logger from "../logging/logger";

class PlayerState {
  connected: number = 0;
  pings: Map<string, number> = new Map(); // key = netId, value = pingMs
  updatePings: Tick = new Tick('update player pings', logger);
}

const playerState = new PlayerState();

export default playerState;
