import {Kysely} from "kysely";
import {Tick} from "../../common/tick";
import logger from "../logging/logger";
import {DatabaseSchema} from "./service";

class DatabaseState {
  private _db?: Kysely<DatabaseSchema>;

  readonly monitorConnectionHealth: Tick = new Tick('monitor database connection health', logger);
  connectionIsHealthy?: boolean;
  connectionUnhealthySince?: Date;

  get db() {
    if (undefined === this._db) {
      throw new Error('database connection config undefined');
    }
    return this._db;
  }

  set db(value: Kysely<DatabaseSchema>) {
    this._db = value;
  }
}

const databaseState = new DatabaseState();

export default databaseState;
