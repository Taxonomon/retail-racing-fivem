import timeState from "./state";
import logger from "../logging/logger";
import toast from "../gui/toasts/service";

/**
 * Reflects the ingame day, not the real-life one.
 */
export type TimeOfDay = {
  hour: number;
  minute: number;
  second: number;
};

function freezeTime() {
  if (!timeState.frozen) {
    timeState.frozenTimeOfDay = getTimeOfDay();
    timeState.freezeTime.start(() => {
      if (undefined !== timeState.frozenTimeOfDay) {
        setTimeOfDay(timeState.frozenTimeOfDay);
      }
    }, 100);
    timeState.frozen = true;
    logger.info(`froze time of day at ${formattedString(timeState.frozenTimeOfDay)}`);
    toast.showInfo(`Froze current time of day at ${formattedString(timeState.frozenTimeOfDay)}`);
  }
}

function unfreezeTime() {
  if (timeState.frozen) {
    timeState.freezeTime.stop();
    timeState.frozenTimeOfDay = undefined;
    timeState.frozen = false;
    logger.info(`resumed time of day`);
    toast.showInfo('Resumed current time of day');
  }
}

function getTimeOfDay(): TimeOfDay {
  return {
    hour: GetClockHours(),
    minute: GetClockMinutes(),
    second: GetClockSeconds()
  };
}

function setTimeOfDay(timeOfDay: TimeOfDay) {
  NetworkOverrideClockTime(timeOfDay.hour, timeOfDay.minute, timeOfDay.second);
}

function setHour(rawHour: string) {
  const hour = Number(rawHour);

  if (rawHour.length === 0 || rawHour.length > 2 || Number.isNaN(hour) || hour < 0 || hour > 23) {
    throw new Error(`invalid hour "${rawHour}"`);
  }

  const timeOfDay = getTimeOfDay();
  timeOfDay.hour = hour;

  if (timeState.frozen) {
    timeState.frozenTimeOfDay = timeOfDay;
  }

  setTimeOfDay(timeOfDay);
  logger.info(`set time of day to ${formattedString(timeOfDay)}`);
  toast.showInfo(`Set time of day to ${formattedString(timeOfDay)}`);
}

function formattedString(timeOfDay: TimeOfDay) {
  const h = timeOfDay.hour.toString().padStart(2, '0');
  const m =  timeOfDay.minute.toString().padStart(2, '0');
  const s =  timeOfDay.second.toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

const timeService = {
  freezeTime,
  unfreezeTime,
  setTimeOfDay,
  setHour
};

export default timeService;
