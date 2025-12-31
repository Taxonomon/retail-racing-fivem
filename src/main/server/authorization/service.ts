import playerState from "../player/state";

async function hasPrincipal(netId: number, principal: string) {
  return playerState.getConnectedPlayer(netId)?.principals.includes(principal);
}

async function hasPermission(netId: number, permission: string) {
  return playerState.getConnectedPlayer(netId)?.permissions.includes(permission);
}

const authorizationService = {
  hasPrincipal,
  hasPermission
};

export default authorizationService;
