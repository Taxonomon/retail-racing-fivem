import vehicleState from "./state";
import logger from "../logging/logger";
import CALLBACK_NAMES from "../../common/callback/callback-names";
import {getClientCoordinates} from "../player/service";
import {loadModelByHash} from "../../common/model";
import {getBooleanPlayerSetting, getStringArrayPlayerSetting, updatePlayerSetting} from "../player/settings/service";
import PLAYER_SETTING_NAMES from "../../common/player/setting-names";
import {updateKeepVehicleCleanItemIcon, updateRecentlySpawnedVehiclesMenu} from "./menu";
import {FRONT_DRIVER, VEHICLE_SEATS, VehicleSeat} from "../../common/rockstar/vehicle/vehicle-seat";
import {
  LeaveVehicleFlag,
  TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED
} from "../../common/rockstar/vehicle/leave-vehicle-flag";
import {VEHICLE_CLASSES} from "../../common/rockstar/vehicle/vehicle-class";
import {playerState} from "../player/state";
import {triggerServerCallback} from "../callback/service/request";

const CAR_NOT_FOUND = 'CARNOTFOUND';
const REGEX_STARTS_WITH_NUMBER = /^\d/;
const NUMBER_LABEL = '0 - 9';

export class SpawnableVehicle {
  model: string;
  label: string;
  brand: string;
  classes: string[];

  constructor(model: string, label: string, brand: string, classes: string[]) {
    this.model = model;
    this.label = label;
    this.brand = brand;
    this.classes = classes;
  }

  static fromModelId(vehicleModelId: string): SpawnableVehicle {
    const hash = GetHashKey(vehicleModelId);
    const label = getVehicleLabelFromHash(hash);
    const brand = getVehicleBrandFromHash(hash);
    const clazz = getVehicleClassFromHash(hash);

    if (undefined === label) {
      throw new Error('label undefined');
    } else if (undefined === brand) {
      throw new Error('brand undefined');
    } else if (undefined === clazz) {
      throw new Error('class undefined');
    }

    return new SpawnableVehicle(vehicleModelId, label, brand, [ clazz ]);
  }

  static sortByLabel(vehicles: SpawnableVehicle[]) {
    return vehicles.sort((a, b) => a.label.localeCompare(b.label));
  }

  static sortByBrand(vehicles: SpawnableVehicle[]) {
    return vehicles.sort((a, b) => a.brand.localeCompare(b.brand));
  }

  static groupByBrand(vehicles: SpawnableVehicle[]) {
    const result = new Map<string, SpawnableVehicle[]>();
    vehicles.forEach(vehicle => {
      const brand = vehicle.brand;
      result.set(
        brand,
        result.has(brand)
          ? [ ...result.get(vehicle.brand) ?? [], vehicle ]
          : [ vehicle ]
      );
    });
    return result;
  }

  static groupByClass(vehicles: SpawnableVehicle[]) {
    const result = new Map<string, SpawnableVehicle[]>();
    vehicles.forEach(vehicle => {
      vehicle.classes.forEach(clazz => {
        result.set(
          clazz,
          result.has(clazz)
            ? [ ...result.get(clazz) ?? [], vehicle ]
            : [ vehicle ]
        );
      })
    });
    return result;
  }

  static groupByBeginningLetter(vehicles: SpawnableVehicle[]) {
    const result = new Map<string, SpawnableVehicle[]>();
    vehicles.forEach(vehicle => {
      const startsWithNumber = REGEX_STARTS_WITH_NUMBER.test(vehicle.label);
      const key = startsWithNumber ? NUMBER_LABEL : vehicle.label.charAt(0).toUpperCase();
      result.set(
        key,
        result.has(key)
          ? [ ...result.get(key) ?? [], vehicle ]
          : [ vehicle ]
      );
    });
    return result;
  }
}

