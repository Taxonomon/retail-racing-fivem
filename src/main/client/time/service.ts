import timeState from "./state";
import logger from "../logging/logger";
import toast from "../gui/toasts/service";

/**
 * Reflects the ingame day, not the real-life one.
 */
type TimeOfDay = {
  hour: number;
  minute: number;
  second: number;
};

function freezeTime() {
  if (!timeState.frozen) {
    const timeOfDay = getTimeOfDay();
    timeState.freezeTime.start(() => {
      NetworkOverrideClockTime(timeOfDay.hour, timeOfDay.minute, timeOfDay.second);
    }, 100);
    timeState.frozen = true;
    logger.info(`froze time of day at ${formattedString(timeOfDay)}`);
    toast.showInfo(`Froze current time of day at ${formattedString(timeOfDay)}`);
  }
}

function unfreezeTime() {
  if (timeState.frozen) {
    timeState.freezeTime.stop();
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

  NetworkOverrideClockTime(timeOfDay.hour, timeOfDay.minute, timeOfDay.second);
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
