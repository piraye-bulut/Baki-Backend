import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;  

  @Column()
  text: string;

  @Column()
  date: string;

  @Column()
  poemId: number;

  @Column()
  poemType: string;
}