import {CallbackResult} from "../../../common/callback/result";
import {getRequest as getActiveCallbackRequest} from "./request";
import {CallbackRequest} from "../schemas";

export function handleServerCallbackResponse(
  requestId: string,
  requestIdentifier: string,
  response: CallbackResult
): void {
  getRequest(requestIdentifier, requestId).response = response;
}

function getRequest(requestIdentifier: string, requestId: string): CallbackRequest {
  const result = getActiveCallbackRequest(requestIdentifier, requestId);
  if (undefined === result) {
    throw new Error(`No such active callback request found: ${requestIdentifier}:${requestId}`);
  }
  return result;
}
