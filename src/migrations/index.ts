import * as migration_20260309_181840 from './20260309_181840';

export const migrations = [
  {
    up: migration_20260309_181840.up,
    down: migration_20260309_181840.down,
    name: '20260309_181840'
  },
];
