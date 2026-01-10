import {playerState} from "./state";
import playerUtilService from "./util/service";
import {Vector3} from "../../common/schemas";
import {distanceBetweenVector3s} from "../../common/vector";

export default function startTrackingPlayerCoordinates() {
  playerState.trackCoords.start(() => {
    playerState.coordinates = playerUtilService.getCoords();
  });
}

export function withinPlayerRadius(coordinates: Vector3, radius: number): boolean {
  return distanceBetweenVector3s(playerState.coordinates, coordinates) <= radius;
}
