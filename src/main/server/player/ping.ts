import playerState from "./state";
import EVENT_NAMES from "../../common/event-names";

export default function startUpdatingPlayerPings() {
  playerState.updatePings.start(() => {
    const connectedNetIds = getPlayers();

    // get ping of all connected players
    for (const netId of connectedNetIds) {
      const ping = GetPlayerPing(netId);
      playerState.pings.set(netId, ping);
      emitNet(EVENT_NAMES.PLAYER.PING, netId, ping)
    }

    // clean up entries of ids which are no connected to the server
    let netIdsNoLongerConnected: Set<string> = new Set();

    playerState.pings.forEach((value, netId) => {
      if (!connectedNetIds.includes(netId)) {
        netIdsNoLongerConnected.add(netId);
      }
    });

    netIdsNoLongerConnected.forEach((netId) => {
      playerState.pings.delete(netId);
    });
  });
}
