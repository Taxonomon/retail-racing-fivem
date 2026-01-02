import {Tick} from "../../common/tick";
import {Vector3} from "../../common/vector";
import logger from "../logging/logger";
import {UnitValue} from "../../common/unit/unit-value";

class PlayerState {
  trackCoords: Tick = new Tick('track player coordinates', logger);
  trackSpeed: Tick = new Tick('track player speed', logger);
  coords?: Vector3;
  speed?: UnitValue;
  pingMs?: number;
  settings: Map<string, any> = new Map();
}

const playerState = new PlayerState();

export default playerState;
