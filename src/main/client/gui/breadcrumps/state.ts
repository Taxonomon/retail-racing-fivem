import {Tick} from "../../../common/tick";
import logger from "../../logging/logger";

class BreadcrumpsState {
  update: Tick = new Tick('update breadcrumps', logger);
}

const breadcrumpsState = new BreadcrumpsState();

export default breadcrumpsState;
