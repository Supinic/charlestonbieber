import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

export enum SuggestionStates {
  ACCEPTED = 'accepted',
  DONE = 'done',
  NEW = 'new',
  NOT_A_SUGGESTION = 'not a suggestion',
  REJECTED = 'rejected',
}

@Entity()
export class Suggestion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  suggestion: string;

  @Column()
  date: Date;

  @Column({ default: SuggestionStates.NEW })
  state?: SuggestionStates;

  @Column({ nullable: true })
  notes?: string;
}
