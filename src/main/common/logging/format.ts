import {COLORS} from "./color";
import {LogLevel} from "./level";

const formatter = {
  console: (level: LogLevel, msg: string): string =>
    `^${level.color}`
    + `[${new Date().toISOString()}] `
    + `[${level.identifier}] `
    + `${msg}`
    + `^${COLORS.WHITE}`,

  json: (level: LogLevel, msg: string): string =>
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: level.identifier,
      message: msg
    })
};

export default formatter;
