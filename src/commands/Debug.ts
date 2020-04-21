import { Script, createContext } from 'vm';
import { Input, Output, Permissions, Command } from '../modules';

import * as modules from '../modules';
import * as entities from '../entities';

export class Debug extends Command {
  name = 'debug';
  aliases = ['eval'];
  cooldown = 0;
  description = 'Runs JavaScript and returns the result.';
  syntax = ['code'];
  permission = Permissions.OWNER;
  data = null;

  async execute(msg: Input, ...args: string[]): Promise<Output> {
    try {
      const script = new Script(args.join(' '));
      const context = createContext({ msg, modules, entities });
      let reply = await script.runInNewContext(context, { timeout: 5000 });

      try {
        reply = JSON.stringify(reply);
      } catch {
        reply = String(reply);
      }

      return { reply };
    } catch (e) {
      return { reply: String(e) };
    }
  }
}
