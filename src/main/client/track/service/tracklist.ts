import { TrackFromServer } from "../../../common/track/schemas";
import { trackState } from "../state";
import { triggerServerCallback } from "../../callback/service/request";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import logger from "../../logging/logger";

export async function updateTrackList(): Promise<void> {
	try {
		trackState.trackList = await fetchTrackList();
		logger.info(`Fetched ${trackState.trackList.length} tracks from server`);
	} catch (error: any) {
		logger.error(`Failed to update track list: ${error.message}`);
		trackState.trackList = [];
	}
}

async function fetchTrackList(): Promise<TrackFromServer[]> {
	const fetchResult = await triggerServerCallback({
		identifier: CALLBACK_NAMES.TRACK.FETCH_TRACKLIST
	});

	if (fetchResult.error) {
		throw new Error(`callback error: ${fetchResult.error}`);
	}

	return fetchResult.data as TrackFromServer[];
}

export function getTrackByHash(hash: string) {
	const result = trackState.trackList.find(track => track.hash === hash);
	if (undefined === result) {
		throw new Error(`No such track found for hash ${hash}`);
	}
	return result;
}
