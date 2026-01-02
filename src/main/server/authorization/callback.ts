import CALLBACK_NAMES from "../../common/callback/callback-names";
import authorizationService from "./service";
import PERMISSIONS from "./permission/permissions";
import callback from "../callback/inbound";

export default function registerAuthorizationCallbacks() {
  callback.register(
    CALLBACK_NAMES.MENU.ACCESS.MODERATION,
    (playerNetId: number): Promise<boolean> =>
      authorizationService.hasPermission(playerNetId, PERMISSIONS.MENU.MODERATION.OPEN)
  );

  callback.register(
    CALLBACK_NAMES.MENU.ACCESS.ADMINISTRATION,
    (playerNetId: number): Promise<boolean> =>
      authorizationService.hasPermission(playerNetId, PERMISSIONS.MENU.ADMINISTRATION.OPEN)
  );
}
