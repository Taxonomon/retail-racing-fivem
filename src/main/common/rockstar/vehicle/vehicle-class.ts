export type VehicleClass = {
  id: number;
  label: string;
};

export const COMPACTS: VehicleClass = {
  id: 0, 
  label: 'Compacts'
};

export const SEDANS: VehicleClass = { 
  id: 1, 
  label: 'Sedans' 
};

export const SUVS: VehicleClass = { 
  id: 2, 
  label: 'SUVs' 
};

export const COUPES: VehicleClass = { 
  id: 3, 
  label: 'Coupes' 
};

export const MUSCLE: VehicleClass = { 
  id: 4, 
  label: 'Muscle' 
};

export const SPORTS_CLASSICS: VehicleClass = { 
  id: 5, 
  label: 'Sports Classics' 
};

export const SPORTS: VehicleClass = { 
  id: 6, 
  label: 'Sports' 
};

export const SUPER: VehicleClass = { 
  id: 7, 
  label: 'Super' 
};

export const MOTORCYCLES: VehicleClass = { 
  id: 8, 
  label: 'Motorcycles' 
};

export const OFF_ROAD: VehicleClass = { 
  id: 9, 
  label: 'Off-Road' 
};

export const INDUSTRIAL: VehicleClass = { 
  id: 10, 
  label: 'Industrial' 
};

export const UTILITY: VehicleClass = { 
  id: 11, 
  label: 'Utility' 
};

export const VANS: VehicleClass = { 
  id: 12, 
  label: 'Vans' 
};

export const CYCLES: VehicleClass = { 
  id: 13, 
  label: 'Cycles' 
};

export const BOATS: VehicleClass = { 
  id: 14, 
  label: 'Boats' 
};

export const HELICOPTERS: VehicleClass = { 
  id: 15, 
  label: 'Helicopters' 
};

export const PLANES: VehicleClass = { 
  id: 16, 
  label: 'Planes' 
};

export const SERVICE: VehicleClass = { 
  id: 17, 
  label: 'Service' 
};

export const EMERGENCY: VehicleClass = { 
  id: 18, 
  label: 'Emergency' 
};

export const MILITARY: VehicleClass = { 
  id: 19, 
  label: 'Military' 
};

export const COMMERCIAL: VehicleClass = { 
  id: 20, 
  label: 'Commercial' 
};

export const TRAINS: VehicleClass = { 
  id: 21, 
  label: 'Trains' 
};

export const OPEN_WHEEL: VehicleClass = { 
  id: 22, 
  label: 'Open Wheel' 
};

export const VEHICLE_CLASSES: VehicleClass[] = [
  COMPACTS,
  SEDANS,
  SUVS,
  COUPES,
  MUSCLE,
  SPORTS_CLASSICS,
  SPORTS,
  SUPER,
  MOTORCYCLES,
  OFF_ROAD,
  INDUSTRIAL,
  UTILITY,
  VANS,
  CYCLES,
  BOATS,
  HELICOPTERS,
  PLANES,
  SERVICE,
  EMERGENCY,
  MILITARY,
  COMMERCIAL,
  TRAINS,
  OPEN_WHEEL
];

export function getVehicleClassById(id: number) {
  return VEHICLE_CLASSES.find(vc => vc.id === id);
}

