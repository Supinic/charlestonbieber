import { createConnection } from 'typeorm';
import { Platform, User, Channel, Command, StaticCommand } from './modules';
import { supi } from './modules/GotInstances';

createConnection().then(async ({ manager }) => {
  Channel.init(manager);
  User.init(manager);

  await StaticCommand.init(manager);

  Command.reload();
  Platform.reload();

  setInterval(async () => await supi.put('bot-program/bot/active'), 36e5);
});
