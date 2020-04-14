import { createConnection } from 'typeorm';
import { Platform, User, Channel, Command, StaticCommand } from './modules';
import { supi } from './modules/GotInstances';

createConnection().then(async connection => {
  Channel.init(connection);
  User.init(connection);

  await StaticCommand.init(connection);

  Command.reload();
  Platform.reload();

  setInterval(async () => await supi.put('bot-program/bot/active'), 36e5);
});
