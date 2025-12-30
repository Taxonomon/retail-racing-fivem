import authorizationService from "../authorization/service";
import logger from "../logging/logger";
import playerUtils from "../player/utils";
import EVENT_NAMES from "../../common/event-names";
import {LOG_LEVELS} from "../../common/logging/level";

export type AuthorizedCommandHandler =
  (playerId: number, args: string[], rawCommand: string) => void | Promise<void>;

export type RegisterAuthorizedCommandProps = {
  name: string;
  handler: AuthorizedCommandHandler;
  permissions: string[];
};

export default function registerAuthorizedCommand(props: RegisterAuthorizedCommandProps) {
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
  const playerName = playerUtils.getPlayerNameFromNetId(playerId);
  const { name, handler, permissions } = props;

  for (const permission of permissions) {
    const authorized = await authorizationService.hasPermission(playerId, permission);
    if (!authorized) {
      logger.warn(
        `player "${playerName}" tried to execute command "${name}" `
        + `with missing required permission "${permission}"`
      );
      logger.logClientMessage(
        playerId,
        LOG_LEVELS.WARN,
        `could not execute command "${name}": unauthorized`
      );
      return;
    }
  }

  logger.debug(`player "${playerName}" (net id ${playerId}) issued command "${rawCommand}"`);
  try {
    await handler(playerId, args, rawCommand);
  } catch (error: any) {
    logger.error(
      `command "${rawCommand}" executed by player "${playerName}" `
      + `could not be executed due to error: ${error.message}`
    );
    // TODO notify client abt error via GUI notifcation as well
    logger.logClientMessage(
      playerId,
      LOG_LEVELS.ERROR,
      `failed to execute command "${name}": ${error.message}`
    );
  }
}
