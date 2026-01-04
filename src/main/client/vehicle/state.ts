import {Tick} from "../../common/tick";
import logger from "../logging/logger";

class VehicleState {
  keepVehicleClean: boolean = false;
  keepVehicleCleanTick: Tick = new Tick('keep vehicle clean', logger);
  spawnInProgress: boolean = false;
}

const vehicleState = new VehicleState();

export default vehicleState;
