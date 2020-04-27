import { createConnection } from 'typeorm';
import { Platform, User, Channel, Command, StaticCommand } from './modules';
import { supi } from './modules/GotInstances';
import ormConfig from './ormConfig';

createConnection(ormConfig).then(async ({ manager }) => {
  await StaticCommand.init(manager);

  Command.reload();
  Platform.reload();

  setInterval(async () => await supi.put('bot-program/bot/active'), 60 * 60 * 1000);
});
