import {Generated, Insertable, Selectable, Updateable} from "kysely";

export interface PermissionsTable {
  id: Generated<number>;
  identifier: string;
  description: string | null;
}

export type Permission = Selectable<PermissionsTable>;
export type NewPermission = Insertable<PermissionsTable>;
export type PermissionUpdate = Updateable<PermissionsTable>;
