import registerAuthorizedCommand from "../command/authorized-command";
import PERMISSIONS from "../authorization/permission/permissions";
import logger from "../logging/logger";

export default function registerTrackImportCommand() {
  registerAuthorizedCommand({
    name: 'importTrack',
    handler: importTrack,
    permissions: [ PERMISSIONS.TRACK.IMPORT ]
  });
}

async function importTrack(playerId: number, args: string[], rawCommand: string): Promise<void> {
}
