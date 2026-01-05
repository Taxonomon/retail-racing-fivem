import {Tick} from "../../common/tick";
import logger from "../logging/logger";
import {ConnectedPlayer} from "./connection/service";

class PlayerState {
  connectedPlayers: ConnectedPlayer[] = [];
  pings: Map<string, number> = new Map(); // key = netId, value = pingMs
  updatePings: Tick = new Tick('update player pings', logger);
  playerSettingsLastSavedAt: Date = new Date();

  getConnectedPlayer(netId: number): ConnectedPlayer {
    const result = this.connectedPlayers.find(player => netId === player.netId);
    if (undefined === result) {
      throw new Error(`no connected player found for net id ${netId}`);
    }
    return result;
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
