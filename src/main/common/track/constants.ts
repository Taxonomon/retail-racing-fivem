import { IdentifiableConstant, LabeledConstant } from "../schemas";
import {
	Checkpoint,
	CheckpointDisplay,
	CheckpointDisplayColor,
	CheckpointDisplayType,
	CheckpointEffect
} from "./schemas";

export const BLIP_COLOR = {
	YELLOW: {
		id: 5,
		identifier: 'YELLOW'
	} satisfies IdentifiableConstant,
	DARK_YELLOW: {
		id: 28,
		identifier: 'DARK_YELLOW'
	} satisfies IdentifiableConstant
};

export const BLIP_SPRITE = {
	RADAR_LEVEL: {
		id: 1,
		identifier: 'RADAR_LEVEL'
	} satisfies IdentifiableConstant
};

export const CHECKPOINT = {
	ROUND_MULTIPLIER: 2.25
};

/**
 * @see https://github.com/taoletsgo/custom_races/blob/f96528d4665d83281ecfd8c93c857d19ffeefefb/main%20script/custom_races/server/races_room.lua
 */
export const CHECKPOINT_EFFECT = {
	LEGACY_CONVERSION: {
		identifier: 'CHECKPOINT_LEGACY_CONVERSION',
		cpbsType: 1,
		id: 0
	} satisfies CheckpointEffect,
	ROUND: {
		identifier: 'CHECKPOINT_ROUND',
		cpbsType: 1,
		id: 1,
		apply: (checkpoint: Checkpoint) => {
			checkpoint.size *= CHECKPOINT.ROUND_MULTIPLIER;
			return checkpoint;
		}
	} satisfies CheckpointEffect,
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
	} satisfies CheckpointEffect,
	DISABLE_CATCHUP: {
		identifier: 'CHECKPOINT_DISABLE_CATCHUP',
		cpbsType: 1,
		id: 3
	} satisfies CheckpointEffect,
	CPBS1_UNUSED: {
		identifier: 'UNUSED',
		cpbsType: 1,
		id: 4
	} satisfies CheckpointEffect,
	RESTRICTED_SPACE: {
		identifier: 'CHECKPOINT_RESTRICTED_SPACE',
		cpbsType: 1,
		id: 5
	} satisfies CheckpointEffect,
	DISABLE_SLIPSTREAM: {
		identifier: 'CHECKPOINT_DISABLE_SLIPSTREAM',
		cpbsType: 1,
		id: 6
	} satisfies CheckpointEffect,
	WATER: {
		identifier: 'CHECKPOINT_WATER',
		cpbsType: 1,
		id: 7
	} satisfies CheckpointEffect,
	WATER_SECONDARY: {
		identifier: 'CHECKPOINT_WATER_SECONDARY',
		cpbsType: 1,
		id: 8
	} satisfies CheckpointEffect,
	AIR: {
		identifier: 'CHECKPOINT_AIR',
		cpbsType: 1,
		id: 9
	} satisfies CheckpointEffect,
	IGNORE_RESPAWNS: {
		identifier: 'CHECKPOINT_IGNORE_RESPAWNS',
		cpbsType: 1,
		id: 10
	} satisfies CheckpointEffect,
	IGNORE_RESPAWNS_SECONDARY: {
		identifier: 'CHECKPOINT_IGNORE_RESPAWNS_SECONDARY',
		cpbsType: 1,
		id: 11
	} satisfies CheckpointEffect,
	CENTRED_LOCATE: {
		identifier: 'CHECKPOINT_CENTRED_LOCATE',
		cpbsType: 1,
		id: 12
	} satisfies CheckpointEffect,
	AIR_SECONDARY: {
		identifier: 'CHECKPOINT_AIR_SECONDARY',
		cpbsType: 1,
		id: 13
	} satisfies CheckpointEffect,
	OVERRIDDEN: {
		identifier: 'CHECKPOINT_OVERRIDDEN',
		cpbsType: 1,
		id: 14
	} satisfies CheckpointEffect,
	OVERRIDDEN_SECONDARY: {
		identifier: 'CHECKPOINT_OVERRIDDEN_SECONDARY',
		cpbsType: 1,
		id: 15
	} satisfies CheckpointEffect,
	CUSTOM_RESPAWN_ROT: {
		identifier: 'CHECKPOINT_CUSTOM_RESPAWN_ROT',
		cpbsType: 1,
		id: 16
	} satisfies CheckpointEffect,
	CUSTOM_RESPAWN_ROT_SECONDARY: {
		identifier: 'CHECKPOINT_CUSTOM_RESPAWN_ROT_SECONDARY',
		cpbsType: 1,
		id: 17
	} satisfies CheckpointEffect,
	NON_BILLBOARD: {
		identifier: 'CHECKPOINT_NON_BILLBOARD',
		cpbsType: 1,
		id: 18
	} satisfies CheckpointEffect,
	NON_BILLBOARD_SECONDARY: {
		identifier: 'CHECKPOINT_NON_BILLBOARD_SECONDARY',
		cpbsType: 1,
		id: 19
	} satisfies CheckpointEffect,
	VEHICLE_SWAP_VEHOPTION_0: {
		identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_0',
		cpbsType: 1,
		id: 20
	} satisfies CheckpointEffect,
	VEHICLE_SWAP_VEHOPTION_1: {
		identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_1',
		cpbsType: 1,
		id: 21
	} satisfies CheckpointEffect,
	VEHICLE_SWAP_VEHOPTION_2: {
		identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_2',
		cpbsType: 1,
		id: 22
	} satisfies CheckpointEffect,
	VEHICLE_SWAP_VEHOPTION_SECONDARY_0: {
		identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_SECONDARY_0',
		cpbsType: 1,
		id: 23
	} satisfies CheckpointEffect,
	VEHICLE_SWAP_VEHOPTION_SECONDARY_1: {
		identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_SECONDARY_1',
		cpbsType: 1,
		id: 24
	} satisfies CheckpointEffect,
	VEHICLE_SWAP_VEHOPTION_SECONDARY_2: {
		identifier: 'CHECKPOINT_VEHICLE_SWAP_VEHOPTION_SECONDARY_2',
		cpbsType: 1,
		id: 25
	} satisfies CheckpointEffect,
	RESPAWN_OFFSET: {
		identifier: 'CHECKPOINT_RESPAWN_OFFSET',
		cpbsType: 1,
		id: 26
	} satisfies CheckpointEffect,
	WARP: {
		identifier: 'CHECKPOINT_WARP',
		cpbsType: 1,
		id: 27
	} satisfies CheckpointEffect,
	WARP_SECONDARY: {
		identifier: 'CHECKPOINT_WARP_SECONDARY',
		cpbsType: 1,
		id: 28
	} satisfies CheckpointEffect,
	GIVE_HELP_TEXT_TO_SECONDARY_CHECKPOINT: {
		identifier: 'CHECKPOINT_GIVE_HELP_TEXT_TO_SECONDARY_CHECKPOINT',
		cpbsType: 1,
		id: 29
	} satisfies CheckpointEffect,
	USE_VERTICAL_CAM: {
		identifier: 'CHECKPOINT_USE_VERTICAL_CAM',
		cpbsType: 1,
		id: 30
	} satisfies CheckpointEffect,
	USE_VERTICAL_CAM_SECONDARY: {
		identifier: 'CHECKPOINT_USE_VERTICAL_CAM_SECONDARY',
		cpbsType: 1,
		id: 31
	} satisfies CheckpointEffect,
	VALID_WARP_EXIT: {
		identifier: 'CHECKPOINT_VALID_WARP_EXIT',
		cpbsType: 2,
		id: 0
	} satisfies CheckpointEffect,
	VALID_WARP_EXIT_SECONDARY: {
		identifier: 'CHECKPOINT_VALID_WARP_EXIT_SECONDARY',
		cpbsType: 2,
		id: 1
	} satisfies CheckpointEffect,
	DONT_USE_AIR_SCALE: {
		identifier: 'CHECKPOINT_DONT_USE_AIR_SCALE',
		cpbsType: 2,
		id: 2
	} satisfies CheckpointEffect,
	DONT_USE_AIR_SCALE_SECONDARY: {
		identifier: 'CHECKPOINT_DONT_USE_AIR_SCALE_SECONDARY',
		cpbsType: 2,
		id: 3
	} satisfies CheckpointEffect,
	SWAP_DRIVER_AND_PASSENGER: {
		identifier: 'CHECKPOINT_SWAP_DRIVER_AND_PASSENGER',
		cpbsType: 2,
		id: 4
	} satisfies CheckpointEffect,
	UNDERWATER: {
		identifier: 'CHECKPOINT_UNDERWATER',
		cpbsType: 2,
		id: 5
	} satisfies CheckpointEffect,
	UNDERWATER_SECONDARY: {
		identifier: 'CHECKPOINT_UNDERWATER_SECONDARY',
		cpbsType: 2,
		id: 6
	} satisfies CheckpointEffect,
	VTOL_RESPAWN: {
		identifier: 'CHECKPOINT_VTOL_RESPAWN',
		cpbsType: 2,
		id: 7
	} satisfies CheckpointEffect,
	SWAP_DRIVER_AND_PASSENGER_SECONDARY: {
		identifier: 'CHECKPOINT_SWAP_DRIVER_AND_PASSENGER_SECONDARY',
		cpbsType: 2,
		id: 8
	} satisfies CheckpointEffect,
	IGNORE_Z_COORD_CHECK: {
		identifier: 'CHECKPOINT_IGNORE_Z_COORD_CHECK',
		cpbsType: 2,
		id: 9
	} satisfies CheckpointEffect,
	IGNORE_Z_COORD_CHECK_SECONDARY: {
		identifier: 'CHECKPOINT_IGNORE_Z_COORD_CHECK_SECONDARY',
		cpbsType: 2,
		id: 10
	} satisfies CheckpointEffect,
	FORCE_CHECKPOINT_RED: {
		identifier: 'CHECKPOINT_FORCE_CHECKPOINT_RED',
		cpbsType: 2,
		id: 11
	} satisfies CheckpointEffect,
	FORCE_CHECKPOINT_RED_SECONDARY: {
		identifier: 'CHECKPOINT_FORCE_CHECKPOINT_RED_SECONDARY',
		cpbsType: 2,
		id: 12
	} satisfies CheckpointEffect,
	RESTRICT_Z_CHECK: {
		identifier: 'CHECKPOINT_RESTRICT_Z_CHECK',
		cpbsType: 2,
		id: 13
	} satisfies CheckpointEffect,
	RESTRICT_Z_CHECK_SECONDARY: {
		identifier: 'CHECKPOINT_RESTRICT_Z_CHECK_SECONDARY',
		cpbsType: 2,
		id: 14
	} satisfies CheckpointEffect,
	RESTRICTED_SPACE_SECONDARY: {
		identifier: 'CHECKPOINT_RESTRICTED_SPACE_SECONDARY',
		cpbsType: 2,
		id: 15
	} satisfies CheckpointEffect,
	USE_PIT_STOP_MARKER: {
		identifier: 'CHECKPOINT_USE_PIT_STOP_MARKER',
		cpbsType: 2,
		id: 16
	} satisfies CheckpointEffect,
	USE_PIT_STOP_MARKER_SECONDARY: {
		identifier: 'CHECKPOINT_USE_PIT_STOP_MARKER_SECONDARY',
		cpbsType: 2,
		id: 17
	} satisfies CheckpointEffect,
	LOWER_ICON: {
		identifier: 'CHECKPOINT_LOWER_ICON',
		cpbsType: 2,
		id: 18
	} satisfies CheckpointEffect,
	LOWER_ICON_SECONDARY: {
		identifier: 'CHECKPOINT_LOWER_ICON_SECONDARY',
		cpbsType: 2,
		id: 19
	} satisfies CheckpointEffect,
	SUPER_TALL: {
		identifier: 'CHECKPOINT_SUPER_TALL',
		cpbsType: 2,
		id: 20
	} satisfies CheckpointEffect,
	SUPER_TALL_SECONDARY: {
		identifier: 'CHECKPOINT_SUPER_TALL_SECONDARY',
		cpbsType: 2,
		id: 21
	} satisfies CheckpointEffect,
	INCREMENT_WANTED: {
		identifier: 'CHECKPOINT_INCREMENT_WANTED',
		cpbsType: 2,
		id: 22
	} satisfies CheckpointEffect,
	INCREMENT_WANTED_SECONDARY: {
		identifier: 'CHECKPOINT_INCREMENT_WANTED_SECONDARY',
		cpbsType: 2,
		id: 23
	} satisfies CheckpointEffect,
	LOW_ALPHA_CP_BLIP: {
		identifier: 'CHECKPOINT_LOW_ALPHA_CP_BLIP',
		cpbsType: 2,
		id: 24
	} satisfies CheckpointEffect,
	LOW_ALPHA_CP_BLIP_SECONDARY: {
		identifier: 'CHECKPOINT_LOW_ALPHA_CP_BLIP_SECONDARY',
		cpbsType: 2,
		id: 25
	} satisfies CheckpointEffect,
	INCREMENT_WANTED_TO_MAX: {
		identifier: 'CHECKPOINT_INCREMENT_WANTED_TO_MAX',
		cpbsType: 2,
		id: 26
	} satisfies CheckpointEffect,
	INCREMENT_WANTED_TO_MAX_SECONDARY: {
		identifier: 'CHECKPOINT_INCREMENT_WANTED_TO_MAX_SECONDARY',
		cpbsType: 2,
		id: 27
	} satisfies CheckpointEffect
};

