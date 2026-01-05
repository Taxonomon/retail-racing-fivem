a race is basically a synchronized hotlap between multiple people for a specific amount of time (or laps)

# Working Notes

scribbles and stuff while developing whatever this is going to become

## Game Modes

- three essential game modes the client can be in:
  - free mode
  - hot lap
  - racing
    - starts with pre-lobby
    - ends once the race gets closed or the client leaves the race (DNF, DSQ)
    - when DNF: client switches to free mode
- client always joins the server in free mode

## Races and Hot laps

- races and hot laps can happen simultaneously, but a client can always only ever be in a hot lap or a race, never in both
- the client can only ever have one track loaded at a time

Race components:

- all participants are doing a hot lap on the same track (with or without contact)
- they start simultaneously
- finish condition is either laps completed, or time driven
- weather, cars, traffic, ghosting, etc. is locked in once the host of the race opens a pre-lobby
- when gridding: players get frozen on grid
- every time a client passes a checkpoint, they send their info to the server
  - lap counter
  - checkpoint counter
  - timestamp when the cp was passed (relative to the race start)
- the server updates all clients with all other clients' cp info every X ms
- the client receives this cp info and builds the leaderboard based on it

## TODOs:

- re-order menu
  - move weather, traffic, time stuff into main menu
  - move 'keep vehicle clean' into vehicle menu
- settings menu
  - 'reload available tracks' item: reloads available rockstar jobs

### Foundation for hot lap mode

- package `client/game-mode/hot-lap`
  - 'Hot Lap' menu, which contains nothing more than all available tracks to hot lap
  - on client resource start: fetch all available tracks from server via callback, and construct the menu
  - when player selects a track from the hot lap menu:
    - switch the player's server-side state to 'Hot Lap'
    - add hot lap options to menu
      - reset
      - respawn
      - choose reset cp
      - weather
      - time (hour, fixed time)
      - traffic
      - indestructible car

### Lower Prio

- spawn vehicle menu
  - option to keep old vehicle when spawning a new one
  - option to wipe all spawned vehicles (requires client to keep track of them)
      - wipe them anyway if client either disconnects, changes game mode (free mode to hot lap/race), or if they trigger the menu item to explicitly wipe them
- y-menu/overview of players
  - access via control action `INPUT_HUD_SPECIAL`
  - properties: nickname, ping, game mode, car, track

### Bugs

- weather still isn't getting applied properly when applying player settings on join

### Chores

- refactor client to adhere more to exported functions (where possible)
- normalize log messages (capitalization, error in console, hint to error in toast)
