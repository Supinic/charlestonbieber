import { ConnectionOptions } from 'typeorm';
import { DATABASE as database } from './config.json';

import * as entities from './entities';

export default {
  type: 'sqlite',
  synchronize: true,
  logging: false,
  entities: Object.values(entities),
  database,
} as ConnectionOptions;

