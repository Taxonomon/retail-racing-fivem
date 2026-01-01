### player states
- freemode
- hotlap
- race (pre-lobby)
- race (active)

### race/hotlap mode

if a player DNFs a race, they can do whatever, even hotlap in between, and still safely rejoin the race

track can be loaded and unloaded client-side whenever, but only 1 track can be loaded at a time

a race is basically a synchronized hotlap between multiple people for a specific amount of time (or laps)

### TODOs:

- speedometer
- basic vehicle spawn menu (with blacklist locked behind permission)
- y-menu/overview menu with players and their pings (using `INPUT_HUD_SPECIAL`)
- player settings
  - db table and repo
    - player id and jsonb of settings
  - load on join, emit to client
  - let client update settings via menu (with cooldown)
  - client emits settings to server to persist in db
  - e.g. speedometer unit/precision, weather/time/traffic settings
