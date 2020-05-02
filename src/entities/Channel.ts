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

  @Column()
  live: boolean;

  @Column()
  viewers: number;

  @Column({ nullable: true })
  banphraseType?: BanphraseTypes;

  @Column({ nullable: true })
  banphraseURL?: string;
}
