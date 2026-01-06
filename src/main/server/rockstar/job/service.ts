import {registerServerCallback} from "../../callback/service";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import {AvailableJob} from "../../../common/rockstar/job/available-job";
import {findAllRockstarJobs, findRockstarJobsByEnabled, RockstarJob} from "./database";
import {isPlayerAdministrator} from "../../player/authorization/service";

export function registerRockstarJobCallbacks() {
  registerServerCallback(
    CALLBACK_NAMES.ROCKSTAR_JOB.FETCH_ALL,
    async (netId: number) => fetchAllRockstarJobs(netId)
  );
}

async function fetchAllRockstarJobs(netId: number): Promise<AvailableJob[]> {
  const jobs = await isPlayerAdministrator(netId)
    ? await findAllRockstarJobs()
    : await findRockstarJobsByEnabled(true);
  return jobs.map(job => toAvailableJob(job));
}

function toAvailableJob(job: RockstarJob): AvailableJob {
  return {
    name: job.name,
    author: job.author,
    description: job.description ?? undefined,
    data: job.current_data,
    hash: job.hash_md5,
    categories: [],
    enabled: job.enabled
  } satisfies AvailableJob;
}
