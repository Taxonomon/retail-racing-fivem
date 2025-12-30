import wait from "../../../common/wait";
import {Player} from "../schema";
import playersRepo from "../repo";
import pastNicknamesRepo from "../past-nicknames/repo";
import {PastNickname} from "../past-nicknames/schema";
import playerState from "../state";
import logger from "../../logging/logger";
import playerIdentifiers from "../identifiers";

/**
 * <a href="https://docs.fivem.net/docs/scripting-reference/events/list/playerConnecting/">
 *   onPlayerConnecting - Deferrals - FiveM Docs
 * </a>
 */
type ConnectionDeferrals = {
  defer: () => void,
  handover: any, // no idea tbh
  presentCard: (card: object | string, callback?: (data: object, rawData: string) => void) => void,
  update: (message: string) => void,
  done: (failureReason?: string) => void
};

const deferralUtils = {
  defer: async (deferrals: ConnectionDeferrals) => {
    deferrals.defer();
    await wait.oneFrame();
  },
  updateMessage: async (deferrals: ConnectionDeferrals, msg: string) => {
    deferrals.update(msg);
    await wait.oneFrame();
  },
  endAsSuccess: async (deferrals: ConnectionDeferrals) => {
    deferrals.done();
    await wait.oneFrame();
  },
  endAsFailure: async (deferrals: ConnectionDeferrals, msg: string) => {
    deferrals.done(msg)
    await wait.oneFrame();
  }
};

on('playerConnecting', async (
  playerName: string,
  setKickReason: (reason: string) => void,
  deferrals: ConnectionDeferrals
) => {
  // this is a temporary net id, assigned during the connection process.
  // will be switched with a final net id on playerJoining.
  const netId = globalThis.source;

  try {
    await deferralUtils.defer(deferrals);

    await deferralUtils.updateMessage(deferrals, 'Checking if server is full...');
    const numberOfSlots = GetConvarInt('sv_maxclients', 48);

    if (playerState.connected >= numberOfSlots) {
      logger.info(`Rejecting connecting player "${playerName}": server is full`);
      await deferralUtils.endAsFailure(deferrals, 'Server is full');
      return;
    }

    await deferralUtils.updateMessage(deferrals, 'Fetching player information...');

    const license2 = playerIdentifiers.getLicense2(netId);

    if (undefined === license2) {
      logger.info(`Rejecting connecting player "${playerName}": missing license2 identifier`);
      await deferralUtils.endAsFailure(deferrals, 'Missing license2 identifier');
      return;
    }

    let player: Player | undefined = await playersRepo.findByLicense2(license2);

    if (undefined === player) {
      await handleNewPlayer(playerName, license2, deferrals);
    } else {
      await handleReturningPlayer(player, playerName, deferrals);
    }
  } catch (error: any) {
    const errorMsg = 0 === error.message?.toString().trim().length ? error.stack : error.message;
    logger.error(`Failed to handle connecting player "${playerName}": ${errorMsg}`);
    await deferralUtils.endAsFailure(deferrals, 'Failed to handle player connection (internal server error)');
  }
});

async function handleNewPlayer(
  playerName: string,
  license2: string,
  deferrals: ConnectionDeferrals
): Promise<void> {
  const now = new Date();

  const newPlayer: Player | undefined = await playersRepo.insert({
    license2,
    first_joined: now,
    last_seen: now,
    nickname: playerName
  });

  if (undefined === newPlayer) {
    await deferralUtils.endAsFailure(deferrals, 'Failed to update player information (database error)');
    return;
  }

  logger.info(`"${playerName}" joined for the first time`);
  await acceptConnection(deferrals);
}

async function handleReturningPlayer(
  player: Player,
  playerName: string,
  deferrals: ConnectionDeferrals
): Promise<void> {
  const now = new Date();
  const previousNickname = player.nickname;

  const updatedPlayer: Player | undefined = await playersRepo.updateById(player.id, {
    nickname: playerName,
    last_seen: now
  });

  if (undefined === updatedPlayer) {
    await deferralUtils.endAsFailure(deferrals, 'Failed to update player information (database error)');
    return;
  }

  if (playerName !== previousNickname) {
    const newPastNickname: PastNickname | undefined = await pastNicknamesRepo.insert({
      player: player.id,
      nickname: previousNickname,
      active_until: now
    });

    if (undefined === newPastNickname) {
      await deferralUtils.endAsFailure(deferrals, 'Failed to update player nickname history (database error)');
      return;
    }
  }

  logger.info(
    `"${playerName}" joined `
    + `(last seen as "${previousNickname}" on ${player.last_seen.toISOString()})`
  );
  await acceptConnection(deferrals);
}

async function acceptConnection(deferrals: ConnectionDeferrals) {
  playerState.connected += 1;
  await deferralUtils.endAsSuccess(deferrals);
}
