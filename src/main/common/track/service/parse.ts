import { Checkpoint, CheckpointEffect, CheckpointEffects, CheckpointProps, FixtureRemoval, Prop } from "../schemas";
import { IdentifiableConstant, LabeledConstant, ValueWithUnit } from "../../schemas";
import {
	CHECKPOINT_DISPLAY, CHECKPOINT_EFFECT, FIXTURE_REMOVAL, JOB_AREA, JOB_TYPE, RACE_TYPE
} from "../constants";
import { METER } from "../../unit/unit";

export function parseJobName(json: any): string | undefined {
	return json?.mission?.gen?.nm?.toString();
}

export function parseJobAuthor(json: any): string | undefined {
	return json?.mission?.gen?.ownerid?.toString();
}

export function parseJobDescription(json: any): string | undefined {
	const description: string[] = json?.mission?.gen?.dec;
	return undefined === description ? undefined : description.join('');
}

export function parseJobType(json: any): IdentifiableConstant | undefined {
	return getJobTypeById(json?.mission?.gen?.type);
}

export function parseJobAreas(json: any): LabeledConstant[] {
	const result: LabeledConstant[] = [];
	const values: string[] = json?.meta?.loc;

	values.forEach(value => {
		const jobArea = getJobAreaById(value);
		if (undefined !== jobArea) {
			result.push(jobArea);
		}
	});

	return result;
}

export function parseRaceType(json: any): IdentifiableConstant | undefined {
	return getRaceTypeById(json?.mission?.race?.type);
}

export function parseIsLapRace(json: any): boolean {
	return undefined !== json?.mission?.race?.lap;
}

export function parseRaceDistance(json: any): ValueWithUnit | undefined {
	const value = json?.mission?.race?.rdis;
	return undefined === value ? undefined : { value, unit: METER };
}

export function parseJobProps(json: any): Prop[] {
	const hasLODDistances = undefined !== json?.mission?.prop?.pLODDist;
	const hasCollisions = undefined !== json?.mission?.prop?.collision;
	return [
		...parseJobStaticProps(json, hasLODDistances, hasCollisions),
		...parseDynamicProps(json, hasLODDistances, hasCollisions),
	];
}

function parseJobStaticProps(
	json: any,
	hasLODDistances: boolean,
	hasCollisions: boolean
): Prop[] {
	const result: Prop[] = [];
	const count: number = json?.mission?.prop?.no ?? 0;

	if (undefined === json?.mission?.prop) {
		return result;
	}

	for (let i = 0; i < count; i++) {
		try {
			result.push({
				hash: json.mission.prop.model[i],
				isDynamic: false,
				coordinates: {
					x: json?.mission.prop.loc[i].x,
					y: json?.mission.prop.loc[i].y,
					z: json?.mission.prop.loc[i].z
				},
				rotation: {
					x: json?.mission.prop.vRot[i].x,
					y: json?.mission.prop.vRot[i].y,
					z: json?.mission.prop.vRot[i].z
				},
				hasCollision: hasCollisions && 1 === json?.mission?.prop?.collision[i],
				textureVariant: json?.mission?.prop?.prpclr[i]
			});
		} catch (error: any) {
			// swallow & do nothing
		}
	}

	return result;
}

function parseDynamicProps(
	json: any,
	hasLODDistances: boolean,
	hasCollisions: boolean
): Prop[] {
	const result: Prop[] = [];
	const count: number = json?.mission?.dprop?.no ?? 0;

	if (undefined === json?.mission?.dprop) {
		return result;
	}

	for (let i = 0; i < count; i++) {
		try {
			result.push({
				hash: json.mission.dprop.model[i],
				isDynamic: false,
				coordinates: {
					x: json?.mission.dprop.loc[i].x,
					y: json?.mission.dprop.loc[i].y,
					z: json?.mission.dprop.loc[i].z
				},
				rotation: {
					x: json?.mission.dprop.vRot[i].x,
					y: json?.mission.dprop.vRot[i].y,
					z: json?.mission.dprop.vRot[i].z
				},
				hasCollision: hasCollisions && 1 === json?.mission?.dprop?.collision[i],
				textureVariant: json?.mission?.dprop?.prpdclr[i]
			});
		} catch (error: any) {
			// swallow & do nothing
		}
	}

	return result;
}

export function parseJobFixtureRemovals(json: any): FixtureRemoval[] {
	const result: FixtureRemoval[] = [];
	const count: number = json?.mission?.dhprop?.no ?? 0;

	if (undefined === json?.mission?.dhprop) {
		return result;
	}

	for (let i = 0; i < count; i++) {
		try {
			result.push({
				enabled: false,
				hash: json.mission.dhprop.mn[i],
				coordinates: {
					x: json.mission.dhprop.pos[i].x,
					y: json.mission.dhprop.pos[i].y,
					z: json.mission.dhprop.pos[i].z
				},
				radius: json?.mission?.dhprop?.wprad[i] ?? FIXTURE_REMOVAL.DEFAULT_RADIUS
			});
		} catch (error: any) {
			// swallow & do nothing
		}
	}

	return result;
}

