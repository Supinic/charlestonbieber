import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Channel } from './Channel';
import { Platform } from '../modules';

@Entity()
export class Banphrase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel, { nullable: true })
  channel?: Channel;

  @Column({ nullable: true })
  platform: Platform.Names;

  @Column()
  type: Banphrase.Types;

  @Column({ default: false })
  caseSensitive: boolean;

  @Column()
  banphrase: string;

  @Column({ default: 'Banphrase' })
  replaceWith: string;
}

export namespace Banphrase {
  export enum Types {
    REGEX = 'regex',
    CONTAINS = 'contains',
  }
}
