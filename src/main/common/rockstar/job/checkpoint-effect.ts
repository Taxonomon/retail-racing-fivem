export type CheckpointEffect = {
  identifier: string;
  nativeCpbsType: 1 | 2;
  index: number;
};

export const LEGACY_CONVERSION: CheckpointEffect = {
  identifier: 'CHECKPOINT_LEGACY_CONVERSION',
  nativeCpbsType: 1,
  index: 0
};

export const ROUND: CheckpointEffect = {
  identifier: 'CHECKPOINT_ROUND',
  nativeCpbsType: 1,
  index: 1
};

export const ROUND_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_ROUND_SECONDARY',
  nativeCpbsType: 1,
  index: 2
};

export const DISABLE_CATCHUP: CheckpointEffect = {
  identifier: 'CHECKPOINT_DISABLE_CATCHUP',
  nativeCpbsType: 1,
  index: 3
};

export const CPBS1_UNUSED: CheckpointEffect = {
  identifier: 'UNUSED',
  nativeCpbsType: 1,
  index: 4
};

export const RESTRICTED_SPACE: CheckpointEffect = {
  identifier: 'CHECKPOINT_RESTRICTED_SPACE',
  nativeCpbsType: 1,
  index: 5
};

export const DISABLE_SLIPSTREAM: CheckpointEffect = {
  identifier: 'CHECKPOINT_DISABLE_SLIPSTREAM',
  nativeCpbsType: 1,
  index: 6
};

export const WATER: CheckpointEffect = {
  identifier: 'CHECKPOINT_WATER',
  nativeCpbsType: 1,
  index: 7
};

export const WATER_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_WATER_SECONDARY',
  nativeCpbsType: 1,
  index: 8
};

export const AIR: CheckpointEffect = {
  identifier: 'CHECKPOINT_AIR',
  nativeCpbsType: 1,
  index: 9
};

export const IGNORE_RESPAWNS: CheckpointEffect = {
  identifier: 'CHECKPOINT_IGNORE_RESPAWNS',
  nativeCpbsType: 1,
  index: 10
};

export const IGNORE_RESPAWNS_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_IGNORE_RESPAWNS_SECONDARY',
  nativeCpbsType: 1,
  index: 11
};

export const CENTRED_LOCATE: CheckpointEffect = {
  identifier: 'CHECKPOINT_CENTRED_LOCATE',
  nativeCpbsType: 1,
  index: 12
};

export const AIR_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_AIR_SECONDARY',
  nativeCpbsType: 1,
  index: 13
};

export const OVERRIDDEN: CheckpointEffect = {
  identifier: 'CHECKPOINT_OVERRIDDEN',
  nativeCpbsType: 1,
  index: 14
};

export const OVERRIDDEN_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_OVERRIDDEN_SECONDARY',
  nativeCpbsType: 1,
  index: 15
};

export const CUSTOM_RESPAWN_ROT: CheckpointEffect = {
  identifier: 'CHECKPOINT_CUSTOM_RESPAWN_ROT',
  nativeCpbsType: 1,
  index: 16
};

export const CUSTOM_RESPAWN_ROT_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_CUSTOM_RESPAWN_ROT_SECONDARY',
  nativeCpbsType: 1,
  index: 17
};

export const NON_BILLBOARD: CheckpointEffect = {
  identifier: 'CHECKPOINT_NON_BILLBOARD',
  nativeCpbsType: 1,
  index: 18
};

export const NON_BILLBOARD_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_NON_BILLBOARD_SECONDARY',
  nativeCpbsType: 1,
  index: 19
};

export const VEHICLE_SWAP_VEHOPTION_0: CheckpointEffect = {
  identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_0',
  nativeCpbsType: 1,
  index: 20
};

export const VEHICLE_SWAP_VEHOPTION_1: CheckpointEffect = {
  identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_1',
  nativeCpbsType: 1,
  index: 21
};

export const VEHICLE_SWAP_VEHOPTION_2: CheckpointEffect = {
  identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_2',
  nativeCpbsType: 1,
  index: 22
};

export const VEHICLE_SWAP_VEHOPTION_SECONDARY_0: CheckpointEffect = {
  identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_SECONDARY_0',
  nativeCpbsType: 1,
  index: 23
};

export const VEHICLE_SWAP_VEHOPTION_SECONDARY_1: CheckpointEffect = {
  identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_SECONDARY_1',
  nativeCpbsType: 1,
  index: 24
};

export const VEHICLE_SWAP_VEHOPTION_SECONDARY_2: CheckpointEffect = {
  identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_SECONDARY_2',
  nativeCpbsType: 1,
  index: 25
};

