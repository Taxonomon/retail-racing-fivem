import {Tick} from "../../../common/tick";
import logger from "../../logging/logger";
import {AvailableJob} from "../../../common/rockstar/job/available-job";
import {LoadedJob} from "./service";

class RockstarJobState {
  availableJobs: AvailableJob[] = [];
  updateNearbyPropsAndFixtures: Tick = new Tick('update nearby job props and fixtures', logger);
  updatedNearbyPropsAndFixturesLastTick: boolean = false;
  loadedJob?: LoadedJob;
}

const rockstarJobState = new RockstarJobState();

export default rockstarJobState;
