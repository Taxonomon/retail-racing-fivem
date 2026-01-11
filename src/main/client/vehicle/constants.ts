import {IdentifiableConstant} from "../../common/schemas";
import {NORMAL_EXIT_CLOSE_DOOR_1} from "../../common/rockstar/vehicle/leave-vehicle-flag";

export const VEHICLE_SEAT = {
  FRONT_DRIVER: {
    id: -1,
    identifier: 'FRONT_DRIVER'
  } satisfies IdentifiableConstant,
  FRONT_PASSENGER: {
    id: 0,
    identifier: 'FRONT_PASSENGER'
  } satisfies IdentifiableConstant,
  BACK_DRIVER: {
    id: 1,
    identifier: 'BACK_DRIVER'
  } satisfies IdentifiableConstant,
  BACK_PASSENGER: {
    id: 2,
    identifier: 'BACK_PASSENGER'
  } satisfies IdentifiableConstant,
  ALT_FRONT_DRIVER: {
    id: 3,
    identifier: 'ALT_FRONT_DRIVER'
  } satisfies IdentifiableConstant,
  ALT_FRONT_PASSENGER: {
    id: 4,
    identifier: 'ALT_FRONT_PASSENGER'
  } satisfies IdentifiableConstant,
  ALT_BACK_DRIVER: {
    id: 5,
    identifier: 'ALT_BACK_DRIVER'
  } satisfies IdentifiableConstant,
  ALT_BACK_PASSENGER: {
    id: 6,
    identifier: 'ALT_BACK_PASSENGER'
  } satisfies IdentifiableConstant,
};

export const LEAVE_VEHICLE_FLAG = {
  // NORMAL_EXIT_CLOSE_DOOR_1/2/3 all do the same thing according to the native reference
  NORMAL_EXIT_CLOSE_DOOR_1: {
    id: 0,
    identifier: 'NORMAL_EXIT_CLOSE_DOOR_1'
  } satisfies IdentifiableConstant,
  NORMAL_EXIT_CLOSE_DOOR_2: {
    id: 1,
    identifier: 'NORMAL_EXIT_CLOSE_DOOR_2'
  } satisfies IdentifiableConstant,
  NORMAL_EXIT_CLOSE_DOOR_3: {
    id: 64,
    identifier: 'NORMAL_EXIT_CLOSE_DOOR_3'
  } satisfies IdentifiableConstant,
  TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED: {
    id: 16,
    identifier: 'TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED'
  } satisfies IdentifiableConstant,
  NORMAL_EXIT_NOT_CLOSING_DOOR: {
    id: 256,
    identifier: 'NORMAL_EXIT_NOT_CLOSING_DOOR'
  } satisfies IdentifiableConstant,
  JUMP_OUT: {
    id: 4160,
    identifier: 'JUMP_OUT'
  } satisfies IdentifiableConstant,
  MOVE_TO_PASSENGER_THEN_NORMAL_EXIT: {
    id: 262144,
    identifier: 'MOVE_TO_PASSENGER_THEN_NORMAL_EXIT'
  } satisfies IdentifiableConstant,
};
