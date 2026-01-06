import rockstarJobState from "./state";
import callbackService from "../../callback/outbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import logger from "../../logging/logger";
import {AvailableJob} from "../../../common/rockstar/available-job";
import toast from "../../gui/toasts/service";
import {updateGameModeMenus} from "../../game-mode/menu";

export type LoadedJob = AvailableJob & {
  props: Prop[];
  fixtureRemovals: FixtureRemoval[];
};

export type Prop = {
  ref?: number;
};

export type FixtureRemoval = {
  ref?: number;
};

export async function fetchAllRockstarJobs() {
  const callbackResult = await callbackService.triggerServerCallback(CALLBACK_NAMES.ROCKSTAR_JOB.FETCH_ALL);
  if (!callbackResult.error) {
    rockstarJobState.availableJobs = callbackResult.data as AvailableJob[];
    logger.info(`Fetched ${rockstarJobState.availableJobs.length} R* jobs from server`);
    updateGameModeMenus();
  } else {
    logger.error(`Failed to fetch all R* jobs: callback returned an error: ${callbackResult.error}`);
    toast.showError(`Failed to fetch R* jobs from server (see logs for details)`);
  }
}

export function startUpdatingNearbyJobPropsAndFixtures() {
  // TODO parse job's props and fixtures (and persist in state), and use those to place props/fixture removals
  if (!rockstarJobState.updateNearbyPropsAndFixtures.isRunning()) {
    rockstarJobState.updateNearbyPropsAndFixtures.start(updateNearbyJobPropsAndFixtures);
  }
}

export function stopUpdatingNearbyJobPropsAndFixtures() {
  if (rockstarJobState.updateNearbyPropsAndFixtures.isRunning()) {
    rockstarJobState.updateNearbyPropsAndFixtures.stop();
  }
}

function updateNearbyJobPropsAndFixtures() {
  const job = rockstarJobState.loadedJob;

  if (undefined === job) {
    return;
  }
}

export function tearDownPlacedJob() {
  // remove all placed props
  // replace all removed fixtures
}