export const CHECKPOINT_DISPLAY_COLOR = {
	RETAIL: {
		cylinder: { r: 215, g: 212, b: 194, a: 100 }, // light, faded yellow
		icon: { r: 18, g: 122, b: 219, a: 100 } // sky blue
	} satisfies CheckpointDisplayColor
};

export const CHECKPOINT_DISPLAY_TYPE = {
	NONE: {
		id: 49,
		identifier: 'NONE',
		reserved: false
	} satisfies CheckpointDisplayType,
	SINGLE_ARROW: {
		id: 0,
		identifier: 'SINGLE_ARROW',
		reserved: false
	} satisfies CheckpointDisplayType,
	REPEAT: {
		id: 3,
		identifier: 'REPEAT',
		reserved: false
	} satisfies CheckpointDisplayType,
	FINISH: {
		id: 4,
		identifier: 'FINISH',
		reserved: false
	} satisfies CheckpointDisplayType
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

export const JOB_AREA = {
	AIRP: {
		id: 'AIRP',
		label: 'Los Santos International Airport'
	} satisfies LabeledConstant,
	ALAMO: {
		id: 'ALAMO',
		label: 'Alamo Sea'
	} satisfies LabeledConstant,
	ALTA: {
		id: 'ALTA',
		label: 'Alta'
	} satisfies LabeledConstant,
	ARMYB: {
		id: 'ARMYB',
		label: 'Fort Zancudo'
	} satisfies LabeledConstant,
	BANNING: {
		id: 'BANNING',
		label: 'Banning'
	} satisfies LabeledConstant,
	BAYTRE: {
		id: 'BAYTRE',
		label: 'Baytree Canyon'
	} satisfies LabeledConstant,
	BEACH: {
		id: 'BEACH',
		label: 'Vespucci Beach'
	} satisfies LabeledConstant,
	BHAMCA: {
		id: 'BHAMCA',
		label: 'Banham Canyon'
	} satisfies LabeledConstant,
	BRADP: {
		id: 'BRADP',
		label: 'Braddock Pass'
	} satisfies LabeledConstant,
	BRADT: {
		id: 'BRADT',
		label: 'Braddock Tunnel'
	} satisfies LabeledConstant,
	BURTON: {
		id: 'BURTON',
		label: 'Burton'
	} satisfies LabeledConstant,
	CALAFB: {
		id: 'CALAFB',
		label: 'Calafia Bridge'
	} satisfies LabeledConstant,
	CANNY: {
		id: 'CANNY',
		label: 'Raton Canyon'
	} satisfies LabeledConstant,
	CCREAK: {
		id: 'CCREAK',
		label: 'Cassidy Creek'
	} satisfies LabeledConstant,
	CHAMH: {
		id: 'CHAMH',
		label: 'Chamberlain Hills'
	} satisfies LabeledConstant,
	CHIL: {
		id: 'CHIL',
		label: 'Vinewood Hills'
	} satisfies LabeledConstant,
	CHU: {
		id: 'CHU',
		label: 'Chumash'
	} satisfies LabeledConstant,
	CMSW: {
		id: 'CMSW',
		label: 'Chiliad Mountain State Wilderness'
	} satisfies LabeledConstant,
	COSI: {
		id: 'COSI',
		label: 'Countryside'
	} satisfies LabeledConstant,
	CYPRE: {
		id: 'CYPRE',
		label: 'Cypress Flats'
	} satisfies LabeledConstant,
	DAVIS: {
		id: 'DAVIS',
		label: 'Davis'
	} satisfies LabeledConstant,
	DELBE: {
		id: 'DELBE',
		label: 'Del Perro Beach'
	} satisfies LabeledConstant,
	DELPE: {
		id: 'DELPE',
		label: 'Del Perro'
	} satisfies LabeledConstant,
	DELSOL: {
		id: 'DELSOL',
		label: 'La Puerta'
	} satisfies LabeledConstant,
	DESRT: {
		id: 'DESRT',
		label: 'Grand Senora Desert'
	} satisfies LabeledConstant,
	DOWNT: {
		id: 'DOWNT',
		label: 'Downtown'
	} satisfies LabeledConstant,
	DTVINE: {
		id: 'DTVINE',
		label: 'Downtown Vinewood'
	} satisfies LabeledConstant,
	EAST_V: {
		id: 'EAST_V',
		label: 'East Vinewood'
	} satisfies LabeledConstant,
	EBURO: {
		id: 'EBURO',
		label: 'El Burro Heights'
	} satisfies LabeledConstant,
	ECLIPS: {
		id: 'ECLIPS',
		label: 'Eclipse'
	} satisfies LabeledConstant,
	ELGORL: {
		id: 'ELGORL',
		label: 'El Gordo Lighthouse'
	} satisfies LabeledConstant,
	ELSANT: {
		id: 'ELSANT',
		label: 'East Los Santos'
	} satisfies LabeledConstant,
	ELYSIAN: {
		id: 'ELYSIAN',
		label: 'Elysian Island'
	} satisfies LabeledConstant,
	GALFISH: {
		id: 'GALFISH',
		label: 'Galilee'
	} satisfies LabeledConstant,
	GALLI: {
		id: 'GALLI',
		label: 'Galileo Park'
	} satisfies LabeledConstant,
	GOLF: {
		id: 'GOLF',
		label: 'GWC and Golfing Society'
	} satisfies LabeledConstant,
	GRAPES: {
		id: 'GRAPES',
		label: 'Grapeseed'
	} satisfies LabeledConstant,
	GREATC: {
		id: 'GREATC',
		label: 'Great Chaparral'
	} satisfies LabeledConstant,
	HARMO: {
		id: 'HARMO',
		label: 'Harmony'
	} satisfies LabeledConstant,
	HAWICK: {
		id: 'HAWICK',
		label: 'Hawick'
	} satisfies LabeledConstant,
	HEART: {
		id: 'HEART',
		label: 'Heart Attacks Beach'
	} satisfies LabeledConstant,
	HORS: {
		id: 'HORS',
		label: 'Vinewood Racetrack'
	} satisfies LabeledConstant,
	HUMLAB: {
		id: 'HUMLAB',
		label: 'Humane Labs and Research'
	} satisfies LabeledConstant,
	JAIL: {
		id: 'JAIL',
		label: 'Bolingbroke Penitentiary'
	} satisfies LabeledConstant,
	KOREAT: {
		id: 'KOREAT',
		label: 'Little Seoul'
	} satisfies LabeledConstant,
	LACT: {
		id: 'LACT',
		label: 'Land Act Reservoir'
	} satisfies LabeledConstant,
	LAGO: {
		id: 'LAGO',
		label: 'Lago Zancudo'
	} satisfies LabeledConstant,
	LDAM: {
		id: 'LDAM',
		label: 'Land Act Dam'
	} satisfies LabeledConstant,
	LMESA: {
		id: 'LMESA',
		label: 'La Mesa'
	} satisfies LabeledConstant,
	LOSPUER: {
		id: 'LOSPUER',
		label: 'La Puerta'
	} satisfies LabeledConstant,
	LOSSF: {
		id: 'LOSSF',
		label: 'Los Santos Freeway'
	} satisfies LabeledConstant,
	MIRR: {
		id: 'MIRR',
		label: 'Mirror Park'
	} satisfies LabeledConstant,
	MORN: {
		id: 'MORN',
		label: 'Morningwood'
	} satisfies LabeledConstant,
	MOVIE: {
		id: 'MOVIE',
		label: 'Richards Majestic'
	} satisfies LabeledConstant,
	MTCHIL: {
		id: 'MTCHIL',
		label: 'Mount Chiliad'
	} satisfies LabeledConstant,
	MTGORDO: {
		id: 'MTGORDO',
		label: 'Mount Gordo'
	} satisfies LabeledConstant,
	MTJOSE: {
		id: 'MTJOSE',
		label: 'Mount Josiah'
	} satisfies LabeledConstant,
	MURRI: {
		id: 'MURRI',
		label: 'Murrieta Heights'
	} satisfies LabeledConstant,
	NCHU: {
		id: 'NCHU',
		label: 'North Chumash'
	} satisfies LabeledConstant,
	OBSERV: {
		id: 'OBSERV',
		label: 'Galileo Observatory'
	} satisfies LabeledConstant,
	OCEANA: {
		id: 'OCEANA',
		label: 'Pacific Ocean'
	} satisfies LabeledConstant,
	PALCOV: {
		id: 'PALCOV',
		label: 'Paleto Cove'
	} satisfies LabeledConstant,
	PALETO: {
		id: 'PALETO',
		label: 'Paleto Bay'
	} satisfies LabeledConstant,
	PALFOR: {
		id: 'PALFOR',
		label: 'Paleto Forest'
	} satisfies LabeledConstant,
	PALHIGH: {
		id: 'PALHIGH',
		label: 'Palomino Highlands'
	} satisfies LabeledConstant,
	PALMPOW: {
		id: 'PALMPOW',
		label: 'Palmer-Taylor Power Station'
	} satisfies LabeledConstant,
	PBLUFF: {
		id: 'PBLUFF',
		label: 'Pacific Bluffs'
	} satisfies LabeledConstant,
	PBOX: {
		id: 'PBOX',
		label: 'Pillbox Hill'
	} satisfies LabeledConstant,
	PROCOB: {
		id: 'PROCOB',
		label: 'Procopio Beach'
	} satisfies LabeledConstant,
	PROL: {
		id: 'PROL',
		label: 'North Yankton'
	} satisfies LabeledConstant,
	RANCHO: {
		id: 'RANCHO',
		label: 'Rancho'
	} satisfies LabeledConstant,
	RGLEN: {
		id: 'RGLEN',
		label: 'Richman Glen'
	} satisfies LabeledConstant,
	RICHM: {
		id: 'RICHM',
		label: 'Richman'
	} satisfies LabeledConstant,
	ROCKF: {
		id: 'ROCKF',
		label: 'Rockford Hills'
	} satisfies LabeledConstant,
	RTRAK: {
		id: 'RTRAK',
		label: 'Redwood Lights Track'
	} satisfies LabeledConstant,
	SANAND: {
		id: 'SANAND',
		label: 'San Andreas'
	} satisfies LabeledConstant,
	SANCHIA: {
		id: 'SANCHIA',
		label: 'San Chianski Mountain Range'
	} satisfies LabeledConstant,
	SANDY: {
		id: 'SANDY',
		label: 'Sandy Shores'
	} satisfies LabeledConstant,
	SKID: {
		id: 'SKID',
		label: 'Mission Row'
	} satisfies LabeledConstant,
	SLAB: {
		id: 'SLAB',
		label: 'Stab City'
	} satisfies LabeledConstant,
	SLSANT: {
		id: 'SLSANT',
		label: 'South Los Santos'
	} satisfies LabeledConstant,
	STAD: {
		id: 'STAD',
		label: 'Maze Bank Arena'
	} satisfies LabeledConstant,
	STRAW: {
		id: 'STRAW',
		label: 'Strawberry'
	} satisfies LabeledConstant,
	TATAMO: {
		id: 'TATAMO',
		label: 'Tataviam Mountains'
	} satisfies LabeledConstant,
	TERMINA: {
		id: 'TERMINA',
		label: 'Terminal'
	} satisfies LabeledConstant,
	TEXTI: {
		id: 'TEXTI',
		label: 'Textile City'
	} satisfies LabeledConstant,
	TONGVAH: {
		id: 'TONGVAH',
		label: 'Tongva Hills'
	} satisfies LabeledConstant,
	TONGVAV: {
		id: 'TONGVAV',
		label: 'Tongva Valley'
	} satisfies LabeledConstant,
	UTOPIAG: {
		id: 'UTOPIAG',
		label: 'Utopia Gardens'
	} satisfies LabeledConstant,
	VCANA: {
		id: 'VCANA',
		label: 'Vespucci Canals'
	} satisfies LabeledConstant,
	VESP: {
		id: 'VESP',
		label: 'Vespucci'
	} satisfies LabeledConstant,
	VINE: {
		id: 'VINE',
		label: 'Vinewood'
	} satisfies LabeledConstant,
	WINDF: {
		id: 'WINDF',
		label: 'Ron Alternates Wind Farm'
	} satisfies LabeledConstant,
	WMIRROR: {
		id: 'WMIRROR',
		label: 'West Mirror Drive'
	} satisfies LabeledConstant,
	WVINE: {
		id: 'WVINE',
		label: 'West Vinewood'
	} satisfies LabeledConstant,
	ZANCUDO: {
		id: 'ZANCUDO',
		label: 'Zancudo River'
	} satisfies LabeledConstant,
	ZENORA: {
		id: 'ZENORA',
		label: 'Senora Freeway'
	} satisfies LabeledConstant
};

export const JOB_TYPE = {
	LAST_TEAM_STANDING: {
		id: 0,
		identifier: 'LAST_TEAM_STANDING'
	} satisfies IdentifiableConstant,
	RACE: {
		id: 2,
		identifier: 'RACE'
	} satisfies IdentifiableConstant,
	PARACHUTING: {
		id: 8,
		identifier: 'PARACHUTING'
	} satisfies IdentifiableConstant
};

export const RACE_TYPE = {
	LAND: {
		id: 0,
		identifier: 'LAND'
	} satisfies IdentifiableConstant,
	POINT_TO_POINT: {
		id: 1,
		identifier: 'POINT_TO_POINT'
	} satisfies IdentifiableConstant,
	SEA: {
		id: 3,
		identifier: 'SEA'
	} satisfies IdentifiableConstant,
	AIR: {
		id: 5,
		identifier: 'AIR'
	} satisfies IdentifiableConstant,
	STUNT: {
		id: 6,
		identifier: 'STUNT'
	} satisfies IdentifiableConstant,
	PARACHUTE: {
		id: 8,
		identifier: 'PARACHUTE'
	} satisfies IdentifiableConstant,
	BIKE: {
		id: 13,
		identifier: 'BIKE'
	} satisfies IdentifiableConstant
};
