/**
 * @see https://docs.fivem.net/natives/?_0x7B1141C6
 */
export type LeaveVehicleFlag = {
  index: number;
  identifier: string;
};

export const NORMAL_EXIT_CLOSE_DOOR_1: LeaveVehicleFlag = {
  index: 0,
  identifier: 'NORMAL_EXIT_CLOSE_DOOR_1'
};

export const NORMAL_EXIT_CLOSE_DOOR_2: LeaveVehicleFlag = {
  index: 1,
  identifier: 'NORMAL_EXIT_CLOSE_DOOR_2'
};

export const NORMAL_EXIT_CLOSE_DOOR_3: LeaveVehicleFlag = {
  index: 64,
  identifier: 'NORMAL_EXIT_CLOSE_DOOR_3'
};

export const TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED: LeaveVehicleFlag = {
  index: 16,
  identifier: 'TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED'
};

export const NORMAL_EXIT_NOT_CLOSING_DOOR: LeaveVehicleFlag = {
  index: 256,
  identifier: 'NORMAL_EXIT_NOT_CLOSING_DOOR'
};

export const JUMP_OUT: LeaveVehicleFlag = {
  index: 4160,
  identifier: 'JUMP_OUT',
};

export const MOVE_TO_PASSENGER_THEN_NORMAL_EXIT: LeaveVehicleFlag = {
  index: 262144,
  identifier: 'MOVE_TO_PASSENGER_THEN_NORMAL_EXIT'
};

export const LEAVE_VEHICLE_FLAGS: LeaveVehicleFlag[] = [
  NORMAL_EXIT_CLOSE_DOOR_1,
  NORMAL_EXIT_CLOSE_DOOR_2,
  NORMAL_EXIT_CLOSE_DOOR_3,
  TELEPORT_OUTSIDE_KEEP_DOOR_CLOSED,
  NORMAL_EXIT_NOT_CLOSING_DOOR,
  JUMP_OUT,
  MOVE_TO_PASSENGER_THEN_NORMAL_EXIT
];
