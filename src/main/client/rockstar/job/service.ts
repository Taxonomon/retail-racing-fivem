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
import {parseJobCheckpoints, parseJobFixtureRemovals, parseJobProps} from "../../../common/rockstar/job/parse";
import playerState from "../../player/state";
import playerUtilService from "../../player/util/service";
import {distanceBetweenVector3s, Vector3} from "../../../common/vector";
import {loadModelByHash} from "../../../common/model";
import {CheckpointDisplay} from "../../../common/rockstar/job/checkpoint-display";

export const PLAYER_DETECTION_RADIUS = 500;
const PROP_LOD_DISTANCE = 16960;

// moves the checkpoint a little bit down, so that the cylinder doesn't cut off right before the ground
// on tilted surfaces. the detection should still work the same, as it doesn't take into account height
// (although it should for air checkpoints in the future)
const DEFAULT_OFFSET: Vector3 = { x: 0, y: 0, z: 5 };
const DEFAULT_BLIP_COLOR = 5;

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

export type PlaceCheckpointProps = {
  display: CheckpointDisplay;
  coordinates: Vector3;
  followUpCoordinates: Vector3;
  size: number;
  offset?: Vector3;
};

export type DrawBlipProps = {
  coordinates: Vector3;
  scale: number;
  alpha: number;
};

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
  rockstarJobState.updateNearbyPropsAndFixtures.start(async () => {
    const { props, fixtureRemovals } = rockstarJobState.loadedJob;
    const playerCoordinates = playerState.coords ?? playerUtilService.getCoords();
    await updateNearbyProps(playerCoordinates, props, PLAYER_DETECTION_RADIUS);
    await updateNearbyFixtureRemovals(playerCoordinates, fixtureRemovals, PLAYER_DETECTION_RADIUS);
  });
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

    if ((withinPlayerDistance || prop.persistWhileOutOfRange) && undefined === prop.ref) {
      try {
        prop.ref = await placeProp(prop);
      } catch (error: any) {
        logger.warn(
          `Failed to place prop ${prop.hash} at ${JSON.stringify(prop.coordinates)}: `
          + `${error.message}`
        );
      }
    } else if (!withinPlayerDistance && undefined !== prop.ref && !prop.persistWhileOutOfRange) {
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

    if ((withinPlayerDistance || fixtureRemoval.persistWhileOutOfRange) && !fixtureRemoval.enabled) {
      try {
        enableFixtureRemoval(fixtureRemoval);
      } catch (error: any) {
        logger.warn(
          `Failed to enable fixture removal ${fixtureRemoval.hash} `
          + `at ${JSON.stringify(fixtureRemoval.coordinates)}: `
          + `${error.message}`
        );
      }
    } else if (!withinPlayerDistance && fixtureRemoval.enabled && !fixtureRemoval.persistWhileOutOfRange) {
      disableFixtureRemoval(fixtureRemoval);
    }
  }
}

export function tearDownPlacedJob() {
  const { props, fixtureRemovals, checkpoints } = rockstarJobState.loadedJob;

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

  // remove placed checkpoints and their blips
  checkpoints.forEach(checkpoint => {
    const { ref, blipRef } = checkpoint;
    if (undefined !== ref && 0 !== ref) {
      removeJobCheckpoint(checkpoint);
    }
    if (undefined !== blipRef && 0 !== blipRef) {
      removeBlip(blipRef);
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

export function placeJobCheckpoint(checkpoint: Checkpoint, followUpCoordinates: Vector3) {
  checkpoint.ref ??= placeCheckpoint({
    ...checkpoint,
    followUpCoordinates,
    offset: DEFAULT_OFFSET
  });

  if (undefined !== checkpoint.secondaryCheckpoint) {
    checkpoint.secondaryCheckpoint.ref ??= placeCheckpoint({
      ...checkpoint.secondaryCheckpoint,
      followUpCoordinates,
      offset: DEFAULT_OFFSET
    });
  }
}

function placeCheckpoint(props: PlaceCheckpointProps): number {
  const ref = CreateCheckpoint(
    props.display.type.index,
    props.coordinates.x - (props?.offset?.x ?? 0),
    props.coordinates.y - (props?.offset?.y ?? 0),
    props.coordinates.z - (props?.offset?.z ?? 0),
    props.followUpCoordinates?.x ?? props.coordinates.x,
    props.followUpCoordinates?.y ?? props.coordinates.y,
    props.followUpCoordinates?.z ?? props.coordinates.z,
    props.size,
    props.display.color.cylinder.r,
    props.display.color.cylinder.g,
    props.display.color.cylinder.b,
    props.display.color.cylinder.a ?? 100,
    0
  );

  SetCheckpointRgba2(
    ref,
    props.display.color.icon.r,
    props.display.color.icon.g,
    props.display.color.icon.b,
    props.display.color.icon.a ?? 100,
  );

  // mimic retail checkpoint heights (they are small)
  SetCheckpointCylinderHeight(
    ref,
    10,
    10,
    props.size
  );

  logger.debug(`Placed checkpoint at ${JSON.stringify(props.coordinates)}`);
  return ref;
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
