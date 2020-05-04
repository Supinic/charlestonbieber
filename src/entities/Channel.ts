import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Platform, BanphraseTypes } from '../modules';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  platform: Platform.Names;

  @Column()
  platformID: string;

  @Column({ default: process.env.DEFAULT_PREFIX })
  prefix: string;

  @Column()
  live: boolean;

  @Column()
  viewcount: number;

  @Column({ nullable: true })
  banphraseType?: BanphraseTypes;

  @Column({ nullable: true })
  banphraseURL?: string;
}
