import {CommonLogger} from "../../common/logging/logger";
import {LOG_LEVELS, LogLevel} from "../../common/logging/level";
import formatter from "../../common/logging/format";
import CONVARS from "../convars";

const GLOBAL_LOG_LEVEL = GetConvarInt(CONVARS.LOG_LEVEL, LOG_LEVELS.INFO.priority);

class ServerLogger extends CommonLogger {
  logMessage(level: LogLevel, msg: string): void {
    // TODO send server logs to logstash as JSON
    // TODO store server logs in file
    if (level.priority >= GLOBAL_LOG_LEVEL) {
      console.log(formatter.console(level, msg));
    }
  }
}

const logger = new ServerLogger();

export default logger;
