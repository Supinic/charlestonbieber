import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  platform: string;

  @Column()
  platformID: string;

  @Column('simple-array')
  location: [number, number] | [];
}
