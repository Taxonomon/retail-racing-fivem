import {Tick} from "../../common/tick";
import {Vector3} from "../../common/vector";
import logger from "../logging/logger";

class PlayerState {
  trackCoords: Tick = new Tick('track player coordinates', logger);
  coords?: Vector3;
  pingMs?: number;
  // TODO keep connected players with netId, dbId and permissions/principals in state while they're connected
}

const playerState = new PlayerState();

export default playerState;
