import {Tick} from "../../common/tick";
import {Vector3} from "../../common/vector";
import logger from "../logging/logger";
import {UnitValue} from "../../common/unit/unit-value";
import {getClientCoordinates} from "./service";
import {GameMode} from "../../common/game-mode/game-mode";

class PlayerState {
  private _coordinates?: Vector3;

  trackCoords: Tick = new Tick('track player coordinates', logger);
  trackSpeed: Tick = new Tick('track player speed', logger);
  speed?: UnitValue;
  pingMs?: number;
  saveSettings: Tick = new Tick('submit player settings', logger);
  lastSavedSettings: Map<string, any> = new Map();
  settings: Map<string, any> = new Map();
  gameMode: GameMode = 'FREE_MODE';

  get coordinates() {
    return this._coordinates ?? getClientCoordinates();
  }

  set coordinates(value: Vector3) {
    this._coordinates = value;
  }
}

export const playerState = new PlayerState();
