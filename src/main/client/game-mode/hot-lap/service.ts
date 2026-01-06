import gameModeState from "../state";
import {
  loadJob,
  startUpdatingNearbyJobPropsAndFixtures,
  stopUpdatingNearbyJobPropsAndFixtures,
  tearDownPlacedJob
} from "../../rockstar/job/service";
import {switchGameModeTo} from "../service";

export function startHotLap(jobHash: string) {
  if ('RACE' === gameModeState.gameMode) {
    throw new Error('Cannot start hot lap while in a race');
  } else if ('HOT_LAP' === gameModeState.gameMode) {
    tearDownCurrentHotLap();
  }

  switchGameModeTo('HOT_LAP');

  // loads props, fixture removals and checkpoints from job JSON into state
  try {
    loadJob(jobHash);
  } catch (error: any) {
    throw new Error(`Failed to load job`, { cause: error });
  }

  startUpdatingNearbyJobPropsAndFixtures();

  // - start drawing checkpoints (target and follow-up)
  //   - if player passes checkpoint: draw next pair
  //   - if player passes start/fin:
  //     - start/reset lap timer
  //     - start/increase lap count
  //     - if full lap completed: save lap time
  // - teleport client to coordinates of their starting checkpoint
  //   - or by default, 3 checkpoints before the start/fin
  // - freeze player at those coords for like half a second to have the props load in
}

function tearDownCurrentHotLap() {
  stopUpdatingNearbyJobPropsAndFixtures();
  tearDownPlacedJob();
}
