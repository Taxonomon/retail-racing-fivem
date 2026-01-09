import {registerAuthorizedCommand} from "../command/service";
import {PERMISSIONS} from "../player/authorization/service";
import {importTrack} from "./service/import";

export function register() {
  registerAuthorizedCommand({
    name: 'importtrack',
    handler: handleImportTrackCommand,
    permissions: [ PERMISSIONS.TRACK.IMPORT ]
  });
}

async function handleImportTrackCommand(netId: number, args: string[]) {
  if (0 === args.length) {
    throw new Error('missing R* job id');
  }
  await importTrack(netId, args[0]);
}
