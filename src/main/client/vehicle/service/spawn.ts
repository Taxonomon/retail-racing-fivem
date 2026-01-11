import {SpawnByModelIdOptions} from "../schemas";
import {vehicleState} from "../state";
import {isModelIdBlocked} from "./blocked";
import {loadModelByHash} from "../../../common/model";
import {getCurrentVehicleRef, isClientDriverOfVehicle} from "./utils";
import {deleteVehicleByRef} from "./delete";
import {LEAVE_VEHICLE_FLAG} from "../constants";
import {playerState} from "../../player/state";
import {Vector3} from "../../../common/schemas";
import {EntitySpeed} from "../../../common/entity-speed";
import {UnitValue} from "../../../common/unit/unit-value";

export async function spawnByModelId(
  modelId: string,
  options?: SpawnByModelIdOptions
): Promise<void> {
  if (vehicleState.spawnInProgress) {
    throw new Error('Another vehicle spawn already in progress');
  } else if (await isModelIdBlocked(modelId)) {
    throw new Error('Model id blocked from spawning');
  }

  const hash = GetHashKey(modelId);

  try {
    await loadModelByHash(hash);
  } catch (error: any) {
    cancelSpawnWithError(error);
  }

  // take care of the client's current vehicle first
  // before spawning a new one

  let ref = getCurrentVehicleRef();

  if (0 !== ref) {
    if (isClientDriverOfVehicle(ref)) {
      deleteVehicleByRef(ref);
    } else {
      teleportClientOutOfVehicle(ref);
    }
  }

  const coordinates: Vector3 = playerState.coordinates;

  ref = CreateVehicle(
    GetHashKey(modelId),
    coordinates.x,
    coordinates.y,
    coordinates.z,
    GetEntityHeading(PlayerPedId()),
    true,
    true
  );

  const speed: UnitValue = playerState.speed;

  // TODO continue here (migrate from old service)
}

function teleportClientOutOfVehicle(ref: number) {
  if (0 !== ref) {
    TaskLeaveVehicle(
      PlayerPedId(),
      ref,
      LEAVE_VEHICLE_FLAG.TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED.id
    );
  }
}

function cancelSpawnWithError(error: any) {
  vehicleState.spawnInProgress = false;
  throw error;
}
