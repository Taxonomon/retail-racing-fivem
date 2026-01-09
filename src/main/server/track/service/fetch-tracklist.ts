import {FetchTrackListOptions} from "../schemas";
import {findAll as findAllTracks, findByEnabled as findTracksByEnabled, Track} from "../repo";
import {TrackFromServer} from "../../../common/track/schemas";

export async function fetchTrackList(
  options?: FetchTrackListOptions
): Promise<TrackFromServer[]> {
  const tracks: Track[] = options?.includeDisabledTracks
    ? await findAllTracks()
    : await findTracksByEnabled(true);
  return tracks.map(track => ({
    name: track.name,
    author: track.author,
    description: track.description ?? undefined,
    enabled: track.enabled,
    data: track.current_data,
    hash: track.hash_md5
  }));
}
