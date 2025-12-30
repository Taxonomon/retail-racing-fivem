import {NuiMessageBody} from "../../common/gui/nui-message";
// import logger from "../logging/logger";

export default function sendNuiMessage(event: NuiMessageBody) {
  // logger.debug(`sending NUI message "${event.id}"`);
  // logger.trace(`sending NUI message "${event.id}" with data: ${JSON.stringify(event.data)}`);
  SendNUIMessage(event);
}
