import {IdentifiableConstant, LabeledConstant} from "../schemas";
import {
  Checkpoint,
  CheckpointDisplay,
  CheckpointDisplayColor,
  CheckpointDisplayType,
  CheckpointEffect
} from "./schemas";

export const CHECKPOINT = {
  ROUND_MULTIPLIER: 2.25
};

/**
 * @see https://github.com/taoletsgo/custom_races/blob/f96528d4665d83281ecfd8c93c857d19ffeefefb/main%20script/custom_races/server/races_room.lua
 */
export const CHECKPOINT_EFFECT: Record<string, CheckpointEffect> = {
  LEGACY_CONVERSION: {
    identifier: 'CHECKPOINT_LEGACY_CONVERSION',
    cpbsType: 1,
    id: 0
  },
  ROUND: {
    identifier: 'CHECKPOINT_ROUND',
    cpbsType: 1,
    id: 1,
    apply: (checkpoint: Checkpoint) => {
      checkpoint.size *= CHECKPOINT.ROUND_MULTIPLIER;
      return checkpoint;
    }
  },
  ROUND_SECONDARY: {
    identifier: 'CHECKPOINT_ROUND_SECONDARY',
    cpbsType: 1,
    id: 2,
    apply: (checkpoint: Checkpoint) => {
      if (undefined !== checkpoint.secondaryCheckpoint) {
        checkpoint.secondaryCheckpoint.size *= CHECKPOINT.ROUND_MULTIPLIER;
      }
      return checkpoint;
    }
  },
  DISABLE_CATCHUP: {
    identifier: 'CHECKPOINT_DISABLE_CATCHUP',
    cpbsType: 1,
    id: 3
  },
  CPBS1_UNUSED: {
    identifier: 'UNUSED',
    cpbsType: 1,
    id: 4
  },
  RESTRICTED_SPACE: {
    identifier: 'CHECKPOINT_RESTRICTED_SPACE',
    cpbsType: 1,
    id: 5
  },
  DISABLE_SLIPSTREAM: {
    identifier: 'CHECKPOINT_DISABLE_SLIPSTREAM',
    cpbsType: 1,
    id: 6
  },
  WATER: {
    identifier: 'CHECKPOINT_WATER',
    cpbsType: 1,
    id: 7
  },
  WATER_SECONDARY: {
    identifier: 'CHECKPOINT_WATER_SECONDARY',
    cpbsType: 1,
    id: 8
  },
  AIR: {
    identifier: 'CHECKPOINT_AIR',
    cpbsType: 1,
    id: 9
  },
  IGNORE_RESPAWNS: {
    identifier: 'CHECKPOINT_IGNORE_RESPAWNS',
    cpbsType: 1,
    id: 10
  },
  IGNORE_RESPAWNS_SECONDARY: {
    identifier: 'CHECKPOINT_IGNORE_RESPAWNS_SECONDARY',
    cpbsType: 1,
    id: 11
  },
  CENTRED_LOCATE: {
    identifier: 'CHECKPOINT_CENTRED_LOCATE',
    cpbsType: 1,
    id: 12
  },
  AIR_SECONDARY: {
    identifier: 'CHECKPOINT_AIR_SECONDARY',
    cpbsType: 1,
    id: 13
  },
  OVERRIDDEN: {
    identifier: 'CHECKPOINT_OVERRIDDEN',
    cpbsType: 1,
    id: 14
  },
  OVERRIDDEN_SECONDARY: {
    identifier: 'CHECKPOINT_OVERRIDDEN_SECONDARY',
    cpbsType: 1,
    id: 15
  },
  CUSTOM_RESPAWN_ROT: {
    identifier: 'CHECKPOINT_CUSTOM_RESPAWN_ROT',
    cpbsType: 1,
    id: 16
  },
  CUSTOM_RESPAWN_ROT_SECONDARY: {
    identifier: 'CHECKPOINT_CUSTOM_RESPAWN_ROT_SECONDARY',
    cpbsType: 1,
    id: 17
  },
  NON_BILLBOARD: {
    identifier: 'CHECKPOINT_NON_BILLBOARD',
    cpbsType: 1,
    id: 18
  },
  NON_BILLBOARD_SECONDARY: {
    identifier: 'CHECKPOINT_NON_BILLBOARD_SECONDARY',
    cpbsType: 1,
    id: 19
  },
  VEHICLE_SWAP_VEHOPTION_0: {
    identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_0',
    cpbsType: 1,
    id: 20
  },
  VEHICLE_SWAP_VEHOPTION_1: {
    identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_1',
    cpbsType: 1,
    id: 21
  },
  VEHICLE_SWAP_VEHOPTION_2: {
    identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_2',
    cpbsType: 1,
    id: 22
  },
  VEHICLE_SWAP_VEHOPTION_SECONDARY_0: {
    identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_SECONDARY_0',
    cpbsType: 1,
    id: 23
  },
  VEHICLE_SWAP_VEHOPTION_SECONDARY_1: {
    identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_SECONDARY_1',
    cpbsType: 1,
    id: 24
  },
  VEHICLE_SWAP_VEHOPTION_SECONDARY_2: {
    identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_SECONDARY_2',
    cpbsType: 1,
    id: 25
  },
  RESPAWN_OFFSET: {
    identifier: 'CHECKPOINT_RESPAWN_OFFSET',
    cpbsType: 1,
    id: 26
  },
  WARP: {
    identifier: 'CHECKPOINT_WARP',
    cpbsType: 1,
    id: 27
  },
  WARP_SECONDARY: {
    identifier: 'CHECKPOINT_WARP_SECONDARY',
    cpbsType: 1,
    id: 28
  },
  GIVE_HELP_TEXT_TO_SECONDARY_CHECKPOINT: {
    identifier: 'CHECKPOINT_GIVE_HELP_TEXT_TO_SECONDARY_CHECKPOINT',
    cpbsType: 1,
    id: 29
  },
  USE_VERTICAL_CAM: {
    identifier: 'CHECKPOINT_USE_VERTICAL_CAM',
    cpbsType: 1,
    id: 30
  },
  USE_VERTICAL_CAM_SECONDARY: {
    identifier: 'CHECKPOINT_USE_VERTICAL_CAM_SECONDARY',
    cpbsType: 1,
    id: 31
  },
  VALID_WARP_EXIT: {
    identifier: 'CHECKPOINT_VALID_WARP_EXIT',
    cpbsType: 2,
    id: 0
  },
  VALID_WARP_EXIT_SECONDARY: {
    identifier: 'CHECKPOINT_VALID_WARP_EXIT_SECONDARY',
    cpbsType: 2,
    id: 1
  },
  DONT_USE_AIR_SCALE: {
    identifier: 'CHECKPOINT_DONT_USE_AIR_SCALE',
    cpbsType: 2,
    id: 2
  },
  DONT_USE_AIR_SCALE_SECONDARY: {
    identifier: 'CHECKPOINT_DONT_USE_AIR_SCALE_SECONDARY',
    cpbsType: 2,
    id: 3
  },
  SWAP_DRIVER_AND_PASSENGER: {
    identifier: 'CHECKPOINT_SWAP_DRIVER_AND_PASSENGER',
    cpbsType: 2,
    id: 4
  },
  UNDERWATER: {
    identifier: 'CHECKPOINT_UNDERWATER',
    cpbsType: 2,
    id: 5
  },
  UNDERWATER_SECONDARY: {
    identifier: 'CHECKPOINT_UNDERWATER_SECONDARY',
    cpbsType: 2,
    id: 6
  },
  VTOL_RESPAWN: {
    identifier: 'CHECKPOINT_VTOL_RESPAWN',
    cpbsType: 2,
    id: 7
  },
  SWAP_DRIVER_AND_PASSENGER_SECONDARY: {
    identifier: 'CHECKPOINT_SWAP_DRIVER_AND_PASSENGER_SECONDARY',
    cpbsType: 2,
    id: 8
  },
  IGNORE_Z_COORD_CHECK: {
    identifier: 'CHECKPOINT_IGNORE_Z_COORD_CHECK',
    cpbsType: 2,
    id: 9
  },
  IGNORE_Z_COORD_CHECK_SECONDARY: {
    identifier: 'CHECKPOINT_IGNORE_Z_COORD_CHECK_SECONDARY',
    cpbsType: 2,
    id: 10
  },
  FORCE_CHECKPOINT_RED: {
    identifier: 'CHECKPOINT_FORCE_CHECKPOINT_RED',
    cpbsType: 2,
    id: 11
  },
  FORCE_CHECKPOINT_RED_SECONDARY: {
    identifier: 'CHECKPOINT_FORCE_CHECKPOINT_RED_SECONDARY',
    cpbsType: 2,
    id: 12
  },
  RESTRICT_Z_CHECK: {
    identifier: 'CHECKPOINT_RESTRICT_Z_CHECK',
    cpbsType: 2,
    id: 13
  },
  RESTRICT_Z_CHECK_SECONDARY: {
    identifier: 'CHECKPOINT_RESTRICT_Z_CHECK_SECONDARY',
    cpbsType: 2,
    id: 14
  },
  RESTRICTED_SPACE_SECONDARY: {
    identifier: 'CHECKPOINT_RESTRICTED_SPACE_SECONDARY',
    cpbsType: 2,
    id: 15
  },
  USE_PIT_STOP_MARKER: {
    identifier: 'CHECKPOINT_USE_PIT_STOP_MARKER',
    cpbsType: 2,
    id: 16
  },
  USE_PIT_STOP_MARKER_SECONDARY: {
    identifier: 'CHECKPOINT_USE_PIT_STOP_MARKER_SECONDARY',
    cpbsType: 2,
    id: 17
  },
  LOWER_ICON: {
    identifier: 'CHECKPOINT_LOWER_ICON',
    cpbsType: 2,
    id: 18
  },
  LOWER_ICON_SECONDARY: {
    identifier: 'CHECKPOINT_LOWER_ICON_SECONDARY',
    cpbsType: 2,
    id: 19
  },
  SUPER_TALL: {
    identifier: 'CHECKPOINT_SUPER_TALL',
    cpbsType: 2,
    id: 20
  },
  SUPER_TALL_SECONDARY: {
    identifier: 'CHECKPOINT_SUPER_TALL_SECONDARY',
    cpbsType: 2,
    id: 21
  },
  INCREMENT_WANTED: {
    identifier: 'CHECKPOINT_INCREMENT_WANTED',
    cpbsType: 2,
    id: 22
  },
  INCREMENT_WANTED_SECONDARY: {
    identifier: 'CHECKPOINT_INCREMENT_WANTED_SECONDARY',
    cpbsType: 2,
    id: 23
  },
  LOW_ALPHA_CP_BLIP: {
    identifier: 'CHECKPOINT_LOW_ALPHA_CP_BLIP',
    cpbsType: 2,
    id: 24
  },
  LOW_ALPHA_CP_BLIP_SECONDARY: {
    identifier: 'CHECKPOINT_LOW_ALPHA_CP_BLIP_SECONDARY',
    cpbsType: 2,
    id: 25
  },
  INCREMENT_WANTED_TO_MAX: {
    identifier: 'CHECKPOINT_INCREMENT_WANTED_TO_MAX',
    cpbsType: 2,
    id: 26
  },
  INCREMENT_WANTED_TO_MAX_SECONDARY: {
    identifier: 'CHECKPOINT_INCREMENT_WANTED_TO_MAX_SECONDARY',
    cpbsType: 2,
    id: 27
  }
};

