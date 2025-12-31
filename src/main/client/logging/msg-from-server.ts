import EVENT_NAMES from "../../common/event-names";
import logger from "./logger";
import {LOG_LEVELS, LogLevel, logLevelFromPriority} from "../../common/logging/level";
import toast from "../gui/toasts/service";

export default function registerMessageFromServerEventListener() {
  onNet(EVENT_NAMES.MESSAGE.FROM.SERVER, (level: number, message: string) => {
    const logLevel: LogLevel = logLevelFromPriority(level);

    logger.logMessage(logLevel, message);

    switch (logLevel) {
      case LOG_LEVELS.INFO: {
        toast.showInfo(message);
        break;
      }
      case LOG_LEVELS.WARN: {
        toast.showWarning(message);
        break;
      }
      case LOG_LEVELS.ERROR: {
        toast.showError(message);
        break;
      }
    }
  });
}
