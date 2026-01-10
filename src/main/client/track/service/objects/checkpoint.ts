import { getTrackByHash } from "../tracklist";
import { CreateCheckpointProps } from "../../schemas";
import logger from "../../../logging/logger";
import { Checkpoint, CheckpointProps } from "../../../../common/track/schemas";
import { parseJobCheckpoints } from "../../../../common/track/service/parse";

export function getTrackCheckpoints(trackHash: string): Checkpoint[] {
	try {
		return parseJobCheckpoints(getTrackByHash(trackHash).data);
	} catch (error: any) {
		throw new Error(
			`Failed to get checkpoints of track ${trackHash}`,
			{ cause: error }
		);
	}
}

export function createCheckpoint(props: CreateCheckpointProps) {
	const ref = CreateCheckpoint(
		props.display.type.id,
		props.coordinates.target.x + (props?.offset?.x ?? 0),
		props.coordinates.target.y + (props?.offset?.y ?? 0),
		props.coordinates.target.z + (props?.offset?.z ?? 0),
		props.coordinates.followUp.x,
		props.coordinates.followUp.y,
		props.coordinates.followUp.z,
		props.size,
		props.display.color.cylinder.r,
		props.display.color.cylinder.g,
		props.display.color.cylinder.b,
		props.display.color.cylinder.a,
		props.display.type.reserved ? 1 : 0
	);

	SetCheckpointRgba2(
		ref,
		props.display.color.icon.r,
		props.display.color.icon.g,
		props.display.color.icon.b,
		props.display.color.icon.a,
	);

	SetCheckpointCylinderHeight(
		ref,
		props.height,
		props.height,
		props.size
	);

	if (0 === ref) {
		throw new Error(`Internal game error`);
	}

	logger.debug(`Created checkpoint at ${JSON.stringify(props.coordinates.target)}`);
	return ref;
}

export function removeCheckpoint(checkpoint: CheckpointProps) {
	if (undefined === checkpoint.ref || 0 === checkpoint.ref) {
		throw new Error(`Checkpoint has not been created`);
	}
	DeleteCheckpoint(checkpoint.ref);
	logger.debug(`Removed checkpoint at ${JSON.stringify(checkpoint.coordinates)}`);
}
