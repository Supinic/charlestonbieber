import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Platform } from '../modules';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  platform: Platform.Names;

  @Column()
  platformID: string;

  @Column({ type: 'simple-array', nullable: true })
  location: [number, number] | [];
}
