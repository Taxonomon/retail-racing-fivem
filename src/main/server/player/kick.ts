import EVENT_NAMES from "../../common/event-names";

export default function registerPlayerSelfKickListener() {
  onNet(EVENT_NAMES.PLAYER.KICK.SELF, (reason: string) => {
    DropPlayer(globalThis.source.toString(), reason);
  });
}

