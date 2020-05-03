import { Channel, User } from '../entities';
import { Command } from './Command';

export interface Cooldown {
  executedBy: Channel | User;
  command: Command;
  cooldown?: number;
}

export class CooldownManager {
  private static cooldowns = new Set<string>();

  static has({ executedBy, command: { name } }: Cooldown): boolean {
    return this.cooldowns.has([executedBy.id, name].join());
  }

  static add(cooldown: Cooldown): void {
    if (this.has(cooldown)) {
      throw new Error('Cooldown already exists');
    }

    const cooldownString = [cooldown.executedBy.id, cooldown.command.name].join();
    this.cooldowns.add(cooldownString);
    setTimeout(() => this.cooldowns.delete(cooldownString), cooldown.cooldown ?? cooldown.command.cooldown);
  }
}
