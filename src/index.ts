import { createConnection } from 'typeorm';
import { Platform, User, Channel, Command, StaticCommand } from './modules';

createConnection().then(async connection => {
  await User.reload(connection);
  await Channel.reload(connection);
  await StaticCommand.reload(connection);

  Command.reload();
  Platform.reload();
});
