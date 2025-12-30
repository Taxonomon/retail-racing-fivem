import {Player} from "./schema";
import playerIdentifiers from "./identifiers";
import playersRepo from "./repo";

async function getPlayerFromNetId(netId: number): Promise<Player | undefined> {
  const license2 = playerIdentifiers.getLicense2(netId);
  if (undefined === license2) {
    throw new Error(`no license2 identifier found for net id ${netId}`);
  }
  return await playersRepo.findByLicense2(license2);
}

function getPlayerNameFromNetId(netId: number): string {
  return GetPlayerName(netId);
}

const playerUtils = {
  getPlayerFromNetId,
  getPlayerNameFromNetId
};

export default playerUtils;
