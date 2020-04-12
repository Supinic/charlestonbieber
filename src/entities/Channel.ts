import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  platform: string;

  @Column()
  platformID: string;

  @Column()
  live: boolean;

  @Column()
  viewers: number;
}
