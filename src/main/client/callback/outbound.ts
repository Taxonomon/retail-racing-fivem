import callbackState from "./state";
import EVENT_NAMES from "../../common/event-names";
import logger from "../logging/logger";
import {CallbackResult} from "../../common/callback/result";
import {ActiveCallbackRequest} from "../../common/callback/request";
import {nanoid} from "nanoid/non-secure";
import {waitOneFrame} from "../../common/wait";

function registerServerCallbackResponseListener() {
  onNet(
    EVENT_NAMES.CALLBACK.SERVER.RESPONSE,
    (requestId: string, identifier: string, response: CallbackResult) => {
      logger.debug(`received net event "${EVENT_NAMES.CALLBACK.SERVER.RESPONSE}"`);
      handleServerCallbackResponse(requestId, identifier, response);
    }
  );
}

function handleServerCallbackResponse(requestId: string, identifier: string, response: CallbackResult) {
  const activeCallbackRequest = callbackState.activeCallbackRequests.find((request) =>
    request.requestId === requestId
    && request.identifier === identifier
  );

  if (undefined === activeCallbackRequest) {
    logger.error(
      `could not handle server callback response: `
      + `no active callback request found for identifier "${identifier}" and request id ${requestId}`
    );
    return;
  }

  activeCallbackRequest.response = response;
  logger.debug(
    `received server callback response for request "${identifier}" `
    + `with request id ${requestId}`
  );
}

async function triggerServerCallback(
  identifier: string,
  data?: any,
  timeoutMs: number = 5000
): Promise<CallbackResult> {
  logger.debug(`triggering server callback "${identifier}" (timeout: ${timeoutMs} ms)`);
  const callbackRequest: ActiveCallbackRequest = { requestId: generateRequestId(), identifier };

  // I know UUID collisions are near impossible, but just to be sure:
  while (callbackState.hasActiveCallbackRequest(callbackRequest)) {
    callbackRequest.requestId = generateRequestId();
  }

  callbackState.activeCallbackRequests.push(callbackRequest);
  callbackRequest.startedAt = GetGameTimer();
  emitNet(EVENT_NAMES.CALLBACK.CLIENT.REQUEST, callbackRequest.requestId, identifier, data);

  while (undefined === callbackRequest.response) {
    if (GetGameTimer() - callbackRequest.startedAt >= timeoutMs) {
      return {
        error: `callback request "${identifier}" (request id ${callbackRequest.requestId}) `
          + `timed out after ${timeoutMs} ms`
      };
    } else {
      await waitOneFrame();
    }
  }

  const response = callbackRequest.response;
  callbackState.removeActiveCallbackRequest(callbackRequest.requestId, identifier);
  return response;
}

function generateRequestId() {
  return nanoid();
}

const callbackService = {
  registerServerCallbackResponseEventListener: registerServerCallbackResponseListener,
  triggerServerCallback
};

export default callbackService;
