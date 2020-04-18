import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class StaticCommand {
  @PrimaryColumn()
  name: string;

  @Column()
  response: string;

  @Column()
  cooldown: number;
}
