import {JobType, RACE} from "../../../../common/rockstar/job-type";
import {LAND, RaceType, STUNT} from "../../../../common/rockstar/race-type";
import {registerAuthorizedCommand} from "../../../command/service";
import playerState from "../../../player/state";
import {
  parseIsLapRace,
  parseJobAuthor,
  parseJobDescription,
  parseJobName,
  parseJobType,
  parseRaceType
} from "../parse/service";
import {hashWithMd5} from "../../../../common/hash";
import logger from "../../../logging/logger";
import {LOG_LEVELS} from "../../../../common/logging/level";
import {wait} from "../../../../common/wait";
import {findRockstarJobByJobId, insertRockstarJob, RockstarJob} from "../database";
import {PERMISSIONS} from "../../../player/authorization/service";

const EXPECTED_JOB_ID_LENGTH = 22;
const REGEX_ROCKSTAR_JOB_ID = /[a-zA-Z0-9-_)]+$/;
const URL_RANGE_X = 3;
const URL_RANGE_Y = 500;
const JSON_LANGUAGES = ["en", "ja", "zh", "zh-cn", "fr", "de", "it", "ru", "pt", "pl", "ko", "es", "es-mx"];
const TIMEOUT_BETWEEN_FETCHES_MS = 100;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  + ' AppleWebKit/537.36 (KHTML, like Gecko)'
  + ' Chrome/91.0.4472.124 Safari/537.36';

const SUPPORTED_JOB_TYPES: Set<JobType> = new Set([ RACE ]);
const SUPPORTED_RACE_TYPES: Set<RaceType> = new Set([ LAND, STUNT ]);

export function registerImportJobCommand() {
  registerAuthorizedCommand({
    name: 'importjob',
    handler: handleImportJobCommand,
    permissions: [PERMISSIONS.JOB.IMPORT]
  });
}

async function handleImportJobCommand(netId: number, args: string[]) {
  try {
    await importJob(netId, args);
  } catch (error: any) {
    throw new Error(`Error whilst trying to import job: ${error.message}`);
  }
}

async function importJob(netId: number, args: string[]) {
  const player = playerState.getConnectedPlayer(netId);

  if (undefined === args || 0 === args.length || undefined === args[0]) {
    throw new Error('missing job id');
  }

  const jobId: string = args[0];

  if (EXPECTED_JOB_ID_LENGTH !== jobId.length) {
    throw new Error('invalid job id (unexpected id length)');
  } else if (!REGEX_ROCKSTAR_JOB_ID.test(jobId)) {
    throw new Error('invalid job id (not of expected R* job id format');
  }

  const existingJob = await findRockstarJobByJobId(jobId);

  if (undefined !== existingJob) {
    throw new Error('job of same job id already exists');
  }

  const jobJson: any = await fetchRockstarJobJson(jobId);

  if (undefined === jobJson) {
    throw new Error('did not manage to fetch any R* job JSON from R* services');
  }

  const jobName = getJobNameFromJson(jobJson);
  const jobAuthor = getJobAuthorFromJson(jobJson);
  const jobDescription = parseJobDescription(jobJson);
  const jobHash = hashWithMd5(jobJson);

  validateJobType(jobJson);
  validateRaceType(jobJson);

  if (!parseIsLapRace(jobJson)) {
    throw new Error('job is not a lap race');
  }

  // TODO consider checking whether a job of the same hash was already imported

  const rockstarJob: RockstarJob = await insertRockstarJob({
    name: jobName,
    author: jobAuthor,
    description: jobDescription,
    added_at: new Date(),
    added_by: player.id,
    enabled: false,
    original_data: jobJson,
    current_data: jobJson,
    job_id: jobId,
    hash_md5: jobHash
  });

  logger.info(
    `Imported new job from job id ${jobId}: "${jobName}" by "${jobAuthor}" `
    + `(imported by "${player.nickname}")`
  );

  logger.logClientMessage(
    netId,
    LOG_LEVELS.INFO,
    `Imported new job from job id ${jobId}: "${jobName}" by "${jobAuthor}"`
  );

  // TODO refresh list of all available jobs for all connected clients
}

async function fetchRockstarJobJson(jobId: string) {
  for (let x = 0; x <= URL_RANGE_X; x++) {
    for (let y = 0; y <= URL_RANGE_Y; y++) {
      for (const language of JSON_LANGUAGES) {
        try {
          const response = await fetch(toRockstarJobLink(jobId, x, y, language), {
            method: 'GET',
            headers: {'User-Agent': USER_AGENT}
          });
          if (200 === response.status) {
            return response.json();
          }
          await wait(TIMEOUT_BETWEEN_FETCHES_MS);
        } catch (error) {
          throw new Error(
            'error whilst trying to fetch job json from R* services',
            {cause: error}
          );
        }
      }
    }
  }
  return undefined;
}

function toRockstarJobLink(jobId: string, x: number, y: number, language: string) {
  return `http://prod.cloud.rockstargames.com/ugc/gta5mission/0000/${jobId}/${x}_${y}_${language}.json`;
}

function getJobNameFromJson(json: any) {
  const jobName = parseJobName(json);
  if (undefined === jobName) {
    throw new Error('missing job name');
  }
  return jobName;
}

function getJobAuthorFromJson(json: any) {
  const jobAuthor = parseJobAuthor(json);
  if (undefined === jobAuthor) {
    throw new Error('missing job author');
  }
  return jobAuthor;
}

function validateJobType(json: any) {
  const jobType = parseJobType(json);
  if (undefined === jobType) {
    throw new Error('missing job type');
  } else if (!SUPPORTED_JOB_TYPES.has(jobType)) {
    throw new Error(`unsupported job type "${jobType.name}"`);
  }
}

function validateRaceType(json: any) {
  const raceType = parseRaceType(json);
  if (undefined === raceType) {
    throw new Error('missing race type');
  } else if (!SUPPORTED_RACE_TYPES.has(raceType)) {
    throw new Error(`unsupported race type "${raceType}"`);
  }
}