export function parseJobCheckpoints(json: any) {
	const result: Checkpoint[] = [];
	const count = json?.mission?.race?.chp ?? 0;

	for (let i = 0; i < count; i++) {
		try {
			let checkpoint: Checkpoint = {
				coordinates: json.mission.race.chl[i],
				heading: json.mission.race.chh[i],
				size: parseJobCheckpointSize(json?.mission?.race?.chs[i]),
				secondaryCheckpoint: parseJobSecondaryCheckpoint(json, i),
				// default for all checkpoints
				// hot lap/race mode may use other display properties (e.g. for pit/finish checkpoints)
				display: CHECKPOINT_DISPLAY.RETAIL,
				effects: parseJobCheckpointEffects(json, i)
			};

			if (undefined !== checkpoint.effects[0]?.apply) {
				checkpoint = checkpoint.effects[0].apply(checkpoint);
			}

			if (undefined !== checkpoint.effects[1]?.apply) {
				checkpoint = checkpoint.effects[1].apply(checkpoint);
			}

			result.push(checkpoint);
		} catch (error: any) {
			// swallow & do nothing
		}
	}

	// In an R* race, the start/finish checkpoint gets placed at the end of the checkpoints array.
	// For convenience, if possible, we'll pull it in front to the first index, and append the remaining
	// checkpoints after it.
	try {
		return [
			result.at(-1)!,
			...result.slice(0, -1)
		];
	} catch (error: any) {
		return result;
	}
}

export function parseJobSecondaryCheckpoint(
	json: any,
	index: number
): CheckpointProps | undefined {
	try {
		const result: CheckpointProps = {
			coordinates: {
				x: json.mission.race.sndchk[index].x,
				y: json.mission.race.sndchk[index].y,
				z: json.mission.race.sndchk[index].z,
			},
			heading: json.mission.race.sndrsp[index],
			size: parseJobCheckpointSize(json?.mission?.race?.chs2[index]),
			display: CHECKPOINT_DISPLAY.RETAIL
		};
    // if there's no secondary checkpoint, R* zeroes the coordinates
    return (
      0 === result.coordinates.x
      && 0 === result.coordinates.y
      && 0 === result.coordinates.z
    ) ? undefined : result;
	} catch (error: any) {
		return undefined;
	}
}

function parseJobCheckpointSize(size: number | undefined) {
	if (undefined === size) {
		return FIXTURE_REMOVAL.DEFAULT_RADIUS;
	}
	let finalSize = size * 10;
	return Math.max(finalSize, FIXTURE_REMOVAL.DEFAULT_RADIUS);
}

function parseJobCheckpointEffects(json: any, index: number): CheckpointEffects {
	const cpbs1Value: number = json?.mission?.race?.cpbs1[index] ?? -1;
	const cpbs2Value: number = json?.mission?.race?.cpbs2[index] ?? -1;

	let cpbs1Effect: CheckpointEffect | undefined;
	let cpbs2Effect: CheckpointEffect | undefined;

	for (const effect of Object.values(CHECKPOINT_EFFECT)) {
		// detect cpbs1 effect
		if (
			-1 !== cpbs1Value
			&& undefined === cpbs1Effect
			&& 1 === effect.cpbsType
			&& isBitSet(cpbs1Value, effect.id as number)
		) {
			cpbs1Effect = effect;
		}

		// detect cpbs2 effect
		if (
			-1 !== cpbs2Value
			&& undefined === cpbs2Effect
			&& 2 === effect.cpbsType
			&& isBitSet(cpbs2Value, effect.id as number)
		) {
			cpbs2Effect = effect;
		}

		// stop once everything has been found
		if (undefined !== cpbs1Effect && undefined !== cpbs2Effect) {
			break;
		}
	}

	return [cpbs1Effect, cpbs2Effect];
}

function getJobAreaById(id: string) {
	for (const jobArea of Object.values(JOB_AREA)) {
		if (id === jobArea.id) {
			return jobArea;
		}
	}
	return undefined;
}

function getJobTypeById(id: number) {
	for (const jobType of Object.values(JOB_TYPE)) {
		if (id === jobType.id) {
			return jobType;
		}
	}
	return undefined;
}

function getRaceTypeById(id: number) {
	for (const raceType of Object.values(RACE_TYPE)) {
		if (id === raceType.id) {
			return raceType;
		}
	}
	return undefined;
}

function isBitSet(x: number, n: number): boolean {
	return (x & (1 << n)) !== 0;
}
