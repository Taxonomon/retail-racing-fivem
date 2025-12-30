import EVENT_NAMES from "../../common/event-names";

onNet(EVENT_NAMES.PLAYER.KICK.SELF, (reason: string) => {
  DropPlayer(globalThis.source.toString(), reason);
});
