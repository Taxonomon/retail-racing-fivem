import CALLBACK_NAMES from "../../common/callback/callback-names";
import authorizationService from "./service";
import PERMISSIONS from "./permission/permissions";
import {registerServerCallback} from "../callback/service";

export default function registerAuthorizationCallbacks() {
  registerServerCallback(
    CALLBACK_NAMES.MENU.ACCESS.MODERATION,
    (playerNetId: number): Promise<boolean> =>
      authorizationService.hasPermission(playerNetId, PERMISSIONS.MENU.MODERATION.OPEN)
  );

  registerServerCallback(
    CALLBACK_NAMES.MENU.ACCESS.ADMINISTRATION,
    (playerNetId: number): Promise<boolean> =>
      authorizationService.hasPermission(playerNetId, PERMISSIONS.MENU.ADMINISTRATION.OPEN)
  );
}
