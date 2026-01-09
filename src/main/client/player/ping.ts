import EVENT_NAMES from "../../common/event-names";
import {playerState} from "./state";

export default function startReceivingPingUpdates() {
  onNet(
    EVENT_NAMES.PLAYER.PING,
    (pingMs: number) => playerState.pingMs = pingMs
  );
}
