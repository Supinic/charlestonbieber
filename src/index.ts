import { createConnection } from 'typeorm';
import { Platform, Command, StaticCommandManager } from './modules';
import { supi } from './modules/GotInstances';
import ormConfig from './ormConfig';

createConnection(ormConfig).then(async ({ manager }) => {
  await StaticCommandManager.init(manager);

  Command.reload();
  Platform.reload();

  setInterval(async () => await supi.put('bot-program/bot/active'), 60 * 60 * 1000);
});
