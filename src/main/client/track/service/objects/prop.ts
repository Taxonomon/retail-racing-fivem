import { CreatePropProps, GetPropsOptions, RemovePropProps } from "../../schemas";
import { getTrackByHash } from "../tracklist";
import { loadModelByHash } from "../../../../common/model";
import logger from "../../../logging/logger";
import { parseJobProps } from "../../../../common/track/service/parse";
import { Prop } from "../../../../common/track/schemas";
import { PROP } from "../../constants";

export async function getTrackProps(trackHash: string, options: GetPropsOptions): Promise<Prop[]> {
	try {
		const result = parseJobProps(getTrackByHash(trackHash).data);
		if (options.preload) {
			for (const prop of result) {
				await loadModelByHash(prop.hash);
			}
		}
		return result;
	} catch (error: any) {
		throw new Error(
			`Failed to get props of track ${trackHash}`,
			{ cause: error }
		);
	}
}

export async function createProp(props: CreatePropProps) {
	if (!IsModelInCdimage(props.hash)) {
		throw new Error('Not in cdimage');
	} else if (!IsModelValid(props.hash)) {
		throw new Error('Invalid model');
	}

	if (!HasModelLoaded(props.hash)) {
		await loadModelByHash(props.hash);
	}

	const ref = CreateObjectNoOffset(
		props.hash,
		props.coordinates.x,
		props.coordinates.y,
		props.coordinates.z,
		false,
		true,
		false
	);

	SetEntityRotation(
		ref,
		props.rotation.x,
		props.rotation.y,
		props.rotation.z,
		PROP.ROTATION_ORDER.Z_X_Y,
		false
	);

	if (undefined !== props.textureVariant) {
		SetObjectTextureVariant(ref, props.textureVariant);
	}

	SetEntityLodDist(ref, props.lodDistance);
	SetEntityCollision(ref, !props.hasCollision, !props.hasCollision);
	FreezeEntityPosition(ref, true); // to freeze dynamic props

	logger.debug(`Created prop ${props.hash} at ${JSON.stringify(props.coordinates)}`);

	if (0 === ref) {
		throw new Error(`Internal game error`);
	}

	return ref;
}

export function removeProp(props: RemovePropProps) {
	if (0 === props.ref) {
		throw new Error(`Prop has not been created`);
	}
  const unload = props.unload ?? true;
  if (unload) {
    SetObjectAsNoLongerNeeded(props.ref);
  }
	DeleteObject(props.ref);
	logger.debug(`Removed prop ${props.hash} at ${JSON.stringify(props.coordinates)}`);
}
