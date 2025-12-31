import {Tick} from "../../common/tick";
import logger from "../logging/logger";
import {ConnectedPlayer} from "./connection/connected-player";

class PlayerState {
  connectedPlayers: ConnectedPlayer[] = [];
  pings: Map<string, number> = new Map(); // key = netId, value = pingMs
  updatePings: Tick = new Tick('update player pings', logger);

  getConnectedPlayer(netId: number): ConnectedPlayer | undefined {
    return this.connectedPlayers.find(connectedPlayer => netId === connectedPlayer.netId);
  }

  removeConnectedPlayer(netId: number) {
    const index = this.connectedPlayers.findIndex(connectedPlayer => connectedPlayer.netId === netId);
    if (index > -1) {
      this.connectedPlayers.splice(index, 1);
    }
  }
}

const playerState = new PlayerState();

export default playerState;