export async function spawnVehicleByModelId(modelId: string, options?: {
  placeClientInSeat?: VehicleSeat;
  preserveSpeed?: boolean;
  engineTurnedOnInstantly?: boolean;
}): Promise<void> {
  if (vehicleState.spawnInProgress) {
    throw new Error('another vehicle spawn process is already in progress');
  } else if (await isVehicleModelIdBlocked(modelId)) {
    throw new Error('model id is blocked from spawning');
  }

  const modelHash = GetHashKey(modelId);

  try {
    await loadModelByHash(modelHash);
  } catch (error: any) {
    cancelVehicleSpawnProcessAndThrow(error);
  }

  const currentVehicleRef = getCurrentVehicleRef();

  if (0 !== currentVehicleRef) {
    // client is inside a vehicle
    if (isClientDriverOfVehicle(currentVehicleRef)) {
      try {
        deleteVehicleByRef(currentVehicleRef);
      } catch (error: any) {
        cancelVehicleSpawnProcessAndThrow(error);
      }
    } else {
      makeClientLeaveVehicle(currentVehicleRef, TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED);
    }
  }

  const pedId = PlayerPedId();
  const heading = GetEntityHeading(pedId);
  const { x, y, z } = playerState.coordinates ?? getClientCoordinates();
  const seat = options?.placeClientInSeat ?? FRONT_DRIVER;

  const newVehicleRef = CreateVehicle(modelHash, x, y, z, heading, true, true);
  logger.debug(`Created new vehicle ${newVehicleRef}`);

  // fetch speed the moment before placing the client into the vehicle, else the speed will be zero
  const speed = playerState.speed;

  SetPedIntoVehicle(pedId, newVehicleRef, seat.index);
  logger.debug(`Set ped into seat "${seat.identifier}" of vehicle ${newVehicleRef}`);

  if (options?.engineTurnedOnInstantly) {
    SetVehicleEngineOn(newVehicleRef, true, true, false);
    logger.debug(`Immediately turned on engine of created vehicle ${newVehicleRef}`);
  }

  if (options?.preserveSpeed && undefined !== speed) {
    SetVehicleForwardSpeed(newVehicleRef, speed.value);
    logger.debug(`Preserved previous client speed onto newly created vehicle ${newVehicleRef}`);
  }

  addRecentlySpawnedVehicle(modelId);
  logger.info(
    `Spawned vehicle "${getVehicleLabelFromRef(newVehicleRef)}" `
    + `from model id "${modelId}"`
  );
}

export async function isVehicleModelIdBlocked(modelId: string): Promise<boolean> {
  const callbackResult = await triggerServerCallback({
    identifier: CALLBACK_NAMES.VEHICLE.SPAWN.IS_BLOCKED_MODEL_ID,
    data: modelId
  });

  if (callbackResult.error) {
    throw new Error(
      `Server callback to check if vehicle model id is blocked `
      + `returned error: ${callbackResult.error}`
    );
  } else if (undefined === callbackResult.data) {
    throw new Error(
      `Server callback to check if vehicle model id is blocked `
      + `did not return a valid answer`
    );
  }

  return callbackResult.data;
}

export function getCurrentVehicleRef() {
  return GetVehiclePedIsIn(PlayerPedId(), false);
}

export function getVehicleSeatOfClientInVehicle(vehicleRef: number) {
  if (0 !== vehicleRef) {
    const pedId = PlayerPedId();
    for (const seat of VEHICLE_SEATS) {
      if (pedId === GetPedInVehicleSeat(vehicleRef, seat.index)) {
        return seat;
      }
    }
  }
  return undefined;
}

export function isClientDriverOfVehicle(vehicleRef: number) {
  return FRONT_DRIVER.index === getVehicleSeatOfClientInVehicle(vehicleRef)?.index;
}

export function deleteVehicleByRef(vehicleRef: number) {
  if (0 === vehicleRef) {
    throw new Error('no vehicle found to delete');
  }

  SetEntityAsMissionEntity(vehicleRef, true, true);
  DeleteVehicle(vehicleRef);

  logger.debug(`Deleted vehicle ${vehicleRef}`);
}

export function deleteCurrentClientVehicle() {
  const vehicleRef = GetVehiclePedIsIn(PlayerPedId(), false);

  if (0 === vehicleRef) {
    throw new Error('client is not inside any vehicle');
  } else if (!isClientDriverOfVehicle(vehicleRef)) {
    throw new Error(`client is not the driver of the current vehicle`);
  }

  deleteVehicleByRef(vehicleRef);
}

export function makeClientLeaveVehicle(vehicleRef: number, leaveFlag: LeaveVehicleFlag) {
  TaskLeaveVehicle(PlayerPedId(), vehicleRef, leaveFlag.index);
  logger.debug(`Made client leave vehicle ${vehicleRef} using leave flag "${leaveFlag.identifier}"`);
}

function cancelVehicleSpawnProcessAndThrow(error: any) {
  vehicleState.spawnInProgress = false;
  throw error;
}

export function getVehicleLabelFromModelId(modelId: string) {
  return getVehicleLabelFromHash(GetHashKey(modelId));
}

export function getVehicleLabelFromRef(vehicleRef: number) {
  return vehicleRef === 0 ? undefined : getVehicleLabelFromHash(GetEntityModel(vehicleRef));
}

export function getVehicleLabelFromHash(vehicleHash: number) {
  const displayName = GetDisplayNameFromVehicleModel(vehicleHash);
  return CAR_NOT_FOUND === displayName ? undefined : GetLabelText(displayName);
}

