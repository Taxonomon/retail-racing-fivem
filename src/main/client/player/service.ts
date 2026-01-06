import {Vector3} from "../../common/vector";
import {waitOneFrame} from "../../common/wait";

export function getClientCoordinates(): Vector3 {
  const [ x, y, z ] = GetEntityCoords(PlayerPedId());
  return { x, y, z };
}

export async function teleportPlayerToCoordinates(
  coordinates: Vector3,
  heading: number,
  options?: {
    freezeAfterTeleportForMs?: number,
    teleportWithVehicle?: boolean,
    findCollisionLand?: boolean
  }
) {
  if (undefined !== options?.freezeAfterTeleportForMs) {
    FreezeEntityPosition(PlayerId(), true);
  }

  StartPlayerTeleport(
    PlayerId(),
    coordinates.x,
    coordinates.y,
    coordinates.z,
    heading,
    options?.teleportWithVehicle ?? false,
    options?.findCollisionLand ?? true,
    true
  );

  const teleportedAt = GetGameTimer();

  if (undefined !== options?.freezeAfterTeleportForMs) {
    while (GetGameTimer() - teleportedAt < options.freezeAfterTeleportForMs) {
      await waitOneFrame();
    }
  }

  FreezeEntityPosition(PlayerId(), false);
}
