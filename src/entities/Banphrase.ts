import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Channel } from './Channel';

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

  @Column()
  type: BanphraseTypes;

  @Column({ default: false })
  caseSensitive: boolean;

  @Column()
  banphrase: string;

  @Column({ default: 'Banphrase' })
  replaceWith: string;
}
