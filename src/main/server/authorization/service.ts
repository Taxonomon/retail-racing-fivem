import {Player} from "../player/schema";
import playerPrincipalsRepo from "./player-principal/repo";
import logger from "../logging/logger";
import playerUtils from "../player/utils";
import {PlayerPrincipal} from "./player-principal/schema";

async function hasPermission(playerNetId: number, permission: string) {
  const playerName = playerUtils.getPlayerNameFromNetId(playerNetId);

  try {
    const player: Player | undefined = await playerUtils.getPlayerFromNetId(playerNetId);

    if (undefined === player) {
      logger.warn(
        `failed to check if player "${playerName}" (net id ${playerNetId}) has permission "${permission}": `
        + `no player found for given net id`
      );
      return false;
    }

    const playerPrincipalsWithPermission: PlayerPrincipal[] =
      await playerPrincipalsRepo.findByPlayerAndPermissionIdentifier(player, permission);

    return playerPrincipalsWithPermission.length > 0;
  } catch (error: any) {
    logger.error(
      `failed to check if player "${playerName}" (net id ${playerNetId}) has permission "${permission}": `
      + `${error?.message.toString().trim().length > 0 ? error.message : error.stack}`
    );
    return false;
  }
}

const authorizationService = { hasPermission };

export default authorizationService;
