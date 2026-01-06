import gameModeState from "../state";
import {
  loadJob,
  startUpdatingNearbyJobPropsAndFixtures,
  stopUpdatingNearbyJobPropsAndFixtures,
  tearDownPlacedJob
} from "../../rockstar/job/service";

export function startHotLap(jobHash: string) {
  if ('RACE' === gameModeState.gameMode) {
    throw new Error('Cannot start hot lap while in a race');
  } else if ('HOT_LAP' === gameModeState.gameMode) {
    tearDownCurrentHotLap();
  }

  // loads props, fixture removals and checkpoints from job JSON into state
  try {
    loadJob(jobHash);
  } catch (error: any) {
    throw new Error(`Failed to load job`, { cause: error });
  }

  // parse checkpoints from job data
  // every tick: draw target + follow-up checkpoints (as whatever the client configures them to look like)
  // - if checkpoint touched: draw next pair
  // - if start/fin touched:
  //   - start/reset lap timer
  //   - start/increase lap count
  //   - store lap time (if full lap completed)
  startUpdatingNearbyJobPropsAndFixtures();
}

function tearDownCurrentHotLap() {
  stopUpdatingNearbyJobPropsAndFixtures();
  tearDownPlacedJob();
}
