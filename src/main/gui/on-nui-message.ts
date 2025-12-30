import logger from "./logging/logger";
import router from "./router";
import {NuiMessageBody} from "../common/gui/nui-message";

export default function initializeNuiMessageEventListener() {
  logger.debug(`initializing NUI message event listener`);

  window.addEventListener('message', async (event: MessageEvent) => {
    if (event.origin !== 'nui://game') {
      logger.warn(`Cannot handle NUI message - invalid origin "${event.origin}"`);
      return;
    }

    const message: NuiMessageBody = event.data;

    if (undefined === message) {
      logger.error(`Cannot handle NUI message - message is undefined`);
      return;
    } else if (undefined === message.id) {
      logger.error(`Cannot handle NUI message - message id is undefined`);
      return;
    }

    try {
      await router.route(message.id, message.data);
    } catch (error: any) {
      logger.error(`Failed to handle NUI message "${message.id}": ${error.message}`);
    }
  });
}
