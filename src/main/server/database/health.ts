import CONVARS from "../convars";
import databaseState from "./state";
import {sql} from "kysely";
import {Tick} from "../../common/tick";
import logger from "../logging/logger";

export class DatabaseHealthState {
  process: Tick;
  lastChecked?: Date;
  disconnectedSince?: Date;

  constructor(process: Tick) {
    this.process = process;
  }

  isHealthy(): boolean {
    return undefined === this.disconnectedSince;
  }
};

function startMonitor() {
  if (databaseState.health.process.isRunning()) {
    logger.warn(
      `Tried to start monitoring database health, `
      + `but monitor is already running since ${databaseState.health.process.startedAt?.toISOString()}`
    );
    return;
  }
  const intervalMs = GetConvarInt(CONVARS.DB.HEALTH_CHECK_INTERVAL_MS, 60000);
  databaseState.health.process.start(async () => monitor(), intervalMs);
}

async function monitor() {
  logger.debug('Performing database health check');
  databaseState.health.lastChecked = new Date();

  const previouslyHealthy: boolean | undefined = databaseState.health.isHealthy();
  let nowHealthy = false;

  try {
    await sql`SELECT 1`.execute(databaseState.db);
    nowHealthy = true;
  } catch (error: any) {
    // pg sometimes doesn't deliver an error message; only a stack
    const errorMsg = 0 === error?.message?.trim().length ? error.stack : error.message;
    logger.error(`Error whilst performing database health check: ${errorMsg}`);
  }

  if (nowHealthy) {
    if (!previouslyHealthy) {
      logger.info(
        `Database health reestablished `
        + `(previously disconnected since ${databaseState.health.disconnectedSince?.toISOString()})`
      );
      databaseState.health.disconnectedSince = undefined;
    }
  } else if (previouslyHealthy) {
    logger.warn(`Database health could not be verified (health check did not succeed)`);
    databaseState.health.disconnectedSince = new Date();
  }
}

const databaseHealth = { startMonitor };

export default databaseHealth;
