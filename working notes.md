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

- expand time menu
  - pre-defined options: morning, noon, evening, night
  - add/remove hour to current time
- vehicle menu
  - spawn (with blacklist locked behind permission)
    - sorted by display name, starting letter, make (if poss), and class
  - repair
  - delete
  - recently spawned (last 10 vehicles, most recent always at the top)
- y-menu/overview menu with players and their pings (using `INPUT_HUD_SPECIAL`)
