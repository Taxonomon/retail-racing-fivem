import {AvailableJob} from "../../../common/rockstar/available-job";
import {Tick} from "../../../common/tick";
import logger from "../../logging/logger";

class RockstarJobState {
  availableJobs: AvailableJob[] = [];
  updateNearbyPropsAndFixtures: Tick = new Tick('update nearby job props and fixtures', logger);
  updatedNearbyPropsAndFixturesLastTick: boolean = false;
  loadedJob?: AvailableJob;
}

const rockstarJobState = new RockstarJobState();

export default rockstarJobState;
