import EVENT_NAMES from "../../common/event-names";
import logger from "./logger";
import {logLevelFromPriority} from "../../common/logging/level";

export default function registerMessageFromServerEventListener() {
  onNet(EVENT_NAMES.MESSAGE.FROM.SERVER, (level: number, message: string) => {
    logger.logMessage(logLevelFromPriority(level), message);
  });
}
