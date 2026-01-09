import trafficState from "./state";
import toast from "../gui/toasts/service";
import logger from "../logging/logger";
import {Vector3} from "../../common/vector";
import {playerState} from "../player/state";
import {getBooleanPlayerSetting, updatePlayerSetting} from "../player/settings/service";
import PLAYER_SETTING_NAMES from "../../common/player/setting-names";
import {updateDisableTrafficItemIcon} from "./menu";

const DISABLE_RADIUS = 5000;
const VEHICLE_SCENARIOS: string[] = [
  'WORLD_VEHICLE_AMBULANCE',
  'WORLD_VEHICLE_BICYCLE_BMX',
  'WORLD_VEHICLE_BICYCLE_BMX_BALLAS',
  'WORLD_VEHICLE_BICYCLE_BMX_FAMILY',
  'WORLD_VEHICLE_BICYCLE_BMX_HARMONY',
  'WORLD_VEHICLE_BICYCLE_BMX_VAGOS',
  'WORLD_VEHICLE_BICYCLE_MOUNTAIN',
  'WORLD_VEHICLE_BICYCLE_ROAD',
  'WORLD_VEHICLE_BIKE_OFF_ROAD_RACE',
  'WORLD_VEHICLE_BIKER',
  'WORLD_VEHICLE_BOAT_IDLE',
  'WORLD_VEHICLE_BOAT_IDLE_ALAMO',
  'WORLD_VEHICLE_BOAT_IDLE_MARQUIS',
  'WORLD_VEHICLE_BROKEN_DOWN',
  'WORLD_VEHICLE_BUSINESSMEN',
  'WORLD_VEHICLE_HELI_LIFEGUARD',
  'WORLD_VEHICLE_CLUCKIN_BELL_TRAILER',
  'WORLD_VEHICLE_CONSTRUCTION_SOLO',
  'WORLD_VEHICLE_CONSTRUCTION_PASSENGERS',
  'WORLD_VEHICLE_DRIVE_PASSENGERS',
  'WORLD_VEHICLE_DRIVE_PASSENGERS_LIMITED',
  'WORLD_VEHICLE_DRIVE_SOLO',
  'WORLD_VEHICLE_FARM_WORKER',
  'WORLD_VEHICLE_FIRE_TRUCK',
  'WORLD_VEHICLE_EMPTY',
  'WORLD_VEHICLE_MARIACHI',
  'WORLD_VEHICLE_MECHANIC',
  'WORLD_VEHICLE_MILITARY_PLANES_BIG',
  'WORLD_VEHICLE_MILITARY_PLANES_SMALL',
  'WORLD_VEHICLE_PARK_PARALLEL',
  'WORLD_VEHICLE_PARK_PERPENDICULAR_NOSE_IN',
  'WORLD_VEHICLE_PASSENGER_EXIT',
  'WORLD_VEHICLE_POLICE_BIKE',
  'WORLD_VEHICLE_POLICE_CAR',
  'WORLD_VEHICLE_POLICE_NEXT_TO_CAR',
  'WORLD_VEHICLE_QUARRY',
  'WORLD_VEHICLE_SALTON',
  'WORLD_VEHICLE_SALTON_DIRT_BIKE',
  'WORLD_VEHICLE_SECURITY_CAR',
  'WORLD_VEHICLE_STREETRACE',
  'WORLD_VEHICLE_TOURBUS',
  'WORLD_VEHICLE_TOURIST',
  'WORLD_VEHICLE_TANDL',
  'WORLD_VEHICLE_TRACTOR',
  'WORLD_VEHICLE_TRACTOR_BEACH',
  'WORLD_VEHICLE_TRUCK_LOGS',
  'WORLD_VEHICLE_TRUCKS_TRAILERS',
  'WORLD_VEHICLE_DISTANT_EMPTY_GROUND'
];

export function applyTrafficPlayerSettings() {
  const disabled = getBooleanPlayerSetting(PLAYER_SETTING_NAMES.TRAFFIC.DISABLED, false);
  if (disabled) {
    disableTraffic();
  } else {
    enableTraffic();
  }
  updateDisableTrafficItemIcon(disabled);
}

export function enableTraffic() {
  if (!trafficState.disabled) {
    return;
  }

  trafficState.disableTraffic.stop();

  toggleTrafficEvents(true);
  toggleVehicleScenarios(true);

  trafficState.disabled = false;
  updatePlayerSetting(PLAYER_SETTING_NAMES.TRAFFIC.DISABLED, trafficState.disabled);

  logger.info(`enabled traffic`);
  toast.showInfo('Enabled traffic');
}

export function disableTraffic() {
  if (trafficState.disabled) {
    return;
  }

  trafficState.disableTraffic.start(() => {
    const coords = playerState.coordinates;
    if (undefined !== coords) {
      disableTrafficThisFrame(coords, DISABLE_RADIUS);
      disablePedestriansThisFrame(coords, DISABLE_RADIUS);
    }
  });

  toggleTrafficEvents(false);
  toggleVehicleScenarios(false);

  trafficState.disabled = true;
  updatePlayerSetting(PLAYER_SETTING_NAMES.TRAFFIC.DISABLED, trafficState.disabled);

  logger.info(`disabled traffic`);
  toast.showInfo('Disabled traffic (some traffic may still be visible in far away distance)');
}

function toggleTrafficEvents(toggled: boolean) {
  SetRandomEventFlag(toggled);
  SetGarbageTrucks(toggled);
  SetRandomBoats(toggled);
  SetCreateRandomCops(toggled);
  SetCreateRandomCopsNotOnScenarios(toggled);
  SetCreateRandomCopsOnScenarios(toggled);
}

function toggleVehicleScenarios(toggled: boolean) {
  VEHICLE_SCENARIOS.forEach(vs => SetScenarioTypeEnabled(vs, toggled));
}

function disableTrafficThisFrame(coords: Vector3, radius: number) {
  const { x, y, z } = coords;
  SetParkedVehicleDensityMultiplierThisFrame(0);
  SetVehicleDensityMultiplierThisFrame(0);
  SetRandomVehicleDensityMultiplierThisFrame(0);
  ClearAreaOfVehicles(x, y, z, radius, false, false, false, false, false);
  RemoveVehiclesFromGeneratorsInArea(
    x - radius,
    y - radius,
    z - radius,
    x + radius,
    y + radius,
    z + radius
  );
}

function disablePedestriansThisFrame(coords: Vector3, radius: number) {
  const { x, y, z } = coords;
  SetPedDensityMultiplierThisFrame(0);
  SetScenarioPedDensityMultiplierThisFrame(0, 0);
  ClearAreaOfPeds(x, y, z, radius, false);
}
