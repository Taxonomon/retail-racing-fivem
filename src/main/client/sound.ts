// list of ingame sounds:
// pastebin.com/A8Ny8AHZ
// https://git.io/JtLxM

function select(): void {
  play('HUD_FRONTEND_DEFAULT_SOUNDSET', 'SELECT');
}

function back(): void {
  play('HUD_FRONTEND_DEFAULT_SOUNDSET', 'BACK');
}

function navigate(): void {
  play('HUD_FRONTEND_DEFAULT_SOUNDSET', 'NAV_UP_DOWN');
}

function error(): void {
  play('HUD_FRONTEND_DEFAULT_SOUNDSET', 'ERROR');
}

function checkpointHit(): void {
  play('HUD_MINI_GAME_SOUNDSET', 'CHECKPOINT_NORMAL');
}

function play(set: string, name: string): void {
  PlaySoundFrontend(-1, name, set, false);
}

const playSound = {
  select,
  back,
  navigate,
  error,
  checkpointHit
};

export default playSound;
