import { playerState } from "../../player/state";
import { trackState } from "../state";
import { CREATE_PROP, UPDATE_NEARBY_TRACK_OBJECTS } from "../constants";
import { FixtureRemoval, Prop } from "../../../common/track/schemas";
import { Vector3 } from "../../../common/schemas";
import { distanceBetweenVector3s } from "../../../common/vector";
import { createProp, removeProp } from "./objects/prop";
import logger from "../../logging/logger";
import { toggleFixtureRemoval } from "./objects/fixture-removal";

export function startUpdatingNearbyTrackObjects(
	props: Prop[],
	fixtureRemovals: FixtureRemoval[],
	detectionRadius: number
): void {
	// Start the process with the currently loaded track
	if (trackState.updateNearbyTrackObjects.isRunning()) {
		throw new Error('Process already running');
	}

	trackState.updateNearbyTrackObjects.start(
		async () => await updateNearbyTrackObjects(props, fixtureRemovals, detectionRadius),
		UPDATE_NEARBY_TRACK_OBJECTS.INTERVAL_MS
	);
}

export function stopUpdatingNearbyTrackObjects(): void {
	if (!trackState.updateNearbyTrackObjects.isRunning()) {
		throw new Error('Process is not running');
	}
	trackState.updateNearbyTrackObjects.stop();
}

async function updateNearbyTrackObjects(
	props: Prop[],
	fixtureRemovals: FixtureRemoval[],
	detectionRadius: number
): Promise<void> {
	const playerCoordinates = playerState.coordinates;
	await updateNearbyProps(playerCoordinates, props, detectionRadius);
	updateNearbyFixtureRemovals(playerCoordinates, fixtureRemovals, detectionRadius);
}

async function updateNearbyProps(
	playerCoordinates: Vector3,
	props: Prop[],
	detectionRadius: number
): Promise<void> {
	for (const prop of props) {
		const withinPlayerDistance = distanceBetweenVector3s(
			playerCoordinates,
			prop.coordinates
		) <= detectionRadius;

		if (
			(withinPlayerDistance || prop.persistWhileOutOfRange)
			&& undefined === prop.ref
		) {
			try {
				prop.ref = await createProp({
					...prop,
					lodDistance: CREATE_PROP.LOD_DISTANCE.DEFAULT
				});
			} catch (error: any) {
				logger.warn(
					`Could not place prop ${prop.hash} `
					+ `at ${JSON.stringify(prop.coordinates)}: `
					+ `${error.message}`
				);
			}
		} else if (
			!prop.persistWhileOutOfRange
			&& !withinPlayerDistance
			&& undefined !== prop.ref
		) {
			try {
				removeProp({
					...prop,
					ref: prop.ref
				});
				prop.ref = undefined;
			} catch (error: any) {
				logger.warn(
					`Could not remove prop ${prop.hash} `
					+ `at ${JSON.stringify(prop.coordinates)}: `
					+ `${error.message}`
				);
			}
		}
	}
}

function updateNearbyFixtureRemovals(
	playerCoordinates: Vector3,
	fixtureRemovals: FixtureRemoval[],
	detectionRadius: number
) {
	for (const fixtureRemoval of fixtureRemovals) {
		const withinPlayerDistance = distanceBetweenVector3s(
			playerCoordinates,
			fixtureRemoval.coordinates
		) <= detectionRadius;

		if (
			(withinPlayerDistance || fixtureRemoval.persistWhileOutOfRange)
			&& !fixtureRemoval.enabled
		) {
			try {
				toggleFixtureRemoval({
					...fixtureRemoval,
					enable: true
				});
				fixtureRemoval.enabled = true;
			} catch (error: any) {
				logger.warn(
					`Could not enable fixture removal for hash ${fixtureRemoval.hash} `
					+ `at ${JSON.stringify(fixtureRemoval.coordinates)}: `
					+ `${error.message}`
				);
			}
		} else if (
			!fixtureRemoval.persistWhileOutOfRange
			&& !withinPlayerDistance
			&& fixtureRemoval.enabled
		) {
			try {
				toggleFixtureRemoval({
					...fixtureRemoval,
					enable: false
				});
				fixtureRemoval.enabled = true;
			} catch (error: any) {
				logger.warn(
					`Could not disable fixture removal for hash ${fixtureRemoval.hash} `
					+ `at ${JSON.stringify(fixtureRemoval.coordinates)}: `
					+ `${error.message}`
				);
			}
		}
	}
}
