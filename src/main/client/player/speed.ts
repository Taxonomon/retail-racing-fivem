import {playerState} from "./state";
import {METERS_PER_SECOND} from "../../common/unit/unit";

export default function startTrackingPlayerSpeed() {
  playerState.trackSpeed.start(() => {
    playerState.speed = {
      value: GetEntitySpeed(PlayerPedId()),
      unit: METERS_PER_SECOND
    };
  });
}