export const CHECKPOINT_DISPLAY_COLOR: Record<string, CheckpointDisplayColor> = {
  RETAIL: {
    cylinder: { r: 215,  g: 212,  b: 194,  a: 100 }, // light, faded yellow
    icon: { r: 18,  g: 122,  b: 219,  a: 100 } // sky blue
  }
};

export const CHECKPOINT_DISPLAY_TYPE: Record<string, CheckpointDisplayType> = {
  NONE: {
    id: 49,
    identifier: 'NONE',
    reserved: false
  },
  SINGLE_AROW: {
    id: 0,
    identifier: 'SINGLE_ARROW',
    reserved: false
  },
  REPEAT: {
    id: 3,
    identifier: 'REPEAT',
    reserved: false
  },
  FINISH: {
    id: 4,
    identifier: 'FINISH',
    reserved: false
  }
};

export const CHECKPOINT_DISPLAY: Record<string, CheckpointDisplay> = {
  RETAIL: {
    type: CHECKPOINT_DISPLAY_TYPE.SINGLE_ARROW,
    color: CHECKPOINT_DISPLAY_COLOR.RETAIL
  }
};

export const FIXTURE_REMOVAL = {
  DEFAULT_RADIUS: 3
};

export const JOB_AREA: Record<string, LabeledConstant> = {
  AIRP: {
    id: 'AIRP',
    label: 'Los Santos International Airport'
  },
  ALAMO: {
    id: 'ALAMO',
    label: 'Alamo Sea'
  },
  ALTA: {
    id: 'ALTA',
    label: 'Alta'
  },
  ARMYB: {
    id: 'ARMYB',
    label: 'Fort Zancudo'
  },
  BANNING: {
    id: 'BANNING',
    label: 'Banning'
  },
  BAYTRE: {
    id: 'BAYTRE',
    label: 'Baytree Canyon'
  },
  BEACH: {
    id: 'BEACH',
    label: 'Vespucci Beach'
  },
  BHAMCA: {
    id: 'BHAMCA',
    label: 'Banham Canyon'
  },
  BRADP: {
    id: 'BRADP',
    label: 'Braddock Pass'
  },
  BRADT: {
    id: 'BRADT',
    label: 'Braddock Tunnel'
  },
  BURTON: {
    id: 'BURTON',
    label: 'Burton'
  },
  CALAFB: {
    id: 'CALAFB',
    label: 'Calafia Bridge'
  },
  CANNY: {
    id: 'CANNY',
    label: 'Raton Canyon'
  },
  CCREAK: {
    id: 'CCREAK',
    label: 'Cassidy Creek'
  },
  CHAMH: {
    id: 'CHAMH',
    label: 'Chamberlain Hills'
  },
  CHIL: {
    id: 'CHIL',
    label: 'Vinewood Hills'
  },
  CHU: {
    id: 'CHU',
    label: 'Chumash'
  },
  CMSW: {
    id: 'CMSW',
    label: 'Chiliad Mountain State Wilderness'
  },
  COSI: {
    id: 'COSI',
    label: 'Countryside'
  },
  CYPRE: {
    id: 'CYPRE',
    label: 'Cypress Flats'
  },
  DAVIS: {
    id: 'DAVIS',
    label: 'Davis'
  },
  DELBE: {
    id: 'DELBE',
    label: 'Del Perro Beach'
  },
  DELPE: {
    id: 'DELPE',
    label: 'Del Perro'
  },
  DELSOL: {
    id: 'DELSOL',
    label: 'La Puerta'
  },
  DESRT: {
    id: 'DESRT',
    label: 'Grand Senora Desert'
  },
  DOWNT: {
    id: 'DOWNT',
    label: 'Downtown'
  },
  DTVINE: {
    id: 'DTVINE',
    label: 'Downtown Vinewood'
  },
  EAST_V: {
    id: 'EAST_V',
    label: 'East Vinewood'
  },
  EBURO: {
    id: 'EBURO',
    label: 'El Burro Heights'
  },
  ECLIPS: {
    id: 'ECLIPS',
    label: 'Eclipse'
  },
  ELGORL: {
    id: 'ELGORL',
    label: 'El Gordo Lighthouse'
  },
  ELSANT: {
    id: 'ELSANT',
    label: 'East Los Santos'
  },
  ELYSIAN: {
    id: 'ELYSIAN',
    label: 'Elysian Island'
  },
  GALFISH: {
    id: 'GALFISH',
    label: 'Galilee'
  },
  GALLI: {
    id: 'GALLI',
    label: 'Galileo Park'
  },
  GOLF: {
    id: 'GOLF',
    label: 'GWC and Golfing Society'
  },
  GRAPES: {
    id: 'GRAPES',
    label: 'Grapeseed'
  },
  GREATC: {
    id: 'GREATC',
    label: 'Great Chaparral'
  },
  HARMO: {
    id: 'HARMO',
    label: 'Harmony'
  },
  HAWICK: {
    id: 'HAWICK',
    label: 'Hawick'
  },
  HEART: {
    id: 'HEART',
    label: 'Heart Attacks Beach'
  },
  HORS: {
    id: 'HORS',
    label: 'Vinewood Racetrack'
  },
  HUMLAB: {
    id: 'HUMLAB',
    label: 'Humane Labs and Research'
  },
  JAIL: {
    id: 'JAIL',
    label: 'Bolingbroke Penitentiary'
  },
  KOREAT: {
    id: 'KOREAT',
    label: 'Little Seoul'
  },
  LACT: {
    id: 'LACT',
    label: 'Land Act Reservoir'
  },
  LAGO: {
    id: 'LAGO',
    label: 'Lago Zancudo'
  },
  LDAM: {
    id: 'LDAM',
    label: 'Land Act Dam'
  },
  LMESA: {
    id: 'LMESA',
    label: 'La Mesa'
  },
  LOSPUER: {
    id: 'LOSPUER',
    label: 'La Puerta'
  },
  LOSSF: {
    id: 'LOSSF',
    label: 'Los Santos Freeway'
  },
  MIRR: {
    id: 'MIRR',
    label: 'Mirror Park'
  },
  MORN: {
    id: 'MORN',
    label: 'Morningwood'
  },
  MOVIE: {
    id: 'MOVIE',
    label: 'Richards Majestic'
  },
  MTCHIL: {
    id: 'MTCHIL',
    label: 'Mount Chiliad'
  },
  MTGORDO: {
    id: 'MTGORDO',
    label: 'Mount Gordo'
  },
  MTJOSE: {
    id: 'MTJOSE',
    label: 'Mount Josiah'
  },
  MURRI: {
    id: 'MURRI',
    label: 'Murrieta Heights'
  },
  NCHU: {
    id: 'NCHU',
    label: 'North Chumash'
  },
  OBSERV: {
    id: 'OBSERV',
    label: 'Galileo Observatory'
  },
  OCEANA: {
    id: 'OCEANA',
    label: 'Pacific Ocean'
  },
  PALCOV: {
    id: 'PALCOV',
    label: 'Paleto Cove'
  },
  PALETO: {
    id: 'PALETO',
    label: 'Paleto Bay'
  },
  PALFOR: {
    id: 'PALFOR',
    label: 'Paleto Forest'
  },
  PALHIGH: {
    id: 'PALHIGH',
    label: 'Palomino Highlands'
  },
  PALMPOW: {
    id: 'PALMPOW',
    label: 'Palmer-Taylor Power Station'
  },
  PBLUFF: {
    id: 'PBLUFF',
    label: 'Pacific Bluffs'
  },
  PBOX: {
    id: 'PBOX',
    label: 'Pillbox Hill'
  },
  PROCOB: {
    id: 'PROCOB',
    label: 'Procopio Beach'
  },
  PROL: {
    id: 'PROL',
    label: 'North Yankton'
  },
  RANCHO: {
    id: 'RANCHO',
    label: 'Rancho'
  },
  RGLEN: {
    id: 'RGLEN',
    label: 'Richman Glen'
  },
  RICHM: {
    id: 'RICHM',
    label: 'Richman'
  },
  ROCKF: {
    id: 'ROCKF',
    label: 'Rockford Hills'
  },
  RTRAK: {
    id: 'RTRAK',
    label: 'Redwood Lights Track'
  },
  SANAND: {
    id: 'SANAND',
    label: 'San Andreas'
  },
  SANCHIA: {
    id: 'SANCHIA',
    label: 'San Chianski Mountain Range'
  },
  SANDY: {
    id: 'SANDY',
    label: 'Sandy Shores'
  },
  SKID: {
    id: 'SKID',
    label: 'Mission Row'
  },
  SLAB: {
    id: 'SLAB',
    label: 'Stab City'
  },
  SLSANT: {
    id: 'SLSANT',
    label: 'South Los Santos'
  },
  STAD: {
    id: 'STAD',
    label: 'Maze Bank Arena'
  },
  STRAW: {
    id: 'STRAW',
    label: 'Strawberry'
  },
  TATAMO: {
    id: 'TATAMO',
    label: 'Tataviam Mountains'
  },
  TERMINA: {
    id: 'TERMINA',
    label: 'Terminal'
  },
  TEXTI: {
    id: 'TEXTI',
    label: 'Textile City'
  },
  TONGVAH: {
    id: 'TONGVAH',
    label: 'Tongva Hills'
  },
  TONGVAV: {
    id: 'TONGVAV',
    label: 'Tongva Valley'
  },
  UTOPIAG: {
    id: 'UTOPIAG',
    label: 'Utopia Gardens'
  },
  VCANA: {
    id: 'VCANA',
    label: 'Vespucci Canals'
  },
  VESP: {
    id: 'VESP',
    label: 'Vespucci'
  },
  VINE: {
    id: 'VINE',
    label: 'Vinewood'
  },
  WINDF: {
    id: 'WINDF',
    label: 'Ron Alternates Wind Farm'
  },
  WMIRROR: {
    id: 'WMIRROR',
    label: 'West Mirror Drive'
  },
  WVINE: {
    id: 'WVINE',
    label: 'West Vinewood'
  },
  ZANCUDO: {
    id: 'ZANCUDO',
    label: 'Zancudo River'
  },
  ZENORA: {
    id: 'ZENORA',
    label: 'Senora Freeway'
  }
};

