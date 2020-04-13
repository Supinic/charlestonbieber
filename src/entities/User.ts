import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PlatformNames } from '../modules';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  platform: PlatformNames;

  @Column()
  platformID: string;

  @Column({ type: 'simple-array', nullable: true })
  location: [number, number] | [];
}
