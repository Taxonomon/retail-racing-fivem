import {LOG_LEVELS, LogLevel} from "./level";

export abstract class CommonLogger {
  trace(msg: string): void {
    this.logMessage(LOG_LEVELS.TRACE, msg);
  }

  debug(msg: string): void {
    this.logMessage(LOG_LEVELS.DEBUG, msg);
  }

  info(msg: string): void {
    this.logMessage(LOG_LEVELS.INFO, msg);
  }

  warn(msg: string): void {
    this.logMessage(LOG_LEVELS.WARN, msg);
  }

  error(msg: string): void {
    this.logMessage(LOG_LEVELS.ERROR, msg);
  }

  abstract logMessage(level: LogLevel, msg: string): void;
}
