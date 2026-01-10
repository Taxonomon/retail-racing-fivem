import { CreateBlipProps, RemoveBlipProps } from "../../schemas";
import { BLIP } from "../../constants";
import logger from "../../../logging/logger";

export function createBlip(props: CreateBlipProps) {
	const ref = AddBlipForCoord(props.coordinates.x, props.coordinates.y, props.coordinates.z);

	SetBlipSprite(ref, props.sprite.id as number);
	SetBlipColour(ref, props.color.id as number);
	SetBlipAlpha(ref, props.alpha);
	SetBlipDisplay(ref, BLIP.PLACEMENT_MODE.MAIN_MAP_AND_MINIMAP_SELECTABLE_ON_MAP);
	SetBlipScale(ref, props.scale);

  if (undefined !== props.index) {
    ShowNumberOnBlip(ref, props.index);
  }

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
	RemoveBlip(props.ref);
}
