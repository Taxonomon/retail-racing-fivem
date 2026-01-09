import {parseJobFixtureRemovals} from "../../../../common/rockstar/job/parse";
import {getTrackByHash} from "../tracklist";
import {ToggleFixtureRemovalProps} from "../../schemas";
import logger from "../../../logging/logger";
import {FixtureRemoval} from "../../../../common/rockstar/job/fixture-removal";

export function getTrackFixtureRemovals(trackHash: string): FixtureRemoval[] {
  try {
    return parseJobFixtureRemovals(getTrackByHash(trackHash).data);
  } catch (error: any) {
    throw new Error(
      `Failed to get fixture removals of track ${trackHash}`,
      { cause: error }
    );
  }
}

export function toggleFixtureRemoval(props: ToggleFixtureRemovalProps) {
  if (props.enable) {
    CreateModelHideExcludingScriptObjects(
      props.coordinates.x,
      props.coordinates.y,
      props.coordinates.z,
      props.radius,
      props.hash,
      true
    );
  } else {
    RemoveModelHide(
      props.coordinates.x,
      props.coordinates.y,
      props.coordinates.z,
      props.radius,
      props.hash,
      false
    );
  }
  logger.debug(`
    ${props.enable ? 'Enabled' : 'Disabled'} fixture removal at `
    + `${JSON.stringify(props.coordinates)} (radius: ${props.radius})`
  );
}
