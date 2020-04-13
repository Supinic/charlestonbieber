import { createConnection } from 'typeorm';
import { Platform, User, Channel, Command, StaticCommand } from './modules';
import { supi } from 'modules/GotInstances';

createConnection().then(async connection => {
  await User.reload(connection);
  await Channel.reload(connection);
  await StaticCommand.reload(connection);

  Command.reload();
  Platform.reload();
});

setInterval(async () => await supi.put('bot-program/bot/active'), 36e5);
