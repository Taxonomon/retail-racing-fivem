import {JobType} from "../../common/rockstar/job/job-type";
import {RaceType} from "../../common/rockstar/job/race-type";

export interface FetchTrackListOptions {
  includeDisabledTracks?: boolean;
}

export interface ImportedJobMetadata {
  name: string;
  author: string;
  description?: string;
  hash: string;
  jobType: JobType;
  raceType: RaceType;
  isLapRace: boolean;
}
