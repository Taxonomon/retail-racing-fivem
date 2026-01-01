import EVENT_NAMES from "../../common/event-names";
import logger from "../logging/logger";
import playerState from "./state";
import playerUtils from "./utils";

function registerPlayerSelfKickListener() {
  onNet(EVENT_NAMES.PLAYER.KICK.SELF, (reason: string) => {
    kickPlayer(globalThis.source.toString(), reason);
  });
}

function kickPlayer(netId: string, reason: string) {
  const playerName = playerUtils.getPlayerNameFromNetId(Number(netId));
  DropPlayer(netId, reason);
  logger.info(`kicked player "${playerName}" (net id ${netId}): ${reason}`);
}

function kickAllPlayers(reason: string) {
  const netIds: Set<string> = new Set();

  playerState.connectedPlayers
    .map(p => p.netId.toString())
    .forEach(pId => netIds.add(pId));

  getPlayers().forEach(pId => netIds.add(pId));

  netIds.forEach(netId => kickPlayer(netId, reason));
}

const kickPlayerSerice = {
  registerPlayerSelfKickListener,
  kickPlayer,
  kickAllPlayers
};

export default kickPlayerSerice;
