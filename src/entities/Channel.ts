import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PlatformNames } from '../modules';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  platform: PlatformNames;

  @Column()
  platformID: string;

  @Column()
  live: boolean;

  @Column()
  viewers: number;
}
