import {ConnectedPlayer} from "../../player/connection/service";
import playerState from "../../player/state";
import {TRACK_IMPORT} from "../constants";
import {
  findByHashMd5 as findTrackByHashMd5,
  findByRockstarJobId as findTrackByRockstarJobId,
  insert as insertTrack
} from "../repo";
import {wait} from "../../../common/wait";
import {ImportedJobMetadata} from "../schemas";
import {
  parseIsLapRace,
  parseJobAuthor,
  parseJobDescription,
  parseJobName,
  parseJobType,
  parseRaceType
} from "../../../common/track/service/parse";
import {hashWithMd5} from "../../../common/hash";
import logger from "../../logging/logger";
import {LOG_LEVELS} from "../../../common/logging/level";

export async function importTrack(netId: number, jobId: string): Promise<void> {
  const player: ConnectedPlayer = playerState.getConnectedPlayer(netId);

  await validateIfJobIdIsImportable(jobId);

  const json: any = await fetchJobJson(jobId)
  const metadata: ImportedJobMetadata = parseJobMetadata(json);

  await validateJobMetadata(metadata);

  await insertTrack({
    name: metadata.name,
    author: metadata.author,
    description: metadata.description,
    added_at: new Date(),
    added_by: player.id,
    enabled: false,
    original_data: json,
    current_data: json,
    rockstar_job_id: jobId,
    hash_md5: metadata.hash
  });

  logger.info(
    `Imported new track "${metadata.name}" by "${metadata.author}" `
    + `(jobId: ${jobId}, imported by: ${player.nickname} (id: ${player.id}))`
  );

  logger.logClientMessage(
    netId,
    LOG_LEVELS.INFO,
    `Imported new track "${metadata.name}" by "${metadata.author}"`
  );

  // TODO refresh track list of all clients
}

async function validateIfJobIdIsImportable(jobId: string) {
  if (TRACK_IMPORT.EXPECTED_JOB_ID_LENGTH !== jobId.length) {
    throw new Error('Invalid R* job id (unexpected length)');
  } else if (!TRACK_IMPORT.REGEX_ROCKSTAR_JOB_ID.test(jobId)) {
    throw new Error('Invalid R* job id (unexpected format)');
  } else if (undefined !== await findTrackByRockstarJobId(jobId)) {
    throw new Error('Job of same R* job id already exists');
  }
}

async function fetchJobJson(jobId: string) {
  for (let x = 0; x < TRACK_IMPORT.URL.RANGE.X; x++) {
    for (let y = 0; y < TRACK_IMPORT.URL.RANGE.Y; y++) {
      for (const language of TRACK_IMPORT.URL.LANGUAGES) {
        const url = toJobUrl(jobId, x, y, language);
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: { 'User-Agent': TRACK_IMPORT.USER_AGENTS.join('' ) }
          });
          if (response.ok) {
            return response.json();
          } else {
            await wait(TRACK_IMPORT.FETCH_TIMEOUT_MS)
          }
        } catch (error: any) {
          throw new Error('Fetch of R* job JSON failed', { cause: error });
        }
      }
    }
  }
  throw new Error('R* endpoint did not return any job JSON for the given R* job id');
}

function toJobUrl(jobId: string, x: number, y: number, language: string) {
  return `http://prod.cloud.rockstargames.com/ugc/gta5mission/0000/${jobId}/${x}_${y}_${language}.json`;
}

function parseJobMetadata(json: any): ImportedJobMetadata {
  const name = parseJobName(json);
  const author = parseJobAuthor(json);
  const jobType = parseJobType(json);
  const raceType = parseRaceType(json);

  if (undefined === name) {
    throw new Error('Fetched R* job JSON is missing job name');
  } else if (undefined === author) {
    throw new Error('Fetched R* job JSON is missing job author');
  } else if (undefined === jobType) {
    throw new Error('Fetched R* job JSON is missing job type');
  } else if (undefined === raceType) {
    throw new Error('Fetched R* job JSON is missing race type');
  }

  return {
    name,
    author,
    description: parseJobDescription(json),
    hash: hashWithMd5(json),
    jobType,
    raceType,
    isLapRace: parseIsLapRace(json)
  };
}

async function validateJobMetadata(metadata: ImportedJobMetadata) {
  if (!TRACK_IMPORT.SUPPORTED_JOB_TYPES.includes(metadata.jobType)) {
    throw new Error(`Unsupported job type "${metadata.jobType.label}"`);
  } else if (!TRACK_IMPORT.SUPPORTED_RACE_TYPES.includes(metadata.raceType)) {
    throw new Error(`Unsupported race type "${metadata.raceType.label}"`);
  } else if (!metadata.isLapRace) {
    throw new Error('Not a lap race');
  } else if (undefined !== await findTrackByHashMd5(metadata.hash)) {
    throw new Error(`Job of same hash already exists (${metadata.hash})`);
  }
}
