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

- basic vehicle spawn menu (with blacklist locked behind permission)
- y-menu/overview menu with players and their pings (using `INPUT_HUD_SPECIAL`)
- save and apply weather settings
