import type {JobType} from "../../common/rockstar-job/job-type";
import jobType from "../../common/rockstar-job/job-type";
import {JOB_AREAS, JobArea} from "../../common/rockstar-job/job-areas";

function name(json: any): string {
  return json?.mission?.gen?.nm;
}

function author(json: any): string {
  return json?.mission?.gen?.ownerid;
}

function description(json: any): string | undefined {
  const description: string[] = json?.mission?.gen?.dec;
  return undefined === description ? undefined : description.join('');
}

function type(json: any): JobType | undefined {
  return jobType.byId(json?.mission?.gen?.type);
}

function areas(json: any): JobArea[] {
  const areas: string[] = json?.meta?.loc;

  if (undefined === areas) {
    return [];
  }

  const result: JobArea[] = [];

  for (const area of areas) {
    const jobArea: JobArea | undefined = JOB_AREAS.find((ja) => area === ja.id);
    if (undefined !== jobArea) {
      result.push(jobArea);
    }
  }

  return result;
}

const jobParser = {
  name,
  author,
  description,
  type,
  areas
};

export default jobParser;