export const JOB_TYPE: Record<string, IdentifiableConstant> = {
  LAST_TEAM_STANDING: {
    id: 0,
    identifier: 'LAST_TEAM_STANDING'
  },
  RACE: {
    id: 2,
    identifier: 'RACE'
  },
  PARACHUTING: {
    id: 8,
    identifier: 'PARACHUTING'
  }
};

export const PROP_COLOR: Record<string, IdentifiableConstant> = {
  PACIFIC: {
    id: 0,
    identifier: 'PACIFIC'
  },
  AZURE: {
    id: 1,
    identifier: 'AZURE'
  },
  NAUTICAL: {
    id: 2,
    identifier: 'NAUTICAL'
  },
  CONTINENTAL: {
    id: 3,
    identifier: 'CONTINENTAL'
  },
  BATTLESHIP: {
    id: 4,
    identifier: 'BATTLESHIP'
  },
  INTREPID: {
    id: 5,
    identifier: 'INTREPID'
  },
  UNIFORM: {
    id: 6,
    identifier: 'UNIFORM'
  },
  CLASSICO: {
    id: 7,
    identifier: 'CLASSICO'
  },
  MEDITERRANEAN: {
    id: 8,
    identifier: 'MEDITERRANEAN'
  },
  COMMAND: {
    id: 9,
    identifier: 'COMMAND'
  },
  MARINER: {
    id: 10,
    identifier: 'MARINER'
  },
  RUBY: {
    id: 11,
    identifier: 'RUBY'
  },
  VINTAGE: {
    id: 12,
    identifier: 'VINTAGE'
  },
  PRISTINE: {
    id: 13,
    identifier: 'PRISTINE'
  },
  MERCHANT: {
    id: 14,
    identifier: 'MERCHANT'
  },
  VOYAGER: {
    id: 15,
    identifier: 'VOYAGER'
  }
};

export const RACE_TYPE: Record<string, IdentifiableConstant> = {
  LAND: {
    id: 0,
    identifier: 'LAND'
  },
  POINT_TO_POINT: {
    id: 1,
    identifier: 'POINT_TO_POINT'
  },
  SEA: {
    id: 3,
    identifier: 'SEA'
  },
  AIR: {
    id: 5,
    identifier: 'AIR'
  },
  STUNT: {
    id: 6,
    identifier: 'STUNT'
  },
  PARACHUTE: {
    id: 8,
    identifier: 'PARACHUTE'
  },
  BIKE: {
    id: 13,
    identifier: 'BIKE'
  }
};
