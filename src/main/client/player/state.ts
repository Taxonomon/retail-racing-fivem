import logger from "../logging/logger";
import {Tick} from "../../common/tick";
import {Vector3} from "../../common/vector";
import {UnitValue} from "../../common/unit/unit-value";
import {GameMode} from "../../common/game-mode/game-mode";
import {getClientCoordinates} from "./service";
import {getClientSpeed} from "./speed";

class PlayerState {
  private _coordinates?: Vector3;
  private _speed?: UnitValue;

  trackCoords: Tick = new Tick('track player coordinates', logger);
  trackSpeed: Tick = new Tick('track player speed', logger);
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

  get speed() {
    return this._speed ?? getClientSpeed();
  }

  set speed(value: UnitValue) {
    this._speed = value;
  }
}

export const playerState = new PlayerState();
