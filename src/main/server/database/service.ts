import databaseState from "./state";
import logger from "../logging/logger";
import CONVARS from "../convars";
import {Pool} from "pg";
import {RockstarJobsTable} from "../rockstar/job/database";
import {Kysely, LogEvent, PostgresDialect, sql} from "kysely";
import {
  PermissionsTable,
  PlayerPrincipalsTable,
  PrincipalPermissionsTable,
  PrincipalsTable
} from "../player/authorization/database";
import {PastNicknamesTable, PlayersTable} from "../player/database";
import {PlayerSettingsTable} from "../player/settings/database";

const CONNECTION_HEALTH_CHECK_FALLBACK_INTERVAL_MS = 60000;

export interface DatabaseSchema {
  players: PlayersTable;
  past_nicknames: PastNicknamesTable;
  principals: PrincipalsTable;
  permissions: PermissionsTable;
  principal_permissions: PrincipalPermissionsTable;
  player_principals: PlayerPrincipalsTable;
  rockstar_jobs: RockstarJobsTable;
  player_settings: PlayerSettingsTable;
}

export function configureDatabaseConnection() {
  databaseState.db = new Kysely<DatabaseSchema>({
    log: logDatabaseEvent,
    dialect: new PostgresDialect({
      pool: new Pool({
        host: GetConvar(CONVARS.DB.HOST, 'localhost'),
        port: GetConvarInt(CONVARS.DB.PORT, 5432),
        user: GetConvar(CONVARS.DB.USER, 'user'),
        password: GetConvar(CONVARS.DB.PASSWORD, 'secret'),
        database: GetConvar(CONVARS.DB.DATABASE, 'public')
      })
    })
  });
  logger.info(`Configured database connection`);
}

function logDatabaseEvent(event: LogEvent) {
  const sql = event.query.sql;
  const params = event.query.parameters;
  const paramsString = typeof params === 'object' ? JSON.stringify(params) : params;
  const executionDurationMs = event.queryDurationMillis;

  if ('query' === event.level) {
    logger.trace(
      `Executed database query "${sql}" `
      + `with params ${paramsString} `
      + `in ${executionDurationMs.toFixed(0)} ms`
    );
  } else if ('error' === event.level) {
    logger.error(
      `Failed to execute database query "${sql}" `
      + `with params ${paramsString}: ${event.error}`
    );
  }
}

export function startMonitoringDatabaseConnectionHealth() {
  if (!databaseState.monitorConnectionHealth.isRunning()) {
    databaseState.monitorConnectionHealth.start(
      async () => performDatabaseConnectionHealthCheck(),
      GetConvarInt(
        CONVARS.DB.HEALTH_CHECK_INTERVAL_MS,
        CONNECTION_HEALTH_CHECK_FALLBACK_INTERVAL_MS
      )
    );
  }
}

async function performDatabaseConnectionHealthCheck() {
  logger.trace(`Performing database connection health check`);

  const isFirstCheck = undefined === databaseState.connectionIsHealthy;
  databaseState.connectionIsHealthy = await performDatabaseConnectionHealthCheckQuery();

  if (!databaseState.connectionIsHealthy) {
    databaseState.connectionUnhealthySince ??= new Date();
    logger.warn(
      'Database connection health check failed! '
      + 'Check if database is online and reachable '
      + `(disconnected since ${databaseState.connectionUnhealthySince.toISOString()})`
    );
  } else if (isFirstCheck) {
    logger.info(
      'Initial database connection health check succeeded! '
      + 'Database is online and reachable'
    );
  } else if (undefined !== databaseState.connectionUnhealthySince) {
    logger.info(
      'Database connection health check succeeded! '
      + `(previously disconnected since ${databaseState.connectionUnhealthySince?.toISOString()})`
    );
    databaseState.connectionUnhealthySince = undefined;
  }
}

async function performDatabaseConnectionHealthCheckQuery() {
  try {
    await sql`SELECT 1`.execute(databaseState.db);
    return true;
  } catch (error: any) {
    const errorMsg = 0 === error?.message?.trim().length ? error.stack : error.message;
    logger.error(`Database connection health check query failed with error: ${errorMsg}`);
    return false;
  }
}
