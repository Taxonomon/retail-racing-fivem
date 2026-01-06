import EVENT_NAMES from "../../common/event-names";
import callbackState from "./state";
import logger from "../logging/logger";
import {CallbackResult} from "../../common/callback/result";
import {getPlayerNameFromNetId} from "../player/service";

const CALLBACK_RESPONSE_LOG_LENGTH_MAX = 1028;

export function registerClientCallbackRequestEventListener() {
  onNet(
    EVENT_NAMES.CALLBACK.CLIENT.REQUEST,
    async (requestId: string, identifier: string, data?: any) => {
      const netId = globalThis.source;
      const playerName = getPlayerNameFromNetId(netId);
      logger.trace(
        `received net event "${EVENT_NAMES.CALLBACK.CLIENT.REQUEST}" `
        + `(triggered by "${playerName}" (net id ${netId}))`
      );
      await handleClientCallbackRequest(netId, requestId, identifier, data);
    }
  );
}

async function handleClientCallbackRequest(
  playerId: number,
  requestId: string,
  identifier: string,
  data?: any
) {
  const callback = callbackState.callbackRegister.get(identifier);

  if (undefined === callback) {
    logger.warn(
      `cannot handle client callback request "${identifier}" (request id ${requestId}): `
      + `no such callback registered`
    );
    respondToClient(
      playerId,
      requestId,
      identifier,
      { error: `no callback registered under "${identifier}"` }
    );
    return;
  }

  logger.trace(
    `client callback request "${identifier}" (request id ${requestId}): `
    + `found callback handler to execute`
  );

  try {
    const result = await callback(playerId, data);
    logCallbackResult(identifier, requestId, JSON.stringify(result));
    respondToClient(playerId, requestId, identifier, { data: result });
  } catch (error: any) {
    logger.error(
      `failed to handle client callback request "${identifier}" (request id ${requestId}): `
      +`${error.message}`
    );
    respondToClient(playerId, requestId, identifier, { error: error.message });
  }
}

function logCallbackResult(identifier: string, requestId: string, result: string) {
  if (undefined === result) {
    logger.trace(
      `Handled client callback request "${identifier}" (request id ${requestId}) `
      + '- callback did not return any result'
    );
  } else {
    const resultLogString = result.length >= CALLBACK_RESPONSE_LOG_LENGTH_MAX
      ? `${result.substring(0, CALLBACK_RESPONSE_LOG_LENGTH_MAX)}... (truncated)`
      : result;

    logger.trace(
      `Handled client callback request "${identifier}" (request id ${requestId}) `
      + `- callback result: ${resultLogString}`
    );
  }
}

function respondToClient(
  playerId: number,
  requestId: string,
  identifier: string,
  result: CallbackResult
) {
  emitNet(EVENT_NAMES.CALLBACK.SERVER.RESPONSE, playerId, requestId, identifier, result);
}

export function registerServerCallback(identifier: string, handler: Function) {
  if (callbackState.callbackRegister.has(identifier)) {
    logger.error(`Cannot register server callback "${identifier}": callback already registered`);
  } else {
    callbackState.callbackRegister.set(identifier, handler);
    logger.debug(`Registered server callback "${identifier}"`);
  }
}

export function removeServerCallback(identifier: string) {
  const removed = callbackState.callbackRegister.delete(identifier);
  if (removed) {
    logger.debug(`Removed server callback "${identifier}"`);
  } else {
    logger.debug(`Did not remove server callback "${identifier}": no such callback registered`);
  }
}
