import {playerState} from "./state";
import {METERS_PER_SECOND} from "../../common/unit/unit";
import {UnitValue} from "../../common/unit/unit-value";

export function startTrackingPlayerSpeed() {
  playerState.trackSpeed.start(() => playerState.speed = getClientSpeed());
}

export function getClientSpeed(): UnitValue {
  return {
    value: GetEntitySpeed(PlayerPedId()),
    unit: METERS_PER_SECOND
  };
}
