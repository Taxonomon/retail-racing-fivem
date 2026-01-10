import $ from 'jquery';
import lapTimerState from "./state";
import {LapTimerRenderProps} from "../../common/gui/lap-timer/props";

const CLASSES = {
  LAP_TIMER: 'lap-timer'
};

export function loadLapTimerRootNode() {
  lapTimerState.rootNode = $(`.${CLASSES.LAP_TIMER}`);
}

export function renderLapTimer(props: LapTimerRenderProps) {
  lapTimerState.rootNode?.empty();
  if (undefined !== props) {
    lapTimerState.rootNode?.html(toFormattedTime(props.lapTimeMs));
  }
}

export function hideLapTimer() {
  lapTimerState.rootNode?.empty();
}

function toFormattedTime(milliseconds: number): string {
  const ms = milliseconds % 1000;
  const secs = Math.floor((milliseconds / 1000) % 60);
  const mins = Math.floor((milliseconds / (60 * 1000)) % 60);
  const hrs = Math.floor((milliseconds / (3600 * 1000)) % 3600);

  let result =
    `${String(mins).padStart(2, '0')}`
    + ':'
    + `${String(secs).padStart(2, '0')}`
    + '.'
    +`${String(ms).padStart(3, '0')}`;

  return hrs === 0
    ? result
    : `${String(hrs).padStart(2, '0')}:${result}`;
}
