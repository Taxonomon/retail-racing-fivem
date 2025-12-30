import {Generated, Insertable, Selectable, Updateable} from "kysely";

export interface PrincipalPermissionsTable {
  id: Generated<number>;
  principal: number;
  permission: number;
}

export type PrincipalPermission = Selectable<PrincipalPermissionsTable>;
export type NewPrincipalPermission = Insertable<PrincipalPermissionsTable>;
export type PrincipalPermissionUpdate = Updateable<PrincipalPermissionsTable>;
