export type VehicleSeat = {
  index: number;
  identifier: string;
};

export const FRONT_DRIVER: VehicleSeat = {
  index: -1,
  identifier: "FRONT_DRIVER"
};

export const FRONT_PASSENGER: VehicleSeat = {
  index: 0,
  identifier: "FRONT_PASSENGER"
};

export const BACK_DRIVER: VehicleSeat = {
  index: 1,
  identifier: "BACK_DRIVER"
};

export const BACK_PASSENGER: VehicleSeat = {
  index: 2,
  identifier: "BACK_PASSENGER"
};

export const ALT_FRONT_DRIVER: VehicleSeat = {
  index: 3,
  identifier: "ALT_FRONT_DRIVER"
};

export const ALT_FRONT_PASSENGER: VehicleSeat = {
  index: 4,
  identifier: "ALT_FRONT_PASSENGER"
};

export const ALT_BACK_DRIVER: VehicleSeat = {
  index: 5,
  identifier: "ALT_BACK_DRIVER"
};

export const ALT_BACK_PASSENGER: VehicleSeat = {
  index: 6,
  identifier: "ALT_BACK_PASSENGER"
};

export const VEHICLE_SEATS: VehicleSeat[] = [
  FRONT_DRIVER,
  FRONT_PASSENGER,
  BACK_DRIVER,
  BACK_PASSENGER,
  ALT_FRONT_DRIVER,
  ALT_FRONT_PASSENGER,
  ALT_BACK_DRIVER,
  ALT_BACK_PASSENGER,
];
