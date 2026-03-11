import * as migration_20260311_182213 from './20260311_182213';
import * as migration_20260311_194622 from './20260311_194622';

export const migrations = [
  {
    up: migration_20260311_182213.up,
    down: migration_20260311_182213.down,
    name: '20260311_182213',
  },
  {
    up: migration_20260311_194622.up,
    down: migration_20260311_194622.down,
    name: '20260311_194622'
  },
];
