import rockstarJobState from "./state";
import callbackService from "../../callback/outbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import logger from "../../logging/logger";
import {AvailableJob} from "../../../common/rockstar/job/available-job";
import toast from "../../gui/toasts/service";
import {updateGameModeMenus} from "../../game-mode/menu";
import {Prop} from "../../../common/rockstar/job/prop";
import {FixtureRemoval} from "../../../common/rockstar/job/fixture-removal";
import {Checkpoint} from "../../../common/rockstar/job/checkpoint";
import {parseJobCheckpoints, parseJobFixtureRemovals, parseJobProps} from "../../../common/rockstar/job/service";

export type LoadedJob = AvailableJob & {
  props: Prop[];
  fixtureRemovals: FixtureRemoval[];
  checkpoints: Checkpoint[];
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

export function loadJob(jobHash: string) {
  const job = rockstarJobState.availableJobs.find(job => job.hash === jobHash);

  if (undefined === job) {
    throw new Error('job not available');
  }

  rockstarJobState.loadedJob = {
    ...job,
    props: parseJobProps(job.data),
    fixtureRemovals: parseJobFixtureRemovals(job.data),
    checkpoints: parseJobCheckpoints(job.data)
  };
}

export function startUpdatingNearbyJobPropsAndFixtures() {
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
  if (undefined === rockstarJobState.loadedJob) {
    return;
  }

  const { props, fixtureRemovals } = rockstarJobState.loadedJob;

  // check distance of prop/fixture coords to current player
  // if in distance: place
  // else: remove
}

export function tearDownPlacedJob() {
  // remove all placed props
  // replace all removed fixtures
}
