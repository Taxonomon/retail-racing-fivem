import {Kysely, PostgresDialect} from "kysely";
import {Pool} from "pg";
import databaseState from "./state";
import {DatabaseSchema} from "./schema";
import CONVARS from "../convars";
import logger from "../logging/logger";

function init() {
  logger.info('Initializing database dialect and connection pool');
  const dialect = new PostgresDialect({
    pool: new Pool({
      host: GetConvar(CONVARS.DB.HOST, 'localhost'),
      port: GetConvarInt(CONVARS.DB.PORT, 5432),
      user: GetConvar(CONVARS.DB.USER, 'user'),
      password: GetConvar(CONVARS.DB.PASSWORD, 'secret'),
      database: GetConvar(CONVARS.DB.DATABASE, 'public')
    })
  });

  logger.info('Initializing database api from connection pool');
  databaseState.db = new Kysely<DatabaseSchema>({
    dialect,
    log(event) {
      if (event.level === 'query') {
        logger.trace(
          `executed database query "${event.query.sql}" `
          + `with params "${typeof event.query.parameters === 'object' 
            ? JSON.stringify(event.query.parameters) 
            : event.query.parameters
          }"`
        );
      }
    }
  });
}

const databaseConnection = { init };

export default databaseConnection;
