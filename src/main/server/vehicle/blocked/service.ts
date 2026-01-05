import {registerServerCallback} from "../../callback/service";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import BLOCKED_MODEL_IDS from "./blocked-model-ids";

function registerCallbacks() {
  registerServerCallback(
    CALLBACK_NAMES.VEHICLE.SPAWN.IS_BLOCKED_MODEL_ID,
    isBlockedModelId
  );
  registerServerCallback(
    CALLBACK_NAMES.VEHICLE.SPAWN.FILTER_BLOCKED_MODEL_IDS,
    filterBlockedModelIds
  );
}

function isBlockedModelId(netId: number, modelId: string) {
  return BLOCKED_MODEL_IDS.has(modelId);
}

function filterBlockedModelIds(netId: number, modelIds: string[]) {
  return modelIds.filter(id => !BLOCKED_MODEL_IDS.has(id));
}

const blockedVehicleService = {
  registerCallbacks
};

export default blockedVehicleService;
