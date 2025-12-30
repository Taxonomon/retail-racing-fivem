import {Generated, Insertable, Selectable, Updateable} from "kysely";

export interface PrincipalsTable {
  id: Generated<number>;
  identifier: string;
  description: string | null;
}

export type Principal = Selectable<PrincipalsTable>;
export type NewPrincipal = Insertable<PrincipalsTable>;
export type PrincipalUpdate = Updateable<PrincipalsTable>;
