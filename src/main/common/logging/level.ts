import {COLORS} from "./color";

export type LogLevel = {
  identifier: string;
  priority: number;
  color: number;
};

const TRACE: LogLevel = { identifier: 'TRACE', priority: 0, color: COLORS.DARK_BLUE };
const DEBUG: LogLevel = { identifier: 'DEBUG', priority: 1, color: COLORS.GREEN };
const INFO: LogLevel = { identifier: 'INFO', priority: 2, color: COLORS.WHITE };
const WARN: LogLevel = { identifier: 'WARN', priority: 3, color: COLORS.YELLOW };
const ERROR: LogLevel = { identifier: 'ERROR', priority: 5, color: COLORS.RED_ORANGE };

export const LOG_LEVELS = { TRACE, DEBUG, INFO, WARN, ERROR };

export function logLevelFromPriority(priority: number) {
  return [ TRACE, DEBUG, INFO, WARN, ERROR ].find(level => level.priority === priority) ?? INFO;
}
