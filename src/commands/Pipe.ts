import { Command, CooldownManager, Cooldown } from '../modules';

export class Pipe extends Command {
  name = 'pipe';
  aliases = [];
  description = 'Allows users pipe the result of one command to another command';
  syntax = ['commands'];
  cooldown = null;
  data = null;
  permission = Command.Permissions.EVERYONE;

  async execute(msg: Command.Input, ...args: string[]): Promise<Command.Output> {
    const commands = args
      .join(' ')
      .split('|')
      .map(i => i.trim().split(' '));
    let result: Command.Output = { reply: '' };

    for (const [cmd, ...cmdArgs] of commands) {
      const command = Command.get(cmd);
      const cooldown: Cooldown = {
        executedBy: msg.type === 'message' ? msg.channel : msg.user,
        command,
      };

      if (CooldownManager.has(cooldown)) {
        return {
          reply: `Command ${command.name} failed: cooldown`,
          success: false,
        };
      }

      if (command === this) {
        return {
          reply: 'You cannot pipe command pipe',
          success: false,
          cooldown: 5000,
        };
      }

      if (!cmd) {
        return {
          reply: `Could not find command: ${cmd}`,
          success: false,
          cooldown: 5000,
        };
      }

      const notPermitted = command.checkPermission(msg);

      if (notPermitted) {
        return {
          reply: `You cannot use command ${command.name}`,
          success: false,
          cooldown: 5000,
        };
      }

      result = await command.execute(msg, result.reply, ...cmdArgs);

      if ('success' in result && !result.success) {
        return {
          reply: `Command ${command.name} failed: ${result.reply}`,
          cooldown: result.cooldown,
          success: false,
        };
      }

      if (result.cooldown) {
        cooldown.cooldown = result.cooldown;
      }

      CooldownManager.add(cooldown);
    }

    return result;
  }
}
