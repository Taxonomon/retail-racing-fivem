import {Kysely} from "kysely";
import {DatabaseSchema} from "./schema";
import {Tick} from "../../common/tick";
import {DatabaseHealthState} from "./health";
import logger from "../logging/logger";

class DatabaseState {
  private _db?: Kysely<DatabaseSchema>;
  readonly health: DatabaseHealthState = new DatabaseHealthState(
    new Tick('monitor database health', logger)
  );

  get db() {
    if (undefined === this._db) {
      throw new Error('cannot get db: db undefined');
    }
    return this._db;
  }

  set db(value: Kysely<DatabaseSchema>) {
    this._db = value;
  }
}

const databaseState = new DatabaseState();

export default databaseState;
