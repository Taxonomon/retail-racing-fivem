import {VehicleSeat} from "../../common/rockstar/vehicle/vehicle-seat";

export interface SpawnByModelIdOptions {
  placeClientInSeat?: VehicleSeat;
  preserveSpeed?: boolean;
  engineOn?: boolean;
}
