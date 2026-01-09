import {CreateBlipProps, RemoveBlipProps} from "../../schemas";
import {CREATE_BLIP} from "../../constants";
import logger from "../../../logging/logger";

export function createBlip(props: CreateBlipProps) {
  const ref = AddBlipForCoord(props.coordinates.x, props.coordinates.y, props.coordinates.z);

  SetBlipSprite(ref, props.sprite.id);
  SetBlipColour(ref, props.color.id);
  SetBlipAlpha(ref, props.alpha);
  SetBlipDisplay(ref, CREATE_BLIP.PLACEMENT_MODE.MAIN_MAP_AND_MINIMAP_SELECTABLE_ON_MAP);
  SetBlipScale(ref, props.scale);

  if (0 === ref) {
    throw new Error(`Internal game error`);
  }

  logger.debug(`Created blip at ${JSON.stringify(props.coordinates)}`);
  return ref;
}

export function removeBlip(props: RemoveBlipProps) {
  if (0 === props.ref) {
    throw new Error(`Blip has not been created`);
  }
  RemoveBlip(0);
}
