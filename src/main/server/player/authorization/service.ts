import {registerServerCallback} from "../../callback/service";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import playerState from "../state";

export const PRINCIPALS = {
  MODERATOR: 'moderator',
  ADMINISTRATOR: 'administrator'
};

export const PERMISSIONS = {
  MENU: {
    MODERATION: {
      OPEN: 'menu:moderation:open'
    },
    ADMINISTRATION: {
      OPEN: 'menu:administration:open'
    }
  },
  JOB: {
    IMPORT: 'command:job:import'
  }
};

export default function registerPlayerAuthorizationCallbacks() {
  registerServerCallback(
    CALLBACK_NAMES.MENU.ACCESS.MODERATION,
    (playerNetId: number): Promise<boolean> =>
      doesPlayerHavePermission(playerNetId, PERMISSIONS.MENU.MODERATION.OPEN)
  );

  registerServerCallback(
    CALLBACK_NAMES.MENU.ACCESS.ADMINISTRATION,
    (playerNetId: number): Promise<boolean> =>
      doesPlayerHavePermission(playerNetId, PERMISSIONS.MENU.ADMINISTRATION.OPEN)
  );
}

export async function doesPlayerHavePrincipal(netId: number, principal: string) {
  return playerState.getConnectedPlayer(netId)?.principals.includes(principal);
}

export async function doesPlayerHavePermission(netId: number, permission: string) {
  return playerState.getConnectedPlayer(netId)?.permissions.includes(permission);
}

export async function isPlayerModerator(netId: number) {
  return doesPlayerHavePermission(netId, PRINCIPALS.MODERATOR);
}

export async function isPlayerAdministrator(netId: number) {
  return doesPlayerHavePermission(netId, PRINCIPALS.ADMINISTRATOR);
}
