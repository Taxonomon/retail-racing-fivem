import rockstarJobState from "./state";
import callbackService from "../../callback/outbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import logger from "../../logging/logger";
import {AvailableJob} from "../../../common/rockstar/job/available-job";
import toast from "../../gui/toasts/service";
import {updateGameModeMenus} from "../../game-mode/menu";
import {Prop, PROP_ROTATION_ORDER} from "../../../common/rockstar/job/prop";
import {FixtureRemoval} from "../../../common/rockstar/job/fixture-removal";
import {Checkpoint, CheckpointProps} from "../../../common/rockstar/job/checkpoint";
import {parseJobCheckpoints, parseJobFixtureRemovals, parseJobProps} from "../../../common/rockstar/job/service";
import playerState from "../../player/state";
import playerUtilService from "../../player/util/service";
import {distanceBetweenVector3s, Vector3} from "../../../common/vector";
import {loadModelByHash} from "../../../common/model";
import {RGBColor} from "../../../common/color";
import {CheckpointEffect, ROUND, ROUND_SECONDARY} from "../../../common/rockstar/job/checkpoint-effect";

const PLAYER_DETECTION_RADIUS = 500;
const PROP_LOD_DISTANCE = 16960;
const ROUND_CHECKPOINT_SIZE_MULTIPLIER = 2.25;

const DEFAULT_CHECKPOINT_CYLINDER_COLOR: RGBColor = { r: 237,  g: 234,  b: 194,  a: 75 };
const DEFAULT_CHECKPOINT_ICON_COLOR: RGBColor = { r: 18,  g: 122,  b: 219,  a: 100 };
const DEFAULT_BLIP_COLOR = 5;

const CHECKPOINT_ICON = {
  SINGLE_ARROW: 1,
  NO_ICON: 49,
  FINISH: 4
};

const BLIP_SPRITES = {
  RADAR_LEVEL: 1
};

const BLIP_DISPLAY_MODE = {
  MAIN_MAP_AND_MINIMAP_SELECTABLE_ON_MAP: 6
};

export type LoadedJob = AvailableJob & JobObjects;

export type JobObjects = {
  props: Prop[];
  fixtureRemovals: FixtureRemoval[];
  checkpoints: Checkpoint[];
};

export type PlaceCheckpointProps = CheckpointProps & {
  isSecondary: boolean;
  effects?: CheckpointEffect[];
  followUpCheckpointCoordinates?: Vector3;
  cylinderColor?: RGBColor;
  iconColor?: RGBColor;
};

export type DrawBlipProps = {
  coordinates: Vector3;
  scale: number;
  alpha: number;
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

export async function getPreLoadedJobObjectsFromAvailableJob(job: AvailableJob) {
  const jobObjects: JobObjects = {
    props: parseJobProps(job.data),
    fixtureRemovals: parseJobFixtureRemovals(job.data),
    checkpoints: parseJobCheckpoints(job.data)
  };

  // pre-load prop models of all unique prop hashes
  for (const hash of new Set(jobObjects.props.map(prop => prop.hash))) {
    await loadModelByHash(hash);
  }

  return jobObjects;
}

export function startUpdatingNearbyJobPropsAndFixtures() {
  if (!rockstarJobState.updateNearbyPropsAndFixtures.isRunning()) {
    rockstarJobState.updateNearbyPropsAndFixtures.start(async () => {
      const { props, fixtureRemovals } = rockstarJobState.loadedJob;
      const playerCoordinates = playerState.coords ?? playerUtilService.getCoords();
      await updateNearbyProps(playerCoordinates, props, PLAYER_DETECTION_RADIUS);
      await updateNearbyFixtureRemovals(playerCoordinates, fixtureRemovals, PLAYER_DETECTION_RADIUS);
    });
  }
}

export function stopUpdatingNearbyJobPropsAndFixtures() {
  if (rockstarJobState.updateNearbyPropsAndFixtures.isRunning()) {
    rockstarJobState.updateNearbyPropsAndFixtures.stop();
  }
}

async function updateNearbyProps(
  playerCoordinates: Vector3,
  props: Prop[],
  detectionRadius: number
) {
  for (const prop of props) {
    const withinPlayerDistance = distanceBetweenVector3s(
      playerCoordinates,
      prop.coordinates
    ) <= detectionRadius;

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
      removeProp(prop);
    }
  }
}

