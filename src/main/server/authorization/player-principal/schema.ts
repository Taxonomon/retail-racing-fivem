import {Generated, Insertable, Selectable, Updateable} from "kysely";

export interface PlayerPrincipalsTable {
  id: Generated<number>;
  player: number;
  principal: number;
  reason: string | null;
}

export type PlayerPrincipal = Selectable<PlayerPrincipalsTable>;
export type NewPlayerPrincipal = Insertable<PlayerPrincipalsTable>;
export type PlayerPrincipalUpdate = Updateable<PlayerPrincipalsTable>;
