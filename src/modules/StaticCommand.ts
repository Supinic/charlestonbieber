import { EntityManager } from 'typeorm';
import { StaticCommand as SCEntity } from '../entities';

export class StaticCommand {
  static commands: SCEntity[];

  static async init(manager: EntityManager) {
    this.commands = await manager.find(SCEntity);
  }

  static get(identifier: string): SCEntity {
    return this.commands.find(i => i.name === identifier);
  }
}
