import playerState from "./state";
import playerUtilService from "./util/service";

export default function startTrackingPlayerCoordinates() {
  playerState.trackCoords.start(() => {
    playerState.coords = playerUtilService.getCoords();
  });
}
