import gameModeState from "../state";

export function startHotLap(jobHash: string) {
  if ('RACE' === gameModeState.gameMode) {
    throw new Error('Cannot start hot lap while in a race');
  } else if ('HOT_LAP' === gameModeState.gameMode) {
    destroyCurrentHotLap();
  }
}

function destroyCurrentHotLap() {

}