export async function getAllSpawnableVehicles(): Promise<SpawnableVehicle[]> {
  const result: SpawnableVehicle[] = [];
  const spawnableVehicleModelIds = await filterOutBlockedVehicleModelIds(GetAllVehicleModels());
  const unmappedVehicleModelIds: string[] = [];

  spawnableVehicleModelIds.forEach(vehicleModelId => {
    try {
      result.push(SpawnableVehicle.fromModelId(vehicleModelId));
    } catch (error: any) {
      logger.warn(
        `Could not map vehicle model id "${vehicleModelId}" `
        + `to spawnable vehicle: ${error.message}`
      );
      unmappedVehicleModelIds.push(vehicleModelId);
    }
  });

  logger.debug(`Found ${spawnableVehicleModelIds.length} spawnable vehicles`);

  if (unmappedVehicleModelIds.length > 0) {
    logger.warn(
      `Found ${unmappedVehicleModelIds.length} vehicle model ids which could `
      + `not be mapped to spawnable vehicles: ${unmappedVehicleModelIds}`
    );
  }

  return result;
}

async function filterOutBlockedVehicleModelIds(vehicleModelIds: string[]): Promise<string[]> {
  const callbackResult = await triggerServerCallback({
    identifier: CALLBACK_NAMES.VEHICLE.SPAWN.FILTER_BLOCKED_MODEL_IDS,
    data: vehicleModelIds
  });

  if (callbackResult.error) {
    throw new Error(`server callback resulted in error: ${callbackResult.error}`);
  }

  return callbackResult.data as string[];
}

export function getVehicleBrandFromHash(vehicleHash: number) {
  const result = GetLabelText(GetMakeNameFromVehicleModel(vehicleHash));
  return CAR_NOT_FOUND === result || 'NULL' === result ? 'Unknown' : result;
}

export function getVehicleClassFromHash(vehicleHash: number) {
  const classId = GetVehicleClassFromName(vehicleHash);
  return VEHICLE_CLASSES.find(vc => vc.id === classId)?.label;
}

export function repairCurrentVehicle() {
  const vehicleRef = getCurrentVehicleRef();

  if (0 === vehicleRef) {
    throw new Error('no vehicle found to repair');
  } else if (!isClientDriverOfVehicle(vehicleRef)) {
    throw new Error(`cannot repair vehicle as a passenger`);
  }

  repairVehicleByRef(vehicleRef);
}

export function repairVehicleByRef(vehicleRef: number) {
  SetVehicleFixed(vehicleRef);
  SetVehicleDirtLevel(vehicleRef, 0);
  SetVehicleBodyHealth(vehicleRef, 1000);
  SetVehicleEngineHealth(vehicleRef, 1000);
  SetVehiclePetrolTankHealth(vehicleRef, 1000);
  logger.debug(`Repaired vehicle ${vehicleRef}`);
}

export function keepCurrentVehicleClean(toggled: boolean) {
  const start = toggled && !vehicleState.keepVehicleClean;
  const stop = !toggled && vehicleState.keepVehicleClean;

  if (start) {
    vehicleState.keepVehicleCleanTick.start(() => {
      const vehicleRef = getCurrentVehicleRef();
      if (0 !== vehicleRef && isClientDriverOfVehicle(vehicleRef)) {
        cleanVehicleByRef(vehicleRef);
      }
    }, 1000);
    logger.info(`Started keeping current vehicle clean`);
    vehicleState.keepVehicleClean = true;
  } else if (stop) {
    vehicleState.keepVehicleCleanTick.stop();
    vehicleState.keepVehicleClean = false;
    logger.info(`Stopped keeping current vehicle clean`);
  }

  updatePlayerSetting(PLAYER_SETTING_NAMES.VEHICLE.KEEP_CURRENT_VEHICLE_CLEAN, toggled);
}

export function cleanVehicleByRef(vehicleRef: number) {
  SetVehicleDirtLevel(vehicleRef, 0);
  WashDecalsFromVehicle(vehicleRef, 1);
}

export function applyVehiclePlayerSettings() {
  // keep vehicle clean
  const keepCurrentVehicleCleanSetting = getBooleanPlayerSetting(
    PLAYER_SETTING_NAMES.VEHICLE.KEEP_CURRENT_VEHICLE_CLEAN,
    false
  );
  keepCurrentVehicleClean(keepCurrentVehicleCleanSetting);
  updateKeepVehicleCleanItemIcon(keepCurrentVehicleCleanSetting);

  // recently spawned vehicles
  updateRecentlySpawnedVehiclesMenu();
}

export function addRecentlySpawnedVehicle(modelId: string) {
  const recentlySpawnedModelIds = getStringArrayPlayerSetting(
    PLAYER_SETTING_NAMES.VEHICLE.RECENTLY_SPAWNED,
    []
  );

  const recentlySpawnedIndex = recentlySpawnedModelIds.indexOf(modelId);

  if (recentlySpawnedIndex > -1) {
    recentlySpawnedModelIds.splice(recentlySpawnedIndex, 1);
  }

  recentlySpawnedModelIds.splice(0, 0, modelId);
  updatePlayerSetting(PLAYER_SETTING_NAMES.VEHICLE.RECENTLY_SPAWNED, recentlySpawnedModelIds.slice(0, 10));
  updateRecentlySpawnedVehiclesMenu();
}
