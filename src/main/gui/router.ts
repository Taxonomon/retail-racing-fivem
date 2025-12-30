import {NUI_MSG_IDS} from "../common/gui/nui-message";
import menu from "./menu/render";
import logger from "./logging/logger";
import breadcrumps from "./breadcrumps/render";

// @ts-ignore
const ROUTES = new Map([
  [ NUI_MSG_IDS.MENU.RENDER, menu.render ],
  [ NUI_MSG_IDS.MENU.CLEAR, menu.clear ],
  [ NUI_MSG_IDS.BREADCRUMPS, breadcrumps.render ]
]);

class MessageRouter {
  private readonly _entries: Map<string, Function>;

  constructor(entries: Map<string, Function>) {
      this._entries = entries;
  }

  async route(messageId: string, data?: any) {
    logger.debug(`routing NUI message "${messageId}"`);
    const handler: Function | undefined = this._entries.get(messageId);
    if (undefined === handler) {
      throw new Error(`unknown message id "${messageId}"`);
    }
    await handler(data);
  }
}

const router = new MessageRouter(ROUTES);

export default router;
