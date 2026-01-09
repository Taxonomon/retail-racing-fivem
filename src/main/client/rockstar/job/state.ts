import {Tick} from "../../../common/tick";
import logger from "../../logging/logger";
import {AvailableJob} from "../../../common/rockstar/job/available-job";
import {LoadedJob} from "./service";
import {Prop} from "../../../common/rockstar/job/prop";
import {FixtureRemoval} from "../../../common/rockstar/job/fixture-removal";

class RockstarJobState {
  availableJobs: AvailableJob[] = [];
  updateNearbyPropsAndFixtures: Tick = new Tick('update nearby job props and fixtures', logger);

  private _loadedJob?: LoadedJob;

  get loadedJob() {
    if (undefined === this._loadedJob) {
      throw new Error('loaded job undefined');
    }
    return this._loadedJob;
  }

  set loadedJob(loadedJob: LoadedJob) {
    this._loadedJob = loadedJob;
  }
}

const rockstarJobState = new RockstarJobState();

export default rockstarJobState;
