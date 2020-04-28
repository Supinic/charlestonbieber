import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Channel } from './Channel';
import { PlatformNames } from '../modules';

export enum BanphraseTypes {
  REGEX = 'regex',
  CONTAINS = 'contains',
}

@Entity()
export class Banphrase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Channel, { nullable: true })
  channel?: Channel;

  @Column({ nullable: true })
  platform: PlatformNames;

  @Column()
  type: BanphraseTypes;

  @Column({ default: false })
  caseSensitive: boolean;

  @Column()
  banphrase: string;

  @Column({ default: 'Banphrase' })
  replaceWith: string;
}
