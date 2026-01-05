import logger from "../logging/logger";
import {LOG_LEVELS} from "../../common/logging/level";
import {getPlayerNameFromNetId} from "../player/service";
import {doesPlayerHavePermission} from "../player/authorization/service";

export type AuthorizedCommandHandler =
  (playerId: number, args: string[], rawCommand: string) => void | Promise<void>;

export type RegisterAuthorizedCommandProps = {
  name: string;
  handler: AuthorizedCommandHandler;
  permissions: string[];
};

export function registerAuthorizedCommand(props: RegisterAuthorizedCommandProps) {
  RegisterCommand(
    props.name,
    async (source: string, args: string[], rawCommand: string) => {
      await handleAuthorizedCommand(Number(source), args, rawCommand, props);
    },
    false
  );
}

async function handleAuthorizedCommand(
  playerId: number,
  args: string[],
  rawCommand: string,
  props: RegisterAuthorizedCommandProps
) {
  const playerName = getPlayerNameFromNetId(playerId);
  const { name, handler, permissions } = props;

  for (const permission of permissions) {
    const authorized = await doesPlayerHavePermission(playerId, permission);
    if (!authorized) {
      logger.warn(
        `Player "${playerName}" tried to execute command "${name}" `
        + `with missing required permission "${permission}"`
      );
      logger.logClientMessage(
        playerId,
        LOG_LEVELS.WARN,
        `Could not execute command "${name}": unauthorized`
      );
      return;
    }
  }

  logger.debug(`Player "${playerName}" (net id ${playerId}) issued command "${rawCommand}"`);

  try {
    await handler(playerId, args, rawCommand);
  } catch (error: any) {
    logger.error(
      `Command "${rawCommand}" executed by player "${playerName}" `
      + `could not be executed due to error: ${error.message}`
    );
    logger.logClientMessage(
      playerId,
      LOG_LEVELS.ERROR,
      `Failed to execute command "${name}": ${error.message}`
    );
  }
}
