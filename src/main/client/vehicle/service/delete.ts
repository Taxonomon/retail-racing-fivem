import logger from "../../logging/logger";

export function deleteVehicleByRef(ref: number) {
  if (0 !== ref) {
    SetEntityAsMissionEntity(ref, true, true);
    SetEntityAsNoLongerNeeded(ref);
    DeleteVehicle(ref);
    logger.debug(`Deleted vehicle ${ref}`);
  }
}
