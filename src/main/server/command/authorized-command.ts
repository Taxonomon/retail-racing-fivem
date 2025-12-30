import authorizationService from "../authorization/service";
import logger from "../logging/logger";
import playerUtils from "../player/utils";

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
      await handleAuthorizedCommand(Number(source), args, rawCommand, props.handler, props.permissions);
    },
    false
  );
}

async function handleAuthorizedCommand(
  playerId: number,
  args: string[],
  rawCommand: string,
  handler: Function,
  permissions: string[]
) {
  const playerName = playerUtils.getPlayerNameFromNetId(playerId);

  for (const permission of permissions) {
    const authorized = await authorizationService.hasPermission(playerId, permission);
    if (!authorized) {
      logger.warn(
        `player "${playerName}" tried to execute command "${rawCommand}" `
        + `with missing required permission "${permission}"`
      );
      return;
    }
  }

  logger.debug(`player "${playerName}" (net id ${playerId}) issued command "${rawCommand}"`);
  await handler(playerId, args, rawCommand);
}