export const RESPAWN_OFFSET: CheckpointEffect = {
  identifier: 'CHECKPOINT_RESPAWN_OFFSET',
  nativeCpbsType: 1,
  index: 26
};

export const WARP: CheckpointEffect = {
  identifier: 'CHECKPOINT_WARP',
  nativeCpbsType: 1,
  index: 27
};

export const WARP_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_WARP_SECONDARY',
  nativeCpbsType: 1,
  index: 28
};

export const GIVE_HELP_TEXT_TO_SECONDARY_CHECKPOINT: CheckpointEffect = {
  identifier: 'CHECKPOINT_GIVE_HELP_TEXT_TO_SECONDARY_CHECKPOINT',
  nativeCpbsType: 1,
  index: 29
};

export const USE_VERTICAL_CAM: CheckpointEffect = {
  identifier: 'CHECKPOINT_USE_VERTICAL_CAM',
  nativeCpbsType: 1,
  index: 30
};

export const USE_VERTICAL_CAM_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_USE_VERTICAL_CAM_SECONDARY',
  nativeCpbsType: 1,
  index: 31
};

export const VALID_WARP_EXIT: CheckpointEffect = {
  identifier: 'CHECKPOINT_VALID_WARP_EXIT',
  nativeCpbsType: 2,
  index: 0
};

export const VALID_WARP_EXIT_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_VALID_WARP_EXIT_SECONDARY',
  nativeCpbsType: 2,
  index: 1
};

export const DONT_USE_AIR_SCALE: CheckpointEffect = {
  identifier: 'CHECKPOINT_DONT_USE_AIR_SCALE',
  nativeCpbsType: 2,
  index: 2
};

export const DONT_USE_AIR_SCALE_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_DONT_USE_AIR_SCALE_SECONDARY',
  nativeCpbsType: 2,
  index: 3
};

export const SWAP_DRIVER_AND_PASSENGER: CheckpointEffect = {
  identifier: 'CHECKPOINT_SWAP_DRIVER_AND_PASSENGER',
  nativeCpbsType: 2,
  index: 4
};

export const UNDERWATER: CheckpointEffect = {
  identifier: 'CHECKPOINT_UNDERWATER',
  nativeCpbsType: 2,
  index: 5
};

export const UNDERWATER_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_UNDERWATER_SECONDARY',
  nativeCpbsType: 2,
  index: 6
};

export const VTOL_RESPAWN: CheckpointEffect = {
  identifier: 'CHECKPOINT_VTOL_RESPAWN',
  nativeCpbsType: 2,
  index: 7
};

export const SWAP_DRIVER_AND_PASSENGER_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_SWAP_DRIVER_AND_PASSENGER_SECONDARY',
  nativeCpbsType: 2,
  index: 8
};

export const IGNORE_Z_COORD_CHECK: CheckpointEffect = {
  identifier: 'CHECKPOINT_IGNORE_Z_COORD_CHECK',
  nativeCpbsType: 2,
  index: 9
};

export const IGNORE_Z_COORD_CHECK_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_IGNORE_Z_COORD_CHECK_SECONDARY',
  nativeCpbsType: 2,
  index: 10
};

export const FORCE_CHECKPOINT_RED: CheckpointEffect = {
  identifier: 'CHECKPOINT_FORCE_CHECKPOINT_RED',
  nativeCpbsType: 2,
  index: 11
};

export const FORCE_CHECKPOINT_RED_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_FORCE_CHECKPOINT_RED_SECONDARY',
  nativeCpbsType: 2,
  index: 12
};

export const RESTRICT_Z_CHECK: CheckpointEffect = {
  identifier: 'CHECKPOINT_RESTRICT_Z_CHECK',
  nativeCpbsType: 2,
  index: 13
};

export const RESTRICT_Z_CHECK_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_RESTRICT_Z_CHECK_SECONDARY',
  nativeCpbsType: 2,
  index: 14
};

export const RESTRICTED_SPACE_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_RESTRICTED_SPACE_SECONDARY',
  nativeCpbsType: 2,
  index: 15
};

export const USE_PIT_STOP_MARKER: CheckpointEffect = {
  identifier: 'CHECKPOINT_USE_PIT_STOP_MARKER',
  nativeCpbsType: 2,
  index: 16
};

export const USE_PIT_STOP_MARKER_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_USE_PIT_STOP_MARKER_SECONDARY',
  nativeCpbsType: 2,
  index: 17
};

export const LOWER_ICON: CheckpointEffect = {
  identifier: 'CHECKPOINT_LOWER_ICON',
  nativeCpbsType: 2,
  index: 18
};

