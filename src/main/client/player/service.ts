import {Vector3} from "../../common/vector";
import logger from "../logging/logger";
import {getCurrentVehicleRef} from "../vehicle/service";

export function getClientCoordinates(): Vector3 {
  const [ x, y, z ] = GetEntityCoords(PlayerPedId());
  return { x, y, z };
}

export function setClientCoordinates(coordinates: Vector3) {
  const vehicleRef = getCurrentVehicleRef()
  SetEntityCoords(
    0 === vehicleRef ? PlayerPedId() : vehicleRef,
    coordinates.x,
    coordinates.y,
    coordinates.z,
    true,
    true,
    false,
    false
  );
  logger.debug(`Set client's coordinates to ${JSON.stringify(coordinates)}`);
}

export function setClientHeading(heading: number) {
  const vehicleRef = getCurrentVehicleRef();
  SetEntityHeading(0 === vehicleRef ? PlayerPedId() : vehicleRef, heading);
  logger.debug(`Set client's heading to ${heading}`);
}
