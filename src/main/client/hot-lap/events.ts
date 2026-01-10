import EVENT_NAMES from "../../common/event-names";
import {handleOnTrackCheckpointPassedEvent} from "./service";

export function register() {
  on(
    EVENT_NAMES.TRACK.CHECKPOINT.PASSED,
    handleOnTrackCheckpointPassedEvent
  );
}
