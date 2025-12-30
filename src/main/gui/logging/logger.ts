import {CommonLogger} from "../../common/logging/logger";
import {LOG_LEVELS, LogLevel} from "../../common/logging/level";
import formatter from "../../common/logging/format";

const GLOBAL_LOG_LEVEL = LOG_LEVELS.INFO.priority;

class GuiLogger extends CommonLogger {
  logMessage(level: LogLevel, msg: string): void {
    if (level.priority >= GLOBAL_LOG_LEVEL) {
      console.log(formatter.console(level, msg));
    }
  }
}

const logger = new GuiLogger();

export default logger;
