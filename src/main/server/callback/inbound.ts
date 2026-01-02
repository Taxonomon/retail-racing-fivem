import EVENT_NAMES from "../../common/event-names";
import callbackState from "./state";
import logger from "../logging/logger";
import {CallbackResult} from "../../common/callback/result";
import playerUtils from "../player/utils";

function registerClientCallbackRequestListener() {
  onNet(
    EVENT_NAMES.CALLBACK.CLIENT.REQUEST,
    async (requestId: string, identifier: string, data?: any) => {
      const netId = globalThis.source;
      const playerName = playerUtils.getPlayerNameFromNetId(netId);
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
    logger.trace(
      `client callback request "${identifier}" (request id ${requestId}): `
      + `callback result: ${JSON.stringify(result)}`
    );
    respondToClient(playerId, requestId, identifier, { data: result });
  } catch (error: any) {
    logger.error(
      `failed to handle client callback request "${identifier}" (request id ${requestId}): `
      +`${error.message}`
    );
    respondToClient(playerId, requestId, identifier, { error: error.message });
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

export function register(identifier: string, handler: Function) {
  if (callbackState.callbackRegister.has(identifier)) {
    logger.error(`cannot register server callback "${identifier}": callback already registered`);
  } else {
    callbackState.callbackRegister.set(identifier, handler);
    logger.debug(`registered server callback "${identifier}"`);
  }
}

export function remove(identifier: string) {
  const removed = callbackState.callbackRegister.delete(identifier);
  if (removed) {
    logger.debug(`removed server callback "${identifier}"`);
  } else {
    logger.debug(`did not remove server callback "${identifier}": no such callback registered`);
  }
}

const callback = {
  register,
  remove,
  registerClientCallbackRequestListener
};

export default callback;
