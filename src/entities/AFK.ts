import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class AFK {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: Date.now() })
  start: Date;

  @Column({ nullable: true })
  end?: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  message?: string;
}
