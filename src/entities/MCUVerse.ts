import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MCUVerse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieID: 'blackpanther' | 'captainmarvel' | 'doctorstrange' | 'antman1' | 'avengers1' | 'captainamerica1' | 'guardians1' | 'ironman1' | 'spiderman1' | 'thor1' | 'antman2' | 'avengers2' | 'captainamerica2' | 'guardians2' | 'ironman2' | 'thor2' | 'avengers3' | 'captainamerica3' | 'ironman3' | 'thor3' | 'avengers4' | 'hulk';

  @Column()
  movieTitle: 'Black Panther' | 'Captain Marvel' | 'Doctor Strange' | 'I Ant-Man' | 'I Avengers' | 'I Captain America' | 'I Guardians of the Galaxy' | 'I Iron Man' | 'I Spider-Man' | 'I Thor' | 'II Ant-Man' | 'II Avengers' | 'II Captain America' | 'II Guardians of the Galaxy' | 'II Iron Man' | 'II Thor' | 'III Avengers' | 'III Captain America' | 'III Iron Man' | 'III Thor' | 'IV Avengers' | 'The Incredible Hulk';

  @Column()
  sub: string;

  @Column()
  time: string;
}
