import { createConnection, getConnectionOptions } from 'typeorm';
import { Platform, Command, StaticCommandManager } from './modules';
import { supi } from './modules/GotInstances';
import * as entities from './entities';

getConnectionOptions().then(async (connectionOptions) => {
  const { manager } = await createConnection({
    ...connectionOptions,
    entities: Object.values(entities),
  });

  await StaticCommandManager.init(manager);

  await Command.load();
  await Platform.load();

  setInterval(async () => await supi.put('bot-program/bot/active'), 60 * 60 * 1000);
});
