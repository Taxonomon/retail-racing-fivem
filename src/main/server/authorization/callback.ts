import CALLBACK_NAMES from "../../common/callback/callback-names";
import authorizationService from "./service";
import PERMISSIONS from "./permission/permissions";
import callbackService from "../callback/inbound";

export default function registerAuthorizationCallbacks() {
  callbackService.register(
    CALLBACK_NAMES.MENU.ACCESS.MODERATION,
    (playerNetId: number): Promise<boolean> =>
      authorizationService.hasPermission(playerNetId, PERMISSIONS.MENU.MODERATION.OPEN)
  );

  callbackService.register(
    CALLBACK_NAMES.MENU.ACCESS.ADMINISTRATION,
    (playerNetId: number): Promise<boolean> =>
      authorizationService.hasPermission(playerNetId, PERMISSIONS.MENU.ADMINISTRATION.OPEN)
  );
}
