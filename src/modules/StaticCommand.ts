import { StaticCommand as SCEntity } from '../entities';
import { Connection } from 'typeorm';

export class StaticCommand {
  static commands: SCEntity[];

  static async reload(connection: Connection) {
    this.commands = await connection.manager.find(SCEntity);
  }

  static get(identifier: string): SCEntity {
    return this.commands.find(i => i.name === identifier);
  }
}
