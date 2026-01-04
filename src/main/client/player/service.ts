import {Vector3} from "../../common/vector";

export function getClientCoordinates(): Vector3 {
  const [ x, y, z ] = GetEntityCoords(PlayerPedId());
  return { x, y, z };
}