export const LOWER_ICON_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_LOWER_ICON_SECONDARY',
  nativeCpbsType: 2,
  index: 19
};

export const SUPER_TALL: CheckpointEffect = {
  identifier: 'CHECKPOINT_SUPER_TALL',
  nativeCpbsType: 2,
  index: 20
};

export const SUPER_TALL_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_SUPER_TALL_SECONDARY',
  nativeCpbsType: 2,
  index: 21
};

export const INCREMENT_WANTED: CheckpointEffect = {
  identifier: 'CHECKPOINT_INCREMENT_WANTED',
  nativeCpbsType: 2,
  index: 22
};

export const INCREMENT_WANTED_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_INCREMENT_WANTED_SECONDARY',
  nativeCpbsType: 2,
  index: 23
};

export const LOW_ALPHA_CP_BLIP: CheckpointEffect = {
  identifier: 'CHECKPOINT_LOW_ALPHA_CP_BLIP',
  nativeCpbsType: 2,
  index: 24
};

export const LOW_ALPHA_CP_BLIP_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_LOW_ALPHA_CP_BLIP_SECONDARY',
  nativeCpbsType: 2,
  index: 25
};

export const INCREMENT_WANTED_TO_MAX: CheckpointEffect = {
  identifier: 'CHECKPOINT_INCREMENT_WANTED_TO_MAX',
  nativeCpbsType: 2,
  index: 26
};

export const INCREMENT_WANTED_TO_MAX_SECONDARY: CheckpointEffect = {
  identifier: 'CHECKPOINT_INCREMENT_WANTED_TO_MAX_SECONDARY',
  nativeCpbsType: 2,
  index: 27
};

export const CHECKPOINT_EFFECTS: Set<CheckpointEffect> = new Set([
  AIR,
  AIR_SECONDARY,
  CENTRED_LOCATE,
  CPBS1_UNUSED,
  CUSTOM_RESPAWN_ROT,
  CUSTOM_RESPAWN_ROT_SECONDARY,
  DISABLE_CATCHUP,
  DISABLE_SLIPSTREAM,
  DONT_USE_AIR_SCALE,
  DONT_USE_AIR_SCALE_SECONDARY,
  FORCE_CHECKPOINT_RED,
  FORCE_CHECKPOINT_RED_SECONDARY,
  GIVE_HELP_TEXT_TO_SECONDARY_CHECKPOINT,
  IGNORE_RESPAWNS,
  IGNORE_RESPAWNS_SECONDARY,
  IGNORE_Z_COORD_CHECK,
  IGNORE_Z_COORD_CHECK_SECONDARY,
  INCREMENT_WANTED,
  INCREMENT_WANTED_SECONDARY,
  INCREMENT_WANTED_TO_MAX,
  INCREMENT_WANTED_TO_MAX_SECONDARY,
  LEGACY_CONVERSION,
  LOW_ALPHA_CP_BLIP,
  LOW_ALPHA_CP_BLIP_SECONDARY,
  LOWER_ICON,
  LOWER_ICON_SECONDARY,
  NON_BILLBOARD,
  NON_BILLBOARD_SECONDARY,
  OVERRIDDEN,
  OVERRIDDEN_SECONDARY,
  RESPAWN_OFFSET,
  RESTRICTED_SPACE,
  RESTRICTED_SPACE_SECONDARY,
  RESTRICT_Z_CHECK,
  RESTRICT_Z_CHECK_SECONDARY,
  ROUND,
  ROUND_SECONDARY,
  SUPER_TALL,
  SUPER_TALL_SECONDARY,
  SWAP_DRIVER_AND_PASSENGER,
  SWAP_DRIVER_AND_PASSENGER_SECONDARY,
  UNDERWATER,
  UNDERWATER_SECONDARY,
  USE_PIT_STOP_MARKER,
  USE_PIT_STOP_MARKER_SECONDARY,
  USE_VERTICAL_CAM,
  USE_VERTICAL_CAM_SECONDARY,
  VALID_WARP_EXIT,
  VALID_WARP_EXIT_SECONDARY,
  VEHICLE_SWAP_VEHOPTION_0,
  VEHICLE_SWAP_VEHOPTION_1,
  VEHICLE_SWAP_VEHOPTION_2,
  VEHICLE_SWAP_VEHOPTION_SECONDARY_0,
  VEHICLE_SWAP_VEHOPTION_SECONDARY_1,
  VEHICLE_SWAP_VEHOPTION_SECONDARY_2,
  VTOL_RESPAWN,
  WARP,
  WARP_SECONDARY,
  WATER,
  WATER_SECONDARY
]);
