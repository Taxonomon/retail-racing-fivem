import {Tick} from "../../common/tick";
import {Vector3} from "../../common/vector";
import logger from "../logging/logger";
import {UnitValue} from "../../common/unit/unit-value";
import {getClientCoordinates} from "./service";

class PlayerState {
  private _coords?: Vector3;

  trackCoords: Tick = new Tick('track player coordinates', logger);
  trackSpeed: Tick = new Tick('track player speed', logger);
  speed?: UnitValue;
  pingMs?: number;
  saveSettings: Tick = new Tick('submit player settings', logger);
  lastSavedSettings: Map<string, any> = new Map();
  settings: Map<string, any> = new Map();

  get coords() {
    return this._coords ?? getClientCoordinates();
  }

  set coords(value: Vector3) {
    this._coords = value;
  }
}

const playerState = new PlayerState();

export default playerState;
