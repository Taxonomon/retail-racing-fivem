import {RACE} from "../../common/rockstar/job/job-type";
import {LAND, STUNT} from "../../common/rockstar/job/race-type";

export const TRACK_IMPORT = {
  EXPECTED_JOB_ID_LENGTH: 22,
  REGEX_ROCKSTAR_JOB_ID: /[a-zA-Z0-9-_)]+$/,
  URL: {
    RANGE: { X: 3, Y: 500 },
    LANGUAGES:  ["en", "ja", "zh", "zh-cn", "fr", "de", "it", "ru", "pt", "pl", "ko", "es", "es-mx"]
  },
  USER_AGENTS: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'AppleWebKit/537.36 (KHTML, like Gecko)',
    'Chrome/91.0.4472.124 Safari/537.36'
  ],
  SUPPORTED_JOB_TYPES: [ RACE ],
  SUPPORTED_RACE_TYPES: [ LAND, STUNT ],
  FETCH_TIMEOUT_MS: 100
};
