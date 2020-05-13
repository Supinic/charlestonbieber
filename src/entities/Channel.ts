import {
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { User } from '.';
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

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  broadcaster?: User;

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
