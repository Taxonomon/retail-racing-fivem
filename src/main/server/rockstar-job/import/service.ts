import registerAuthorizedCommand from "../../command/authorized-command";
import PERMISSIONS from "../../authorization/permission/permissions";
import playerState from "../../player/state";
import {findRockstarJobByJobId} from "../database";

const EXPECTED_JOB_ID_LENGTH = 22;
const REGEX_ROCKSTAR_JOB_ID = /[a-zA-Z0-9-_)]+$/;
const URL_RANGE_X = 3;
const URL_RANGE_Y = 500;
const JSON_LANGUAGES = ["en", "ja", "zh", "zh-cn", "fr", "de", "it", "ru", "pt", "pl", "ko", "es", "es-mx"];
const TIMEOUT_BETWEEN_FETCHES_MS = 100;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  + ' AppleWebKit/537.36 (KHTML, like Gecko)'
  + ' Chrome/91.0.4472.124 Safari/537.36';

export function registerImportJobCommand() {
  registerAuthorizedCommand({
    name: 'importjob',
    handler: async (netId: number, args: string[]) => await importJob(netId, args),
    permissions: [ PERMISSIONS.JOB.IMPORT ]
  });
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

  // TODO continue here (parse job metadata, validate job/race type, persist into db, etc...
}

async function fetchRockstarJobJson(jobId: string) {
  for (let x = 0; x <= URL_RANGE_X; x++) {
    for (let y = 0; y <= URL_RANGE_Y; y++) {
      for (const language of JSON_LANGUAGES) {
        try {
          const response = await fetch(toRockstarJobLink(jobId, x, y, language), {
            method: 'GET',
            headers: { 'User=Agent': USER_AGENT }
          });
          if (200 === response.status) {
            return response.json();
          }
        } catch (error) {
          throw new Error(
            'error whilst trying to fetch job json from R* services',
            { cause: error}
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
