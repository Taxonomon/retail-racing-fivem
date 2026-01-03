import callbackService from "../../callback/outbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import {SpawnableVehicle} from "./types";
import vehicleUtilService from "../util/service";
import logger from "../../logging/logger";
import vehicleState from "../state";
import model from "../../../common/model";
import vehicleDeleteService from "../delete/service";
import {TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED} from "../../../common/rockstar-constants/vehicle/leave-vehicle-flags";
import playerState from "../../player/state";
import playerUtilService from "../../player/util/service";
import {FRONT_DRIVER} from "../../../common/rockstar-constants/vehicle/seats";

async function spawnByModelId(modelId: string | undefined) {
  if (undefined === modelId) {
    throw new Error('undefined model id');
  }

  if (vehicleState.spawnInProgress) {
    throw new Error('vehicle spawn already in progress');
  }

  const isBlockedResult = await callbackService.triggerServerCallback(
    CALLBACK_NAMES.VEHICLE.SPAWN.IS_BLOCKED_MODEL_ID,
    modelId
  );

  if (isBlockedResult.error) {
    throw new Error(`blocked vehicle id check resulted in error: ${isBlockedResult.error}`);
  }

  if(isBlockedResult.data) {
    throw new Error(`model id is blocked from spawning`);
  }

  const hash = GetHashKey(modelId);

  try {
    await model.load(hash);
  } catch (error: any) {
    throw new Error(`failed to load vehicle model: ${error.message}`);
  }

  const pedId = PlayerPedId();
  const currentVehicleRef = vehicleUtilService.getOwnCurrentVehicleRef();

  // take care of the client's current vehicle before spawning a new one
  if (vehicleUtilService.isClientInVehicle()) {
    if (vehicleUtilService.isClientDriverOfCurrentVehicle()) {
      vehicleDeleteService.deleteByRef(currentVehicleRef);
    } else {
      vehicleUtilService.makeClientLeaveVehicle(currentVehicleRef, TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED);
    }
  }

  const heading = GetEntityHeading(pedId);
  const { x, y, z } = playerState.coords ?? playerUtilService.getCoords();
  const newVehicleRef = CreateVehicle(hash, x, y, z, heading, true, true);

  if (0 === newVehicleRef) {
    throw new Error('vehicle creation native did not return valid reference to new vehicle');
  }

  const speed = playerState.speed;

  SetVehicleEngineOn(newVehicleRef, true, true, false);
  SetPedIntoVehicle(pedId, newVehicleRef, FRONT_DRIVER.index);

  if (undefined !== speed) {
    SetVehicleForwardSpeed(newVehicleRef, speed.value);
  }

  logger.info(
    `spawned vehicle "${vehicleUtilService.getLabelFromRef(newVehicleRef)}" `
    + `from model id "${modelId}"`
  );
}

async function getAllSpawnableVehicles() {
  const filteredModelsResult = await callbackService.triggerServerCallback(
    CALLBACK_NAMES.VEHICLE.SPAWN.FILTER_BLOCKED_MODEL_IDS,
    GetAllVehicleModels()
  );

  if (filteredModelsResult.error) {
    throw new Error(filteredModelsResult.error);
  }

  const spawnableVehicles: SpawnableVehicle[] = [];
  const unmappedModelIds: string[] = [];

  // data is assumed to be string[] of model ids
  filteredModelsResult.data.forEach((modelId: string) => {
    try {
      spawnableVehicles.push(toSpawnableVehicle(modelId));
    } catch (error: any) {
      logger.warn(`could not map model id "${modelId}" to spawnable vehicle: ${error.message}`);
      unmappedModelIds.push(modelId);
    }
  });

  logger.debug(`found ${spawnableVehicles.length} spawnable vehicles`);

  if (unmappedModelIds.length > 0) {
    logger.warn(`${unmappedModelIds.length} vehicle model ids could not be mapped to spawnable vehicles`);
  }

  return spawnableVehicles;
}

function toSpawnableVehicle(modelId: string): SpawnableVehicle {
  const hash = GetHashKey(modelId);
  const label = vehicleUtilService.getLabelFromHash(hash);

  if (undefined === label) {
    throw new Error('unknown label');
  }

  const brand = vehicleUtilService.getBrandFromHash(hash);

  if (undefined === brand) {
    throw new Error('unknown brand');
  }

  const vehClass = vehicleUtilService.getClassFromHash(hash);

  if (undefined === vehClass) {
    throw new Error('unknown class');
  }

  return new SpawnableVehicle(modelId, label, brand, [ vehClass ]);
}

const vehicleSpawnService = {
  spawnByModelId,
  getAllSpawnableVehicles
};

export default vehicleSpawnService;
