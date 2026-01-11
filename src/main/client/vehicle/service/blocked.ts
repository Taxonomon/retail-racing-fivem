import {triggerServerCallback} from "../../callback/service/request";
import CALLBACK_NAMES from "../../../common/callback/callback-names";

export async function isModelIdBlocked(modelId: string): Promise<boolean> {
  const callback = CALLBACK_NAMES.VEHICLE.SPAWN.IS_BLOCKED_MODEL_ID;

  const callbackResult = await triggerServerCallback({
    identifier: callback,
    data: modelId
  });

  if (callbackResult.error) {
    throw new Error(`Callback ${callback} returned error: ${callbackResult.error}`);
  } else if (undefined === callbackResult.data) {
    throw new Error(`Received invalid result from callback ${callback}`);
  }

  return callbackResult.data;
}
