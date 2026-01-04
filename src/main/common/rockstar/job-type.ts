/**
 * R* job types are set in `mission.gen.type`.
 */
export type JobType = {
  id: number;
  name: string;
};

export const LAST_TEAM_STANDING: JobType = {
  id: 0,
  name: 'Last Team Standing'
};

export const RACE: JobType = {
  id: 2,
  name: 'Race'
};

export const PARACHUTING: JobType = {
  id: 8,
  name: 'Parachuting'
};

export const JOB_TYPES: JobType[] = [
  LAST_TEAM_STANDING,
  RACE,
  PARACHUTING
];

export function getJobTypeById(id: number) {
  return JOB_TYPES.find(jt => jt.id === id);
}
