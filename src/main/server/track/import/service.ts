import registerAuthorizedCommand from "../../command/authorized-command";
import PERMISSIONS from "../../authorization/permission/permissions";
import playerState from "../../player/state";
import trackState from "../state";
import tracksRepo from "../repo";

const EXPECTED_JOB_ID_LENGTH = 22;
const REGEX_ROCKSTAR_JOB_ID = /[a-zA-Z0-9-_)]+$/;
const URL_RANGE_X = 3;
const URL_RANGE_Y = 500;
const JSON_LANGUAGES = ["en", "ja", "zh", "zh-cn", "fr", "de", "it", "ru", "pt", "pl", "ko", "es", "es-mx"];
const TIMEOUT_BETWEEN_FETCHES_MS = 100;

export function registerTrackImportCommand() {
  registerAuthorizedCommand({
    name: 'importTrack',
    handler: importTrack,
    permissions: [ PERMISSIONS.JOB.IMPORT ]
  });
}

async function importTrack(netId: number, args: string[], rawCommand: string): Promise<void> {
  const player = playerState.getConnectedPlayer(netId);

  if (trackState.importRunning) {
    throw new Error('another import is currently running');
  }

  if (undefined === args || 0 === args.length) {
    throw new Error('missing track id');
  }

  const jobId = args[0];
  validateJobId(jobId);

  const existingTrack = await tracksRepo.findByRockstarJobId(jobId);
  if (undefined !== existingTrack) {
    throw new Error(
      `track of same job id "${jobId}" already imported `
      + `("${existingTrack.name}" by "${existingTrack.author}")`
    );
  }

  const jobJson: any = await fetchRockstarJobJson(jobId);
  if (undefined === jobJson) {
    throw new Error(`no R* job JSON found for job id "${jobId}" after crawling all possible URLs`);
  }

  const jobName = jobParser.name(jobJson);
  const jobAuthor = jobParser.author(jobJson);
  const jobDescription = jobParser.description(jobJson);
  const jobHash = hashUtils.md5(jobJson);
  const jobType = jobParser.type(jobJson);
  const raceType = raceParser.raceType(jobJson);

  validateJobType(jobId, jobType);
  validateRaceType(jobId, raceType);

  if (!raceParser.isLapRace(jobJson)) {
    throw new Error('job "${jobId}" is not a lap race');
  }

  const trackOfSameHash: Track | undefined = await tracksRepo.findByHashMd5(jobHash);

  if (undefined !== trackOfSameHash) {
    throw new Error(`track of job id "${jobId}" has already been imported (matching hash)`);
  }

  const track: Track | undefined = await tracksRepo.insert({
    name: jobName,
    author: jobAuthor,
    description: jobDescription,
    added_at: new Date(),
    added_by: player.id,
    enabled: true,
    data: jobJson,
    rockstar_job_id: jobId,
    hash_md5: jobHash
  });

  if (undefined === track) {
    throw new Error(`failed to persist imported track for job id "${jobId}" (database error)`);
  }

  // TODO refresh list of available tracks for all connected clients

  logger.info(
    `imported new track "${jobName}" by "${jobAuthor}" `
    + `(rockstar job id: ${jobId}, imported by "${playerUtils.getPlayerNameFromNetId(netId)}")`
  );
  logger.logClientMessage(netId, LOG_LEVELS.INFO, `imported new track "${jobName}" by "${jobAuthor}"`);
}

function validateJobId(jobId: string): void {
  if (EXPECTED_JOB_ID_LENGTH !== jobId.length) {
    throw new Error(`job id "${jobId}" not of expected length`);
  }

  if (!REGEX_ROCKSTAR_JOB_ID.test(jobId)) {
    throw new Error(`job id "${jobId}" not of expected R* job id format`);
  }
}

function validateJobType(jobId: string, jobType: JobType | undefined) {
  if (undefined === jobType) {
    throw new Error(`missing job type for job id "${jobId}"`);
  }

  if (!rockstarJobType.isSupported(jobType)) {
    // @ts-ignore
    throw new Error(`unsupported job type "${jobType.name}" for job id "${jobId}"`);
  }
}

function validateRaceType(jobId: string, raceType: RaceType | undefined) {
  if (undefined === raceType) {
    throw new Error(`missing race type for job id "${jobId}"`);
  }

  if (!rockstarRaceType.isSupported(raceType)) {
    // @ts-ignore
    throw new Error(`unsupported race type "${raceType.id}" for job id "${jobId}"`);
  }
}

async function fetchRockstarJobJson(jobId: string): Promise<any> {
  for (let x = 0; x <= URL_RANGE_X; x++) {
    for (let y = 0; y <= URL_RANGE_Y; y++) {
      for (const language of JSON_LANGUAGES) {
        const json = await performFetch(
          jobId,
          // e.g. http://prod.cloud.rockstargames.com/ugc/gta5mission/0000/abcdefg/0_0_en.json
          // yes it's actually https and not http

        );

        if (undefined !== json) {
          return json;
        } else {
          await wait(TIMEOUT_BETWEEN_FETCHES_MS);
        }
      }
    }
  }
  return undefined;
}

async function performFetch(jobId: string, url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
      }
    });
    return 200 === response.status ? response.json() : undefined;
  } catch (err: any) {
    throw new Error(`failed to fetch R* job json for job id "${jobId}": ${err.message}`);
  }
}
