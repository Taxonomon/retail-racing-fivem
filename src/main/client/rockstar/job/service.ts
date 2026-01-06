import rockstarJobState from "./state";
import callbackService from "../../callback/outbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import logger from "../../logging/logger";
import {AvailableJob} from "../../../common/rockstar/job/available-job";
import toast from "../../gui/toasts/service";
import {updateGameModeMenus} from "../../game-mode/menu";
import {Prop, PROP_ROTATION_ORDER} from "../../../common/rockstar/job/prop";
import {FixtureRemoval} from "../../../common/rockstar/job/fixture-removal";
import {Checkpoint} from "../../../common/rockstar/job/checkpoint";
import {parseJobCheckpoints, parseJobFixtureRemovals, parseJobProps} from "../../../common/rockstar/job/service";
import playerState from "../../player/state";
import playerUtilService from "../../player/util/service";
import {distanceBetweenVector3s, Vector3} from "../../../common/vector";
import {loadModelByHash} from "../../../common/model";

const PLAYER_DETECTION_RADIUS = 500;
const PROP_LOD_DISTANCE = 16960;

// TODO rename to "PlayableJob", turn into class, and put all functions to place/remove objects (all, dynamic, etc.) into it
export type LoadedJob = AvailableJob & {
  props: Prop[];
  fixtureRemovals: FixtureRemoval[];
  checkpoints: Checkpoint[];
  spawnPointCoordinates: Vector3;
  spawnPointHeading: number;
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

export async function loadJob(jobHash: string) {
  const job = rockstarJobState.availableJobs.find(job => job.hash === jobHash);

  if (undefined === job) {
    throw new Error('job not available');
  }

  const props: Prop[] = parseJobProps(job.data);
  logger.debug(`Parsed ${props.length} prop(s) of job ${job.hash}`);

  const fixtureRemovals: FixtureRemoval[] = parseJobFixtureRemovals(job.data);
  logger.debug(`Parsed ${fixtureRemovals.length} fixture removal(s) of job ${job.hash}`);

  const checkpoints: Checkpoint[] = parseJobCheckpoints(job.data);
  logger.debug(`Parsed ${checkpoints.length} checkpoint(s) of job ${job.hash}`);

  for (const prop of props) {
    await loadModelByHash(prop.hash);
  }
  logger.debug(`Loaded ${props.length} prop models of job ${job.hash}`);

  rockstarJobState.loadedJob = {
    ...job,
    spawnPointCoordinates: checkpoints.at(-2)!.coordinates,
    spawnPointHeading: checkpoints.at(-2)!.heading,
    props,
    fixtureRemovals,
    checkpoints
  };

  logger.debug(`Loaded job ${jobHash} (parsed props, fixture removals and checkpoints)`);
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

async function updateNearbyJobPropsAndFixtures() {
  if (undefined === rockstarJobState.loadedJob) {
    return;
  }

  const { props, fixtureRemovals } = rockstarJobState.loadedJob;
  const playerCoords = playerState.coords ?? playerUtilService.getCoords();

  for (const prop of props) {
    const withinPlayerDistance = distanceBetweenVector3s(
      playerCoords,
      prop.coordinates
    ) <= PLAYER_DETECTION_RADIUS;

    if (withinPlayerDistance && undefined === prop.ref) {
      try {
        prop.ref = await placeProp(prop);
      } catch (error: any) {
        logger.warn(
          `Failed to place prop ${prop.hash} at ${JSON.stringify(prop.coordinates)}: `
          + `${error.message}`
        );
      }
    } else if (!withinPlayerDistance && undefined !== prop.ref) {
      DeleteObject(prop.ref);
      prop.ref = undefined;
    }
  }

  for (const fixtureRemoval of fixtureRemovals) {
    const withinPlayerDistance = distanceBetweenVector3s(
      playerCoords,
      fixtureRemoval.coordinates
    ) <= PLAYER_DETECTION_RADIUS;

    if (withinPlayerDistance && !fixtureRemoval.enabled) {
      try {
        enableFixtureRemoval(fixtureRemoval);
      } catch (error: any) {
        logger.warn(
          `Failed to enable fixture removal ${fixtureRemoval.hash} `
          + `at ${JSON.stringify(fixtureRemoval.coordinates)}: `
          + `${error.message}`
        );
      }
    } else if (!withinPlayerDistance && fixtureRemoval.enabled) {
      disableFixtureRemoval(fixtureRemoval);
    }
  }
}

export function tearDownPlacedJob() {
  // remove all placed props
  // replace all removed fixtures
}

async function placeProp(prop: Prop) {
  if (!IsModelInCdimage(prop.hash)) {
    throw new Error('not in cdimage');
  } else if (!IsModelValid(prop.hash)) {
    throw new Error('invalid model');
  }

  if (!HasModelLoaded(prop.hash)) {
    await loadModelByHash(prop.hash);
  }

  const propRef = CreateObjectNoOffset(
    prop.hash,
    prop.coordinates.x,
    prop.coordinates.y,
    prop.coordinates.z,
    false,
    true,
    false
  );

  SetEntityRotation(
    propRef,
    prop.rotation.x,
    prop.rotation.y,
    prop.rotation.z,
    PROP_ROTATION_ORDER.Z_Y_X,
    false
  );

  if (undefined !== prop.color) {
    SetObjectTextureVariant(propRef, prop.color);
  }

  SetEntityLodDist(propRef, PROP_LOD_DISTANCE);
  SetEntityCollision(propRef, !prop.hasCollision, !prop.hasCollision);
  FreezeEntityPosition(propRef, true); // to freeze dynamic props

  return propRef;
}

function enableFixtureRemoval(fixtureRemoval: FixtureRemoval) {
  CreateModelHideExcludingScriptObjects(
    fixtureRemoval.coordinates.x,
    fixtureRemoval.coordinates.y,
    fixtureRemoval.coordinates.z,
    fixtureRemoval.radius,
    fixtureRemoval.hash,
    true
  );
  fixtureRemoval.enabled = true;
}

function disableFixtureRemoval(fixtureRemoval: FixtureRemoval) {
  RemoveModelHide(
    fixtureRemoval.coordinates.x,
    fixtureRemoval.coordinates.y,
    fixtureRemoval.coordinates.z,
    fixtureRemoval.radius,
    fixtureRemoval.hash,
    false
  );
  fixtureRemoval.enabled = false;
}
