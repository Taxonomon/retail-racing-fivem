import {registerServerCallback} from "../callback/service";
import CALLBACK_NAMES from "../../common/callback/callback-names";
import {fetchTrackList} from "./service/fetch-tracklist";
import {isPlayerAdministrator} from "../player/authorization/service";
import {TrackFromServer} from "../../common/track/schemas";

export function register() {
  registerServerCallback(
    CALLBACK_NAMES.TRACK.FETCH_TRACKLIST,
    handleFetchAllAvailableJobsCallback
  );
}

async function handleFetchAllAvailableJobsCallback(netId: number): Promise<TrackFromServer[]> {
  return fetchTrackList({ includeDisabledTracks: await isPlayerAdministrator(netId) });
}
