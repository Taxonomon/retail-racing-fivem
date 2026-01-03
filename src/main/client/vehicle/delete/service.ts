import logger from "../../logging/logger";
import vehicleUtilService from "../util/service";

function deleteByRef(ref: number) {
  if (0 === ref) {
    throw new Error('invalid vehicle reference');
  }
  SetEntityAsMissionEntity(ref, true, true);
  DeleteVehicle(ref);
  logger.debug(`deleted vehicle ${ref}`);
  return true;
}

function deleteCurrentVehicle() {
  const ref = vehicleUtilService.getOwnCurrentVehicleRef();
  if (0 === ref) {
    logger.warn(`cannot delete current vehicle: no vehicle found to delete`);
    return false;
  } else {
    try {
      return deleteByRef(ref);
    } catch (error: any) {
      logger.error(`failed to delete current vehicle: ${error.message}`);
      return false;
    }
  }
}

const vehicleDeleteService = {
  deleteByRef,
  deleteCurrentVehicle
};

export default vehicleDeleteService;
