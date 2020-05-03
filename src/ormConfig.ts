import { ConnectionOptions } from 'typeorm';

import * as entities from './entities';

export default {
  type: 'sqlite',
  synchronize: true,
  logging: false,
  entities: Object.values(entities),
  database: process.env.DATABASE,
} as ConnectionOptions;
