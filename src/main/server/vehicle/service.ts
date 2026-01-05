import {registerServerCallback} from "../callback/service";
import CALLBACK_NAMES from "../../common/callback/callback-names";

const BLOCKED_MODEL_IDS: Set<string> = new Set([
  // freight train
  'freightcar2',
  'metrotrain',
  'freightcont2',
  'freightcar',
  'tankercar',
  'freight2',
  'freight',
  'freighttrain',
  'freightcont1',
  'freightgrain',
  // truck trailers
  'freighttrailer',
  'tanker2',
  'docktrailer',
  'proptrailer',
  'graintrailer',
  'tvtrailer',
  'tr4',
  'tr2',
  'trflat',
  'trailers',
  'trailerlogs',
  'tvtrailer2',
  'tr3',
  'trailersmall',
  'trailers2',
  'trailers3',
  'raketrailer',
  'tanker',
  'trailers4',
  'trailers5',
  'boattrailer3',
  'boattrailer2',
  'boattrailer',
  'baletrailer',
  'armytrailer',
  'armytanker',
  'armytrailer2',
  'trailersmall2'
]);

export function registerBlockedVehicleCallbacks() {
  registerServerCallback(
    CALLBACK_NAMES.VEHICLE.SPAWN.IS_BLOCKED_MODEL_ID,
    (netId: number, modelId: string) => BLOCKED_MODEL_IDS.has(modelId)
  );
  registerServerCallback(
    CALLBACK_NAMES.VEHICLE.SPAWN.FILTER_BLOCKED_MODEL_IDS,
    (netId: number, modelIds: string[]) => modelIds.filter(id => !BLOCKED_MODEL_IDS.has(id))
  );
}
