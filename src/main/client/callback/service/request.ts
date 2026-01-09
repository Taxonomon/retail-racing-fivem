import {CallbackResult} from "../../../common/callback/schemas";
import {nanoid} from "nanoid/non-secure";
import {callbackState} from "../state";
import {CallbackRequest, TriggerServerCallbackProps} from "../schemas";
import {TRIGGER_SERVER_CALLBACK} from "../constants";
import {waitOneFrame} from "../../../common/wait";
import EVENT_NAMES from "../../../common/event-names";

export async function triggerServerCallback(props: TriggerServerCallbackProps): Promise<CallbackResult> {
  const request: CallbackRequest = {
    identifier: props.identifier,
    requestId: generateRequestId(props.identifier),
    startedAt: GetGameTimer()
  };

  // submit request
  addRequest(request);
  emitNet(
    EVENT_NAMES.CALLBACK.CLIENT.REQUEST,
    request.requestId,
    props.identifier,
    props.data
  );

  await waitForCallbackResponse(request, props.timeoutMs ?? TRIGGER_SERVER_CALLBACK.TIMEOUT_MS);
  return getResponse(request);
}

function generateRequestId(identifier: string): string {
  let result: string = nanoid();
  while (hasRequest(identifier, result)) {
    result = nanoid();
  }
  return result;
}

function addRequest(request: CallbackRequest) {
  if (hasRequest(request.identifier, request.requestId)) {
    // this should never happen, but I'm paranoid
    throw new Error(`Callback request ${fullRequestIdentifier(request)} already exists`);
  }
  callbackState.activeCallbackRequests.push(request);
}

function hasRequest(identifier: string, requestId: string): boolean {
  return undefined !== getRequest(identifier, requestId);
}

export function getRequest(identifier: string, requestId: string): CallbackRequest | undefined {
  return callbackState.activeCallbackRequests.find(request =>
    request.identifier === identifier
    && request.requestId === requestId
  );
}

function getResponse(request: CallbackRequest) {
  if (undefined === request.response) {
    throw new Error(`Callback request ${fullRequestIdentifier(request)} has no response`);
  }
  return request.response;
}

async function waitForCallbackResponse(request: CallbackRequest, timeoutMs: number) {
  if (undefined === request.startedAt) {
    throw new Error(`Callback request ${fullRequestIdentifier(request)} has no start time`);
  }

  while (undefined === request.response) {
    if ((GetGameTimer() - request.startedAt) >= timeoutMs) {
      throw new Error(
        `Callback request ${fullRequestIdentifier(request)} `
        + `timed out after ${timeoutMs} ms`
      );
    } else {
      await waitOneFrame();
    }
  }
}

function fullRequestIdentifier(request: CallbackRequest) {
  return `${request.identifier}:${request.requestId}`;
}
