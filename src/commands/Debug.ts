import { Script, createContext } from 'vm';
import { Command } from '../modules';

import * as modules from '../modules';
import * as entities from '../entities';

export class Debug extends Command {
  name = 'debug';
  aliases = ['eval'];
  cooldown = 0;
  description = 'Runs JavaScript and returns the result.';
  syntax = ['code'];
  permission = Command.Permissions.ADMIN;
  data = null;

  async execute(msg: Command.Input, ...args: string[]): Promise<Command.Output> {
    try {
      const script = new Script(`(async () => { ${args.join(' ')} })()`);
      const context = createContext({
        cb: { ...modules, ...entities },
        msg,
      });
      const reply = await script.runInNewContext(context, { timeout: 5000 });

      return { reply: String(reply) };
    } catch (e) {
      return { reply: String(e) };
    }
  }
}
