import gameModeState from "../state";
import {stopUpdatingNearbyJobPropsAndFixtures, tearDownPlacedJob} from "../../rockstar/job/service";

export function startHotLap(jobHash: string) {
  if ('RACE' === gameModeState.gameMode) {
    throw new Error('Cannot start hot lap while in a race');
  } else if ('HOT_LAP' === gameModeState.gameMode) {
    tearDownCurrentHotLap();
  }
}

function tearDownCurrentHotLap() {
  stopUpdatingNearbyJobPropsAndFixtures();
  tearDownPlacedJob();
}
