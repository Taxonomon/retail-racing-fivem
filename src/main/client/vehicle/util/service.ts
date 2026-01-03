import {VEHICLE_CLASSES} from "../../../common/rockstar-constants/vehicle/classes";
import {FRONT_DRIVER} from "../../../common/rockstar-constants/vehicle/seats";
import {
  LEAVE_VEHICLE_FLAGS, LeaveVehicleFlag,
  TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED
} from "../../../common/rockstar-constants/vehicle/leave-vehicle-flags";
import logger from "../../logging/logger";

const CAR_NOT_FOUND = 'CARNOTFOUND';

function getLabelFromRef(ref: number) {
  return ref < 1 ? undefined : getLabelFromHash(GetEntityModel(ref));
}

function getLabelFromHash(hash: number) {
  const displayName = GetDisplayNameFromVehicleModel(hash);
  return CAR_NOT_FOUND === displayName ? undefined : GetLabelText(displayName);
}

function getBrandFromHash(hash: number) {
  const result = GetMakeNameFromVehicleModel(hash);
  return CAR_NOT_FOUND === result ? undefined : result;
}

function getBrandFromRef(ref: number) {
  return getBrandFromHash(GetEntityModel(ref));
}

function getClassFromRef(ref: number) {
  const classId = GetVehicleClass(ref);
  return VEHICLE_CLASSES.find(vc => vc.id === classId)?.label;
}

function getClassFromHash(hash: number) {
  const classId = GetVehicleClassFromName(hash);
  return VEHICLE_CLASSES.find(vc => vc.id === classId)?.label;
}

function getOwnCurrentVehicleRef() {
  return GetVehiclePedIsIn(PlayerPedId(), false);
}

function isClientInVehicle() {
  return 0 !== getOwnCurrentVehicleRef();
}

function isClientDriverOfCurrentVehicle() {
  return PlayerPedId() === GetPedInVehicleSeat(getOwnCurrentVehicleRef(), FRONT_DRIVER.index);
}

function makeClientLeaveVehicle(ref: number, style: LeaveVehicleFlag) {
  TaskLeaveVehicle(PlayerPedId(), ref, style.index);
  logger.debug(`client left vehicle ${ref} with style "${style.identifier}"`);
}

const vehicleUtilService = {
  getLabelFromRef,
  getLabelFromHash,
  getBrandFromRef,
  getBrandFromHash,
  getClassFromRef,
  getClassFromHash,
  getOwnCurrentVehicleRef,
  isClientInVehicle,
  isClientDriverOfCurrentVehicle,
  makeClientLeaveVehicle
};

export default vehicleUtilService;
