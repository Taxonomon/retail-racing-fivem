import clockState from "./state";
import $ from 'jquery';

const CLASSES = {
  CLOCK: 'clock'
};

function initAndStart() {
  clockState.rootNode = $(`.${CLASSES.CLOCK}`);
  window.setInterval(() => {
    clockState.rootNode?.html(formattedTimestamp(new Date()));
  }, 1000);
}

function formattedTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    year: 'numeric',
    month: 'short',
    weekday: 'short',
    day: 'numeric',
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZoneName: 'short'
  }).format(date);
}

const clock = {
  initAndStart
};

export default clock;
