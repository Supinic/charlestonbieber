import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StaticCommand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  response: string;

  @Column()
  cooldown: number;
}
