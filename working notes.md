player states:
- freemode
- hotlap
- race (pre-lobby)
- race (active)

if a player DNFs a race, they can do whatever, even hotlap in between, and still safely rejoin the race

track can be loaded and unloaded client-side whenever, but only 1 track can be loaded at a time

a race is basically a synchronized hotlap between multiple people for a specific amount of time (or laps)

track db:

table "tracks":
- id: bigint
- jobId: string
- author: string

table "track_revisions":
- id: bigint
- track: tracks.id
- revision: timestamptz
- hash: string
- data: jsonb
