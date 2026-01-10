import {Vector3} from "../../common/schemas";

class HotLapState {
  _spawnPoint?: Vector3;

  get spawnPoint() {
    if (undefined === this._spawnPoint) {
      throw new Error('Spawn point undefined');
    }
    return this._spawnPoint;
  }

  set spawnPoint(value: Vector3) {
    this._spawnPoint = value;
  }
}

export const hotLapState = new HotLapState();