async function updateNearbyFixtureRemovals(
  playerCoordinates: Vector3,
  fixtureRemovals: FixtureRemoval[],
  detectionRadius: number
) {
  for (const fixtureRemoval of fixtureRemovals) {
    const withinPlayerDistance = distanceBetweenVector3s(
      playerCoordinates,
      fixtureRemoval.coordinates
    ) <= detectionRadius;

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
  const { props, fixtureRemovals } = rockstarJobState.loadedJob;

  // remove placed props
  props.forEach(prop => {
    if (undefined !== prop.ref) {
      SetModelAsNoLongerNeeded(prop.ref);
      removeProp(prop);
    }
  });

  // disable fixture removals
  fixtureRemovals.forEach(fixtureRemoval => {
    if (fixtureRemoval.enabled) {
      disableFixtureRemoval(fixtureRemoval);
    }
  });
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

function removeProp(prop: Prop) {
  if (undefined !== prop.ref) {
    DeleteObject(prop.ref);
    prop.ref = undefined;
  }
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

export function placeJobCheckpoint(checkpoint: Checkpoint, followUpCheckpointCoordinates: Vector3) {
  checkpoint.ref ??= placeCheckpoint({
    ...checkpoint,
    followUpCheckpointCoordinates,
    isSecondary: false
  });

  if (undefined !== checkpoint.secondaryCheckpoint) {
    checkpoint.secondaryCheckpoint.ref ??= placeCheckpoint({
      ...checkpoint.secondaryCheckpoint,
      followUpCheckpointCoordinates,
      isSecondary: true
    });
  }
}

function placeCheckpoint(props: PlaceCheckpointProps): number {
  const withArrowIcon = undefined !== props.followUpCheckpointCoordinates;
  const finalProps = undefined === props.effects ? props : applyCheckpointEffects(props);

  const ref = CreateCheckpoint(
    withArrowIcon ? CHECKPOINT_ICON.SINGLE_ARROW : CHECKPOINT_ICON.NO_ICON,
    finalProps.coordinates.x,
    finalProps.coordinates.y,
    finalProps.coordinates.z,
    finalProps.followUpCheckpointCoordinates?.x ?? finalProps.coordinates.x,
    finalProps.followUpCheckpointCoordinates?.y ?? finalProps.coordinates.y,
    finalProps.followUpCheckpointCoordinates?.z ?? finalProps.coordinates.z,
    finalProps.size,
    DEFAULT_CHECKPOINT_CYLINDER_COLOR.r,
    DEFAULT_CHECKPOINT_CYLINDER_COLOR.g,
    DEFAULT_CHECKPOINT_CYLINDER_COLOR.b,
    DEFAULT_CHECKPOINT_CYLINDER_COLOR.a ?? 100,
    0
  );

  if (withArrowIcon) {
    SetCheckpointRgba2(
      ref,
      DEFAULT_CHECKPOINT_ICON_COLOR.r,
      DEFAULT_CHECKPOINT_ICON_COLOR.g,
      DEFAULT_CHECKPOINT_ICON_COLOR.b,
      DEFAULT_CHECKPOINT_ICON_COLOR.a ?? 100,
    );
  }

  logger.debug(`Placed checkpoint at ${JSON.stringify(props.coordinates)}`);
  return ref;
}

function applyCheckpointEffects(props: PlaceCheckpointProps) {
  const result: PlaceCheckpointProps = { ...props };

  // this can be done better, but for now this suffices
  if (undefined === props.effects) {
    return result;
  } else if (
    (props.effects.includes(ROUND) && !props.isSecondary)
    || (props.effects.includes(ROUND_SECONDARY) && props.isSecondary)
  ) {
    result.size *= ROUND_CHECKPOINT_SIZE_MULTIPLIER;
  }

  return result;
}

export function removeJobCheckpoint(checkpoint: Checkpoint) {
  if (undefined !== checkpoint.ref) {
    DeleteCheckpoint(checkpoint.ref);
    checkpoint.ref = undefined;
    logger.debug(`Removed checkpoint at ${JSON.stringify(checkpoint.coordinates)}`);
  }

  if (undefined !== checkpoint.secondaryCheckpoint?.ref) {
    DeleteCheckpoint(checkpoint.secondaryCheckpoint.ref);
    checkpoint.secondaryCheckpoint.ref = undefined;
    logger.debug(
      `Removed secondary checkpoint at `
      + `${JSON.stringify(checkpoint.secondaryCheckpoint.coordinates)}`
    );
  }
}

export function drawBlip(props: DrawBlipProps): number {
  const ref = AddBlipForCoord(props.coordinates.x, props.coordinates.y, props.coordinates.z);
  SetBlipSprite(ref, BLIP_SPRITES.RADAR_LEVEL);
  SetBlipColour(ref, DEFAULT_BLIP_COLOR);
  SetBlipAlpha(ref, props.alpha);
  SetBlipDisplay(ref, BLIP_DISPLAY_MODE.MAIN_MAP_AND_MINIMAP_SELECTABLE_ON_MAP);
  SetBlipScale(ref, props.scale);
  return ref;
}

export function removeBlip(ref: number) {
  if (0 !== ref) {
    RemoveBlip(ref);
  }
}
