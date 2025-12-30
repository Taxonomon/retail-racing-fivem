import {PlayersTable} from "../player/schema";
import {PastNicknamesTable} from "../player/past-nicknames/schema";
import {PermissionsTable} from "../authorization/permission/schema";
import {PrincipalsTable} from "../authorization/principal/schema";
import {PrincipalPermissionsTable} from "../authorization/principal-permission/schema";
import {PlayerPrincipalsTable} from "../authorization/player-principal/schema";

export interface DatabaseSchema {
  players: PlayersTable;
  past_nicknames: PastNicknamesTable;
  principals: PrincipalsTable;
  permissions: PermissionsTable;
  principal_permissions: PrincipalPermissionsTable;
  player_principals: PlayerPrincipalsTable;
}
