import { EntityManager } from 'typeorm';
import { StaticCommand } from '../entities';

export class StaticCommandManager {
  static commands: StaticCommand[];

  static async init(manager: EntityManager) {
    this.commands = await manager.find(StaticCommand);
  }

  static get(identifier: string): StaticCommand {
    return this.commands.find(i => i.name === identifier);
  }
}
