import {VEHICLE_SEAT} from "../constants";

export function getCurrentVehicleRef() {
  return GetVehiclePedIsIn(PlayerPedId(), false);
}

export function isClientDriverOfVehicle(ref: number) {
  return VEHICLE_SEAT.FRONT_DRIVER === getVehicleSeatOfClientInVehicle(ref);
}

export function getVehicleSeatOfClientInVehicle(ref: number) {
  if (0 === ref) {
    return undefined;
  }

  const pedId = PlayerPedId();

  for (const seat of Object.values(VEHICLE_SEAT)) {
    if (pedId === GetPedInVehicleSeat(ref, seat.id)) {
      return seat;
    }
  }

  return undefined;
}
